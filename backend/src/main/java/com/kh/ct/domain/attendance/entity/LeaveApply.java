package com.kh.ct.domain.attendance.entity;

import com.kh.ct.global.entity.BaseTimeEntity;
import com.kh.ct.global.common.CommonEnums;
import com.kh.ct.domain.emp.entity.Emp;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class LeaveApply extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long leaveApplyId;

    @Column(nullable = false, length = 50)
    private String leaveApplyCode;

    @JoinColumn(nullable = false, name = "leave_apply_applicant")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Emp leaveApplyApplicant;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private CommonEnums.LeaveType leaveType;

    @Column(nullable = false)
    private LocalDateTime leaveStartDate;

    @Column(nullable = false)
    private Double leaveDays;

    @Lob
    private String leaveApplyReason;

    private LocalDateTime leaveEndDate;

    @JoinColumn(name = "leave_apply_approver")
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    private Emp leaveApplyApprover;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private CommonEnums.ApplyStatus leaveApplyStatus;

    @Lob
    private String leaveApplyCancelReason;

}