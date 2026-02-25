package com.kh.ct.domain.emp.controller;

import com.kh.ct.domain.emp.dto.EmpDto;
import com.kh.ct.domain.emp.entity.Emp;
import com.kh.ct.domain.emp.service.EmpNoService;
import com.kh.ct.domain.emp.service.EmpService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import com.kh.ct.global.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;
import com.kh.ct.domain.emp.dto.AirlineDto;

@RestController
@RequestMapping("/api/emps")
@RequiredArgsConstructor
@Validated
public class EmpController {

    private final EmpService empService;
    private final EmpNoService empNoService;

    /** 아이디 중복체크 */
    @GetMapping("/checkId")
    public ResponseEntity<EmpDto.IdCheckResponse> checkEmpId(
            @RequestParam @NotBlank(message = "empId는 필수입니다.") String empId
    ) {
        boolean available = empService.isEmpIdAvailable(empId);
        return ResponseEntity.ok(EmpDto.IdCheckResponse.of(available));
    }

    /** ✅ 사번 미리보기: 가입 전에 화면에 보여주기 */
    @GetMapping("/empNo/preview")
    public ResponseEntity<EmpDto.EmpNoPreviewResponse> previewEmpNo() {
        String empNo = empNoService.previewEmpNo();
        return ResponseEntity.ok(EmpDto.EmpNoPreviewResponse.of(empNo));
    }

    /** 회원가입 */
    @PostMapping
    public ResponseEntity<EmpDto.RegisterResponse> register(
            @Valid @RequestBody EmpDto.RegisterRequest request
    ) {
        Emp created = empService.register(request);
        return ResponseEntity.ok(EmpDto.RegisterResponse.from(created));
    }


    /**
     * 관리자(담당자) 후보 리스트 조회
     */
    @GetMapping("/managers")
    public ResponseEntity<ApiResponse<List<EmpDto>>> getManagerCandidates() {
        java.util.List<EmpDto> managers = empService.getManagerCandidates();
        return ResponseEntity.ok(ApiResponse.success("관리자 후보 조회 성공", managers));
    }

    /**
     * 직원 목록 조회 (역할별 필터링 가능)
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<EmpDto.EmployeeListItem>>> getEmployees(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Long airlineId
    ) {
        List<EmpDto.EmployeeListItem> employees = empService.getEmployees(role, airlineId);
        return ResponseEntity.ok(ApiResponse.success("직원 목록 조회 성공", employees));
    }

    /**
     * 직원 직급/직책 수정
     */
    @PatchMapping("/{empId}/role-job")
    public ResponseEntity<ApiResponse<EmpDto>> updateEmpRoleAndJob(
            @PathVariable String empId,
            @Valid @RequestBody EmpDto.UpdateRoleAndJobRequest request
    ) {
        EmpDto updatedEmp = empService.updateEmpRoleAndJob(empId, request);
        return ResponseEntity.ok(ApiResponse.success("직급/직책 수정 성공", updatedEmp));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<EmpDto>> getMyProfile(Authentication authentication) {
        String empId = authentication.getName();
        EmpDto empDetail = empService.getEmpDetail(empId); // 기존 변환 로직 재사용
        return ResponseEntity.ok(ApiResponse.success("내 프로필 조회 성공", empDetail));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<EmpDto>> updateMyProfile(
            Authentication authentication,
            @Valid @RequestBody EmpDto.UpdateMyProfileRequest request
    ) {
        String empId = authentication.getName();
        EmpDto updated = empService.updateMyProfile(empId, request);
        return ResponseEntity.ok(ApiResponse.success("내 프로필 수정 성공", updated));
    }

    @PutMapping("/me/password")
    public ResponseEntity<Void> changeMyPassword(
            Authentication authentication,
            @Valid @RequestBody EmpDto.ChangeMyPasswordRequest req
    ) {
        String empId = authentication.getName();
        // ⚠️ authentication.getName()이 empId가 맞다는 전제 (대부분 subject로 empId 넣으면 맞음)

        empService.changeMyPassword(empId, req.getCurrentPassword(), req.getNewPassword());
        return ResponseEntity.ok().build();
    }

    /**
     * 직원 상세 정보 조회
     */
    @GetMapping("/{empId}")
    public ResponseEntity<ApiResponse<EmpDto>> getEmpDetail(@PathVariable String empId) {
        EmpDto empDetail = empService.getEmpDetail(empId);
        return ResponseEntity.ok(ApiResponse.success("직원 상세 정보 조회 성공", empDetail));
    }

    /**
     * 직원의 항공사 정보 조회 (테마 적용용)
     */
    @GetMapping("/{empId}/airline")
    public ResponseEntity<ApiResponse<AirlineDto.DetailResponse>> getEmpAirline(@PathVariable String empId) {
       AirlineDto.DetailResponse airlineInfo = empService.getAirlineByEmpId(empId);
        return ResponseEntity.ok(ApiResponse.success("항공사 정보 조회 성공", airlineInfo));
    }

    /**
     * 내 항공사 정보 조회 (테마용).
     * GET /api/emps/me/airline 은 SecurityConfig에서 permitAll 처리되어, JWT 검증 실패 시에도 호출됨.
     * 인증이 없거나 anonymous 이면 기본 항공사 데이터를 반환해 프론트 테마가 깨지지 않도록 함.
     */
    @GetMapping("/me/airline")
    public ResponseEntity<ApiResponse<AirlineDto.DetailResponse>> getMyAirline(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getName())) {
            AirlineDto.DetailResponse defaultAirline = AirlineDto.DetailResponse.builder()
                    .name("default airline")
                    .icon("✈️")
                    .primaryColor(null)
                    .secondaryColor(null)
                    .mainNumber("")
                    .businessNumber("")
                    .address("")
                    .email("")
                    .build();
            return ResponseEntity.ok(ApiResponse.success("기본 항공사 정보", defaultAirline));
        }
        String empId = authentication.getName();
        AirlineDto.DetailResponse airlineInfo = empService.getAirlineByEmpId(empId);
        return ResponseEntity.ok(ApiResponse.success("내 항공사 정보 조회 성공", airlineInfo));
    }
    /** 아이디 찾기 */
    @PostMapping("/findId")
    public ResponseEntity<ApiResponse<EmpDto.FindIdResponse>> findEmpId(
            @Valid @RequestBody EmpDto.FindIdRequest request
    ) {
        EmpDto.FindIdResponse result = empService.findEmpId(request);
        return ResponseEntity.ok(ApiResponse.success("아이디 찾기 성공", result));
    }
}
