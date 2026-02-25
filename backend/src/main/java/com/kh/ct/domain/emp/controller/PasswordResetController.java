package com.kh.ct.domain.emp.controller;

import com.kh.ct.domain.emp.dto.EmpDto;
import com.kh.ct.domain.emp.service.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/password")
@RequiredArgsConstructor
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    @PostMapping("/reset-link")
    public ResponseEntity<EmpDto.SendPasswordResetLinkResponse> sendResetLink(
            @Valid @RequestBody EmpDto.SendPasswordResetLinkRequest request
    ) {
        passwordResetService.sendResetLink(request);
        return ResponseEntity.ok(EmpDto.SendPasswordResetLinkResponse.ok());
    }

    @GetMapping("/validate")
    public ResponseEntity<EmpDto.ValidatePasswordTokenResponse> validate(@RequestParam("token") String token) {
        return ResponseEntity.ok(passwordResetService.validate(token));
    }

    @PostMapping("/reset")
    public ResponseEntity<EmpDto.ResetPasswordByTokenResponse> reset(
            @Valid @RequestBody EmpDto.ResetPasswordByTokenRequest request
    ) {
        passwordResetService.resetPassword(request);
        return ResponseEntity.ok(EmpDto.ResetPasswordByTokenResponse.ok());
    }
}
