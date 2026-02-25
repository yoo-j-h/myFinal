package com.kh.ct.domain.schedule.controller;

import com.kh.ct.domain.schedule.service.ScheduleGenerationService;
import com.kh.ct.global.dto.ApiResponse;
import com.kh.ct.global.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;

/**
 * 스케줄 자동 생성 컨트롤러
 */
@Slf4j
@RestController
@RequestMapping("/api/schedule-generation")
@RequiredArgsConstructor
public class ScheduleGenerationController {
    
    private final ScheduleGenerationService scheduleGenerationService;
    
    /**
     * 월별 스케줄 자동 생성
     * 
     * @param yearMonth 배정할 년월 (YYYY-MM 형식)
     * @param airlineId 항공사 ID (선택적, 관리자 권한 시 자동 설정)
     * @param authentication 인증 정보
     * @return 생성된 일정 수
     */
    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<Integer>> generateMonthlySchedules(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM") YearMonth yearMonth,
            @RequestParam(required = false) Long airlineId,
            Authentication authentication
    ) {
        // 관리자 권한 체크
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.fail("인증이 필요합니다."));
        }
        
        // airlineId가 없으면 인증된 사용자의 항공사 ID 사용
        if (airlineId == null) {
            // TODO: authentication에서 airlineId 추출
            // 임시로 null 허용
        }
        
        try {
            int count = scheduleGenerationService.generateMonthlySchedules(yearMonth, airlineId);
            return ResponseEntity.ok(
                ApiResponse.success("월별 스케줄 자동 생성 완료", count)
            );
        } catch (BusinessException e) {
            log.error("스케줄 생성 실패 (BusinessException) - yearMonth: {}, airlineId: {}", yearMonth, airlineId, e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.fail("스케줄 생성에 실패했습니다: " + e.getMessage()));
        } catch (Exception e) {
            log.error("스케줄 생성 실패 (Exception) - yearMonth: {}, airlineId: {}", yearMonth, airlineId, e);
            e.printStackTrace(); // 스택 트레이스 출력
            return ResponseEntity.internalServerError()
                .body(ApiResponse.fail("스케줄 생성에 실패했습니다: " + e.getMessage() + 
                    (e.getCause() != null ? " (원인: " + e.getCause().getMessage() + ")" : "")));
        }
    }
}
