package com.kh.ct.Application.member_dashboard.service;


import com.kh.ct.Application.member_dashboard.dto.Dashboard_TotalResponseDto;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface Dashboard_Service {
    // [메인] 전체 데이터 통합 조회
    Dashboard_TotalResponseDto getDashboardData(String empId);

    // [세부] 리포지토리 메서드들과 대응되는 서비스 기능들
    Dashboard_TotalResponseDto.EmpInfo getEmpInfo(String empId);
    List<Dashboard_TotalResponseDto.AttendanceInfo> getAttendanceList(String empId);
    List<Dashboard_TotalResponseDto.FlyInfo> getFlightList(String empId);
    List<Dashboard_TotalResponseDto.GroundInfo> getGroundScheduleList(String empId);
    List<Dashboard_TotalResponseDto.ProgramInfo> getProgramList(String empId);
    Dashboard_TotalResponseDto.HealthInfo getHealthInfo(String empId);
}