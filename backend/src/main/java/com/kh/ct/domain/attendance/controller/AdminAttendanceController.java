package com.kh.ct.domain.attendance.controller;

import com.kh.ct.domain.attendance.dto.AttendanceDto;
import com.kh.ct.domain.attendance.dto.ProtestDto;
import com.kh.ct.domain.attendance.service.AdminAttendanceService;
import com.kh.ct.domain.attendance.service.ProtestApplyService;
import com.kh.ct.global.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * 관리자 근태 관리 Controller
 */
@RestController
@RequestMapping("/api/admin/attendance")
@RequiredArgsConstructor
@Slf4j
public class AdminAttendanceController {

    private final AdminAttendanceService adminAttendanceService;
    private final ProtestApplyService protestApplyService;

    /**
     * 관리자 대시보드 데이터 조회
     * - 오늘 기준: 전체 직원, 출근, 지각, 결근 통계
     * - 어제 기준: 전체 직원 근태 상세 리스트
     */
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AttendanceDto.AdminDashResponse>> getAdminDashboard() {
        log.info("관리자 대시보드 조회 요청");
        
        AttendanceDto.AdminDashResponse response = adminAttendanceService.getAdminDashboard();
        
        return ResponseEntity.ok(ApiResponse.success("관리자 대시보드 조회 성공", response));
    }

    /**
     * 직원별 실시간 현황 조회 (Tab A)
     * - 오늘 날짜 기준 전체 직원의 근태 상태
     */
    @GetMapping("/employees")
    public ResponseEntity<ApiResponse<List<AttendanceDto.EmployeeStatusDto>>> getEmployeeStatus() {
        log.info("직원별 실시간 현황 조회 요청");
        
        List<AttendanceDto.EmployeeStatusDto> response = adminAttendanceService.getEmployeeStatus();
        
        return ResponseEntity.ok(ApiResponse.success("직원별 현황 조회 성공", response));
    }

    /**
     * 근태 특이사항 기록 조회 (Tab B)
     * - 날짜 범위 내 비정상 근태만 필터링 (PRESENT 제외)
     * @param startDate 시작 날짜 (선택사항, 기본값: 30일 전)
     * @param endDate 종료 날짜 (선택사항, 기본값: 오늘)
     */
    @GetMapping("/abnormal")
    public ResponseEntity<ApiResponse<List<AttendanceDto.AttendanceDetailDto>>> getAbnormalAttendance(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        log.info("근태 특이사항 조회 요청 - startDate: {}, endDate: {}", startDate, endDate);
        
        List<AttendanceDto.AttendanceDetailDto> response = adminAttendanceService.getAbnormalAttendance(startDate, endDate);
        
        return ResponseEntity.ok(ApiResponse.success("특이사항 조회 성공", response));
    }

    // ===== 근태 정정 신청 관리 엔드포인트 =====

    /**
     * 관리자용 - 전체 정정 신청 목록 조회 (페이징)
     */
    @GetMapping("/protest/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<ProtestDto.AdminListResponse>>> getAllProtests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        log.info("관리자용 전체 정정 신청 목록 조회 - page: {}, size: {}", page, size);
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ProtestDto.AdminListResponse> response = protestApplyService.getAllProtestsForAdmin(pageable);
        
        return ResponseEntity.ok(ApiResponse.success("전체 정정 신청 목록 조회 성공", response));
    }

    /**
     * 관리자용 - 상태별 정정 신청 목록 조회 (페이징)
     * @param status PENDING, APPROVED, REJECTED
     */
    @GetMapping("/protest/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<ProtestDto.AdminListResponse>>> getProtestsByStatus(
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        log.info("관리자용 상태별 정정 신청 목록 조회 - status: {}, page: {}, size: {}", status, page, size);
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ProtestDto.AdminListResponse> response = protestApplyService.getProtestsByStatusForAdmin(status, pageable);
        
        return ResponseEntity.ok(ApiResponse.success("상태별 정정 신청 목록 조회 성공", response));
    }

    /**
     * 관리자용 - 정정 신청 상세 조회
     */
    @GetMapping("/protest/{protestId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProtestDto.DetailResponse>> getProtestDetail(
            @PathVariable Long protestId) {
        
        log.info("관리자용 정정 신청 상세 조회 - protestId: {}", protestId);
        
        ProtestDto.DetailResponse response = protestApplyService.getProtestDetail(protestId);
        
        return ResponseEntity.ok(ApiResponse.success("정정 신청 상세 조회 성공", response));
    }

    /**
     * 관리자용 - 정정 신청 승인/반려 처리
     * @param protestId 정정 신청 ID
     * @param approverId 승인자 ID (쿼리 파라미터)
     * @param request approved: true(승인), false(반려), cancelReason: 반려 사유
     */
    @PutMapping("/protest/{protestId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> approveOrRejectProtest(
            @PathVariable Long protestId,
            @RequestParam String approverId,
            @RequestBody ProtestDto.ApproveRequest request) {
        
        log.info("관리자용 정정 신청 처리 - protestId: {}, approverId: {}, approved: {}", 
                protestId, approverId, request.getApproved());
        
        if (request.getApproved()) {
            // 승인 처리
            protestApplyService.approveProtestByAdmin(protestId, approverId);
            return ResponseEntity.ok(ApiResponse.success("정정 신청이 승인되었습니다", null));
        } else {
            // 반려 처리
            if (request.getCancelReason() == null || request.getCancelReason().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.fail("반려 사유는 필수입니다"));
            }
            protestApplyService.rejectProtestByAdmin(protestId, approverId, request.getCancelReason());
            return ResponseEntity.ok(ApiResponse.success("정정 신청이 반려되었습니다", null));
        }
    }
}
