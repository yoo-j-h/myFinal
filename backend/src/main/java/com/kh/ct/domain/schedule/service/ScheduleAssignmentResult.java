package com.kh.ct.domain.schedule.service;

import com.kh.ct.domain.schedule.entity.AllSchedule;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 배정 결과를 담는 DTO
 * AllSchedule과 Emp 정보를 함께 저장
 */
@Getter
@Builder
public class ScheduleAssignmentResult {
    private String empId;
    private AllSchedule allSchedule;
    private String scheduleCode;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    
    // ✅ FLIGHT 일정의 경우 원래 FlySchedule의 ID 저장 (EmpFlySchedule 생성 시 사용)
    private Long flyScheduleId;  // FLIGHT 일정인 경우에만 사용
    
    @Builder.Default
    private boolean isPendingApproval = false; // RISK 등급(healthScore < 40)인 경우 true
    
    // 교대 타입 (지상직용: SHIFT_D, SHIFT_E, SHIFT_N)
    private String shiftType;
}
