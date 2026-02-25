package com.kh.ct.domain.support.service;

import com.kh.ct.domain.support.dto.SupportDto;
import org.springframework.security.core.Authentication;

/**
 * 고객 지원 서비스 인터페이스
 */
public interface SupportService {
    
    /**
     * 이메일 문의 사전 입력 정보 조회
     * - 관리자 이메일: 같은 airline_id 소속 관리자 이메일 또는 기본값
     * - 내 이메일: 로그인 사용자 이메일
     */
    SupportDto.EmailPrefillResponse getEmailPrefill(Authentication authentication);
    
    /**
     * 이메일 문의 발송
     * - 관리자 이메일로 문의 내용 전송
     * - 본문에 보낸 사람 정보 포함
     */
    void sendEmail(Authentication authentication, SupportDto.SendEmailRequest request);

    /**
     * 관리자 이메일 답변 발송
     * - 직원 이메일로 답변 내용 전송
     * - 직원에게 알림 발행
     */
    void replyEmail(Authentication authentication, SupportDto.ReplyEmailRequest request);
}
