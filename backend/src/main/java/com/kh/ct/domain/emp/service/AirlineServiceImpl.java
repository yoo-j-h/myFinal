package com.kh.ct.domain.emp.service;

import com.kh.ct.domain.emp.dto.AirlineDto;
import com.kh.ct.domain.emp.entity.Airline;
import com.kh.ct.domain.emp.entity.Emp;
import com.kh.ct.domain.emp.repository.AirlineRepository;
import com.kh.ct.domain.emp.repository.EmpRepository;
import com.kh.ct.global.common.CommonEnums;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AirlineServiceImpl implements AirlineService {

    private final AirlineRepository airlineRepository;
    private final EmpRepository empRepository;

    @Override
    public List<AirlineDto.ListResponse> getAllTenants() {
        List<Airline> airlines = airlineRepository.findAllOrderByCreateDateDesc();
        return airlines.stream()
                .map(this::convertToListResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AirlineDto.ListResponse> searchTenants(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllTenants();
        }
        List<Airline> airlines = airlineRepository.searchByKeyword(keyword);
        return airlines.stream()
                .map(this::convertToListResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AirlineDto.DetailResponse getTenantDetail(Long id) {
        Airline airline = airlineRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 항공사를 찾을 수 없습니다. ID: " + id));
        return convertToDetailResponse(airline);
    }

    @Override
    @Transactional
    public void updateTenantStatus(Long id, String status) {
        Airline airline = airlineRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 항공사를 찾을 수 없습니다. ID: " + id));
        
        CommonEnums.AirlineStatus newStatus = CommonEnums.AirlineStatus.valueOf(status.toUpperCase());
        airline.updateStatus(newStatus);
        
        // 항공사 관리자 계정 상태 업데이트
        List<Emp> adminEmployees =
                empRepository.findByAirlineId_AirlineIdAndJob(id, "항공사 관리자");
        
        if (newStatus == CommonEnums.AirlineStatus.INACTIVE) {
            // 계정 정지: 관리자 emp_status를 'S'로 변경
            for (Emp emp : adminEmployees) {
                emp.updateEmpStatus(CommonEnums.EmpStatus.S);
            }
        } else if (newStatus == CommonEnums.AirlineStatus.ACTIVE) {
            // 계정 활성화: 관리자 emp_status를 'Y'로 변경
            for (Emp emp : adminEmployees) {
                emp.updateEmpStatus(CommonEnums.EmpStatus.Y);
            }
        }
    }

    // Entity -> DTO 변환 메서드
    private AirlineDto.ListResponse convertToListResponse(Airline entity) {
        Long employeeCount = airlineRepository.countEmployeesByAirlineId(entity.getAirlineId());
        Long activeUsers = airlineRepository.countActiveEmployeesByAirlineId(entity.getAirlineId());

        return AirlineDto.ListResponse.builder()
                .id(entity.getAirlineId())
                .name(entity.getAirlineName())
                .plan(entity.getPlan() != null ? entity.getPlan() : "Basic")
                .employeeCount(employeeCount != null ? employeeCount : 0L)
                .activeUsers(activeUsers != null ? activeUsers : 0L)
                .status(entity.getStatus() != null ? entity.getStatus().name().toLowerCase() : "active")
                .icon(entity.getIcon() != null ? entity.getIcon() : "✈️")
                .primaryColor(entity.getPrimaryColor())
                .secondaryColor(entity.getSecondaryColor())
                .build();
    }

    private AirlineDto.DetailResponse convertToDetailResponse(Airline entity) {
        Long employeeCount = airlineRepository.countEmployeesByAirlineId(entity.getAirlineId());
        Long activeUsers = airlineRepository.countActiveEmployeesByAirlineId(entity.getAirlineId());

        // 사용 현황 통계
        AirlineDto.UsageStats usageStats = AirlineDto.UsageStats.builder()
                .storageUsage(entity.getStorageUsage() != null ? entity.getStorageUsage() : 0.0)
                .lastLogin(entity.getLastLoginDate())
                .activeEmployees(activeUsers != null ? activeUsers : 0L)
                .build();

        // 플랜 가격 계산 (간단한 예시)
        String planPrice = calculatePlanPrice(entity.getPlan());

        return AirlineDto.DetailResponse.builder()
                .id(entity.getAirlineId())
                .name(entity.getAirlineName())
                .plan(entity.getPlan() != null ? entity.getPlan() : "Basic")
                .planPrice(planPrice)
                .employeeCount(employeeCount != null ? employeeCount : 0L)
                .activeUsers(activeUsers != null ? activeUsers : 0L)
                .managedFeatures(8) // 고정값 (추후 동적 계산 가능)
                .totalRevenue(calculateTotalRevenue(planPrice, entity.getJoinDate()))
                .status(entity.getStatus() != null ? entity.getStatus().name().toLowerCase() : "active")
                .icon(entity.getIcon() != null ? entity.getIcon() : "✈️")
                .primaryColor(entity.getPrimaryColor())
                .secondaryColor(entity.getSecondaryColor())
                .country(entity.getCountry() != null ? entity.getCountry() : "대한민국")
                .address(entity.getAirlineAddress())
                .email(entity.getEmail())
                .phone(entity.getPhone() != null ? entity.getPhone() : entity.getMainNumber())
                .joinDate(entity.getJoinDate())
                .billingPeriod("연간")
                .nextBilling(entity.getJoinDate() != null ? entity.getJoinDate().plusYears(1) : null)
                .usageStats(usageStats)
                .build();
    }

    private String calculatePlanPrice(String plan) {
        if (plan == null) return "$99/월";
        switch (plan.toLowerCase()) {
            case "enterprise":
                return "$999/월";
            case "professional":
                return "$499/월";
            case "basic":
            default:
                return "$99/월";
        }
    }

    private String calculateTotalRevenue(String planPrice, LocalDate joinDate) {
        // 간단한 예시: 월 가격 * 12개월
        if (planPrice == null) return "$0";
        
        String priceStr = planPrice.replace("$", "").replace("/월", "");
        try {
            int monthlyPrice = Integer.parseInt(priceStr);
            int totalRevenue = monthlyPrice * 12;
            return "$" + String.format("%,d", totalRevenue);
        } catch (NumberFormatException e) {
            return "$0";
        }
    }
}

