package com.kh.ct.global.service;

import com.kh.ct.global.entity.File;
import com.kh.ct.global.repository.FileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileService {

    private final FileRepository fileRepository;

    private final String uploadPath = "C:/ct_uploads/";

    @Transactional
    public File saveFile(MultipartFile multipartFile) throws IOException {

        if (multipartFile == null || multipartFile.isEmpty()) {
            throw new IllegalArgumentException("업로드 파일이 비어있습니다.");
        }

        String originalName = multipartFile.getOriginalFilename();
        if (originalName == null || !originalName.contains(".")) {
            throw new IllegalArgumentException("파일명이 올바르지 않습니다.");
        }

        // ✅ 디렉토리 생성 (OS 안전)
        Path dir = Paths.get(uploadPath);
        Files.createDirectories(dir);

        // ✅ 저장 파일명 생성
        String extension = originalName.substring(originalName.lastIndexOf("."));
        String savedName = UUID.randomUUID() + extension;

        // ✅ 저장 경로 결합 (슬래시 문제 해결)
        Path savedPath = dir.resolve(savedName);
        multipartFile.transferTo(savedPath.toFile());

        File fileEntity = File.builder()
                .fileOriName(originalName)
                .fileName(savedName)
                .path(savedPath.toString())
                .size(multipartFile.getSize())
                .build();

        return fileRepository.save(fileEntity);
    }

    public File getFile(Long fileId) {
        return fileRepository.findById(fileId)
                .orElseThrow(() ->
                        new IllegalArgumentException("해당 파일이 존재하지 않습니다. id=" + fileId)
                );
    }

    // ✅ 다운로드/뷰에서 쓰는 Resource 로딩을 서비스 책임으로 이동
    public Resource loadAsResource(Long fileId) throws IOException {
        File meta = getFile(fileId);
        Path path = Paths.get(meta.getPath());
        return new UrlResource(path.toUri());
    }

    @Transactional
    public void deleteFile(Long fileId) {
        File meta = getFile(fileId);

        // 1) 디스크 파일 삭제 (실패해도 DB 삭제는 진행하는 정책)
        try {
            Path path = Paths.get(meta.getPath()).normalize();
            Files.deleteIfExists(path);
        } catch (Exception e) {
            // 지금 단계(Simple Delete)에서는 무시하고 진행
            // 운영 단계면 로그 남기거나 정책 결정 필요
        }

        // 2) DB 메타 삭제
        fileRepository.delete(meta);
    }
}
