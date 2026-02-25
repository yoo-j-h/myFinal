package com.kh.ct.domain.health.repository;

import com.kh.ct.domain.health.entity.Program;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgramRepository extends JpaRepository<Program, String> {
}
