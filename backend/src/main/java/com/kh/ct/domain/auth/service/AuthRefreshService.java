package com.kh.ct.domain.auth.service;

import com.kh.ct.domain.auth.dto.AuthDto;
import com.kh.ct.domain.auth.repository.RefreshTokenRepository;
import com.kh.ct.global.security.CookieUtil;
import com.kh.ct.global.security.JwtTokenProvider;
import com.kh.ct.global.security.RefreshTokenGenerator;
import com.kh.ct.global.security.RefreshTokenHasher;
import com.kh.ct.global.util.ValkeyKeys;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class AuthRefreshService {

    private final RefreshTokenRepository refreshTokenRepository; // ✅ 롤백 대비
    private final JwtTokenProvider jwtTokenProvider;

    private final StringRedisTemplate redis;
    private final ValkeyKeys keys;

    private static final long ACCESS_EXPIRES_IN = 900L;
    private static final long REFRESH_DAYS = 14;
    private static final long REFRESH_MAX_AGE = 14 * 24 * 60 * 60L;

    private static final boolean COOKIE_SECURE = true;
    private static final String COOKIE_SAMESITE = "Lax";

    private String rtKey(String tokenHash) {
        // ValkeyKeys에 rtHash(tokenHash) 추가했다면 keys.rtHash(tokenHash)로 교체 추천
        return keys.rtSession(tokenHash); // 현재 메서드명 rtSession이지만 tokenHash를 인자로 사용
    }

    private String rtEmpIndexKey(String empId) {
        // ValkeyKeys에 rtEmpIndex(empId) 추가 추천
        return "dev:ct:rt:emp:" + empId; // 우선 하드코딩 대신 keys로 옮기는 걸 추천
    }

    @Transactional
    public AuthDto.RefreshResponse refresh(String rawRefreshToken,
                                           String ip,
                                           String userAgent,
                                           HttpServletResponse response) {

        if (rawRefreshToken == null || rawRefreshToken.isBlank()) {
            throw new IllegalArgumentException("Refresh token is missing.");
        }

        long nowEpoch = System.currentTimeMillis();
        long expiresAtEpoch = nowEpoch + (REFRESH_DAYS * 24L * 60L * 60L * 1000L);

        String hash = RefreshTokenHasher.hash(rawRefreshToken);

        // ==========================
        // ✅ Valkey: 세션 조회
        // ==========================
        String empId = (String) redis.opsForHash().get(rtKey(hash), "empId");
        if (empId == null) {
            // DB 대체: findByTokenHash(hash)
            throw new IllegalArgumentException("Invalid refresh token.");
        }

        String role = (String) redis.opsForHash().get(rtKey(hash), "role");
        String revokedAt = (String) redis.opsForHash().get(rtKey(hash), "revokedAtEpoch");
        String storedExpiresAt = (String) redis.opsForHash().get(rtKey(hash), "expiresAtEpoch");

        long revokedAtEpoch = revokedAt == null || revokedAt.isBlank() ? 0L : Long.parseLong(revokedAt);
        long storedExpiresAtEpoch = storedExpiresAt == null || storedExpiresAt.isBlank() ? 0L : Long.parseLong(storedExpiresAt);

        // ✅ 재사용 공격 탐지: 이미 revoked된 토큰이 다시 들어오면
        if (revokedAtEpoch != 0L) {
            // DB: refreshTokenRepository.revokeAllActiveByEmpId(empId, now)
            // ==========================
            // ✅ Valkey: 해당 empId 세션 전부 revoke (권장)
            // ==========================
            var idxKey = rtEmpIndexKey(empId);
            var hashes = redis.opsForSet().members(idxKey);
            if (hashes != null) {
                for (String h : hashes) {
                    redis.opsForHash().put(rtKey(h), "revokedAtEpoch", String.valueOf(nowEpoch));
                }
            }
            throw new IllegalArgumentException("Refresh token reuse detected. Please login again.");
        }

        // ✅ 만료 검증
        if (storedExpiresAtEpoch != 0L && storedExpiresAtEpoch < nowEpoch) {
            redis.opsForHash().put(rtKey(hash), "revokedAtEpoch", String.valueOf(nowEpoch));
            throw new IllegalArgumentException("Refresh token expired. Please login again.");
        }

        // ✅ 새 Access 발급
        // (role이 null일 경우를 대비해 DB에서 emp를 조회하는 fallback을 둘 수도 있음)
        String newAccess = jwtTokenProvider.generateToken(empId, role);

        // ✅ 회전(Rotation): 새 Refresh 발급 + Valkey 저장
        String newRawRefresh = RefreshTokenGenerator.generate();
        String newHash = RefreshTokenHasher.hash(newRawRefresh);

        // 새 세션 저장
        redis.opsForHash().put(rtKey(newHash), "empId", empId);
        redis.opsForHash().put(rtKey(newHash), "role", role);
        redis.opsForHash().put(rtKey(newHash), "expiresAtEpoch", String.valueOf(expiresAtEpoch));
        redis.opsForHash().put(rtKey(newHash), "revokedAtEpoch", "0");
        redis.opsForHash().put(rtKey(newHash), "rotatedTo", "");
        redis.opsForHash().put(rtKey(newHash), "ip", ip);
        redis.opsForHash().put(rtKey(newHash), "ua", userAgent);

        redis.expire(rtKey(newHash), Duration.ofDays(REFRESH_DAYS));

        // emp 인덱스(권장)
        redis.opsForSet().add(rtEmpIndexKey(empId), hash);
        redis.opsForSet().add(rtEmpIndexKey(empId), newHash);
        redis.expire(rtEmpIndexKey(empId), Duration.ofDays(REFRESH_DAYS));

        // 기존 refresh 폐기 + 연결 기록 (rotateTo)
        redis.opsForHash().put(rtKey(hash), "revokedAtEpoch", String.valueOf(nowEpoch));
        redis.opsForHash().put(rtKey(hash), "rotatedTo", newHash);

        // DB 로직은 주석 유지
        /*
        RefreshToken stored = refreshTokenRepository.findByTokenHash(hash)
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token."));
        Emp emp = stored.getEmp();
        ...
        refreshTokenRepository.save(...)
        stored.rotateTo(newHash, now);
        */

        CookieUtil.addRefreshCookie(response, newRawRefresh, COOKIE_SECURE, COOKIE_SAMESITE, REFRESH_MAX_AGE);

        return AuthDto.RefreshResponse.builder()
                .accessToken(newAccess)
                .accessTokenExpiresIn(ACCESS_EXPIRES_IN)
                .build();
    }
}