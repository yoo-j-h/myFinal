package com.kh.ct.domain.emp.controller;


import com.kh.ct.domain.emp.dto.SettingDto;
import com.kh.ct.domain.emp.service.SettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SettingController {

    private final SettingService settingService;

    /**
     * 직원 프로필 정보 조회 (GET)
     * @param empId : 조회할 직원의 ID (경로 변수)
     */
    @GetMapping("/profile/{empId}")
    public ResponseEntity<SettingDto> getProfile(@PathVariable String empId) {
        return ResponseEntity.ok(settingService.getEmpProfile(empId));
    }

    /**
     * 직원 프로필 정보 수정 (PUT)
     * @param empId : 수정할 직원의 ID (경로 변수)
     * @param settingDto : 프론트엔드에서 넘어온 수정 데이터 (JSON)
     */
    @PutMapping("/profile/{empId}")
    public ResponseEntity<String> updateProfile(
            @PathVariable String empId,
            @RequestBody SettingDto settingDto) {

        try {
            settingService.updateEmpProfile(empId, settingDto);
            return ResponseEntity.ok("프로필 정보가 성공적으로 변경되었습니다.");
        } catch (RuntimeException e) {
            // 해당 직원이 없거나 업데이트 실패 시 400 Bad Request 반환
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            // 기타 서버 오류 시 500 Internal Server Error 반환
            return ResponseEntity.internalServerError().body("서버 오류가 발생했습니다.");
        }
    }

    @PutMapping("/password/{empId}")
    public ResponseEntity<String> changePassword(
            @PathVariable String empId,
            @RequestBody SettingDto passwordUpdateDTO) {

        try {
            settingService.changePassword(empId, passwordUpdateDTO);
            return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
        } catch (IllegalArgumentException e) {
            // 현재 비밀번호가 틀린 경우 등 비즈니스 로직 예외 처리
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("비밀번호 변경 중 오류가 발생했습니다.");
        }
    }
}