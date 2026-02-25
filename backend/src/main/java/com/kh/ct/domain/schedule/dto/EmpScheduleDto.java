package com.kh.ct.domain.schedule.dto;

import com.kh.ct.domain.schedule.entity.EmpSchedule;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class EmpScheduleDto {

    /**
     * 직원 일정 조회 응답 DTO
     */
    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ListResponse {
        private Long empScheduleId;
        private Long scheduleId;
        private String empId;
        private String empName;
        private String scheduleCode;
        private String scheduleCodeText; // 한글 변환된 스케줄 코드
        private LocalDateTime startDate;
        private LocalDateTime endDate;
        private LocalDateTime createDate;
        private LocalDateTime updateDate;

        public static ListResponse from(EmpSchedule empSchedule) {
            return ListResponse.builder()
                    .empScheduleId(empSchedule.getEmpScheduleId())
                    .scheduleId(empSchedule.getScheduleId() != null ? empSchedule.getScheduleId().getScheduleId() : null)
                    .empId(empSchedule.getEmpId() != null ? empSchedule.getEmpId().getEmpId() : null)
                    .empName(empSchedule.getEmpId() != null ? empSchedule.getEmpId().getEmpName() : null)
                    .scheduleCode(empSchedule.getScheduleCode())
                    .scheduleCodeText(getScheduleCodeText(empSchedule.getScheduleCode()))
                    .startDate(empSchedule.getScheduleId() != null ? empSchedule.getScheduleId().getStartDate() : null)
                    .endDate(empSchedule.getScheduleId() != null ? empSchedule.getScheduleId().getEndDate() : null)
                    .createDate(empSchedule.getCreateDate())
                    .updateDate(empSchedule.getUpdateDate())
                    .build();
        }
        
        private static String getScheduleCodeText(String scheduleCode) {
            if (scheduleCode == null) return "-";
            return switch (scheduleCode) {
                case "FLIGHT" -> "비행";
                case "STANDBY" -> "대기";
                case "OFF" -> "휴무";
                case "SHIFT_D" -> "주간근무";
                case "SHIFT_E" -> "오후근무";
                case "SHIFT_N" -> "야간근무";
                case "COUNSEL" -> "상담";
                case "EXERCISE" -> "운동";
                case "REST" -> "휴식";
                default -> scheduleCode;
            };
        }

        public static List<ListResponse> fromList(List<EmpSchedule> empSchedules) {
            if (empSchedules == null) {
                return new ArrayList<>();
            }
            return empSchedules.stream()
                    .filter(es -> es != null)
                    .map(es -> {
                        try {
                            return ListResponse.from(es);
                        } catch (Exception e) {
                            // 로깅은 서비스 레이어에서 처리
                            return null;
                        }
                    })
                    .filter(response -> response != null)
                    .collect(Collectors.toList());
        }
    }

    /**
     * 캘린더용 일정 응답 DTO (월별 조회)
     * 직군별로 다른 응답 구조 지원
     */
    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CalendarResponse {
        private Long empScheduleId;
        private Long scheduleId;
        private String empId; // 직원 ID (필수 - 프론트에서 필터링용)
        private String role; // 직원 역할 (선택 - 디버깅용)
        private String scheduleCode; // FLIGHT, STANDBY, OFF, SHIFT_D, SHIFT_E, SHIFT_N
        private LocalDateTime startDate;
        private LocalDateTime endDate;
        private String title; // 일정 제목 (scheduleCode 기반)
        
        // 비행 일정 정보 (CABIN_CREW/PILOT용)
        private Long flyScheduleId; // 비행편 ID
        private String flightNumber; // 항공편 번호
        private String departure; // 출발지
        private String destination; // 도착지
        
        // 교대 근무 시간 정보 (GROUND_CREW/MAINTENANCE용)
        private LocalDateTime shiftStartTime; // 교대 시작 시간
        private LocalDateTime shiftEndTime; // 교대 종료 시간

        public static CalendarResponse from(EmpSchedule empSchedule) {
            if (empSchedule == null) {
                throw new IllegalArgumentException("EmpSchedule이 null입니다.");
            }

            try {
                String scheduleCode = empSchedule.getScheduleCode();
                String title = getScheduleTitle(scheduleCode);
                
                String empId = null;
                String role = null;
                if (empSchedule.getEmpId() != null) {
                    empId = empSchedule.getEmpId().getEmpId();
                    if (empSchedule.getEmpId().getRole() != null) {
                        role = empSchedule.getEmpId().getRole().name();
                    }
                }
                
                Long scheduleId = null;
                java.time.LocalDateTime startDate = null;
                java.time.LocalDateTime endDate = null;
                if (empSchedule.getScheduleId() != null) {
                    scheduleId = empSchedule.getScheduleId().getScheduleId();
                    startDate = empSchedule.getScheduleId().getStartDate();
                    endDate = empSchedule.getScheduleId().getEndDate();
                }
                
                return CalendarResponse.builder()
                        .empScheduleId(empSchedule.getEmpScheduleId())
                        .scheduleId(scheduleId)
                        .empId(empId)
                        .role(role)
                        .scheduleCode(scheduleCode)
                        .startDate(startDate)
                        .endDate(endDate)
                        .title(title)
                        .build();
            } catch (Exception e) {
                throw new RuntimeException("EmpSchedule DTO 변환 중 오류 발생 - empScheduleId: " + 
                        (empSchedule.getEmpScheduleId() != null ? empSchedule.getEmpScheduleId() : "null"), e);
            }
        }

        public static List<CalendarResponse> fromList(List<EmpSchedule> empSchedules) {
            return empSchedules.stream()
                    .map(CalendarResponse::from)
                    .collect(Collectors.toList());
        }

        private static String getScheduleTitle(String scheduleCode) {
            if (scheduleCode == null) return "일정";
            return switch (scheduleCode) {
                case "FLIGHT" -> "비행";
                case "STANDBY" -> "대기";
                case "OFF" -> "휴무";
                case "COUNSEL" -> "상담 일정";
                case "EXERCISE" -> "운동 일정";
                case "REST" -> "휴식";
                case "SHIFT_D" -> "1교대";
                case "SHIFT_E" -> "2교대";
                case "SHIFT_N" -> "3교대";
                default -> scheduleCode;
            };
        }
    }

    /**
     * 일정 수정 요청 DTO
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateRequest {
        @NotNull(message = "시작 날짜는 필수입니다.")
        private LocalDateTime startDate;
        
        @NotNull(message = "종료 날짜는 필수입니다.")
        private LocalDateTime endDate;
        
        private String scheduleCode;
    }
}
