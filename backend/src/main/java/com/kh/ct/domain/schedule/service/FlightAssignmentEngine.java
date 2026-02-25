package com.kh.ct.domain.schedule.service;

import com.kh.ct.domain.schedule.entity.FlySchedule;
import com.kh.ct.domain.schedule.repository.FlyScheduleRepository;
import com.kh.ct.global.exception.BusinessException;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 비행 일정 배정 엔진 (재구현)
 * 
 * 핵심 요구사항:
 * 1. crew_count만큼 정확히 배정 (PILOT 2명 + CABIN_CREW (crew_count-2)명)
 * 2. 시간 겹침 금지 (existing.start < new.end AND existing.end > new.start)
 * 3. 월 비행 횟수 목표 7~9회 (공정성)
 * 4. 배정 실패 시 재시도 전략 (Greedy → Relax → Swap → 최종 실패 기록)
 * 5. 메모리에서 계산 후 batch insert
 * 6. 검증 리포트 (flight별 assigned_cnt == crew_count, 시간 겹침 검사)
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class FlightAssignmentEngine implements AssignmentEngine {
    
    private final FlyScheduleRepository flyScheduleRepository;
    
    // 스케줄 코드 상수
    private static final String SCHEDULE_CODE_FLIGHT = "FLIGHT";
    
    // 월 비행 횟수 목표
    private static final int MIN_FLIGHTS_PER_MONTH = 7;
    private static final int MAX_FLIGHTS_PER_MONTH = 9;
    private static final int TARGET_FLIGHTS_PER_MONTH = 9;
    
    // 페널티 가중치
    private static final double PENALTY_CONSECUTIVE_WORK_5DAYS = 20.0;
    private static final double PENALTY_CONSECUTIVE_NIGHT = 15.0;
    private static final double PENALTY_CONSECUTIVE_FLIGHT_3 = 25.0;
    private static final double PENALTY_EXCESSIVE_FLIGHTS = 50.0; // 9회 초과 시 큰 페널티
    
    // 가산점 가중치
    private static final double BONUS_LOW_FLIGHT_COUNT = 10.0; // 비행 횟수가 적은 직원 가산점
    private static final double FAIRNESS_BONUS_MULTIPLIER = 2.0;
    
    // Swap 최대 깊이
    private static final int MAX_SWAP_DEPTH = 3;
    
    @Override
    public List<ScheduleAssignmentResult> assignSchedules(
            YearMonth yearMonth,
            Map<String, EmployeeState> employeeStates,
            Long airlineId
    ) {
        log.info("========================================");
        log.info("비행 일정 배정 시작 - yearMonth: {}, airlineId: {}", yearMonth, airlineId);
        log.info("========================================");
        
        // 해당 월의 비행편 조회 (다음 달 1일 00:00:00까지 포함)
        LocalDateTime startDate = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime endDate = yearMonth.plusMonths(1).atDay(1).atStartOfDay(); // 다음 달 1일 00:00:00
        
        log.info("비행편 조회 범위 - startDate: {}, endDate: {} (다음 달 1일 00:00:00까지)", startDate, endDate);
        
        List<FlySchedule> flights = flyScheduleRepository.findByDateRange(
            airlineId, startDate, endDate
        );
        
        log.info("========================================");
        log.info("조회된 비행편 수: {}건 (예상: 월 전체 비행편)", flights.size());
        log.info("========================================");
        
        // 조회 결과 검증 로그
        if (flights.isEmpty()) {
            log.warn("⚠️ 조회된 비행편이 0건입니다. 조회 조건을 확인하세요.");
            log.warn("  - airlineId: {}", airlineId);
            log.warn("  - startDate: {}", startDate);
            log.warn("  - endDate: {}", endDate);
        } else {
            // 날짜별 분포 확인
            Map<LocalDate, Long> flightsByDate = flights.stream()
                .filter(f -> f.getFlyStartTime() != null)
                .collect(Collectors.groupingBy(
                    f -> f.getFlyStartTime().toLocalDate(),
                    Collectors.counting()
                ));
            log.info("날짜별 비행편 분포 (상위 5일):");
            flightsByDate.entrySet().stream()
                .sorted(Map.Entry.<LocalDate, Long>comparingByValue().reversed())
                .limit(5)
                .forEach(e -> log.info("  - {}: {}건", e.getKey(), e.getValue()));
        }
        
        if (flights.isEmpty()) {
            log.warn("배정할 비행편이 없습니다. airlineId: {}, yearMonth: {}", airlineId, yearMonth);
            return Collections.emptyList();
        }
        
        // PILOT, CABIN_CREW 역할만 필터링
        Map<String, EmployeeState> flightCrewStates = employeeStates.entrySet().stream()
            .filter(entry -> {
                com.kh.ct.global.common.CommonEnums.Role role = entry.getValue().getRole();
                return role == com.kh.ct.global.common.CommonEnums.Role.PILOT || 
                       role == com.kh.ct.global.common.CommonEnums.Role.CABIN_CREW;
            })
            .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
        
        log.info("비행 승무원 후보 수: {}명 (PILOT/CABIN_CREW)", flightCrewStates.size());
        
        // 비행편을 시간 순으로 정렬 (비행 시간이 빠른 순서대로)
        flights.sort(Comparator.comparing(FlySchedule::getFlyStartTime, 
            Comparator.nullsLast(Comparator.naturalOrder())));
        
        // 배정 결과 및 violations 수집
        List<ScheduleAssignmentResult> allAssignments = new ArrayList<>();
        List<FlightAssignmentResult.Violation> violations = new ArrayList<>();
        int successfullyAssignedFlights = 0;
        int failedFlights = 0;
        
        // 비행편별로 배정
        for (FlySchedule flight : flights) {
            try {
                FlightAssignmentResult result = assignFlightWithRetry(
                    flight, flightCrewStates, yearMonth
                );
                
                allAssignments.addAll(result.getAssignments());
                violations.addAll(result.getViolations());
                
                if (result.isSuccess()) {
                    successfullyAssignedFlights++;
                } else {
                    failedFlights++;
                }
            } catch (Exception e) {
                log.error("비행편 {} 배정 중 예외 발생 - flyScheduleId: {}", 
                    flight.getFlightNumber(), flight.getFlyScheduleId(), e);
                failedFlights++;
                
                violations.add(FlightAssignmentResult.Violation.builder()
                    .flyScheduleId(flight.getFlyScheduleId())
                    .flightNumber(flight.getFlightNumber())
                    .violationType("EXCEPTION")
                    .message("배정 중 예외 발생: " + e.getMessage())
                    .build());
            }
        }
        
        log.info("========================================");
        log.info("비행 일정 배정 완료");
        log.info("  - 총 비행편: {}건", flights.size());
        log.info("  - 성공: {}건", successfullyAssignedFlights);
        log.info("  - 실패: {}건", failedFlights);
        log.info("  - 총 배정: {}건", allAssignments.size());
        log.info("  - 위반 사항: {}건", violations.size());
        log.info("========================================");
        
        return allAssignments;
    }
    
    /**
     * 비행편 배정 (재시도 전략 포함)
     * 
     * 재시도 전략:
     * A. 1차: Greedy 배정 (공정성 우선)
     * B. 2차: Relax 공정성 (9회 초과 허용 등) 하지만 겹침은 절대 금지
     * C. 3차: Swap(교체) 시도
     * D. 최종 실패 시: violations에 기록
     */
    private FlightAssignmentResult assignFlightWithRetry(
            FlySchedule flight,
            Map<String, EmployeeState> crewStates,
            YearMonth yearMonth
    ) {
        LocalDateTime flightStart = flight.getFlyStartTime();
        LocalDateTime flightEnd = flight.getFlyEndTime();
        
        if (flightStart == null || flightEnd == null) {
            return FlightAssignmentResult.builder()
                .success(false)
                .violations(List.of(FlightAssignmentResult.Violation.builder()
                    .flyScheduleId(flight.getFlyScheduleId())
                    .flightNumber(flight.getFlightNumber())
                    .violationType("INVALID_TIME")
                    .message("비행 시간 정보가 없습니다")
                    .build()))
                .build();
        }
        
        if (flight.getCrewCount() == null || flight.getCrewCount() < 2) {
            return FlightAssignmentResult.builder()
                .success(false)
                .violations(List.of(FlightAssignmentResult.Violation.builder()
                    .flyScheduleId(flight.getFlyScheduleId())
                    .flightNumber(flight.getFlightNumber())
                    .violationType("INVALID_CREW_COUNT")
                    .message(String.format("crew_count가 부족합니다: %d (최소 2명 필요)", 
                        flight.getCrewCount() != null ? flight.getCrewCount() : 0))
                    .build()))
                .build();
        }
        
        int totalCrewCount = flight.getCrewCount().intValue();
        int requiredPilots = 2;
        int requiredCabinCrew = totalCrewCount - requiredPilots;
        
        log.info("비행편 {} (flyScheduleId: {}) 배정 시작 - 총 필요: {}명 (PILOT: {}명, CABIN_CREW: {}명)", 
            flight.getFlightNumber(), flight.getFlyScheduleId(), totalCrewCount, requiredPilots, requiredCabinCrew);
        
        // PILOT과 CABIN_CREW 분리
        Map<String, EmployeeState> pilotStates = new HashMap<>();
        Map<String, EmployeeState> cabinCrewStates = new HashMap<>();
        
        for (Map.Entry<String, EmployeeState> entry : crewStates.entrySet()) {
            com.kh.ct.global.common.CommonEnums.Role role = entry.getValue().getRole();
            if (role == com.kh.ct.global.common.CommonEnums.Role.PILOT) {
                pilotStates.put(entry.getKey(), entry.getValue());
            } else if (role == com.kh.ct.global.common.CommonEnums.Role.CABIN_CREW) {
                cabinCrewStates.put(entry.getKey(), entry.getValue());
            }
        }
        
        List<ScheduleAssignmentResult> allAssignments = new ArrayList<>();
        List<FlightAssignmentResult.Violation> violations = new ArrayList<>();
        
        // 1. PILOT 배정 (재시도 전략 포함)
        log.info("비행편 {} (flyScheduleId: {}) PILOT 배정 시작 - 필요: {}명, 후보: {}명", 
            flight.getFlightNumber(), flight.getFlyScheduleId(), requiredPilots, pilotStates.size());
        AssignmentResult pilotResult = assignRoleWithRetry(
            flight, flightStart, flightEnd, pilotStates, requiredPilots,
            com.kh.ct.global.common.CommonEnums.Role.PILOT, "PILOT", false
        );
        allAssignments.addAll(pilotResult.getAssignments());
        violations.addAll(pilotResult.getViolations());
        
        log.info("비행편 {} (flyScheduleId: {}) PILOT 배정 완료 - 배정: {}/{}명", 
            flight.getFlightNumber(), flight.getFlyScheduleId(), 
            pilotResult.getAssignedCount(), requiredPilots);
        
        // 2. CABIN_CREW 배정 (재시도 전략 포함)
        // ✅ 중요: CABIN_CREW 배정 실패해도 PILOT 배정은 유지됨
        log.info("비행편 {} (flyScheduleId: {}) CABIN_CREW 배정 시작 - 필요: {}명, 후보: {}명", 
            flight.getFlightNumber(), flight.getFlyScheduleId(), requiredCabinCrew, cabinCrewStates.size());
        AssignmentResult cabinCrewResult = assignRoleWithRetry(
            flight, flightStart, flightEnd, cabinCrewStates, requiredCabinCrew,
            com.kh.ct.global.common.CommonEnums.Role.CABIN_CREW, "CABIN_CREW", false
        );
        allAssignments.addAll(cabinCrewResult.getAssignments());
        violations.addAll(cabinCrewResult.getViolations());
        
        log.info("비행편 {} (flyScheduleId: {}) CABIN_CREW 배정 완료 - 배정: {}/{}명", 
            flight.getFlightNumber(), flight.getFlyScheduleId(), 
            cabinCrewResult.getAssignedCount(), requiredCabinCrew);
        
        // 최종 검증: crew_count만큼 정확히 배정되었는지
        int totalAssigned = pilotResult.getAssignedCount() + cabinCrewResult.getAssignedCount();
        boolean success = (pilotResult.getAssignedCount() == requiredPilots) && 
                         (cabinCrewResult.getAssignedCount() == requiredCabinCrew);
        
        // ✅ 중요: CABIN_CREW 배정 실패해도 PILOT 배정은 유지 (allAssignments에 이미 포함됨)
        if (!success) {
            // 배정 실패 원인 상세 기록
            String failureReason = "";
            if (pilotResult.getAssignedCount() < requiredPilots) {
                failureReason += String.format("PILOT 부족(%d/%d) ", 
                    pilotResult.getAssignedCount(), requiredPilots);
            }
            if (cabinCrewResult.getAssignedCount() < requiredCabinCrew) {
                failureReason += String.format("CABIN_CREW 부족(%d/%d) ", 
                    cabinCrewResult.getAssignedCount(), requiredCabinCrew);
            }
            
            // 가능한 후보 수 계산 (상세 원인 파악용)
            int availablePilots = (int) pilotStates.values().stream()
                .filter(state -> validateHardConstraintsWithReason(state, flightStart, flightEnd, SCHEDULE_CODE_FLIGHT) == null)
                .count();
            int availableCabinCrew = (int) cabinCrewStates.values().stream()
                .filter(state -> validateHardConstraintsWithReason(state, flightStart, flightEnd, SCHEDULE_CODE_FLIGHT) == null)
                .count();
            
            violations.add(FlightAssignmentResult.Violation.builder()
                .flyScheduleId(flight.getFlyScheduleId())
                .flightNumber(flight.getFlightNumber())
                .violationType("INSUFFICIENT_CREW")
                .message(String.format("필요 인원 부족 - PILOT: %d/%d (가능: %d), CABIN_CREW: %d/%d (가능: %d) - 원인: %s", 
                    pilotResult.getAssignedCount(), requiredPilots, availablePilots,
                    cabinCrewResult.getAssignedCount(), requiredCabinCrew, availableCabinCrew,
                    failureReason.trim()))
                .role("ALL")
                .requiredCount(totalCrewCount)
                .assignedCount(totalAssigned)
                .availableCount(availablePilots + availableCabinCrew)
                .build());
            
            log.warn("⚠️ 비행편 {} (flyScheduleId: {}) 배정 불완전 - 총 배정: {}/{}명 (PILOT: {}/{}, CABIN: {}/{})", 
                flight.getFlightNumber(), flight.getFlyScheduleId(),
                totalAssigned, totalCrewCount,
                pilotResult.getAssignedCount(), requiredPilots,
                cabinCrewResult.getAssignedCount(), requiredCabinCrew);
        } else {
            log.info("✅ 비행편 {} (flyScheduleId: {}) 배정 완료 - 총 배정: {}명 (PILOT: {}명, CABIN: {}명)", 
                flight.getFlightNumber(), flight.getFlyScheduleId(),
                totalAssigned, pilotResult.getAssignedCount(), cabinCrewResult.getAssignedCount());
        }
        
        // ✅ 중요: success가 false여도 PILOT 배정은 유지됨 (allAssignments에 이미 포함)
        return FlightAssignmentResult.builder()
            .success(success)
            .assignments(allAssignments) // PILOT + CABIN_CREW 배정 모두 포함 (CABIN 실패해도 PILOT은 유지)
            .violations(violations)
            .build();
    }
    
    /**
     * 역할별 배정 (재시도 전략 포함)
     * 
     * @param relaxFairness true면 공정성 제약 완화 (9회 초과 허용)
     */
    private AssignmentResult assignRoleWithRetry(
            FlySchedule flight,
            LocalDateTime flightStart,
            LocalDateTime flightEnd,
            Map<String, EmployeeState> roleStates,
            int requiredCount,
            com.kh.ct.global.common.CommonEnums.Role role,
            String roleName,
            boolean relaxFairness
    ) {
        // 1차: Greedy 배정 (공정성 우선)
        AssignmentResult result = assignByRoleGreedy(
            flight, flightStart, flightEnd, roleStates, requiredCount, role, relaxFairness
        );
        
        if (result.getAssignedCount() == requiredCount) {
            log.info("비행편 {} {} 1차 배정 성공 - {}명 배정", 
                flight.getFlightNumber(), roleName, result.getAssignedCount());
            return result;
        }
        
        log.warn("비행편 {} {} 1차 배정 부족 - 필요: {}명, 배정: {}명", 
            flight.getFlightNumber(), roleName, requiredCount, result.getAssignedCount());
        
        // 2차: Relax 공정성 (9회 초과 허용)
        if (!relaxFairness) {
            log.info("비행편 {} {} 2차 배정 시도 (공정성 완화)", flight.getFlightNumber(), roleName);
            AssignmentResult relaxedResult = assignByRoleGreedy(
                flight, flightStart, flightEnd, roleStates, requiredCount, role, true
            );
            
            if (relaxedResult.getAssignedCount() == requiredCount) {
                log.info("비행편 {} {} 2차 배정 성공 - {}명 배정", 
                    flight.getFlightNumber(), roleName, relaxedResult.getAssignedCount());
                return relaxedResult;
            }
            
            result = relaxedResult;
        }
        
        // 3차: Swap 시도
        if (result.getAssignedCount() < requiredCount) {
            log.info("비행편 {} {} 3차 배정 시도 (Swap)", flight.getFlightNumber(), roleName);
            AssignmentResult swapResult = assignByRoleWithSwap(
                flight, flightStart, flightEnd, roleStates, requiredCount, role, 
                result.getAssignments(), relaxFairness
            );
            
            if (swapResult.getAssignedCount() > result.getAssignedCount()) {
                log.info("비행편 {} {} Swap으로 개선 - {}명 → {}명", 
                    flight.getFlightNumber(), roleName, 
                    result.getAssignedCount(), swapResult.getAssignedCount());
                result = swapResult;
            }
        }
        
        // 최종 실패 시 violations 추가
        if (result.getAssignedCount() < requiredCount) {
            int availableCount = (int) roleStates.values().stream()
                .filter(state -> {
                    if (relaxFairness) {
                        // 공정성 완화: 시간 겹침만 체크
                        return !state.hasTimeConflict(flightStart, flightEnd);
                    } else {
                        // 공정성 우선: 하드 제약 조건 체크
                        return validateHardConstraintsWithReason(state, flightStart, flightEnd, SCHEDULE_CODE_FLIGHT) == null;
                    }
                })
                .count();
            
            result.getViolations().add(FlightAssignmentResult.Violation.builder()
                .flyScheduleId(flight.getFlyScheduleId())
                .flightNumber(flight.getFlightNumber())
                .violationType("INSUFFICIENT_CREW")
                .message(String.format("%s 배정 부족 - 필요: %d명, 배정: %d명, 가능: %d명", 
                    roleName, requiredCount, result.getAssignedCount(), availableCount))
                .role(roleName)
                .requiredCount(requiredCount)
                .assignedCount(result.getAssignedCount())
                .availableCount(availableCount)
                .build());
        }
        
        return result;
    }
    
    /**
     * Greedy 배정 (공정성 우선 또는 완화)
     */
    private AssignmentResult assignByRoleGreedy(
            FlySchedule flight,
            LocalDateTime flightStart,
            LocalDateTime flightEnd,
            Map<String, EmployeeState> roleStates,
            int requiredCount,
            com.kh.ct.global.common.CommonEnums.Role role,
            boolean relaxFairness
    ) {
        if (roleStates.isEmpty()) {
            log.warn("비행편 {} (flyScheduleId: {}) {} 역할 후보가 없습니다", 
                flight.getFlightNumber(), flight.getFlyScheduleId(), role);
            return AssignmentResult.builder()
                .assignments(Collections.emptyList())
                .violations(Collections.emptyList())
                .assignedCount(0)
                .build();
        }
        
        // PriorityQueue로 후보자 선정
        PriorityQueue<AssignmentCandidate> candidates = new PriorityQueue<>();
        
        // 탈락 사유별 카운트 (상세 로깅용)
        Map<String, Integer> rejectionReasons = new HashMap<>();
        int passedCount = 0;
        
        for (Map.Entry<String, EmployeeState> entry : roleStates.entrySet()) {
            EmployeeState state = entry.getValue();
            String empId = entry.getKey();
            
            // 하드 제약 조건 검증
            String rejectionReason = null;
            if (relaxFairness) {
                // 공정성 완화: 시간 겹침만 체크
                if (state.hasTimeConflict(flightStart, flightEnd)) {
                    rejectionReason = "시간대_중복";
                }
            } else {
                // 공정성 우선: 모든 하드 제약 조건 체크
                rejectionReason = validateHardConstraintsWithReason(state, flightStart, flightEnd, SCHEDULE_CODE_FLIGHT);
            }
            
            if (rejectionReason != null) {
                rejectionReasons.put(rejectionReason, rejectionReasons.getOrDefault(rejectionReason, 0) + 1);
                continue;
            }
            
            passedCount++;
            
            // 페널티 계산
            double penalties = calculatePenalties(state, flightStart, SCHEDULE_CODE_FLIGHT, relaxFairness);
            
            // 점수 계산
            double score = calculateScoreWithBonus(state, penalties, relaxFairness);
            
            candidates.offer(AssignmentCandidate.builder()
                .empId(empId)
                .employeeState(state)
                .assignScore(score)
                .build());
        }
        
        // 탈락 사유별 통계 로그
        if (!rejectionReasons.isEmpty() || passedCount < requiredCount) {
            log.warn("비행편 {} (flyScheduleId: {}) {} 역할 제약 검증 결과 - 통과: {}명, 탈락: {}명 (필요: {}명)", 
                flight.getFlightNumber(), flight.getFlyScheduleId(), role, 
                passedCount, roleStates.size() - passedCount, requiredCount);
            rejectionReasons.forEach((reason, count) ->
                log.warn("  - 탈락 사유 [{}]: {}명", reason, count));
        }
        
        // 상위 N명 선택하여 배정
        List<ScheduleAssignmentResult> assignments = new ArrayList<>();
        int assignedCount = 0;
        int conflictSkippedCount = 0; // 최종 배정 전 시간 겹침으로 스킵된 수
        
        while (!candidates.isEmpty() && assignedCount < requiredCount) {
            AssignmentCandidate candidate = candidates.poll();
            EmployeeState state = candidate.getEmployeeState();
            
            // 중복 체크 (다시 한번) - 최종 배정 전 재확인
            if (state.hasTimeConflict(flightStart, flightEnd)) {
                conflictSkippedCount++;
                log.debug("비행편 {} (flyScheduleId: {}) {} 역할 최종 배정 전 시간 겹침으로 제외 - empId: {}", 
                    flight.getFlightNumber(), flight.getFlyScheduleId(), role, candidate.getEmpId());
                continue;
            }
            
            // 상태 업데이트
            LocalDate workDate = flightStart.toLocalDate();
            state.updateConsecutiveWorkDays(workDate);
            state.updateConsecutiveFlights(true);
            
            boolean isNightFlight = isNightTime(flightStart, flightEnd);
            state.updateConsecutiveNightShifts(isNightFlight);
            
            // ✅ EmployeeState에 배정 슬롯 추가 (flyScheduleId 포함)
            state.addAssignedSlot(flightStart, flightEnd, SCHEDULE_CODE_FLIGHT, flight.getFlyScheduleId());
            
            // 배정 결과 생성
            ScheduleAssignmentResult result = ScheduleAssignmentResult.builder()
                .empId(candidate.getEmpId())
                .allSchedule(null)
                .scheduleCode(SCHEDULE_CODE_FLIGHT)
                .startTime(flightStart)
                .endTime(flightEnd)
                .flyScheduleId(flight.getFlyScheduleId())
                .isPendingApproval(state.getHealthScore() != null && state.getHealthScore() < 40)
                .build();
            
            assignments.add(result);
            assignedCount++;
        }
        
        // 배정 부족 시 상세 로그
        if (assignedCount < requiredCount) {
            log.warn("비행편 {} (flyScheduleId: {}) {} 역할 배정 부족 - 필요: {}명, 배정: {}명, 후보: {}명, 통과: {}명, 시간겹침_스킵: {}명", 
                flight.getFlightNumber(), flight.getFlyScheduleId(), role, 
                requiredCount, assignedCount, roleStates.size(), passedCount, conflictSkippedCount);
        }
        
        return AssignmentResult.builder()
            .assignments(assignments)
            .violations(Collections.emptyList())
            .assignedCount(assignedCount)
            .build();
    }
    
    /**
     * Swap을 통한 배정 (같은 역할군 내 교체)
     */
    private AssignmentResult assignByRoleWithSwap(
            FlySchedule flight,
            LocalDateTime flightStart,
            LocalDateTime flightEnd,
            Map<String, EmployeeState> roleStates,
            int requiredCount,
            com.kh.ct.global.common.CommonEnums.Role role,
            List<ScheduleAssignmentResult> existingAssignments,
            boolean relaxFairness
    ) {
        // 기존 배정된 직원들의 시간 슬롯 임시 제거
        Map<String, List<EmployeeState.ScheduledSlot>> savedSlots = new HashMap<>();
        for (ScheduleAssignmentResult assignment : existingAssignments) {
            EmployeeState state = roleStates.get(assignment.getEmpId());
            if (state != null) {
                savedSlots.put(assignment.getEmpId(), new ArrayList<>(state.getAssignedSlots()));
                // 임시로 해당 비행 시간 슬롯 제거
                state.getAssignedSlots().removeIf(slot -> 
                    slot.getStartTime().equals(flightStart) && slot.getEndTime().equals(flightEnd));
            }
        }
        
        // Swap 시도: 기존 배정된 직원과 교체 가능한 후보 찾기
        List<ScheduleAssignmentResult> bestAssignments = new ArrayList<>(existingAssignments);
        int bestCount = existingAssignments.size();
        
        for (ScheduleAssignmentResult existing : existingAssignments) {
            EmployeeState existingState = roleStates.get(existing.getEmpId());
            if (existingState == null) continue;
            
            // 기존 배정된 직원의 다른 비행 일정 찾기
            for (EmployeeState.ScheduledSlot existingSlot : existingState.getAssignedSlots()) {
                if (existingSlot.getStartTime().equals(flightStart) && 
                    existingSlot.getEndTime().equals(flightEnd)) {
                    continue; // 현재 비행은 제외
                }
                
                // 다른 후보가 이 기존 비행에 배정 가능한지 확인
                for (Map.Entry<String, EmployeeState> entry : roleStates.entrySet()) {
                    if (entry.getKey().equals(existing.getEmpId())) continue;
                    
                    EmployeeState candidateState = entry.getValue();
                    
                    // 후보가 현재 비행에 배정 가능한지
                    if (candidateState.hasTimeConflict(flightStart, flightEnd)) continue;
                    if (!relaxFairness) {
                        String reason = validateHardConstraintsWithReason(
                            candidateState, flightStart, flightEnd, SCHEDULE_CODE_FLIGHT);
                        if (reason != null) continue;
                    }
                    
                    // 후보가 기존 비행에 배정 가능한지
                    if (candidateState.hasTimeConflict(
                        existingSlot.getStartTime(), existingSlot.getEndTime())) continue;
                    
                    // Swap 성공: 기존 직원을 기존 비행으로, 후보를 현재 비행으로
                    List<ScheduleAssignmentResult> swapped = new ArrayList<>();
                    for (ScheduleAssignmentResult a : existingAssignments) {
                        if (a.getEmpId().equals(existing.getEmpId())) {
                            // 기존 직원을 기존 비행으로 교체
                            swapped.add(ScheduleAssignmentResult.builder()
                                .empId(existing.getEmpId())
                                .allSchedule(null)
                                .scheduleCode(SCHEDULE_CODE_FLIGHT)
                                .startTime(existingSlot.getStartTime())
                                .endTime(existingSlot.getEndTime())
                                .flyScheduleId(findFlyScheduleId(existingSlot))
                                .build());
                        } else {
                            swapped.add(a);
                        }
                    }
                    
                    // 후보를 현재 비행으로 추가
                    swapped.add(ScheduleAssignmentResult.builder()
                        .empId(entry.getKey())
                        .allSchedule(null)
                        .scheduleCode(SCHEDULE_CODE_FLIGHT)
                        .startTime(flightStart)
                        .endTime(flightEnd)
                        .flyScheduleId(flight.getFlyScheduleId())
                        .build());
                    
                    if (swapped.size() > bestCount && swapped.size() <= requiredCount) {
                        bestAssignments = swapped;
                        bestCount = swapped.size();
                    }
                }
            }
        }
        
        // 복원
        for (Map.Entry<String, List<EmployeeState.ScheduledSlot>> entry : savedSlots.entrySet()) {
            EmployeeState state = roleStates.get(entry.getKey());
            if (state != null) {
                state.setAssignedSlots(new ArrayList<>(entry.getValue()));
            }
        }
        
        return AssignmentResult.builder()
            .assignments(bestAssignments)
            .violations(Collections.emptyList())
            .assignedCount(bestCount)
            .build();
    }
    
    /**
     * ScheduledSlot에서 flyScheduleId 찾기
     */
    private Long findFlyScheduleId(EmployeeState.ScheduledSlot slot) {
        return slot.getFlyScheduleId();
    }
    
    /**
     * 배정 결과 (중간 단계용)
     */
    @Getter
    @Builder
    private static class AssignmentResult {
        @Builder.Default
        private List<ScheduleAssignmentResult> assignments = new ArrayList<>();
        @Builder.Default
        private List<FlightAssignmentResult.Violation> violations = new ArrayList<>();
        private int assignedCount;
    }
    
    /**
     * 하드 제약 조건 검증 (탈락 사유 반환)
     */
    private String validateHardConstraintsWithReason(
            EmployeeState employeeState,
            LocalDateTime startTime,
            LocalDateTime endTime,
            String scheduleCode
    ) {
        // 1. 시간대 중복 체크
        if (employeeState.hasTimeConflict(startTime, endTime)) {
            return "시간대_중복";
        }
        
        // 2. 최소 휴식 시간(12시간) 보장
        if (!employeeState.hasMinimumRest(startTime)) {
            return "최소_휴식_미달";
        }
        
        // 3. 연속 근무 6일 체크
        if (employeeState.getConsecutiveWorkDays() >= 6) {
            return String.format("연속_근무_6일_이상(현재_%d일)", employeeState.getConsecutiveWorkDays());
        }
        
        // 4. 연속 야간 근무 2회 체크
        if (employeeState.getConsecutiveNightShifts() >= 2 && isNightTime(startTime, endTime)) {
            return String.format("연속_야간_근무_2회_이상(현재_%d회)", employeeState.getConsecutiveNightShifts());
        }
        
        // 5. 연속 비행 3회 체크
        if (employeeState.getConsecutiveFlights() >= 3 && SCHEDULE_CODE_FLIGHT.equals(scheduleCode)) {
            return String.format("연속_비행_3회_이상(현재_%d회)", employeeState.getConsecutiveFlights());
        }
        
        // 6. 월간 비행 횟수 제한 (7~9회) - relaxFairness가 false일 때만 체크
        if (SCHEDULE_CODE_FLIGHT.equals(scheduleCode) && !employeeState.canAssignFlight()) {
            return String.format("월간_비행_횟수_초과(현재_%d회_최대_9회)", employeeState.getMonthlyFlightCount());
        }
        
        return null; // 통과
    }
    
    @Override
    public boolean validateHardConstraints(
            EmployeeState employeeState,
            LocalDateTime startTime,
            LocalDateTime endTime,
            String scheduleCode
    ) {
        return validateHardConstraintsWithReason(employeeState, startTime, endTime, scheduleCode) == null;
    }
    
    @Override
    public double calculatePenalties(
            EmployeeState employeeState,
            LocalDateTime startTime,
            String scheduleCode
    ) {
        return calculatePenalties(employeeState, startTime, scheduleCode, false);
    }
    
    /**
     * 페널티 계산 (공정성 완화 옵션 포함)
     */
    private double calculatePenalties(
            EmployeeState employeeState,
            LocalDateTime startTime,
            String scheduleCode,
            boolean relaxFairness
    ) {
        double penalties = 0.0;
        
        // 5일 연속 근무 페널티
        if (employeeState.getConsecutiveWorkDays() >= 5) {
            penalties += PENALTY_CONSECUTIVE_WORK_5DAYS;
        }
        
        // 야간 근무 연속 페널티
        if (employeeState.getConsecutiveNightShifts() >= 1 && isNightTime(startTime, null)) {
            penalties += PENALTY_CONSECUTIVE_NIGHT;
        }
        
        // 연속 비행 페널티
        if (employeeState.getConsecutiveFlights() >= 2 && SCHEDULE_CODE_FLIGHT.equals(scheduleCode)) {
            penalties += PENALTY_CONSECUTIVE_FLIGHT_3;
        }
        
        // 월간 비행 횟수 초과 페널티 (공정성 완화 시에는 적용 안 함)
        if (!relaxFairness && SCHEDULE_CODE_FLIGHT.equals(scheduleCode)) {
            int flightCount = employeeState.getMonthlyFlightCount();
            if (flightCount >= MAX_FLIGHTS_PER_MONTH) {
                penalties += PENALTY_EXCESSIVE_FLIGHTS * (flightCount - MAX_FLIGHTS_PER_MONTH + 1);
            }
        }
        
        return penalties;
    }
    
    /**
     * 배정 점수 계산 (가산점 포함)
     */
    private double calculateScoreWithBonus(EmployeeState employeeState, double penalties, boolean relaxFairness) {
        if (employeeState == null) {
            throw BusinessException.badRequest("직원 상태 정보가 없어 배정 점수를 계산할 수 없습니다.");
        }
        
        String empId = employeeState.getEmpId();
        if (empId == null || empId.isEmpty()) {
            throw BusinessException.badRequest("직원 ID가 없어 배정 점수를 계산할 수 없습니다.");
        }
        
        // 기본 점수 계산
        double baseScore = AssignmentCandidate.calculateScore(employeeState, penalties);
        
        // 공정성 보정: 월간 비행 횟수가 적은 직원에게 가산점 부여
        if (!relaxFairness) {
            try {
                int monthlyFlightCount = employeeState.getMonthlyFlightCount();
                if (monthlyFlightCount < TARGET_FLIGHTS_PER_MONTH) {
                    double fairnessBonus = (TARGET_FLIGHTS_PER_MONTH - monthlyFlightCount) * FAIRNESS_BONUS_MULTIPLIER;
                    baseScore += fairnessBonus;
                }
            } catch (Exception e) {
                log.error("공정성 가산점 계산 중 오류 발생 - empId: {}", empId, e);
            }
        }
        
        return baseScore;
    }
    
    /**
     * 야간 시간대 체크 (22:00 ~ 06:00)
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
