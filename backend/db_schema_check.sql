-- ========================================
-- DB 스키마 정합성 확인 SQL
-- ========================================

-- 1. fly_schedule 테이블 구조 확인
DESCRIBE fly_schedule;
-- 또는
SHOW CREATE TABLE fly_schedule;

-- 2. all_schedule 테이블 구조 확인
DESCRIBE all_schedule;
-- 또는
SHOW CREATE TABLE all_schedule;

-- 3. emp_fly_schedule 테이블 구조 확인
DESCRIBE emp_fly_schedule;
-- 또는
SHOW CREATE TABLE emp_fly_schedule;

-- ========================================
-- 특정 flyScheduleId로 데이터 확인
-- ========================================
-- 예: flyScheduleId = 593

-- 4. fly_schedule 테이블에서 해당 ID 존재 확인
SELECT * FROM fly_schedule WHERE fly_schedule_id = 593;

-- 5. all_schedule 테이블에서 매칭되는 schedule_id 확인
-- @MapsId 구조이므로 fly_schedule_id == schedule_id
SELECT * FROM all_schedule WHERE schedule_id = 593;

-- 6. fly_schedule과 all_schedule의 관계 확인
SELECT 
    fs.fly_schedule_id,
    fs.schedule_id AS fly_schedule_schedule_id,
    a.schedule_id AS all_schedule_schedule_id,
    a.schedule_code,
    fs.flight_number
FROM fly_schedule fs
LEFT JOIN all_schedule a ON fs.fly_schedule_id = a.schedule_id
WHERE fs.fly_schedule_id = 593;

-- 7. emp_fly_schedule 테이블에서 해당 fly_schedule_id로 배정된 직원 확인
SELECT 
    efs.emp_fly_schedule_id,
    efs.fly_schedule_id,
    efs.emp_id,
    e.emp_name,
    e.role,
    e.job
FROM emp_fly_schedule efs
LEFT JOIN emp e ON efs.emp_id = e.emp_id
WHERE efs.fly_schedule_id = 593;

-- 8. emp_schedule 테이블에서 해당 schedule_id로 배정된 직원 확인
-- (FLIGHT 일정인 경우)
SELECT 
    es.emp_schedule_id,
    es.emp_id,
    es.schedule_id,
    es.schedule_code,
    a.schedule_code AS all_schedule_code,
    e.emp_name,
    e.role
FROM emp_schedule es
LEFT JOIN all_schedule a ON es.schedule_id = a.schedule_id
LEFT JOIN emp e ON es.emp_id = e.emp_id
WHERE a.schedule_id = 593
  AND (a.schedule_code = 'FLIGHT' OR es.schedule_code = 'FLIGHT')
ORDER BY e.role, e.emp_name;

-- ========================================
-- 전체 통계 확인
-- ========================================

-- 9. FLIGHT 일정이 있는 fly_schedule 개수
SELECT COUNT(*) AS total_flight_schedules
FROM fly_schedule fs
JOIN all_schedule a ON fs.fly_schedule_id = a.schedule_id
WHERE a.schedule_code = 'FLIGHT';

-- 10. emp_fly_schedule에 배정된 직원이 있는 fly_schedule 개수
SELECT COUNT(DISTINCT efs.fly_schedule_id) AS assigned_flight_schedules
FROM emp_fly_schedule efs;

-- 11. emp_fly_schedule에 배정된 직원이 없는 fly_schedule 개수
SELECT COUNT(*) AS unassigned_flight_schedules
FROM fly_schedule fs
LEFT JOIN emp_fly_schedule efs ON fs.fly_schedule_id = efs.fly_schedule_id
WHERE efs.emp_fly_schedule_id IS NULL;

-- 12. 최근 일정 배정 후 emp_fly_schedule 저장 여부 확인
-- (최근 1시간 내 생성된 emp_schedule 중 FLIGHT 일정)
SELECT 
    es.emp_schedule_id,
    es.emp_id,
    es.schedule_id,
    a.schedule_code,
    e.emp_name,
    e.role,
    CASE 
        WHEN efs.emp_fly_schedule_id IS NOT NULL THEN '저장됨'
        ELSE '저장 안됨'
    END AS emp_fly_schedule_status
FROM emp_schedule es
JOIN all_schedule a ON es.schedule_id = a.schedule_id
JOIN emp e ON es.emp_id = e.emp_id
LEFT JOIN fly_schedule fs ON a.schedule_id = fs.fly_schedule_id
LEFT JOIN emp_fly_schedule efs ON fs.fly_schedule_id = efs.fly_schedule_id 
    AND efs.emp_id = es.emp_id
WHERE a.schedule_code = 'FLIGHT'
  AND es.created_date >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
ORDER BY es.created_date DESC
LIMIT 50;
