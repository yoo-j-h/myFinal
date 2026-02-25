package com.kh.ct.domain.schedule.entity;


import com.kh.ct.domain.emp.entity.Emp;
import com.kh.ct.global.common.CommonEnums;
import com.kh.ct.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class GroundSchedule extends BaseTimeEntity {
    @Id
    @Column(name = "ground_schedule_id")
    private Long groundScheduleId;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ground_schedule_id")
    private AllSchedule scheduleId;

    @JoinColumn(name = "emp_id")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Emp empId;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private CommonEnums.CommonStatus scheduleStatus;

    @Column(length = 40)
    private String workCode;

    /**
     * 일정 시작 시간 (LocalDateTime으로 통일)
     * AllSchedule의 startDate와 일관성 유지
     */
    private LocalDateTime scheduleStartDateTime;

    /**
     * 일정 종료 시간 (LocalDateTime으로 통일)
     * AllSchedule의 endDate와 일관성 유지
     */
    private LocalDateTime scheduleEndDateTime;

    /**
     * AllSchedule의 startDate를 사용하여 scheduleStartDateTime 설정
     * AllSchedule과 일관성 유지
     */
    public void setScheduleStartDateTime(LocalDateTime startDateTime) {
        this.scheduleStartDateTime = startDateTime;
        if (scheduleId != null && startDateTime != null) {
            scheduleId.updateSchedule(startDateTime, scheduleId.getEndDate(), scheduleId.getScheduleCode());
        }
    }

    /**
     * AllSchedule의 endDate를 사용하여 scheduleEndDateTime 설정
     * AllSchedule과 일관성 유지
     */
    public void setScheduleEndDateTime(LocalDateTime endDateTime) {
        this.scheduleEndDateTime = endDateTime;
        if (scheduleId != null && endDateTime != null) {
            scheduleId.updateSchedule(scheduleId.getStartDate(), endDateTime, scheduleId.getScheduleCode());
        }
    }

    /**
     * AllSchedule의 startDate를 반환 (일관성 유지)
     * AllSchedule이 있으면 우선 사용, 없으면 자체 필드 사용
     */
    public LocalDateTime getScheduleStartDateTime() {
        if (scheduleId != null && scheduleId.getStartDate() != null) {
            return scheduleId.getStartDate();
        }
        return scheduleStartDateTime;
    }

    /**
     * AllSchedule의 endDate를 반환 (일관성 유지)
     * AllSchedule이 있으면 우선 사용, 없으면 자체 필드 사용
     */
    public LocalDateTime getScheduleEndDateTime() {
        if (scheduleId != null && scheduleId.getEndDate() != null) {
            return scheduleId.getEndDate();
        }
        return scheduleEndDateTime;
    }

    /**
     * 대시보드 호환성을 위한 메서드
     * LocalDateTime에서 LocalDate 추출
     */
    public java.time.LocalDate getScheduleStartDate() {
        LocalDateTime startDateTime = getScheduleStartDateTime();
        return startDateTime != null ? startDateTime.toLocalDate() : null;
    }

    /**
     * 대시보드 호환성을 위한 메서드
     * LocalDateTime에서 LocalTime 추출
     */
    public java.time.LocalTime getScheduleStartTime() {
        LocalDateTime startDateTime = getScheduleStartDateTime();
        return startDateTime != null ? startDateTime.toLocalTime() : null;
    }

    /**
     * 대시보드 호환성을 위한 메서드
     * LocalDateTime에서 LocalTime 추출
     */
    public java.time.LocalTime getScheduleEndTime() {
        LocalDateTime endDateTime = getScheduleEndDateTime();
        return endDateTime != null ? endDateTime.toLocalTime() : null;
    }
}
