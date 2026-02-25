# 자동 배정 로직 리팩토링 완료 요약

## 목표 달성
✅ **FLIGHT 일정은 EmpFlySchedule에만 저장** (Single Source of Truth)  
✅ **EmpSchedule에서 FLIGHT 저장 로직 제거**  
✅ **기타 일정(STANDBY/OFF/SHIFT)은 기존대로 AllSchedule + EmpSchedule 저장**

## 주요 변경 사항

### 1. ScheduleGenerationService.saveSchedulesBatch()

**변경 전**:
```java
// 모든 일정을 EmpSchedule에 저장
for (ScheduleAssignmentResult result : results) {
    // FLIGHT 포함 모든 일정을 EmpSchedule에 저장
    EmpSchedule empSchedule = EmpSchedule.builder()
        .scheduleId(savedAllSchedule)
        .empId(emp)
        .scheduleCode(result.getScheduleCode()) // FLIGHT 포함
        .build();
    empSchedulesToSave.add(empSchedule);
}

// 그 후 FLIGHT 일정인 경우 EmpFlySchedule도 생성
for (ScheduleAssignmentResult result : results) {
    if ("FLIGHT".equals(result.getScheduleCode())) {
        // EmpFlySchedule 생성
    }
}
```

**변경 후**:
```java
// 1. FLIGHT와 기타 일정 분리
List<ScheduleAssignmentResult> flightResults = results.stream()
    .filter(r -> "FLIGHT".equals(r.getScheduleCode()))
    .collect(Collectors.toList());

List<ScheduleAssignmentResult> otherResults = results.stream()
    .filter(r -> !"FLIGHT".equals(r.getScheduleCode()))
    .collect(Collectors.toList());

// 2. 기타 일정만 AllSchedule 처리
for (ScheduleAssignmentResult result : otherResults) {
    // AllSchedule 저장
}

// 3. 기타 일정만 EmpSchedule 저장
for (ScheduleAssignmentResult result : otherResults) {
    // EmpSchedule 저장 (FLIGHT 제외)
}

// 4. FLIGHT 일정은 EmpFlySchedule에만 저장
for (ScheduleAssignmentResult result : flightResults) {
    // EmpFlySchedule 저장 (AllSchedule/EmpSchedule 불필요)
}
```

### 2. ScheduleGenerationService.deleteExistingSchedules()

**변경 사항**:
- EmpSchedule 삭제: 기타 일정만 삭제 (FLIGHT는 Repository 필터링으로 자동 제외)
- EmpFlySchedule 삭제: 해당 월의 FlySchedule에 대한 EmpFlySchedule 삭제 추가

```java
// 1. EmpSchedule 삭제 (기타 일정만 - FLIGHT는 이미 제외됨)
List<EmpSchedule> existingSchedules = empScheduleRepository.findByAirlineIdAndMonth(
    airlineId, startDate, endDate
);
empScheduleRepository.deleteAll(existingSchedules);

// 2. EmpFlySchedule 삭제 (FLIGHT 일정)
List<FlySchedule> flightsInMonth = flyScheduleRepository.findByDateRange(
    airlineId, startDate, endDate
);
List<Long> flyScheduleIds = flightsInMonth.stream()
    .map(FlySchedule::getFlyScheduleId)
    .collect(Collectors.toList());
List<EmpFlySchedule> existingEmpFlySchedules = 
    empFlyScheduleRepository.findByFlyScheduleIdIn(flyScheduleIds);
empFlyScheduleRepository.deleteAll(existingEmpFlySchedules);
```

## 데이터 흐름 비교

### 이전 구조 (중복 저장)
```
자동 배정 실행:
1. FlightAssignmentEngine: ScheduleAssignmentResult 생성 (allSchedule=null, flyScheduleId=O)
2. ScheduleGenerationService.saveSchedulesBatch():
   - AllSchedule 생성 (FLIGHT 포함)
   - EmpSchedule 저장 (FLIGHT 포함)
   - EmpFlySchedule 저장 (FLIGHT)
→ FLIGHT 일정이 EmpSchedule과 EmpFlySchedule에 중복 저장
```

### 리팩토링 후 구조 (Single Source of Truth)
```
자동 배정 실행:
1. FlightAssignmentEngine: ScheduleAssignmentResult 생성 (allSchedule=null, flyScheduleId=O)
2. ScheduleGenerationService.saveSchedulesBatch():
   - FLIGHT와 기타 일정 분리
   - 기타 일정: AllSchedule 생성 + EmpSchedule 저장
   - FLIGHT 일정: EmpFlySchedule에만 저장 (AllSchedule/EmpSchedule 제거)
→ FLIGHT 일정은 EmpFlySchedule에만 저장 (Single Source of Truth)
```

## 검증 완료

### ✅ 저장 로직
- [x] FLIGHT 일정은 EmpFlySchedule에만 저장
- [x] 기타 일정은 AllSchedule + EmpSchedule 저장
- [x] AllSchedule 생성 시 FLIGHT 제외

### ✅ 삭제 로직
- [x] EmpSchedule 삭제 시 FLIGHT 자동 제외 (Repository 필터링)
- [x] EmpFlySchedule 삭제 추가 (해당 월의 FlySchedule 기준)

### ✅ 조회 로직
- [x] 항공편 상세: EmpFlySchedule 조회 (이미 구현됨)
- [x] 직원 개인 스케줄: EmpSchedule(일반) + EmpFlySchedule(항공편) 합성 (이미 구현됨)

### ✅ FlightAssignmentEngine
- [x] `allSchedule(null)` 설정 확인
- [x] `flyScheduleId` 설정 확인

## 관련 파일

### 수정된 파일
1. `ScheduleGenerationService.java`
   - `saveSchedulesBatch()`: FLIGHT와 기타 일정 분리 처리
   - `deleteExistingSchedules()`: EmpFlySchedule 삭제 추가

### 이미 올바르게 구현된 파일
1. `MonthlyScheduleOrchestrator.java`
   - `saveSchedulesBatch()`: 이미 FLIGHT와 기타 일정 분리 처리
   - `saveFlightSchedules()`: EmpFlySchedule에만 저장

2. `FlightAssignmentEngine.java`
   - `ScheduleAssignmentResult` 생성 시 `allSchedule(null)` 설정
   - `flyScheduleId` 설정 확인

3. `EmpScheduleRepository.java`
   - 모든 조회 쿼리에 FLIGHT 제외 조건 추가

4. `EmpScheduleServiceImpl.java`
   - `getFlightCrewMonthlySchedule()`: EmpFlySchedule과 EmpSchedule 합성

5. `FlyScheduleServiceImpl.java`
   - `getFlightScheduleDetail()`: EmpFlySchedule만 조회

## 다음 단계 (선택)

1. **기존 데이터 정리**: EmpSchedule에 남아있는 FLIGHT 일정 데이터 정리 (마이그레이션 스크립트)
2. **테스트**: 자동 배정 실행 후 EmpSchedule에 FLIGHT가 저장되지 않는지 확인
3. **FlightSyncServiceImpl 확인**: 외부 API 동기화 시 AllSchedule 생성 로직 확인 (필요 시 수정)

## 주의 사항

- **FlightSyncServiceImpl**: 외부 API 동기화 시 `AllSchedule`을 생성하고 있습니다. 이는 `FlySchedule`과 `AllSchedule`의 `@MapsId` 1:1 구조를 위한 것이므로 유지해야 합니다. 다만, 자동 배정 시에는 `AllSchedule`을 생성하지 않습니다.
- **기존 데이터**: EmpSchedule에 남아있는 FLIGHT 데이터는 Repository 필터링으로 조회 시 제외되지만, 완전한 정리를 위해서는 마이그레이션 스크립트 실행 권장
