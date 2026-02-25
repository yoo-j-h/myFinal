package com.kh.ct.domain.health.service;

import com.kh.ct.domain.health.dto.HealthDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface HealthService {

    public HealthDto.PhysicalTestResponse preview(MultipartFile file);

    public Long save(MultipartFile pdfFile, String empId, HealthDto.PhysicalTestRequest body);

    public HealthDto.PhysicalTestDetailResponse getEmpPhysicalTestById(String empId);

    public Page<HealthDto.PhysicalTestResponse> getPhysicalTestByEmpId(String empId, Pageable pageable);

    public Page<HealthDto.AdminEmpHealthRow> getAllPhysicalTest(String empName, Pageable pageable);

    /**
     * 건강 프로그램 신청 내역 조회
     * DDD 아키텍처 - Domain Service Layer
     * 
     * @param empNo 사원번호
     * @return 프로그램 신청 내역 리스트
     */
    public List<HealthDto.ProgramHistoryResponse> getProgramHistory(String empNo);

    /**
     * 건강 프로그램 신청
     * 
     * @param request 신청 요청 DTO
     * @param empId   신청자 사원 ID
     */
    void applyProgram(HealthDto.ApplyRequest request, String empId);

    /**
     * 나의 신청 내역 조회
     * 
     * @param empId
     * @return
     */
    List<HealthDto.ProgramHistoryResponse> getMyProgramHistory(String empId);

    /**
     * 프로그램 신청 취소
     * 
     * @param programApplyId
     */
    void cancelProgram(String programApplyId);

    // [Admin] 관리자용 메서드
    List<HealthDto.ApplyDetailResponse> getAdminApplyList(com.kh.ct.global.common.CommonEnums.ApplyStatus status,
            String programName);

    HealthDto.ApplyDetailResponse getApplyDetail(String programApplyId);

    void approveApply(HealthDto.ApproveRequest request);

    void rejectApply(HealthDto.RejectRequest request);

    public HealthDto.EmpHealthResponse healthPoint(String empId);

    public HealthDto.EmpHealthTrendResponse healthPointTrend(String empId, int days);

    public HealthDto.EmpHealthRecordResponse healthRecord(String empId);

    HealthDto.HealthReportDto healthReport(HealthDto.HealthReportPreviewRequest req, int days);

    byte[] healthReportPdf(HealthDto.HealthReportPreviewRequest req, int days);
}
