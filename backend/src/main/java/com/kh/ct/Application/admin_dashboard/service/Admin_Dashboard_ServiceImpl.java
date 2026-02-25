package com.kh.ct.Application.admin_dashboard.service;

import com.kh.ct.Application.admin_dashboard.dto.Admin_Dashboard_TotalResponseDto;
import com.kh.ct.Application.admin_dashboard.repository.Admin_Dashboard_Repository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

public class Admin_Dashboard_ServiceImpl implements Admin_Dashboard_Service {

    private final Admin_Dashboard_Repository admindashboardRepository;

    @Override
    @Transactional(readOnly = true)
    public Admin_Dashboard_TotalResponseDto getDashboardData(String empId) {
        // Repository의 통계용 메서드 직접 활용
        Long totalMinutes = admindashboardRepository.findTotalFlightMinutes(empId);
        Long flightHours = (totalMinutes != null) ? totalMinutes / 60 : 0L;
        Long currentWorkingCount = admindashboardRepository.findCurrentWorkingEmployeeCount();
        Long totalEmpCount = admindashboardRepository.countTotalEmployees();
        Long weekLeaveCount = admindashboardRepository.countThisWeekApprovedLeaveEmployees();

        return Admin_Dashboard_TotalResponseDto.builder()
                .empInfo(this.getEmpInfo(empId))
                .attendanceList(this.getAttendanceList(empId))
                .flightList(this.getFlightList(empId))
                .groundScheduleList(this.getGroundScheduleList(empId))
                .programList(this.getProgramList(empId))
                .healthInfo(admindashboardRepository.findAverageHealthMetrics())
                .workingDays(admindashboardRepository.find_Working(empId))
                .totalFlightCount(admindashboardRepository.findTotalFlightCount(empId))
                .totalFlightHours(flightHours)

                .totalEmpCount(totalEmpCount != null ? totalEmpCount : 0L)
                .currentWorkingCount(currentWorkingCount != null ? currentWorkingCount : 0L)
                .totalWeekLeaveCount(weekLeaveCount != null ? weekLeaveCount : 0L)

                .pendingCounts(this.getPendingCounts())
                .TotalPendingCounts(this.getTotalCounts())
                .build();
    }

    @Override
    public Admin_Dashboard_TotalResponseDto.EmpInfo getEmpInfo(String empId) {
        return admindashboardRepository.findByEmp_Emp(empId)
                .map(Admin_Dashboard_TotalResponseDto.EmpInfo::new)
                .orElseThrow(() -> new RuntimeException("사원 정보가 없습니다."));
    }
    @Override // 승인관리 개수
    public Admin_Dashboard_TotalResponseDto.PendingCounts getPendingCounts() {
        return Admin_Dashboard_TotalResponseDto.PendingCounts.builder()
                .leaveCount(admindashboardRepository.countPendingLeaveApplies())
                .programCount(admindashboardRepository.countPendingProgramApplies())
                .protestCount(admindashboardRepository.countPendingProtestApplies())
                .build();
    }

    @Override // ✅ 전체 건수 조회용 메서드 추가
    public Admin_Dashboard_TotalResponseDto.PendingCounts getTotalCounts() {
        return Admin_Dashboard_TotalResponseDto.PendingCounts.builder()
                .leaveCount(admindashboardRepository.countTotalLeaveApplies())
                .programCount(admindashboardRepository.countTotalProgramApplies())
                .protestCount(admindashboardRepository.countTotalProtestApplies())
                .build();
    }

    @Override
    public List<Admin_Dashboard_TotalResponseDto.AttendanceInfo> getAttendanceList(String empId) {
        return admindashboardRepository.findByEmp_Leave_Apply(empId).stream()
                .map(Admin_Dashboard_TotalResponseDto.AttendanceInfo::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<Admin_Dashboard_TotalResponseDto.FlyInfo> getFlightList(String empId) {
        return admindashboardRepository.findFlySchedulesByEmpId(empId).stream()
                .map(Admin_Dashboard_TotalResponseDto.FlyInfo::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<Admin_Dashboard_TotalResponseDto.GroundInfo> getGroundScheduleList(String empId) {
        return admindashboardRepository.findGroundSchedulesByEmpId(empId).stream()
                .map(Admin_Dashboard_TotalResponseDto.GroundInfo::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<Admin_Dashboard_TotalResponseDto.ProgramInfo> getProgramList(String empId) {
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = LocalDate.now().plusDays(1).atTime(23, 59, 59);
        return admindashboardRepository.findProgramAppliesByEmpId(empId, start, end).stream()
                .map(Admin_Dashboard_TotalResponseDto.ProgramInfo::new)
                .collect(Collectors.toList());
    }

    @Override
    public Admin_Dashboard_TotalResponseDto.HealthInfo getHealthInfo(String empId) {
        // 특정 empId의 점수가 아닌, 전 직원의 평균 점수 데이터를 가져옴
        return admindashboardRepository.findAverageHealthMetrics();
    }
}