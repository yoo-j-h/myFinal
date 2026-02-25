package com.kh.ct.domain.attendance.service;

import com.kh.ct.domain.attendance.dto.AttendanceDto;
import com.kh.ct.domain.attendance.entity.Attendance;
import com.kh.ct.domain.attendance.entity.LeaveApply;
import com.kh.ct.domain.attendance.repository.AttendanceRepository;
import com.kh.ct.domain.attendance.repository.LeaveApplyRepository;
import com.kh.ct.global.common.CommonEnums;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 관리자 근태 관리 Service 구현체
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class AdminAttendanceServiceImpl implements AdminAttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final LeaveApplyRepository leaveApplyRepository; // Added new dependency

    @Override
    public AttendanceDto.AdminDashResponse getAdminDashboard() {
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        log.info("관리자 대시보드 조회 - today: {}, yesterday: {}", today, yesterday);

        // 1. 오늘 기준 통계
        Long total = attendanceRepository.countDistinctEmployeesByDate(today);
        Long present = attendanceRepository.countByDateAndStatus(today, CommonEnums.AttendanceStatus.PRESENT);
        Long late = attendanceRepository.countByDateAndStatus(today, CommonEnums.AttendanceStatus.LATE);
        Long absent = attendanceRepository.countByDateAndStatus(today, CommonEnums.AttendanceStatus.ABSENT);

        AttendanceDto.SummaryDto summary = AttendanceDto.SummaryDto.builder()
                .totalEmployees(total != null ? total : 0L)
                .presentCount(present != null ? present : 0L)
                .lateCount(late != null ? late : 0L)
                .absentCount(absent != null ? absent : 0L)
                .build();

        // 2. 어제 근태 상세 리스트
        List<Attendance> yesterdayAttendances = attendanceRepository.findAllByDateWithEmpAndDept(yesterday);
        List<AttendanceDto.AttendanceDetailDto> yesterdayList = yesterdayAttendances.stream()
                .map(this::convertToDetailDto)
                .toList();

        // 3. 휴가 승인 대기 목록
        List<LeaveApply> pendingLeaves = leaveApplyRepository.findPendingLeavesWithDetails();
        List<AttendanceDto.PendingLeaveDto> pendingLeaveList = pendingLeaves.stream()
                .map(this::convertToPendingLeaveDto)
                .toList();

        // 4. 부서별 근태 현황
        List<Object[]> departmentStatusRaw = attendanceRepository.findDepartmentStatusByDate(today);
        List<AttendanceDto.DepartmentStatusDto> departmentStatusList = departmentStatusRaw.stream()
                .map(this::convertToDepartmentStatusDto)
                .toList();

        return AttendanceDto.AdminDashResponse.builder()
                .summary(summary)
                .yesterdayList(yesterdayList)
                .pendingLeaves(pendingLeaveList)
                .departmentStatus(departmentStatusList)
                .build();
    }

    /**
     * 오늘 기준 통계 계산
     */
    private AttendanceDto.SummaryDto calculateSummary(LocalDate date) {
        Long total = attendanceRepository.countDistinctEmployeesByDate(date);
        Long present = attendanceRepository.countByDateAndStatus(date, CommonEnums.AttendanceStatus.PRESENT);
        Long late = attendanceRepository.countByDateAndStatus(date, CommonEnums.AttendanceStatus.LATE);
        Long absent = attendanceRepository.countByDateAndStatus(date, CommonEnums.AttendanceStatus.ABSENT);

        log.debug("통계 - total: {}, present: {}, late: {}, absent: {}", total, present, late, absent);

        return AttendanceDto.SummaryDto.builder()
                .totalEmployees(total != null ? total : 0L)
                .presentCount(present != null ? present : 0L)
                .lateCount(late != null ? late : 0L)
                .absentCount(absent != null ? absent : 0L)
                .build();
    }

    /**
     * 어제 기준 상세 리스트 조회
     */
    private List<AttendanceDto.AttendanceDetailDto> getYesterdayDetails(LocalDate date) {
        List<Attendance> attendances = attendanceRepository.findAllByDateWithEmpAndDept(date);

        log.debug("어제 근태 기록 수: {}", attendances.size());

        return attendances.stream()
                .map(this::convertToDetailDto)
                .collect(Collectors.toList());
    }

    /**
     * Attendance Entity -> AttendanceDetailDto 변환
     */
    private AttendanceDto.AttendanceDetailDto convertToDetailDto(Attendance attendance) {
        return AttendanceDto.AttendanceDetailDto.builder()
                .attendanceId(attendance.getAttendanceId())
                .empId(attendance.getEmpId().getEmpId())
                .empName(attendance.getEmpId().getEmpName())
                .departmentName(attendance.getEmpId().getDepartmentId() != null 
                        ? attendance.getEmpId().getDepartmentId().getDepartmentName() 
                        : "미배정")
                .job(attendance.getEmpId().getJob())
                .attendanceDate(attendance.getAttendanceDate())
                .inTime(attendance.getInTime())
                .outTime(attendance.getOutTime())
                .attendanceStatus(attendance.getAttendanceStatus().name())
                .build();
    }

    /**
     * 직원별 실시간 현황 조회 (Tab A)
     */
    @Override
    public List<AttendanceDto.EmployeeStatusDto> getEmployeeStatus() {
        LocalDate today = LocalDate.now();
        
        log.info("직원별 실시간 현황 조회 - today: {}", today);
        
        List<Attendance> todayAttendances = attendanceRepository.findTodayAttendanceWithEmpAndDept(today);
        
        log.debug("오늘 근태 기록 수: {}", todayAttendances.size());
        
        return todayAttendances.stream()
                .map(this::convertToEmployeeStatusDto)
                .collect(Collectors.toList());
    }

    /**
     * 근태 특이사항 기록 조회 (Tab B)
     */
    @Override
    public List<AttendanceDto.AttendanceDetailDto> getAbnormalAttendance(LocalDate startDate, LocalDate endDate) {
        // 날짜가 null이면 기본값 설정 (최근 30일)
        if (startDate == null || endDate == null) {
            endDate = LocalDate.now();
            startDate = endDate.minusDays(30);
        }
        
        log.info("근태 특이사항 조회 - startDate: {}, endDate: {}", startDate, endDate);
        
        List<Attendance> abnormalAttendances = attendanceRepository.findAbnormalAttendanceByDateRange(startDate, endDate);
        
        log.debug("특이사항 기록 수: {}", abnormalAttendances.size());
        
        return abnormalAttendances.stream()
                .map(this::convertToDetailDto)
                .collect(Collectors.toList());
    }

    /**
     * Attendance Entity -> EmployeeStatusDto 변환
     */
    private AttendanceDto.EmployeeStatusDto convertToEmployeeStatusDto(Attendance attendance) {
        return AttendanceDto.EmployeeStatusDto.builder()
                .empId(attendance.getEmpId().getEmpId())
                .empName(attendance.getEmpId().getEmpName())
                .departmentName(attendance.getEmpId().getDepartmentId() != null 
                        ? attendance.getEmpId().getDepartmentId().getDepartmentName() 
                        : "미배정")
                .job(attendance.getEmpId().getJob())
                .currentStatus(attendance.getAttendanceStatus().name())
                .todayInTime(attendance.getInTime() != null ? attendance.getInTime().toString() : null)
                .todayOutTime(attendance.getOutTime() != null ? attendance.getOutTime().toString() : null)
                .build();
    }

    /**
     * LeaveApply Entity -> PendingLeaveDto 변환
     */
    private AttendanceDto.PendingLeaveDto convertToPendingLeaveDto(LeaveApply leaveApply) {
        return AttendanceDto.PendingLeaveDto.builder()
                .leaveId(leaveApply.getLeaveApplyId())
                .empId(leaveApply.getLeaveApplyApplicant().getEmpId())
                .empName(leaveApply.getLeaveApplyApplicant().getEmpName())
                .departmentName(leaveApply.getLeaveApplyApplicant().getDepartmentId() != null 
                        ? leaveApply.getLeaveApplyApplicant().getDepartmentId().getDepartmentName() 
                        : "미배정")
                .leaveType(leaveApply.getLeaveType().name())
                .startDate(leaveApply.getLeaveStartDate().toLocalDate().toString())
                .endDate(leaveApply.getLeaveEndDate() != null 
                        ? leaveApply.getLeaveEndDate().toLocalDate().toString() 
                        : null)
                .requestDate(leaveApply.getCreateDate().toLocalDate().toString())
                .leaveDays(leaveApply.getLeaveDays())
                .build();
    }

    /**
     * Object[] -> DepartmentStatusDto 변환
     */
    private AttendanceDto.DepartmentStatusDto convertToDepartmentStatusDto(Object[] row) {
        return AttendanceDto.DepartmentStatusDto.builder()
                .departmentName((String) row[0])
                .totalEmployees(((Number) row[1]).longValue())
                .presentCount(((Number) row[2]).longValue())
                .leaveCount(((Number) row[3]).longValue())
                .lateCount(((Number) row[4]).longValue())
                .absentCount(((Number) row[5]).longValue())
                .build();
    }
}
