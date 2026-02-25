package com.kh.ct.domain.health.repository;

import com.kh.ct.domain.health.entity.HealthScoreRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.Optional;

public interface HealthScoreRuleRepository extends JpaRepository<HealthScoreRule, Long> {

    @Query(value = """
        SELECT *
        FROM health_score_rule
        WHERE kind = :kind
          AND (:v IS NOT NULL)
          AND (min_value IS NULL OR min_value <= :v)
          AND (max_value IS NULL OR :v < max_value)
        ORDER BY
          (min_value IS NULL) ASC,
          min_value DESC
        LIMIT 1
        """, nativeQuery = true)
    Optional<HealthScoreRule> findMatchedRule(@Param("kind") String kind,
                                              @Param("v") BigDecimal v);

}
