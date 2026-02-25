package com.kh.ct.domain.emp.controller;

import com.kh.ct.global.service.FileService;
import com.kh.ct.domain.emp.dto.AirlineApplyDto;
import com.kh.ct.domain.emp.service.AirlineApplyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/super-admin/airline-applications")
@RequiredArgsConstructor
public class AirlineApplyController {

    private final AirlineApplyService airlineApplyService;
    private final FileService fileService;

    @GetMapping
    public ResponseEntity<List<AirlineApplyDto.ListResponse>> getApplications(
            @RequestParam(required = false) String keyword
    ) {
        List<AirlineApplyDto.ListResponse> applications;
        
        if (keyword != null && !keyword.trim().isEmpty()) {
            applications = airlineApplyService.searchApplications(keyword);
        } else {
            applications = airlineApplyService.getAllApplications();
        }
        
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AirlineApplyDto.DetailResponse> getApplicationDetail(
            @PathVariable Long id
    ) {
        AirlineApplyDto.DetailResponse detail = airlineApplyService.getApplicationDetail(id);
        return ResponseEntity.ok(detail);
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<Void> approveApplication(
            @PathVariable Long id,
            @Valid @RequestBody AirlineApplyDto.ApproveRequest request
    ) {
        airlineApplyService.approveApplication(id, request.getAdminId());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<Void> rejectApplication(
            @PathVariable Long id,
            @Valid @RequestBody AirlineApplyDto.RejectRequest request
    ) {
        airlineApplyService.rejectApplication(id, request.getReason());
        return ResponseEntity.ok().build();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AirlineApplyDto.ApplyResponse> createApplication(
            @RequestPart("data") @Valid AirlineApplyDto.ApplyRequest request,
            @RequestPart(value = "businessLicense", required = false) MultipartFile businessLicense,
            @RequestPart(value = "employmentCert", required = false) MultipartFile employmentCert
    ) {
        String businessLicensePath = null;
        String employmentCertPath = null;
        
        try {
            // 파일 저장
            if (businessLicense != null && !businessLicense.isEmpty()) {
                businessLicensePath = fileService.saveFile(businessLicense).getPath();
            }
            if (employmentCert != null && !employmentCert.isEmpty()) {
                employmentCertPath = fileService.saveFile(employmentCert).getPath();
            }
        } catch (IOException e) {
            throw new RuntimeException("파일 저장 중 오류가 발생했습니다.", e);
        }
        
        AirlineApplyDto.ApplyResponse response = airlineApplyService.createApplication(
                request,
                businessLicensePath,
                employmentCertPath
        );
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/approve-with-link")
    public ResponseEntity<AirlineApplyDto.ApproveResponse> approveApplicationWithLink(
            @PathVariable Long id,
            @Valid @RequestBody AirlineApplyDto.ApproveRequest request
    ) {
        AirlineApplyDto.ApproveResponse response = airlineApplyService.approveApplicationWithLink(id, request.getAdminId());
        return ResponseEntity.ok(response);
    }
}

