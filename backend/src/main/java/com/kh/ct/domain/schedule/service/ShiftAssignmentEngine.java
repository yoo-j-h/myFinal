package com.kh.ct.domain.schedule.service;

import com.kh.ct.domain.schedule.entity.AllSchedule;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 교대 근무 배정 엔진 (재구현)
 * 
 * 핵심 요구사항:
 * 1. 날짜별 PART1/PART2/PART3 각각 3명씩 (직군별)
 * 2. 주 4~5일 근무 (가능한 범위에서, 운영조건 우선)
 * 3. 편향 방지 (특정 파트만 몰리지 않게)
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ShiftAssignmentEngine implements AssignmentEngine {
    
    // 스케줄 코드 상수
    private static final String SCHEDULE_CODE_SHIFT_D = "SHIFT_D"; // 주간 (PART1)
    private static final String SCHEDULE_CODE_SHIFT_E = "SHIFT_E"; // 저녁 (PART2)
    private static final String SCHEDULE_CODE_SHIFT_N = "SHIFT_N"; // 야간 (PART3)
    private static final String SCHEDULE_CODE_OFF = "OFF";
    
    // 교대 시간 설정 (요구사항 기준)
    private static final int PART1_START = 9;   // 09:00
    private static final int PART1_END = 18;     // 18:00
    private static final int PART2_START = 15;   // 15:00
    private static final int PART2_END = 1;      // 익일 01:00
    private static final int PART3_START = 1;   // 01:00
    private static final int PART3_END = 9;      // 09:00
    
    // 운영 인력 기준 (파트당 3명)
    private static final int REQUIRED_STAFF_PER_SHIFT = 3;
    
    // 페널티 가중치
    private static final double PENALTY_CONSECUTIVE_WORK_5DAYS = 20.0;
    private static final double PENALTY_CONSECUTIVE_NIGHT = 15.0;
    
    @Override
    public List<ScheduleAssignmentResult> assignSchedules(
            YearMonth yearMonth,
            Map<String, EmployeeState> employeeStates,
            Long airlineId
    ) {
        log.info("========================================");
        log.info("교대 근무 배정 시작 - yearMonth: {}, airlineId: {}", yearMonth, airlineId);
        log.info("========================================");
        
        // GROUND_STAFF, MAINTENANCE 역할만 필터링
        Map<String, EmployeeState> groundStaffStates = employeeStates.entrySet().stream()
            .filter(entry -> {
                com.kh.ct.global.common.CommonEnums.Role role = entry.getValue().getRole();
                return role == com.kh.ct.global.common.CommonEnums.Role.GROUND_STAFF || 
                       role == com.kh.ct.global.common.CommonEnums.Role.MAINTENANCE;
            })
            .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
        
        log.info("지상직 직원 수: {}명 (GROUND_STAFF/MAINTENANCE)", groundStaffStates.size());
        
        // 직군별로 분리 (직군별로 각각 3명씩 배정)
        Map<com.kh.ct.global.common.CommonEnums.Role, Map<String, EmployeeState>> roleGroups = new HashMap<>();
        for (Map.Entry<String, EmployeeState> entry : groundStaffStates.entrySet()) {
            com.kh.ct.global.common.CommonEnums.Role role = entry.getValue().getRole();
            roleGroups.computeIfAbsent(role, k -> new HashMap<>()).put(entry.getKey(), entry.getValue());
        }
        
        List<ScheduleAssignmentResult> allAssignments = new ArrayList<>();
        
        // 직군별로 배정
        for (Map.Entry<com.kh.ct.global.common.CommonEnums.Role, Map<String, EmployeeState>> roleGroup : roleGroups.entrySet()) {
            com.kh.ct.global.common.CommonEnums.Role role = roleGroup.getKey();
            Map<String, EmployeeState> roleStates = roleGroup.getValue();
            
            log.info("직군 {} 배정 시작 - {}명", role, roleStates.size());
            
            List<ScheduleAssignmentResult> roleAssignments = assignShiftsForRole(
                yearMonth, roleStates, role
            );
            
            allAssignments.addAll(roleAssignments);
            log.info("직군 {} 배정 완료 - {}건", role, roleAssignments.size());
        }
        
        log.info("교대 근무 배정 완료 - 총 {}건 배정", allAssignments.size());
        return allAssignments;
    }
    
    /**
     * 직군별 교대 근무 배정
     */
    private List<ScheduleAssignmentResult> assignShiftsForRole(
            YearMonth yearMonth,
            Map<String, EmployeeState> roleStates,
            com.kh.ct.global.common.CommonEnums.Role role
    ) {
        List<ScheduleAssignmentResult> allAssignments = new ArrayList<>();
        
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();
        
        // 날짜별로 처리 (운영 인력 기준 우선)
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            // 1. PART1 배정 (3명)
            List<ScheduleAssignmentResult> part1Assignments = assignShiftForDate(
                date, SCHEDULE_CODE_SHIFT_D, PART1_START, PART1_END, roleStates, role
            );
            allAssignments.addAll(part1Assignments);
            
            // 2. PART2 배정 (3명)
            List<ScheduleAssignmentResult> part2Assignments = assignShiftForDate(
                date, SCHEDULE_CODE_SHIFT_E, PART2_START, PART2_END, roleStates, role
            );
            allAssignments.addAll(part2Assignments);
            
            // 3. PART3 배정 (3명)
            List<ScheduleAssignmentResult> part3Assignments = assignShiftForDate(
                date, SCHEDULE_CODE_SHIFT_N, PART3_START, PART3_END, roleStates, role
            );
            allAssignments.addAll(part3Assignments);
        }
        
        // 주 단위 근무일수 조정 (4~5일 목표, 가능한 범위에서)
        adjustWeeklyWorkDays(yearMonth, roleStates, allAssignments);
        
        // 미배정 날짜를 OFF로 채우기
        fillOffDays(yearMonth, roleStates, allAssignments);
        
        return allAssignments;
    }
    
    /**
     * 특정 날짜의 특정 교대에 직원 배정 (파트당 3명)
     */
    private List<ScheduleAssignmentResult> assignShiftForDate(
            LocalDate date,
            String shiftCode,
            int startHour,
            int endHour,
            Map<String, EmployeeState> roleStates,
            com.kh.ct.global.common.CommonEnums.Role role
    ) {
        LocalDateTime shiftStart = date.atTime(startHour, 0);
        LocalDateTime shiftEnd;
        
        // 야간 교대(PART3)는 다음날까지
        if (SCHEDULE_CODE_SHIFT_N.equals(shiftCode)) {
            shiftEnd = date.plusDays(1).atTime(PART3_END, 0);
        } else if (SCHEDULE_CODE_SHIFT_E.equals(shiftCode)) {
            // PART2는 익일 01:00까지
            shiftEnd = date.plusDays(1).atTime(PART2_END, 0);
        } else {
            shiftEnd = date.atTime(endHour, 0);
        }
        
        // PriorityQueue로 후보자 선정 (편향 방지: 교대별 배정 횟수가 적은 직원 우선)
        PriorityQueue<AssignmentCandidate> candidates = new PriorityQueue<>();
        
        for (Map.Entry<String, EmployeeState> entry : roleStates.entrySet()) {
            EmployeeState state = entry.getValue();
            
            // 하드 제약 조건 검증
            if (!validateHardConstraints(state, shiftStart, shiftEnd, shiftCode)) {
                continue;
            }
            
            // 해당 날짜에 이미 배정이 있으면 제외
            if (state.hasAssignmentOnDate(date)) {
                continue;
            }
            
            // 페널티 계산
            double penalties = calculatePenalties(state, shiftStart, shiftCode);
            
            // 편향 방지 보너스: 해당 교대 배정 횟수가 적은 직원에게 가산점
            int shiftCount = state.getShiftCountMap().getOrDefault(shiftCode, 0);
            double fairnessBonus = (10.0 - shiftCount) * 2.0; // 배정 횟수가 적을수록 높은 점수
            
            // 점수 계산
            double score = AssignmentCandidate.calculateScore(state, penalties) + fairnessBonus;
            
            candidates.offer(AssignmentCandidate.builder()
                .empId(entry.getKey())
                .employeeState(state)
                .assignScore(score)
                .build());
        }
        
        // 상위 3명 선택하여 배정
        List<ScheduleAssignmentResult> assignments = new ArrayList<>();
        int assignedCount = 0;
        
        while (!candidates.isEmpty() && assignedCount < REQUIRED_STAFF_PER_SHIFT) {
            AssignmentCandidate candidate = candidates.poll();
            EmployeeState state = candidate.getEmployeeState();
            
            // 중복 체크 (다시 한번)
            if (state.hasTimeConflict(shiftStart, shiftEnd)) {
                continue;
            }
            
            // 해당 날짜에 이미 배정이 있으면 제외
            if (state.hasAssignmentOnDate(date)) {
                continue;
            }
            
            // AllSchedule 생성
            AllSchedule allSchedule = AllSchedule.builder()
                .scheduleCode(shiftCode)
                .startDate(shiftStart)
                .endDate(shiftEnd)
                .build();
            
            // 상태 업데이트
            state.updateConsecutiveWorkDays(date);
            boolean isNightShift = SCHEDULE_CODE_SHIFT_N.equals(shiftCode);
            state.updateConsecutiveNightShifts(isNightShift);
            state.addAssignedSlot(shiftStart, shiftEnd, shiftCode);
            state.incrementShiftCount(shiftCode);
            
            // 배정 결과 생성
            ScheduleAssignmentResult result = ScheduleAssignmentResult.builder()
                .empId(candidate.getEmpId())
                .allSchedule(allSchedule)
                .scheduleCode(shiftCode)
                .startTime(shiftStart)
                .endTime(shiftEnd)
                .shiftType(shiftCode)
                .build();
            
            assignments.add(result);
            assignedCount++;
        }
        
        if (assignedCount < REQUIRED_STAFF_PER_SHIFT) {
            log.warn("날짜 {} 교대 {} 배정 부족 - 필요: {}명, 배정: {}명", 
                date, shiftCode, REQUIRED_STAFF_PER_SHIFT, assignedCount);
        }
        
        return assignments;
    }
    
    /**
     * 주 단위 근무일수 조정 (4~5일 목표, 가능한 범위에서)
     */
    private void adjustWeeklyWorkDays(
            YearMonth yearMonth,
            Map<String, EmployeeState> roleStates,
            List<ScheduleAssignmentResult> allAssignments
    ) {
        LocalDate monthStart = yearMonth.atDay(1);
        LocalDate monthEnd = yearMonth.atEndOfMonth();
        
        // 첫 주의 월요일 찾기
        LocalDate weekStart = monthStart;
        int dayOfWeek = weekStart.getDayOfWeek().getValue();
        if (dayOfWeek != 1) {
            weekStart = weekStart.minusDays(dayOfWeek - 1);
        }
        
        // 주 단위로 처리
        while (!weekStart.isAfter(monthEnd)) {
            LocalDate weekEnd = weekStart.plusDays(6);
            if (weekEnd.isAfter(monthEnd)) {
                weekEnd = monthEnd;
            }
            
            // 각 직원의 주별 근무일수 확인 및 조정
            for (Map.Entry<String, EmployeeState> entry : roleStates.entrySet()) {
                String empId = entry.getKey();
                EmployeeState state = entry.getValue();
                
                int weeklyWorkDays = state.getWeeklyWorkDays(weekStart);
                
                // 주 4~5일 목표
                if (weeklyWorkDays < 4) {
                    // 부족한 날짜에 근무 배정 시도
                    for (LocalDate date = weekStart; !date.isAfter(weekEnd); date = date.plusDays(1)) {
                        if (state.hasAssignmentOnDate(date)) {
                            continue; // 이미 배정됨
                        }
                        
                        // 가장 적게 배정된 교대 선택
                        String shiftCode = selectShiftTypeForFairness(state);
                        int startHour = getStartHour(shiftCode);
                        int endHour = getEndHour(shiftCode);
                        
                        LocalDateTime shiftStart = date.atTime(startHour, 0);
                        LocalDateTime shiftEnd = getShiftEndTime(date, shiftCode, startHour, endHour);
                        
                        if (validateHardConstraints(state, shiftStart, shiftEnd, shiftCode)) {
                            AllSchedule allSchedule = AllSchedule.builder()
                                .scheduleCode(shiftCode)
                                .startDate(shiftStart)
                                .endDate(shiftEnd)
                                .build();
                            
                            state.updateConsecutiveWorkDays(date);
                            boolean isNightShift = SCHEDULE_CODE_SHIFT_N.equals(shiftCode);
                            state.updateConsecutiveNightShifts(isNightShift);
                            state.addAssignedSlot(shiftStart, shiftEnd, shiftCode);
                            state.incrementShiftCount(shiftCode);
                            state.updateWeeklyWorkDays(weekStart);
                            
                            allAssignments.add(ScheduleAssignmentResult.builder()
                                .empId(empId)
                                .allSchedule(allSchedule)
                                .scheduleCode(shiftCode)
                                .startTime(shiftStart)
                                .endTime(shiftEnd)
                                .shiftType(shiftCode)
                                .build());
                            
                            weeklyWorkDays++;
                            if (weeklyWorkDays >= 4) {
                                break;
                            }
                        }
                    }
                } else if (weeklyWorkDays > 5) {
                    // 초과한 날짜의 근무를 OFF로 변경 시도
                    // (운영조건 우선이므로 실제로는 변경하지 않음, violations에 기록)
                    log.warn("직원 {}의 주 {} 근무일수 초과: {}일 (목표: 4~5일)", 
                        empId, weekStart, weeklyWorkDays);
                }
            }
            
            weekStart = weekStart.plusWeeks(1);
        }
    }
    
    /**
     * 미배정 날짜를 OFF로 채우기
     */
    private void fillOffDays(
            YearMonth yearMonth,
            Map<String, EmployeeState> roleStates,
            List<ScheduleAssignmentResult> allAssignments
    ) {
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();
        
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            for (Map.Entry<String, EmployeeState> entry : roleStates.entrySet()) {
                String empId = entry.getKey();
                EmployeeState state = entry.getValue();
                
                if (!state.hasAssignmentOnDate(date)) {
                    LocalDateTime offStart = date.atTime(0, 0);
                    LocalDateTime offEnd = date.atTime(23, 59, 59);
                    
                    AllSchedule offSchedule = AllSchedule.builder()
                        .scheduleCode(SCHEDULE_CODE_OFF)
                        .startDate(offStart)
                        .endDate(offEnd)
                        .build();
                    
                    state.addAssignedSlot(offStart, offEnd, SCHEDULE_CODE_OFF);
                    state.resetConsecutiveWorkDays();
                    
                    allAssignments.add(ScheduleAssignmentResult.builder()
                        .empId(empId)
                        .allSchedule(offSchedule)
                        .scheduleCode(SCHEDULE_CODE_OFF)
                        .startTime(offStart)
                        .endTime(offEnd)
                        .build());
                }
            }
        }
    }
    
    /**
     * 편향 방지를 위한 교대 타입 선택
     */
    private String selectShiftTypeForFairness(EmployeeState state) {
        int shiftDCount = state.getShiftCountMap().getOrDefault(SCHEDULE_CODE_SHIFT_D, 0);
        int shiftECount = state.getShiftCountMap().getOrDefault(SCHEDULE_CODE_SHIFT_E, 0);
        int shiftNCount = state.getShiftCountMap().getOrDefault(SCHEDULE_CODE_SHIFT_N, 0);
        
        if (shiftDCount <= shiftECount && shiftDCount <= shiftNCount) {
            return SCHEDULE_CODE_SHIFT_D;
        } else if (shiftECount <= shiftNCount) {
            return SCHEDULE_CODE_SHIFT_E;
        } else {
            return SCHEDULE_CODE_SHIFT_N;
        }
    }
    
    private int getStartHour(String shiftCode) {
        if (SCHEDULE_CODE_SHIFT_D.equals(shiftCode)) {
            return PART1_START;
        } else if (SCHEDULE_CODE_SHIFT_E.equals(shiftCode)) {
            return PART2_START;
        } else {
            return PART3_START;
        }
    }
    
    private int getEndHour(String shiftCode) {
        if (SCHEDULE_CODE_SHIFT_D.equals(shiftCode)) {
            return PART1_END;
        } else if (SCHEDULE_CODE_SHIFT_E.equals(shiftCode)) {
            return PART2_END;
        } else {
            return PART3_END;
        }
    }
    
    private LocalDateTime getShiftEndTime(LocalDate date, String shiftCode, int startHour, int endHour) {
        if (SCHEDULE_CODE_SHIFT_N.equals(shiftCode)) {
            return date.plusDays(1).atTime(PART3_END, 0);
        } else if (SCHEDULE_CODE_SHIFT_E.equals(shiftCode)) {
            return date.plusDays(1).atTime(PART2_END, 0);
        } else {
            return date.atTime(endHour, 0);
        }
    }
    
    @Override
    public boolean validateHardConstraints(
            EmployeeState employeeState,
            LocalDateTime startTime,
            LocalDateTime endTime,
            String scheduleCode
    ) {
        // 1. 시간대 중복 체크
        if (employeeState.hasTimeConflict(startTime, endTime)) {
            return false;
        }
        
        // 2. 최소 휴식 시간(12시간) 보장
        if (!employeeState.hasMinimumRest(startTime)) {
            return false;
        }
        
        // 3. 연속 근무 6일 체크 (7일 연속 근무 방지)
        if (employeeState.getConsecutiveWorkDays() >= 6) {
            return false;
        }
        
        // 4. 연속 야간 근무 2회 체크
        if (employeeState.getConsecutiveNightShifts() >= 2 && 
            SCHEDULE_CODE_SHIFT_N.equals(scheduleCode)) {
            return false;
        }
        
        return true;
    }
    
    @Override
    public double calculatePenalties(
            EmployeeState employeeState,
            LocalDateTime startTime,
            String scheduleCode
    ) {
        double penalties = 0.0;
        
        // 5일 연속 근무 페널티
        if (employeeState.getConsecutiveWorkDays() >= 5) {
            penalties += PENALTY_CONSECUTIVE_WORK_5DAYS;
        }
        
        // 야간 근무 연속 페널티
        if (employeeState.getConsecutiveNightShifts() >= 1 && 
            SCHEDULE_CODE_SHIFT_N.equals(scheduleCode)) {
            penalties += PENALTY_CONSECUTIVE_NIGHT;
        }
        
        return penalties;
    }
}
