package com.kh.ct.domain.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 휴가 신청 관련 DTO 통합 클래스
 * Static Inner Class 패턴으로 파일 파편화 방지
 */
public class LeaveDto {

    /**
     * 휴가 신청 요청 DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ApplyRequest {
        private String leaveType;
        private LocalDateTime startDate;
        private LocalDateTime endDate;
        private String reason;
    }

    /**
     * 휴가 내역 응답 DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ListResponse {
        private Long leaveApplyId;
        private String leaveApplyCode;
        private String leaveType;
        private LocalDateTime startDate;
        private LocalDateTime endDate;
        private Double leaveDays;
        private String reason;
        private String status;  // PENDING, APPROVED, REJECTED
        private String applicantName;
        private String departmentName;  // 부서명 추가
        private String approverName;
        private String cancelReason;  // 반려 사유
        private LocalDateTime createdDate;
    }

    /**
     * 휴가 승인/반려 요청 DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ApproveRequest {
        private Boolean approved;
        private String cancelReason;
    }

    /**
     * 잔여 휴가 응답 DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RemainingLeaveResponse {
        private Double totalLeave;      // 전체 휴가
        private Double usedLeave;        // 사용 휴가
        private Double remainingLeave;   // 잔여 휴가
        private Integer usagePercentage; // 사용률
    }
}
