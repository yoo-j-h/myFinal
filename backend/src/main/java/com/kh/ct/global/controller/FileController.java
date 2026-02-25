package com.kh.ct.global.controller;

import com.kh.ct.global.service.FileService;
import com.kh.ct.global.entity.File;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping("/api/file")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Long>> upload(
            @RequestPart("file") MultipartFile file
    ) throws IOException {

        File saved = fileService.saveFile(file);
        return ResponseEntity.ok(Map.of("fileId", saved.getFileId()));
    }


    @GetMapping("/download/{fileId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long fileId) {
        try {
            // 1. DB에서 파일 정보 조회 (실제 경로, 원본 파일명 등)
            // fileService.getFileEntity(fileId) 같은 메서드가 필요합니다.
            File fileEntity = fileService.getFile(fileId);
            Resource resource =  fileService.loadAsResource(fileId);

            // 2. 파일명이 한글일 경우 깨짐 방지 처리
            String encodedFileName = UriUtils.encode(fileEntity.getFileOriName(), StandardCharsets.UTF_8);

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + encodedFileName + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * 파일 미리보기 (inline으로 반환)
     */
    @GetMapping("/preview/{fileId}")
    public ResponseEntity<Resource> previewFile(@PathVariable Long fileId) {
        try {
            File fileEntity = fileService.getFile(fileId);
            Resource resource = fileService.loadAsResource(fileId);

            // MIME 타입 판별 (확장자 기반)
            String contentType = determineContentType(fileEntity.getFileName());

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileEntity.getFileOriName() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * 파일 확장자 기반 MIME 타입 판별
     */
    private String determineContentType(String fileName) {
        String extension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
        
        return switch (extension) {
            case "pdf" -> "application/pdf";
            case "jpg", "jpeg" -> "image/jpeg";
            case "png" -> "image/png";
            case "gif" -> "image/gif";
            case "bmp" -> "image/bmp";
            case "webp" -> "image/webp";
            default -> "application/octet-stream";
        };
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<Void> deleteFile(@PathVariable Long fileId) {
        try {
            fileService.deleteFile(fileId);
            return ResponseEntity.noContent().build(); // 204
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
