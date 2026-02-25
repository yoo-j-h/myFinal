package com.kh.ct.domain.emp.service;

public interface PasswordCodeService {

    /** 테스트용: 6자리 코드 생성 후 DB 저장 + 로그 출력 */
    void sendCode(String email);

    /** DB의 최신 코드와 사용자 입력 코드가 일치하는지 검증 */
    boolean verifyCode(String email, String code);
}
