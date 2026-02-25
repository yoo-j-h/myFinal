package com.kh.ct.domain.attendance.dto;

import com.kh.ct.global.common.CommonEnums;

import java.time.LocalDate;
import java.time.LocalTime;

public class AttendanceWorkDto {
    public record TodayRes(
            LocalDate attendanceDate,
            LocalTime inTime,
            LocalTime outTime,
            CommonEnums.AttendanceStatus attendanceStatus
    ) {}
}