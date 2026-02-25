# EmpFlySchedule Single Source of Truth 리팩토링 완료

## 목표
- **EmpFlySchedule을 FLIGHT 일정의 Single Source of Truth로 사용**
- **EmpSchedule에서 FLIGHT 관련 로직 제거**
- **직원 개인 스케줄 조회 시 EmpSchedule(일반 일정) + EmpFlySchedule(항공편) 합성**

## 주요 변경 사항

### 1. EmpFlyScheduleRepository
**파일**: `backend/src/main/java/com/kh/ct/domain/schedule/repository/EmpFlyScheduleRepository.java`

**추가된 메서드**:
```java
// ✅ 직원 ID로 월별 비행편 조회 (캘린더용) - Single Source of Truth
@Query("SELECT efs FROM EmpFlySchedule efs " +
       "JOIN FETCH efs.flySchedule fs " +
       "LEFT JOIN FETCH fs.schedule s " +
       "WHERE efs.emp.empId = :empId " +
       "AND fs.flyStartTime >= :startDate " +
       "AND fs.flyStartTime < :endDate " +
       "ORDER BY fs.flyStartTime ASC")
List<EmpFlySchedule> findByEmpIdAndMonth(
        @Param("empId") String empId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
);
```

### 2. EmpScheduleRepository
**파일**: `backend/src/main/java/com/kh/ct/domain/schedule/repository/EmpScheduleRepository.java`

**변경 사항**:
- `findByFlyScheduleId()` 메서드 제거 (주석 처리)
- `findByEmpIdAndMonth()`: FLIGHT 일정 제외 조건 추가
- `findByAirlineIdAndRole()`: FLIGHT 일정 제외 조건 추가
- `findByRole()`: FLIGHT 일정 제외 조건 추가

**추가된 필터링 조건**:
```java
AND (es.scheduleCode != 'FLIGHT' OR es.scheduleCode IS NULL) // ✅ FLIGHT 제외
AND (s.scheduleCode != 'FLIGHT' OR s.scheduleCode IS NULL) // ✅ AllSchedule의 FLIGHT도 제외
```

### 3. EmpScheduleServiceImpl
**파일**: `backend/src/main/java/com/kh/ct/domain/schedule/service/EmpScheduleServiceImpl.java`

**변경 사항**:
- `getFlightCrewMonthlySchedule()`: `EmpFlyScheduleRepository.findByEmpIdAndMonth()` 사용
- EmpSchedule 조회 시 FLIGHT 자동 제외 (Repository 레벨에서 처리)
- 로그 개선: EmpFlySchedule 조회 건수, FLIGHT 일정 변환 건수 등

**주요 로직**:
```java
// 1. 비행 일정 조회 (emp_fly_schedule) - Single Source of Truth
List<EmpFlySchedule> empFlySchedules = 
    empFlyScheduleRepository.findByEmpIdAndMonth(empId, startDate, endDate);

// 2. 일일 상태 조회 (emp_schedule) - FLIGHT 제외 (Repository에서 이미 제외됨)
List<EmpSchedule> empSchedules = empScheduleRepository.findByEmpIdAndMonth(empId, startDate, endDate);

// 3. 날짜별로 병합 (FLIGHT 우선)
```

### 4. FlyScheduleServiceImpl
**파일**: `backend/src/main/java/com/kh/ct/domain/schedule/service/FlyScheduleServiceImpl.java`

**변경 사항**:
- `getFlightScheduleDetail()`: EmpSchedule 조회 로직 제거
- `crewMembers` 생성 시 EmpFlySchedule만 사용
- 일반 직원 권한 체크 시 EmpFlySchedule만 확인

**제거된 로직**:
- `empScheduleRepository.findByFlyScheduleId()` 호출 제거
- EmpSchedule에서 FLIGHT 필터링 로직 제거
- EmpSchedule과 EmpFlySchedule 병합 로직 제거

## 데이터 흐름

### 이전 구조 (중복 관리)
```
FLIGHT 일정:
- EmpFlySchedule (수동 배정)
- EmpSchedule (자동 배정 시스템)
→ 데이터 불일치 및 동기화 문제 발생
```

### 리팩토링 후 구조 (Single Source of Truth)
```
FLIGHT 일정:
- EmpFlySchedule만 사용 (수동 배정 + 자동 배정 모두)
→ Single Source of Truth로 데이터 일관성 보장

일반 일정 (STANDBY, OFF, SHIFT_D, SHIFT_E, SHIFT_N 등):
- EmpSchedule만 사용
→ FLIGHT와 분리되어 명확한 책임 분리
```

## 직원 개인 스케줄 조회 흐름

### 운항직 (PILOT, CABIN_CREW)
1. **EmpFlySchedule 조회**: 해당 월의 FLIGHT 일정
2. **EmpSchedule 조회**: 해당 월의 STANDBY/OFF 일정 (FLIGHT 자동 제외)
3. **병합**: 날짜별로 병합 (FLIGHT 우선)

### 지상직 (GROUND_STAFF, MAINTENANCE)
1. **EmpSchedule 조회**: 해당 월의 SHIFT_D/SHIFT_E/SHIFT_N/OFF 일정 (FLIGHT 자동 제외)

## 검증 포인트

### ✅ Repository 레벨
- `EmpScheduleRepository`의 모든 쿼리에 FLIGHT 제외 조건 추가
- `EmpFlyScheduleRepository`에 월별 조회 메서드 추가

### ✅ Service 레벨
- `EmpScheduleServiceImpl`: EmpFlySchedule과 EmpSchedule 합성 로직
- `FlyScheduleServiceImpl`: EmpFlySchedule만 사용

### ✅ 트랜잭션 및 권한
- 기존 트랜잭션 구조 유지
- 권한 체크 로직 유지 (일반 직원은 본인 일정만 조회)

## 다음 단계 (선택 사항)

1. **기존 데이터 정리**: EmpSchedule에 남아있는 FLIGHT 일정 데이터 정리 (마이그레이션 스크립트)
2. **ScheduleGenerationService 수정**: EmpSchedule에 FLIGHT 저장하는 로직 제거 확인
3. **MonthlyScheduleOrchestrator 수정**: EmpSchedule에 FLIGHT 저장하는 로직 제거 확인

## 주의 사항

- **EmpSchedule에 FLIGHT 데이터가 남아있을 수 있음**: 기존 데이터는 Repository 필터링으로 제외되지만, 완전한 정리를 위해서는 마이그레이션 스크립트 실행 권장
- **addCrewMember / removeCrewMember**: 이미 EmpFlySchedule만 수정하도록 구현되어 있음 (변경 불필요)
