package com.kh.ct.domain.health.repository;

import com.kh.ct.domain.health.entity.ProgramApply;
import com.kh.ct.global.common.CommonEnums;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 건강 프로그램 신청 Repository
 * DDD 아키텍처 - Infrastructure Layer
 */
@Repository
public interface ProgramApplyRepository extends JpaRepository<ProgramApply, String> {

    /**
     * 특정 사원의 프로그램 신청 내역 조회 (최신순)
     * @param empNo 사원번호
     * @return 프로그램 신청 내역 리스트
     */
    @Query("SELECT pa FROM ProgramApply pa " +
           "JOIN FETCH pa.programApplyApplicant " +
           "LEFT JOIN FETCH pa.program p " +
           "LEFT JOIN FETCH p.scheduleId " +
           "LEFT JOIN FETCH pa.programApplyManager " +
           "WHERE pa.programApplyApplicant.empNo = :empNo " +
           "ORDER BY pa.programApplyDate DESC")
    List<ProgramApply> findByApplicantEmpNoWithDetails(@Param("empNo") String empNo);

    /**
     * 특정 사원(ID)의 프로그램 신청 내역 조회 (최신순)
     * @param empId 사원ID
     * @return 프로그램 신청 내역 리스트
     */
    @Query("SELECT pa FROM ProgramApply pa " +
           "JOIN FETCH pa.programApplyApplicant " +
           "LEFT JOIN FETCH pa.program p " +
           "LEFT JOIN FETCH p.scheduleId " +
           "LEFT JOIN FETCH pa.programApplyManager " +
           "WHERE pa.programApplyApplicant.empId = :empId " +
           "ORDER BY pa.programApplyDate DESC")
    List<ProgramApply> findByApplicantIdWithDetails(@Param("empId") String empId);
    @Query("SELECT pa FROM ProgramApply pa " +
           "JOIN FETCH pa.programApplyApplicant " +
           "ORDER BY pa.programApplyDate DESC")
    List<ProgramApply> findAllByOrderByProgramApplyDateDesc();

    /**
     * 조건별 필터링 조회 (동적 쿼리)
     * @param status 신청 상태 (Optional)
     * @param programName 프로그램 이름 (Optional)
     * @return 필터링된 신청 내역 리스트
     */
    @Query("SELECT pa FROM ProgramApply pa " +
           "JOIN FETCH pa.programApplyApplicant " +
           "LEFT JOIN FETCH pa.program p " +
           "LEFT JOIN FETCH p.scheduleId " +
           "WHERE (:status IS NULL OR pa.programApplyStatus = :status) " +
           "AND (:programName IS NULL OR p.programContent LIKE %:programName%) " +
           "ORDER BY pa.programApplyDate DESC")
    List<ProgramApply> findAllByFilters(@Param("status") com.kh.ct.global.common.CommonEnums.ApplyStatus status, 
                                      @Param("programName") String programName);


    @Query("""
        select count(p)
        from ProgramApply p
        where p.programApplyApplicant.empId = :empId
          and p.programApplyStatus = :status
    """)
    Integer countApprovedByEmpId(@Param("empId") String empId,
                              @Param("status") CommonEnums.ApplyStatus status);
}
