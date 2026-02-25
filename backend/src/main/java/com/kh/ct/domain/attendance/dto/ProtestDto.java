package com.kh.ct.domain.attendance.dto;

import com.kh.ct.global.common.CommonEnums;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

/**
 * 근태 정정 신청 DTO
 */
public class ProtestDto {

    /**
     * 정정 신청 요청 DTO
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ApplyRequest {
        private Long attendanceId;              // 정정 대상 근태 ID (기존 근태가 있는 경우)
        private String attendanceDate;          // 정정 대상 날짜 (근태 기록이 없는 경우)
        private String attendanceType;          // 근무 유형 (NORMAL, LEAVE, HALF_LEAVE)
        private String protestRequestInTime;    // 정정 요청 출근 시간 (HH:mm)
        private String protestRequestOutTime;   // 정정 요청 퇴근 시간 (HH:mm)
        private String protestReason;           // 정정 사유
    }

    /**
     * 정정 신청 목록 응답 DTO
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ListResponse {
        private Long protestApplyId;
        private LocalDateTime protestApplyDate;
        private LocalDate targetDate;               // 정정 대상 날짜
        private LocalTime currentInTime;            // 현재 출근 시간
        private LocalTime currentOutTime;           // 현재 퇴근 시간
        private LocalTime protestRequestInTime;     // 정정 요청 출근 시간
        private LocalTime protestRequestOutTime;    // 정정 요청 퇴근 시간
        private String protestReason;               // 정정 사유
        private String status;                      // 신청 상태 (PENDING/APPROVED/REJECTED)
        private String attendanceType;              // 근무 유형
        private String applicantName;               // 신청자 이름
        private String approverName;                // 승인자 이름
        private String cancelReason;                // 반려 사유
        private LocalDateTime createdDate;          // 신청일
        private Integer fileCount;                  // 첨부 파일 개수
    }

    /**
     * 정정 신청 상세 응답 DTO
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DetailResponse {
        private Long protestApplyId;
        private LocalDateTime protestApplyDate;
        private LocalDate targetDate;               // 정정 대상 날짜
        private LocalTime currentInTime;            // 현재 출근 시간
        private LocalTime currentOutTime;           // 현재 퇴근 시간
        private LocalTime protestRequestInTime;     // 정정 요청 출근 시간
        private LocalTime protestRequestOutTime;    // 정정 요청 퇴근 시간
        private String protestReason;               // 정정 사유
        private String status;                      // 신청 상태
        private String attendanceType;              // 근무 유형
        private String cancelReason;                // 반려 사유
        private String applicantName;               // 신청자 이름
        private String approverName;                // 승인자 이름
        private LocalDateTime createdDate;          // 신청일
        private List<FileInfo> files;               // 첨부 파일 목록
    }

    /**
     * 파일 정보 DTO
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FileInfo {
        private Long fileId;
        private String fileName;
        private String fileOriName;
        private String path;
        private Long size;
    }

    /**
     * 정정 승인/반려 요청 DTO
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ApproveRequest {
        private Boolean approved;       // true: 승인, false: 반려
        private String cancelReason;    // 반려 사유 (반려 시 필수)
    }

    /**
     * 관리자용 정정 신청 목록 응답 DTO
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AdminListResponse {
        private Long protestApplyId;
        private LocalDateTime protestApplyDate;        // 신청일시
        private String applicantName;                  // 신청자명
        private String departmentName;                 // 부서명
        private String positionName;                   // 직위명 (선택적)
        private LocalDate targetDate;                  // 정정 대상 날짜
        private LocalTime currentInTime;               // 현재 출근 시간
        private LocalTime currentOutTime;              // 현재 퇴근 시간
        private LocalTime protestRequestInTime;        // 정정 요청 출근 시간
        private LocalTime protestRequestOutTime;       // 정정 요청 퇴근 시간
        private String protestReason;                  // 정정 사유 (요약용)
        private String status;                         // 신청 상태 (PENDING/APPROVED/REJECTED)
        private String approverName;                   // 승인자 이름
        private Integer fileCount;                     // 첨부 파일 개수
        private LocalDateTime createdDate;             // 신청일
    }

    /**
     * OCR 응답 DTO
     * 이미지에서 추출된 구조화된 데이터
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OcrResponse {
        private String targetDate;    // 정정일자 (YYYY-MM-DD)
        private String updateTime;    // 출퇴근시간 (HH:mm)
        private String reason;        // 사유
        private String fileName;      // 원본 파일명
    }
}
