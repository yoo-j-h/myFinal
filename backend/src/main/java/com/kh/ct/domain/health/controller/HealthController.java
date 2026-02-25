package com.kh.ct.domain.health.controller;

import com.kh.ct.domain.health.dto.HealthDto;
import com.kh.ct.domain.health.entity.EmpHealth;
import com.kh.ct.domain.health.service.HealthService;
import com.kh.ct.global.common.CommonEnums;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
@Validated
public class HealthController {

    private final HealthService healthService;

    /**
     * 건강 정보 텍스트 추출
     * 
     * @param file
     * @return
     */
    @PostMapping(value = "/preview", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<HealthDto.PhysicalTestResponse> preview(
            @RequestParam(value = "file", required = true) MultipartFile file) {
        // 서비스 호출

        HealthDto.PhysicalTestResponse empPhysicalTestId = healthService.preview(file);

        return ResponseEntity.ok(empPhysicalTestId);
    }

    /**
     * 건강 정보 제출
     * 
     * @param empId
     * @param file
     * @param data
     * @return
     */
    @PostMapping(value = "/save", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Long> save(@RequestParam("empId") String empId,
            @RequestPart("file") MultipartFile file,
            @RequestPart("data") HealthDto.PhysicalTestRequest data) {
        Long empPhysicalTestId = healthService.save(file, empId, data);

        return ResponseEntity.ok(empPhysicalTestId);
    }

    /**
     * 건강 정보 상세 보기
     * 
     * @param empId
     * @return
     */
    @GetMapping("/detail")
    public ResponseEntity<HealthDto.PhysicalTestDetailResponse> getEmpPhysicalById(
            @RequestParam("empId") String empId) {
        HealthDto.PhysicalTestDetailResponse result = healthService.getEmpPhysicalTestById(empId);
        return ResponseEntity.ok(result);
    }

    /**
     * 개인 건강 정보 제출 이력
     * 
     * @param empId
     * @param pageable
     * @return
     */
    @GetMapping("/getPhysicalTest")
    public ResponseEntity<Page<HealthDto.PhysicalTestResponse>> getPhysicalTestByEmpId(
            @RequestParam("empId") String empId,
            @PageableDefault(size = 4, sort = "testDate", direction = Sort.Direction.DESC) Pageable pageable) {

        return ResponseEntity.ok(healthService.getPhysicalTestByEmpId(empId, pageable));
    }

    /**
     * 관리자 직원 건강 상세 조회
     * 
     * @param pageable
     * @return
     */
    @GetMapping("/getAllPhysicalTest")
    public ResponseEntity<Page<HealthDto.AdminEmpHealthRow>> getAllPhysicalTest(
            @RequestParam(required = false) String empName,
            @PageableDefault(size = 5) Pageable pageable) {
        System.out.println(empName);
        return ResponseEntity.ok(healthService.getAllPhysicalTest(empName, pageable));
    }

    /**
     * 건강 프로그램 신청 내역 조회
     * DDD 아키텍처 - Presentation Layer (REST API)
     * 
     * @param empNo 사원번호
     * @return 프로그램 신청 내역 리스트
     */
    @GetMapping("/program/history")
    public ResponseEntity<List<HealthDto.ProgramHistoryResponse>> getProgramHistory(
            @RequestParam("empNo") String empNo) {
        List<HealthDto.ProgramHistoryResponse> history = healthService.getProgramHistory(empNo);
        return ResponseEntity.ok(history);
    }

    /**
     * 건강 프로그램 신청
     * 
     * @param empId
     * @param request
     * @return
     */
    @PostMapping("/program/apply")
    public ResponseEntity<String> applyProgram(
            @RequestParam("empId") String empId,
            @RequestBody HealthDto.ApplyRequest request) { // @RequestBody for JSON
        healthService.applyProgram(request, empId);
        return ResponseEntity.ok("신청이 완료되었습니다.");
    }

    /**
     * 나의 건강 프로그램 신청 내역 조회
     * 
     * @param empId
     * @return
     */
    @GetMapping("/program/my-history")
    public ResponseEntity<List<HealthDto.ProgramHistoryResponse>> getMyProgramHistory(
            @RequestParam("empId") String empId) {
        List<HealthDto.ProgramHistoryResponse> history = healthService.getMyProgramHistory(empId);
        return ResponseEntity.ok(history);
    }

    /**
     * 건강 프로그램 신청 취소
     * 
     * @param programApplyId
     * @return
     */
    @DeleteMapping("/program/cancel")
    public ResponseEntity<String> cancelProgram(
            @RequestParam("programApplyId") String programApplyId) {
        healthService.cancelProgram(programApplyId);
        return ResponseEntity.ok("신청이 취소되었습니다.");
    }

    // ================== Admin API ==================

    @GetMapping("/admin/apply/list")
    public ResponseEntity<List<HealthDto.ApplyDetailResponse>> getAdminApplyList(
            @RequestParam(required = false) CommonEnums.ApplyStatus status,
            @RequestParam(required = false) String programName) {
        return ResponseEntity.ok(healthService.getAdminApplyList(status, programName));
    }

    @GetMapping("/admin/apply/{applyId}")
    public ResponseEntity<HealthDto.ApplyDetailResponse> getApplyDetail(@PathVariable("applyId") String applyId) {
        HealthDto.ApplyDetailResponse response = healthService.getApplyDetail(applyId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/admin/apply/approve")
    public ResponseEntity<String> approveApply(@RequestBody HealthDto.ApproveRequest request) {
        healthService.approveApply(request);
        return ResponseEntity.ok("승인 처리가 완료되었습니다.");
    }

    @PatchMapping("/admin/apply/reject")
    public ResponseEntity<String> rejectApply(@RequestBody HealthDto.RejectRequest request) {
        healthService.rejectApply(request);
        return ResponseEntity.ok("반려 처리가 완료되었습니다.");
    }

    /**
     * 건강 현황
     * @param empId
     * @return
     */
    @GetMapping("/healthPoint")
    public ResponseEntity<HealthDto.EmpHealthResponse> healthPoint(@RequestParam("empId") String empId) {

        return ResponseEntity.ok(healthService.healthPoint(empId));
    }


    /**
     * 최근 건강 추이
     * @param empId
     * @param days
     * @return
     */
    @GetMapping("/healthPointTrend")
    public ResponseEntity<HealthDto.EmpHealthTrendResponse> healthPointTrend(
            @RequestParam String empId,
            @RequestParam int days
    ) {
        return ResponseEntity.ok(healthService.healthPointTrend(empId, days));
    }

    /**
     * 최근 기록
     * @param empId
     * @return
     */
    @GetMapping("/healthRecord")
    public ResponseEntity<HealthDto.EmpHealthRecordResponse> healthRecord(@RequestParam String empId) {


        return ResponseEntity.ok(healthService.healthRecord(empId));
    }

        @PostMapping("/healthReport")
    public ResponseEntity<HealthDto.HealthReportDto> preview(
            @RequestParam(defaultValue = "7") int days,
            @RequestBody HealthDto.HealthReportPreviewRequest req
    ) {
        // days는 현재 프론트 탭 선택값 검증용 (원하면 제거 가능)
        if (days != 7 && days != 30 && days != 90) days = 7;

        HealthDto.HealthReportDto dto = healthService.healthReport(req, days);
        return ResponseEntity.ok(dto);
    }

    @PostMapping(value = "/healthReport/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> downloadHealthReportPdf(
            @RequestParam(defaultValue = "7") int days,
            @RequestBody HealthDto.HealthReportPreviewRequest req
    ) {
        if (days != 7 && days != 30 && days != 90) days = 7;

        byte[] pdfBytes = healthService.healthReportPdf(req, days);

        String filename = "health-report-" + req.getEmpId() + ".pdf";

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .body(pdfBytes);
    }

}
