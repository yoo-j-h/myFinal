package com.kh.ct.domain.auth.dto;

import com.kh.ct.global.common.CommonEnums;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class AuthDto {

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LoginRequest {
        @NotBlank(message = "사용자 ID는 필수입니다")
        private String empId;

        @NotBlank(message = "비밀번호는 필수입니다")
        private String empPwd;
    }

    @Getter
    @AllArgsConstructor
    @Builder
    public static class LoginResponse {
        private String accessToken;
        private Long accessTokenExpiresIn;
    }

    @Getter
    @AllArgsConstructor
    @Builder
    public static class RefreshResponse {
        private String accessToken;
        private Long accessTokenExpiresIn;
    }

    @Getter
    @AllArgsConstructor
    @Builder
    public static class MeResponse {
        private String empId;
        private String empName;
        private String role;
        private Long airlineId;
    }

    /**
     * 명함 OCR 결과 응답 DTO
     * AI가 명함 이미지에서 추출한 정보를 담습니다. (DB 저장 X)
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BusinessCardOcrResponse {
        private String empName;   // 이름 (필수)
        private String phone;     // 전화번호 (숫자와 하이픈만 포함)
        private String email;     // 이메일 (없으면 null)
        private String job;       // 직급 또는 직책 (없으면 null)
        private String company;   // 회사명 또는 소속 (없으면 null)
        private String address;   // 주소 (없으면 null)
    }

    /**
     * 최종 회원가입 요청 DTO
     * 사용자가 확인/수정한 정보를 바탕으로 Emp 엔티티를 생성합니다.
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SignUpRequest {
        @NotBlank(message = "사용자 ID는 필수입니다")
        private String empId;

        @NotBlank(message = "비밀번호는 필수입니다")
        private String empPwd;

        @NotBlank(message = "이름은 필수입니다")
        private String empName;

        @NotNull(message = "나이는 필수입니다")
        @Min(value = 1, message = "나이는 1 이상이어야 합니다")
        private Integer age;

        @NotNull(message = "역할은 필수입니다")
        private CommonEnums.Role role;

        private String phone; // 전화번호
        private String email; // 이메일
        private String job;   // 직급/직책

        @NotBlank(message = "사번은 필수입니다")
        private String empNo; // 사번 (unique)
    }
}