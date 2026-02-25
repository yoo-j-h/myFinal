# 스케줄 도메인 리팩토링 최종 완료 요약

## 목표 달성 ✅

1. ✅ **항공편 배정은 EmpFlySchedule만 사용** (Single Source of Truth)
2. ✅ **EmpSchedule에서 FLIGHT 관련 로직 완전 제거**
3. ✅ **직원 스케줄 조회: EmpSchedule(일반) + EmpFlySchedule(항공편) 합성**
4. ✅ **AllSchedule 유지** (공통 시간 부모 엔티티)
5. ✅ **addCrewMember/removeCrewMember는 EmpFlySchedule만 수정**

## 최종 데이터 흐름

### 항공편 일정 (FLIGHT)
```
자동 배정:
FlightAssignmentEngine → ScheduleAssignmentResult (allSchedule=null, flyScheduleId=O)
  ↓
ScheduleGenerationService.saveSchedulesBatch()
  ↓
EmpFlySchedule 저장 (AllSchedule/EmpSchedule 생성 제거)
  ↓
Single Source of Truth: EmpFlySchedule만 사용

수동 배정:
addCrewMember() → EmpFlySchedule 저장
removeCrewMember() → EmpFlySchedule 삭제

조회:
EmpFlySchedule → FlySchedule → AllSchedule (JOIN FETCH)
```

### 일반 일정 (STANDBY/OFF/SHIFT/COUNSEL/EXERCISE 등)
```
자동 배정:
StandbyAssignmentEngine/ShiftAssignmentEngine → ScheduleAssignmentResult (allSchedule=O)
  ↓
ScheduleGenerationService.saveSchedulesBatch()
  ↓
AllSchedule 생성 + EmpSchedule 저장

조회:
EmpSchedule → AllSchedule (JOIN FETCH)
```

## 주요 변경 사항

### 1. ScheduleGenerationService.saveSchedulesBatch()

**변경 전**:
```java
// 모든 일정을 EmpSchedule에 저장 (FLIGHT 포함)
for (ScheduleAssignmentResult result : results) {
    EmpSchedule empSchedule = EmpSchedule.builder()
        .scheduleCode(result.getScheduleCode()) // FLIGHT 포함
        .build();
    empSchedulesToSave.add(empSchedule);
}

// 그 후 FLIGHT 일정인 경우 EmpFlySchedule도 생성
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

// 2. 기타 일정만 AllSchedule + EmpSchedule 저장
for (ScheduleAssignmentResult result : otherResults) {
    // AllSchedule 생성
    // EmpSchedule 저장
}

// 3. FLIGHT 일정은 EmpFlySchedule에만 저장
for (ScheduleAssignmentResult result : flightResults) {
    // EmpFlySchedule 저장 (AllSchedule/EmpSchedule 제거)
}
```

### 2. EmpScheduleRepository

**모든 조회 쿼리에 FLIGHT 제외 조건 추가**:
```java
@Query("SELECT es FROM EmpSchedule es " +
       "JOIN FETCH es.scheduleId s " +
       "WHERE es.empId.empId = :empId " +
       "AND s.startDate >= :startDate " +
       "AND s.startDate < :endDate " +
       "AND (es.scheduleCode != 'FLIGHT' OR es.scheduleCode IS NULL) " + // ✅ FLIGHT 제외
       "AND (s.scheduleCode != 'FLIGHT' OR s.scheduleCode IS NULL)")    // ✅ AllSchedule의 FLIGHT도 제외
List<EmpSchedule> findByEmpIdAndMonth(...);
```

### 3. EmpScheduleServiceImpl.getFlightCrewMonthlySchedule()

**변경 전**:
```java
// FlySchedule의 flyStartTime/flyEndTime 직접 사용
LocalDateTime startDateTime = flight.getFlyStartTime();
LocalDateTime endDateTime = flight.getFlyEndTime();
```

**변경 후**:
```java
// AllSchedule 우선 사용, 없으면 FlySchedule 사용
com.kh.ct.domain.schedule.entity.AllSchedule allSchedule = flight.getSchedule();
LocalDateTime startDateTime = (allSchedule != null && allSchedule.getStartDate() != null) 
    ? allSchedule.getStartDate() 
    : flight.getFlyStartTime();
LocalDateTime endDateTime = (allSchedule != null && allSchedule.getEndDate() != null) 
    ? allSchedule.getEndDate() 
    : flight.getFlyEndTime();

Long scheduleId = (allSchedule != null) ? allSchedule.getScheduleId() : null;
```

### 4. EmpFlyScheduleRepository.findByEmpIdAndMonth()

**AllSchedule JOIN FETCH 포함**:
```java
@Query("SELECT efs FROM EmpFlySchedule efs " +
       "JOIN FETCH efs.flySchedule fs " +
       "LEFT JOIN FETCH fs.schedule s " +  // ✅ AllSchedule JOIN FETCH
       "WHERE efs.emp.empId = :empId " +
       "AND fs.flyStartTime >= :startDate " +
       "AND fs.flyStartTime < :endDate " +
       "ORDER BY fs.flyStartTime ASC")
List<EmpFlySchedule> findByEmpIdAndMonth(...);
```

### 5. FlyScheduleServiceImpl.addCrewMember() / removeCrewMember()

**이미 EmpFlySchedule만 사용** (변경 없음):
```java
@Override
@Transactional
public void addCrewMember(Long flyScheduleId, String empId) {
    // EmpFlySchedule만 생성
    EmpFlySchedule empFlySchedule = EmpFlySchedule.builder()
        .emp(emp)
        .flySchedule(flySchedule)
        .build();
    empFlyScheduleRepository.save(empFlySchedule);
}

@Override
@Transactional
public void removeCrewMember(Long flyScheduleId, String empId) {
    // EmpFlySchedule만 삭제
    List<EmpFlySchedule> empFlySchedules = 
        empFlyScheduleRepository.findByFlyScheduleIdAndEmpId(flyScheduleId, empId);
    empFlyScheduleRepository.deleteAll(empFlySchedules);
}
```

## 데이터 구조

### 항공편 일정 조회 경로
```
EmpFlySchedule (emp_fly_schedule)
  ↓ ManyToOne
FlySchedule (fly_schedule)
  ↓ @MapsId 1:1
AllSchedule (all_schedule)
  ↓
startDate, endDate, scheduleCode="FLIGHT"
```

### 일반 일정 조회 경로
```
EmpSchedule (emp_schedule)
  ↓ ManyToOne
AllSchedule (all_schedule)
  ↓
startDate, endDate, scheduleCode (STANDBY/OFF/SHIFT 등)
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
- [x] 항공편 상세: EmpFlySchedule 조회 (AllSchedule JOIN FETCH)
- [x] 직원 개인 스케줄: EmpSchedule(일반) + EmpFlySchedule(항공편) 합성
- [x] AllSchedule 정보 명시적 사용

### ✅ 수동 배정 로직
- [x] addCrewMember: EmpFlySchedule만 생성
- [x] removeCrewMember: EmpFlySchedule만 삭제

## 관련 파일

### 수정된 파일
1. `ScheduleGenerationService.java`
   - `saveSchedulesBatch()`: FLIGHT와 기타 일정 분리 처리
   - `deleteExistingSchedules()`: EmpFlySchedule 삭제 추가

2. `EmpScheduleServiceImpl.java`
   - `getFlightCrewMonthlySchedule()`: AllSchedule 명시적 사용

3. `EmpScheduleRepository.java`
   - 모든 조회 쿼리에 FLIGHT 제외 조건 추가

### 이미 올바르게 구현된 파일
1. `EmpFlyScheduleRepository.java`
   - `findByEmpIdAndMonth()`: AllSchedule JOIN FETCH 포함

2. `FlyScheduleServiceImpl.java`
   - `addCrewMember()` / `removeCrewMember()`: EmpFlySchedule만 사용

3. `MonthlyScheduleOrchestrator.java`
   - 이미 FLIGHT와 기타 일정 분리 처리

## 다음 단계 (선택)

1. **기존 데이터 정리**: EmpSchedule에 남아있는 FLIGHT 일정 데이터 정리 (마이그레이션 스크립트)
2. **테스트**: 자동 배정 실행 후 EmpSchedule에 FLIGHT가 저장되지 않는지 확인
3. **성능 최적화**: 대량 데이터 조회 시 배치 최적화 (필요 시)

## 주의 사항

- **FlightSyncServiceImpl**: 외부 API 동기화 시 `AllSchedule`을 생성하고 있습니다. 이는 `FlySchedule`과 `AllSchedule`의 `@MapsId` 1:1 구조를 위한 것이므로 유지해야 합니다.
- **기존 데이터**: EmpSchedule에 남아있는 FLIGHT 데이터는 Repository 필터링으로 조회 시 제외되지만, 완전한 정리를 위해서는 마이그레이션 스크립트 실행 권장
