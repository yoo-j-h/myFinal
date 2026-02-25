package com.kh.ct.domain.attendance.entity;

import com.kh.ct.global.entity.BaseTimeEntity;
import com.kh.ct.global.common.CommonEnums;
import com.kh.ct.domain.emp.entity.Emp;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder(toBuilder = true)
public class ProtestApply extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long protestApplyId;

    @Column(nullable = false)
    private LocalDateTime protestApplyDate;

    @JoinColumn(nullable = false, name = "protest_apply_applicant")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Emp protestApplyApplicant;

    @JoinColumn(name = "protest_apply_approver")
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    private Emp protestApplyApprover;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private CommonEnums.ApplyStatus protestApplyStatus;

    @Lob
    private String protestApplyCancelReason;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private CommonEnums.AttendanceStatus protestAttendanceStatus;

    // 정정 요청 출근 시간
    private LocalTime protestRequestInTime;

    // 정정 요청 퇴근 시간
    private LocalTime protestRequestOutTime;

    // 정정 사유
    @Lob
    @Column(nullable = false)
    private String protestReason;

    // 정정 대상 근태
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "target_attendance_id", nullable = false)
    private Attendance targetAttendance;

    // 원래 근태 상태 (정정 신청 전 상태)
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private CommonEnums.AttendanceStatus originalAttendanceStatus;

    // 근무 유형 (정상출근, 휴가, 반차)
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private CommonEnums.AttendanceType attendanceType;

    @OneToMany(mappedBy = "protestApplyId", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProtestApplyFile> files = new ArrayList<>();

    /**
     * 정정 신청 승인 처리
     * @param approver 승인자
     */
    public void approve(Emp approver) {
        if (this.protestApplyStatus != CommonEnums.ApplyStatus.PENDING) {
            throw new IllegalStateException("대기 중인 신청만 승인할 수 있습니다.");
        }
        this.protestApplyApprover = approver;
        this.protestApplyStatus = CommonEnums.ApplyStatus.APPROVED;
    }

    /**
     * 정정 신청 반려 처리
     * @param approver 반려자
     * @param cancelReason 반려 사유
     */
    public void reject(Emp approver, String cancelReason) {
        if (this.protestApplyStatus != CommonEnums.ApplyStatus.PENDING) {
            throw new IllegalStateException("대기 중인 신청만 반려할 수 있습니다.");
        }
        if (cancelReason == null || cancelReason.trim().isEmpty()) {
            throw new IllegalArgumentException("반려 사유는 필수입니다.");
        }
        this.protestApplyApprover = approver;
        this.protestApplyStatus = CommonEnums.ApplyStatus.REJECTED;
        this.protestApplyCancelReason = cancelReason;
    }
}
