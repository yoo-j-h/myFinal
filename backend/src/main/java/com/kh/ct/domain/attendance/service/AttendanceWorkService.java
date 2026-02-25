package com.kh.ct.domain.attendance.service;

import com.kh.ct.domain.attendance.dto.AttendanceWorkDto;

public interface AttendanceWorkService {
    AttendanceWorkDto.TodayRes getToday(String empId);
    AttendanceWorkDto.TodayRes checkIn(String empId);
    AttendanceWorkDto.TodayRes checkOut(String empId);
}