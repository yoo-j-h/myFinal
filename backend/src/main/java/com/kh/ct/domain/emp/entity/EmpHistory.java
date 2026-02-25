package com.kh.ct.domain.emp.entity;

import com.kh.ct.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class EmpHistory extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long empHistoryId;

    @JoinColumn(name = "emp_id")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Emp empId;

    @Column(length = 50)
    private String job;

    @Column(length = 50)
    private String historyDepartment;
}
