package com.kh.ct.domain.schedule.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

/**
 * 공공데이터포털 항공편 API 응답 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlightApiResponseDto {

    @JsonProperty("currentCount")
    private Integer currentCount;

    @JsonProperty("matchCount")
    private Integer matchCount;

    @JsonProperty("page")
    private Integer page;

    @JsonProperty("perPage")
    private Integer perPage;

    @JsonProperty("totalCount")
    private Integer totalCount;

    @JsonProperty("data")
    private List<FlightData> data;

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FlightData {
        /**
         * 계획시간 (예: "14:00")
         */
        @JsonProperty("계획시간")
        private String plannedTime;

        /**
         * 공항 코드 (예: "PUS")
         */
        @JsonProperty("공항")
        private String airport;

        /**
         * 날짜 (예: "2015-02-26")
         */
        @JsonProperty("날짜")
        private String date;

        /**
         * 상대공항 코드 (예: "NRT")
         */
        @JsonProperty("상대공항")
        private String relativeAirport;

        /**
         * 출도착 구분 (A: 도착, D: 출발)
         */
        @JsonProperty("출도착(A도착D출발)")
        private String arrivalDeparture;

        /**
         * 편명 (예: "JL958")
         */
        @JsonProperty("편명")
        private String flightNumber;
    }
}
