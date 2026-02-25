package com.kh.ct.Application.member_dashboard.controller;



import com.kh.ct.Application.member_dashboard.dto.Dashboard_TotalResponseDto;
import com.kh.ct.Application.member_dashboard.service.Dashboard_ServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class Dashboard_Controller {

    private final Dashboard_ServiceImpl dashboardService;

    // 대시보드에 필요한 모든 데이터(사원정보 + 출결리스트) 조회
    @GetMapping("/{empId}")
    public ResponseEntity<Dashboard_TotalResponseDto> getDashboardDetail(@PathVariable String empId) {
        return ResponseEntity.ok(dashboardService.getDashboardData(empId));
    }
}