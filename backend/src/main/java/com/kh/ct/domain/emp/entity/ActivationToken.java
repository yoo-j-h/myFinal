package com.kh.ct.domain.emp.entity;

import com.kh.ct.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class ActivationToken extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long activationTokenId;

    @JoinColumn(nullable = false, name = "emp_id")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Emp empId;

    @Column(nullable = false, unique = true, length = 255)
    private String token;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    private Boolean used = false;

    // 비즈니스 로직 메서드
    public void markAsUsed() {
        this.used = true;
    }

    public boolean isValid() {
        return !used && expiresAt.isAfter(LocalDateTime.now());
    }

    public static String generateToken() {
        return UUID.randomUUID().toString().replace("-", "");
    }
}

