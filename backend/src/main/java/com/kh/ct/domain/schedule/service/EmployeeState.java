package com.kh.ct.domain.schedule.service;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 직원 상태를 인메모리에서 관리하는 클래스
 * 배정 중 매번 DB를 조회하지 않도록 모든 정보를 캐싱
 */
@Getter
@Setter
@Builder
public class EmployeeState {
    private String empId;
    private String empName;
    private Integer healthScore; // 최신 healthPoint
    private Long airlineId;
    private com.kh.ct.global.common.CommonEnums.Role role; // 직원 역할
    
    // 최근 근무 기록 (전월 말 포함)
    @Builder.Default
    private List<WorkRecord> recentWorkRecords = new ArrayList<>();
    
    // 누적 통계
    @Builder.Default
    private int consecutiveWorkDays = 0; // 연속 근무일
    @Builder.Default
    private int consecutiveNightShifts = 0; // 연속 야간 근무
    @Builder.Default
    private int consecutiveFlights = 0; // 연속 비행
    @Builder.Default
    private long totalFlightHours = 0; // 누적 비행 시간 (분)
    @Builder.Default
    private int totalOffDays = 0; // 월간 누적 휴무일수
    @Builder.Default
    private int totalStandbyCount = 0; // 월간 누적 스탠바이 횟수
    @Builder.Default
    private int consecutiveStandbyDays = 0; // 연속 스탠바이 일수
    @Builder.Default
    private int monthlyFlightCount = 0; // 월간 비행 횟수 (공정성 보정용)
    
    // 마지막 근무 종료 시간 (휴식 시간 계산용)
    private LocalDateTime lastWorkEndTime;
    
    // 실제 근무 코드 집합 (OFF는 근무 종료 시간으로 간주하지 않음)
    private static final java.util.Set<String> WORK_CODES = java.util.Set.of(
        "FLIGHT", "STANDBY", "SHIFT_D", "SHIFT_E", "SHIFT_N"
    );
    
    // 마지막 비행 정보 (장거리/야간 비행 후 OFF 배정용)
    @Builder.Default
    private LocalDateTime lastFlightEndTime = null;
    @Builder.Default
    private Boolean lastFlightWasLongDistance = false; // 8시간 이상 장거리 비행 여부
    @Builder.Default
    private Boolean lastFlightWasNight = false; // 야간 비행 여부
    
    // 이번 달 배정된 일정들 (중복 체크용)
    @Builder.Default
    private List<ScheduledSlot> assignedSlots = new ArrayList<>();
    
    // 교대 근무 추적 (지상직용)
    @Builder.Default
    private java.util.Map<String, Integer> shiftCountMap = new java.util.HashMap<>(); // 교대별 배정 횟수 (SHIFT_D, SHIFT_E, SHIFT_N)
    private String lastShiftType; // 마지막 교대 타입
    
    // 주별 근무일수 추적 (지상직용)
    @Builder.Default
    private java.util.Map<LocalDate, Integer> weeklyWorkDays = new java.util.HashMap<>(); // 주 시작일(월요일) -> 근무일수
    
    // 월간 근무일수 (지상직용)
    @Builder.Default
    private int totalWorkDays = 0; // 월간 총 근무일수
    
    /**
     * 근무 기록
     */
    @Getter
    @Setter
    @Builder
    public static class WorkRecord {
        private LocalDate workDate;
        private String scheduleCode; // FLIGHT, SHIFT_D, SHIFT_E, SHIFT_N, OFF, STANDBY
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private boolean isNightShift; // 야간 근무 여부
    }
    
    /**
     * 배정된 시간 슬롯
     */
    @Getter
    @Setter
    @Builder
    public static class ScheduledSlot {
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private String scheduleCode;
        private Long flyScheduleId; // FLIGHT 일정인 경우 flyScheduleId 저장 (Swap 로직용)
    }
    
    /**
     * 시간대 중복 체크 (겹침 검사)
     * 
     * 겹침 조건:
     * - 기존 배정된 비행의 start < 신규 end
     * - AND 기존 배정된 비행의 end > 신규 start
     * 
     * 이 조건을 만족하면 겹침으로 간주
     */
    public boolean hasTimeConflict(LocalDateTime start, LocalDateTime end) {
        if (start == null || end == null) {
            return false;
        }
        
        return assignedSlots.stream().anyMatch(slot -> {
            if (slot.getStartTime() == null || slot.getEndTime() == null) {
                return false;
            }
            // 겹침 조건: 기존 start < 신규 end AND 기존 end > 신규 start
            return start.isBefore(slot.getEndTime()) && end.isAfter(slot.getStartTime());
        });
    }
    
    /**
     * 최소 휴식 시간(12시간) 보장 체크
     */
    public boolean hasMinimumRest(LocalDateTime newStartTime) {
        if (lastWorkEndTime == null) {
            return true; // 첫 근무
        }
        long restHours = java.time.Duration.between(lastWorkEndTime, newStartTime).toHours();
        return restHours >= 12;
    }
    
    /**
     * 연속 근무일 업데이트
     */
    public void updateConsecutiveWorkDays(LocalDate workDate) {
        if (recentWorkRecords.isEmpty()) {
            consecutiveWorkDays = 1;
            return;
        }
        
        LocalDate lastWorkDate = recentWorkRecords.get(recentWorkRecords.size() - 1).getWorkDate();
        if (workDate.minusDays(1).equals(lastWorkDate)) {
            consecutiveWorkDays++;
        } else {
            consecutiveWorkDays = 1;
        }
    }
    
    /**
     * 연속 야간 근무 업데이트
     */
    public void updateConsecutiveNightShifts(boolean isNightShift) {
        if (isNightShift) {
            consecutiveNightShifts++;
        } else {
            consecutiveNightShifts = 0;
        }
    }
    
    /**
     * 연속 비행 업데이트
     */
    public void updateConsecutiveFlights(boolean isFlight) {
        if (isFlight) {
            consecutiveFlights++;
        } else {
            consecutiveFlights = 0;
        }
    }
    
    /**
     * 배정 슬롯 추가
     * 
     * OFF 처리 정책:
     * 1. OFF는 lastWorkEndTime을 업데이트하지 않음 (12시간 휴식 규칙 정상 작동)
     * 2. OFF 배정 시 연속 근무일/연속 비행/연속 야간 근무 카운트 리셋
     * 3. OFF는 실제 근무가 아니므로 연속 근무일 계산에서 제외
     */
    public void addAssignedSlot(LocalDateTime start, LocalDateTime end, String scheduleCode) {
        addAssignedSlot(start, end, scheduleCode, null);
    }
    
    /**
     * 배정 슬롯 추가 (flyScheduleId 포함)
     */
    public void addAssignedSlot(LocalDateTime start, LocalDateTime end, String scheduleCode, Long flyScheduleId) {
        assignedSlots.add(ScheduledSlot.builder()
            .startTime(start)
            .endTime(end)
            .scheduleCode(scheduleCode)
            .flyScheduleId(flyScheduleId)
            .build());
        
        // OFF 처리: 연속 근무 관련 카운트 리셋 및 lastWorkEndTime 미갱신
        if ("OFF".equals(scheduleCode)) {
            totalOffDays++;
            consecutiveStandbyDays = 0; // 연속 스탠바이 초기화
            // 연속 근무일/연속 비행/연속 야간 근무 리셋
            consecutiveWorkDays = 0;
            consecutiveFlights = 0;
            consecutiveNightShifts = 0;
            // lastWorkEndTime은 업데이트하지 않음 (12시간 휴식 규칙 유지)
            return; // OFF는 여기서 종료
        }
        
        // 실제 근무 코드인 경우에만 lastWorkEndTime 업데이트
        if (WORK_CODES.contains(scheduleCode)) {
            if (lastWorkEndTime == null || end.isAfter(lastWorkEndTime)) {
                lastWorkEndTime = end;
            }
        }
        
        // STANDBY 처리
        if ("STANDBY".equals(scheduleCode)) {
            totalStandbyCount++;
            consecutiveStandbyDays++;
            // STANDBY는 근무일로 카운트 (연속 근무일 증가)
            // 단, 연속 비행/연속 야간 근무는 리셋 (STANDBY는 비행이 아님)
            consecutiveFlights = 0;
            consecutiveNightShifts = 0;
        } else {
            // FLIGHT, SHIFT 등 다른 근무 코드
            consecutiveStandbyDays = 0; // 연속 스탠바이 초기화
        }
        
        // FLIGHT 배정 시 마지막 비행 정보 및 월간 비행 횟수 업데이트
        if ("FLIGHT".equals(scheduleCode)) {
            monthlyFlightCount++; // 월간 비행 횟수 증가 (공정성 보정용)
            lastFlightEndTime = end;
            // 장거리 비행 체크 (8시간 이상)
            long flightDurationHours = java.time.Duration.between(start, end).toHours();
            lastFlightWasLongDistance = flightDurationHours >= 8;
            // 야간 비행 체크
            int startHour = start.getHour();
            int endHour = end.getHour();
            lastFlightWasNight = (startHour >= 22 || startHour < 6) || (endHour < 6);
        }
    }
    
    /**
     * 연속 근무일 업데이트 (OFF 배정 시 호출)
     */
    public void resetConsecutiveWorkDays() {
        consecutiveWorkDays = 0;
    }
    
    /**
     * 연속 스탠바이 일수 초기화
     */
    public void resetConsecutiveStandbyDays() {
        consecutiveStandbyDays = 0;
    }
    
    /**
     * 교대 배정 횟수 증가 (지상직용)
     */
    public void incrementShiftCount(String shiftType) {
        shiftCountMap.put(shiftType, shiftCountMap.getOrDefault(shiftType, 0) + 1);
        lastShiftType = shiftType;
        totalWorkDays++;
    }
    
    /**
     * 주별 근무일수 업데이트 (지상직용)
     * @param weekStartDate 주의 시작일 (월요일)
     */
    public void updateWeeklyWorkDays(LocalDate weekStartDate) {
        weeklyWorkDays.put(weekStartDate, weeklyWorkDays.getOrDefault(weekStartDate, 0) + 1);
    }
    
    /**
     * 주별 근무일수 조회 (지상직용)
     * @param weekStartDate 주의 시작일 (월요일)
     * @return 해당 주의 근무일수
     */
    public int getWeeklyWorkDays(LocalDate weekStartDate) {
        return weeklyWorkDays.getOrDefault(weekStartDate, 0);
    }
    
    /**
     * 월간 비행 횟수 체크 (승무원용)
     * @return 비행 배정 가능 여부 (7~9회 범위 내)
     */
    public boolean canAssignFlight() {
        return monthlyFlightCount < 9; // 최대 9회
    }
    
    /**
     * 주별 근무일수 체크 (지상직용)
     * @param weekStartDate 주의 시작일 (월요일)
     * @return 주 4~5일 근무 범위 내 여부
     */
    public boolean canAssignWork(LocalDate weekStartDate) {
        int currentWorkDays = getWeeklyWorkDays(weekStartDate);
        return currentWorkDays < 5; // 최대 5일
    }
    
    /**
     * 교대 균등 분배 체크 (지상직용)
     * @return 교대별 배정 횟수 차이가 2 이하인지
     */
    public boolean isShiftBalanced() {
        if (shiftCountMap.isEmpty()) {
            return true;
        }
        int min = shiftCountMap.values().stream().mapToInt(Integer::intValue).min().orElse(0);
        int max = shiftCountMap.values().stream().mapToInt(Integer::intValue).max().orElse(0);
        return (max - min) <= 2; // 교대별 차이 최대 2
    }
    
    /**
     * 특정 날짜에 배정된 일정이 있는지 확인
     * @param date 확인할 날짜
     * @return 배정된 일정 존재 여부
     */
    public boolean hasAssignmentOnDate(LocalDate date) {
        return assignedSlots.stream().anyMatch(slot ->
            slot.getStartTime().toLocalDate().equals(date) ||
            slot.getEndTime().toLocalDate().equals(date) ||
            (slot.getStartTime().toLocalDate().isBefore(date) && slot.getEndTime().toLocalDate().isAfter(date))
        );
    }
}
