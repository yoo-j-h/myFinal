package com.kh.ct.domain.auth.repository;

import com.kh.ct.domain.auth.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByTokenHash(String tokenHash);

    // ✅ (기존 문제 메서드 대체) Emp의 PK가 empId(String)라면 아래가 정답
    List<RefreshToken> findAllByEmp_EmpIdAndRevokedAtIsNull(String empId);

    // ✅ 재사용 탐지 시 “해당 사용자 활성 refresh 전부 폐기”
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
        update RefreshToken rt
           set rt.revokedAt = :now
         where rt.emp.empId = :empId
           and rt.revokedAt is null
    """)
    int revokeAllActiveByEmpId(@Param("empId") String empId,
                               @Param("now") LocalDateTime now);

    // ✅ 만료된 토큰 일괄 폐기 같은 배치에도 활용 가능
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
        delete from RefreshToken rt
         where rt.expiresAt < :now
    """)
    int deleteExpired(@Param("now") LocalDateTime now);
}