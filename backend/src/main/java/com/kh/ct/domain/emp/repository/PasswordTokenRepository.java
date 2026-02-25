package com.kh.ct.domain.emp.repository;

import com.kh.ct.domain.emp.entity.PasswordToken;
import com.kh.ct.global.common.CommonEnums;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface PasswordTokenRepository extends JpaRepository<PasswordToken, Long> {

    // ✅ 해시값(=passwordToken 컬럼)으로 토큰 조회
    Optional<PasswordToken> findByPasswordToken(String passwordToken);

    // ✅ (선택) 사용자당 1토큰 정책: 기존 토큰들 상태 N 처리
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
        update PasswordToken pt
           set pt.passwordTokenStatus = :status
         where pt.empId.empId = :empId
    """)
    int updateStatusByEmpId(@Param("empId") String empId,
                            @Param("status") CommonEnums.CommonStatus status);

    // ✅ (선택) 만료 토큰 정리
    long deleteByTokenExpiresDateBefore(LocalDateTime now);
}
