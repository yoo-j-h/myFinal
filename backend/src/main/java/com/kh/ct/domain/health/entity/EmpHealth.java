package com.kh.ct.domain.health.entity;

import com.kh.ct.global.entity.BaseTimeEntity;
import com.kh.ct.domain.emp.entity.Emp;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class EmpHealth extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long empHealthId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "emp_id", nullable = false)
    private Emp empId;

    private Integer healthPoint;

    private Integer stressPoint;

    private Integer fatiguePoint;

    private Integer physicalPoint;
}
