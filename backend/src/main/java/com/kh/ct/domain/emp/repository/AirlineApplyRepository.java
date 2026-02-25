package com.kh.ct.domain.emp.repository;

import com.kh.ct.domain.emp.entity.AirlineApply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AirlineApplyRepository extends JpaRepository<AirlineApply, Long> {

    /**
     * 전체 목록 조회 (최신순)
     */
    List<AirlineApply> findAllByOrderByCreateDateDesc();

    /**
     * 검색 (항공사명, 이메일)
     */
    @Query("SELECT a FROM AirlineApply a WHERE " +
           "a.airlineName LIKE %:keyword% OR " +
           "a.airlineApplyEmail LIKE %:keyword% " +
           "ORDER BY a.createDate DESC")
    List<AirlineApply> searchByKeyword(@Param("keyword") String keyword);

    /**
     * 이메일로 AirlineApply 조회 (승인된 신청만)
     */
    @Query("SELECT a FROM AirlineApply a WHERE a.airlineApplyEmail = :email AND a.airlineApplyStatus = 'APPROVED' ORDER BY a.createDate DESC")
    java.util.Optional<AirlineApply> findByAirlineApplyEmail(@Param("email") String email);
}

