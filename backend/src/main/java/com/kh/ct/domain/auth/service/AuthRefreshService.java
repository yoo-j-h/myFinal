package com.kh.ct.domain.auth.service;

import com.kh.ct.domain.auth.dto.AuthDto;
import com.kh.ct.domain.auth.entity.RefreshToken;
import com.kh.ct.domain.auth.repository.RefreshTokenRepository;
import com.kh.ct.domain.emp.entity.Emp;
import com.kh.ct.global.security.CookieUtil;
import com.kh.ct.global.security.JwtTokenProvider;
import com.kh.ct.global.security.RefreshTokenGenerator;
import com.kh.ct.global.security.RefreshTokenHasher;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthRefreshService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtTokenProvider jwtTokenProvider;

    private static final long ACCESS_EXPIRES_IN = 900L;
    private static final long REFRESH_DAYS = 14;
    private static final long REFRESH_MAX_AGE = 14 * 24 * 60 * 60L;

    private static final boolean COOKIE_SECURE = true;
    private static final String COOKIE_SAMESITE = "Lax";

    @Transactional
    public AuthDto.RefreshResponse refresh(String rawRefreshToken,
                                           String ip,
                                           String userAgent,
                                           HttpServletResponse response) {

        LocalDateTime now = LocalDateTime.now();

        if (rawRefreshToken == null || rawRefreshToken.isBlank()) {
            throw new IllegalArgumentException("Refresh token is missing.");
        }

        String hash = RefreshTokenHasher.hash(rawRefreshToken);
        RefreshToken stored = refreshTokenRepository.findByTokenHash(hash)
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token."));

        Emp emp = stored.getEmp();

        // ✅ 재사용 공격 탐지: 이미 revoked된 토큰이 다시 들어오면
        if (stored.isRevoked()) {
            refreshTokenRepository.revokeAllActiveByEmpId(emp.getEmpId(), now);
            throw new IllegalArgumentException("Refresh token reuse detected. Please login again.");
        }

        // ✅ 만료 검증
        if (stored.isExpired(now)) {
            stored.revoke(now);
            throw new IllegalArgumentException("Refresh token expired. Please login again.");
        }

        // ✅ 새 Access 발급
        String newAccess = jwtTokenProvider.generateToken(emp.getEmpId(), emp.getRole().name());

        // ✅ 회전(Rotation): 새 Refresh 발급 + DB 저장
        String newRawRefresh = RefreshTokenGenerator.generate();
        String newHash = RefreshTokenHasher.hash(newRawRefresh);

        refreshTokenRepository.save(
                RefreshToken.builder()
                        .emp(emp)
                        .tokenHash(newHash)
                        .expiresAt(now.plusDays(REFRESH_DAYS))
                        .ipAddress(ip)
                        .userAgent(userAgent)
                        .build()
        );

        // 기존 refresh 폐기 + 연결 기록
        stored.rotateTo(newHash, now);

        // ✅ 새 refresh 쿠키 재세팅
        CookieUtil.addRefreshCookie(response, newRawRefresh, COOKIE_SECURE, COOKIE_SAMESITE, REFRESH_MAX_AGE);

        return AuthDto.RefreshResponse.builder()
                .accessToken(newAccess)
                .accessTokenExpiresIn(ACCESS_EXPIRES_IN)
                .build();
    }
}