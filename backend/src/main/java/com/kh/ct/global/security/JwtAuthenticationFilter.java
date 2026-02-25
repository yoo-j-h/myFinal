package com.kh.ct.global.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

@RequiredArgsConstructor
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        //요청정보를 가지고 인증후, 인증이 완료되면 정보를 security에 저장

        try {
            //1. 요청정보에서 토큰 추출
            String token = getJwtFormRequest(request);

            //2. 토큰이 정상적인 토큰인지를 검증
            if (StringUtils.hasText(token)) {
                Optional<Claims> claimsOpt = jwtTokenProvider.validateToken(token);

                if (claimsOpt.isPresent()) {
                    String empId = jwtTokenProvider.getempIdFromToken(token);
                    String role = jwtTokenProvider.getRoleFromToken(token);

                    //Security Context에 인증정보를 저장
                    SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(empId, null, Collections.singletonList(authority));
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    logger.info("JWT 인증 성공 - empId: " + empId + ", role: " + role + ", path: " + request.getRequestURI());
                } else {
                    logger.warn("JWT 토큰 검증 실패 - path: " + request.getRequestURI());
                }
            } else {
                logger.warn("JWT 토큰 없음 - path: " + request.getRequestURI());
            }
        } catch (Exception e) {
            logger.error("JWT인증 에러 - path: " + request.getRequestURI(), e);
        }

        filterChain.doFilter(request, response);

    }

    private String getJwtFormRequest(HttpServletRequest request) {
        // 1. Authorization 헤더에서 토큰 추출
        String bearerToken = request.getHeader("Authorization");
        if(StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }

        // 2. 쿼리 파라미터에서 토큰 추출 (SSE용)
        String tokenParam = request.getParameter("token");
        if(StringUtils.hasText(tokenParam)) {
            logger.info("쿼리 파라미터에서 토큰 추출 - path: " + request.getRequestURI() + ", token length: " + tokenParam.length());
            return tokenParam;
        }

        return null;
    }
}
