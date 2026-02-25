package com.kh.ct.domain.emp.service;

import com.kh.ct.domain.emp.entity.PasswordCode;
import com.kh.ct.domain.emp.repository.PasswordCodeRepository;
import com.kh.ct.domain.emp.service.EmailSender;
import com.kh.ct.domain.emp.service.PasswordCodeService;
import com.kh.ct.global.common.CommonEnums;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class PasswordCodeServiceImpl implements PasswordCodeService {

    private final PasswordCodeRepository passwordCodeRepository;
    private final EmailSender emailSender;

    private static final SecureRandom RANDOM = new SecureRandom();

    private String generate6DigitCode() {
        int n = RANDOM.nextInt(900000) + 100000;
        return String.valueOf(n);
    }

    @Override
    @Transactional
    public void sendCode(String email) {
        String code = generate6DigitCode();

        // ✅ DB 저장 (엔티티 수정 금지 조건이므로 그대로 저장)
        PasswordCode entity = PasswordCode.builder()
                .email(email)
                .passwordCode(code)
                .codeExpiresDate(LocalDateTime.now()) // 제한시간 로직 안 씀(값은 의미 없음)
                .passwordCodeStatus(CommonEnums.CommonStatus.Y) // ✅ 실제 enum 값으로 맞춰야 함
                .build();

        passwordCodeRepository.save(entity);

        // ✅ 메일 발송
        String subject = "[인증코드] 6자리 인증번호";
        String text = "인증번호: " + code;

        emailSender.send(email, subject, text);

        // (선택) 개발 중에는 로그도 남기면 디버깅 편함 (운영에선 제거)
        log.info("[MAIL SENT] email={} code={}", email, code);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean verifyCode(String email, String code) {
        PasswordCode latest = passwordCodeRepository
                .findTopByEmailOrderByCreateDateDesc(email)
                .orElse(null);

        if (latest == null || code == null) return false;
        return code.equals(latest.getPasswordCode());
    }
}