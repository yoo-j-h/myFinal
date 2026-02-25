package com.kh.ct.domain.schedule.service;

import com.kh.ct.domain.schedule.entity.AllSchedule;
import com.kh.ct.global.common.CommonEnums;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 일일 상태 채우기 엔진
 * 
 * 역할:
 * - 비행 없는 날 STANDBY/OFF 채우기 (CABIN_CREW/PILOT)
 * - 모든 직원의 모든 날짜에 스케줄 상태가 반드시 1개 존재하도록 보장
 * - 빈 날(0개) 없음 보장
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DailyFillEngine {
    
    private static final String SCHEDULE_CODE_STANDBY = "STANDBY";
    private static final String SCHEDULE_CODE_OFF = "OFF";
    
    /**
     * 일일 상태 채우기 (Phase 2)
     * 
     * @param yearMonth 배정할 년월
     * @param employeeStates 직원 상태 맵 (Phase 1 비행 배정 후 업데이트된 상태)
     * @param airlineId 항공사 ID
     * @return 배정 결과 리스트 (STANDBY/OFF만)
     */
    public List<ScheduleAssignmentResult> fillDailyStatus(
            YearMonth yearMonth,
            Map<String, EmployeeState> employeeStates,
            Long airlineId
    ) {
        log.info("========================================");
        log.info("일일 상태 채우기 시작 - yearMonth: {}, airlineId: {}", yearMonth, airlineId);
        log.info("========================================");
        
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();
        
        List<ScheduleAssignmentResult> results = new ArrayList<>();
        
        // 날짜별로 처리
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            final LocalDate currentDate = date;
            final LocalDateTime dateStart = date.atTime(0, 0);
            final LocalDateTime dateEnd = date.atTime(23, 59, 59);
            
            // 1. CABIN_CREW/PILOT: 비행 없는 날 STANDBY/OFF 채우기
            Map<String, EmployeeState> flightCrewStates = employeeStates.entrySet().stream()
                .filter(entry -> {
                    CommonEnums.Role role = entry.getValue().getRole();
                    return role == CommonEnums.Role.PILOT || role == CommonEnums.Role.CABIN_CREW;
                })
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
            
            List<ScheduleAssignmentResult> flightCrewResults = fillFlightCrewDailyStatus(
                currentDate, flightCrewStates
            );
            results.addAll(flightCrewResults);
            
            // 2. GROUND_STAFF/MAINTENANCE: 이미 ShiftAssignmentEngine에서 처리됨
            // 여기서는 빈 날 확인만 수행
            Map<String, EmployeeState> groundStaffStates = employeeStates.entrySet().stream()
                .filter(entry -> {
                    CommonEnums.Role role = entry.getValue().getRole();
                    return role == CommonEnums.Role.GROUND_STAFF || role == CommonEnums.Role.MAINTENANCE;
                })
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
            
            // 지상직 빈 날 확인 및 OFF 배정
            for (Map.Entry<String, EmployeeState> entry : groundStaffStates.entrySet()) {
                String empId = entry.getKey();
                EmployeeState state = entry.getValue();
                
                if (!state.hasAssignmentOnDate(currentDate)) {
                    log.warn("지상직 직원 {}의 날짜 {}에 배정이 없습니다. OFF로 채웁니다.", empId, currentDate);
                    
                    LocalDateTime offStart = currentDate.atTime(0, 0);
                    LocalDateTime offEnd = currentDate.atTime(23, 59, 59);
                    
                    AllSchedule offSchedule = AllSchedule.builder()
                        .scheduleCode(SCHEDULE_CODE_OFF)
                        .startDate(offStart)
                        .endDate(offEnd)
                        .build();
                    
                    state.addAssignedSlot(offStart, offEnd, SCHEDULE_CODE_OFF);
                    state.resetConsecutiveWorkDays();
                    
                    results.add(ScheduleAssignmentResult.builder()
                        .empId(empId)
                        .allSchedule(offSchedule)
                        .scheduleCode(SCHEDULE_CODE_OFF)
                        .startTime(offStart)
                        .endTime(offEnd)
                        .build());
                }
            }
        }
        
        log.info("일일 상태 채우기 완료 - 총 {}건 배정", results.size());
        return results;
    }
    
    /**
     * 운항직(CABIN_CREW/PILOT) 일일 상태 채우기
     */
    private List<ScheduleAssignmentResult> fillFlightCrewDailyStatus(
            LocalDate date,
            Map<String, EmployeeState> flightCrewStates
    ) {
        List<ScheduleAssignmentResult> results = new ArrayList<>();
        
        LocalDateTime dateStart = date.atTime(0, 0);
        LocalDateTime dateEnd = date.atTime(23, 59, 59);
        
        // 해당 날짜에 배정되지 않은 직원 찾기
        List<Map.Entry<String, EmployeeState>> unassignedEmployees = flightCrewStates.entrySet().stream()
            .filter(entry -> {
                EmployeeState state = entry.getValue();
                return !state.hasAssignmentOnDate(date);
            })
            .collect(Collectors.toList());
        
        if (unassignedEmployees.isEmpty()) {
            return results; // 모든 직원이 이미 배정됨
        }
        
        log.info("날짜 {} 운항직 미배정 인원: {}명", date, unassignedEmployees.size());
        
        // OFF 강제 대상자 분류
        List<Map.Entry<String, EmployeeState>> offCandidates = new ArrayList<>();
        List<Map.Entry<String, EmployeeState>> standbyCandidates = new ArrayList<>();
        
        for (Map.Entry<String, EmployeeState> entry : unassignedEmployees) {
            EmployeeState state = entry.getValue();
            
            // OFF 강제 조건
            boolean shouldBeOff = false;
            
            // 1. 연속 근무 6일 이상
            if (state.getConsecutiveWorkDays() >= 6) {
                shouldBeOff = true;
            }
            
            // 2. 연속 비행 3회 이상
            if (state.getConsecutiveFlights() >= 3) {
                shouldBeOff = true;
            }
            
            // 3. 연속 야간 근무 2회 이상
            if (state.getConsecutiveNightShifts() >= 2) {
                shouldBeOff = true;
            }
            
            // 4. 월 비행 횟수 9회 이상
            if (state.getMonthlyFlightCount() >= 9) {
                shouldBeOff = true;
            }
            
            if (shouldBeOff) {
                offCandidates.add(entry);
            } else {
                standbyCandidates.add(entry);
            }
        }
        
        // 1. OFF 배정 (강제 OFF 대상자)
        for (Map.Entry<String, EmployeeState> entry : offCandidates) {
            String empId = entry.getKey();
            EmployeeState state = entry.getValue();
            
            LocalDateTime offStart = dateStart;
            LocalDateTime offEnd = dateEnd;
            
            AllSchedule offSchedule = AllSchedule.builder()
                .scheduleCode(SCHEDULE_CODE_OFF)
                .startDate(offStart)
                .endDate(offEnd)
                .build();
            
            state.addAssignedSlot(offStart, offEnd, SCHEDULE_CODE_OFF);
            state.resetConsecutiveWorkDays();
            
            results.add(ScheduleAssignmentResult.builder()
                .empId(empId)
                .allSchedule(offSchedule)
                .scheduleCode(SCHEDULE_CODE_OFF)
                .startTime(offStart)
                .endTime(offEnd)
                .build());
        }
        
        // 2. STANDBY 배정 (동적 목표 인원 계산)
        int targetDailyStandby = Math.max(3, (int) Math.ceil(standbyCandidates.size() * 0.15));
        int standbyCount = 0;
        
        // STANDBY 배정 (공정성 고려)
        List<Map.Entry<String, EmployeeState>> standbyEligible = standbyCandidates.stream()
            .sorted(Comparator.comparingInt(e -> e.getValue().getTotalStandbyCount()))
            .collect(Collectors.toList());
        
        for (Map.Entry<String, EmployeeState> entry : standbyEligible) {
            if (standbyCount >= targetDailyStandby) {
                break;
            }
            
            String empId = entry.getKey();
            EmployeeState state = entry.getValue();
            
            // 연속 STANDBY 3일 체크
            if (state.getConsecutiveStandbyDays() >= 3) {
                continue; // OFF로 배정
            }
            
            LocalDateTime standbyStart = date.atTime(9, 0);
            LocalDateTime standbyEnd = date.atTime(18, 0);
            
            AllSchedule standbySchedule = AllSchedule.builder()
                .scheduleCode(SCHEDULE_CODE_STANDBY)
                .startDate(standbyStart)
                .endDate(standbyEnd)
                .build();
            
            state.addAssignedSlot(standbyStart, standbyEnd, SCHEDULE_CODE_STANDBY);
            state.updateConsecutiveWorkDays(date);
            
            results.add(ScheduleAssignmentResult.builder()
                .empId(empId)
                .allSchedule(standbySchedule)
                .scheduleCode(SCHEDULE_CODE_STANDBY)
                .startTime(standbyStart)
                .endTime(standbyEnd)
                .build());
            
            standbyCount++;
        }
        
        // 3. 나머지 미배정 인원을 OFF로 배정
        List<Map.Entry<String, EmployeeState>> trulyUnassigned = standbyEligible.stream()
            .skip(standbyCount)
            .collect(Collectors.toList());
        
        for (Map.Entry<String, EmployeeState> entry : trulyUnassigned) {
            String empId = entry.getKey();
            EmployeeState state = entry.getValue();
            
            LocalDateTime offStart = dateStart;
            LocalDateTime offEnd = dateEnd;
            
            AllSchedule offSchedule = AllSchedule.builder()
                .scheduleCode(SCHEDULE_CODE_OFF)
                .startDate(offStart)
                .endDate(offEnd)
                .build();
            
            state.addAssignedSlot(offStart, offEnd, SCHEDULE_CODE_OFF);
            state.resetConsecutiveWorkDays();
            
            results.add(ScheduleAssignmentResult.builder()
                .empId(empId)
                .allSchedule(offSchedule)
                .scheduleCode(SCHEDULE_CODE_OFF)
                .startTime(offStart)
                .endTime(offEnd)
                .build());
        }
        
        log.info("날짜 {} 운항직 배정 완료 - OFF: {}명, STANDBY: {}명, 총: {}명", 
            date, offCandidates.size() + trulyUnassigned.size(), standbyCount, results.size());
        
        return results;
    }
}
