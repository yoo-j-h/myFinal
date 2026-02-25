package com.kh.ct.Application.admin_dashboard.controller;



import com.kh.ct.Application.admin_dashboard.dto.Admin_Dashboard_TotalResponseDto;
import com.kh.ct.Application.admin_dashboard.service.Admin_Dashboard_ServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/dashboard/admin")
@RequiredArgsConstructor
public class Admin_Dashboard_Controller {

    private final Admin_Dashboard_ServiceImpl adminDashboardService;

    // 대시보드에 필요한 모든 데이터(사원정보 + 출결리스트) 조회
    @GetMapping("/{empId}")
    public ResponseEntity<Admin_Dashboard_TotalResponseDto> getDashboardDetail(@PathVariable String empId) {
        return ResponseEntity.ok(adminDashboardService.getDashboardData(empId));
    }
}