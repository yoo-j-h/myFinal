package com.kh.ct.domain.health.repository;


import com.kh.ct.domain.health.entity.EmpSurvey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface SurveyRepository extends JpaRepository<EmpSurvey, Long> {

    Optional<EmpSurvey> findTopByEmpId_EmpIdOrderByCreateDateDesc(String empId);

    @Query("select count(s) from EmpSurvey s where s.empId.empId = :empId")
    Integer countByEmpId(@Param("empId") String empId);

}
