package com.kh.ct.domain.schedule.service;

import java.time.YearMonth;
import java.util.List;
import java.util.Map;

/**
 * 배정 엔진 전략 인터페이스
 * FlightAssignmentEngine과 ShiftAssignmentEngine이 구현
 */
public interface AssignmentEngine {
    
    /**
     * 월별 스케줄 배정 실행
     * 
     * @param yearMonth 배정할 년월
     * @param employeeStates 직원 상태 맵 (empId -> EmployeeState)
     * @param airlineId 항공사 ID
     * @return 배정 결과 리스트 (empId 포함)
     */
    List<ScheduleAssignmentResult> assignSchedules(
        YearMonth yearMonth,
        Map<String, EmployeeState> employeeStates,
        Long airlineId
    );
    
    /**
     * 하드 제약 조건 검증
     * 
     * @param employeeState 직원 상태
     * @param startTime 배정 시작 시간
     * @param endTime 배정 종료 시간
     * @param scheduleCode 스케줄 코드
     * @return 제약 조건 통과 여부
     */
    boolean validateHardConstraints(
        EmployeeState employeeState,
        java.time.LocalDateTime startTime,
        java.time.LocalDateTime endTime,
        String scheduleCode
    );
    
    /**
     * 페널티 계산
     * 
     * @param employeeState 직원 상태
     * @param startTime 배정 시작 시간
     * @param scheduleCode 스케줄 코드
     * @return 페널티 점수
     */
    double calculatePenalties(
        EmployeeState employeeState,
        java.time.LocalDateTime startTime,
        String scheduleCode
    );
}
