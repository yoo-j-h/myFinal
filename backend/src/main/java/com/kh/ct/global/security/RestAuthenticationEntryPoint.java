package com.kh.ct.global.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kh.ct.global.exception.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper om = new ObjectMapper();

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException {

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        response.getWriter().write(om.writeValueAsString(
                ErrorResponse.of("인증이 필요합니다. 다시 로그인해주세요.")
        ));
    }
}
