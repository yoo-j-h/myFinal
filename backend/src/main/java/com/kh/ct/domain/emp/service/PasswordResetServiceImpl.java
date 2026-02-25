package com.kh.ct.domain.emp.service;

import com.kh.ct.domain.emp.dto.EmpDto;
import com.kh.ct.domain.emp.entity.Emp;
import com.kh.ct.domain.emp.repository.EmpRepository;
import com.kh.ct.domain.emp.repository.PasswordTokenRepository;
import com.kh.ct.global.common.CommonEnums;
import com.kh.ct.global.common.TokenHashUtil;
import com.kh.ct.global.util.ValkeyKeys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PasswordResetServiceImpl implements PasswordResetService {

    private final EmpRepository empRepository;
    private final PasswordTokenRepository passwordTokenRepository; // ✅ 롤백 대비
    private final EmailSender emailSender;
    private final PasswordEncoder passwordEncoder;

    private final StringRedisTemplate redis;

    // ✅ 키 중앙관리
    private final ValkeyKeys keys;

    private static final int EXPIRE_MINUTES = 15;

    @Value("${app.frontend.base-url:http://localhost:5173}")
    private String frontendBaseUrl;

    @Override
    @Transactional
    public void sendResetLink(EmpDto.SendPasswordResetLinkRequest request) {

        Emp emp = empRepository.findByEmpIdAndEmailAndEmpStatus(
                request.getEmpId(),
                request.getEmail(),
                CommonEnums.EmpStatus.Y
        ).orElse(null);

        if (emp == null) {
            log.info("[RESET LINK] no matched account. empId={} email={}", request.getEmpId(), request.getEmail());
            return;
        }

        /*
        passwordTokenRepository.updateStatusByEmpId(emp.getEmpId(), CommonEnums.CommonStatus.N);
        */

        String rawToken = UUID.randomUUID().toString();
        String tokenHash = TokenHashUtil.sha256Hex(rawToken);

        // ✅ 사용자당 1토큰 정책 (Valkey)
        String oldHash = redis.opsForValue().get(keys.pwdResetEmp(emp.getEmpId()));
        if (oldHash != null) {
            redis.delete(keys.pwdResetToken(oldHash));
        }

        Duration ttl = Duration.ofMinutes(EXPIRE_MINUTES);
        redis.opsForValue().set(keys.pwdResetToken(tokenHash), emp.getEmpId(), ttl);
        redis.opsForValue().set(keys.pwdResetEmp(emp.getEmpId()), tokenHash, ttl);

        /*
        DB 저장 로직 주석 유지
        */

        String encoded = URLEncoder.encode(rawToken, StandardCharsets.UTF_8);
        String resetUrl = frontendBaseUrl + "/reset-password?token=" + encoded;

        String subject = "[CT] 비밀번호 재설정 링크";
        String text =
                "비밀번호 재설정을 요청하셨습니다.\n\n" +
                        "아래 링크로 접속하여 비밀번호를 재설정하세요:\n" +
                        resetUrl + "\n\n" +
                        "※ 본인이 요청하지 않았다면 이 메일을 무시해주세요.\n" +
                        "※ 링크는 " + EXPIRE_MINUTES + "분 후 만료됩니다.";

        String html = """
        <!doctype html>
        <html lang="ko">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Password Reset</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
          <div style="max-width: 520px; margin: 0 auto; padding: 24px;">
            <h2 style="margin: 0 0 16px;">비밀번호 재설정</h2>
            <p style="margin: 0 0 16px;">
              비밀번호 재설정을 요청하셨습니다. 아래 버튼을 클릭하여 재설정을 진행하세요.
            </p>

            <p style="margin: 24px 0;">
              <a href="%s"
                 style="display: inline-block; padding: 12px 18px; text-decoration: none;
                        border-radius: 10px; background: #111; color: #fff; font-weight: 700;">
                비밀번호 재설정하기
              </a>
            </p>

            <p style="margin: 0 0 12px; font-size: 13px; color: #555;">
              버튼이 동작하지 않으면 아래 링크를 복사해 브라우저에 붙여넣으세요:
            </p>

            <p style="word-break: break-all; font-size: 13px;">
              <a href="%s">%s</a>
            </p>

            <hr style="margin: 24px 0; border: 0; border-top: 1px solid #eee;" />

            <p style="margin: 0; font-size: 12px; color: #666;">
              본인이 요청하지 않았다면 이 메일을 무시해주세요.<br/>
              링크는 %d분 후 만료됩니다.
            </p>
          </div>
        </body>
        </html>
        """.formatted(resetUrl, resetUrl, resetUrl, EXPIRE_MINUTES);

        emailSender.sendMultipart(emp.getEmail(), subject, text, html);
        log.info("[RESET LINK SENT][VALKEY] empId={} email={} expireMin={}", emp.getEmpId(), emp.getEmail(), EXPIRE_MINUTES);
    }

    @Override
    @Transactional(readOnly = true)
    public EmpDto.ValidatePasswordTokenResponse validate(String rawToken) {

        if (rawToken == null || rawToken.isBlank()) {
            return EmpDto.ValidatePasswordTokenResponse.invalid("토큰이 비어있습니다.");
        }

        String tokenHash = TokenHashUtil.sha256Hex(rawToken);

        String empId = redis.opsForValue().get(keys.pwdResetToken(tokenHash));
        if (empId == null) {
            return EmpDto.ValidatePasswordTokenResponse.invalid("토큰이 만료되었거나 유효하지 않습니다.");
        }

        /*
        DB 검증 로직 주석 유지
        */

        return EmpDto.ValidatePasswordTokenResponse.valid();
    }

    @Override
    @Transactional
    public void resetPassword(EmpDto.ResetPasswordByTokenRequest request) {

        String rawToken = request.getToken();
        if (rawToken == null || rawToken.isBlank()) {
            throw new IllegalArgumentException("토큰(token)은 필수입니다.");
        }

        String tokenHash = TokenHashUtil.sha256Hex(rawToken);

        String empId = redis.opsForValue().get(keys.pwdResetToken(tokenHash));
        if (empId == null) {
            throw new IllegalArgumentException("토큰이 만료되었거나 이미 사용되었습니다.");
        }

        Emp emp = empRepository.findById(empId)
                .orElseThrow(() -> new IllegalArgumentException("계정을 찾을 수 없습니다."));

        emp.changePassword(passwordEncoder.encode(request.getNewPassword()));

        redis.delete(keys.pwdResetToken(tokenHash));
        redis.delete(keys.pwdResetEmp(empId));

        /*
        DB 기반 로직 주석 유지
        */

        log.info("[PASSWORD RESET OK][VALKEY] empId={}", emp.getEmpId());
    }
}