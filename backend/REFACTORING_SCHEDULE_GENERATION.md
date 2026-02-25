# 자동 배정 로직 리팩토링 완료

## 목표
- **FLIGHT 일정은 EmpFlySchedule에만 저장** (Single Source of Truth)
- **EmpSchedule에서 FLIGHT 저장 로직 제거**
- **기타 일정(STANDBY/OFF/SHIFT)은 기존대로 AllSchedule + EmpSchedule 저장**

## 주요 변경 사항

### 1. ScheduleGenerationService.saveSchedulesBatch()

**변경 전**:
- 모든 일정을 EmpSchedule에 저장
- FLIGHT 일정도 EmpSchedule에 저장 후 EmpFlySchedule 생성

**변경 후**:
- FLIGHT 일정과 기타 일정을 먼저 분리
- FLIGHT 일정: EmpFlySchedule에만 저장 (AllSchedule/EmpSchedule 제거)
- 기타 일정: AllSchedule + EmpSchedule 저장

**주요 로직**:
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
    // AllSchedule 저장 로직
}

// 3. 기타 일정만 EmpSchedule 저장
for (ScheduleAssignmentResult result : otherResults) {
    // EmpSchedule 저장 로직
}

// 4. FLIGHT 일정은 EmpFlySchedule에만 저장
for (ScheduleAssignmentResult result : flightResults) {
    // EmpFlySchedule 저장 로직 (AllSchedule/EmpSchedule 불필요)
}
```

### 2. ScheduleGenerationService.deleteExistingSchedules()

**변경 사항**:
- EmpSchedule 삭제: 기타 일정만 삭제 (FLIGHT는 이미 제외됨)
- EmpFlySchedule 삭제: 해당 월의 FlySchedule에 대한 EmpFlySchedule 삭제 추가

**주요 로직**:
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

## 데이터 흐름

### 이전 구조 (중복 저장)
```
FLIGHT 일정:
1. AllSchedule 생성 (scheduleCode="FLIGHT")
2. EmpSchedule 저장 (AllSchedule 참조)
3. EmpFlySchedule 저장 (FlySchedule 참조)
→ EmpSchedule과 EmpFlySchedule에 중복 저장
```

### 리팩토링 후 구조 (Single Source of Truth)
```
FLIGHT 일정:
1. EmpFlySchedule에만 저장 (FlySchedule 직접 참조)
→ AllSchedule/EmpSchedule 생성/저장 제거

기타 일정 (STANDBY/OFF/SHIFT):
1. AllSchedule 생성
2. EmpSchedule 저장 (AllSchedule 참조)
→ 기존 구조 유지
```

## 검증 포인트

### ✅ 저장 로직
- FLIGHT 일정은 EmpFlySchedule에만 저장
- 기타 일정은 AllSchedule + EmpSchedule 저장
- AllSchedule 생성 시 FLIGHT 제외

### ✅ 삭제 로직
- EmpSchedule 삭제 시 FLIGHT 자동 제외 (Repository 필터링)
- EmpFlySchedule 삭제 추가 (해당 월의 FlySchedule 기준)

### ✅ 조회 로직
- 항공편 상세: EmpFlySchedule 조회 (이미 구현됨)
- 직원 개인 스케줄: EmpSchedule(일반) + EmpFlySchedule(항공편) 합성 (이미 구현됨)

## 다음 단계 (선택)

1. **기존 데이터 정리**: EmpSchedule에 남아있는 FLIGHT 일정 데이터 정리 (마이그레이션 스크립트)
2. **FlightAssignmentEngine 확인**: AllSchedule 생성 로직 제거 확인 (필요 시)
3. **테스트**: 자동 배정 실행 후 EmpSchedule에 FLIGHT가 저장되지 않는지 확인

## 주의 사항

- **AllSchedule 생성**: FLIGHT 일정은 AllSchedule을 생성하지 않으므로, `FlightAssignmentEngine`에서 AllSchedule 생성 로직이 있다면 제거 필요
- **기존 데이터**: EmpSchedule에 남아있는 FLIGHT 데이터는 Repository 필터링으로 조회 시 제외되지만, 완전한 정리를 위해서는 마이그레이션 스크립트 실행 권장
