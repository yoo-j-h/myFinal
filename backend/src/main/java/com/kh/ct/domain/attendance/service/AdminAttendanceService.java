package com.kh.ct.domain.attendance.service;

import com.kh.ct.domain.attendance.dto.AttendanceDto;

import java.time.LocalDate;
import java.util.List;

/**
 * 관리자 근태 관리 Service 인터페이스
 */
public interface AdminAttendanceService {
    
    /**
     * 관리자 대시보드 데이터 조회
     * - 오늘 기준 통계 (전체 직원, 출근, 지각, 결근)
     * - 어제 기준 상세 리스트
     */
    AttendanceDto.AdminDashResponse getAdminDashboard();

    /**
     * 직원별 실시간 현황 조회 (Tab A)
     * - 오늘 날짜 기준 전체 직원의 근태 상태
     */
    List<AttendanceDto.EmployeeStatusDto> getEmployeeStatus();

    /**
     * 근태 특이사항 기록 조회 (Tab B)
     * - 날짜 범위 내 비정상 근태만 필터링 (PRESENT 제외)
     */
    List<AttendanceDto.AttendanceDetailDto> getAbnormalAttendance(LocalDate startDate, LocalDate endDate);
}
