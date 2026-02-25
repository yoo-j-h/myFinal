package com.kh.ct.domain.attendance.repository;

import com.kh.ct.domain.attendance.entity.ProtestApply;
import com.kh.ct.global.common.CommonEnums;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 근태 정정 신청 Repository
 */
@Repository
public interface ProtestApplyRepository extends JpaRepository<ProtestApply, Long> {

    /**
     * 특정 직원의 정정 신청 목록 조회 (최신순)
     */
    List<ProtestApply> findByProtestApplyApplicant_EmpIdOrderByCreateDateDesc(String empId);

    /**
     * 관리자용 - 상태별 정정 신청 목록 조회 (페이징)
     */
    Page<ProtestApply> findByProtestApplyStatusOrderByCreateDateDesc(
            CommonEnums.ApplyStatus status, 
            Pageable pageable
    );

    /**
     * 관리자용 - 전체 정정 신청 목록 조회 (페이징)
     */
    Page<ProtestApply> findAllByOrderByCreateDateDesc(Pageable pageable);
}
