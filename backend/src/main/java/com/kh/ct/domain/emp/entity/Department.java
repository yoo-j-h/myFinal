package com.kh.ct.domain.emp.entity;

import com.kh.ct.global.common.CommonEnums;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long departmentId;

    @Column(length = 100)
    private String departmentName;

    private Integer empCount;

    @JoinColumn(name = "parent_department")
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    private Department parentDepartment;


    @Column(nullable = false, length = 1)
    @Enumerated(EnumType.STRING)
    private CommonEnums.CommonStatus departmentStatus;
  

    @OneToMany(mappedBy = "parentDepartment", fetch = FetchType.LAZY)
    private List<Department> children = new ArrayList<>();
}