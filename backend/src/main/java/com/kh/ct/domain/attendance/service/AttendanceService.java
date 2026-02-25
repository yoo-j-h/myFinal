package com.kh.ct.domain.attendance.service;

import com.kh.ct.domain.attendance.dto.AttendanceDto;

/**
 * 근태 서비스 인터페이스
 */
public interface AttendanceService {

    /**
     * 월별 근태 통계 조회
     * 
     * @param empId 직원 ID
     * @param year  년도
     * @param month 월
     * @return 월별 통계 응답 DTO
     */
    AttendanceDto.MonthlyStatsRes getMonthlyStats(String empId, int year, int month);

    /**
     * 월별 캘린더 데이터 조회
     * 
     * @param empId 직원 ID
     * @param year  년도
     * @param month 월
     * @return 캘린더 응답 DTO
     */
    AttendanceDto.CalendarRes getCalendarData(String empId, int year, int month);
}
