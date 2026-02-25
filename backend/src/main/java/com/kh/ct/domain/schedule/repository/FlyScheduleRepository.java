package com.kh.ct.domain.schedule.repository;

import com.kh.ct.domain.schedule.entity.FlySchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface FlyScheduleRepository extends JpaRepository<FlySchedule, Long> {
    
    // 전체 비행편 조회 (날짜 빠른 순서대로)
    @Query("SELECT fs FROM FlySchedule fs " +
           "LEFT JOIN FETCH fs.schedule s " +
           "ORDER BY fs.flyStartTime ASC")
    List<FlySchedule> findAllByOrderByFlyStartTimeAsc();
    
    // 항공사별 비행편 조회 (날짜 빠른 순서대로)
    @Query("SELECT fs FROM FlySchedule fs " +
           "LEFT JOIN FETCH fs.schedule s " +
           "WHERE (:airlineId IS NULL OR fs.airlineId = :airlineId) " +
           "ORDER BY fs.flyStartTime ASC")
    List<FlySchedule> findByAirlineId(@Param("airlineId") Long airlineId);
    
    // 날짜 범위로 조회 (날짜 빠른 순서대로, AllSchedule 함께 로드)
    @Query("SELECT fs FROM FlySchedule fs " +
           "LEFT JOIN FETCH fs.schedule s " +
           "WHERE (:airlineId IS NULL OR fs.airlineId = :airlineId) " +
           "AND fs.flyStartTime >= :startDate " +
           "AND fs.flyStartTime < :endDate " +
           "ORDER BY fs.flyStartTime ASC")
    List<FlySchedule> findByDateRange(
        @Param("airlineId") Long airlineId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    // 출발지/도착지로 조회 (날짜 빠른 순서대로)
    @Query("SELECT fs FROM FlySchedule fs " +
           "LEFT JOIN FETCH fs.schedule s " +
           "WHERE (:airlineId IS NULL OR fs.airlineId = :airlineId) " +
           "AND (:departure IS NULL OR fs.departure LIKE CONCAT('%', :departure, '%')) " +
           "AND (:destination IS NULL OR fs.destination LIKE CONCAT('%', :destination, '%')) " +
           "ORDER BY fs.flyStartTime ASC")
    List<FlySchedule> findByDepartureAndDestination(
        @Param("airlineId") Long airlineId,
        @Param("departure") String departure,
        @Param("destination") String destination
    );
    
    // 직원이 배정된 비행편 조회 (날짜 빠른 순서대로) - EmpFlySchedule 사용
    @Query("SELECT DISTINCT fs FROM FlySchedule fs " +
           "LEFT JOIN FETCH fs.schedule s " +
           "JOIN EmpFlySchedule efs ON efs.flySchedule.flyScheduleId = fs.flyScheduleId " +
           "WHERE efs.emp.empId = :empId " +
           "ORDER BY fs.flyStartTime ASC")
    List<FlySchedule> findByEmpId(@Param("empId") String empId);
    
    // 비행편 ID로 조회
    @Query("SELECT fs FROM FlySchedule fs " +
           "LEFT JOIN FETCH fs.schedule s " +
           "WHERE fs.flyScheduleId = :flyScheduleId")
    Optional<FlySchedule> findByFlyScheduleId(@Param("flyScheduleId") Long flyScheduleId);
    
    // 비행편 ID로 조회 (EmpFlySchedule과 Emp 함께 조회 - N+1 문제 방지)
    @Query("SELECT DISTINCT fs FROM FlySchedule fs " +
           "LEFT JOIN FETCH fs.schedule s " +
           "LEFT JOIN FETCH fs.empFlySchedules efs " +
           "LEFT JOIN FETCH efs.emp emp " +
           "LEFT JOIN FETCH emp.departmentId dept " +
           "WHERE fs.flyScheduleId = :flyScheduleId")
    Optional<FlySchedule> findByFlyScheduleIdWithCrew(@Param("flyScheduleId") Long flyScheduleId);
    
    /**
     * 통합 조회 메서드: 모든 필터 조건을 한 번에 처리
     * - empId가 있으면 해당 직원이 배정된 비행편만 조회
     * - empId가 없으면 관리자용 조회 (모든 필터 조건 적용)
     */
    @Query("SELECT DISTINCT fs FROM FlySchedule fs " +
           "LEFT JOIN FETCH fs.schedule s " +
           "LEFT JOIN EmpFlySchedule efs ON efs.flySchedule.flyScheduleId = fs.flyScheduleId " +
           "WHERE (:empId IS NULL OR :empId = '' OR efs.emp.empId = :empId) " +
           "AND (:airlineId IS NULL OR fs.airlineId = :airlineId) " +
           "AND (:startDate IS NULL OR fs.flyStartTime >= :startDate) " +
           "AND (:endDate IS NULL OR fs.flyStartTime < :endDate) " +
           "AND (:departure IS NULL OR :departure = '' OR fs.departure LIKE CONCAT('%', :departure, '%')) " +
           "AND (:destination IS NULL OR :destination = '' OR fs.destination LIKE CONCAT('%', :destination, '%')) " +
           "ORDER BY fs.flyStartTime ASC")
    List<FlySchedule> findWithFilters(
        @Param("empId") String empId,
        @Param("airlineId") Long airlineId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        @Param("departure") String departure,
        @Param("destination") String destination
    );
    
    // 날짜 범위 내 비행편 개수 조회 (항공사 필터링 포함)
    @Query("SELECT COUNT(fs) FROM FlySchedule fs " +
           "WHERE (:airlineId IS NULL OR fs.airlineId = :airlineId) " +
           "AND fs.flyStartTime >= :startDate AND fs.flyStartTime <= :endDate")
    long countByFlyStartTimeBetween(
        @Param("airlineId") Long airlineId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
}
