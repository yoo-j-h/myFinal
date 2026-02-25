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
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 월별 자동 스케줄 생성 서비스
 * AIR OPS(비행 중심) 및 GROUND OPS(교대 중심) 스케줄을 자동 생성
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ScheduleGenerationService {

    private final EmpRepository empRepository;
    private final EmpHealthRepository empHealthRepository;
    private final EmpScheduleRepository empScheduleRepository;
    private final EmpFlyScheduleRepository empFlyScheduleRepository;
    private final AllScheduleRepository allScheduleRepository;
    private final FlyScheduleRepository flyScheduleRepository;
    private final FlightAssignmentEngine flightAssignmentEngine;
    private final StandbyAssignmentEngine standbyAssignmentEngine;
    private final ShiftAssignmentEngine shiftAssignmentEngine;
    private final EntityManager entityManager;

    /**
     * 월별 스케줄 자동 생성
     *
     * @param yearMonth 배정할 년월 (YYYY-MM)
     * @param airlineId 항공사 ID
     * @return 생성된 일정 수
     */
    @Transactional(noRollbackFor = {
            org.springframework.orm.ObjectOptimisticLockingFailureException.class,
            org.springframework.dao.DataIntegrityViolationException.class
    })
    public int generateMonthlySchedules(YearMonth yearMonth, Long airlineId) {
        log.info("월별 스케줄 자동 생성 시작 - yearMonth: {}, airlineId: {}", yearMonth, airlineId);

        // 0. 기존 일정 삭제 (해당 월의 일정만)
        deleteExistingSchedules(yearMonth, airlineId);

        // 1. 직원 상태 인메모리 로드
        Map<String, EmployeeState> employeeStates = loadEmployeeStates(yearMonth, airlineId);

        if (employeeStates.isEmpty()) {
            throw BusinessException.badRequest("배정할 직원이 없습니다.");
        }

        // 2. AIR OPS 배정 (비행 일정)
        LocalDateTime startDate = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime endDate = yearMonth.atEndOfMonth().atTime(23, 59, 59);
        long flightCount = flyScheduleRepository.countByFlyStartTimeBetween(airlineId, startDate, endDate);
        log.info("해당 월 항공편 수: {}건 (COUNT 쿼리)", flightCount);

        List<ScheduleAssignmentResult> flightResults = flightAssignmentEngine.assignSchedules(
                yearMonth, employeeStates, airlineId
        );

        Set<String> assignedEmpIds = flightResults.stream()
                .map(ScheduleAssignmentResult::getEmpId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        log.info("비행 일정 배정 결과: {}건, 배정된 인원 수: {}명 (중복 제거)",
                flightResults.size(), assignedEmpIds.size());

        // 3. STANDBY/OFF 배정
        List<ScheduleAssignmentResult> standbyAndOffResults = standbyAssignmentEngine.assignStandbyAndOff(
                yearMonth, employeeStates, airlineId
        );

        Set<String> standbyOffEmpIds = standbyAndOffResults.stream()
                .map(ScheduleAssignmentResult::getEmpId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        log.info("STANDBY/OFF 배정 결과: {}건, 배정된 인원 수: {}명 (중복 제거)",
                standbyAndOffResults.size(), standbyOffEmpIds.size());

        // 4. GROUND OPS 배정 (교대 근무)
        List<ScheduleAssignmentResult> shiftResults = shiftAssignmentEngine.assignSchedules(
                yearMonth, employeeStates, airlineId
        );

        Set<String> shiftEmpIds = shiftResults.stream()
                .map(ScheduleAssignmentResult::getEmpId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        log.info("GROUND OPS 배정 결과: {}건, 배정된 인원 수: {}명 (중복 제거)",
                shiftResults.size(), shiftEmpIds.size());

        // 5. 모든 일정 통합
        List<ScheduleAssignmentResult> allResults = new ArrayList<>();
        allResults.addAll(flightResults);
        allResults.addAll(standbyAndOffResults);
        allResults.addAll(shiftResults);

        Set<String> totalAssignedEmpIds = new HashSet<>();
        totalAssignedEmpIds.addAll(assignedEmpIds);
        totalAssignedEmpIds.addAll(standbyOffEmpIds);
        totalAssignedEmpIds.addAll(shiftEmpIds);

        Map<com.kh.ct.global.common.CommonEnums.Role, Set<String>> roleEmpIdsMap = allResults.stream()
                .filter(result -> result.getEmpId() != null)
                .collect(Collectors.groupingBy(
                        result -> {
                            EmployeeState state = employeeStates.get(result.getEmpId());
                            return state != null ? state.getRole() : null;
                        },
                        Collectors.mapping(ScheduleAssignmentResult::getEmpId, Collectors.toSet())
                ));

        log.info("=== 배정 인원 수 집계 (중복 제거) ===");
        log.info("전체 배정 인원 수: {}명", totalAssignedEmpIds.size());
        roleEmpIdsMap.forEach((role, empIds) -> {
            if (role != null) {
                log.info("{} 배정 인원 수: {}명", role.name(), empIds.size());
            }
        });

        // 6. Batch Insert
        if (!allResults.isEmpty()) {
            try {
                saveSchedulesBatch(allResults);
            } catch (Exception e) {
                log.error("일정 배치 저장 중 예외 발생 - 일부 일정이 저장되지 않았을 수 있습니다. 오류: {}",
                        e.getMessage(), e);
            }
        }

        log.info("월별 스케줄 자동 생성 완료 - 총 일정: {}건, 배정된 총 인원 수: {}명 (중복 제거)",
                allResults.size(), totalAssignedEmpIds.size());
        return allResults.size();
    }

    /**
     * 직원 상태를 인메모리에 로드
     * 전월 말 근무 기록 포함하여 연속 근무일 계산
     */
    private Map<String, EmployeeState> loadEmployeeStates(YearMonth yearMonth, Long airlineId) {
        log.info("직원 상태 로드 시작 - yearMonth: {}, airlineId: {}", yearMonth, airlineId);

        // 전체 직원 조회 (airlineId 필터)
        List<Emp> allEmployees = empRepository.findByRoleAndAirlineId(null, airlineId);
        log.info("airlineId={} 필터 결과: {}명", airlineId, allEmployees.size());

        // 활성 직원 필터링
        List<Emp> employees = allEmployees.stream()
                .filter(emp -> emp.getEmpStatus() == CommonEnums.EmpStatus.Y)
                .collect(Collectors.toList());

        log.info("emp_status='Y' 필터 결과: {}명 (전체 {}명 중)", employees.size(), allEmployees.size());

        Map<CommonEnums.Role, Long> roleCounts = employees.stream()
                .collect(Collectors.groupingBy(Emp::getRole, Collectors.counting()));
        log.info("역할별 직원 수:");
        roleCounts.forEach((role, count) -> log.info("  - {}: {}명", role, count));

        long pilotCount = employees.stream()
                .filter(emp -> emp.getRole() == CommonEnums.Role.PILOT)
                .count();
        long cabinCrewCount = employees.stream()
                .filter(emp -> emp.getRole() == CommonEnums.Role.CABIN_CREW)
                .count();
        log.info("비행 승무원 후보 수: PILOT {}명, CABIN_CREW {}명", pilotCount, cabinCrewCount);

        if (employees.isEmpty()) {
            log.warn("활성 직원이 없습니다. airlineId: {}", airlineId);
            return Collections.emptyMap();
        }

        Map<String, EmployeeState> states = new HashMap<>();

        // 전월 말 날짜 계산 (최근 7일 근무 기록 조회용)
        LocalDate monthStart = yearMonth.atDay(1);
        LocalDateTime queryStart = monthStart.minusDays(7).atStartOfDay();
        LocalDateTime queryEnd = monthStart.atStartOfDay();

        for (Emp emp : employees) {
            String empId = emp.getEmpId();

            // 최신 건강 점수 조회
            Integer healthScore = empHealthRepository
                    .findTopByEmpId_EmpIdOrderByEmpHealthIdDesc(empId)
                    .map(EmpHealth::getHealthPoint)
                    .orElse(50);

            // 전월 말 근무 기록 조회
            List<EmpSchedule> recentSchedules = empScheduleRepository.findByEmpId(empId).stream()
                    .filter(schedule -> {
                        if (schedule.getScheduleId() == null || schedule.getScheduleId().getStartDate() == null) {
                            return false;
                        }
                        LocalDateTime startDate = schedule.getScheduleId().getStartDate();
                        return !startDate.isBefore(queryStart) && startDate.isBefore(queryEnd);
                    })
                    .sorted(Comparator.comparing(s -> s.getScheduleId().getStartDate()))
                    .collect(Collectors.toList());

            // EmployeeState 생성
            EmployeeState state = EmployeeState.builder()
                    .empId(empId)
                    .empName(emp.getEmpName())
                    .healthScore(healthScore)
                    .airlineId(emp.getAirlineId() != null ? emp.getAirlineId().getAirlineId() : null)
                    .role(emp.getRole())
                    .build();

            // 전월 말 근무 기록 반영
            for (EmpSchedule schedule : recentSchedules) {
                if (schedule.getScheduleId() == null) continue;

                LocalDateTime start = schedule.getScheduleId().getStartDate();
                LocalDateTime end = schedule.getScheduleId().getEndDate();
                String scheduleCode = schedule.getScheduleCode();

                if (start != null && end != null) {
                    boolean isNight = isNightTime(start, end);
                    boolean isFlight = "FLIGHT".equals(scheduleCode);

                    // ✅ 연속 근무일 계산은 record 추가 전에 (최근 기록의 lastWorkDate 기준 계산 꼬임 방지)
                    state.updateConsecutiveWorkDays(start.toLocalDate());

                    // ✅ 연속 야간/연속 비행은 항상 호출해서 리셋되게
                    state.updateConsecutiveNightShifts(isNight);
                    state.updateConsecutiveFlights(isFlight);

                    EmployeeState.WorkRecord record = EmployeeState.WorkRecord.builder()
                            .workDate(start.toLocalDate())
                            .scheduleCode(scheduleCode)
                            .startTime(start)
                            .endTime(end)
                            .isNightShift(isNight)
                            .build();

                    state.getRecentWorkRecords().add(record);

                    // 마지막 근무 종료 시간 업데이트
                    if (state.getLastWorkEndTime() == null || end.isAfter(state.getLastWorkEndTime())) {
                        state.setLastWorkEndTime(end);
                    }
                }
            }

            states.put(empId, state);
        }

        log.info("직원 상태 로드 완료 - 총 {}명", states.size());
        return states;
    }

    /**
     * Batch Insert로 일정 저장
     */
    private void saveSchedulesBatch(List<ScheduleAssignmentResult> results) {
        if (results.isEmpty()) {
            return;
        }

        log.info("일정 배치 저장 시작 - {}건", results.size());

        Set<String> empIds = results.stream()
                .map(ScheduleAssignmentResult::getEmpId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Map<String, Emp> empMap = empRepository.findAllById(empIds).stream()
                .collect(Collectors.toMap(Emp::getEmpId, emp -> emp));

        // ✅ FLIGHT 일정과 기타 일정 분리 (먼저 분리)
        List<ScheduleAssignmentResult> flightResults = results.stream()
                .filter(r -> "FLIGHT".equals(r.getScheduleCode()))
                .collect(Collectors.toList());
        
        List<ScheduleAssignmentResult> otherResults = results.stream()
                .filter(r -> !"FLIGHT".equals(r.getScheduleCode()))
                .collect(Collectors.toList());
        
        log.info("일정 분류 - FLIGHT: {}건, 기타(STANDBY/OFF/SHIFT): {}건", 
                flightResults.size(), otherResults.size());
        
        // ✅ 기타 일정만 AllSchedule 처리 (FLIGHT는 AllSchedule 불필요)
        Map<String, AllSchedule> allScheduleMap = new HashMap<>();
        Map<Long, AllSchedule> allScheduleByIdMap = new HashMap<>();
        List<AllSchedule> newAllSchedules = new ArrayList<>();

        for (ScheduleAssignmentResult result : otherResults) { // ✅ otherResults만 처리
            AllSchedule allSchedule = result.getAllSchedule();
            if (allSchedule == null) {
                log.warn("ScheduleAssignmentResult의 AllSchedule이 null입니다 - empId: {}", result.getEmpId());
                continue;
            }

            if (allSchedule.getScheduleId() != null) {
                Long scheduleId = allSchedule.getScheduleId();
                String key = result.getEmpId() + "_" + result.getStartTime();
                allScheduleMap.put(key, allSchedule);
                allScheduleByIdMap.put(scheduleId, allSchedule);
                log.info("기존 AllSchedule 사용 - scheduleId: {}, empId: {}, startTime: {}",
                        scheduleId, result.getEmpId(), result.getStartTime());
            } else {
                newAllSchedules.add(allSchedule);
            }
        }

        if (!newAllSchedules.isEmpty()) {
            List<AllSchedule> savedAllSchedules = allScheduleRepository.saveAll(newAllSchedules);
            for (ScheduleAssignmentResult result : otherResults) { // ✅ otherResults만 처리
                AllSchedule allSchedule = result.getAllSchedule();
                if (allSchedule != null && allSchedule.getScheduleId() == null) {
                    for (AllSchedule saved : savedAllSchedules) {
                        if (saved.getStartDate().equals(allSchedule.getStartDate()) &&
                                saved.getEndDate().equals(allSchedule.getEndDate()) &&
                                saved.getScheduleCode().equals(allSchedule.getScheduleCode())) {
                            String key = result.getEmpId() + "_" + result.getStartTime();
                            allScheduleMap.put(key, saved);
                            break;
                        }
                    }
                }
            }
        }
        
        // ✅ FLIGHT 일정은 EmpSchedule 저장에서 제외 (EmpFlySchedule에만 저장)
        // 기타 일정만 EmpSchedule에 저장
        List<EmpSchedule> empSchedulesToSave = new ArrayList<>();
        int pendingApprovalCount = 0;
        int skippedCount = 0;

        for (ScheduleAssignmentResult result : otherResults) { // ✅ otherResults만 처리
            Emp emp = empMap.get(result.getEmpId());

            if (emp == null) {
                log.warn("Emp를 찾을 수 없습니다 - empId: {}", result.getEmpId());
                continue;
            }

            AllSchedule savedAllSchedule = null;

            if (result.getAllSchedule() != null) {
                AllSchedule resultSchedule = result.getAllSchedule();
                if (resultSchedule.getScheduleId() != null) {
                    savedAllSchedule = allScheduleByIdMap.get(resultSchedule.getScheduleId());
                    if (savedAllSchedule == null) {
                        savedAllSchedule = resultSchedule;
                        log.info("result의 AllSchedule 직접 사용 - scheduleId: {}, empId: {}",
                                resultSchedule.getScheduleId(), result.getEmpId());
                    }
                } else {
                    String key = result.getEmpId() + "_" + result.getStartTime();
                    savedAllSchedule = allScheduleMap.get(key);
                }
            }

            if (savedAllSchedule == null) {
                String key = result.getEmpId() + "_" + result.getStartTime();
                savedAllSchedule = allScheduleMap.get(key);
            }

            if (savedAllSchedule == null) {
                log.error("AllSchedule을 찾을 수 없습니다 - empId: {}, startTime: {}, scheduleCode: {}, allScheduleMap 크기: {}",
                        result.getEmpId(), result.getStartTime(), result.getScheduleCode(), allScheduleMap.size());
                log.error("allScheduleMap 키 목록: {}", allScheduleMap.keySet());
                log.error("result.getAllSchedule(): {}", result.getAllSchedule());
                continue;
            }

            if (result.isPendingApproval()) {
                pendingApprovalCount++;
                log.warn("PENDING_APPROVAL 상태 일정 - empId: {}, scheduleCode: {}, startTime: {}",
                        result.getEmpId(), result.getScheduleCode(), result.getStartTime());
            }

            Long scheduleId = savedAllSchedule.getScheduleId();
            if (scheduleId == null) {
                log.error("AllSchedule의 scheduleId가 null입니다 - empId: {}, scheduleCode: {}",
                        result.getEmpId(), result.getScheduleCode());
                continue;
            }

            EmpSchedule empSchedule = EmpSchedule.builder()
                    .empScheduleId(null)
                    .scheduleId(savedAllSchedule)
                    .empId(emp)
                    .scheduleCode(result.getScheduleCode())
                    .build();

            boolean isDuplicateInList = empSchedulesToSave.stream()
                    .anyMatch(es -> es.getEmpId() != null &&
                            es.getEmpId().getEmpId().equals(emp.getEmpId()) &&
                            es.getScheduleId() != null &&
                            es.getScheduleId().getScheduleId().equals(scheduleId));

            if (isDuplicateInList) {
                log.warn("리스트 내 중복 EmpSchedule 건너뜀 - empId: {}, scheduleId: {}",
                        result.getEmpId(), scheduleId);
                skippedCount++;
                continue;
            }

            empSchedulesToSave.add(empSchedule);
        }

        Map<String, EmpSchedule> uniqueEmpSchedules = new HashMap<>();

        for (EmpSchedule es : empSchedulesToSave) {
            if (es.getEmpId() != null && es.getScheduleId() != null) {
                String key = es.getEmpId().getEmpId() + "_" + es.getScheduleId().getScheduleId();
                if (uniqueEmpSchedules.containsKey(key)) {
                    log.warn("리스트 내 중복 EmpSchedule 제거 - empId: {}, scheduleId: {}",
                            es.getEmpId().getEmpId(), es.getScheduleId().getScheduleId());
                }
                uniqueEmpSchedules.putIfAbsent(key, es);
            } else {
                log.warn("EmpSchedule에 empId 또는 scheduleId가 null입니다 - 건너뜀");
            }
        }

        List<EmpSchedule> uniqueList = new ArrayList<>(uniqueEmpSchedules.values());
        log.info("중복 제거 후 EmpSchedule 저장 대상: {}건 (원본: {}건)",
                uniqueList.size(), empSchedulesToSave.size());

        List<EmpSchedule> savedEmpSchedules = saveEmpSchedulesBatch(uniqueList);

        log.info("일정 배치 저장 완료 - 새 AllSchedule: {}건, EmpSchedule: {}건 저장됨, PENDING_APPROVAL: {}건",
                newAllSchedules.size(), savedEmpSchedules.size(), pendingApprovalCount);

        // ✅ FLIGHT 일정: EmpFlySchedule에만 저장 (EmpSchedule 저장 제거)
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
            Emp emp = empMap.get(result.getEmpId());
            if (emp == null) {
                notFoundEmpCount++;
                log.warn("Emp를 찾을 수 없습니다 - empId: {}", result.getEmpId());
                continue;
            }

            // FlySchedule 찾기
            Long flyScheduleId = result.getFlyScheduleId();
            Optional<FlySchedule> flyScheduleOpt = flyScheduleRepository.findById(flyScheduleId);
            
            if (!flyScheduleOpt.isPresent()) {
                notFoundFlyScheduleCount++;
                log.warn("FlySchedule을 찾을 수 없습니다 - flyScheduleId: {}", flyScheduleId);
                continue;
            }
            
            FlySchedule flySchedule = flyScheduleOpt.get();
            
            // 중복 체크
            List<EmpFlySchedule> existing = empFlyScheduleRepository.findByFlyScheduleIdAndEmpId(
                    flyScheduleId, emp.getEmpId()
            );
            
            if (!existing.isEmpty()) {
                alreadyExistsCount++;
                log.debug("이미 EmpFlySchedule이 존재합니다 - flyScheduleId: {}, empId: {}",
                        flyScheduleId, emp.getEmpId());
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
            } catch (Exception e) {
                log.error("❌ EmpFlySchedule 저장 중 오류 발생 - {}건 중 일부가 저장되지 않았을 수 있습니다. 오류: {}",
                        empFlySchedulesToSave.size(), e.getMessage(), e);
            }
        } else {
            log.warn("⚠️ 저장할 EmpFlySchedule이 없습니다!");
        }
        
        log.info("일정 배치 저장 완료 - 새 AllSchedule: {}건, EmpSchedule(기타 일정): {}건, EmpFlySchedule(FLIGHT): {}건, PENDING_APPROVAL: {}건",
                newAllSchedules.size(), savedEmpSchedules.size(), empFlySchedulesToSave.size(), pendingApprovalCount);
    }

    /**
     * 기존 일정 삭제 (해당 월의 일정만)
     * - EmpSchedule: 기타 일정(STANDBY/OFF/SHIFT) 삭제
     * - EmpFlySchedule: FLIGHT 일정 삭제
     */
    private void deleteExistingSchedules(YearMonth yearMonth, Long airlineId) {
        log.info("기존 일정 삭제 시작 - yearMonth: {}, airlineId: {}", yearMonth, airlineId);

        LocalDateTime startDate = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime endDate = yearMonth.atEndOfMonth().atTime(23, 59, 59).plusSeconds(1);

        // 1. EmpSchedule 삭제 (기타 일정만 - FLIGHT는 이미 제외됨)
        List<EmpSchedule> existingSchedules = empScheduleRepository.findByAirlineIdAndMonth(
                airlineId, startDate, endDate
        );

        if (!existingSchedules.isEmpty()) {
            log.info("기존 EmpSchedule {}건 삭제 시작", existingSchedules.size());
            empScheduleRepository.deleteAll(existingSchedules);
            log.info("기존 EmpSchedule 삭제 완료 - {}건", existingSchedules.size());
        } else {
            log.info("삭제할 기존 EmpSchedule이 없습니다.");
        }

        // 2. EmpFlySchedule 삭제 (FLIGHT 일정)
        // 해당 월의 FlySchedule 조회
        List<FlySchedule> flightsInMonth = flyScheduleRepository.findByDateRange(
                airlineId, startDate, endDate
        );
        
        int deletedEmpFlyScheduleCount = 0;
        if (!flightsInMonth.isEmpty()) {
            List<Long> flyScheduleIds = flightsInMonth.stream()
                    .map(FlySchedule::getFlyScheduleId)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
            
            if (!flyScheduleIds.isEmpty()) {
                // 해당 월의 모든 EmpFlySchedule 조회 및 삭제
                List<EmpFlySchedule> existingEmpFlySchedules = empFlyScheduleRepository.findByFlyScheduleIdIn(flyScheduleIds);
                
                if (!existingEmpFlySchedules.isEmpty()) {
                    log.info("기존 EmpFlySchedule {}건 삭제 시작", existingEmpFlySchedules.size());
                    empFlyScheduleRepository.deleteAll(existingEmpFlySchedules);
                    deletedEmpFlyScheduleCount = existingEmpFlySchedules.size();
                    log.info("기존 EmpFlySchedule 삭제 완료 - {}건", deletedEmpFlyScheduleCount);
                } else {
                    log.info("삭제할 기존 EmpFlySchedule이 없습니다.");
                }
            }
        } else {
            log.info("해당 월에 FlySchedule이 없어 EmpFlySchedule 삭제를 건너뜁니다.");
        }

        entityManager.flush();
        entityManager.clear();

        log.info("기존 일정 삭제 완료 - EmpSchedule: {}건, EmpFlySchedule: {}건", 
                existingSchedules.size(), deletedEmpFlyScheduleCount);
    }

    /**
     * EmpFlySchedule 배치 저장 (별도 트랜잭션으로 분리하여 rollback-only 방지)
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW,
            noRollbackFor = {org.springframework.dao.DataIntegrityViolationException.class})
    private List<EmpFlySchedule> saveEmpFlySchedulesBatch(List<EmpFlySchedule> empFlySchedules) {
        if (empFlySchedules.isEmpty()) {
            return new ArrayList<>();
        }

        List<EmpFlySchedule> savedEmpFlySchedules;
        try {
            savedEmpFlySchedules = empFlyScheduleRepository.saveAll(empFlySchedules);
            log.info("EmpFlySchedule Bulk Save 완료 - 저장된 건수: {}건", savedEmpFlySchedules.size());
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            log.warn("EmpFlySchedule Bulk Save 중 unique 제약 위반 발생 - 개별 저장으로 전환. 오류: {}", e.getMessage());
            savedEmpFlySchedules = new ArrayList<>();
            int individualSkippedCount = 0;

            for (EmpFlySchedule efs : empFlySchedules) {
                try {
                    EmpFlySchedule saved = empFlyScheduleRepository.save(efs);
                    savedEmpFlySchedules.add(saved);
                } catch (org.springframework.dao.DataIntegrityViolationException ex) {
                    log.debug("EmpFlySchedule 중복 건너김 - empId: {}, flyScheduleId: {}",
                            efs.getEmp() != null ? efs.getEmp().getEmpId() : "null",
                            efs.getFlySchedule() != null ? efs.getFlySchedule().getFlyScheduleId() : "null");
                    individualSkippedCount++;
                } catch (Exception ex) {
                    log.warn("EmpFlySchedule 개별 저장 실패 - empId: {}, flyScheduleId: {} (건너김). 오류: {}",
                            efs.getEmp() != null ? efs.getEmp().getEmpId() : "null",
                            efs.getFlySchedule() != null ? efs.getFlySchedule().getFlyScheduleId() : "null",
                            ex.getMessage());
                    individualSkippedCount++;
                }
            }

            log.info("EmpFlySchedule 개별 저장 완료 - 저장된 건수: {}건, 건너김: {}건",
                    savedEmpFlySchedules.size(), individualSkippedCount);
        }

        return savedEmpFlySchedules;
    }

    /**
     * EmpSchedule 배치 저장 (별도 트랜잭션으로 분리하여 rollback-only 방지)
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW,
            noRollbackFor = {org.springframework.dao.DataIntegrityViolationException.class})
    private List<EmpSchedule> saveEmpSchedulesBatch(List<EmpSchedule> uniqueList) {
        if (uniqueList.isEmpty()) {
            return new ArrayList<>();
        }

        List<EmpSchedule> savedEmpSchedules;
        try {
            savedEmpSchedules = empScheduleRepository.saveAll(uniqueList);
            log.info("EmpSchedule Bulk Save 완료 - 저장된 건수: {}건", savedEmpSchedules.size());
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            log.warn("Bulk Save 중 unique 제약 위반 발생 - 개별 저장으로 전환. 오류: {}", e.getMessage());
            savedEmpSchedules = new ArrayList<>();
            int individualSkippedCount = 0;

            for (EmpSchedule es : uniqueList) {
                try {
                    EmpSchedule saved = empScheduleRepository.save(es);
                    savedEmpSchedules.add(saved);
                } catch (org.springframework.dao.DataIntegrityViolationException ex) {
                    log.debug("EmpSchedule 중복 건너뜀 - empId: {}, scheduleId: {}",
                            es.getEmpId() != null ? es.getEmpId().getEmpId() : "null",
                            es.getScheduleId() != null ? es.getScheduleId().getScheduleId() : "null");
                    individualSkippedCount++;
                } catch (Exception ex) {
                    log.warn("EmpSchedule 개별 저장 실패 - empId: {}, scheduleId: {} (건너뜀). 오류: {}",
                            es.getEmpId() != null ? es.getEmpId().getEmpId() : "null",
                            es.getScheduleId() != null ? es.getScheduleId().getScheduleId() : "null",
                            ex.getMessage());
                    individualSkippedCount++;
                }
            }

            log.info("EmpSchedule 개별 저장 완료 - 저장된 건수: {}건, 건너뜀: {}건",
                    savedEmpSchedules.size(), individualSkippedCount);
        }

        return savedEmpSchedules;
    }

    /**
     * 야간 시간대 체크
     */
    private boolean isNightTime(LocalDateTime start, LocalDateTime end) {
        if (start == null) return false;

        int hour = start.getHour();
        if (hour >= 22 || hour < 6) {
            return true;
        }

        if (end != null && end.getHour() < 6) {
            return true;
        }

        return false;
    }
}
