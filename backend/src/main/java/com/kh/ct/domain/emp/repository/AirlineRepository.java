package com.kh.ct.domain.emp.repository;

import com.kh.ct.domain.emp.entity.Airline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AirlineRepository extends JpaRepository<Airline, Long> {

    @Query("SELECT a FROM Airline a ORDER BY a.createDate DESC")
    List<Airline> findAllOrderByCreateDateDesc();

    @Query("SELECT a FROM Airline a WHERE a.airlineName LIKE %:keyword% OR CAST(a.airlineId AS string) LIKE %:keyword% ORDER BY a.createDate DESC")
    List<Airline> searchByKeyword(@Param("keyword") String keyword);

    // 직원 수 계산 (Native Query)
    @Query(value = "SELECT COUNT(*) FROM emp WHERE airline_id = :airlineId", nativeQuery = true)
    Long countEmployeesByAirlineId(@Param("airlineId") Long airlineId);

    @Query(value = "SELECT COUNT(*) FROM emp WHERE airline_id = :airlineId AND emp_status = 'Y'", nativeQuery = true)
    Long countActiveEmployeesByAirlineId(@Param("airlineId") Long airlineId);

    // AirlineApply ID로 Airline 조회
    @Query("SELECT a FROM Airline a WHERE a.airlineApplyId.airlineApplyId = :airlineApplyId")
    java.util.Optional<Airline> findByAirlineApplyId(@Param("airlineApplyId") Long airlineApplyId);
    
    // AirlineApply ID로 Airline 존재 여부 확인
    @Query("SELECT COUNT(a) > 0 FROM Airline a WHERE a.airlineApplyId.airlineApplyId = :airlineApplyId")
    boolean existsByAirlineApplyId(@Param("airlineApplyId") Long airlineApplyId);
    
    /**
     * IATA 코드로 항공사 조회
     * 편명의 앞 2글자(IATA 코드)로 항공사를 찾기 위한 메서드
     * airlineName에 IATA 코드가 포함되어 있거나, 별도 필드가 있을 경우 사용
     * 현재는 airlineName에서 매칭하지만, 추후 iataCode 필드 추가 시 수정 필요
     */
    @Query("SELECT a FROM Airline a WHERE UPPER(a.airlineName) LIKE CONCAT('%', UPPER(:iataCode), '%')")
    java.util.Optional<Airline> findByIataCode(@Param("iataCode") String iataCode);
}

