package com.kh.ct.domain.attendance.repository;

import com.kh.ct.domain.attendance.entity.ProtestApplyFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * 근태 정정 신청 파일 Repository
 */
@Repository
public interface ProtestApplyFileRepository extends JpaRepository<ProtestApplyFile, Long> {
}
