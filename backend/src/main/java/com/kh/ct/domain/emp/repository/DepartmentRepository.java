package com.kh.ct.domain.emp.repository;

import com.kh.ct.domain.emp.entity.Department;
import com.kh.ct.global.common.CommonEnums;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DepartmentRepository extends JpaRepository<Department, Long> {

    Optional<Department> findByDepartmentNameAndDepartmentStatus(
            String departmentName,
            CommonEnums.CommonStatus departmentStatus
    );
}
