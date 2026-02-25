package com.kh.ct.domain.emp.service;

public interface EmailSender {
    void send(String to, String subject, String text);

    void sendMultipart(String to, String subject, String text, String html);

    void sendHtml(String to, String subject, String html);
    
    /**
     * Reply-To가 설정된 이메일 발송
     * 
     * @param to 수신자 이메일
     * @param replyTo 답장할 이메일 주소 (Reply-To 헤더)
     * @param subject 제목
     * @param text 본문
     */
    void sendWithReplyTo(String to, String replyTo, String subject, String text);
}