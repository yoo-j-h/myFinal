package com.kh.ct.domain.attendance.controller;

import com.kh.ct.domain.attendance.dto.AttendanceDto;
import com.kh.ct.domain.attendance.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 근태 관리 REST API Controller
 */
@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
@Slf4j
public class AttendanceController {

    private final AttendanceService attendanceService;

    /**
     * 월별 근태 통계 조회
     * 
     * @param empId 직원 ID
     * @param year  년도
     * @param month 월
     * @return 월별 통계 응답
     */
    @GetMapping("/monthly-stats")
    public ResponseEntity<AttendanceDto.MonthlyStatsRes> getMonthlyStats(
            @RequestParam String empId,
            @RequestParam int year,
            @RequestParam int month) {
        log.info("GET /api/attendance/monthly-stats - empId: {}, year: {}, month: {}", empId, year, month);

        try {
            AttendanceDto.MonthlyStatsRes response = attendanceService.getMonthlyStats(empId, year, month);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("월별 통계 조회 실패", e);
            throw e;
        }
    }

    /**
     * 월별 캘린더 데이터 조회
     * 
     * @param empId 직원 ID
     * @param year  년도
     * @param month 월
     * @return 캘린더 응답
     */
    @GetMapping("/calendar")
    public ResponseEntity<AttendanceDto.CalendarRes> getCalendarData(
            @RequestParam String empId,
            @RequestParam int year,
            @RequestParam int month) {
        log.info("GET /api/attendance/calendar - empId: {}, year: {}, month: {}", empId, year, month);

        try {
            AttendanceDto.CalendarRes response = attendanceService.getCalendarData(empId, year, month);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("캘린더 데이터 조회 실패", e);
            throw e;
        }
    }
}
