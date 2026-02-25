package com.kh.ct.domain.schedule.service;

import com.kh.ct.domain.schedule.dto.FlyScheduleDto;
import org.springframework.security.core.Authentication;

import java.time.LocalDateTime;
import java.util.List;

public interface FlyScheduleService {
    
    /**
     * 비행편 목록 조회
     * - 관리자: 항공사별 전체 비행편 조회
     * - 직원: 본인이 배정된 비행편만 조회
     */
    List<FlyScheduleDto.ListResponse> getFlightSchedules(
        Long airlineId,
        String empId,
        LocalDateTime startDate,
        LocalDateTime endDate,
        String departure,
        String destination
    );
    
    /**
     * 권한 기반 비행편 목록 조회
     * - 관리자(AIRLINE_ADMIN, SUPER_ADMIN): 항공사별 전체 비행편 조회
     * - 직원(PILOT, CABIN_CREW 등): 본인이 배정된 비행편만 조회
     */
    List<FlyScheduleDto.ListResponse> getFlightSchedulesWithAuth(
        Authentication authentication,
        Long airlineId,
        LocalDateTime startDate,
        LocalDateTime endDate,
        String departure,
        String destination
    );
    
    /**
     * 비행편 상세 조회 (크루 정보 포함)
     */
    FlyScheduleDto getFlightScheduleDetail(Long flyScheduleId, String empId);
    
    /**
     * 권한 기반 비행편 상세 조회
     */
    FlyScheduleDto getFlightScheduleDetailWithAuth(Authentication authentication, Long flyScheduleId);
    
    /**
     * 승무원 추가
     */
    void addCrewMember(Long flyScheduleId, String empId);
    
    /**
     * 권한 기반 승무원 추가 (관리자만 가능)
     */
    void addCrewMemberWithAuth(Authentication authentication, Long flyScheduleId, String empId);
    
    /**
     * 승무원 삭제
     */
    void removeCrewMember(Long flyScheduleId, String empId);
    
    /**
     * 권한 기반 승무원 삭제 (관리자만 가능)
     */
    void removeCrewMemberWithAuth(Authentication authentication, Long flyScheduleId, String empId);
    
    /**
     * 월별 항공편 수 조회
     */
    long countFlightsByMonth(Long airlineId, java.time.YearMonth yearMonth);
}
