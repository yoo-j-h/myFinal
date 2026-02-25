package com.kh.ct.global.repository;

import com.kh.ct.global.entity.File;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileRepository extends JpaRepository<File,Long> {
}
