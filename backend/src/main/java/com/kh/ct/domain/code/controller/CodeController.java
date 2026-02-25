package com.kh.ct.domain.code.controller;

import com.kh.ct.domain.code.dto.CodeDetailDto;
import com.kh.ct.domain.code.dto.CodeDto;
import com.kh.ct.domain.code.service.CodeService;
import com.kh.ct.global.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/common/codes")
@RequiredArgsConstructor
@Validated
public class CodeController {

    private final CodeService codeService;

    /**
     * 코드 조회
     * - SUPER_ADMIN: 모든 항공사의 코드 조회
     * - AIRLINE_ADMIN: 자신의 항공사 코드만 조회
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<CodeDto>>> getCode(Authentication authentication) {
        List<CodeDto> codes = codeService.getCodesByAuth(authentication);
        return ResponseEntity.ok(ApiResponse.success("공통코드 조회 성공", codes));
    }
    /**
     * 코드 디테일 조회
     */
    @GetMapping("/{codeId}/details")
    public ResponseEntity<ApiResponse<List<CodeDetailDto>>> getCodeDetails(@PathVariable Long codeId) {
        return ResponseEntity.ok(
                ApiResponse.success("공통코드 디테일 조회 성공", codeService.getCodeDetails(codeId))
        );
    }

    /**
     * 코드 등록
     * - SUPER_ADMIN: 코드 추가 불가 (readonly)
     * - AIRLINE_ADMIN: 자신의 항공사ID로 자동 설정
     */
    @PostMapping
    public ResponseEntity<ApiResponse<CodeDto.CreateResponse>> createCode(
            @Valid @RequestBody CodeDto.CreateRequest request,
            Authentication authentication) {
        CodeDto.CreateResponse saved = codeService.createCodeWithAuth(authentication, request);
        return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED)
                .body(ApiResponse.success("공통코드 등록 성공", saved));
    }

    /**
     * 코드 디테일 등록
     * - SUPER_ADMIN: 코드 디테일 추가 불가 (readonly)
     */
    @PostMapping("/{codeId}/details")
    public ResponseEntity<ApiResponse<CodeDetailDto.CreateResponse>> createCodeDetail(
            @PathVariable Long codeId,
            @Valid @RequestBody CodeDetailDto.CreateRequest request,
            Authentication authentication) {
        CodeDetailDto.CreateResponse saved = codeService.createCodeDetailWithAuth(authentication, codeId, request);
        return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED)
                .body(ApiResponse.success("공통코드 디테일 등록 성공", saved));
    }

    /**
     * 코드 그룹 삭제
     * - SUPER_ADMIN: 코드 삭제 불가 (readonly)
     */
    @DeleteMapping("/{codeId}")
    public ResponseEntity<ApiResponse<Void>> deleteCode(
            @PathVariable Long codeId,
            Authentication authentication) {
        codeService.deleteCodeWithAuth(authentication, codeId);
        return ResponseEntity.ok(ApiResponse.success("공통코드 그룹 삭제 성공", null));
    }

    /**
     * 코드 디테일 수정
     * - SUPER_ADMIN: 코드 디테일 수정 불가 (readonly)
     */
    @PutMapping("/{codeId}/details/{codeDetailId}")
    public ResponseEntity<ApiResponse<CodeDetailDto.CreateResponse>> updateCodeDetail(
            @PathVariable Long codeId,
            @PathVariable Long codeDetailId,
            @Valid @RequestBody CodeDetailDto.UpdateRequest request,
            Authentication authentication) {
        CodeDetailDto.CreateResponse updated = codeService.updateCodeDetailWithAuth(authentication, codeId, codeDetailId, request);
        return ResponseEntity.ok(ApiResponse.success("공통코드 디테일 수정 성공", updated));
    }

    /**
     * 코드 디테일 삭제
     * - SUPER_ADMIN: 코드 디테일 삭제 불가 (readonly)
     */
    @DeleteMapping("/{codeId}/details/{codeDetailId}")
    public ResponseEntity<ApiResponse<Void>> deleteCodeDetail(
            @PathVariable Long codeId,
            @PathVariable Long codeDetailId,
            Authentication authentication) {
        codeService.deleteCodeDetailWithAuth(authentication, codeId, codeDetailId);
        return ResponseEntity.ok(ApiResponse.success("공통코드 디테일 삭제 성공", null));
    }
}
