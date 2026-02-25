package com.kh.ct.domain.emp.entity;

import com.kh.ct.global.entity.BaseTimeEntity;
import com.kh.ct.global.common.CommonEnums;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class AirlineApply extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long airlineApplyId;

    @Column(length = 100, nullable = false)
    private String airlineName;

    @Column(length = 150, nullable = false)
    private String airlineApplyEmail;

    @Column(length = 100)
    private String managerName;

    @Column(length = 50)
    private String managerPhone;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private CommonEnums.ApplyStatus airlineApplyStatus;

    @Lob
    private String airlineApplyCancelReason;

    @Column(nullable = false)
    private Boolean emailDomainVerified = false;

    @Column(length = 500)
    private String businessLicensePath;

    @Column(length = 500)
    private String employmentCertPath;

    @Column(length = 255)
    private String airlineAddress;

    @Column(length = 500)
    private String activationLink;

    // 비즈니스 로직 메서드
    public void approve() {
        this.airlineApplyStatus = CommonEnums.ApplyStatus.APPROVED;
    }

    public void reject(String reason) {
        this.airlineApplyStatus = CommonEnums.ApplyStatus.REJECTED;
        this.airlineApplyCancelReason = reason;
    }

    public void setEmailDomainVerified(Boolean verified) {
        this.emailDomainVerified = verified;
    }

    public void setActivationLink(String activationLink) {
        this.activationLink = activationLink;
    }
}