package com.kh.ct.global.config.websocket.interceptor;

import com.kh.ct.global.security.JwtTokenProvider;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class StompAuthChannelInterceptor implements ChannelInterceptor {
    private final JwtTokenProvider jwtTokenProvider; // 프로젝트의 JWT 검증 컴포넌트

    public StompAuthChannelInterceptor(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor == null) return message;

        // ✅ CONNECT에서만 JWT 파싱해서 User(Principal) 세팅
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {

            String auth = accessor.getFirstNativeHeader("Authorization");
            if (auth == null) auth = accessor.getFirstNativeHeader("authorization");

            String token = resolveBearer(auth);
            if (token == null) {
                throw new IllegalStateException("WS Authorization 헤더가 없거나 Bearer 형식이 아닙니다.");
            }

            Claims claims = jwtTokenProvider.validateToken(token)
                    .orElseThrow(() -> new IllegalStateException("WS JWT 검증 실패"));

            String empId = claims.getSubject(); // = generateToken()에서 subject(empId)
            String role = claims.get("role", String.class);

            // ✅ 권한 문자열은 프로젝트 규칙대로 맞추세요
            // 보통 Spring Security는 ROLE_ prefix 사용
            List<SimpleGrantedAuthority> authorities = List.of(
                    new SimpleGrantedAuthority("ROLE_" + role)
            );

            Authentication authentication =
                    new UsernamePasswordAuthenticationToken(empId, null, authorities);

            // ✅ 핵심: principal을 STOMP 세션에 심는 코드
            accessor.setUser(authentication);
        }

        return message;
    }

    private String resolveBearer(String auth) {
        if (auth == null) return null;
        String a = auth.trim();
        if (a.startsWith("Bearer ")) return a.substring(7).trim();
        return null;
    }
}
