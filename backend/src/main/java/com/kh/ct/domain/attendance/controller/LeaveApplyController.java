package com.kh.ct.domain.attendance.controller;

import com.kh.ct.domain.attendance.dto.LeaveDto;
import com.kh.ct.domain.attendance.service.LeaveApplyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 휴가 신청 REST API Controller
 */
@RestController
@RequestMapping("/api/leave")
@RequiredArgsConstructor
@Slf4j
public class LeaveApplyController {

    private final LeaveApplyService leaveApplyService;

    /**
     * 휴가 신청
     */
    @PostMapping("/apply")
    public ResponseEntity<LeaveDto.ListResponse> applyLeave(
            @RequestParam String empId,
            @RequestBody @Valid LeaveDto.ApplyRequest request) {

        log.info("휴가 신청 요청 - empId: {}, leaveType: {}", empId, request.getLeaveType());

        LeaveDto.ListResponse response = leaveApplyService.applyLeave(empId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * 내 휴가 신청 내역 조회
     */
    @GetMapping("/my-list")
    public ResponseEntity<List<LeaveDto.ListResponse>> getMyLeaveList(
            @RequestParam String empId) {

        log.info("휴가 내역 조회 - empId: {}", empId);

        List<LeaveDto.ListResponse> response = leaveApplyService.getMyLeaveList(empId);
        return ResponseEntity.ok(response);
    }

    /**
     * 잔여 휴가 조회
     */
    @GetMapping("/remaining")
    public ResponseEntity<LeaveDto.RemainingLeaveResponse> getRemainingLeave(
            @RequestParam String empId) {

        log.info("잔여 휴가 조회 - empId: {}", empId);

        LeaveDto.RemainingLeaveResponse response = leaveApplyService.getRemainingLeave(empId);
        return ResponseEntity.ok(response);
    }

    /**
     * 휴가 승인/반려 (관리자용)
     */
    @PutMapping("/{leaveApplyId}/approve")
    public ResponseEntity<LeaveDto.ListResponse> approveLeave(
            @PathVariable Long leaveApplyId,
            @RequestParam String approverId,
            @RequestBody @Valid LeaveDto.ApproveRequest request) {

        log.info("휴가 승인/반려 요청 - leaveApplyId: {}, approverId: {}, approved: {}",
                leaveApplyId, approverId, request.getApproved());

        LeaveDto.ListResponse response = leaveApplyService.approveLeave(leaveApplyId, approverId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * 관리자용 전체 휴가 신청 목록 조회
     */
    @GetMapping("/admin/all")
    public ResponseEntity<List<LeaveDto.ListResponse>> getAllLeaveApplications() {
        log.info("관리자용 전체 휴가 신청 목록 조회 요청");

        List<LeaveDto.ListResponse> response = leaveApplyService.getAllLeaveApplications();
        return ResponseEntity.ok(response);
    }

    /**
     * 관리자용 상태별 휴가 신청 목록 조회
     */
    @GetMapping("/admin/status/{status}")
    public ResponseEntity<List<LeaveDto.ListResponse>> getLeaveApplicationsByStatus(
            @PathVariable String status) {

        log.info("관리자용 상태별 휴가 신청 목록 조회 요청 - status: {}", status);

        List<LeaveDto.ListResponse> response = leaveApplyService.getLeaveApplicationsByStatus(status);
        return ResponseEntity.ok(response);
    }
    
    /**
     * 휴가 신청 상세 조회
     */
    @GetMapping("/{leaveApplyId}")
    public ResponseEntity<LeaveDto.ListResponse> getLeaveDetail(
            @PathVariable Long leaveApplyId) {
        
        log.info("휴가 신청 상세 조회 요청 - leaveApplyId: {}", leaveApplyId);
        
        LeaveDto.ListResponse response = leaveApplyService.getLeaveDetail(leaveApplyId);
        return ResponseEntity.ok(response);
    }
}
