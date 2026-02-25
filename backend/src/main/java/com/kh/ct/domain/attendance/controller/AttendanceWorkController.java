package com.kh.ct.domain.attendance.controller;

import com.kh.ct.domain.attendance.dto.AttendanceWorkDto;
import com.kh.ct.domain.attendance.service.AttendanceWorkService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceWorkController {

    private final AttendanceWorkService attendanceWorkService;

    @GetMapping("/today")
    public AttendanceWorkDto.TodayRes today(Principal principal) {
        return attendanceWorkService.getToday(principal.getName());
    }

    @PostMapping("/check-in")
    public AttendanceWorkDto.TodayRes checkIn(Principal principal) {
        return attendanceWorkService.checkIn(principal.getName());
    }

    @PostMapping("/check-out")
    public AttendanceWorkDto.TodayRes checkOut(Principal principal) {
        return attendanceWorkService.checkOut(principal.getName());
    }
}