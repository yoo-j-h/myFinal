package com.kh.ct.domain.attendance.controller;

import com.kh.ct.domain.attendance.dto.ProtestDto;
import com.kh.ct.domain.attendance.service.ProtestApplyService;
import com.kh.ct.domain.attendance.service.VisionService;
import com.kh.ct.global.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 근태 정정 신청 REST API Controller
 */
@RestController
@RequestMapping("/api/attendance/protest")
@RequiredArgsConstructor
@Slf4j
public class ProtestApplyController {

    private final ProtestApplyService protestApplyService;
    private final VisionService visionService;

    /**
     * 근태 정정 신청
     * 
     * <p><b>프론트엔드 연동 가이드:</b></p>
     * <ul>
     *   <li>기존 근태 기록이 있는 경우: {@code attendanceId}를 전송</li>
     *   <li>근태 기록이 없는 경우 (결근/미출근): {@code attendanceDate}를 전송 (형식: yyyy-MM-dd)</li>
     *   <li>{@code attendanceId}와 {@code attendanceDate} 중 하나는 필수</li>
     *   <li>{@code attendanceDate}로 신청 시, 해당 날짜에 근태 기록이 없으면 자동으로 생성됨</li>
     * </ul>
     * 
     * @param empId 직원 ID (필수)
     * @param attendanceId 정정 대상 근태 ID (선택, attendanceDate와 둘 중 하나 필수)
     * @param attendanceDate 정정 대상 날짜 (선택, attendanceId와 둘 중 하나 필수, 형식: yyyy-MM-dd)
     * @param attendanceType 근무 유형 (NORMAL, LEAVE, HALF_LEAVE, LATE, ABSENT)
     * @param protestRequestInTime 정정 요청 출근 시간 (선택, 형식: HH:mm)
     * @param protestRequestOutTime 정정 요청 퇴근 시간 (선택, 형식: HH:mm)
     * @param protestReason 정정 사유 (필수)
     * @param files 증빙 파일 목록 (필수)
     * @return 정정 신청 응답
     */
    @PostMapping
    public ResponseEntity<ProtestDto.ListResponse> applyProtest(
            @RequestParam String empId,
            @RequestParam(required = false) Long attendanceId,
            @RequestParam(required = false) String attendanceDate,
            @RequestParam(required = false) String attendanceType,
            @RequestParam(required = false) String protestRequestInTime,
            @RequestParam(required = false) String protestRequestOutTime,
            @RequestParam String protestReason,
            @RequestParam(value = "files", required = false) List<MultipartFile> files) {
        
        log.info("POST /api/attendance/protest - empId: {}, attendanceId: {}, attendanceDate: {}", 
                empId, attendanceId, attendanceDate);

        try {
            ProtestDto.ApplyRequest request = ProtestDto.ApplyRequest.builder()
                    .attendanceId(attendanceId)
                    .attendanceDate(attendanceDate)
                    .attendanceType(attendanceType)
                    .protestRequestInTime(protestRequestInTime)
                    .protestRequestOutTime(protestRequestOutTime)
                    .protestReason(protestReason)
                    .build();

            ProtestDto.ListResponse response = protestApplyService.applyProtest(empId, request, files);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("근태 정정 신청 실패", e);
            throw e;
        }
    }

    /**
     * 내 정정 신청 목록 조회
     * 
     * @param empId 직원 ID
     * @return 정정 신청 목록
     */
    @GetMapping("/my")
    public ResponseEntity<List<ProtestDto.ListResponse>> getMyProtestList(
            @RequestParam String empId) {
        
        log.info("GET /api/attendance/protest/my - empId: {}", empId);

        try {
            List<ProtestDto.ListResponse> response = protestApplyService.getMyProtestList(empId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("정정 신청 목록 조회 실패", e);
            throw e;
        }
    }

    /**
     * 정정 신청 상세 조회
     * 
     * @param id 정정 신청 ID
     * @return 정정 신청 상세
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProtestDto.DetailResponse> getProtestDetail(
            @PathVariable Long id) {
        
        log.info("GET /api/attendance/protest/{} - id: {}", id, id);

        try {
            ProtestDto.DetailResponse response = protestApplyService.getProtestDetail(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("정정 신청 상세 조회 실패", e);
            throw e;
        }
    }

    /**
     * 정정 승인/반려
     * 
     * @param id 정정 신청 ID
     * @param approverId 승인자 ID
     * @param request 승인/반려 요청
     * @return 정정 신청 응답
     */
    @PutMapping("/{id}/approve")
    public ResponseEntity<ProtestDto.ListResponse> approveProtest(
            @PathVariable Long id,
            @RequestParam String approverId,
            @RequestBody ProtestDto.ApproveRequest request) {
        
        log.info("PUT /api/attendance/protest/{}/approve - id: {}, approverId: {}, approved: {}", 
                id, id, approverId, request.getApproved());

        try {
            ProtestDto.ListResponse response = protestApplyService.approveProtest(id, approverId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("정정 승인/반려 실패", e);
            throw e;
        }
    }

    /**
     * 이미지 OCR (텍스트 추출)
     * 
     * @param file 이미지 파일
     * @return OCR 응답 (추출된 텍스트)
     */
    @PostMapping("/ocr")
    public ResponseEntity<ApiResponse<ProtestDto.OcrResponse>> extractTextFromImage(
            @RequestParam("file") MultipartFile file) {
        
        log.info("POST /api/attendance/protest/ocr - 파일명: {}", file.getOriginalFilename());

        try {
            // Early Return: 이미지 파일 유효성 검증
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw com.kh.ct.global.exception.BusinessException.badRequest("이미지 파일만 업로드 가능합니다.");
            }

            // VisionService를 통해 구조화된 데이터 추출
            ProtestDto.OcrResponse response = visionService.extractText(file);

            // ApiResponse 포맷으로 반환
            return ResponseEntity.ok(
                    ApiResponse.success("텍스트 추출 완료", response)
            );
        } catch (Exception e) {
            log.error("텍스트 추출 실패", e);
            throw e;
        }
    }
}
