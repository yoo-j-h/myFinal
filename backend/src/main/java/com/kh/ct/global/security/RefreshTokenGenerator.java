package com.kh.ct.global.security;

import java.security.SecureRandom;
import java.util.Base64;

public final class RefreshTokenGenerator {

    private static final SecureRandom secureRandom = new SecureRandom();

    // 32바이트 = 256bit (충분히 강력)
    private static final int TOKEN_BYTE_LENGTH = 32;

    private RefreshTokenGenerator() {
    }

    /**
     * 강력한 랜덤 Refresh Token 생성
     * - 256bit 랜덤
     * - Base64 URL Safe 인코딩 (쿠키/URL에 안전)
     */
    public static String generate() {
        byte[] randomBytes = new byte[TOKEN_BYTE_LENGTH];
        secureRandom.nextBytes(randomBytes);

        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(randomBytes);
    }
}