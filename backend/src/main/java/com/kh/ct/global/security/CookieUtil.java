package com.kh.ct.global.security;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseCookie;

public final class CookieUtil {

    private CookieUtil() {}

    public static void addRefreshCookie(HttpServletResponse response,
                                        String refreshToken,
                                        boolean secure,
                                        String sameSite,
                                        long maxAgeSeconds) {

        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(secure)              // 운영 HTTPS면 true
                .sameSite(sameSite)          // "Lax" 또는 "None"
                .path("/api/auth/refresh")
                .maxAge(maxAgeSeconds)
                .build();

        response.addHeader("Set-Cookie", cookie.toString());
    }

    public static void clearRefreshCookie(HttpServletResponse response,
                                          boolean secure,
                                          String sameSite) {

        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(secure)
                .sameSite(sameSite)
                .path("/api/auth/refresh")
                .maxAge(0)
                .build();

        response.addHeader("Set-Cookie", cookie.toString());
    }
}