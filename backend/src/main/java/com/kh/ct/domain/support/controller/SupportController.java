package com.kh.ct.domain.support.controller;

import com.kh.ct.domain.support.dto.SupportDto;
import com.kh.ct.domain.support.service.SupportService;
import com.kh.ct.global.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * 고객 지원 컨트롤러
 */
@Slf4j
@RestController
@RequestMapping("/api/support")
@RequiredArgsConstructor
@Validated
public class SupportController {
    
    private final SupportService supportService;
    
    /**
     * 이메일 문의 사전 입력 정보 조회
     * GET /api/support/email/prefill
     * 
     * @param authentication 인증 정보
     * @return 관리자 이메일, 내 이메일
     */
    @GetMapping("/email/prefill")
    public ResponseEntity<ApiResponse<SupportDto.EmailPrefillResponse>> getEmailPrefill(
            Authentication authentication
    ) {
        log.info("이메일 문의 사전 입력 정보 조회 요청 - authentication: {}", 
                authentication != null ? (authentication.isAuthenticated() ? "인증됨" : "인증 안됨") : "null");
        
        try {
            SupportDto.EmailPrefillResponse response = supportService.getEmailPrefill(authentication);
            log.info("이메일 문의 사전 입력 정보 조회 성공");
            return ResponseEntity.ok(ApiResponse.success("이메일 문의 사전 입력 정보 조회 성공", response));
        } catch (Exception e) {
            log.error("이메일 문의 사전 입력 정보 조회 중 컨트롤러 레벨 예외 발생", e);
            throw e; // GlobalExceptionHandler에서 처리
        }
    }
    
    /**
     * 이메일 문의 발송
     * POST /api/support/email/send
     * 
     * @param authentication 인증 정보
     * @param request 문의 제목, 내용
     * @return 성공 응답
     */
    @PostMapping("/email/send")
    public ResponseEntity<ApiResponse<Void>> sendEmail(
            Authentication authentication,
            @Valid @RequestBody SupportDto.SendEmailRequest request
    ) {
        log.info("이메일 문의 발송 요청 - subject: {}", request.getSubject());
        
        supportService.sendEmail(authentication, request);
        
        return ResponseEntity.ok(ApiResponse.success("이메일 문의가 발송되었습니다.", null));
    }

    /**
     * 관리자 이메일 답변 발송
     * POST /api/support/email/reply
     * 
     * @param authentication 인증 정보
     * @param request 직원 이메일, 제목, 내용
     * @return 성공 응답
     */
    @PostMapping("/email/reply")
    public ResponseEntity<ApiResponse<Void>> replyEmail(
            Authentication authentication,
            @Valid @RequestBody SupportDto.ReplyEmailRequest request
    ) {
        log.info("관리자 이메일 답변 발송 요청 - employeeEmail: {}, subject: {}", 
                request.getEmployeeEmail(), request.getSubject());
        
        supportService.replyEmail(authentication, request);
        
        return ResponseEntity.ok(ApiResponse.success("이메일 답변이 발송되었습니다.", null));
    }
}
