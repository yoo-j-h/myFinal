package com.kh.ct.domain.schedule.service;

import lombok.Builder;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

/**
 * 비행 일정 배정 결과 DTO
 * 검증 결과 및 violations 포함
 */
@Getter
@Builder
public class FlightAssignmentResult {
    
    /**
     * 배정 성공 여부
     */
    @Builder.Default
    private boolean success = true;
    
    /**
     * 배정된 일정 목록
     */
    @Builder.Default
    private List<ScheduleAssignmentResult> assignments = new ArrayList<>();
    
    /**
     * 위반 사항 목록
     */
    @Builder.Default
    private List<Violation> violations = new ArrayList<>();
    
    /**
     * 통계 정보
     */
    private Statistics statistics;
    
    /**
     * 위반 사항
     */
    @Getter
    @Builder
    public static class Violation {
        private Long flyScheduleId;
        private String flightNumber;
        private String violationType; // INSUFFICIENT_CREW, TIME_CONFLICT, etc.
        private String message;
        private String role; // PILOT, CABIN_CREW
        private int requiredCount;
        private int assignedCount;
        private int availableCount;
    }
    
    /**
     * 통계 정보
     */
    @Getter
    @Builder
    public static class Statistics {
        private int totalFlights;
        private int successfullyAssignedFlights;
        private int failedFlights;
        private int totalPilotAssignments;
        private int totalCabinCrewAssignments;
        private int totalAssignments;
        
        // 역할별 월 비행 횟수 분포
        private java.util.Map<String, java.util.Map<Integer, Integer>> flightCountDistribution; // role -> (flightCount -> empCount)
        
        // 시간 겹침 검사 결과
        private int timeConflictCount;
    }
}
