package com.kh.ct.domain.attendance.repository;

import com.kh.ct.domain.attendance.entity.Attendance;
import com.kh.ct.global.common.CommonEnums;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * 근태 Repository
 */
@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    /**
     * 특정 직원의 특정 기간 근태 기록 조회
     */
    List<Attendance> findByEmpId_EmpIdAndAttendanceDateBetween(
            String empId,
            LocalDate startDate,
            LocalDate endDate);

    /**
     * 특정 직원의 오늘 근태 기록 조회
     */
    @Query("SELECT a FROM Attendance a WHERE a.empId.empId = :empId AND a.attendanceDate = :today")
    Optional<Attendance> findTodayAttendance(
            @Param("empId") String empId,
            @Param("today") LocalDate today);

    /**
     * 특정 직원의 월별 특정 상태 카운트
     */
    @Query("SELECT COUNT(a) FROM Attendance a " +
            "WHERE a.empId.empId = :empId " +
            "AND a.attendanceDate BETWEEN :startDate AND :endDate " +
            "AND a.attendanceStatus = :status")
    long countByStatusInMonth(
            @Param("empId") String empId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("status") CommonEnums.AttendanceStatus status);

    /**
     * 특정 직원의 월별 총 근무시간 계산 (분 단위)
     * inTime과 outTime이 모두 있는 경우만 계산
     */
    @Query("SELECT SUM(FUNCTION('TIMESTAMPDIFF', MINUTE, a.inTime, a.outTime)) " +
            "FROM Attendance a " +
            "WHERE a.empId.empId = :empId " +
            "AND a.attendanceDate BETWEEN :startDate AND :endDate " +
            "AND a.inTime IS NOT NULL " +
            "AND a.outTime IS NOT NULL")
    Long calculateTotalWorkMinutes(
            @Param("empId") String empId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    /**
     * 특정 직원의 특정 날짜 근태 기록 조회
     */
    Optional<Attendance> findByEmpId_EmpIdAndAttendanceDate(String empId, LocalDate date);

    /**
     * 특정 직원의 날짜 범위 내 근태 기록 삭제 (휴가 반려 시)
     */
    void deleteByEmpId_EmpIdAndAttendanceDateBetween(String empId, LocalDate startDate, LocalDate endDate);

    // ========== Admin Dashboard 관련 메서드 ==========

    /**
     * 특정 날짜의 상태별 카운트
     */
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.attendanceDate = :date AND a.attendanceStatus = :status")
    Long countByDateAndStatus(@Param("date") LocalDate date, @Param("status") CommonEnums.AttendanceStatus status);

    /**
     * 특정 날짜의 전체 직원 수 (중복 제거)
     */
    @Query("SELECT COUNT(DISTINCT a.empId) FROM Attendance a WHERE a.attendanceDate = :date")
    Long countDistinctEmployeesByDate(@Param("date") LocalDate date);

    /**
     * 특정 날짜의 전체 근태 기록 (Emp, Department JOIN)
     */
    @Query("SELECT a FROM Attendance a " +
           "JOIN FETCH a.empId e " +
           "LEFT JOIN FETCH e.departmentId d " +
           "WHERE a.attendanceDate = :date " +
           "ORDER BY e.empName ASC")
    List<Attendance> findAllByDateWithEmpAndDept(@Param("date") LocalDate date);

    /**
     * 오늘 날짜 기준 전체 직원의 근태 상태 조회 (직원별 실시간 현황용)
     */
    @Query("SELECT a FROM Attendance a " +
           "JOIN FETCH a.empId e " +
           "LEFT JOIN FETCH e.departmentId d " +
           "WHERE a.attendanceDate = :today " +
           "ORDER BY e.empName ASC")
    List<Attendance> findTodayAttendanceWithEmpAndDept(@Param("today") LocalDate today);

    /**
     * 특이사항(비정상 근태) 필터링 조회 - PRESENT 제외
     */
    @Query("SELECT a FROM Attendance a " +
           "JOIN FETCH a.empId e " +
           "LEFT JOIN FETCH e.departmentId d " +
           "WHERE a.attendanceDate BETWEEN :startDate AND :endDate " +
           "AND a.attendanceStatus IN ('LATE', 'ABSENT', 'EARLY_LEAVE', 'HALF_DAY', 'VACATION', 'LEAVE', 'LEAVE_PENDING', 'PROTEST_PENDING') " +
           "ORDER BY a.attendanceDate DESC, e.empName ASC")
    List<Attendance> findAbnormalAttendanceByDateRange(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    /**
     * 부서별 오늘 근태 현황 집계
     */
    @Query("SELECT d.departmentName as departmentName, " +
           "COUNT(DISTINCT e.empId) as totalEmployees, " +
           "SUM(CASE WHEN a.attendanceStatus = 'PRESENT' THEN 1 ELSE 0 END) as presentCount, " +
           "SUM(CASE WHEN a.attendanceStatus IN ('VACATION', 'LEAVE') THEN 1 ELSE 0 END) as leaveCount, " +
           "SUM(CASE WHEN a.attendanceStatus = 'LATE' THEN 1 ELSE 0 END) as lateCount, " +
           "SUM(CASE WHEN a.attendanceStatus = 'ABSENT' THEN 1 ELSE 0 END) as absentCount " +
           "FROM Attendance a " +
           "JOIN a.empId e " +
           "LEFT JOIN e.departmentId d " +
           "WHERE a.attendanceDate = :date " +
           "GROUP BY d.departmentName " +
           "ORDER BY d.departmentName ASC")
    List<Object[]> findDepartmentStatusByDate(@Param("date") LocalDate date);

    /**
     * 개인별 누적 근무시간
     * @param empId
     * @return
     */
    @Query("select a from Attendance a where a.empId.empId = :empId")
    List<Attendance> findByEmpId(@Param("empId") String empId);
}
