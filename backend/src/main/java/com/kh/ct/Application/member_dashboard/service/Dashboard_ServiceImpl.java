package com.kh.ct.Application.member_dashboard.service;

import com.kh.ct.Application.member_dashboard.dto.Dashboard_TotalResponseDto;
import com.kh.ct.Application.member_dashboard.repository.Dashboard_Repository; // 인터페이스 주입
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

public class Dashboard_ServiceImpl implements Dashboard_Service {

    private final Dashboard_Repository dashboardRepository;

    @Override
    @Transactional(readOnly = true)
    public Dashboard_TotalResponseDto getDashboardData(String empId) {
        // Repository의 통계용 메서드 직접 활용
        Long totalMinutes = dashboardRepository.findTotalFlightMinutes(empId);
        Long flightHours = (totalMinutes != null) ? totalMinutes / 60 : 0L;

        return Dashboard_TotalResponseDto.builder()
                .empInfo(this.getEmpInfo(empId))
                .attendanceList(this.getAttendanceList(empId))
                .flightList(this.getFlightList(empId))
                .groundScheduleList(this.getGroundScheduleList(empId))
                .programList(this.getProgramList(empId))
                .healthInfo(this.getHealthInfo(empId))
                .workingDays(dashboardRepository.find_Working(empId))
                .totalFlightCount(dashboardRepository.findTotalFlightCount(empId))
                .totalFlightHours(flightHours)
                .build();
    }

    @Override
    public Dashboard_TotalResponseDto.EmpInfo getEmpInfo(String empId) {
        return dashboardRepository.findByEmp_Emp(empId)
                .map(Dashboard_TotalResponseDto.EmpInfo::new)
                .orElseThrow(() -> new RuntimeException("사원 정보가 없습니다."));
    }

    @Override
    public List<Dashboard_TotalResponseDto.AttendanceInfo> getAttendanceList(String empId) {
        return dashboardRepository.findByEmp_Leave_Apply(empId).stream()
                .map(Dashboard_TotalResponseDto.AttendanceInfo::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<Dashboard_TotalResponseDto.FlyInfo> getFlightList(String empId) {
        return dashboardRepository.findFlySchedulesByEmpId(empId).stream()
                .map(Dashboard_TotalResponseDto.FlyInfo::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<Dashboard_TotalResponseDto.GroundInfo> getGroundScheduleList(String empId) {
        return dashboardRepository.findGroundSchedulesByEmpId(empId).stream()
                .map(Dashboard_TotalResponseDto.GroundInfo::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<Dashboard_TotalResponseDto.ProgramInfo> getProgramList(String empId) {
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = LocalDate.now().plusDays(1).atTime(23, 59, 59);
        return dashboardRepository.findProgramAppliesByEmpId(empId, start, end).stream()
                .map(Dashboard_TotalResponseDto.ProgramInfo::new)
                .collect(Collectors.toList());
    }

    @Override
    public Dashboard_TotalResponseDto.HealthInfo getHealthInfo(String empId) {
        return dashboardRepository.find_Health(empId)
                .map(h -> Dashboard_TotalResponseDto.HealthInfo.builder()
                        .healthPoint(h.getHealthPoint())
                        .stressPoint(h.getStressPoint())
                        .fatiguePoint(h.getFatiguePoint())
                        .physicalPoint(h.getPhysicalPoint())
                        .build())
                .orElse(new Dashboard_TotalResponseDto.HealthInfo(0, 0, 0, 0));
    }
}