# 월별 직원 스케줄 자동 배정 엔진 설계 문서

## 1. 전체 아키텍처 설계

### 1.1 시스템 개요
월별 직원 스케줄 자동 배정 시스템은 Greedy 알고리즘과 Constraint Validation을 결합하여 최적의 스케줄을 생성합니다.

### 1.2 아키텍처 구조

```
MonthlyScheduleOrchestrator (오케스트레이터)
    ├── FlightAssignmentEngine (비행 일정 배정)
    ├── ShiftAssignmentEngine (교대 근무 배정)
    ├── StandbyAssignmentEngine (대기/휴무 배정)
    └── ValidationEngine (제약 조건 검증)
```

### 1.3 데이터 흐름

```
1. 입력: YearMonth, airlineId
2. 데이터 로드: 직원 정보, 비행 일정, 기존 스케줄
3. EmployeeState 초기화 (인메모리 상태 관리)
4. 엔진별 배정 실행 (순차적)
5. ValidationEngine 검증
6. 결과 집계 및 저장
```

---

## 2. 각 엔진의 핵심 알고리즘

### 2.1 MonthlyScheduleOrchestrator

**역할**: 전체 배정 프로세스 조율

**알고리즘 의사코드**:
```
FUNCTION generateMonthlySchedules(yearMonth, airlineId):
    1. 기존 일정 삭제 (해당 월)
    2. 직원 상태 로드 (EmployeeState Map 생성)
    3. 비행 일정 로드 (fly_schedule)
    
    4. FlightAssignmentEngine 실행
       - PILOT, CABIN_CREW 대상
       - 월 7~9회 비행 제한
       
    5. ShiftAssignmentEngine 실행
       - GROUND_STAFF, MAINTENANCE 대상
       - 주 4~5일 근무, 3교대 시스템
       
    6. StandbyAssignmentEngine 실행
       - 미배정 날짜 채우기
       - STANDBY/OFF 균형 배정
       
    7. ValidationEngine 실행
       - 모든 제약 조건 검증
       - violations 수집
       
    8. 결과 저장 (batch insert)
       - emp_schedule
       - emp_fly_schedule
       
    9. 결과 반환 (ScheduleAssignmentResult)
```

**시간복잡도**: O(E * D * F)
- E: 직원 수
- D: 월의 일수 (약 30일)
- F: 비행 일정 수

---

### 2.2 FlightAssignmentEngine

**역할**: 비행 승무원 배정 (PILOT, CABIN_CREW)

**알고리즘 의사코드**:
```
FUNCTION assignFlights(yearMonth, employeeStates, airlineId):
    1. 비행 일정 정렬 (시간 순)
    2. 직원 필터링 (PILOT, CABIN_CREW)
    3. 각 비행에 대해:
       a. PILOT 2명 배정
       b. CABIN_CREW (crew_count - 2)명 배정
       c. 후보자 필터링:
          - 시간 겹침 없음
          - 최소 휴식 시간 (12시간)
          - 월간 비행 횟수 < 9
          - 연속 비행 < 3일
       d. 점수 계산 (healthScore - penalties + fairnessBonus)
       e. PriorityQueue로 최적 후보 선택
       f. 배정 및 EmployeeState 업데이트
    
    4. 반환: List<ScheduleAssignmentResult>
```

**핵심 제약 조건**:
- 월간 비행 횟수: 7~9회
- 연속 비행: 최대 3일
- 최소 휴식: 12시간
- 시간 겹침 금지

**시간복잡도**: O(F * E * log E)
- F: 비행 일정 수
- E: 직원 수
- log E: PriorityQueue 연산

---

### 2.3 ShiftAssignmentEngine

**역할**: 교대 근무 배정 (GROUND_STAFF, MAINTENANCE)

**알고리즘 의사코드**:
```
FUNCTION assignShifts(yearMonth, employeeStates, airlineId):
    1. 직원 필터링 (GROUND_STAFF, MAINTENANCE)
    2. 주 단위로 처리 (월~일):
       FOR EACH week:
         a. 주간 근무일수 결정 (4~5일 랜덤)
         b. 근무일 랜덤 선택
         c. 각 근무일에 교대 배정:
            - PART1 (06:00-14:00)
            - PART2 (14:00-22:00)
            - PART3 (22:00-06:00)
            - OFF (휴무)
         d. 교대 균등 분배 (각 교대 횟수 차이 최소화)
         e. 연속 야간 근무 < 2일
         f. 연속 근무 < 6일
    
    3. 미배정 날짜 처리 (OFF 배정)
    
    4. 반환: List<ScheduleAssignmentResult>
```

**핵심 제약 조건**:
- 주 4~5일 근무
- 교대 균등 분배
- 연속 야간 근무: 최대 2일
- 연속 근무: 최대 6일

**시간복잡도**: O(E * D)
- E: 직원 수
- D: 월의 일수

---

### 2.4 StandbyAssignmentEngine

**역할**: 대기/휴무 배정 (미배정 날짜 채우기)

**알고리즘 의사코드**:
```
FUNCTION assignStandbyAndOff(yearMonth, employeeStates, airlineId):
    1. 직원 필터링 (PILOT, CABIN_CREW)
    2. 각 날짜에 대해:
       FOR EACH date:
         a. 미배정 직원 필터링
         b. STANDBY 대상 선정:
            - healthScore 높은 순
            - 월간 STANDBY < 5회
            - 연속 STANDBY < 3일
            - 목표: 전체의 10~20%
         c. 나머지는 OFF 배정
    
    3. 반환: List<ScheduleAssignmentResult>
```

**핵심 제약 조건**:
- 모든 날짜에 상태 배정
- STANDBY: 전체의 10~20%
- 연속 STANDBY: 최대 3일
- 월간 STANDBY: 최대 5회

**시간복잡도**: O(E * D)
- E: 직원 수
- D: 월의 일수

---

### 2.5 ValidationEngine

**역할**: 모든 제약 조건 검증

**알고리즘 의사코드**:
```
FUNCTION validateAssignments(assignments, employeeStates):
    violations = []
    
    1. 시간 겹침 검증:
       FOR EACH employee:
         FOR EACH pair of assignments:
           IF 시간 겹침 THEN violations.add()
    
    2. 최소 휴식 시간 검증:
       FOR EACH employee:
         FOR EACH consecutive assignments:
           IF 휴식 < 12시간 THEN violations.add()
    
    3. 월간 비행 횟수 검증:
       FOR EACH PILOT/CABIN_CREW:
         IF 비행 횟수 < 7 OR > 9 THEN violations.add()
    
    4. 주간 근무일수 검증:
       FOR EACH GROUND_STAFF/MAINTENANCE:
         FOR EACH week:
           IF 근무일수 < 4 OR > 5 THEN violations.add()
    
    5. 연속 근무 제한 검증:
       FOR EACH employee:
         IF 연속 근무 > 6일 THEN violations.add()
         IF 연속 야간 > 2일 THEN violations.add()
         IF 연속 비행 > 3일 THEN violations.add()
    
    6. 반환: List<Violation>
```

**시간복잡도**: O(E * A²)
- E: 직원 수
- A: 배정 수 (직원당 평균)

---

## 3. EmployeeState 클래스 설계

### 3.1 필드 구조

```java
public class EmployeeState {
    // 기본 정보
    private String empId;
    private String empName;
    private Integer healthScore;
    private Long airlineId;
    private Role role;
    
    // 누적 통계
    private int monthlyFlightCount;      // 월간 비행 횟수
    private int totalOffDays;            // 월간 휴무일수
    private int totalStandbyCount;       // 월간 STANDBY 횟수
    private int totalWorkDays;           // 월간 근무일수 (지상직용)
    
    // 연속성 추적
    private int consecutiveWorkDays;     // 연속 근무일
    private int consecutiveNightShifts;  // 연속 야간 근무
    private int consecutiveFlights;      // 연속 비행
    private int consecutiveStandbyDays;  // 연속 STANDBY 일수
    
    // 시간 추적
    private LocalDateTime lastWorkEndTime;
    private LocalDateTime lastFlightEndTime;
    
    // 교대 근무 추적 (지상직용)
    private Map<String, Integer> shiftCountMap;  // 교대별 배정 횟수
    private String lastShiftType;                // 마지막 교대 타입
    private Map<LocalDate, String> weeklyWorkDays;  // 주별 근무일수
    
    // 배정 슬롯
    private List<ScheduledSlot> assignedSlots;
}
```

### 3.2 핵심 메서드

```java
// 시간 겹침 체크
boolean hasTimeConflict(LocalDateTime start, LocalDateTime end)

// 최소 휴식 시간 체크
boolean hasMinimumRest(LocalDateTime newStartTime)

// 월간 비행 횟수 체크
boolean canAssignFlight()

// 주간 근무일수 체크
boolean canAssignWork(LocalDate date)

// 배정 슬롯 추가
void addAssignedSlot(LocalDateTime start, LocalDateTime end, String scheduleCode)
```

---

## 4. 월간 배정 흐름도

```
[시작]
    ↓
[기존 일정 삭제]
    ↓
[직원 상태 로드]
    ↓
[비행 일정 로드]
    ↓
┌─────────────────────────┐
│ FlightAssignmentEngine  │
│ - PILOT/CABIN_CREW       │
│ - 월 7~9회 비행          │
└─────────────────────────┘
    ↓
┌─────────────────────────┐
│ ShiftAssignmentEngine    │
│ - GROUND_STAFF/          │
│   MAINTENANCE            │
│ - 주 4~5일 근무          │
│ - 3교대 시스템           │
└─────────────────────────┘
    ↓
┌─────────────────────────┐
│ StandbyAssignmentEngine  │
│ - 미배정 날짜 채우기     │
│ - STANDBY/OFF 배정       │
└─────────────────────────┘
    ↓
┌─────────────────────────┐
│ ValidationEngine         │
│ - 제약 조건 검증         │
│ - violations 수집         │
└─────────────────────────┘
    ↓
[결과 저장]
    ↓
[결과 반환]
    ↓
[종료]
```

---

## 5. 시간복잡도 분석

### 5.1 전체 시스템

**최악의 경우**: O(E * D * F + E * A²)
- E: 직원 수 (예: 100명)
- D: 월의 일수 (30일)
- F: 비행 일정 수 (예: 200건)
- A: 직원당 평균 배정 수 (30건)

**실제 계산**:
- FlightAssignmentEngine: O(F * E * log E) = O(200 * 100 * 7) ≈ 140,000
- ShiftAssignmentEngine: O(E * D) = O(100 * 30) = 3,000
- StandbyAssignmentEngine: O(E * D) = O(100 * 30) = 3,000
- ValidationEngine: O(E * A²) = O(100 * 900) = 90,000

**총합**: 약 236,000 연산 (1초 이내 처리 가능)

### 5.2 최적화 전략

1. **인메모리 캐싱**: EmployeeState로 DB 조회 최소화
2. **PriorityQueue**: 최적 후보 선택 O(log E)
3. **Batch Insert**: DB 저장 최적화
4. **조기 종료**: 제약 조건 위반 시 즉시 스킵

---

## 6. 확장 가능한 구조 설계 이유

### 6.1 엔진 분리

**이유**:
- 단일 책임 원칙 (SRP)
- 각 엔진 독립 테스트 가능
- 새로운 배정 규칙 추가 용이

**예시**: 새로운 엔진 추가 시
```java
@Component
public class SpecialAssignmentEngine implements AssignmentEngine {
    // 특수 배정 로직
}
```

### 6.2 EmployeeState 인메모리 관리

**이유**:
- DB 조회 최소화 (성능 향상)
- 상태 추적 용이
- 확장 가능한 필드 구조

### 6.3 ValidationEngine 분리

**이유**:
- 배정 후 일괄 검증
- 새로운 제약 조건 추가 용이
- violations 추적 및 리포팅

### 6.4 인터페이스 기반 설계

**이유**:
- 다형성 활용
- 엔진 교체 용이
- 테스트 모킹 용이

---

## 7. 데이터베이스 스키마

### 7.1 emp_schedule
- emp_schedule_id (PK)
- emp_id (FK)
- schedule_id (FK)
- schedule_code (FLIGHT, STANDBY, OFF, SHIFT_D, SHIFT_E, SHIFT_N)

### 7.2 emp_fly_schedule
- emp_fly_schedule_id (PK)
- emp_id (FK)
- fly_schedule_id (FK)

### 7.3 all_schedule
- schedule_id (PK)
- schedule_code
- start_date
- end_date

---

## 8. 예외 처리 및 에러 핸들링

### 8.1 제약 조건 위반
- ValidationEngine에서 violations 수집
- 경고 로그 출력
- 배정은 진행하되 결과에 violations 포함

### 8.2 데이터 부족
- 비행 일정 부족: 경고 후 가능한 만큼만 배정
- 직원 부족: 경고 후 최소 인원만 배정

### 8.3 트랜잭션 관리
- 배정 실패 시 롤백
- 부분 실패 허용 (noRollbackFor 설정)

---

## 9. 성능 최적화

### 9.1 인메모리 처리
- 모든 배정을 메모리에서 계산
- 최종 결과만 DB에 저장

### 9.2 Batch Insert
- saveAll() 사용
- 트랜잭션 분리 (REQUIRES_NEW)

### 9.3 쿼리 최적화
- JOIN FETCH로 N+1 문제 방지
- 인덱스 활용 (emp_id, schedule_id)

---

## 10. 테스트 전략

### 10.1 단위 테스트
- 각 엔진별 독립 테스트
- EmployeeState 메서드 테스트
- ValidationEngine 테스트

### 10.2 통합 테스트
- 전체 배정 프로세스 테스트
- 제약 조건 검증 테스트
- 성능 테스트

---

## 11. 향후 확장 계획

### 11.1 추가 가능한 기능
- 직원 선호도 반영
- 팀 배정 (같은 팀원끼리 배정)
- 지역별 배정 (공항별)
- 실시간 재배정

### 11.2 알고리즘 개선
- Genetic Algorithm
- Simulated Annealing
- Machine Learning 기반 예측
