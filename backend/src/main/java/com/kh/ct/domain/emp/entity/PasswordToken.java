package com.kh.ct.domain.emp.entity;

import com.kh.ct.global.common.CommonEnums;
import com.kh.ct.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(
        indexes = {
                @Index(name = "idx_password_token_emp_id", columnList = "emp_id"),
                @Index(name = "idx_password_token_password_token", columnList = "password_token")
        }
)
public class PasswordToken extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long PasswordTokenId;

    @JoinColumn(nullable = false, name = "emp_id")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Emp empId;

    // ✅ DB에는 "해시값" 저장 (SHA-256 hex = 64)
    @Column(name = "password_token", nullable = false, unique = true, length = 64)
    private String passwordToken;

    @Column(nullable = false)
    private LocalDateTime tokenExpiresDate;

    // ✅ Y/N
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private CommonEnums.CommonStatus passwordTokenStatus;

    // ---- 편의 메서드 ----
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.tokenExpiresDate);
    }

    public boolean isActive() {
        return this.passwordTokenStatus == CommonEnums.CommonStatus.Y;
    }

    public boolean isUsable() {
        return isActive() && !isExpired();
    }

    public void markUsed() {
        this.passwordTokenStatus = CommonEnums.CommonStatus.N;
    }
}
