package com.kh.ct.domain.schedule.entity;

import com.kh.ct.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "all_schedule")
public class AllSchedule extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "schedule_id")
    private Long scheduleId;

    @Column(name = "schedule_code", length = 20, nullable = false)
    private String scheduleCode; 
    // FLIGHT: 비행 일정 (PILOT, CABIN_CREW)
    // STANDBY: 대기 일정 (PILOT, CABIN_CREW)
    // OFF: 휴무 (모든 역할)
    // SHIFT_D: 주간 교대 (GROUND_STAFF, MAINTENANCE)
    // SHIFT_E: 저녁 교대 (GROUND_STAFF, MAINTENANCE)
    // SHIFT_N: 야간 교대 (GROUND_STAFF, MAINTENANCE)

    @Column(name = "start_date")
    private java.time.LocalDateTime startDate;

    @Column(name = "end_date")
    private java.time.LocalDateTime endDate;

    /**
     * 일정 수정 메서드
     */
    public void updateSchedule(java.time.LocalDateTime startDate, java.time.LocalDateTime endDate, String scheduleCode) {
        if (startDate != null) {
            this.startDate = startDate;
        }
        if (endDate != null) {
            this.endDate = endDate;
        }
        if (scheduleCode != null && !scheduleCode.isEmpty()) {
            this.scheduleCode = scheduleCode;
        }
    }
    
    /**
     * 시작 시간 설정 (GroundSchedule과의 일관성 유지)
     */
    public void setStartDate(java.time.LocalDateTime startDate) {
        this.startDate = startDate;
    }
    
    /**
     * 종료 시간 설정 (GroundSchedule과의 일관성 유지)
     */
    public void setEndDate(java.time.LocalDateTime endDate) {
        this.endDate = endDate;
    }
}