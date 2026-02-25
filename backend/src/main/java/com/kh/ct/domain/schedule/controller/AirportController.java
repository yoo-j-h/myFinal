package com.kh.ct.domain.schedule.controller;

import com.kh.ct.domain.schedule.entity.Airport;
import com.kh.ct.domain.schedule.repository.AirportRepository;
import com.kh.ct.global.dto.ApiResponse;
import com.kh.ct.global.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/airports")
@RequiredArgsConstructor
@Validated
public class AirportController {
    
    private final AirportRepository airportRepository;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Airport>>> getAllAirports() {
        try {
            log.info("공항 목록 조회 요청");
            List<Airport> airports = airportRepository.findAll();
            log.info("공항 목록 조회 완료 - {}건", airports.size());
            return ResponseEntity.ok(ApiResponse.success("공항 목록 조회 성공", airports));
        } catch (Exception e) {
            log.error("공항 목록 조회 중 오류 발생", e);
            throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, 
                    "공항 목록 조회 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}
