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
public class EmpSurvey extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long empSurveyId;

    @JoinColumn(name = "emp_id")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Emp empId;

//    private Integer flyStressPoint;
    private Integer workStressPoint;

//    private Integer timeDifferencePoint;
    private Integer commuStressPoint;

//    private Integer workPatternPoint;
    private Integer recoveryStressPoint;
}