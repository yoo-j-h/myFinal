package com.kh.ct.global.exception;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // ✅ 네가 던진 메시지를 그대로 내려주는 핵심
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {
        // 로그인 실패는 보통 401(인증 실패)로 주는 편이 자연스러움
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ErrorResponse.of(ex.getMessage()));
    }

    // @Valid DTO 검증 실패 (400)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(err -> {
            String fieldName = ((FieldError) err).getField();
            String errorMsg = err.getDefaultMessage();
            errors.put(fieldName, errorMsg);
        });
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse.of("입력값 검증에 실패하였습니다.", errors));
    }

    // @Validated PathVariable/RequestParam 검증 실패 (400)
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolation(ConstraintViolationException ex) {
        Map<String, String> errors = ex.getConstraintViolations().stream()
                .collect(Collectors.toMap(
                        v -> v.getPropertyPath().toString(),
                        ConstraintViolation::getMessage,
                        (a, b) -> a
                ));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse.of("입력값 검증에 실패하였습니다.", errors));
    }

    // BusinessException 처리 (비즈니스 로직 예외)
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException ex) {
        log.warn("BusinessException 발생 - status: {}, message: {}", ex.getStatus(), ex.getMessage());
        return ResponseEntity.status(ex.getStatus())
                .body(ErrorResponse.of(ex.getMessage()));
    }
    
    // 메일 전송 관련 예외 처리
    @ExceptionHandler(org.springframework.mail.MailException.class)
    public ResponseEntity<ErrorResponse> handleMailException(org.springframework.mail.MailException ex) {
        log.error("메일 전송 예외 발생", ex);
        String message = "이메일 전송에 실패했습니다. 잠시 후 다시 시도해주세요.";
        
        // MailException의 원인 예외 확인
        Throwable cause = ex.getCause();
        if (cause instanceof jakarta.mail.AuthenticationFailedException) {
            message = "이메일 서버 인증에 실패했습니다. 관리자에게 문의해주세요.";
        } else if (cause instanceof jakarta.mail.MessagingException) {
            message = "이메일 전송에 실패했습니다. 잠시 후 다시 시도해주세요.";
        }
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ErrorResponse.of(message));
    }

    // AccessDeniedException 처리 (403)
    @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(org.springframework.security.access.AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ErrorResponse.of(ex.getMessage()));
    }

    // RuntimeException 처리 (500)
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException ex) {
        ex.printStackTrace(); // 로그 출력
        String message = ex.getMessage() != null ? ex.getMessage() : "서버 오류가 발생했습니다.";
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ErrorResponse.of(message));
    }

    // 나머지 (500)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception ex) {
        ex.printStackTrace(); // 로그 출력
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ErrorResponse.of("서버 오류가 발생했습니다."));
    }


    @ExceptionHandler(EmpNoConflictException.class)
    public ResponseEntity<ErrorResponse> handleEmpNoConflict(EmpNoConflictException ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("new_emp_no", ex.getNewEmpNo());

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ErrorResponse.of(ex.getMessage(), errors));
    }

}
