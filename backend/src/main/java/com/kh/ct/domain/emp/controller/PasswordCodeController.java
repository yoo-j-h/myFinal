package com.kh.ct.domain.emp.controller;

import com.kh.ct.domain.emp.dto.PasswordCodeDto;
import com.kh.ct.domain.emp.service.PasswordCodeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/passwordCode")
public class PasswordCodeController {

    private final PasswordCodeService passwordCodeService;

    @PostMapping("/send")
    public ResponseEntity<String> send(@RequestBody @Valid PasswordCodeDto.SendRequest req) {
        passwordCodeService.sendCode(req.getEmail());
        return ResponseEntity.ok("SENT");
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verify(@RequestBody @Valid PasswordCodeDto.VerifyRequest req) {
        boolean ok = passwordCodeService.verifyCode(req.getEmail(), req.getCode());
        return ok ? ResponseEntity.ok("VERIFIED")
                : ResponseEntity.badRequest().body("INVALID_CODE");
    }
}
