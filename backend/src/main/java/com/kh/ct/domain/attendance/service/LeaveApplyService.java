package com.kh.ct.domain.attendance.service;

import com.kh.ct.domain.attendance.dto.LeaveDto;

import java.util.List;

/**
 * 휴가 신청 Service Interface
 */
public interface LeaveApplyService {
    
    /**
     * 휴가 신청
     */
    LeaveDto.ListResponse applyLeave(String empId, LeaveDto.ApplyRequest request);
    
    /**
     * 내 휴가 신청 내역 조회
     */
    List<LeaveDto.ListResponse> getMyLeaveList(String empId);
    
    /**
     * 잔여 휴가 조회
     */
    LeaveDto.RemainingLeaveResponse getRemainingLeave(String empId);
    
    /**
     * 휴가 승인/반려
     */
    LeaveDto.ListResponse approveLeave(Long leaveApplyId, String approverId, LeaveDto.ApproveRequest request);
    
    /**
     * 관리자용 전체 휴가 신청 목록 조회
     */
    List<LeaveDto.ListResponse> getAllLeaveApplications();
    
    /**
     * 관리자용 상태별 휴가 신청 목록 조회
     */
    List<LeaveDto.ListResponse> getLeaveApplicationsByStatus(String status);
    
    /**
     * 휴가 신청 상세 조회
     */
    LeaveDto.ListResponse getLeaveDetail(Long leaveApplyId);
}
