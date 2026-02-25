package com.kh.ct.domain.schedule.repository;

import com.kh.ct.domain.schedule.entity.EmpSchedule;
import com.kh.ct.global.common.CommonEnums;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface EmpScheduleRepository extends JpaRepository<EmpSchedule, Long> {
    
    // 스케줄 ID로 배정된 직원 조회 (JOIN FETCH로 N+1 문제 방지)
    @Query("SELECT es FROM EmpSchedule es " +
           "JOIN FETCH es.empId emp " +
           "WHERE es.scheduleId.scheduleId = :scheduleId")
    List<EmpSchedule> findByScheduleId(@Param("scheduleId") Long scheduleId);
    
    // 직원 ID로 배정된 스케줄 조회 (JOIN FETCH로 N+1 문제 방지)
    @Query("SELECT es FROM EmpSchedule es " +
           "JOIN FETCH es.scheduleId s " +
           "JOIN FETCH es.empId emp " +
           "WHERE es.empId.empId = :empId")
    List<EmpSchedule> findByEmpId(@Param("empId") String empId);
    
    // 직원 ID로 월별 스케줄 조회 (캘린더용)
    // ✅ FLIGHT 일정 제외 (FLIGHT는 EmpFlySchedule에서만 관리)
    @Query("SELECT es FROM EmpSchedule es " +
           "JOIN FETCH es.scheduleId s " +
           "JOIN FETCH es.empId emp " +
           "WHERE es.empId.empId = :empId " +
           "AND s.startDate >= :startDate " +
           "AND s.startDate < :endDate " +
           "AND (es.scheduleCode != 'FLIGHT' OR es.scheduleCode IS NULL) " + // ✅ FLIGHT 제외
           "AND (s.scheduleCode != 'FLIGHT' OR s.scheduleCode IS NULL) " + // ✅ AllSchedule의 FLIGHT도 제외
           "ORDER BY s.startDate ASC")
    List<EmpSchedule> findByEmpIdAndMonth(
            @Param("empId") String empId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
    
    // 항공사별, 역할별 직원 일정 조회 (관리자용)
    // ✅ FLIGHT 일정 제외 (FLIGHT는 EmpFlySchedule에서만 관리)
    @Query("SELECT es FROM EmpSchedule es " +
           "JOIN FETCH es.scheduleId s " +
           "JOIN FETCH es.empId emp " +
           "LEFT JOIN emp.airlineId airline " +
           "WHERE es.scheduleId IS NOT NULL " +
           "AND (es.scheduleCode != 'FLIGHT' OR es.scheduleCode IS NULL) " + // ✅ FLIGHT 제외
           "AND (s.scheduleCode != 'FLIGHT' OR s.scheduleCode IS NULL) " + // ✅ AllSchedule의 FLIGHT도 제외
           "AND (:airlineId IS NULL OR airline.airlineId = :airlineId) " +
           "AND (:role IS NULL OR emp.role = :role) " +
           "ORDER BY emp.empName ASC, s.startDate ASC")
    List<EmpSchedule> findByAirlineIdAndRole(
            @Param("airlineId") Long airlineId,
            @Param("role") CommonEnums.Role role
    );
    
    // 역할별 직원 일정 조회 (항공사 필터 없이)
    // ✅ FLIGHT 일정 제외 (FLIGHT는 EmpFlySchedule에서만 관리)
    @Query("SELECT es FROM EmpSchedule es " +
           "JOIN FETCH es.scheduleId s " +
           "JOIN FETCH es.empId emp " +
           "WHERE es.scheduleId IS NOT NULL " +
           "AND (es.scheduleCode != 'FLIGHT' OR es.scheduleCode IS NULL) " + // ✅ FLIGHT 제외
           "AND (s.scheduleCode != 'FLIGHT' OR s.scheduleCode IS NULL) " + // ✅ AllSchedule의 FLIGHT도 제외
           "AND emp.role = :role " +
           "ORDER BY emp.empName ASC, s.startDate ASC")
    List<EmpSchedule> findByRole(@Param("role") CommonEnums.Role role);
    
    // 디버깅용: 역할별 직원 수 확인
    @Query("SELECT COUNT(DISTINCT es.empId.empId) FROM EmpSchedule es " +
           "JOIN es.empId emp " +
           "LEFT JOIN emp.airlineId airline " +
           "WHERE (:airlineId IS NULL OR airline.airlineId = :airlineId) " +
           "AND (:role IS NULL OR emp.role = :role)")
    Long countByAirlineIdAndRole(
            @Param("airlineId") Long airlineId,
            @Param("role") CommonEnums.Role role
    );
    
    // 항공사별 월별 일정 조회 (삭제용)
    @Query("SELECT es FROM EmpSchedule es " +
           "JOIN FETCH es.scheduleId s " +
           "JOIN FETCH es.empId emp " +
           "LEFT JOIN emp.airlineId airline " +
           "WHERE (:airlineId IS NULL OR airline.airlineId = :airlineId) " +
           "AND s.startDate >= :startDate " +
           "AND s.startDate < :endDate")
    List<EmpSchedule> findByAirlineIdAndMonth(
            @Param("airlineId") Long airlineId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
    
    // ✅ 제거: FLIGHT 일정은 EmpFlySchedule에서만 관리하므로 이 메서드는 사용하지 않음
    // EmpFlyScheduleRepository.findByFlyScheduleId()를 사용하세요.
    // @Deprecated - FLIGHT 일정 조회는 EmpFlyScheduleRepository 사용
    // @Query("SELECT es FROM EmpSchedule es " +
    //        "JOIN FETCH es.scheduleId s " +
    //        "JOIN FETCH es.empId emp " +
    //        "WHERE s.scheduleId = :flyScheduleId " +
    //        "AND (s.scheduleCode = 'FLIGHT' OR es.scheduleCode = 'FLIGHT') " +
    //        "ORDER BY emp.role ASC, emp.empName ASC")
    // List<EmpSchedule> findByFlyScheduleId(@Param("flyScheduleId") Long flyScheduleId);
    
    // 특정 scheduleId로 모든 EmpSchedule 조회
    // EmpSchedule은 대리키 구조이므로 scheduleId로만 조회 (empScheduleId와 무관)
    @Query("SELECT es FROM EmpSchedule es " +
           "JOIN FETCH es.scheduleId s " +
           "JOIN FETCH es.empId emp " +
           "LEFT JOIN FETCH emp.departmentId dept " +
           "WHERE s.scheduleId = :scheduleId")
    List<EmpSchedule> findAllByScheduleId(@Param("scheduleId") Long scheduleId);
    
    // (emp_id, schedule_id) 조합으로 단건 조회
    // EmpSchedule은 대리키 구조이므로 PK로 조회하면 안 되고, (empId, scheduleId) 조합으로 조회해야 함
    @Query("SELECT es FROM EmpSchedule es " +
           "JOIN FETCH es.scheduleId s " +
           "JOIN FETCH es.empId emp " +
           "WHERE es.empId.empId = :empId AND es.scheduleId.scheduleId = :scheduleId")
    java.util.Optional<EmpSchedule> findOneByEmpIdAndScheduleId(
            @Param("empId") String empId, 
            @Param("scheduleId") Long scheduleId);
    
    // (emp_id, schedule_id) 조합 존재 여부 확인 (중복 체크용)
    @Query("SELECT COUNT(es) > 0 FROM EmpSchedule es " +
           "WHERE es.empId.empId = :empId AND es.scheduleId.scheduleId = :scheduleId")
    boolean existsByEmpIdAndScheduleId(@Param("empId") String empId, 
                                       @Param("scheduleId") Long scheduleId);
}
