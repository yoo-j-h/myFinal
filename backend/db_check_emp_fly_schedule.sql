-- ========================================
-- emp_fly_schedule 테이블 데이터 확인 SQL
-- ========================================

-- 1. 전체 emp_fly_schedule 데이터 개수 확인
SELECT COUNT(*) AS total_count FROM emp_fly_schedule;

-- 2. 특정 fly_schedule_id로 배정된 직원 확인
-- 예: flyScheduleId = 593
SELECT 
    efs.emp_fly_schedule_id,
    efs.fly_schedule_id,
    efs.emp_id,
    e.emp_name,
    e.role,
    e.job,
    e.department_id,
    d.department_name
FROM emp_fly_schedule efs
LEFT JOIN emp e ON efs.emp_id = e.emp_id
LEFT JOIN department d ON e.department_id = d.department_id
WHERE efs.fly_schedule_id = 593;

-- 3. 최근 생성된 emp_fly_schedule 데이터 확인 (최근 1시간)
SELECT 
    efs.emp_fly_schedule_id,
    efs.fly_schedule_id,
    efs.emp_id,
    e.emp_name,
    e.role,
    fs.flight_number,
    fs.fly_start_time,
    efs.created_date
FROM emp_fly_schedule efs
LEFT JOIN emp e ON efs.emp_id = e.emp_id
LEFT JOIN fly_schedule fs ON efs.fly_schedule_id = fs.fly_schedule_id
WHERE efs.created_date >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
ORDER BY efs.created_date DESC
LIMIT 50;

-- 4. fly_schedule별 배정된 직원 수 확인
SELECT 
    fs.fly_schedule_id,
    fs.flight_number,
    fs.fly_start_time,
    COUNT(efs.emp_fly_schedule_id) AS assigned_crew_count
FROM fly_schedule fs
LEFT JOIN emp_fly_schedule efs ON fs.fly_schedule_id = efs.fly_schedule_id
GROUP BY fs.fly_schedule_id, fs.flight_number, fs.fly_start_time
HAVING COUNT(efs.emp_fly_schedule_id) = 0
ORDER BY fs.fly_start_time DESC
LIMIT 20;

-- 5. 일정 배정 후 emp_fly_schedule 저장 여부 확인
-- (최근 일정 배정 실행 후 확인)
SELECT 
    fs.fly_schedule_id,
    fs.flight_number,
    fs.fly_start_time,
    COUNT(efs.emp_fly_schedule_id) AS emp_fly_schedule_count,
    COUNT(es.emp_schedule_id) AS emp_schedule_count
FROM fly_schedule fs
LEFT JOIN emp_fly_schedule efs ON fs.fly_schedule_id = fs.fly_schedule_id
LEFT JOIN all_schedule a ON fs.fly_schedule_id = a.schedule_id
LEFT JOIN emp_schedule es ON a.schedule_id = es.schedule_id AND (es.schedule_code = 'FLIGHT' OR a.schedule_code = 'FLIGHT')
WHERE fs.fly_start_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY fs.fly_schedule_id, fs.flight_number, fs.fly_start_time
ORDER BY fs.fly_start_time DESC
LIMIT 20;
