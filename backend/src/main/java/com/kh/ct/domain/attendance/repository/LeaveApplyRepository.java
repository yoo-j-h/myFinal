package com.kh.ct.domain.attendance.repository;

import com.kh.ct.domain.attendance.entity.LeaveApply;
import com.kh.ct.global.common.CommonEnums;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 휴가 신청 Repository
 */
@Repository
public interface LeaveApplyRepository extends JpaRepository<LeaveApply, Long> {

    /**
     * 특정 직원의 휴가 신청 내역 조회 (최신순)
     */
    List<LeaveApply> findByLeaveApplyApplicant_EmpIdOrderByCreateDateDesc(String empId);

    /**
     * 특정 직원의 월별 휴가 내역 조회
     */
    @Query("SELECT la FROM LeaveApply la " +
           "WHERE la.leaveApplyApplicant.empId = :empId " +
           "AND YEAR(la.leaveStartDate) = :year " +
           "AND MONTH(la.leaveStartDate) = :month " +
           "ORDER BY la.leaveStartDate DESC")
    List<LeaveApply> findMonthlyLeaveByEmpId(
            @Param("empId") String empId,
            @Param("year") int year,
            @Param("month") int month);

    /**
     * 중복 날짜 신청 방지 (같은 날짜에 이미 신청한 휴가가 있는지 확인)
     */
    @Query("SELECT COUNT(la) > 0 FROM LeaveApply la " +
           "WHERE la.leaveApplyApplicant.empId = :empId " +
           "AND la.leaveApplyStatus != 'REJECTED' " +
           "AND ((la.leaveStartDate <= :endDate AND la.leaveEndDate >= :startDate))")
    boolean existsOverlappingLeave(
            @Param("empId") String empId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    /**
     * 특정 직원의 승인된 휴가 일수 합계 (연도별)
     */
    @Query("SELECT COALESCE(SUM(la.leaveDays), 0.0) FROM LeaveApply la " +
           "WHERE la.leaveApplyApplicant.empId = :empId " +
           "AND la.leaveApplyStatus = 'APPROVED' " +
           "AND YEAR(la.leaveStartDate) = :year")
    Double calculateUsedLeaveByYear(
            @Param("empId") String empId,
            @Param("year") int year);

    /**
     * 승인 대기 중인 휴가 신청 조회 (관리자용)
     */
    @Query("SELECT la FROM LeaveApply la " +
           "JOIN FETCH la.leaveApplyApplicant e " +
           "LEFT JOIN FETCH e.departmentId d " +
           "WHERE la.leaveApplyStatus = 'PENDING' " +
           "ORDER BY la.createDate DESC")
    List<LeaveApply> findPendingLeavesWithDetails();

    /**
     * 관리자용 전체 휴가 신청 목록 조회 (직원 및 부서 정보 포함)
     */
    @Query("SELECT la FROM LeaveApply la " +
           "JOIN FETCH la.leaveApplyApplicant e " +
           "LEFT JOIN FETCH e.departmentId d " +
           "LEFT JOIN FETCH la.leaveApplyApprover " +
           "ORDER BY la.createDate DESC")
    List<LeaveApply> findAllWithDetails();

    /**
     * 관리자용 상태별 휴가 신청 조회
     */
    @Query("SELECT la FROM LeaveApply la " +
           "JOIN FETCH la.leaveApplyApplicant e " +
           "LEFT JOIN FETCH e.departmentId d " +
           "LEFT JOIN FETCH la.leaveApplyApprover " +
           "WHERE la.leaveApplyStatus = :status " +
           "ORDER BY la.createDate DESC")
    List<LeaveApply> findAllByStatusWithDetails(@Param("status") CommonEnums.ApplyStatus status);
}
