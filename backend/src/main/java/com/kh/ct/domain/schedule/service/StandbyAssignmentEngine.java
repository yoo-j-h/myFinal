package com.kh.ct.domain.schedule.service;

import com.kh.ct.domain.schedule.entity.AllSchedule;
import com.kh.ct.domain.schedule.entity.FlySchedule;
import com.kh.ct.global.common.CommonEnums;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

/**
 * STANDBY/OFF 배정 엔진
 * 비행 일정에 배정되지 않은 PILOT/CABIN_CREW에게 STANDBY 또는 OFF 배정
 * 
 * 주요 정책:
 * 1. STANDBY 목표 인원은 동적으로 계산 (미배정 인원 수 또는 비행편 수 기반)
 * 2. OFF는 강제 휴무가 필요한 경우에만 생성 (5~6일 연속 근무, 장거리/야간 비행 후 등)
 * 3. 나머지 미배정 인원은 DB에 저장하지 않음 (UI에서 빈 날 = 휴무로 표시)
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class StandbyAssignmentEngine {
    
    private final com.kh.ct.domain.schedule.repository.FlyScheduleRepository flyScheduleRepository;
    
    private static final String SCHEDULE_CODE_STANDBY = "STANDBY";
    private static final String SCHEDULE_CODE_OFF = "OFF";
    
    // STANDBY 배정 최소 인원
    private static final int MIN_STANDBY_COUNT = 4;
    // STANDBY 배정 최대 인원 (미배정 인원의 최대 비율)
    private static final int MAX_STANDBY_RATIO_PERCENT = 20; // 20%
    
    // STANDBY 목표 인원 계산 방식 (옵션)
    // OPTION_1: 미배정 인원 기반 (기본값)
    private static final double STANDBY_RATIO_BY_CREW = 0.15; // 미배정 인원의 15%
    // OPTION_2: 비행편 수 기반
    private static final double STANDBY_RATIO_BY_FLIGHT = 0.30; // 비행편 수의 30%
    
    // 월간 STANDBY 배정 상한 (공정성 보장)
    private static final int MAX_MONTHLY_STANDBY_COUNT = 5;
    
    /**
     * 비행 미배정 인원에게 STANDBY/OFF 배정
     * 
     * @param yearMonth 배정할 년월
     * @param employeeStates 직원 상태 맵 (비행 배정 후 업데이트된 상태)
     * @param airlineId 항공사 ID
     * @return 배정 결과 리스트
     */
    public List<ScheduleAssignmentResult> assignStandbyAndOff(
            YearMonth yearMonth,
            Map<String, EmployeeState> employeeStates,
            Long airlineId
    ) {
        log.info("STANDBY/OFF 배정 시작 - yearMonth: {}, airlineId: {}", yearMonth, airlineId);
        
        // PILOT, CABIN_CREW 역할만 필터링
        Map<String, EmployeeState> flightCrewStates = employeeStates.entrySet().stream()
            .filter(entry -> {
                CommonEnums.Role role = entry.getValue().getRole();
                return role == CommonEnums.Role.PILOT || role == CommonEnums.Role.CABIN_CREW;
            })
            .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
        
        log.info("비행 승무원 총 인원: {}명 (PILOT/CABIN_CREW)", flightCrewStates.size());
        
        // 월별 비행편 목록 미리 로드 (날짜별 비행편 수 계산용)
        LocalDateTime monthStart = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime monthEnd = yearMonth.atEndOfMonth().atTime(23, 59, 59);
        List<FlySchedule> monthlyFlights = flyScheduleRepository.findByDateRange(
            airlineId, monthStart, monthEnd
        );
        
        // 날짜별 비행편 수 맵 생성
        Map<LocalDate, Long> flightsPerDay = monthlyFlights.stream()
            .collect(Collectors.groupingBy(
                flight -> flight.getFlyStartTime() != null ? 
                    flight.getFlyStartTime().toLocalDate() : null,
                Collectors.counting()
            ));
        
        log.info("월별 비행편 수: {}건", monthlyFlights.size());
        
        List<ScheduleAssignmentResult> results = new ArrayList<>();
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();
        
        // 월별 통계 집계용
        Map<CommonEnums.Role, Map<String, Integer>> monthlyStats = new HashMap<>();
        monthlyStats.put(CommonEnums.Role.PILOT, new HashMap<>());
        monthlyStats.put(CommonEnums.Role.CABIN_CREW, new HashMap<>());
        
        // 날짜별로 미배정 인원 처리
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            final LocalDate currentDate = date;
            final LocalDateTime dateStart = date.atStartOfDay();
            final LocalDateTime dateEnd = date.atTime(23, 59, 59);
            
            // 해당 날짜에 배정되지 않은 직원 목록
            List<Map.Entry<String, EmployeeState>> unassignedEmployees = flightCrewStates.entrySet().stream()
                .filter(entry -> {
                    EmployeeState state = entry.getValue();
                    // 해당 날짜에 이미 배정된 일정이 있는지 확인
                    return !state.getAssignedSlots().stream()
                        .anyMatch(slot -> {
                            LocalDateTime slotStart = slot.getStartTime();
                            LocalDateTime slotEnd = slot.getEndTime();
                            // 슬롯이 해당 날짜와 겹치는지 확인
                            return (slotStart.toLocalDate().equals(currentDate) || 
                                    slotEnd.toLocalDate().equals(currentDate) ||
                                    (slotStart.isBefore(dateEnd) && slotEnd.isAfter(dateStart)));
                        });
                })
                .collect(Collectors.toList());
            
            if (unassignedEmployees.isEmpty()) {
                continue; // 모든 직원이 배정된 날짜는 스킵
            }
            
            // healthScore가 높은 순으로 정렬
            unassignedEmployees.sort((e1, e2) -> {
                Integer score1 = e1.getValue().getHealthScore() != null ? 
                    e1.getValue().getHealthScore() : 0;
                Integer score2 = e2.getValue().getHealthScore() != null ? 
                    e2.getValue().getHealthScore() : 0;
                return Integer.compare(score2, score1); // 내림차순
            });
            
            // OFF 우선 배정 대상 분리
            List<Map.Entry<String, EmployeeState>> offCandidates = new ArrayList<>();
            List<Map.Entry<String, EmployeeState>> standbyCandidates = new ArrayList<>();
            
            for (Map.Entry<String, EmployeeState> entry : unassignedEmployees) {
                if (entry == null || entry.getKey() == null || entry.getValue() == null) {
                    log.warn("유효하지 않은 직원 항목 발견 - 건너뜀");
                    continue;
                }
                
                EmployeeState state = entry.getValue();
                boolean shouldBeOff = false;
                
                try {
                    // 1. 6일 연속 근무 시 7일째는 반드시 OFF (Hard Constraint)
                    if (state.getConsecutiveWorkDays() >= 6) {
                        shouldBeOff = true;
                        log.debug("연속 근무 6일 이상 - OFF 강제 배정. empId: {}, consecutiveWorkDays: {}", 
                            entry.getKey(), state.getConsecutiveWorkDays());
                    }
                    // 2. 5일 연속 근무 시 OFF 우선
                    else if (state.getConsecutiveWorkDays() >= 5) {
                        shouldBeOff = true;
                        log.debug("연속 근무 5일 - OFF 우선 배정. empId: {}, consecutiveWorkDays: {}", 
                            entry.getKey(), state.getConsecutiveWorkDays());
                    }
                    // 3. 장거리 비행(8시간 이상) 후 다음 날 OFF 우선
                    else if (Boolean.TRUE.equals(state.getLastFlightWasLongDistance())) {
                        LocalDate lastFlightDate = state.getLastFlightEndTime() != null ? 
                            state.getLastFlightEndTime().toLocalDate() : null;
                        if (lastFlightDate != null && currentDate.equals(lastFlightDate.plusDays(1))) {
                            shouldBeOff = true;
                            log.debug("장거리 비행 후 다음 날 - OFF 우선 배정. empId: {}, lastFlightDate: {}", 
                                entry.getKey(), lastFlightDate);
                        }
                    }
                    // 4. 야간 비행 후 다음 날 OFF 우선
                    else if (Boolean.TRUE.equals(state.getLastFlightWasNight())) {
                        LocalDate lastFlightDate = state.getLastFlightEndTime() != null ? 
                            state.getLastFlightEndTime().toLocalDate() : null;
                        if (lastFlightDate != null && currentDate.equals(lastFlightDate.plusDays(1))) {
                            shouldBeOff = true;
                            log.debug("야간 비행 후 다음 날 - OFF 우선 배정. empId: {}, lastFlightDate: {}", 
                                entry.getKey(), lastFlightDate);
                        }
                    }
                    // 5. 연속 스탠바이 3일 이상 시 OFF 우선
                    else if (state.getConsecutiveStandbyDays() >= 3) {
                        shouldBeOff = true;
                        log.debug("연속 스탠바이 3일 이상 - OFF 우선 배정. empId: {}, consecutiveStandbyDays: {}", 
                            entry.getKey(), state.getConsecutiveStandbyDays());
                    }
                } catch (Exception e) {
                    log.error("직원 상태 확인 중 오류 발생 - empId: {}, error: {}", 
                        entry.getKey(), e.getMessage(), e);
                    // 오류 발생 시 기본적으로 standbyCandidates에 추가
                    standbyCandidates.add(entry);
                    continue;
                }
                
                if (shouldBeOff) {
                    offCandidates.add(entry);
                } else {
                    standbyCandidates.add(entry);
                }
            }
            
            // 1. OFF 배정 (강제 OFF 대상자)
            for (Map.Entry<String, EmployeeState> entry : offCandidates) {
                String empId = entry.getKey();
                EmployeeState state = entry.getValue();
                
                LocalDateTime offStart = currentDate.atTime(0, 0);
                LocalDateTime offEnd = currentDate.atTime(23, 59, 59);
                
                AllSchedule offSchedule = AllSchedule.builder()
                    .scheduleCode(SCHEDULE_CODE_OFF)
                    .startDate(offStart)
                    .endDate(offEnd)
                    .build();
                
                state.addAssignedSlot(offStart, offEnd, SCHEDULE_CODE_OFF);
                // OFF 배정 시 연속 근무일 초기화
                state.resetConsecutiveWorkDays();
                
                results.add(ScheduleAssignmentResult.builder()
                    .empId(empId)
                    .allSchedule(offSchedule)
                    .scheduleCode(SCHEDULE_CODE_OFF)
                    .startTime(offStart)
                    .endTime(offEnd)
                    .build());
            }
            
            // 2. STANDBY 배정 (동적 목표 인원 계산)
            int targetDailyStandby = calculateStandbyTarget(
                unassignedEmployees.size(), 
                flightsPerDay.getOrDefault(currentDate, 0L).intValue(),
                currentDate
            );
            
            log.info("날짜 {} STANDBY 목표 인원 계산 - 미배정: {}명, 비행편: {}건, 목표: {}명", 
                currentDate, unassignedEmployees.size(), 
                flightsPerDay.getOrDefault(currentDate, 0L), targetDailyStandby);
            
            // 스탠바이 과다 배정자(월간 상한 초과)는 제외하고 정렬
            List<Map.Entry<String, EmployeeState>> standbyEligible = standbyCandidates.stream()
                .filter(entry -> entry.getValue().getTotalStandbyCount() < MAX_MONTHLY_STANDBY_COUNT) // 월간 상한 미만만 선정
                .sorted((e1, e2) -> {
                    // healthScore 높은 순, 스탠바이 횟수 적은 순
                    Integer score1 = e1.getValue().getHealthScore() != null ? 
                        e1.getValue().getHealthScore() : 0;
                    Integer score2 = e2.getValue().getHealthScore() != null ? 
                        e2.getValue().getHealthScore() : 0;
                    int scoreCompare = Integer.compare(score2, score1); // 내림차순
                    if (scoreCompare != 0) {
                        return scoreCompare;
                    }
                    // healthScore가 같으면 스탠바이 횟수가 적은 순
                    return Integer.compare(e1.getValue().getTotalStandbyCount(), 
                                         e2.getValue().getTotalStandbyCount());
                })
                .collect(Collectors.toList());
            
            int standbyCount = 0;
            List<CommonEnums.Role> assignedStandbyRoles = new ArrayList<>(); // 배정된 STANDBY 역할 추적
            
            for (Map.Entry<String, EmployeeState> entry : standbyEligible) {
                if (standbyCount >= targetDailyStandby) {
                    break; // 일일 목표 인원 도달
                }
                
                if (entry == null || entry.getKey() == null || entry.getValue() == null) {
                    log.warn("유효하지 않은 STANDBY 배정 항목 발견 - 건너뜀");
                    continue;
                }
                
                try {
                    String empId = entry.getKey();
                    EmployeeState state = entry.getValue();
                    
                    LocalDateTime standbyStart = currentDate.atTime(9, 0);
                    LocalDateTime standbyEnd = currentDate.atTime(18, 0);
                    
                    AllSchedule standbySchedule = AllSchedule.builder()
                        .scheduleCode(SCHEDULE_CODE_STANDBY)
                        .startDate(standbyStart)
                        .endDate(standbyEnd)
                        .build();
                    
                    state.addAssignedSlot(standbyStart, standbyEnd, SCHEDULE_CODE_STANDBY);
                    // STANDBY는 근무일로 카운트 (연속 근무일 증가)
                    state.updateConsecutiveWorkDays(currentDate);
                    
                    results.add(ScheduleAssignmentResult.builder()
                        .empId(empId)
                        .allSchedule(standbySchedule)
                        .scheduleCode(SCHEDULE_CODE_STANDBY)
                        .startTime(standbyStart)
                        .endTime(standbyEnd)
                        .build());
                    
                    // 배정된 역할 추적
                    assignedStandbyRoles.add(state.getRole());
                    standbyCount++;
                } catch (Exception e) {
                    log.error("STANDBY 배정 중 오류 발생 - empId: {}, error: {}", 
                        entry.getKey(), e.getMessage(), e);
                }
            }
            
            // 3. 나머지 미배정 인원을 OFF로 채우기 (운항직은 매일 스케줄이 있어야 함)
            // 이미 배정된 인원(offCandidates, standbyEligible에서 실제 배정된 인원) 제외
            Set<String> assignedEmpIds = new HashSet<>();
            for (Map.Entry<String, EmployeeState> entry : offCandidates) {
                assignedEmpIds.add(entry.getKey());
            }
            for (int i = 0; i < standbyCount && i < standbyEligible.size(); i++) {
                assignedEmpIds.add(standbyEligible.get(i).getKey());
            }
            
            // 실제로 미배정된 인원만 필터링
            List<Map.Entry<String, EmployeeState>> trulyUnassigned = unassignedEmployees.stream()
                .filter(entry -> !assignedEmpIds.contains(entry.getKey()))
                .filter(entry -> {
                    EmployeeState state = entry.getValue();
                    // 해당 날짜에 배정된 일정이 없는지 다시 한번 확인
                    return !state.getAssignedSlots().stream()
                        .anyMatch(slot -> {
                            LocalDateTime slotStart = slot.getStartTime();
                            LocalDateTime slotEnd = slot.getEndTime();
                            return (slotStart.toLocalDate().equals(currentDate) || 
                                    slotEnd.toLocalDate().equals(currentDate) ||
                                    (slotStart.isBefore(dateEnd) && slotEnd.isAfter(dateStart)));
                        });
                })
                .collect(Collectors.toList());
            
            // 미배정 인원 수 로깅
            log.info("날짜 {} 운항직 미배정 인원: {}명 (전체 미배정: {}명, OFF 강제: {}명, STANDBY: {}명)", 
                currentDate, trulyUnassigned.size(), unassignedEmployees.size(), 
                offCandidates.size(), standbyCount);
            
            // 미배정 인원을 OFF로 배정
            for (Map.Entry<String, EmployeeState> entry : trulyUnassigned) {
                String empId = entry.getKey();
                EmployeeState state = entry.getValue();
                
                LocalDateTime offStart = currentDate.atTime(0, 0);
                LocalDateTime offEnd = currentDate.atTime(23, 59, 59);
                
                AllSchedule offSchedule = AllSchedule.builder()
                    .scheduleCode(SCHEDULE_CODE_OFF)
                    .startDate(offStart)
                    .endDate(offEnd)
                    .build();
                
                state.addAssignedSlot(offStart, offEnd, SCHEDULE_CODE_OFF);
                // OFF 배정 시 연속 근무일 초기화
                state.resetConsecutiveWorkDays();
                
                results.add(ScheduleAssignmentResult.builder()
                    .empId(empId)
                    .allSchedule(offSchedule)
                    .scheduleCode(SCHEDULE_CODE_OFF)
                    .startTime(offStart)
                    .endTime(offEnd)
                    .build());
            }
            
            // 통계 업데이트
            for (Map.Entry<String, EmployeeState> entry : offCandidates) {
                CommonEnums.Role role = entry.getValue().getRole();
                monthlyStats.get(role).merge("OFF", 1, Integer::sum);
            }
            for (Map.Entry<String, EmployeeState> entry : trulyUnassigned) {
                CommonEnums.Role role = entry.getValue().getRole();
                monthlyStats.get(role).merge("OFF", 1, Integer::sum);
            }
            for (CommonEnums.Role role : assignedStandbyRoles) {
                monthlyStats.get(role).merge("STANDBY", 1, Integer::sum);
            }
            
            log.info("날짜 {} 배정 완료 - OFF 강제: {}명, OFF(미배정): {}명, STANDBY: {}명, 총 OFF: {}명", 
                currentDate, offCandidates.size(), trulyUnassigned.size(), standbyCount,
                offCandidates.size() + trulyUnassigned.size());
        }
        
        // 월별 통계 로깅
        logMonthlyStatistics(monthlyStats, yearMonth);
        
        log.info("STANDBY/OFF 배정 완료 - 총 {}건 배정 (OFF: {}건, STANDBY: {}건)", 
            results.size(),
            results.stream().filter(r -> SCHEDULE_CODE_OFF.equals(r.getScheduleCode())).count(),
            results.stream().filter(r -> SCHEDULE_CODE_STANDBY.equals(r.getScheduleCode())).count()
        );
        
        return results;
    }
    
    /**
     * STANDBY 목표 인원 계산 (동적)
     * 
     * 계산 방식 옵션:
     * 1. 미배정 인원 기반: ceil(dailyEligibleCrew * 0.15)
     * 2. 비행편 수 기반: ceil(flightsThatDay * 0.30)
     * 3. 하이브리드: max(옵션1, 옵션2)
     * 
     * 최종값은 min=3, max=ceil(dailyEligibleCrew * 0.20) 범위 내로 clamp
     * 
     * @param dailyEligibleCrew 해당 날짜에 배정 가능한 승무원 수
     * @param flightsThatDay 해당 날짜의 비행편 수
     * @param date 날짜 (로깅용)
     * @return STANDBY 목표 인원
     */
    private int calculateStandbyTarget(int dailyEligibleCrew, int flightsThatDay, LocalDate date) {
        if (dailyEligibleCrew <= 0) {
            return 0;
        }
        
        // 옵션 1: 미배정 인원 기반
        int targetByCrew = (int) Math.ceil(dailyEligibleCrew * STANDBY_RATIO_BY_CREW);
        
        // 옵션 2: 비행편 수 기반
        int targetByFlight = (int) Math.ceil(flightsThatDay * STANDBY_RATIO_BY_FLIGHT);
        
        // 옵션 3: 하이브리드 (두 값 중 큰 값 사용)
        int targetHybrid = Math.max(targetByCrew, targetByFlight);
        
        // 최소값 보장
        int target = Math.max(MIN_STANDBY_COUNT, targetHybrid);
        
        // 최대값 제한 (미배정 인원의 20% 이하)
        int maxTarget = (int) Math.ceil(dailyEligibleCrew * MAX_STANDBY_RATIO_PERCENT / 100.0);
        target = Math.min(target, maxTarget);
        
        // 최종값은 dailyEligibleCrew를 초과하지 않도록
        target = Math.min(target, dailyEligibleCrew);
        
        log.debug("날짜 {} STANDBY 목표 계산 - 인원기반: {}, 비행편기반: {}, 하이브리드: {}, 최종: {}", 
            date, targetByCrew, targetByFlight, targetHybrid, target);
        
        return target;
    }
    
    /**
     * 월별 통계 로깅
     */
    private void logMonthlyStatistics(
            Map<CommonEnums.Role, Map<String, Integer>> monthlyStats,
            YearMonth yearMonth
    ) {
        log.info("=== {}월 STANDBY/OFF 배정 통계 ===", yearMonth);
        
        for (CommonEnums.Role role : Arrays.asList(
            CommonEnums.Role.PILOT, 
            CommonEnums.Role.CABIN_CREW
        )) {
            Map<String, Integer> roleStats = monthlyStats.get(role);
            if (roleStats != null) {
                int offCount = roleStats.getOrDefault("OFF", 0);
                int standbyCount = roleStats.getOrDefault("STANDBY", 0);
                log.info("{} - OFF: {}건, STANDBY: {}건, 총: {}건", 
                    role, offCount, standbyCount, offCount + standbyCount);
            }
        }
        
        log.info("=== 월별 통계 종료 ===");
    }
}
