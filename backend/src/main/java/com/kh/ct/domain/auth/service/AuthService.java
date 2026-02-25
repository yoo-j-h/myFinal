package com.kh.ct.domain.auth.service;

import com.kh.ct.domain.auth.dto.AuthDto;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.multipart.MultipartFile;

public interface AuthService {

    /**
     * 로그인 처리 후 AccessToken 반환 + RefreshToken 쿠키 세팅
     */
    AuthDto.LoginResponse login(
            AuthDto.LoginRequest request,
            String ip,
            String userAgent,
            HttpServletResponse response
    );

    /**
     * 현재 로그인된 사용자 정보 반환
     */
    AuthDto.MeResponse me(String empId);

    /**
     * 로그아웃: RefreshToken 폐기(서버 저장소에서 revoke 처리)
     */
    void logout(String rawRefreshToken);

    /**
     * RefreshToken 쿠키 삭제
     */
    void clearRefreshCookie(HttpServletResponse response);

    /**
     * 명함 이미지 OCR - DB 저장 없음, 폼 자동완성 전용
     */
    AuthDto.BusinessCardOcrResponse extractBusinessCard(MultipartFile file);

    /**
     * 최종 회원가입 - Emp 엔티티 DB 저장
     */
    void signUp(AuthDto.SignUpRequest request);
}