package com.kh.ct.global.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

@Component
public class ValkeyKeys {

    @Value("${ct.redis.key-prefix:dev:ct}")
    private String prefix;

    // ==========================
    // 내부 공통 유틸
    // ==========================
    private String norm(String s) {
        return (s == null) ? "" : s.trim().toLowerCase();
    }

    /**
     * 이메일을 키에 그대로 쓰기 싫다면(특수문자/개인정보 노출 최소화),
     * 아래처럼 sha256을 키 suffix로 쓰는 방식도 가능.
     * - 운영에서 개인정보 최소노출 관점에 유리
     * - 디버깅은 조금 불편
     *
     * 지금은 "그대로" 써도 문제는 없지만, 선택지를 남겨둠.
     */





    private String sha256Hex(String raw) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] dig = md.digest(raw.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(dig.length * 2);
            for (byte b : dig) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }



    // ==========================
    // (1) 회원가입/이메일 인증코드 (별도 기능이 있다면)
    // ==========================
    public String signupEmailCode(String email) {
        // return prefix + ":signup:email:code:" + sha256Hex(norm(email));
        return prefix + ":signup:email:code:" + norm(email);
    }

    public String signupEmailCooldown(String email) {
        // return prefix + ":signup:email:cooldown:" + sha256Hex(norm(email));
        return prefix + ":signup:email:cooldown:" + norm(email);
    }

    // ==========================
    // (2) 비밀번호 찾기 - 6자리 코드
    // PasswordCodeServiceImpl 에서 사용
    // ==========================
    public String pwdCode(String email) {
        // return prefix + ":pwdcode:code:" + sha256Hex(norm(email));
        return prefix + ":pwdcode:code:" + norm(email);
    }

    public String pwdCooldown(String email) {
        // return prefix + ":pwdcode:cooldown:" + sha256Hex(norm(email));
        return prefix + ":pwdcode:cooldown:" + norm(email);
    }

    // ==========================
    // (3) 비밀번호 재설정 링크 토큰 (2-Key 정책)
    // PasswordResetServiceImpl 에서 사용
    // ==========================
    public String pwdResetToken(String tokenHash) {
        return prefix + ":pwdreset:token:" + tokenHash;
    }

    public String pwdResetEmp(String empId) {
        return prefix + ":pwdreset:emp:" + empId;
    }

    // ==========================
    // (4) 로그인 실패/락
    // ==========================
    public String loginFail(String empId) {
        return prefix + ":login:fail:" + empId;
    }

    public String loginLock(String empId) {
        return prefix + ":login:lock:" + empId;
    }

    // ==========================
    // (5) Refresh Token 세션 + 인덱스
    // AuthRefreshService 에서 사용(권장 통합)
    // ==========================
    /** tokenHash(= RefreshTokenHasher.hash(rawRefreshToken)) 기준 세션 Hash 키 */
    public String rtSessionByHash(String tokenHash) {
        return prefix + ":rt:sess:" + tokenHash;
    }

    /** empId 기준으로 refresh tokenHash들을 모아두는 Set 키 */
    public String rtEmpIndex(String empId) {
        return prefix + ":rt:emp:" + empId;
    }

    // --- (기존 메서드 호환용: 점진적 마이그레이션 필요하면 남겨둘 수 있음) ---
    /** @deprecated rtSessionByHash 사용 권장 */
    @Deprecated
    public String rtSession(String tokenHash) {
        return rtSessionByHash(tokenHash);
    }

    // ==========================
    // (6) 출근 중복 방지 락
    // ==========================
    public String attendanceLock(String empId, String yyyymmdd) {
        return prefix + ":lock:att:" + empId + ":" + yyyymmdd;
    }
}