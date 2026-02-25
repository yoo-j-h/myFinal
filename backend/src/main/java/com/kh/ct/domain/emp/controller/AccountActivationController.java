package com.kh.ct.domain.emp.controller;

import com.kh.ct.global.service.FileService;
import com.kh.ct.domain.emp.dto.AccountActivationDto;
import com.kh.ct.domain.emp.service.AccountActivationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/account-activation")
@RequiredArgsConstructor
public class AccountActivationController {

    private final AccountActivationService accountActivationService;
    private final FileService fileService;

    @GetMapping("/{token}")
    public ResponseEntity<AccountActivationDto.ActivationInfoResponse> getActivationInfo(
            @PathVariable String token
    ) {
        AccountActivationDto.ActivationInfoResponse response = accountActivationService.getActivationInfo(token);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{token}")
    public ResponseEntity<AccountActivationDto.ActivationResponse> activateAccount(
            @PathVariable String token,
            @Valid @RequestBody AccountActivationDto.ActivationRequest request
    ) {
        AccountActivationDto.ActivationResponse response = accountActivationService.activateAccount(token, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/initial-setup/{token}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AccountActivationDto.InitialSetupResponse> completeInitialSetup(
            @PathVariable String token,
            @RequestPart("data") @Valid AccountActivationDto.InitialSetupRequest request,
            @RequestPart(value = "logoFile", required = false) MultipartFile logoFile
    ) {
        String logoFilePath = null;
        
        try {
            // 로고 파일 저장 (선택사항)
            if (logoFile != null && !logoFile.isEmpty()) {
                logoFilePath = fileService.saveFile(logoFile).getPath();
            }
        } catch (IOException e) {
            throw new RuntimeException("파일 저장 중 오류가 발생했습니다.", e);
        }
        
        AccountActivationDto.InitialSetupResponse response = accountActivationService.completeInitialSetup(
                token,
                request,
                logoFilePath
        );
        
        return ResponseEntity.ok(response);
    }
}

