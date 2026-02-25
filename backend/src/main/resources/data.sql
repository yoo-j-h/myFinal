-- Airline Apply (ID: 1)
INSERT INTO airline_apply (airline_apply_id, airline_name, airline_apply_email, manager_name, manager_phone, airline_apply_status, email_domain_verified, create_date, update_date)
VALUES (1, 'Jin Air', 'admin@jinair.com', '박관리', '010-1234-5678', 'APPROVED', true, NOW(), NOW());

-- Airline (ID: 1)
INSERT INTO airline (airline_id, airline_name, theme, primary_color, secondary_color, main_number, airline_address, airline_desc, plan, status, country, email, phone, join_date, airline_apply_id, create_date, update_date)
VALUES (1, 'Jin Air', 'Theme-Green', '#9ACD32', '#6B8E23', '1600-6200', '서울 강서구 공항대로 212', '아시아 최고의 LCC 진에어입니다.', 'Enterprise', 'ACTIVE', 'Korea', 'contact@jinair.com', '1600-6200', '2020-01-01', 1, NOW(), NOW());

-- Codes (Job & Rank)
INSERT INTO code (code_id, code_name, airline_id, create_date, update_date) VALUES (1, '직급', 1, NOW(), NOW());
INSERT INTO code_detail (code_detail_id, code_id, code_detail_name, code_desc, create_date, update_date) VALUES 
(1, 1, '부장', 'Department Manager', NOW(), NOW()),
(2, 1, '차장', 'Deputy General Manager', NOW(), NOW()),
(3, 1, '과장', 'Manager', NOW(), NOW()),
(4, 1, '대리', 'Assistant Manager', NOW(), NOW()),
(5, 1, '사원', 'Staff', NOW(), NOW());

INSERT INTO code (code_id, code_name, airline_id, create_date, update_date) VALUES (2, '직책', 1, NOW(), NOW());
INSERT INTO code_detail (code_detail_id, code_id, code_detail_name, code_desc, create_date, update_date) VALUES 
(6, 2, '팀장', 'Team Leader', NOW(), NOW()),
(7, 2, '팀원', 'Team Member', NOW(), NOW());

-- File (Default Profile)
INSERT INTO file (file_id, file_name, file_ori_name, path, size, create_date, update_date) VALUES 
(1, 'default_profile.png', 'default_profile.png', '/images/default_profile.png', 1024, NOW(), NOW());


-- 1. Airports (Total 20)
INSERT INTO airport (airport_code, airport_name, country_name, timezone, city_name, create_date, update_date) VALUES 
('ICN', '인천국제공항', 'South Korea', 'Asia/Seoul', 'Seoul/Incheon', NOW(), NOW()),
('GMP', '김포국제공항', 'South Korea', 'Asia/Seoul', 'Seoul', NOW(), NOW()),
('CJU', '제주국제공항', 'South Korea', 'Asia/Seoul', 'Jeju', NOW(), NOW()),
('PUS', '김해국제공항', 'South Korea', 'Asia/Seoul', 'Busan', NOW(), NOW()),
('CJJ', '청주국제공항', 'South Korea', 'Asia/Seoul', 'Cheongju', NOW(), NOW()),
('TAE', '대구국제공항', 'South Korea', 'Asia/Seoul', 'Daegu', NOW(), NOW()),
('NRT', '나리타국제공항', 'Japan', 'Asia/Tokyo', 'Tokyo', NOW(), NOW()),
('HND', '하네다국제공항', 'Japan', 'Asia/Tokyo', 'Tokyo', NOW(), NOW()),
('KIX', '간사이국제공항', 'Japan', 'Asia/Tokyo', 'Osaka', NOW(), NOW()),
('FUK', '후쿠오카공항', 'Japan', 'Asia/Tokyo', 'Fukuoka', NOW(), NOW()),
('CTS', '신치토세공항', 'Japan', 'Asia/Tokyo', 'Sapporo', NOW(), NOW()),
('PVG', '푸동국제공항', 'China', 'Asia/Shanghai', 'Shanghai', NOW(), NOW()),
('PEK', '베이징서우두국제공항', 'China', 'Asia/Shanghai', 'Beijing', NOW(), NOW()),
('HKG', '홍콩국제공항', 'Hong Kong', 'Asia/Hong_Kong', 'Hong Kong', NOW(), NOW()),
('TPE', '타오위안국제공항', 'Taiwan', 'Asia/Taipei', 'Taipei', NOW(), NOW()),
('BKK', '수완나품국제공항', 'Thailand', 'Asia/Bangkok', 'Bangkok', NOW(), NOW()),
('DAD', '다낭국제공항', 'Vietnam', 'Asia/Ho_Chi_Minh', 'Da Nang', NOW(), NOW()),
('JFK', '존F케네디국제공항', 'USA', 'America/New_York', 'New York', NOW(), NOW()),
('LAX', '로스앤젤레스공항', 'USA', 'America/Los_Angeles', 'Los Angeles', NOW(), NOW()),
('LHR', '히드로국제공항', 'UK', 'Europe/London', 'London', NOW(), NOW());

-- 2. Departments
INSERT INTO department (department_id, department_name, emp_count, department_status, parent_department) VALUES (1, '본사', 10, 'Y', NULL);
INSERT INTO department (department_id, department_name, emp_count, department_status, parent_department) VALUES 
(2, '운항본부', 20, 'Y', 1),
(3, '객실본부', 30, 'Y', 1),
(4, '인사팀', 5, 'Y', 1),
(5, '정비팀', 10, 'Y', 1),
(6, '재무팀', 5, 'Y', 1),
(7, '마케팅팀', 5, 'Y', 1),
(8, 'IT지원팀', 5, 'Y', 1),
(9, '고객센터', 10, 'Y', 1),
(10, '안전보안실', 5, 'Y', 1);

-- 3. Employees (Total 30)
-- ==========================================
-- [Test Account Info]
-- Password for all accounts: 1234
-- IDs:
--   - Admin: admin
--   - HR: hr01 ~ hr05
--   - Pilot: pilot01 ~ pilot10
--   - Cabin Crew: crew01 ~ crew10
--   - Maintenance: mech01 ~ mech05
-- ==========================================
-- Admin
INSERT INTO emp (emp_id, emp_name, emp_pwd, age, role, phone, job, email, address, emp_status, start_date, emp_no, airline_id, department_id, profile_image, create_date, update_date) 
VALUES ('admin', '관리자', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcXBchcn2JoC', 40, 'SUPER_ADMIN', '010-0000-0000', '최고관리자', 'admin@jinair.com', '서울시', 'Y', '2020-01-01', '10001', 1, 1, 1, NOW(), NOW());

-- HR Team (5)
INSERT INTO emp (emp_id, emp_name, emp_pwd, age, role, phone, job, email, address, emp_status, start_date, emp_no, airline_id, department_id, create_date, update_date) VALUES 
('hr01', '김인사', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcXBchcn2JoC', 35, 'AIRLINE_ADMIN', '010-1111-0001', '인사팀장', 'hr01@jinair.com', '서울 마포구', 'Y', '2021-03-01', '20001', 1, 4, NOW(), NOW()),
('hr02', '이채용', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcXBchcn2JoC', 29, 'AIRLINE_ADMIN', '010-1111-0002', '인사담당', 'hr02@jinair.com', '서울 서대문구', 'Y', '2022-05-10', '20002', 1, 4, NOW(), NOW()),
('hr03', '박급여', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcXBchcn2JoC', 27, 'AIRLINE_ADMIN', '010-1111-0003', '급여담당', 'hr03@jinair.com', '경기 고양시', 'Y', '2023-01-02', '20003', 1, 4, NOW(), NOW()),
('hr04', '최교육', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcXBchcn2JoC', 31, 'AIRLINE_ADMIN', '010-1111-0004', '교육담당', 'hr04@jinair.com', '서울 은평구', 'Y', '2021-12-01', '20004', 1, 4, NOW(), NOW()),
('hr05', '정복지', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcXBchcn2JoC', 28, 'AIRLINE_ADMIN', '010-1111-0005', '복지담당', 'hr05@jinair.com', '서울 강남구', 'Y', '2022-08-15', '20005', 1, 4, NOW(), NOW());

-- Pilots (10)
INSERT INTO emp (emp_id, emp_name, emp_pwd, age, role, phone, job, email, address, emp_status, start_date, emp_no, airline_id, department_id, create_date, update_date) VALUES 
('pilot01', '최기장', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcXBchcn2JoC', 48, 'PILOT', '010-2222-0001', '기장', 'pilot01@jinair.com', '인천 송도', 'Y', '2015-05-20', '30001', 1, 2, NOW(), NOW()),
('pilot02', '강부기장', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcXBchcn2JoC', 34, 'PILOT', '010-2222-0002', '부기장', 'pilot02@jinair.com', '서울 강남구', 'Y', '2019-11-15', '30002', 1, 2, NOW(), NOW()),
('pilot03', '정수석', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcXBchcn2JoC', 52, 'PILOT', '010-2222-0003', '수석기장', 'pilot03@jinair.com', '서울 용산구', 'Y', '2010-02-10', '30003', 1, 2, NOW(), NOW()),
('pilot04', '한부기장', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcXBchcn2JoC', 31, 'PILOT', '010-2222-0004', '부기장', 'pilot04@jinair.com', '경기 성남시', 'Y', '2021-08-20', '30004', 1, 2, NOW(), NOW()),
('pilot05', '송부기장', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcXBchcn2JoC', 29, 'PILOT', '010-2222-0005', '부기장', 'pilot05@jinair.com', '서울 송파구', 'Y', '2023-04-01', '30005', 1, 2, NOW(), NOW()),
('pilot06', '오기장', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcXBchcn2JoC', 46, 'PILOT', '010-2222-0006', '기장', 'pilot06@jinair.com', '부산 해운대구', 'Y', '2016-01-10', '30006', 1, 2, NOW(), NOW()),
('pilot07', '윤부기장', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcXBchcn2JoC', 33, 'PILOT', '010-2222-0007', '부기장', 'pilot07@jinair.com', '서울 노원구', 'Y', '2020-07-22', '30007', 1, 2, NOW(), NOW()),
('pilot08', '구기장', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcXBchcn2JoC', 49, 'PILOT', '010-2222-0008', '기장', 'pilot08@jinair.com', '대전 유성구', 'Y', '2014-09-09', '30008', 1, 2, NOW(), NOW()),
('pilot09', '신부기장', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcXBchcn2JoC', 30, 'PILOT', '010-2222-0009', '부기장', 'pilot09@jinair.com', '광주 서구', 'Y', '2022-03-15', '30009', 1, 2, NOW(), NOW()),
('pilot10', '백기장', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcXBchcn2JoC', 47, 'PILOT', '010-2222-0010', '기장', 'pilot10@jinair.com', '경기 수원시', 'Y', '2015-12-25', '30010', 1, 2, NOW(), NOW());

-- Cabin Crew (10)
INSERT INTO emp (emp_id, emp_name, emp_pwd, age, role, phone, job, email, address, emp_status, start_date, emp_no, airline_id, department_id, create_date, update_date) VALUES 
('crew01', '임사무장', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcXBchcn2JoC', 38, 'CABIN_CREW', '010-3333-0001', '사무장', 'crew01@jinair.com', '서울 강서구', 'Y', '2016-03-01', '40001', 1, 3, NOW(), NOW()),
('crew02', '김승무', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcXBchcn2JoC', 26, 'CABIN_CREW', '010-3333-0002', '승무원', 'crew02@jinair.com', '서울 마포구', 'Y', '2022-01-15', '40002', 1, 3, NOW(), NOW()),
('crew03', '박승무', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcXBchcn2JoC', 24, 'CABIN_CREW', '010-3333-0003', '승무원', 'crew03@jinair.com', '경기 부천시', 'Y', '2023-06-01', '40003', 1, 3, NOW(), NOW()),
('crew04', '이승무', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcXBchcn2JoC', 28, 'CABIN_CREW', '010-3333-0004', '승무원', 'crew04@jinair.com', '서울 영등포구', 'Y', '2021-09-10', '40004', 1, 3, NOW(), NOW()),
('crew05', '최승무', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcXBchcn2JoC', 25, 'CABIN_CREW', '010-3333-0005', '승무원', 'crew05@jinair.com', '서울 관악구', 'Y', '2022-12-01', '40005', 1, 3, NOW(), NOW()),
('crew06', '정승무', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcXBchcn2JoC', 27, 'CABIN_CREW', '010-3333-0006', '승무원', 'crew06@jinair.com', '경기 김포시', 'Y', '2020-05-05', '40006', 1, 3, NOW(), NOW()),
('crew07', '임승무', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcXBchcn2JoC', 23, 'CABIN_CREW', '010-3333-0007', '승무원', 'crew07@jinair.com', '서울 성북구', 'Y', '2023-11-11', '40007', 1, 3, NOW(), NOW()),
('crew08', '한승무', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcXBchcn2JoC', 26, 'CABIN_CREW', '010-3333-0008', '승무원', 'crew08@jinair.com', '경기 안양시', 'Y', '2021-04-04', '40008', 1, 3, NOW(), NOW()),
('crew09', '송승무', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcXBchcn2JoC', 29, 'CABIN_CREW', '010-3333-0009', '부사무장', 'crew09@jinair.com', '인천 부평구', 'Y', '2019-08-30', '40009', 1, 3, NOW(), NOW()),
('crew10', '장승무', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcXBchcn2JoC', 24, 'CABIN_CREW', '010-3333-0010', '승무원', 'crew10@jinair.com', '서울 구로구', 'Y', '2023-01-20', '40010', 1, 3, NOW(), NOW());

-- Maintenance (5)
INSERT INTO emp (emp_id, emp_name, emp_pwd, age, role, phone, job, email, address, emp_status, start_date, emp_no, airline_id, department_id, create_date, update_date) VALUES 
('mech01', '강정비', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcXBchcn2JoC', 45, 'MAINTENANCE', '010-4444-0001', '정비팀장', 'mech01@jinair.com', '인천 중구', 'Y', '2012-08-15', '50001', 1, 5, NOW(), NOW()),
('mech02', '조정비', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcXBchcn2JoC', 32, 'MAINTENANCE', '010-4444-0002', '정비사', 'mech02@jinair.com', '인천 서구', 'Y', '2018-03-20', '50002', 1, 5, NOW(), NOW()),
('mech03', '윤정비', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcXBchcn2JoC', 28, 'MAINTENANCE', '010-4444-0003', '정비사', 'mech03@jinair.com', '경기 시흥시', 'Y', '2021-11-01', '50003', 1, 5, NOW(), NOW()),
('mech04', '서정비', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcXBchcn2JoC', 35, 'MAINTENANCE', '010-4444-0004', '정비사', 'mech04@jinair.com', '서울 강서구', 'Y', '2017-06-12', '50004', 1, 5, NOW(), NOW()),
('mech05', '배정비', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcXBchcn2JoC', 27, 'MAINTENANCE', '010-4444-0005', '정비사', 'mech05@jinair.com', '경기 고양시', 'Y', '2022-09-09', '50005', 1, 5, NOW(), NOW());




-- 5. Attendance (30 Records)
INSERT INTO attendance (emp_id, attendance_date, in_time, out_time, attendance_status, create_date, update_date) VALUES 
('hr01', CURRENT_DATE - 1, '08:50:00', '18:05:00', 'PRESENT', NOW(), NOW()),
('hr02', CURRENT_DATE - 1, '08:45:00', '18:10:00', 'PRESENT', NOW(), NOW()),
('hr03', CURRENT_DATE - 1, '08:55:00', '18:00:00', 'PRESENT', NOW(), NOW()),
('pilot01', CURRENT_DATE - 1, '07:00:00', '16:00:00', 'PRESENT', NOW(), NOW()),
('pilot02', CURRENT_DATE - 1, '07:00:00', '16:00:00', 'PRESENT', NOW(), NOW()),
('crew01', CURRENT_DATE - 1, '07:10:00', '16:10:00', 'PRESENT', NOW(), NOW()),
('crew02', CURRENT_DATE - 1, NULL, NULL, 'VACATION', NOW(), NOW()),
('mech01', CURRENT_DATE - 1, '08:00:00', '17:00:00', 'PRESENT', NOW(), NOW()),
('mech02', CURRENT_DATE - 1, '08:05:00', '17:05:00', 'PRESENT', NOW(), NOW()),
('hr01', CURRENT_DATE - 2, '08:50:00', '18:05:00', 'PRESENT', NOW(), NOW()),
('hr02', CURRENT_DATE - 2, '09:10:00', '18:10:00', 'LATE', NOW(), NOW()),
('hr03', CURRENT_DATE - 2, '08:55:00', '18:00:00', 'PRESENT', NOW(), NOW()),
('pilot03', CURRENT_DATE - 2, '13:00:00', '22:00:00', 'PRESENT', NOW(), NOW()),
('pilot04', CURRENT_DATE - 2, '13:00:00', '22:00:00', 'PRESENT', NOW(), NOW()),
('crew03', CURRENT_DATE - 2, '13:10:00', '22:10:00', 'PRESENT', NOW(), NOW()),
('crew04', CURRENT_DATE - 2, NULL, NULL, 'ABSENT', NOW(), NOW()),
('mech03', CURRENT_DATE - 2, '08:00:00', '17:00:00', 'PRESENT', NOW(), NOW()),
('mech04', CURRENT_DATE - 2, '08:05:00', '17:05:00', 'PRESENT', NOW(), NOW()),
('hr01', CURRENT_DATE - 3, '08:50:00', '18:05:00', 'PRESENT', NOW(), NOW()),
('hr02', CURRENT_DATE - 3, '08:45:00', '18:10:00', 'PRESENT', NOW(), NOW()),
('hr03', CURRENT_DATE - 3, '08:55:00', '18:00:00', 'PRESENT', NOW(), NOW()),
('pilot05', CURRENT_DATE - 3, '06:00:00', '15:00:00', 'PRESENT', NOW(), NOW()),
('pilot06', CURRENT_DATE - 3, '06:00:00', '15:00:00', 'PRESENT', NOW(), NOW()),
('crew05', CURRENT_DATE - 3, '06:10:00', '15:10:00', 'PRESENT', NOW(), NOW()),
('crew06', CURRENT_DATE - 3, NULL, NULL, 'VACATION', NOW(), NOW()),
('mech05', CURRENT_DATE - 3, '08:00:00', '17:00:00', 'PRESENT', NOW(), NOW()),
('pilot01', CURRENT_DATE - 4, '07:00:00', '16:00:00', 'PRESENT', NOW(), NOW()),
('pilot02', CURRENT_DATE - 4, '07:00:00', '16:00:00', 'PRESENT', NOW(), NOW()),
('crew01', CURRENT_DATE - 4, '07:10:00', '16:10:00', 'PRESENT', NOW(), NOW()),
('crew02', CURRENT_DATE - 4, NULL, NULL, 'VACATION', NOW(), NOW());

-- Leave Apply (5)
-- Correcting for LeaveApply entity:
-- leave_apply_applicant: emp_id maps to this
-- leave_apply_code: needed
-- leave_days: float needed
-- leave_type: enum needed
-- leave_start_date: datetime needed
-- leave_end_date: datetime needed (optional in constructor but likely needed)
-- leave_apply_reason: text
-- leave_apply_approver: optional (can be null for pending)
-- leave_apply_status: PENDING/APPROVED/REJECTED
-- leave_apply_cancel_reason: optional

INSERT INTO leave_apply (leave_apply_applicant, leave_apply_code, leave_type, leave_start_date, leave_end_date, leave_days, leave_apply_reason, leave_apply_status, create_date, update_date) VALUES 
('crew02', 'LA-20250601-001', 'ANNUAL', '2025-06-01 00:00:00', '2025-06-05 00:00:00', 5.0, '여름 휴가', 'PENDING', NOW(), NOW()),
('crew06', 'LA-20250701-001', 'ANNUAL', '2025-07-01 00:00:00', '2025-07-03 00:00:00', 3.0, '가족 여행', 'APPROVED', NOW(), NOW()),
('pilot01', 'LA-20250801-001', 'SICK', '2025-08-01 00:00:00', '2025-08-02 00:00:00', 2.0, '건강 검진', 'APPROVED', NOW(), NOW()),
('hr02', 'LA-20250510-001', 'HALF_DAY', '2025-05-10 09:00:00', '2025-05-10 13:00:00', 0.5, '은행 업무', 'PENDING', NOW(), NOW()),
('mech03', 'LA-20250910-001', 'ANNUAL', '2025-09-10 00:00:00', '2025-09-15 00:00:00', 6.0, '추석 연휴 연장', 'REJECTED', NOW(), NOW());
