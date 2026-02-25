package com.kh.ct.domain.emp.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

public class AirlineApplyDto {

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ListResponse {
        private Long id;
        private LocalDateTime date;
        private String airlineName;
        private String email;
        private String documentStatus;
        private String status;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DetailResponse {
        private Long id;
        private LocalDateTime date;
        private String airlineName;
        private String email;
        private String managerName;
        private String managerPhone;
        private String status;
        private String cancelReason;
        private List<DocumentInfo> documents;
        private Long airlineId; // 승인된 경우 Airline의 ID
        private String activationLink; // 승인된 경우 활성화 링크
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DocumentInfo {
        private String fileName;
        private String filePath;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ApproveRequest {
        @NotBlank(message = "관리자 아이디는 필수입니다")
        private String adminId;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RejectRequest {
        @NotBlank(message = "반려 사유는 필수입니다")
        private String reason;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ApplyRequest {
        @NotBlank(message = "항공사명은 필수입니다")
        private String airlineName;

        @NotBlank(message = "항공사 주소는 필수입니다")
        private String airlineAddress;

        @NotBlank(message = "담당자 이름은 필수입니다")
        private String managerName;

        @NotBlank(message = "담당자 전화번호는 필수입니다")
        private String managerPhone;

        @NotBlank(message = "담당자 이메일은 필수입니다")
        private String managerEmail;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ApplyResponse {
        private Long id;
        private String message;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ApproveResponse {
        private String activationLink;
        private String adminId;
        private String tempPassword;
    }
}

