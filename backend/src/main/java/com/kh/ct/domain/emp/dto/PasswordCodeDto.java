package com.kh.ct.domain.emp.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

public class PasswordCodeDto {

    @Getter
    public static class SendRequest {
        @NotBlank
        @Email
        private String email;
    }

    @Getter
    public static class VerifyRequest {
        @NotBlank
        @Email
        private String email;

        @NotBlank
        private String code;
    }
}
