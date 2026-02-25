package com.kh.ct.global.common;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

public final class TokenHashUtil {
    private TokenHashUtil() {}

    public static String sha256Hex(String raw) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(raw.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(digest.length * 2);
            for (byte b : digest) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) {
            throw new IllegalStateException("SHA-256 hashing failed", e);
        }
    }
}