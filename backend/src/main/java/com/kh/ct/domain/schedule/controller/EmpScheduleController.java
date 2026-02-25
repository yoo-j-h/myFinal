package com.kh.ct.domain.schedule.controller;

import com.kh.ct.domain.emp.entity.Emp;
import com.kh.ct.domain.emp.repository.EmpRepository;
import com.kh.ct.domain.schedule.dto.EmpScheduleDto;
import com.kh.ct.domain.schedule.service.EmpScheduleService;
import com.kh.ct.global.common.CommonEnums;
import com.kh.ct.global.dto.ApiResponse;
import com.kh.ct.global.exception.BusinessException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/emp-schedules")
@RequiredArgsConstructor
@Validated
public class EmpScheduleController {

    private final EmpScheduleService empScheduleService;
    private final com.kh.ct.domain.schedule.service.FlyScheduleService flyScheduleService;
    private final EmpRepository empRepository;

    /**
     * 직원 일정 조회 (권한별 분기)
     * - 관리자: 항공사별, 역할별 조회 가능
     * - 직원: 자신의 일정만 조회
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<EmpScheduleDto.ListResponse>>> getEmpSchedules(
            @RequestParam(required = false) String empId,
            @RequestParam(required = false) String role,
            Authentication authentication
    ) {
        CommonEnums.Role roleEnum = null;
        if (role != null && !role.isEmpty()) {
            try {
                roleEnum = CommonEnums.Role.valueOf(role.toUpperCase());
                log.info("역할 필터 파라미터 - role: {}, roleEnum: {}", role, roleEnum);
            } catch (IllegalArgumentException e) {
                log.error("잘못된 역할 값: {}", role, e);
                return ResponseEntity.badRequest()
                        .body(ApiResponse.fail("잘못된 역할 값입니다: " + role));
            }
        } else {
            log.info("역할 필터 없음 - 전체 조회");
        }
        
        List<EmpScheduleDto.ListResponse> schedules = empScheduleService.getEmpSchedulesWithAuth(
                authentication, empId, roleEnum
        );
        log.info("최종 조회 결과: {}건", schedules.size());
        return ResponseEntity.ok(ApiResponse.success("직원 일정 조회 성공", schedules));
    }

    /**
     * 직원 월별 일정 조회 (캘린더용)
     * - 직원: 자신의 일정만 조회
     */
    @GetMapping("/calendar")
    public ResponseEntity<ApiResponse<List<EmpScheduleDto.CalendarResponse>>> getEmpSchedulesByMonth(
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM") YearMonth yearMonth,
            Authentication authentication
    ) {
        if (yearMonth == null) {
            yearMonth = YearMonth.now();
        }
        
        List<EmpScheduleDto.CalendarResponse> schedules = 
                empScheduleService.getEmpSchedulesByMonthWithAuth(authentication, yearMonth);
        return ResponseEntity.ok(ApiResponse.success("월별 일정 조회 성공", schedules));
    }

    /**
     * 일정 수정 (관리자만 가능)
     */
    @PatchMapping("/{empScheduleId}")
    public ResponseEntity<ApiResponse<Void>> updateEmpSchedule(
            @PathVariable Long empScheduleId,
            @Valid @RequestBody EmpScheduleDto.UpdateRequest request,
            Authentication authentication
    ) {
        empScheduleService.updateEmpSchedule(empScheduleId, request, authentication);
        return ResponseEntity.ok(ApiResponse.success("일정 수정 성공", null));
    }
    
    /**
     * 월별 항공편 수 조회 (통계용)
     */
    @GetMapping("/flight-count")
    public ResponseEntity<ApiResponse<Long>> getFlightCount(
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM") YearMonth yearMonth,
            Authentication authentication
    ) {
        if (yearMonth == null) {
            yearMonth = YearMonth.now();
        }
        
        // 권한 확인
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN)
                    .body(ApiResponse.fail("인증이 필요합니다."));
        }
        
        String authEmpId = authentication.getName();
        Emp emp = empRepository.findById(authEmpId)
                .orElseThrow(() -> BusinessException.notFound("직원 정보를 찾을 수 없습니다."));
        
        Long airlineId = null;
        if (emp.getAirlineId() != null) {
            airlineId = emp.getAirlineId().getAirlineId(); // Airline 객체에서 airlineId(Long) 추출
        }
        
        long count = flyScheduleService.countFlightsByMonth(airlineId, yearMonth);
        return ResponseEntity.ok(ApiResponse.success("항공편 수 조회 성공", count));
    }
}
