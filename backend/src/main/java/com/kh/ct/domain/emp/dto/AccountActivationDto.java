package com.kh.ct.domain.emp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class AccountActivationDto {

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ActivationInfoResponse {
        private String email;
        private String airlineName;
        private String airlineAddress;
        private String country;
        private LocalDateTime activationDate;
        private Boolean isValid;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ActivationRequest {
        @NotBlank(message = "비밀번호는 필수입니다")
        @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,}$",
                message = "비밀번호는 영문 대소문자, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다")
        private String password;

        @NotBlank(message = "비밀번호 확인은 필수입니다")
        private String passwordConfirm;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ActivationResponse {
        private String message;
        private Boolean success;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RegenerateLinkResponse {
        private String activationLink;
        private String message;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class InitialSetupRequest {
        @NotBlank(message = "항공사명은 필수입니다")
        private String airlineName;
        
        @NotBlank(message = "항공사 주소는 필수입니다")
        private String airlineAddress;
        
        @NotBlank(message = "대표자 이름은 필수입니다")
        private String representativeName;
        
        @NotBlank(message = "대표자 번호는 필수입니다")
        private String representativePhone;
        
        @NotBlank(message = "대표 이메일은 필수입니다")
        private String representativeEmail;
        
        private String airlineDesc; // 항공사 설명 (선택)
        
        @NotBlank(message = "테마는 필수입니다")
        private String theme; // 테마 색깔
        // 로고 파일은 multipart로 별도 처리
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class InitialSetupResponse {
        private String message;
        private Boolean success;
        private Long airlineId;
        private String airlineName;
        private String adminId;
    }
}

