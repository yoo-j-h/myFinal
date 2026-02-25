package com.kh.ct.domain.schedule.entity;

import com.kh.ct.domain.emp.entity.Emp;
import com.kh.ct.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "emp_fly_schedule")
public class EmpFlySchedule extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "emp_fly_schedule_id") 
    private Long empFlyScheduleId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "emp_id", referencedColumnName = "emp_id", nullable = false)
    private Emp emp;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "fly_schedule_id", referencedColumnName = "fly_schedule_id", nullable = false)
    private FlySchedule flySchedule;
}
