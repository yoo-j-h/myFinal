package com.kh.ct.domain.schedule.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kh.ct.domain.schedule.dto.FlyScheduleDto;
import com.kh.ct.domain.schedule.service.FlightSyncService;
import com.kh.ct.domain.schedule.service.FlyScheduleService;
import com.kh.ct.global.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/flight-schedules")
@RequiredArgsConstructor
@Validated
public class FlyScheduleController {
    
    private final FlyScheduleService flyScheduleService;
    private final FlightSyncService flightSyncService;
    private final ObjectMapper objectMapper;

    /**
     * 비행편 목록 조회
     * - 관리자: 항공사별 전체 비행편 조회
     * - 직원: 본인이 배정된 비행편만 조회
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<FlyScheduleDto.ListResponse>>> getFlightSchedules(
            Authentication authentication,
            @RequestParam(required = false) Long airlineId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(required = false) String departure,
            @RequestParam(required = false) String destination
    ) {
        List<FlyScheduleDto.ListResponse> schedules = flyScheduleService.getFlightSchedulesWithAuth(
                authentication, airlineId, startDate, endDate, departure, destination
        );
        return ResponseEntity.ok(ApiResponse.success("비행편 목록 조회 성공", schedules));
    }

    /**
     * 외부 API 데이터 동기화
     */
    @GetMapping("/sync")
    public ResponseEntity<ApiResponse<String>> syncExternalData() {
        flightSyncService.syncApiData();
        return ResponseEntity.ok(ApiResponse.success("비행 스케줄 동기화 요청 성공", "데이터 처리가 시작되었습니다."));
    }
    
    /**
     * 비행편 상세 조회 (크루 정보 포함)
     */
    @GetMapping("/{flyScheduleId}")
    public ResponseEntity<ApiResponse<FlyScheduleDto>> getFlightScheduleDetail(
            @PathVariable Long flyScheduleId,
            Authentication authentication
    ) {
        FlyScheduleDto schedule = flyScheduleService.getFlightScheduleDetailWithAuth(authentication, flyScheduleId);
        
        // ✅ 1단계: 실제 응답 JSON 구조 확인 (가장 중요)
        int crewCount = schedule.getCrewMembers() != null ? schedule.getCrewMembers().size() : 0;
        
        log.info("========================================");
        log.info("✅ [컨트롤러] 비행편 상세 조회 응답 검증");
        log.info("  - flyScheduleId: {}", flyScheduleId);
        log.info("  - crewMembers 필드 존재 여부: {}", schedule.getCrewMembers() != null);
        log.info("  - crewMembers 배열 크기: {}", crewCount);
        
        if (crewCount > 0) {
            log.info("  - 첫 번째 crew 정보: empId={}, empName={}, role={}", 
                    schedule.getCrewMembers().get(0).getEmpId(),
                    schedule.getCrewMembers().get(0).getEmpName(),
                    schedule.getCrewMembers().get(0).getRole());
        } else {
            log.warn("  ⚠️ WARNING: crewMembers가 비어있거나 null입니다!");
        }
        
        // ApiResponse로 래핑된 최종 응답 JSON 확인
        ApiResponse<FlyScheduleDto> apiResponse = ApiResponse.success("비행편 상세 조회 성공", schedule);
        try {
            String jsonResponse = objectMapper.writeValueAsString(apiResponse);
            log.info("  - 최종 응답 JSON (ApiResponse 래핑):");
            log.info("    {}", jsonResponse);
            
            // crewMembers 필드가 JSON에 포함되어 있는지 확인
            if (jsonResponse.contains("\"crewMembers\"") || jsonResponse.contains("\"crew_members\"")) {
                log.info("  ✅ crewMembers 필드가 JSON에 포함되어 있습니다!");
                if (jsonResponse.contains("\"crewMembers\":[]") || jsonResponse.contains("\"crew_members\":[]")) {
                    log.warn("  ⚠️ crewMembers가 빈 배열입니다! (DB 조회 문제 가능성)");
                } else if (jsonResponse.contains("\"crewMembers\":[") || jsonResponse.contains("\"crew_members\":[")) {
                    log.info("  ✅ crewMembers 배열에 데이터가 있습니다!");
                }
            } else {
                log.error("  ❌ ERROR: crewMembers 필드가 JSON에 없습니다! (직렬화 문제)");
            }
        } catch (Exception e) {
            log.error("JSON 직렬화 중 오류 발생", e);
        }
        
        log.info("========================================");
        
        return ResponseEntity.ok(apiResponse);
    }
    
    /**
     * 승무원 추가 (관리자만 가능)
     */
    @PostMapping("/{flyScheduleId}/crew")
    public ResponseEntity<ApiResponse<Void>> addCrewMember(
            @PathVariable Long flyScheduleId,
            @Valid @RequestBody FlyScheduleDto.AddCrewMemberRequest request,
            Authentication authentication
    ) {
        flyScheduleService.addCrewMemberWithAuth(authentication, flyScheduleId, request.getEmpId());
        return ResponseEntity.ok(ApiResponse.success("승무원 추가 성공", null));
    }
    
    /**
     * 승무원 삭제 (관리자만 가능)
     */
    @DeleteMapping("/{flyScheduleId}/crew/{empId}")
    public ResponseEntity<ApiResponse<Void>> removeCrewMember(
            @PathVariable Long flyScheduleId,
            @PathVariable String empId,
            Authentication authentication
    ) {
        flyScheduleService.removeCrewMemberWithAuth(authentication, flyScheduleId, empId);
        return ResponseEntity.ok(ApiResponse.success("승무원 삭제 성공", null));
    }
}
