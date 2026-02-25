package com.kh.ct.domain.emp.entity;

import com.kh.ct.global.common.CommonEnums;
import com.kh.ct.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Airline extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long airlineId;

    @Column(length = 100)
    private String airlineName;

    @Column(length = 100)
    private String theme;

    @Column(length = 7)
    private String primaryColor;

    @Column(length = 7)
    private String secondaryColor;

    @Column(length = 50)
    private String mainNumber;

    @Column(length = 255)
    private String airlineAddress;

    @Column(length = 500)
    private String airlineDesc;
    
    @Column(length = 50)
    private String businessNumber;

    // 테넌트 관리 필드
    @Column(length = 50)
    private String plan; // Enterprise, Professional, Basic

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private CommonEnums.AirlineStatus status; // ACTIVE, PAYMENT_PENDING, INACTIVE

    @Column(length = 10)
    private String icon;

    @Column(length = 50)
    private String country;

    @Column(length = 100)
    private String email;

    @Column(length = 50)
    private String phone;

    @Column
    private LocalDate joinDate;

    @Column
    private Double storageUsage;

    @Column
    private LocalDateTime lastLoginDate;

    @JoinColumn(name = "airline_apply_id")
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    private AirlineApply airlineApplyId;

    @OneToMany(mappedBy = "airlineId", fetch = FetchType.LAZY,
            cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AirlineAirport> airlineAirports = new ArrayList<>();

    // 비즈니스 로직 메서드
    public void updateStatus(CommonEnums.AirlineStatus newStatus) {
        this.status = newStatus;
    }

    public void updateLastLogin(LocalDateTime loginTime) {
        this.lastLoginDate = loginTime;
    }

    public void updateStorageUsage(Double usage) {
        this.storageUsage = usage;
    }
}