package com.kh.ct.domain.emp.repository;

import com.kh.ct.domain.emp.entity.PasswordCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordCodeRepository extends JpaRepository<PasswordCode, Long> {

    Optional<PasswordCode> findTopByEmailOrderByCreateDateDesc(String email);
}
