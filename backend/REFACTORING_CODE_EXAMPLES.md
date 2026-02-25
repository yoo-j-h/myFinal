# 스케줄 도메인 리팩토링 코드 예시

## 1. Repository 메서드

### EmpFlyScheduleRepository.findByEmpIdAndMonth()

```java
package com.kh.ct.domain.schedule.repository;

import com.kh.ct.domain.schedule.entity.EmpFlySchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface EmpFlyScheduleRepository extends JpaRepository<EmpFlySchedule, Long> {
    
    /**
     * 직원 ID로 월별 비행편 조회 (캘린더용)
     * - EmpFlySchedule → FlySchedule → AllSchedule JOIN FETCH
     * - Single Source of Truth: FLIGHT 일정은 EmpFlySchedule에서만 관리
     */
    @Query("SELECT efs FROM EmpFlySchedule efs " +
           "JOIN FETCH efs.flySchedule fs " +
           "LEFT JOIN FETCH fs.schedule s " +  // ✅ AllSchedule JOIN FETCH
           "WHERE efs.emp.empId = :empId " +
           "AND fs.flyStartTime >= :startDate " +
           "AND fs.flyStartTime < :endDate " +
           "ORDER BY fs.flyStartTime ASC")
    List<EmpFlySchedule> findByEmpIdAndMonth(
            @Param("empId") String empId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
}
```

### EmpScheduleRepository.findByEmpIdAndMonth()

```java
package com.kh.ct.domain.schedule.repository;

import com.kh.ct.domain.schedule.entity.EmpSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface EmpScheduleRepository extends JpaRepository<EmpSchedule, Long> {
    
    /**
     * 직원 ID로 월별 스케줄 조회 (캘린더용)
     * - FLIGHT 일정 제외 (FLIGHT는 EmpFlySchedule에서만 관리)
     */
    @Query("SELECT es FROM EmpSchedule es " +
           "JOIN FETCH es.scheduleId s " +
           "JOIN FETCH es.empId emp " +
           "WHERE es.empId.empId = :empId " +
           "AND s.startDate >= :startDate " +
           "AND s.startDate < :endDate " +
           "AND (es.scheduleCode != 'FLIGHT' OR es.scheduleCode IS NULL) " + // ✅ FLIGHT 제외
           "AND (s.scheduleCode != 'FLIGHT' OR s.scheduleCode IS NULL) " +   // ✅ AllSchedule의 FLIGHT도 제외
           "ORDER BY s.startDate ASC")
    List<EmpSchedule> findByEmpIdAndMonth(
            @Param("empId") String empId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
}
```

## 2. Service 메서드

### EmpScheduleServiceImpl.getFlightCrewMonthlySchedule()

```java
package com.kh.ct.domain.schedule.service;

import com.kh.ct.domain.schedule.dto.EmpScheduleDto;
import com.kh.ct.domain.schedule.entity.EmpSchedule;
import com.kh.ct.domain.schedule.entity.AllSchedule;
import com.kh.ct.domain.schedule.repository.EmpScheduleRepository;
import com.kh.ct.domain.schedule.repository.EmpFlyScheduleRepository;
import com.kh.ct.global.common.CommonEnums;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpScheduleServiceImpl implements EmpScheduleService {
    
    private final EmpScheduleRepository empScheduleRepository;
    private final EmpFlyScheduleRepository empFlyScheduleRepository;
    
    /**
     * 운항직(CABIN_CREW/PILOT) 월별 일정 조회
     * 
     * 데이터 소스:
     * 1. 항공편 일정: EmpFlySchedule → FlySchedule → AllSchedule (Single Source of Truth)
     * 2. 일반 일정: EmpSchedule → AllSchedule (FLIGHT 제외)
     * 
     * 병합 규칙:
     * - 같은 날짜에 항공편 일정과 일반 일정이 모두 있으면 항공편 일정 우선
     * - 항공편 일정은 AllSchedule의 startDate/endDate 사용
     */
    private List<EmpScheduleDto.CalendarResponse> getFlightCrewMonthlySchedule(
            String empId, YearMonth yearMonth, LocalDateTime startDate, LocalDateTime endDate, CommonEnums.Role role
    ) {
        // ========================================
        // 1. 항공편 일정 조회 (EmpFlySchedule → FlySchedule → AllSchedule)
        // ========================================
        log.info("✅ [운항직 일정 조회] 항공편 일정 조회 시작 - empId: {}", empId);
        
        // EmpFlySchedule 조회 (FlySchedule과 AllSchedule JOIN FETCH 포함)
        List<com.kh.ct.domain.schedule.entity.EmpFlySchedule> empFlySchedules = 
            empFlyScheduleRepository.findByEmpIdAndMonth(empId, startDate, endDate);
        
        // EmpFlySchedule → CalendarResponse 변환 (AllSchedule 정보 포함)
        List<EmpScheduleDto.CalendarResponse> flightResponses = empFlySchedules.stream()
            .filter(efs -> efs.getFlySchedule() != null)
            .map(efs -> {
                com.kh.ct.domain.schedule.entity.FlySchedule flight = efs.getFlySchedule();
                com.kh.ct.domain.schedule.entity.AllSchedule allSchedule = flight.getSchedule();
                
                // AllSchedule이 있으면 AllSchedule의 시간 사용, 없으면 FlySchedule의 시간 사용
                LocalDateTime startDateTime = (allSchedule != null && allSchedule.getStartDate() != null) 
                    ? allSchedule.getStartDate() 
                    : flight.getFlyStartTime();
                LocalDateTime endDateTime = (allSchedule != null && allSchedule.getEndDate() != null) 
                    ? allSchedule.getEndDate() 
                    : flight.getFlyEndTime();
                
                Long scheduleId = (allSchedule != null) ? allSchedule.getScheduleId() : null;
                
                return EmpScheduleDto.CalendarResponse.builder()
                    .empScheduleId(null) // emp_fly_schedule에는 empScheduleId가 없음
                    .scheduleId(scheduleId) // AllSchedule의 scheduleId
                    .empId(empId)
                    .role(role != null ? role.name() : null)
                    .scheduleCode("FLIGHT")
                    .startDate(startDateTime) // AllSchedule 또는 FlySchedule의 시간
                    .endDate(endDateTime)     // AllSchedule 또는 FlySchedule의 시간
                    .title("비행")
                    .flyScheduleId(flight.getFlyScheduleId())
                    .flightNumber(flight.getFlightNumber())
                    .departure(flight.getDeparture())
                    .destination(flight.getDestination())
                    .build();
            })
            .collect(Collectors.toList());
        
        // ========================================
        // 2. 일반 일정 조회 (EmpSchedule → AllSchedule, FLIGHT 제외)
        // ========================================
        log.info("✅ [운항직 일정 조회] 일반 일정 조회 시작 - empId: {}", empId);
        
        // EmpSchedule 조회 (FLIGHT 제외 - Repository에서 자동 필터링)
        List<EmpSchedule> empSchedules = empScheduleRepository.findByEmpIdAndMonth(empId, startDate, endDate);
        
        // EmpSchedule → CalendarResponse 변환
        List<EmpScheduleDto.CalendarResponse> dailyResponses = empSchedules.stream()
            .filter(es -> es != null)
            .map(es -> {
                EmpScheduleDto.CalendarResponse response = EmpScheduleDto.CalendarResponse.from(es);
                // 비행 일정 정보는 null로 설정 (일반 일정이므로)
                response.setFlyScheduleId(null);
                response.setFlightNumber(null);
                response.setDeparture(null);
                response.setDestination(null);
                return response;
            })
            .filter(response -> response != null)
            .collect(Collectors.toList());
        
        // ========================================
        // 3. 날짜별 병합 (항공편 일정 우선)
        // ========================================
        Map<java.time.LocalDate, EmpScheduleDto.CalendarResponse> mergedMap = new HashMap<>();
        
        // 일반 일정 먼저 추가
        for (EmpScheduleDto.CalendarResponse daily : dailyResponses) {
            if (daily.getStartDate() != null) {
                java.time.LocalDate date = daily.getStartDate().toLocalDate();
                mergedMap.put(date, daily);
            }
        }
        
        // 항공편 일정 추가 (같은 날짜면 항공편 일정으로 덮어쓰기 - 항공편 우선)
        for (EmpScheduleDto.CalendarResponse flight : flightResponses) {
            if (flight.getStartDate() != null) {
                java.time.LocalDate date = flight.getStartDate().toLocalDate();
                mergedMap.put(date, flight);
            }
        }
        
        return new ArrayList<>(mergedMap.values());
    }
}
```

### ScheduleGenerationService.saveSchedulesBatch()

```java
package com.kh.ct.domain.schedule.service;

import com.kh.ct.domain.schedule.entity.EmpFlySchedule;
import com.kh.ct.domain.schedule.entity.EmpSchedule;
import com.kh.ct.domain.schedule.entity.AllSchedule;
import com.kh.ct.domain.schedule.entity.FlySchedule;
import com.kh.ct.domain.schedule.repository.EmpFlyScheduleRepository;
import com.kh.ct.domain.schedule.repository.EmpScheduleRepository;
import com.kh.ct.domain.schedule.repository.AllScheduleRepository;
import com.kh.ct.domain.schedule.repository.FlyScheduleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ScheduleGenerationService {
    
    private final EmpFlyScheduleRepository empFlyScheduleRepository;
    private final EmpScheduleRepository empScheduleRepository;
    private final AllScheduleRepository allScheduleRepository;
    private final FlyScheduleRepository flyScheduleRepository;
    private final EmpRepository empRepository;
    
    /**
     * Batch Insert로 일정 저장
     * 
     * 변경사항:
     * - FLIGHT 일정: EmpFlySchedule에만 저장 (AllSchedule/EmpSchedule 제거)
     * - 기타 일정(STANDBY, OFF, SHIFT 등): AllSchedule + EmpSchedule 저장
     */
    @Transactional
    private void saveSchedulesBatch(List<ScheduleAssignmentResult> results) {
        if (results.isEmpty()) {
            return;
        }
        
        log.info("일정 배치 저장 시작 - {}건", results.size());
        
        // ✅ 1. FLIGHT 일정과 기타 일정 분리
        List<ScheduleAssignmentResult> flightResults = results.stream()
                .filter(r -> "FLIGHT".equals(r.getScheduleCode()))
                .collect(Collectors.toList());
        
        List<ScheduleAssignmentResult> otherResults = results.stream()
                .filter(r -> !"FLIGHT".equals(r.getScheduleCode()))
                .collect(Collectors.toList());
        
        log.info("일정 분류 - FLIGHT: {}건, 기타(STANDBY/OFF/SHIFT): {}건", 
                flightResults.size(), otherResults.size());
        
        // ✅ 2. 기타 일정만 AllSchedule + EmpSchedule 저장
        // (AllSchedule 저장 로직...)
        // (EmpSchedule 저장 로직...)
        
        // ✅ 3. FLIGHT 일정은 EmpFlySchedule에만 저장
        List<EmpFlySchedule> empFlySchedulesToSave = new ArrayList<>();
        
        for (ScheduleAssignmentResult result : flightResults) {
            if (result.getFlyScheduleId() == null || result.getEmpId() == null) {
                continue;
            }
            
            // Emp 찾기
            Emp emp = empRepository.findById(result.getEmpId())
                    .orElseThrow(() -> BusinessException.notFound("직원을 찾을 수 없습니다: " + result.getEmpId()));
            
            // FlySchedule 찾기
            FlySchedule flySchedule = flyScheduleRepository.findById(result.getFlyScheduleId())
                    .orElseThrow(() -> BusinessException.notFound("비행편을 찾을 수 없습니다: " + result.getFlyScheduleId()));
            
            // 중복 체크
            List<EmpFlySchedule> existing = empFlyScheduleRepository.findByFlyScheduleIdAndEmpId(
                    result.getFlyScheduleId(), result.getEmpId());
            if (!existing.isEmpty()) {
                continue;
            }
            
            // EmpFlySchedule 생성
            EmpFlySchedule empFlySchedule = EmpFlySchedule.builder()
                    .emp(emp)
                    .flySchedule(flySchedule)
                    .build();
            
            empFlySchedulesToSave.add(empFlySchedule);
        }
        
        // EmpFlySchedule 저장
        if (!empFlySchedulesToSave.isEmpty()) {
            empFlyScheduleRepository.saveAll(empFlySchedulesToSave);
            log.info("✅ FLIGHT 일정 EmpFlySchedule 저장 완료 - {}건", empFlySchedulesToSave.size());
        }
    }
}
```

### FlyScheduleServiceImpl.addCrewMember() / removeCrewMember()

```java
package com.kh.ct.domain.schedule.service;

import com.kh.ct.domain.schedule.entity.EmpFlySchedule;
import com.kh.ct.domain.schedule.entity.FlySchedule;
import com.kh.ct.domain.schedule.repository.EmpFlyScheduleRepository;
import com.kh.ct.domain.schedule.repository.FlyScheduleRepository;
import com.kh.ct.domain.emp.entity.Emp;
import com.kh.ct.domain.emp.repository.EmpRepository;
import com.kh.ct.global.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class FlyScheduleServiceImpl implements FlyScheduleService {
    
    private final EmpFlyScheduleRepository empFlyScheduleRepository;
    private final FlyScheduleRepository flyScheduleRepository;
    private final EmpRepository empRepository;
    
    /**
     * 승무원 추가 (EmpFlySchedule만 사용)
     */
    @Override
    @Transactional
    public void addCrewMember(Long flyScheduleId, String empId) {
        // 비행편 존재 확인
        FlySchedule flySchedule = flyScheduleRepository.findByFlyScheduleId(flyScheduleId)
                .orElseThrow(() -> BusinessException.notFound("해당 비행편이 존재하지 않습니다. flyScheduleId=" + flyScheduleId));
        
        // 직원 존재 확인
        Emp emp = empRepository.findById(empId)
                .orElseThrow(() -> BusinessException.notFound("존재하지 않는 직원입니다. empId=" + empId));
        
        // 이미 배정되어 있는지 확인
        List<EmpFlySchedule> existing = empFlyScheduleRepository.findByFlyScheduleIdAndEmpId(flyScheduleId, empId);
        if (!existing.isEmpty()) {
            throw BusinessException.conflict("이미 해당 비행편에 배정된 직원입니다.");
        }
        
        // ✅ EmpFlySchedule만 생성 (AllSchedule/EmpSchedule 생성 제거)
        EmpFlySchedule empFlySchedule = EmpFlySchedule.builder()
                .emp(emp)
                .flySchedule(flySchedule)
                .build();
        
        empFlyScheduleRepository.save(empFlySchedule);
        
        log.info("승무원 배정 완료 - flyScheduleId: {}, empId: {}", flyScheduleId, empId);
    }
    
    /**
     * 승무원 삭제 (EmpFlySchedule만 사용)
     */
    @Override
    @Transactional
    public void removeCrewMember(Long flyScheduleId, String empId) {
        // ✅ EmpFlySchedule만 조회 및 삭제
        List<EmpFlySchedule> empFlySchedules = empFlyScheduleRepository.findByFlyScheduleIdAndEmpId(flyScheduleId, empId);
        
        if (empFlySchedules.isEmpty()) {
            throw BusinessException.notFound("해당 비행편에 배정된 직원을 찾을 수 없습니다. flyScheduleId=" + flyScheduleId + ", empId=" + empId);
        }
        
        // EmpFlySchedule 삭제
        empFlyScheduleRepository.deleteAll(empFlySchedules);
        
        log.info("승무원 삭제 완료 - flyScheduleId: {}, empId: {}", flyScheduleId, empId);
    }
}
```

## 3. DTO 구조

### EmpScheduleDto.CalendarResponse

```java
package com.kh.ct.domain.schedule.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public static class CalendarResponse {
    private Long empScheduleId;        // EmpSchedule의 ID (일반 일정인 경우)
    private Long scheduleId;           // AllSchedule의 ID (항공편/일반 일정 모두)
    private String empId;              // 직원 ID (필수)
    private String role;               // 직원 역할
    private String scheduleCode;        // FLIGHT, STANDBY, OFF, SHIFT_D, SHIFT_E, SHIFT_N
    private LocalDateTime startDate;   // AllSchedule 또는 FlySchedule의 시작 시간
    private LocalDateTime endDate;      // AllSchedule 또는 FlySchedule의 종료 시간
    private String title;               // 일정 제목
    
    // 비행 일정 정보 (항공편 일정인 경우만)
    private Long flyScheduleId;         // FlySchedule의 ID
    private String flightNumber;        // 항공편 번호
    private String departure;          // 출발지
    private String destination;        // 도착지
    
    // 교대 근무 시간 정보 (지상직인 경우만)
    private LocalDateTime shiftStartTime;
    private LocalDateTime shiftEndTime;
}
```

## 4. 데이터 흐름 다이어그램

```
자동 배정:
┌─────────────────────────────────────┐
│ FlightAssignmentEngine              │
│ → ScheduleAssignmentResult           │
│   (allSchedule=null, flyScheduleId)  │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ ScheduleGenerationService            │
│ saveSchedulesBatch()                 │
│                                      │
│ 1. FLIGHT와 기타 일정 분리           │
│ 2. 기타 일정: AllSchedule+EmpSchedule│
│ 3. FLIGHT: EmpFlySchedule만 저장     │
└─────────────────────────────────────┘

수동 배정:
┌─────────────────────────────────────┐
│ FlyScheduleServiceImpl               │
│ addCrewMember()                      │
│ → EmpFlySchedule만 생성              │
└─────────────────────────────────────┘

조회:
┌─────────────────────────────────────┐
│ EmpScheduleServiceImpl               │
│ getFlightCrewMonthlySchedule()       │
│                                      │
│ 1. EmpFlySchedule → FlySchedule      │
│    → AllSchedule (항공편 일정)       │
│ 2. EmpSchedule → AllSchedule         │
│    (일반 일정, FLIGHT 제외)          │
│ 3. 날짜별 병합 (항공편 우선)         │
└─────────────────────────────────────┘
```

## 5. 주요 원칙

1. **Single Source of Truth**: FLIGHT 일정은 EmpFlySchedule만 사용
2. **AllSchedule 유지**: 공통 시간 부모 엔티티로 유지
3. **명시적 조인**: EmpFlySchedule → FlySchedule → AllSchedule 명시적 조회
4. **Repository 필터링**: EmpSchedule 조회 시 FLIGHT 자동 제외
5. **트랜잭션 유지**: 기존 트랜잭션 및 권한 구조 유지
