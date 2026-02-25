package com.kh.ct.domain.schedule.service;

import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 스케줄 배정 제약 조건 검증 엔진
 * 모든 배정 결과에 대해 제약 조건 위반 여부를 검증하고 violations를 수집
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ValidationEngine {
    
    /**
     * 배정 결과 검증
     * 
     * @param assignments 모든 배정 결과
     * @param employeeStates 직원 상태 맵
     * @param yearMonth 배정 월
     * @return 검증 결과 (violations 포함)
     */
    public ValidationResult validateAssignments(
            List<ScheduleAssignmentResult> assignments,
            Map<String, EmployeeState> employeeStates,
            YearMonth yearMonth
    ) {
        log.info("스케줄 배정 검증 시작 - 배정 수: {}건, 직원 수: {}명", 
                assignments.size(), employeeStates.size());
        
        List<Violation> violations = new ArrayList<>();
        
        // 1. 시간 겹침 검증
        violations.addAll(validateTimeConflicts(assignments, employeeStates));
        
        // 2. 최소 휴식 시간 검증
        violations.addAll(validateMinimumRest(assignments, employeeStates));
        
        // 3. 월간 비행 횟수 검증 (승무원)
        violations.addAll(validateMonthlyFlightCount(employeeStates));
        
        // 4. 주간 근무일수 검증 (지상직)
        violations.addAll(validateWeeklyWorkDays(employeeStates, yearMonth));
        
        // 5. 연속 근무 제한 검증
        violations.addAll(validateConsecutiveWorkLimits(employeeStates));
        
        // 6. 모든 날짜 배정 검증
        violations.addAll(validateAllDatesAssigned(employeeStates, yearMonth));
        
        log.info("스케줄 배정 검증 완료 - violations: {}건", violations.size());
        if (!violations.isEmpty()) {
            log.warn("⚠️ 제약 조건 위반 발견:");
            violations.forEach(v -> log.warn("  - {}: {}", v.getType(), v.getMessage()));
        }
        
        return ValidationResult.builder()
                .violations(violations)
                .isValid(violations.isEmpty())
                .build();
    }
    
    /**
     * 시간 겹침 검증
     */
    private List<Violation> validateTimeConflicts(
            List<ScheduleAssignmentResult> assignments,
            Map<String, EmployeeState> employeeStates
    ) {
        List<Violation> violations = new ArrayList<>();
        
        // 직원별로 그룹화
        Map<String, List<ScheduleAssignmentResult>> assignmentsByEmp = assignments.stream()
                .filter(a -> a.getEmpId() != null)
                .collect(Collectors.groupingBy(ScheduleAssignmentResult::getEmpId));
        
        for (Map.Entry<String, List<ScheduleAssignmentResult>> entry : assignmentsByEmp.entrySet()) {
            String empId = entry.getKey();
            List<ScheduleAssignmentResult> empAssignments = entry.getValue();
            
            // 모든 조합 검사
            for (int i = 0; i < empAssignments.size(); i++) {
                for (int j = i + 1; j < empAssignments.size(); j++) {
                    ScheduleAssignmentResult a1 = empAssignments.get(i);
                    ScheduleAssignmentResult a2 = empAssignments.get(j);
                    
                    if (hasTimeOverlap(a1, a2)) {
                        violations.add(Violation.builder()
                                .type(ViolationType.TIME_CONFLICT)
                                .empId(empId)
                                .message(String.format("시간 겹침: %s (%s ~ %s)와 %s (%s ~ %s)",
                                        a1.getScheduleCode(),
                                        a1.getStartTime(),
                                        a1.getEndTime(),
                                        a2.getScheduleCode(),
                                        a2.getStartTime(),
                                        a2.getEndTime()))
                                .build());
                    }
                }
            }
        }
        
        return violations;
    }
    
    /**
     * 최소 휴식 시간 검증 (12시간)
     */
    private List<Violation> validateMinimumRest(
            List<ScheduleAssignmentResult> assignments,
            Map<String, EmployeeState> employeeStates
    ) {
        List<Violation> violations = new ArrayList<>();
        
        // 직원별로 시간순 정렬
        Map<String, List<ScheduleAssignmentResult>> assignmentsByEmp = assignments.stream()
                .filter(a -> a.getEmpId() != null && a.getStartTime() != null)
                .collect(Collectors.groupingBy(ScheduleAssignmentResult::getEmpId));
        
        for (Map.Entry<String, List<ScheduleAssignmentResult>> entry : assignmentsByEmp.entrySet()) {
            String empId = entry.getKey();
            List<ScheduleAssignmentResult> sorted = entry.getValue().stream()
                    .sorted((a1, a2) -> a1.getStartTime().compareTo(a2.getStartTime()))
                    .collect(Collectors.toList());
            
            for (int i = 0; i < sorted.size() - 1; i++) {
                ScheduleAssignmentResult current = sorted.get(i);
                ScheduleAssignmentResult next = sorted.get(i + 1);
                
                // OFF는 휴식 시간 계산에서 제외
                if ("OFF".equals(current.getScheduleCode())) {
                    continue;
                }
                
                long restHours = ChronoUnit.HOURS.between(current.getEndTime(), next.getStartTime());
                if (restHours < 12) {
                    violations.add(Violation.builder()
                            .type(ViolationType.MINIMUM_REST_VIOLATION)
                            .empId(empId)
                            .message(String.format("최소 휴식 시간 부족: %s 종료 후 %d시간만 휴식 (필요: 12시간)",
                                    current.getScheduleCode(), restHours))
                            .build());
                }
            }
        }
        
        return violations;
    }
    
    /**
     * 월간 비행 횟수 검증 (승무원: 7~9회)
     */
    private List<Violation> validateMonthlyFlightCount(Map<String, EmployeeState> employeeStates) {
        List<Violation> violations = new ArrayList<>();
        
        for (Map.Entry<String, EmployeeState> entry : employeeStates.entrySet()) {
            String empId = entry.getKey();
            EmployeeState state = entry.getValue();
            
            // 승무원만 검증
            if (state.getRole() != com.kh.ct.global.common.CommonEnums.Role.PILOT &&
                state.getRole() != com.kh.ct.global.common.CommonEnums.Role.CABIN_CREW) {
                continue;
            }
            
            int flightCount = state.getMonthlyFlightCount();
            if (flightCount < 7) {
                violations.add(Violation.builder()
                        .type(ViolationType.MONTHLY_FLIGHT_COUNT_LOW)
                        .empId(empId)
                        .message(String.format("월간 비행 횟수 부족: %d회 (최소: 7회)", flightCount))
                        .build());
            } else if (flightCount > 9) {
                violations.add(Violation.builder()
                        .type(ViolationType.MONTHLY_FLIGHT_COUNT_HIGH)
                        .empId(empId)
                        .message(String.format("월간 비행 횟수 초과: %d회 (최대: 9회)", flightCount))
                        .build());
            }
        }
        
        return violations;
    }
    
    /**
     * 주간 근무일수 검증 (지상직: 주 4~5일)
     */
    private List<Violation> validateWeeklyWorkDays(
            Map<String, EmployeeState> employeeStates,
            YearMonth yearMonth
    ) {
        List<Violation> violations = new ArrayList<>();
        
        LocalDate monthStart = yearMonth.atDay(1);
        LocalDate monthEnd = yearMonth.atEndOfMonth();
        
        // 주 단위로 검증 (월요일 기준)
        LocalDate weekStart = monthStart;
        while (!weekStart.isAfter(monthEnd)) {
            // 주의 마지막 날 (일요일)
            LocalDate weekEnd = weekStart.plusDays(6);
            if (weekEnd.isAfter(monthEnd)) {
                weekEnd = monthEnd;
            }
            
            for (Map.Entry<String, EmployeeState> entry : employeeStates.entrySet()) {
                String empId = entry.getKey();
                EmployeeState state = entry.getValue();
                
                // 지상직만 검증
                if (state.getRole() != com.kh.ct.global.common.CommonEnums.Role.GROUND_STAFF &&
                    state.getRole() != com.kh.ct.global.common.CommonEnums.Role.MAINTENANCE) {
                    continue;
                }
                
                int workDays = state.getWeeklyWorkDays(weekStart);
                if (workDays < 4) {
                    violations.add(Violation.builder()
                            .type(ViolationType.WEEKLY_WORK_DAYS_LOW)
                            .empId(empId)
                            .message(String.format("주간 근무일수 부족: %d일 (최소: 4일, 주: %s ~ %s)",
                                    workDays, weekStart, weekEnd))
                            .build());
                } else if (workDays > 5) {
                    violations.add(Violation.builder()
                            .type(ViolationType.WEEKLY_WORK_DAYS_HIGH)
                            .empId(empId)
                            .message(String.format("주간 근무일수 초과: %d일 (최대: 5일, 주: %s ~ %s)",
                                    workDays, weekStart, weekEnd))
                            .build());
                }
            }
            
            weekStart = weekStart.plusWeeks(1);
        }
        
        return violations;
    }
    
    /**
     * 연속 근무 제한 검증
     */
    private List<Violation> validateConsecutiveWorkLimits(Map<String, EmployeeState> employeeStates) {
        List<Violation> violations = new ArrayList<>();
        
        for (Map.Entry<String, EmployeeState> entry : employeeStates.entrySet()) {
            String empId = entry.getKey();
            EmployeeState state = entry.getValue();
            
            // 연속 근무일 검증 (최대 6일)
            if (state.getConsecutiveWorkDays() > 6) {
                violations.add(Violation.builder()
                        .type(ViolationType.CONSECUTIVE_WORK_DAYS_EXCEEDED)
                        .empId(empId)
                        .message(String.format("연속 근무일 초과: %d일 (최대: 6일)", state.getConsecutiveWorkDays()))
                        .build());
            }
            
            // 연속 야간 근무 검증 (최대 2일)
            if (state.getConsecutiveNightShifts() > 2) {
                violations.add(Violation.builder()
                        .type(ViolationType.CONSECUTIVE_NIGHT_SHIFTS_EXCEEDED)
                        .empId(empId)
                        .message(String.format("연속 야간 근무 초과: %d일 (최대: 2일)", state.getConsecutiveNightShifts()))
                        .build());
            }
            
            // 연속 비행 검증 (최대 3일)
            if (state.getConsecutiveFlights() > 3) {
                violations.add(Violation.builder()
                        .type(ViolationType.CONSECUTIVE_FLIGHTS_EXCEEDED)
                        .empId(empId)
                        .message(String.format("연속 비행 초과: %d일 (최대: 3일)", state.getConsecutiveFlights()))
                        .build());
            }
            
            // 연속 STANDBY 검증 (최대 3일)
            if (state.getConsecutiveStandbyDays() > 3) {
                violations.add(Violation.builder()
                        .type(ViolationType.CONSECUTIVE_STANDBY_DAYS_EXCEEDED)
                        .empId(empId)
                        .message(String.format("연속 STANDBY 초과: %d일 (최대: 3일)", state.getConsecutiveStandbyDays()))
                        .build());
            }
        }
        
        return violations;
    }
    
    /**
     * 모든 날짜 배정 검증
     */
    private List<Violation> validateAllDatesAssigned(
            Map<String, EmployeeState> employeeStates,
            YearMonth yearMonth
    ) {
        List<Violation> violations = new ArrayList<>();
        
        LocalDate monthStart = yearMonth.atDay(1);
        LocalDate monthEnd = yearMonth.atEndOfMonth();
        
        for (Map.Entry<String, EmployeeState> entry : employeeStates.entrySet()) {
            String empId = entry.getKey();
            EmployeeState state = entry.getValue();
            
            // 각 날짜에 배정이 있는지 확인
            for (LocalDate date = monthStart; !date.isAfter(monthEnd); date = date.plusDays(1)) {
                if (!state.hasAssignmentOnDate(date)) {
                    violations.add(Violation.builder()
                            .type(ViolationType.UNASSIGNED_DATE)
                            .empId(empId)
                            .message(String.format("미배정 날짜: %s", date))
                            .build());
                }
            }
        }
        
        return violations;
    }
    
    /**
     * 시간 겹침 확인
     */
    private boolean hasTimeOverlap(ScheduleAssignmentResult a1, ScheduleAssignmentResult a2) {
        if (a1.getStartTime() == null || a1.getEndTime() == null ||
            a2.getStartTime() == null || a2.getEndTime() == null) {
            return false;
        }
        
        return a1.getStartTime().isBefore(a2.getEndTime()) &&
               a1.getEndTime().isAfter(a2.getStartTime());
    }
    
    /**
     * 검증 결과
     */
    @Getter
    @Builder
    public static class ValidationResult {
        private List<Violation> violations;
        private boolean isValid;
    }
    
    /**
     * 제약 조건 위반 정보
     */
    @Getter
    @Builder
    public static class Violation {
        private ViolationType type;
        private String empId;
        private String message;
    }
    
    /**
     * 위반 타입
     */
    public enum ViolationType {
        TIME_CONFLICT,                      // 시간 겹침
        MINIMUM_REST_VIOLATION,            // 최소 휴식 시간 부족
        MONTHLY_FLIGHT_COUNT_LOW,           // 월간 비행 횟수 부족
        MONTHLY_FLIGHT_COUNT_HIGH,          // 월간 비행 횟수 초과
        WEEKLY_WORK_DAYS_LOW,               // 주간 근무일수 부족
        WEEKLY_WORK_DAYS_HIGH,              // 주간 근무일수 초과
        CONSECUTIVE_WORK_DAYS_EXCEEDED,     // 연속 근무일 초과
        CONSECUTIVE_NIGHT_SHIFTS_EXCEEDED,  // 연속 야간 근무 초과
        CONSECUTIVE_FLIGHTS_EXCEEDED,       // 연속 비행 초과
        CONSECUTIVE_STANDBY_DAYS_EXCEEDED,  // 연속 STANDBY 초과
        UNASSIGNED_DATE                     // 미배정 날짜
    }
}
