package com.kh.ct.domain.emp.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SmtpEmailSender implements EmailSender {

    private final JavaMailSender mailSender;
    
    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Override
    public void send(String to, String subject, String text) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject(subject);
        msg.setText(text);
        mailSender.send(msg);
    }

    @Override
    public void sendHtml(String to, String subject, String html) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true); // true = HTML
            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException("HTML 메일 전송 실패", e);
        }
    }

    @Override
    public void sendMultipart(String to, String subject, String text, String html) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);

            // 첫번째 파라미터: 텍스트, 두번째: HTML
            helper.setText(text, html);

            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException("멀티파트 메일 전송 실패", e);
        }
    }
    
    @Override
    public void sendWithReplyTo(String to, String replyTo, String subject, String text) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
            
            // From 헤더 설정 (spring.mail.username이 있으면 사용, 없으면 시스템 기본값)
            if (mailUsername != null && !mailUsername.trim().isEmpty()) {
                helper.setFrom(mailUsername);
            }
            
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text, false); // false = plain text
            
            // Reply-To 헤더 설정 (관리자가 답장할 때 자동으로 replyTo로 설정됨)
            if (replyTo != null && !replyTo.trim().isEmpty()) {
                helper.setReplyTo(replyTo);
            }
            
            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException("Reply-To가 설정된 메일 전송 실패", e);
        }
    }
}
