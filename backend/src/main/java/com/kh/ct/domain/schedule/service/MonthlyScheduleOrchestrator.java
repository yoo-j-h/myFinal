package com.kh.ct.domain.schedule.service;

import com.kh.ct.domain.emp.entity.Emp;
import com.kh.ct.domain.emp.repository.EmpRepository;
import com.kh.ct.domain.health.entity.EmpHealth;
import com.kh.ct.domain.health.repository.EmpHealthRepository;
import com.kh.ct.domain.schedule.entity.AllSchedule;
import com.kh.ct.domain.schedule.entity.EmpFlySchedule;
import com.kh.ct.domain.schedule.entity.EmpSchedule;
import com.kh.ct.domain.schedule.entity.FlySchedule;
import com.kh.ct.domain.schedule.repository.AllScheduleRepository;
import com.kh.ct.domain.schedule.repository.EmpFlyScheduleRepository;
import com.kh.ct.domain.schedule.repository.EmpScheduleRepository;
import com.kh.ct.domain.schedule.repository.FlyScheduleRepository;
import com.kh.ct.global.common.CommonEnums;
import com.kh.ct.global.exception.BusinessException;
import jakarta.persistence.EntityManager;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * 월별 스케줄 자동 배정 오케스트레이터
 * 
 * 역할:
 * 1. 전체 배정 프로세스 조율
 * 2. 엔진별 배정 실행
 * 3. 검증 및 결과 집계
 * 4. DB 저장
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MonthlyScheduleOrchestrator {
    
    private final EmpRepository empRepository;
    private final EmpHealthRepository empHealthRepository;
    private final EmpScheduleRepository empScheduleRepository;
    private final EmpFlyScheduleRepository empFlyScheduleRepository;
    private final AllScheduleRepository allScheduleRepository;
    private final FlyScheduleRepository flyScheduleRepository;
    private final FlightAssignmentEngine flightAssignmentEngine;
    private final StandbyAssignmentEngine standbyAssignmentEngine;
    private final ShiftAssignmentEngine shiftAssignmentEngine;
    private final DailyFillEngine dailyFillEngine;
    private final ValidationEngine validationEngine;
    private final EntityManager entityManager;
    
    /**
     * 월별 스케줄 자동 배정 실행
     * 
     * @param yearMonth 배정할 년월 (YYYY-MM)
     * @param airlineId 항공사 ID
     * @return 배정 결과 (통계 및 violations 포함)
     */
    @Transactional(noRollbackFor = {
            org.springframework.orm.ObjectOptimisticLockingFailureException.class,
            org.springframework.dao.DataIntegrityViolationException.class
    })
    public MonthlyAssignmentResult generateMonthlySchedules(YearMonth yearMonth, Long airlineId) {
        log.info("========================================");
        log.info("월별 스케줄 자동 배정 시작");
        log.info("  - yearMonth: {}", yearMonth);
        log.info("  - airlineId: {}", airlineId);
        log.info("========================================");
        
        // 0. 기존 일정 삭제 (해당 월의 일정만)
        deleteExistingSchedules(yearMonth, airlineId);
        
        // 1. 직원 상태 인메모리 로드
        Map<String, EmployeeState> employeeStates = loadEmployeeStates(yearMonth, airlineId);
        
        if (employeeStates.isEmpty()) {
            throw BusinessException.badRequest("배정할 직원이 없습니다.");
        }
        
        log.info("직원 상태 로드 완료 - 총 {}명", employeeStates.size());
        
        // 2. 비행 일정 로드
        LocalDateTime startDate = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime endDate = yearMonth.atEndOfMonth().atTime(23, 59, 59).plusSeconds(1);
        long flightCount = flyScheduleRepository.countByFlyStartTimeBetween(airlineId, startDate, endDate);
        log.info("해당 월 항공편 수: {}건", flightCount);
        
        // ========================================
        // Phase 1: 비행 배정 (emp_fly_schedule)
        // ========================================
        log.info("========================================");
        log.info("✅ [Phase 1] 비행 일정 배정 시작");
        log.info("========================================");
        List<ScheduleAssignmentResult> flightResults = flightAssignmentEngine.assignSchedules(
                yearMonth, employeeStates, airlineId
        );
        
        // Phase 1 결과 저장 (emp_fly_schedule)
        int phase1SavedCount = saveFlightSchedules(flightResults);
        
        log.info("Phase 1 완료 - 비행 배정: {}건, 저장: {}건", 
                flightResults.size(), phase1SavedCount);
        
        // ========================================
        // Phase 2: 일일 상태 채우기 (emp_schedule)
        // ========================================
        log.info("========================================");
        log.info("✅ [Phase 2] 일일 상태 채우기 시작");
        log.info("========================================");
        
        // 2-1. 교대 근무 배정 (GROUND_STAFF, MAINTENANCE)
        log.info("----------------------------------------");
        log.info("✅ [Phase 2-1] 교대 근무 배정 시작");
        log.info("----------------------------------------");
        List<ScheduleAssignmentResult> shiftResults = shiftAssignmentEngine.assignSchedules(
                yearMonth, employeeStates, airlineId
        );
        
        log.info("교대 근무 배정 완료 - 배정 수: {}건", shiftResults.size());
        
        // 2-2. 일일 상태 채우기 (STANDBY/OFF)
        log.info("----------------------------------------");
        log.info("✅ [Phase 2-2] 일일 상태 채우기 시작");
        log.info("----------------------------------------");
        List<ScheduleAssignmentResult> dailyFillResults = dailyFillEngine.fillDailyStatus(
                yearMonth, employeeStates, airlineId
        );
        
        log.info("일일 상태 채우기 완료 - 배정 수: {}건", dailyFillResults.size());
        
        // Phase 2 결과 통합
        List<ScheduleAssignmentResult> phase2Results = new ArrayList<>();
        phase2Results.addAll(shiftResults);
        phase2Results.addAll(dailyFillResults);
        
        // Phase 2 결과 저장 (emp_schedule)
        int phase2SavedCount = saveOtherSchedules(phase2Results);
        
        log.info("Phase 2 완료 - 교대/일일 상태: {}건, 저장: {}건", 
                phase2Results.size(), phase2SavedCount);
        
        // 모든 배정 결과 통합 (검증용)
        List<ScheduleAssignmentResult> allResults = new ArrayList<>();
        allResults.addAll(flightResults);
        allResults.addAll(phase2Results);
        
        log.info("========================================");
        log.info("✅ [4단계] 배정 결과 통합");
        log.info("  - 비행 일정: {}건", flightResults.size());
        log.info("  - 교대 근무: {}건", shiftResults.size());
        log.info("  - 일일 상태 채우기: {}건", dailyFillResults.size());
        log.info("  - 총 배정 수: {}건", allResults.size());
        log.info("========================================");
        
        // ========================================
        // 검증 엔진 실행
        // ========================================
        log.info("========================================");
        log.info("✅ [검증] 제약 조건 검증 시작");
        log.info("========================================");
        ValidationEngine.ValidationResult validationResult = validationEngine.validateAssignments(
                allResults, employeeStates, yearMonth
        );
        
        // 추가 검증: flight별 assigned_cnt == crew_count, 지상직 날짜별 PART1/2/3 각각 3명
        List<ValidationEngine.Violation> additionalViolations = performAdditionalValidations(
                allResults, employeeStates, yearMonth, airlineId
        );
        validationResult.getViolations().addAll(additionalViolations);
        
        log.info("제약 조건 검증 완료 - violations: {}건", validationResult.getViolations().size());
        if (!validationResult.getViolations().isEmpty()) {
            log.warn("⚠️ 제약 조건 위반 발견:");
            validationResult.getViolations().forEach(v -> 
                log.warn("  - [{}] {}: {}", v.getType(), v.getEmpId(), v.getMessage())
            );
        }
        
        log.info("========================================");
        log.info("월별 스케줄 자동 배정 완료");
        log.info("  - Phase 1 (비행): {}건 배정, {}건 저장", flightResults.size(), phase1SavedCount);
        log.info("  - Phase 2 (일일 상태): {}건 배정, {}건 저장", phase2Results.size(), phase2SavedCount);
        log.info("  - 총 배정 수: {}건", allResults.size());
        log.info("  - 총 저장 수: {}건", phase1SavedCount + phase2SavedCount);
        log.info("  - 제약 조건 위반: {}건", validationResult.getViolations().size());
        log.info("========================================");
        
        // 결과 집계
        return MonthlyAssignmentResult.builder()
                .totalAssignedFlights(flightResults.size())
                .totalShiftAssignments(shiftResults.size())
                .totalStandbyAssignments(dailyFillResults.size())
                .totalAssignments(allResults.size())
                .savedCount(phase1SavedCount + phase2SavedCount)
                .violations(validationResult.getViolations())
                .isValid(validationResult.isValid())
                .build();
    }
    
    /**
     * 직원 상태 로드 (인메모리)
     */
    private Map<String, EmployeeState> loadEmployeeStates(YearMonth yearMonth, Long airlineId) {
        log.info("직원 상태 로드 시작 - airlineId: {}", airlineId);
        
        // 직원 조회 (기존 ScheduleGenerationService와 동일한 방식)
        List<Emp> allEmployees = empRepository.findByRoleAndAirlineId(null, airlineId);
        log.info("airlineId={} 필터 결과: {}명", airlineId, allEmployees.size());
        
        // 활성 직원 필터링
        List<Emp> employees = allEmployees.stream()
                .filter(emp -> emp.getEmpStatus() == com.kh.ct.global.common.CommonEnums.EmpStatus.Y)
                .collect(Collectors.toList());
        
        log.info("emp_status='Y' 필터 결과: {}명 (전체 {}명 중)", employees.size(), allEmployees.size());
        
        // 전월 말까지의 근무 기록 로드 (연속 근무일 계산용)
        YearMonth previousMonth = yearMonth.minusMonths(1);
        LocalDateTime previousMonthStart = previousMonth.atDay(1).atStartOfDay();
        LocalDateTime currentMonthStart = yearMonth.atDay(1).atStartOfDay();
        
        Map<String, EmployeeState> states = new HashMap<>();
        
        for (Emp emp : employees) {
            // 건강 점수 조회 (기존 ScheduleGenerationService와 동일한 방식)
            Integer healthScore = empHealthRepository
                    .findTopByEmpId_EmpIdOrderByEmpHealthIdDesc(emp.getEmpId())
                    .map(EmpHealth::getHealthPoint)
                    .orElse(50);
            
            // 전월 말 근무 기록 조회
            List<EmpSchedule> recentSchedules = empScheduleRepository.findByEmpIdAndMonth(
                    emp.getEmpId(), previousMonthStart, currentMonthStart
            );
            
            // EmployeeState 생성
            EmployeeState state = EmployeeState.builder()
                    .empId(emp.getEmpId())
                    .empName(emp.getEmpName())
                    .healthScore(healthScore)
                    .airlineId(emp.getAirlineId() != null ? emp.getAirlineId().getAirlineId() : null)
                    .role(emp.getRole())
                    .build();
            
            // 전월 말 근무 기록 추가
            for (EmpSchedule es : recentSchedules) {
                if (es.getScheduleId() != null && es.getScheduleId().getStartDate() != null) {
                    EmployeeState.WorkRecord record = EmployeeState.WorkRecord.builder()
                            .workDate(es.getScheduleId().getStartDate().toLocalDate())
                            .scheduleCode(es.getScheduleCode())
                            .startTime(es.getScheduleId().getStartDate())
                            .endTime(es.getScheduleId().getEndDate())
                            .isNightShift(isNightShift(es.getScheduleId().getStartDate(), 
                                    es.getScheduleId().getEndDate()))
                            .build();
                    state.getRecentWorkRecords().add(record);
                    
                    // 마지막 근무 종료 시간 업데이트
                    if (es.getScheduleId().getEndDate() != null) {
                        if (state.getLastWorkEndTime() == null || 
                            es.getScheduleId().getEndDate().isAfter(state.getLastWorkEndTime())) {
                            state.setLastWorkEndTime(es.getScheduleId().getEndDate());
                        }
                    }
                }
            }
            
            states.put(emp.getEmpId(), state);
        }
        
        log.info("직원 상태 로드 완료 - {}명", states.size());
        return states;
    }
    
    /**
     * 야간 근무 여부 확인
     */
    private boolean isNightShift(LocalDateTime start, LocalDateTime end) {
        if (start == null || end == null) {
            return false;
        }
        int startHour = start.getHour();
        int endHour = end.getHour();
        return (startHour >= 22 || startHour < 6) || (endHour < 6);
    }
    
    /**
     * 기존 일정 삭제
     * 
     * 요구사항:
     * - 해당 월 fly_schedule_id들에 대한 emp_fly_schedule만 먼저 삭제하고 재배정
     * - 기타 일정(EmpSchedule)도 삭제
     */
    private void deleteExistingSchedules(YearMonth yearMonth, Long airlineId) {
        log.info("기존 일정 삭제 시작 - yearMonth: {}, airlineId: {}", yearMonth, airlineId);
        
        LocalDateTime startDate = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime endDate = yearMonth.atEndOfMonth().atTime(23, 59, 59).plusSeconds(1);
        
        // 1. 해당 월의 fly_schedule_id 목록 조회
        List<FlySchedule> flights = flyScheduleRepository.findByDateRange(airlineId, startDate, endDate);
        List<Long> flyScheduleIds = flights.stream()
                .map(FlySchedule::getFlyScheduleId)
                .collect(Collectors.toList());
        
        log.info("해당 월 비행편 수: {}건", flyScheduleIds.size());
        
        // 2. emp_fly_schedule 삭제 (해당 월 fly_schedule_id들에 대한 배정만 삭제)
        if (!flyScheduleIds.isEmpty()) {
            List<EmpFlySchedule> existingEmpFlySchedules = empFlyScheduleRepository.findByFlyScheduleIdIn(flyScheduleIds);
            if (!existingEmpFlySchedules.isEmpty()) {
                log.info("기존 emp_fly_schedule {}건 삭제 시작", existingEmpFlySchedules.size());
                empFlyScheduleRepository.deleteAll(existingEmpFlySchedules);
                log.info("기존 emp_fly_schedule 삭제 완료");
            } else {
                log.info("삭제할 기존 emp_fly_schedule이 없습니다.");
            }
        }
        
        // 3. 기타 일정(EmpSchedule) 삭제
        List<EmpSchedule> existingSchedules = empScheduleRepository.findByAirlineIdAndMonth(
                airlineId, startDate, endDate
        );
        
        if (!existingSchedules.isEmpty()) {
            log.info("기존 EmpSchedule {}건 삭제 시작", existingSchedules.size());
            empScheduleRepository.deleteAll(existingSchedules);
            log.info("기존 EmpSchedule 삭제 완료");
        } else {
            log.info("삭제할 기존 EmpSchedule이 없습니다.");
        }
        
        entityManager.flush();
        entityManager.clear();
        
        log.info("기존 일정 삭제 완료");
    }
    
    /**
     * 추가 검증 수행
     * - flight별 assigned_cnt == crew_count
     * - 지상직 날짜별 PART1/2/3 각각 3명
     */
    private List<ValidationEngine.Violation> performAdditionalValidations(
            List<ScheduleAssignmentResult> allResults,
            Map<String, EmployeeState> employeeStates,
            YearMonth yearMonth,
            Long airlineId
    ) {
        List<ValidationEngine.Violation> violations = new ArrayList<>();
        
        // 1. flight별 assigned_cnt == crew_count 검증
        LocalDateTime startDate = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime endDate = yearMonth.plusMonths(1).atDay(1).atStartOfDay(); // 다음 달 1일 00:00:00까지
        List<FlySchedule> flights = flyScheduleRepository.findByDateRange(airlineId, startDate, endDate);
        
        log.info("========================================");
        log.info("✅ [검증] 비행편별 배정 인원 검증 시작");
        log.info("  - 검증 대상 비행편 수: {}건", flights.size());
        log.info("========================================");
        
        // 진단 통계
        int fullyAssignedCount = 0;
        int unassignedCount = 0;
        int insufficientCount = 0;
        int excessiveCount = 0;
        int invalidCrewCountCount = 0;
        List<String> unassignedFlights = new ArrayList<>();
        List<String> insufficientFlights = new ArrayList<>();
        
        for (FlySchedule flight : flights) {
            if (flight.getCrewCount() == null || flight.getCrewCount() < 2) {
                invalidCrewCountCount++;
                log.warn("⚠️ 비행편 {} (flyScheduleId: {}) crew_count가 유효하지 않음: {} (최소 2명 필요)",
                    flight.getFlightNumber(), flight.getFlyScheduleId(), 
                    flight.getCrewCount() != null ? flight.getCrewCount() : "null");
                continue;
            }
            
            int requiredCount = flight.getCrewCount().intValue();
            
            // 해당 flight에 배정된 직원 수 계산 (FLIGHT 일정만)
            long assignedCount = allResults.stream()
                .filter(r -> r.getFlyScheduleId() != null && 
                            r.getFlyScheduleId().equals(flight.getFlyScheduleId()) &&
                            "FLIGHT".equals(r.getScheduleCode()))
                .count();
            
            // 배정 상태 분류
            if (assignedCount == 0) {
                unassignedCount++;
                unassignedFlights.add(String.format("%s (flyScheduleId: %d, crew_count: %d)", 
                    flight.getFlightNumber(), flight.getFlyScheduleId(), requiredCount));
                violations.add(ValidationEngine.Violation.builder()
                    .type(ValidationEngine.ViolationType.TIME_CONFLICT)
                    .empId(null)
                    .message(String.format("비행편 %s (flyScheduleId: %d) 미배정 - 필요: %d명, 배정: 0명",
                        flight.getFlightNumber(), flight.getFlyScheduleId(), requiredCount))
                    .build());
            } else if (assignedCount < requiredCount) {
                insufficientCount++;
                insufficientFlights.add(String.format("%s (flyScheduleId: %d, 필요: %d명, 배정: %d명)", 
                    flight.getFlightNumber(), flight.getFlyScheduleId(), requiredCount, assignedCount));
                violations.add(ValidationEngine.Violation.builder()
                    .type(ValidationEngine.ViolationType.TIME_CONFLICT)
                    .empId(null)
                    .message(String.format("비행편 %s (flyScheduleId: %d) 배정 인원 부족 - 필요: %d명, 배정: %d명",
                        flight.getFlightNumber(), flight.getFlyScheduleId(), requiredCount, assignedCount))
                    .build());
            } else if (assignedCount > requiredCount) {
                excessiveCount++;
                violations.add(ValidationEngine.Violation.builder()
                    .type(ValidationEngine.ViolationType.TIME_CONFLICT)
                    .empId(null)
                    .message(String.format("비행편 %s (flyScheduleId: %d) 배정 인원 초과 - 필요: %d명, 배정: %d명",
                        flight.getFlightNumber(), flight.getFlyScheduleId(), requiredCount, assignedCount))
                    .build());
            } else {
                fullyAssignedCount++;
            }
        }
        
        // 진단 리포트 출력
        log.info("========================================");
        log.info("✅ [검증] 비행편별 배정 인원 검증 결과");
        log.info("  - 전체 비행편: {}건", flights.size());
        log.info("  - ✅ 완전 배정: {}건", fullyAssignedCount);
        log.info("  - ❌ 미배정: {}건", unassignedCount);
        log.info("  - ⚠️ 부족 배정: {}건", insufficientCount);
        log.info("  - ⚠️ 초과 배정: {}건", excessiveCount);
        log.info("  - ⚠️ 유효하지 않은 crew_count: {}건", invalidCrewCountCount);
        log.info("========================================");
        
        // 미배정 비행편 목록 출력
        if (!unassignedFlights.isEmpty()) {
            log.warn("========================================");
            log.warn("❌ [진단] 미배정 비행편 목록 (assigned_cnt=0)");
            log.warn("========================================");
            unassignedFlights.forEach(flight -> log.warn("  - {}", flight));
            log.warn("========================================");
        }
        
        // 부족 배정 비행편 목록 출력
        if (!insufficientFlights.isEmpty()) {
            log.warn("========================================");
            log.warn("⚠️ [진단] 부족 배정 비행편 목록 (assigned_cnt < crew_count)");
            log.warn("========================================");
            insufficientFlights.forEach(flight -> log.warn("  - {}", flight));
            log.warn("========================================");
        }
        
        // 2. 지상직 날짜별 PART1/2/3 각각 3명 검증
        LocalDate monthStart = yearMonth.atDay(1);
        LocalDate monthEnd = yearMonth.atEndOfMonth();
        final int REQUIRED_STAFF_PER_SHIFT = 3;
        
        Map<com.kh.ct.global.common.CommonEnums.Role, Map<String, EmployeeState>> roleGroups = new HashMap<>();
        for (Map.Entry<String, EmployeeState> entry : employeeStates.entrySet()) {
            com.kh.ct.global.common.CommonEnums.Role role = entry.getValue().getRole();
            if (role == com.kh.ct.global.common.CommonEnums.Role.GROUND_STAFF || 
                role == com.kh.ct.global.common.CommonEnums.Role.MAINTENANCE) {
                roleGroups.computeIfAbsent(role, k -> new HashMap<>()).put(entry.getKey(), entry.getValue());
            }
        }
        
        for (Map.Entry<com.kh.ct.global.common.CommonEnums.Role, Map<String, EmployeeState>> roleGroup : roleGroups.entrySet()) {
            com.kh.ct.global.common.CommonEnums.Role role = roleGroup.getKey();
            
            for (LocalDate date = monthStart; !date.isAfter(monthEnd); date = date.plusDays(1)) {
                // effectively final 변수로 복사 (람다 표현식에서 사용하기 위해)
                final LocalDate currentDate = date;
                
                // 날짜별 PART1/2/3 배정 수 계산
                long part1Count = allResults.stream()
                    .filter(r -> "SHIFT_D".equals(r.getScheduleCode()) &&
                                r.getStartTime() != null &&
                                r.getStartTime().toLocalDate().equals(currentDate))
                    .filter(r -> {
                        EmployeeState state = employeeStates.get(r.getEmpId());
                        return state != null && state.getRole() == role;
                    })
                    .count();
                
                long part2Count = allResults.stream()
                    .filter(r -> "SHIFT_E".equals(r.getScheduleCode()) &&
                                r.getStartTime() != null &&
                                r.getStartTime().toLocalDate().equals(currentDate))
                    .filter(r -> {
                        EmployeeState state = employeeStates.get(r.getEmpId());
                        return state != null && state.getRole() == role;
                    })
                    .count();
                
                long part3Count = allResults.stream()
                    .filter(r -> "SHIFT_N".equals(r.getScheduleCode()) &&
                                r.getStartTime() != null &&
                                r.getStartTime().toLocalDate().equals(currentDate))
                    .filter(r -> {
                        EmployeeState state = employeeStates.get(r.getEmpId());
                        return state != null && state.getRole() == role;
                    })
                    .count();
                
                if (part1Count != REQUIRED_STAFF_PER_SHIFT || 
                    part2Count != REQUIRED_STAFF_PER_SHIFT || 
                    part3Count != REQUIRED_STAFF_PER_SHIFT) {
                    violations.add(ValidationEngine.Violation.builder()
                        .type(ValidationEngine.ViolationType.TIME_CONFLICT) // 임시로 TIME_CONFLICT 사용
                        .empId(null)
                        .message(String.format("날짜 %s 직군 %s 교대 배정 불일치 - PART1: %d/%d, PART2: %d/%d, PART3: %d/%d",
                            date, role, part1Count, REQUIRED_STAFF_PER_SHIFT,
                            part2Count, REQUIRED_STAFF_PER_SHIFT,
                            part3Count, REQUIRED_STAFF_PER_SHIFT))
                        .build());
                }
            }
        }
        
        return violations;
    }
    
    /**
     * 배정 결과 일괄 저장
     * 
     * 변경사항:
     * - FLIGHT 일정: EmpFlySchedule에만 저장 (AllSchedule/EmpSchedule 제거)
     * - 기타 일정(STANDBY, OFF, SHIFT 등): AllSchedule + EmpSchedule 저장
     */
    private int saveSchedulesBatch(List<ScheduleAssignmentResult> results) {
        if (results.isEmpty()) {
            return 0;
        }
        
        log.info("배정 결과 저장 시작 - {}건", results.size());
        
        // FLIGHT 일정과 기타 일정 분리
        List<ScheduleAssignmentResult> flightResults = results.stream()
                .filter(r -> "FLIGHT".equals(r.getScheduleCode()))
                .collect(Collectors.toList());
        
        List<ScheduleAssignmentResult> otherResults = results.stream()
                .filter(r -> !"FLIGHT".equals(r.getScheduleCode()))
                .collect(Collectors.toList());
        
        log.info("일정 분류 - FLIGHT: {}건, 기타(STANDBY/OFF/SHIFT): {}건", 
                flightResults.size(), otherResults.size());
        
        int savedCount = 0;
        
        // 1. FLIGHT 일정: EmpFlySchedule에만 저장
        if (!flightResults.isEmpty()) {
            savedCount += saveFlightSchedules(flightResults);
        }
        
        // 2. 기타 일정: AllSchedule + EmpSchedule 저장
        if (!otherResults.isEmpty()) {
            savedCount += saveOtherSchedules(otherResults);
        }
        
        log.info("배정 결과 저장 완료 - 총 {}건 저장", savedCount);
        return savedCount;
    }
    
    /**
     * FLIGHT 일정 저장 (EmpFlySchedule에만 저장)
     */
    private int saveFlightSchedules(List<ScheduleAssignmentResult> flightResults) {
        log.info("========================================");
        log.info("✅ [FLIGHT 일정] EmpFlySchedule 저장 시작");
        log.info("  - FLIGHT 일정 수: {}건", flightResults.size());
        log.info("========================================");
        
        List<EmpFlySchedule> empFlySchedulesToSave = new ArrayList<>();
        int nullFlyScheduleIdCount = 0;
        int notFoundFlyScheduleCount = 0;
        int notFoundEmpCount = 0;
        int alreadyExistsCount = 0;
        
        for (ScheduleAssignmentResult result : flightResults) {
            if (result.getFlyScheduleId() == null) {
                nullFlyScheduleIdCount++;
                log.warn("FLIGHT 일정에 flyScheduleId가 null입니다 - empId: {}", result.getEmpId());
                continue;
            }
            
            if (result.getEmpId() == null) {
                log.warn("FLIGHT 일정에 empId가 null입니다 - flyScheduleId: {}", result.getFlyScheduleId());
                continue;
            }
            
            // Emp 찾기
            Optional<Emp> empOpt = empRepository.findById(result.getEmpId());
            if (!empOpt.isPresent()) {
                notFoundEmpCount++;
                log.warn("Emp를 찾을 수 없습니다 - empId: {}", result.getEmpId());
                continue;
            }
            
            Emp emp = empOpt.get();
            
            // FlySchedule 찾기
            Optional<FlySchedule> flyScheduleOpt = flyScheduleRepository.findById(result.getFlyScheduleId());
            if (!flyScheduleOpt.isPresent()) {
                notFoundFlyScheduleCount++;
                log.warn("FlySchedule을 찾을 수 없습니다 - flyScheduleId: {}", result.getFlyScheduleId());
                continue;
            }
            
            FlySchedule flySchedule = flyScheduleOpt.get();
            
            // 중복 체크
            List<EmpFlySchedule> existing = empFlyScheduleRepository.findByFlyScheduleIdAndEmpId(
                    result.getFlyScheduleId(), emp.getEmpId()
            );
            
            if (!existing.isEmpty()) {
                alreadyExistsCount++;
                log.debug("이미 EmpFlySchedule이 존재합니다 - flyScheduleId: {}, empId: {}",
                        result.getFlyScheduleId(), emp.getEmpId());
                continue;
            }
            
            // EmpFlySchedule 생성
            EmpFlySchedule empFlySchedule = EmpFlySchedule.builder()
                    .emp(emp)
                    .flySchedule(flySchedule)
                    .build();
            
            empFlySchedulesToSave.add(empFlySchedule);
        }
        
        log.info("========================================");
        log.info("✅ [FLIGHT 일정] EmpFlySchedule 저장 준비 완료");
        log.info("  - FLIGHT 일정 수: {}건", flightResults.size());
        log.info("  - flyScheduleId가 null인 경우: {}건", nullFlyScheduleIdCount);
        log.info("  - FlySchedule을 찾지 못한 경우: {}건", notFoundFlyScheduleCount);
        log.info("  - Emp를 찾지 못한 경우: {}건", notFoundEmpCount);
        log.info("  - 이미 존재하는 경우: {}건", alreadyExistsCount);
        log.info("  - 저장 대상: {}건", empFlySchedulesToSave.size());
        log.info("========================================");
        
        if (!empFlySchedulesToSave.isEmpty()) {
            try {
                List<EmpFlySchedule> savedEmpFlySchedules = saveEmpFlySchedulesBatch(empFlySchedulesToSave);
                log.info("✅ FLIGHT 일정 EmpFlySchedule 저장 완료 - {}건 저장됨", savedEmpFlySchedules.size());
                
                // 저장 후 진단: DB에서 실제 저장된 flight별 배정 수 확인
                Map<Long, Integer> dbFlightAssignmentCounts = new HashMap<>();
                for (EmpFlySchedule efs : savedEmpFlySchedules) {
                    if (efs.getFlySchedule() != null) {
                        Long flyScheduleId = efs.getFlySchedule().getFlyScheduleId();
                        dbFlightAssignmentCounts.put(flyScheduleId, 
                            dbFlightAssignmentCounts.getOrDefault(flyScheduleId, 0) + 1);
                    }
                }
                
                log.info("========================================");
                log.info("✅ [진단] DB 저장 후 flight별 배정 수");
                log.info("  - 배정된 flight 수: {}건", dbFlightAssignmentCounts.size());
                if (!dbFlightAssignmentCounts.isEmpty()) {
                    dbFlightAssignmentCounts.entrySet().stream()
                        .sorted(Map.Entry.<Long, Integer>comparingByValue().reversed())
                        .limit(10)
                        .forEach(e -> log.info("  - flyScheduleId {}: {}명 배정", e.getKey(), e.getValue()));
                }
                log.info("========================================");
                
                // 저장 검증 로그 (상세)
                if (log.isDebugEnabled()) {
                    for (EmpFlySchedule efs : savedEmpFlySchedules) {
                        log.debug("  - 저장된 EmpFlySchedule: empId={}, flyScheduleId={}, empFlyScheduleId={}",
                                efs.getEmp() != null ? efs.getEmp().getEmpId() : "null",
                                efs.getFlySchedule() != null ? efs.getFlySchedule().getFlyScheduleId() : "null",
                                efs.getEmpFlyScheduleId());
                    }
                }
                
                return savedEmpFlySchedules.size();
            } catch (Exception e) {
                log.error("❌ EmpFlySchedule 저장 중 오류 발생 - {}건 중 일부가 저장되지 않았을 수 있습니다. 오류: {}",
                        empFlySchedulesToSave.size(), e.getMessage(), e);
                // 전체 롤백 방지를 위해 예외를 다시 던지지 않음
                return 0;
            }
        } else {
            log.warn("⚠️ 저장할 EmpFlySchedule이 없습니다.");
            return 0;
        }
    }
    
    /**
     * 기타 일정 저장 (AllSchedule + EmpSchedule)
     */
    private int saveOtherSchedules(List<ScheduleAssignmentResult> otherResults) {
        log.info("========================================");
        log.info("✅ [기타 일정] AllSchedule + EmpSchedule 저장 시작");
        log.info("  - 기타 일정 수: {}건", otherResults.size());
        log.info("========================================");
        
        // AllSchedule 저장
        List<AllSchedule> allSchedules = otherResults.stream()
                .map(ScheduleAssignmentResult::getAllSchedule)
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());
        
        List<AllSchedule> savedAllSchedules = allScheduleRepository.saveAll(allSchedules);
        log.info("AllSchedule 저장 완료 - {}건", savedAllSchedules.size());
        
        // EmpSchedule 저장
        List<EmpSchedule> empSchedulesToSave = new ArrayList<>();
        for (ScheduleAssignmentResult result : otherResults) {
            if (result.getAllSchedule() == null || result.getEmpId() == null) {
                continue;
            }
            
            // 저장된 AllSchedule 찾기
            AllSchedule savedSchedule = savedAllSchedules.stream()
                    .filter(as -> as.getScheduleId().equals(result.getAllSchedule().getScheduleId()))
                    .findFirst()
                    .orElse(result.getAllSchedule());
            
            Emp emp = empRepository.findById(result.getEmpId())
                    .orElseThrow(() -> BusinessException.notFound("직원을 찾을 수 없습니다: " + result.getEmpId()));
            
            EmpSchedule empSchedule = EmpSchedule.builder()
                    .scheduleId(savedSchedule)
                    .empId(emp)
                    .scheduleCode(result.getScheduleCode())
                    .build();
            
            empSchedulesToSave.add(empSchedule);
        }
        
        List<EmpSchedule> savedEmpSchedules = empScheduleRepository.saveAll(empSchedulesToSave);
        log.info("EmpSchedule 저장 완료 - {}건", savedEmpSchedules.size());
        
        return savedEmpSchedules.size();
    }
    
    /**
     * EmpFlySchedule 배치 저장
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW,
            noRollbackFor = {org.springframework.dao.DataIntegrityViolationException.class})
    private List<EmpFlySchedule> saveEmpFlySchedulesBatch(List<EmpFlySchedule> empFlySchedules) {
        if (empFlySchedules.isEmpty()) {
            return new ArrayList<>();
        }
        
        try {
            return empFlyScheduleRepository.saveAll(empFlySchedules);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            log.warn("EmpFlySchedule 배치 저장 중 unique 제약 위반 - 개별 저장으로 전환");
            List<EmpFlySchedule> saved = new ArrayList<>();
            for (EmpFlySchedule efs : empFlySchedules) {
                try {
                    saved.add(empFlyScheduleRepository.save(efs));
                } catch (Exception ex) {
                    log.debug("EmpFlySchedule 중복 건너김 - empId: {}, flyScheduleId: {}",
                            efs.getEmp() != null ? efs.getEmp().getEmpId() : "null",
                            efs.getFlySchedule() != null ? efs.getFlySchedule().getFlyScheduleId() : "null");
                }
            }
            return saved;
        }
    }
    
    /**
     * 월별 배정 결과
     */
    @Getter
    @Builder
    public static class MonthlyAssignmentResult {
        private int totalAssignedFlights;        // 비행 일정 배정 수
        private int totalShiftAssignments;       // 교대 근무 배정 수
        private int totalStandbyAssignments;     // STANDBY/OFF 배정 수
        private int totalAssignments;            // 총 배정 수
        private int savedCount;                  // 저장된 일정 수
        private List<ValidationEngine.Violation> violations;  // 제약 조건 위반 목록
        private boolean isValid;                  // 검증 통과 여부
    }
}
