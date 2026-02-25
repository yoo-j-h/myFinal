package com.kh.ct.domain.emp.service;

import com.kh.ct.domain.emp.dto.AirlineApplyDto;

import java.util.List;

public interface AirlineApplyService {

    /**
     * 전체 목록 조회
     */
    List<AirlineApplyDto.ListResponse> getAllApplications();

    /**
     * 검색
     */
    List<AirlineApplyDto.ListResponse> searchApplications(String keyword);

    /**
     * 상세 조회
     */
    AirlineApplyDto.DetailResponse getApplicationDetail(Long id);

    /**
     * 승인 (관리자 계정 생성 포함)
     */
    void approveApplication(Long id, String adminId);

    /**
     * 반려
     */
    void rejectApplication(Long id, String reason);

    /**
     * 가입 신청 생성
     */
    AirlineApplyDto.ApplyResponse createApplication(
            AirlineApplyDto.ApplyRequest request,
            String businessLicensePath,
            String employmentCertPath
    );

    /**
     * 승인 (관리자 계정 생성 및 활성화 링크 반환)
     */
    AirlineApplyDto.ApproveResponse approveApplicationWithLink(Long id, String adminId);
}

