package com.kh.ct.global.config;

import com.kh.ct.global.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        // =========================
                        // 1) 인증 없이 허용(permitAll)
                        // =========================
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/refresh").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/valkey/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/valkey/**").permitAll()

                        // 회원가입/사전 단계
                        .requestMatchers(HttpMethod.POST, "/api/auth/ocr-business-card").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/signup").permitAll()

                        // 비밀번호/계정 관련
                        .requestMatchers(HttpMethod.POST, "/api/auth/password/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/passwordCode/**").permitAll()
                        .requestMatchers("/api/account-activation/**").permitAll()

                        // emp 관련 (가입/조회 일부)
                        .requestMatchers(HttpMethod.POST, "/api/emps").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/emps/findId").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/emps/checkId").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/emps/empNo/preview").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/emps/*/airline").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/emps/me/airline").permitAll() // 테마용: 인증 실패 시에도 기본 데이터 반환 (아래 me/** 보다 먼저 매칭)
                        .requestMatchers("/api/emps/me/**").authenticated() // 내 정보 조회 등은 인증 필수
                        .requestMatchers(HttpMethod.POST, "/api/passwordCode/**").permitAll()

                        // 기타 공개 API
                        .requestMatchers("/api/chat").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/health/preview").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/health/save").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/airline-applications").permitAll()
                        .requestMatchers("/api/questions/**").permitAll()
                        .requestMatchers("/api/common/codes/**").permitAll()
                        .requestMatchers("/api/airlines").permitAll()
                        .requestMatchers("/api/airports").permitAll()

                        // 파일 (정책 재검토 필요: 지금은 전부 오픈)
                        .requestMatchers("/api/file/**").permitAll()
                        .requestMatchers("/api/file/download/**").permitAll()

                        // 항공편 API
                        .requestMatchers(HttpMethod.GET, "/api/flight-schedules/sync").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/flight-schedules").permitAll()

                        // WebSocket 등
                        .requestMatchers("/ws/**").permitAll()
                        .requestMatchers("/api/settings/**").permitAll()

                        // =========================
                        // 2) 인증 필요(authenticated)
                        // =========================
                        // 내 정보 (와일드카드보다 우선순위 높게)
                        .requestMatchers("/api/emps/me/**").authenticated()

                        // ✅ 직원 출/퇴근: 인증 필요
                        .requestMatchers("/api/attendance/**").authenticated()

                        // 알림: SSE는 permitAll, 나머지는 인증 필요
                        .requestMatchers("/api/notifications/stream").permitAll()
                        .requestMatchers("/api/notifications/**").authenticated()

                        // 이메일 문의
                        .requestMatchers("/api/support/**").authenticated()

                        // =========================
                        // 3) 권한(Role) 기반
                        // =========================
                        .requestMatchers("/api/super-admin/**").hasRole("SUPER_ADMIN")

                        // 항공편 수정/삭제는 관리자 권한
                        .requestMatchers(HttpMethod.POST, "/api/flight-schedules/**")
                        .hasAnyRole("AIRLINE_ADMIN", "SUPER_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/flight-schedules/**")
                        .hasAnyRole("AIRLINE_ADMIN", "SUPER_ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/flight-schedules/**")
                        .hasAnyRole("AIRLINE_ADMIN", "SUPER_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/flight-schedules/**")
                        .hasAnyRole("AIRLINE_ADMIN", "SUPER_ADMIN")

                        // 기타 인증 필요 경로
                        .requestMatchers("/api/emp/**").authenticated()

                        // 관리자 전용
                        .requestMatchers(HttpMethod.GET, "/api/members").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/members/search").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/members/**").hasRole("ADMIN")
                        .requestMatchers("/api/dashboard/admin/**").permitAll()
                        .requestMatchers("/api/admin/attendance/**").permitAll()
                        .requestMatchers("/api/health/admin/**").permitAll()

                        // =========================
                        // 4) 나머지
                        // =========================
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:5174"));
        corsConfiguration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        corsConfiguration.addAllowedHeader("*");
        corsConfiguration.setAllowCredentials(true);
        corsConfiguration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}