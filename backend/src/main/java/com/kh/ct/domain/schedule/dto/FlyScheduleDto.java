package com.kh.ct.domain.schedule.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.kh.ct.global.common.CommonEnums;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlyScheduleDto {

    private Long flyScheduleId;
    private String flightNumber;
    private String airplaneType;
    private String departure;
    private LocalDateTime flyStartTime;
    private String destination;
    private LocalDateTime flyEndTime;
    private String gate;
    private Integer crewCount;
    private CommonEnums.flightStatus flightStatus;
    private Integer seatCount;
    
    // ✅ camelCase로 통일 (프론트엔드가 camelCase를 우선 사용)
    // @JsonProperty 제거하여 기본 camelCase 사용
    private List<CrewMemberResponse> crewMembers;
    
    // 항공사 정보
    private Long airlineId;
    private String airlineName;
    
    // 시간 포맷팅용 (프론트엔드에서 사용)
    private String departureTime;
    private String arrivalTime;
    private String duration;
    
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CrewMemberResponse {
        // ✅ camelCase로 통일 (프론트엔드가 camelCase를 우선 사용)
        // @JsonProperty 제거하여 기본 camelCase 사용
        private String empId;
        private String empName;
        private String empNo;
        private String role;
        private String job;
        private String departmentName;
        private String empStatus;
        private Long empFlyScheduleId;
    }
    
    /**
     * 항공편 상세 조회 응답 DTO
     * 항공편 정보 + 배정된 직원 목록 포함
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DetailResponse {
        @JsonProperty("fly_schedule_id")
        private Long flyScheduleId;
        
        @JsonProperty("flight_number")
        private String flightNumber;
        
        @JsonProperty("airplane_type")
        private String airplaneType;
        
        @JsonProperty("departure")
        private String departure;
        
        @JsonProperty("destination")
        private String destination;
        
        @JsonProperty("fly_start_time")
        private LocalDateTime flyStartTime;
        
        @JsonProperty("fly_end_time")
        private LocalDateTime flyEndTime;
        
        @JsonProperty("gate")
        private String gate;
        
        @JsonProperty("crew_count")
        private Integer crewCount;
        
        @JsonProperty("flight_status")
        private CommonEnums.flightStatus flightStatus;
        
        @JsonProperty("seat_count")
        private Integer seatCount;
        
        @JsonProperty("airline_id")
        private Long airlineId;
        
        @JsonProperty("airline_name")
        private String airlineName;
        
        @JsonProperty("departure_time")
        private String departureTime;
        
        @JsonProperty("arrival_time")
        private String arrivalTime;
        
        @JsonProperty("duration")
        private String duration;
        
        @JsonProperty("crew_members")
        private List<CrewMemberResponse> crewMembers;
    }
    
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ListResponse {
        @JsonProperty("fly_schedule_id")
        private Long flyScheduleId;
        
        @JsonProperty("flight_number")
        private String flightNumber;
        
        @JsonProperty("departure")
        private String departure;
        
        @JsonProperty("destination")
        private String destination;
        
        @JsonProperty("fly_start_time")
        private LocalDateTime flyStartTime;
        
        @JsonProperty("fly_end_time")
        private LocalDateTime flyEndTime;
        
        @JsonProperty("flight_status")
        private CommonEnums.flightStatus flightStatus;
        
        @JsonProperty("crew_count")
        private Integer crewCount;
        
        @JsonProperty("crew_assigned")
        private Boolean crewAssigned;
        
        @JsonProperty("is_assigned_to_me")
        private Boolean isAssignedToMe;
        
        @JsonProperty("departure_time")
        private String departureTime;
        
        @JsonProperty("arrival_time")
        private String arrivalTime;
        
        @JsonProperty("duration")
        private String duration;
        
        @JsonProperty("airline_id")
        private Long airlineId;
        
        @JsonProperty("airline_name")
        private String airlineName;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AddCrewMemberRequest {
        // 프론트엔드에서 empId 또는 emp_id 모두 받을 수 있도록 설정
        @JsonAlias({"empId", "emp_id"})
        @JsonProperty("emp_id")
        @NotBlank(message = "직원 ID(empId)는 필수입니다.")
        private String empId;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ExternalFlightData {
        @JsonProperty("편명")
        private String flightNumber;    // "KE713" -> FLY_SCHEDULE.FLIGHT_NUMBER

        @JsonProperty("날짜")
        private String date;            // "2015-02-27"

        @JsonProperty("계획시간")       // API 더미 데이터 형식이 "계획시간"이었으므로 확인 필요
        private String time;            // "16:20"

        @JsonProperty("공항")           // API 데이터가 "공항"으로 온다면 departure로 매핑
        private String departure;       // "PUS" -> FLY_SCHEDULE.DEPARTURE

        @JsonProperty("상대공항")       // API 데이터가 "상대공항"으로 온다면 destination으로 매핑
        private String destination;     // "NRT" -> FLY_SCHEDULE.DESTINATION

        @JsonProperty("출도착(A도착D출발)")
        private String type;            // "D" 인지 확인하여 출발/도착 로직 분리 가능
    }
}
