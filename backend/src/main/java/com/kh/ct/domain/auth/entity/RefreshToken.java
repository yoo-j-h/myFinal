package com.kh.ct.domain.auth.entity;

import com.kh.ct.domain.emp.entity.Emp;
import com.kh.ct.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "refresh_token",
        indexes = {
                @Index(name = "idx_refresh_token_emp_id", columnList = "emp_id"),
                @Index(name = "idx_refresh_token_expires_at", columnList = "expires_at"),
                @Index(name = "idx_refresh_token_revoked_at", columnList = "revoked_at"),
                @Index(name = "idx_refresh_token_token_hash", columnList = "token_hash", unique = true)
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class RefreshToken extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 어떤 사용자(사원)의 refresh인지
     * - 실무에서는 사용자당 여러 기기/브라우저 세션이 있을 수 있으므로 ManyToOne이 자연스럽습니다.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "emp_id", nullable = false)
    private Emp emp;

    /**
     * Refresh 토큰 원문은 DB에 저장하지 않는 것이 안전합니다.
     * - token_hash = SHA-256 같은 단방향 해시 결과
     * - unique 인덱스 권장 (충돌 가능성 거의 없지만, 중복 방지)
     */
    @Column(name = "token_hash", nullable = false, length = 64, unique = true)
    private String tokenHash;

    /**
     * Refresh 만료 시각
     */
    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    /**
     * Refresh 폐기 시각 (로그아웃/강제 종료/회전 등)
     * - null이면 활성 상태로 간주
     */
    @Column(name = "revoked_at")
    private LocalDateTime revokedAt;

    /**
     * 회전(Rotation)용: 이 refresh가 사용되어 교체되었을 때,
     * 어떤 새 refresh로 교체되었는지 연결해두면 추적/감사가 쉬워집니다.
     */
    @Column(name = "replaced_by_token_hash", length = 64)
    private String replacedByTokenHash;

    /**
     * (선택) 세션 식별/관리용
     * - "이 기기에서만 로그아웃" / "세션 목록 보기" 구현 시 유용
     * - 프론트가 UUID 같은 값을 생성해 헤더/바디로 보내고 저장하는 방식 많이 씀
     */
    @Column(name = "session_id", length = 64)
    private String sessionId;

    /**
     * (선택) 이상징후 탐지/감사용 정보
     * - 재사용 공격 의심 시점에 어떤 UA/IP였는지 분석 가능
     */
    @Column(name = "user_agent", length = 255)
    private String userAgent;

    @Column(name = "ip_address", length = 45) // IPv6 고려
    private String ipAddress;

    /* =========================
       도메인 메서드(상태 변경)
       ========================= */

    public boolean isExpired(LocalDateTime now) {
        return expiresAt.isBefore(now) || expiresAt.isEqual(now);
    }

    public boolean isRevoked() {
        return revokedAt != null;
    }

    /**
     * 정상적인 폐기(로그아웃/관리자 강제 로그아웃 등)
     */
    public void revoke(LocalDateTime now) {
        if (this.revokedAt == null) {
            this.revokedAt = now;
        }
    }

    /**
     * 회전 처리: 새 refresh로 교체되었음을 기록하고 현재 토큰을 폐기
     */
    public void rotateTo(String newTokenHash, LocalDateTime now) {
        this.replacedByTokenHash = newTokenHash;
        revoke(now);
    }
}