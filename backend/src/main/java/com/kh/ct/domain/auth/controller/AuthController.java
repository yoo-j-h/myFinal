package com.kh.ct.domain.auth.controller;

import com.kh.ct.domain.auth.dto.AuthDto;
import com.kh.ct.domain.auth.service.AuthRefreshService;
import com.kh.ct.domain.auth.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuthRefreshService authRefreshService;

    /**
     * 로그인
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<AuthDto.LoginResponse> login(
            @Valid @RequestBody AuthDto.LoginRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse
    ) {
        String ip = httpRequest.getRemoteAddr();
        String userAgent = httpRequest.getHeader("User-Agent");

        // ✅ 여기서 refresh 쿠키 세팅까지 authService.login이 처리
        return ResponseEntity.ok(authService.login(request, ip, userAgent, httpResponse));
    }

    /**
     * AccessToken 재발급 (RefreshToken은 쿠키로 받음)
     * POST /api/auth/refresh
     */
    @PostMapping("/refresh")
    public ResponseEntity<AuthDto.RefreshResponse> refresh(
            @CookieValue(name = "refreshToken", required = false) String refreshToken,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse
    ) {
        String ip = httpRequest.getRemoteAddr();
        String userAgent = httpRequest.getHeader("User-Agent");

        return ResponseEntity.ok(authRefreshService.refresh(refreshToken, ip, userAgent, httpResponse));
    }

    /**
     * 로그아웃 (RefreshToken 폐기 + 쿠키 삭제)
     * POST /api/auth/logout
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @CookieValue(name = "refreshToken", required = false) String refreshToken,
            HttpServletResponse httpResponse
    ) {
        authService.logout(refreshToken);
        authService.clearRefreshCookie(httpResponse);
        return ResponseEntity.ok().build();
    }

    /**
     * 내 정보 조회 (인증 필요)
     * GET /api/auth/me
     */
    @GetMapping("/me")
    public ResponseEntity<AuthDto.MeResponse> me(Authentication authentication) {
        String empId = authentication.getName();
        return ResponseEntity.ok(authService.me(empId));
    }

    /**
     * 명함 이미지 OCR - DB 저장 없음, 폼 자동완성 전용
     * POST /api/auth/ocr-business-card
     *
     * @param file 명함 이미지 파일 (multipart/form-data)
     * @return 추출된 명함 정보 (empName, phone, email, job, company)
     */
    @PostMapping("/ocr-business-card")
    public ResponseEntity<AuthDto.BusinessCardOcrResponse> ocrBusinessCard(
            @RequestPart("file") MultipartFile file
    ) {
        AuthDto.BusinessCardOcrResponse response = authService.extractBusinessCard(file);
        return ResponseEntity.ok(response);
    }

    /**
     * 최종 회원가입 - Emp 엔티티 DB 저장
     * POST /api/auth/signup
     *
     * @param request 사용자가 확인/수정한 회원가입 정보
     * @return 201 Created
     */
    @PostMapping("/signup")
    public ResponseEntity<Void> signUp(@Valid @RequestBody AuthDto.SignUpRequest request) {
        authService.signUp(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}