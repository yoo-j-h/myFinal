package com.kh.ct.domain.health.repository;

import com.kh.ct.domain.health.entity.EmpHealth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EmpHealthRepository extends JpaRepository<EmpHealth, String> {

    Optional<EmpHealth> findTopByEmpId_EmpIdOrderByEmpHealthIdDesc(String empId);

        List<EmpHealth> findTop2ByEmpId_EmpIdOrderByEmpHealthIdDesc(String empId);


    @Query(value = """
        SELECT day, health_point, physical_point, stress_point, fatigue_point
        FROM (
          SELECT
            DATE(create_date) AS day,
            health_point,
            physical_point,
            stress_point,
            fatigue_point,
            ROW_NUMBER() OVER (
              PARTITION BY DATE(create_date)
              ORDER BY create_date DESC, emp_health_id DESC
            ) AS rn
          FROM emp_health
          WHERE emp_id = :empId
            AND create_date >= (CURDATE() - INTERVAL :days DAY)
        ) t
        WHERE t.rn = 1
        ORDER BY day ASC
        """,
            nativeQuery = true)
    List<Object[]> findDailyLatestScores(@Param("empId") String empId, @Param("days") int days);

}
