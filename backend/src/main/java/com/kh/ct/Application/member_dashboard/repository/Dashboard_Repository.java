package com.kh.ct.Application.member_dashboard.repository;


import com.kh.ct.domain.attendance.entity.Attendance;

import com.kh.ct.domain.emp.entity.Emp;
import com.kh.ct.domain.health.entity.EmpHealth;
import com.kh.ct.domain.health.entity.ProgramApply;
import com.kh.ct.domain.schedule.entity.FlySchedule;
import com.kh.ct.domain.schedule.entity.GroundSchedule;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface Dashboard_Repository {
    Long find_Working(String empId);

    List<Attendance> findByEmp_Leave_Apply(String empId);
    Optional<Emp> findByEmp_Emp(String empId);
    Long findTotalFlightMinutes(String empId);
    Long findTotalFlightCount(String empId);
    Optional<EmpHealth> find_Health(String empId);
    List<FlySchedule> findFlySchedulesByEmpId(String empId);
    List<GroundSchedule> findGroundSchedulesByEmpId(String empId);
    List<ProgramApply> findProgramAppliesByEmpId(String empId, java.time.LocalDateTime start, java.time.LocalDateTime end);
}