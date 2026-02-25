package com.kh.ct.domain.schedule.repository;

import com.kh.ct.domain.schedule.entity.EmpFlySchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface EmpFlyScheduleRepository extends JpaRepository<EmpFlySchedule, Long> {
    
    // 비행편 ID로 배정된 직원 조회 (JOIN FETCH로 N+1 문제 방지, Department 포함, role과 empName으로 정렬)
    // ✅ 3단계: Repository 쿼리 검증 - 직접 컬럼명 사용으로 변경 (가장 확실한 방법)
    // JOIN 대신 직접 컬럼명으로 조회하여 확실하게 매핑
    @Query("SELECT efs FROM EmpFlySchedule efs " +
           "JOIN FETCH efs.emp emp " +
           "LEFT JOIN FETCH emp.departmentId dept " +
           "WHERE efs.flySchedule.flyScheduleId = :flyScheduleId " +
           "ORDER BY emp.role, emp.empName")
    List<EmpFlySchedule> findByFlyScheduleId(@Param("flyScheduleId") Long flyScheduleId);
    
    // ✅ DB 직접 확인용 네이티브 쿼리 (디버깅용)
    @Query(value = "SELECT COUNT(*) FROM emp_fly_schedule WHERE fly_schedule_id = :flyScheduleId", nativeQuery = true)
    Long countByFlyScheduleIdNative(@Param("flyScheduleId") Long flyScheduleId);
    
    // 직원 ID로 배정된 비행편 조회 (JOIN FETCH로 N+1 문제 방지)
    @Query("SELECT efs FROM EmpFlySchedule efs " +
           "JOIN FETCH efs.flySchedule fs " +
           "LEFT JOIN FETCH fs.schedule s " +
           "WHERE efs.emp.empId = :empId")
    List<EmpFlySchedule> findByEmpId(@Param("empId") String empId);
    
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
    
    // 비행편 ID와 직원 ID로 조회
    @Query("SELECT efs FROM EmpFlySchedule efs " +
           "JOIN FETCH efs.emp emp " +
           "JOIN FETCH efs.flySchedule fs " +
           "LEFT JOIN FETCH fs.schedule s " +
           "WHERE efs.flySchedule.flyScheduleId = :flyScheduleId " +
           "AND efs.emp.empId = :empId")
    List<EmpFlySchedule> findByFlyScheduleIdAndEmpId(
            @Param("flyScheduleId") Long flyScheduleId,
            @Param("empId") String empId
    );

    // 여러 비행편 ID로 배정 정보 일괄 조회 (배치 최적화)
    @Query("SELECT efs FROM EmpFlySchedule efs " +
           "JOIN FETCH efs.emp emp " +
           "JOIN FETCH efs.flySchedule fs " +
           "LEFT JOIN FETCH fs.schedule s " +
           "WHERE fs.flyScheduleId IN :flyScheduleIds")
    List<EmpFlySchedule> findByFlyScheduleIdIn(@Param("flyScheduleIds") List<Long> flyScheduleIds);
}
