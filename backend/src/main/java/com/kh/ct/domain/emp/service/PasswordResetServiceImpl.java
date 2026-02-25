package com.kh.ct.domain.emp.service;

import com.kh.ct.domain.emp.dto.EmpDto;
import com.kh.ct.domain.emp.entity.Emp;
import com.kh.ct.domain.emp.entity.PasswordToken;
import com.kh.ct.domain.emp.repository.EmpRepository;
import com.kh.ct.domain.emp.repository.PasswordTokenRepository;
import com.kh.ct.global.common.CommonEnums;
import com.kh.ct.global.common.TokenHashUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PasswordResetServiceImpl implements PasswordResetService {

    private final EmpRepository empRepository;
    private final PasswordTokenRepository passwordTokenRepository;
    private final EmailSender emailSender;
    private final PasswordEncoder passwordEncoder;

    private static final int EXPIRE_MINUTES = 15;

    /**
     * ✅ 프론트 주소를 properties로 분리 (dev/prod 모두 대응)
     * 예: http://localhost:5173
     * 배포: https://ct.yourdomain.com
     */
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

        // ✅ 계정 존재 여부 노출 방지
        if (emp == null) {
            log.info("[RESET LINK] no matched account. empId={} email={}", request.getEmpId(), request.getEmail());
            return;
        }

        // ✅ 사용자당 1토큰 정책: 기존 토큰 N 처리
        passwordTokenRepository.updateStatusByEmpId(emp.getEmpId(), CommonEnums.CommonStatus.N);

        String rawToken = UUID.randomUUID().toString();
        String tokenHash = TokenHashUtil.sha256Hex(rawToken);

        PasswordToken token = PasswordToken.builder()
                .empId(emp)
                .passwordToken(tokenHash)
                .tokenExpiresDate(LocalDateTime.now().plusMinutes(EXPIRE_MINUTES))
                .passwordTokenStatus(CommonEnums.CommonStatus.Y)
                .build();

        passwordTokenRepository.save(token);

        // ✅ 프론트 라우트로 이동시키는 링크 생성 (token URL 인코딩)
        String encoded = URLEncoder.encode(rawToken, StandardCharsets.UTF_8);
        String resetUrl = frontendBaseUrl + "/reset-password?token=" + encoded;

        String subject = "[CT] 비밀번호 재설정 링크";

        // 텍스트(대체본)
        String text =
                "비밀번호 재설정을 요청하셨습니다.\n\n" +
                        "아래 링크로 접속하여 비밀번호를 재설정하세요:\n" +
                        resetUrl + "\n\n" +
                        "※ 본인이 요청하지 않았다면 이 메일을 무시해주세요.\n" +
                        "※ 링크는 " + EXPIRE_MINUTES + "분 후 만료됩니다.";

        // HTML(버튼)
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

        // ✅ 멀티파트로 전송(권장)
        emailSender.sendMultipart(emp.getEmail(), subject, text, html);

        log.info("[RESET LINK SENT] empId={} email={} expireMin={}", emp.getEmpId(), emp.getEmail(), EXPIRE_MINUTES);
    }

    @Override
    @Transactional(readOnly = true)
    public EmpDto.ValidatePasswordTokenResponse validate(String rawToken) {

        if (rawToken == null || rawToken.isBlank()) {
            return EmpDto.ValidatePasswordTokenResponse.invalid("토큰이 비어있습니다.");
        }

        String tokenHash = TokenHashUtil.sha256Hex(rawToken);

        PasswordToken token = passwordTokenRepository.findByPasswordToken(tokenHash).orElse(null);
        if (token == null) return EmpDto.ValidatePasswordTokenResponse.invalid("유효하지 않은 토큰입니다.");
        if (!token.isActive()) return EmpDto.ValidatePasswordTokenResponse.invalid("이미 사용된 토큰입니다.");
        if (token.isExpired()) return EmpDto.ValidatePasswordTokenResponse.invalid("토큰이 만료되었습니다.");

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

        PasswordToken token = passwordTokenRepository.findByPasswordToken(tokenHash)
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 토큰입니다."));

        if (!token.isUsable()) {
            throw new IllegalArgumentException("토큰이 만료되었거나 이미 사용되었습니다.");
        }

        Emp emp = token.getEmpId();
        emp.changePassword(passwordEncoder.encode(request.getNewPassword()));

        token.markUsed();
        log.info("[PASSWORD RESET OK] empId={}", emp.getEmpId());
    }
}
