package com.kh.ct.Application.admin_dashboard.service;


import com.kh.ct.Application.admin_dashboard.dto.Admin_Dashboard_TotalResponseDto;

import java.util.List;

public interface Admin_Dashboard_Service {
    // [메인] 전체 데이터 통합 조회
    Admin_Dashboard_TotalResponseDto getDashboardData(String empId);
    Admin_Dashboard_TotalResponseDto.PendingCounts getPendingCounts();
    Admin_Dashboard_TotalResponseDto.PendingCounts getTotalCounts();
    // [세부] 리포지토리 메서드들과 대응되는 서비스 기능들
    Admin_Dashboard_TotalResponseDto.EmpInfo getEmpInfo(String empId);
    List<Admin_Dashboard_TotalResponseDto.AttendanceInfo> getAttendanceList(String empId);
    List<Admin_Dashboard_TotalResponseDto.FlyInfo> getFlightList(String empId);
    List<Admin_Dashboard_TotalResponseDto.GroundInfo> getGroundScheduleList(String empId);
    List<Admin_Dashboard_TotalResponseDto.ProgramInfo> getProgramList(String empId);
    Admin_Dashboard_TotalResponseDto.HealthInfo getHealthInfo(String empId);
}