package com.kh.ct.global.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Optional;

@Component
public class JwtTokenProvider {

    private final SecretKey secretKey;
    private final long expiration;

    // 생성자에서 secret과 expiration 주입
    public JwtTokenProvider(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long expiration) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expiration = expiration;
    }

    // JWT 토큰 생성
    public String generateToken(String empId, String role) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        //claim은 JWT 안에 들어가는 커스텀 데이터.
        return Jwts.builder()
                .subject(empId)
                .claim("role", role)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(secretKey)
                .compact();
    }

    /**
     * 토큰에서 사용자 ID 추출
     */
    public String getempIdFromToken(String token) {
        Claims claims = getClaims(token);
        return claims.getSubject();
    }

    /**
     * 토큰에서 권한 추출
     */
    public String getRoleFromToken(String token) {
        Claims claims = getClaims(token);
        return claims.get("role", String.class);
    }

    //토큰에서 Claims 추출
    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseClaimsJws(token)
                .getPayload();
    }

    /**
     * 토큰 유효성 검증 및 Claims 반환
     * 검증 성공 시 Claims를 포함한 Optional 반환, 실패 시 Optional.empty() 반환
     */
    public Optional<Claims> validateToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return Optional.of(claims);
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}
