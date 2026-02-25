package com.kh.ct.domain.support.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

/**
 * 고객 지원 관련 DTO
 */
public class SupportDto {

    /**
     * 이메일 문의 사전 입력 정보 응답
     */
    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EmailPrefillResponse {
        private String adminEmail;  // 관리자 이메일
        private String myEmail;     // 내 이메일
    }

    /**
     * 이메일 문의 발송 요청
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SendEmailRequest {
        @NotBlank(message = "제목은 필수입니다.")
        @Size(max = 200, message = "제목은 200자 이하여야 합니다.")
        private String subject;

        @NotBlank(message = "내용은 필수입니다.")
        @Size(max = 5000, message = "내용은 5000자 이하여야 합니다.")
        private String content;
    }

    /**
     * 관리자 이메일 답변 요청
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ReplyEmailRequest {
        @NotBlank(message = "직원 이메일은 필수입니다.")
        private String employeeEmail;

        @NotBlank(message = "제목은 필수입니다.")
        @Size(max = 200, message = "제목은 200자 이하여야 합니다.")
        private String subject;

        @NotBlank(message = "내용은 필수입니다.")
        @Size(max = 5000, message = "내용은 5000자 이하여야 합니다.")
        private String content;
    }
}
