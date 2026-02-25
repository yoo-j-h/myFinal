package com.kh.ct.domain.emp.service;

import com.kh.ct.domain.emp.dto.EmpDto;

public interface PasswordResetService {

    /** 1) 아이디+이메일 매칭 시 비밀번호 재설정 링크 메일 발송 */
    void sendResetLink(EmpDto.SendPasswordResetLinkRequest request);

    /** 2) reset 페이지 진입 전 토큰 유효성 확인 */
    EmpDto.ValidatePasswordTokenResponse validate(String rawToken);

    /** 3) 토큰으로 비밀번호 재설정 */
    void resetPassword(EmpDto.ResetPasswordByTokenRequest request);
}
