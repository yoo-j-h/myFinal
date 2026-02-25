package com.kh.ct.domain.emp.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class AirlineDto {

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ListResponse {
        private Long id;
        private String name;
        private String plan;
        private Long employeeCount;
        private Long activeUsers;
        private String status;
        private String icon;
        private String primaryColor;
        private String secondaryColor;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DetailResponse {
        private Long id;
        private String name;
        private String plan;
        private String planPrice;
        private Long employeeCount;
        private Long activeUsers;
        private Integer managedFeatures;
        private String totalRevenue;
        private String status;
        private String icon;
        private String primaryColor;
        private String secondaryColor;
        private String businessNumber;
        private String mainNumber;
        private String country;
        private String address;
        private String email;
        private String phone;
        private LocalDate joinDate;
        private String billingPeriod;
        private LocalDate nextBilling;
        private UsageStats usageStats;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UsageStats {
        private Double storageUsage;
        private LocalDateTime lastLogin;
        private Long activeEmployees;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateStatusRequest {
        @NotBlank(message = "상태는 필수입니다")
        private String status;
    }
}

