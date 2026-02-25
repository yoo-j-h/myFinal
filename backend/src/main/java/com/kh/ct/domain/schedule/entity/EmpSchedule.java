package com.kh.ct.domain.schedule.entity;

import com.kh.ct.global.entity.BaseTimeEntity;
import com.kh.ct.domain.emp.entity.Emp;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "emp_schedule", 
       uniqueConstraints = {
           @UniqueConstraint(name = "uk_emp_schedule_emp_schedule", 
                           columnNames = {"emp_id", "schedule_id"})
       })
public class EmpSchedule extends BaseTimeEntity {

    /**
     * PK: 자동 생성되는 대리키
     * @MapsId 제거: 같은 scheduleId를 가진 여러 EmpSchedule이 필요하므로
     * (emp_id, schedule_id)에 unique 제약 추가하여 중복 방지
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "emp_schedule_id")
    private Long empScheduleId;

    /**
     * AllSchedule과의 관계: @MapsId 제거, 일반 @ManyToOne으로 변경
     * 같은 AllSchedule에 여러 직원이 배정될 수 있음
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "schedule_id", referencedColumnName = "schedule_id", nullable = false)
    private AllSchedule scheduleId;

    /**
     * 직원과의 관계
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "emp_id", referencedColumnName = "emp_id", nullable = false)
    private Emp empId;

    /**
     * 일정 코드 (FLIGHT, STANDBY, OFF, SHIFT_D, SHIFT_E, SHIFT_N 등)
     */
    @Column(name = "schedule_code", length = 20)
    private String scheduleCode;

    /**
     * 일정 코드 수정 메서드
     */
    public void updateScheduleCode(String scheduleCode) {
        if (scheduleCode != null && !scheduleCode.isEmpty()) {
            this.scheduleCode = scheduleCode;
        }
    }
}