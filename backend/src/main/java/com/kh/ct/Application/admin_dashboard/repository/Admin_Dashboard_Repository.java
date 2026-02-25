package com.kh.ct.Application.admin_dashboard.repository;


import com.kh.ct.Application.admin_dashboard.dto.Admin_Dashboard_TotalResponseDto;
import com.kh.ct.domain.attendance.entity.Attendance;
import com.kh.ct.domain.attendance.entity.ProtestApply;
import com.kh.ct.domain.emp.entity.Emp;
import com.kh.ct.domain.health.entity.EmpHealth;
import com.kh.ct.domain.health.entity.ProgramApply;
import com.kh.ct.domain.schedule.entity.FlySchedule;
import com.kh.ct.domain.schedule.entity.GroundSchedule;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface Admin_Dashboard_Repository {
    Long find_Working(String empId);
    Long findCurrentWorkingEmployeeCount();

    List<Attendance> findByEmp_Leave_Apply(String empId);
    Long countThisWeekApprovedLeaveEmployees();

    Optional<Emp> findByEmp_Emp(String empId);
    Long countTotalEmployees();

    Long findTotalFlightMinutes(String empId);
    Long findTotalFlightCount(String empId);
    Admin_Dashboard_TotalResponseDto.HealthInfo findAverageHealthMetrics();
    List<FlySchedule> findFlySchedulesByEmpId(String empId);
    List<GroundSchedule> findGroundSchedulesByEmpId(String empId);
    List<ProgramApply> findProgramAppliesByEmpId(String empId, java.time.LocalDateTime start, java.time.LocalDateTime end);

    Long countPendingLeaveApplies();
    Long countPendingProgramApplies();
    Long countPendingProtestApplies();

    Long countTotalLeaveApplies();
    Long countTotalProgramApplies();
    Long countTotalProtestApplies();


}