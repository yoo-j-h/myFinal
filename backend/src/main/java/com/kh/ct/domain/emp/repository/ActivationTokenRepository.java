package com.kh.ct.domain.emp.repository;

import com.kh.ct.domain.emp.entity.ActivationToken;
import com.kh.ct.domain.emp.entity.Emp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ActivationTokenRepository extends JpaRepository<ActivationToken, Long> {
    Optional<ActivationToken> findByToken(String token);
    
    List<ActivationToken> findByEmpIdAndUsedFalseOrderByCreateDateDesc(Emp emp);
}

