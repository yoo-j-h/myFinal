-- ============================================
-- EmpSchedule 테이블 스키마 수정
-- ============================================
-- 목적: JPA @GeneratedValue(IDENTITY)와 DB AUTO_INCREMENT 일치
--      (emp_id, schedule_id) unique 제약 추가로 중복 방지

-- 1. emp_schedule_id를 AUTO_INCREMENT로 변경 (PK가 아닌 경우 PK도 설정)
--    현재 emp_schedule_id가 PK인지 확인 필요 (일반적으로는 PK)
ALTER TABLE emp_schedule
  MODIFY COLUMN emp_schedule_id BIGINT NOT NULL AUTO_INCREMENT;

-- 2. PK 확인 및 설정 (emp_schedule_id가 PK가 아닌 경우)
--    만약 이미 PK라면 아래 명령은 실행하지 않음
-- ALTER TABLE emp_schedule DROP PRIMARY KEY;
-- ALTER TABLE emp_schedule ADD PRIMARY KEY (emp_schedule_id);

-- 3. (emp_id, schedule_id) unique 제약 추가
--    같은 직원이 같은 일정에 중복 배정되는 것을 방지
--    이미 존재하는 경우 무시 (IF NOT EXISTS는 MySQL 8.0.19+)
ALTER TABLE emp_schedule 
ADD CONSTRAINT uk_emp_schedule_emp_schedule 
UNIQUE (emp_id, schedule_id);

-- 4. 인덱스 추가 (조회 성능 향상)
--    이미 존재하는 경우 무시
CREATE INDEX IF NOT EXISTS idx_emp_schedule_emp_id ON emp_schedule(emp_id);
CREATE INDEX IF NOT EXISTS idx_emp_schedule_schedule_id ON emp_schedule(schedule_id);
CREATE INDEX IF NOT EXISTS idx_emp_schedule_emp_schedule ON emp_schedule(emp_id, schedule_id);
