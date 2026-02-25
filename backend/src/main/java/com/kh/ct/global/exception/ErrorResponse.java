package com.kh.ct.global.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {
    private final String message;
    private final boolean success;
    private final Map<String, String> errors;

    @Builder.Default
    private final LocalDateTime timestamp = LocalDateTime.now();

    public static ErrorResponse of(String message) {
        return ErrorResponse.builder()
                .success(false)
                .message(message)
                .build();
    }

    public static ErrorResponse of(String message, Map<String, String> errors) {
        return ErrorResponse.builder()
                .success(false)
                .message(message)
                .errors(errors)
                .build();
    }
}
