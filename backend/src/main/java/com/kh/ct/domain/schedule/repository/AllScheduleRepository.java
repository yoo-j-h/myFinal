package com.kh.ct.domain.schedule.repository;

import com.kh.ct.domain.schedule.entity.AllSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AllScheduleRepository extends JpaRepository<AllSchedule, Long> {
}
