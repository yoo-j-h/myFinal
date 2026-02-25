package com.kh.ct.domain.emp.service;

import com.kh.ct.domain.emp.repository.PasswordCodeRepository;
import com.kh.ct.global.util.ValkeyKeys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Duration;

@Slf4j
@Service
@RequiredArgsConstructor
public class PasswordCodeServiceImpl implements PasswordCodeService {

    private final PasswordCodeRepository passwordCodeRepository; // ✅ 롤백 대비(주석 처리로 남겨둠)
    private final EmailSender emailSender;

    // ✅ Valkey
    private final StringRedisTemplate redis;

    // ✅ 키 중앙 관리
    private final ValkeyKeys keys;

    private static final SecureRandom RANDOM = new SecureRandom();

    private static final Duration CODE_TTL = Duration.ofMinutes(5);
    private static final Duration COOLDOWN_TTL = Duration.ofSeconds(30);

    private String generate6DigitCode() {
        int n = RANDOM.nextInt(900000) + 100000;
        return String.valueOf(n);
    }

    @Override
    @Transactional
    public void sendCode(String email) {

        if (Boolean.TRUE.equals(redis.hasKey(keys.pwdCooldown(email)))) {
            throw new IllegalStateException("인증코드 재요청은 30초 후 가능합니다.");
        }

        String code = generate6DigitCode();

        // ✅ Valkey 저장 (5분 TTL)
        redis.opsForValue().set(keys.pwdCode(email), code, CODE_TTL);

        // ✅ 쿨타임 키 저장 (30초)
        redis.opsForValue().set(keys.pwdCooldown(email), "1", COOLDOWN_TTL);

        // ✅ 기존 DB 저장 로직 (삭제 X) - 주석 처리
        /*
        PasswordCode entity = PasswordCode.builder()
                .email(email)
                .passwordCode(code)
                .codeExpiresDate(LocalDateTime.now())
                .passwordCodeStatus(CommonEnums.CommonStatus.Y)
                .build();

        passwordCodeRepository.save(entity);
        */

        String subject = "[인증코드] 6자리 인증번호";
        String text = "인증번호: " + code + "\n(5분 후 만료)";
        emailSender.send(email, subject, text);

        log.info("[MAIL SENT] email={} code={} ttl={}s", email, code, CODE_TTL.toSeconds());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean verifyCode(String email, String code) {

        if (email == null || email.isBlank() || code == null || code.isBlank()) return false;

        String saved = redis.opsForValue().get(keys.pwdCode(email));
        if (saved == null) return false;
        if (!code.equals(saved)) return false;

        // ✅ 1회용
        redis.delete(keys.pwdCode(email));

        // ✅ 기존 DB 검증 로직 (삭제 X) - 주석 처리
        /*
        PasswordCode latest = passwordCodeRepository
                .findTopByEmailOrderByCreateDateDesc(email)
                .orElse(null);

        if (latest == null || code == null) return false;
        return code.equals(latest.getPasswordCode());
        */

        return true;
    }
}