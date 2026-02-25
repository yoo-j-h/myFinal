package com.kh.ct.domain.emp.controller;

import com.kh.ct.global.service.FileService;
import com.kh.ct.domain.emp.dto.AirlineApplyDto;
import com.kh.ct.domain.emp.service.AirlineApplyService;
import com.kh.ct.global.exception.BusinessException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/airline-applications")
@RequiredArgsConstructor
public class ServiceRegistrationController {

    private final AirlineApplyService airlineApplyService;
    private final FileService fileService;

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
            throw BusinessException.badRequest("파일 저장 중 오류가 발생했습니다: " + e.getMessage());
        }
        
        AirlineApplyDto.ApplyResponse response = airlineApplyService.createApplication(
                request,
                businessLicensePath,
                employmentCertPath
        );
        
        return ResponseEntity.ok(response);
    }
}

