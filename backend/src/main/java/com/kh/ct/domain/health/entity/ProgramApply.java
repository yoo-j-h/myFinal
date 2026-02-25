package com.kh.ct.domain.health.entity;

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
public class ProgramApply extends BaseTimeEntity {

    @Id
    @Column(length = 255)
    private String programApplyId;

    @Column(length = 50)
    private String programCode;

    @JoinColumn(name = "program_apply_applicant")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Emp programApplyApplicant;

    @JoinColumn(name = "program_apply_manager")
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    private Emp programApplyManager;

    @JoinColumn(name = "program_apply_approver")
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    private Emp programApplyApprover;

    @Lob
    private String programApplyReason;

    private LocalDateTime programApplyDate;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private CommonEnums.ApplyStatus programApplyStatus;

    @Lob
    private String programApplyCancelReason;

    @OneToOne(mappedBy = "programApply",
            cascade = CascadeType.ALL, orphanRemoval = true)
    private Program program;

    // === 비즈니스 로직 ===
    public void approve(Emp manager) {
        this.programApplyManager = manager;
        this.programApplyStatus = CommonEnums.ApplyStatus.APPROVED;
    }

    public void reject(String reason) {
        this.programApplyCancelReason = reason;
        this.programApplyStatus = CommonEnums.ApplyStatus.REJECTED;
    }
}
