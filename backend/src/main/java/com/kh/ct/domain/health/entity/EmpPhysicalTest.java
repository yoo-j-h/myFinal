package com.kh.ct.domain.health.entity;

import com.kh.ct.global.entity.BaseTimeEntity;
import com.kh.ct.global.entity.File;
import com.kh.ct.domain.emp.entity.Emp;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class EmpPhysicalTest extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long physicalTestId;

    @JoinColumn(name = "emp_id")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Emp empId;

    @Column(nullable = false)
    private LocalDateTime testDate;

    private Integer height;

    private Integer weight;

    private Integer bloodSugar;

    private Integer systolicBloodPressure;

    private Integer cholesterol;

    private Integer diastolicBloodPressure;

    private Integer heartRate;

    private Integer bmi;

    private Integer bodyFat;

    @OneToOne(fetch = FetchType.LAZY, optional = false, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "file_id")
    private File fileId;
}
