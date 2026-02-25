-- ========================================
-- 기존 승인된 신청에 대해 Airline 엔티티 생성
-- ========================================
-- 작성일: 2026-01-30
-- 목적: 백엔드 수정 전에 승인된 신청에 대해 Airline 레코드 생성
-- ========================================

USE ct_db;

-- 1. 승인되었지만 Airline이 없는 airline_apply 조회
SELECT 
    aa.airline_apply_id,
    aa.airline_name,
    aa.airline_apply_email,
    aa.manager_phone
FROM airline_apply aa
LEFT JOIN airline a ON a.airline_apply_id = aa.airline_apply_id
WHERE aa.airline_apply_status = 'APPROVED'
  AND a.airline_id IS NULL;

-- 2. 승인된 신청에 대해 Airline 레코드 생성
-- airline_apply_id = 5 (에어부산) 예시
INSERT INTO airline (
    airline_name,
    email,
    phone,
    plan,
    status,
    icon,
    country,
    join_date,
    storage_usage,
    last_login_date,
    airline_apply_id,
    create_date,
    update_date
)
SELECT 
    aa.airline_name,
    aa.airline_apply_email,
    aa.manager_phone,
    'Professional' as plan,
    'ACTIVE' as status,
    '✈️' as icon,
    '대한민국' as country,
    CURDATE() as join_date,
    0.0 as storage_usage,
    NOW() as last_login_date,
    aa.airline_apply_id,
    NOW() as create_date,
    NOW() as update_date
FROM airline_apply aa
LEFT JOIN airline a ON a.airline_apply_id = aa.airline_apply_id
WHERE aa.airline_apply_status = 'APPROVED'
  AND a.airline_id IS NULL;

-- 3. 생성된 Airline 확인
SELECT 
    a.airline_id,
    a.airline_name,
    a.email,
    a.airline_apply_id,
    aa.airline_name as apply_airline_name
FROM airline a
JOIN airline_apply aa ON a.airline_apply_id = aa.airline_apply_id
WHERE aa.airline_apply_status = 'APPROVED';

-- ========================================
-- 결과 확인
-- ========================================
-- airline_apply_id = 5에 대한 airline_id가 생성되었는지 확인
SELECT airline_id FROM airline WHERE airline_apply_id = 5;

