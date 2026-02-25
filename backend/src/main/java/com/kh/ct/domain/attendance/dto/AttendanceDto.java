package com.kh.ct.domain.attendance.dto;

import com.kh.ct.global.common.CommonEnums;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Map;

/**
 * 근태 관련 DTO 통합 클래스
 * Static Inner Class 패턴으로 파일 파편화 방지
 */
public class AttendanceDto {

    /**
     * 월별 통계 요청 DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MonthlyStatsReq {
        private String empId;
        private int year;
        private int month;
    }

    /**
     * 월별 통계 응답 DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MonthlyStatsRes {
        private String todayStatus;
        private long lateCount;
        private long absentCount;
        private long totalWorkHours;
        private long presentDaysCount;  // 이번 달 출근 일수
        private long flightHours;       // 이번 달 비행시간 (추후 구현)
        private LocalTime todayInTime;
        private LocalTime todayOutTime;
    }

    /**
     * 캘린더 조회 요청 DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CalendarReq {
        private String empId;
        private int year;
        private int month;
    }

    /**
     * 캘린더 응답 DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CalendarRes {
        private Map<Integer, String> attendanceMap;  // 날짜 → 상태
        private Map<Integer, DailyAttendanceDto> dailyDataMap;  // 날짜 → 상세 정보
        private int year;
        private int month;
    }

    /**
     * 일별 근태 정보 DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DailyAttendanceDto {
        private Long attendanceId;
        private LocalDate attendanceDate;
        private LocalTime inTime;
        private LocalTime outTime;
        private CommonEnums.AttendanceStatus attendanceStatus;
        private Long workHours;
    }

    /**
     * 관리자 대시보드 전체 응답 DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AdminDashResponse {
        private SummaryDto summary;           // 오늘 기준 통계
        private java.util.List<AttendanceDetailDto> yesterdayList;  // 어제 기준 상세 리스트
        private java.util.List<PendingLeaveDto> pendingLeaves;
        private java.util.List<DepartmentStatusDto> departmentStatus;
    }

    /**
     * 근태 통계 DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SummaryDto {
        private Long totalEmployees;
        private Long presentCount;
        private Long lateCount;
        private Long absentCount;
    }

    /**
     * 근태 상세 정보 DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AttendanceDetailDto {
        private Long attendanceId;
        private String empId;
        private String empName;
        private String departmentName;
        private String job;
        private LocalDate attendanceDate;
        private LocalTime inTime;
        private LocalTime outTime;
        private String attendanceStatus;
    }

    /**
     * 직원별 실시간 현황 DTO (Tab A용)
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class EmployeeStatusDto {
        private String empId;
        private String empName;
        private String departmentName;
        private String job;
        private String currentStatus;  // 현재 근태 상태
        private String todayInTime;
        private String todayOutTime;
    }

    /**
     * 휴가 승인 대기 목록 DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PendingLeaveDto {
        private Long leaveId;
        private String empId;
        private String empName;
        private String departmentName;
        private String leaveType;
        private String startDate;
        private String endDate;
        private String requestDate;
        private Double leaveDays;
    }

    /**
     * 부서별 근태 현황 DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DepartmentStatusDto {
        private String departmentName;
        private Long totalEmployees;
        private Long presentCount;
        private Long leaveCount;
        private Long lateCount;
        private Long absentCount;
    }
}
