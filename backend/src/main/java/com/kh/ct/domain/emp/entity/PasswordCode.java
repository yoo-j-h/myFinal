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
public class PasswordCode extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long PasswordCodeId;

    @Column(length = 150)
    private String email;

    @Column(length = 200)
    private String passwordCode;

    private LocalDateTime codeExpiresDate;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private CommonEnums.CommonStatus passwordCodeStatus;


}