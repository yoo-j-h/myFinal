package com.kh.ct.domain.attendance.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kh.ct.domain.attendance.dto.ProtestDto;
import com.kh.ct.global.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * Vision AI 서비스
 * Spring AI(Gemini)를 활용한 이미지 텍스트 추출(OCR) 기능 제공
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class VisionService {

    private final ChatClient.Builder chatClientBuilder;
    private final ObjectMapper objectMapper;

    /**
     * 이미지에서 구조화된 데이터 추출
     * 
     * @param file 이미지 파일
     * @return 추출된 구조화된 데이터 (날짜, 시간, 사유)
     * @throws BusinessException 파일 처리 실패 또는 이미지 파일이 아닌 경우
     */
    public ProtestDto.OcrResponse extractText(MultipartFile file) {
        log.info("이미지 구조화 데이터 추출 시작 - 파일명: {}", file.getOriginalFilename());

        try {
            // 1. 파일을 ByteArrayResource로 변환
            byte[] fileBytes = file.getBytes();
            ByteArrayResource resource = new ByteArrayResource(fileBytes) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            };

            // 2. ChatClient를 사용하여 이미지와 텍스트를 함께 전달
            String promptText = "이 이미지에서 다음 정보를 추출해서 순수 JSON 형식으로만 반환해. 마크다운이나 다른 설명은 절대 추가하지 마.\n" +
                    "- targetDate: 문서에 적힌 날짜 (YYYY-MM-DD 형식, 없으면 null)\n" +
                    "- updateTime: 문서에 적힌 시간 (HH:mm 형식, 없으면 null)\n" +
                    "- reason: 문서의 핵심 내용 및 지연/결근 사유 요약\n" +
                    "응답 예시: {\"targetDate\": \"2026-02-11\", \"updateTime\": \"08:10\", \"reason\": \"열차 45분 지연\"}";
            
            ChatClient chatClient = chatClientBuilder.build();
            String response = chatClient.prompt()
                    .user(userSpec -> userSpec
                            .text(promptText)
                            .media(org.springframework.util.MimeTypeUtils.parseMimeType(file.getContentType()), resource))
                    .call()
                    .content();

            // 3. 마크다운 블록 제거 후처리
            String cleanedJson = removeMarkdownCodeBlocks(response);
            
            log.info("LLM 응답: {}", cleanedJson);

            // 4. JSON 파싱
            try {
                ProtestDto.OcrResponse ocrData = objectMapper.readValue(cleanedJson, ProtestDto.OcrResponse.class);
                
                // fileName 설정하여 반환
                ProtestDto.OcrResponse result = ProtestDto.OcrResponse.builder()
                        .targetDate(ocrData.getTargetDate())
                        .updateTime(ocrData.getUpdateTime())
                        .reason(ocrData.getReason())
                        .fileName(file.getOriginalFilename())
                        .build();
                
                log.info("데이터 추출 완료 - 날짜: {}, 시간: {}, 사유 길이: {}", 
                        result.getTargetDate(), result.getUpdateTime(), 
                        result.getReason() != null ? result.getReason().length() : 0);
                
                return result;
                
            } catch (JsonProcessingException e) {
                log.error("JSON 파싱 실패 - 응답: {}", cleanedJson, e);
                throw BusinessException.badRequest("응답 데이터 파싱에 실패했습니다. LLM이 올바른 JSON 형식으로 응답하지 않았습니다.");
            }

        } catch (IOException e) {
            log.error("파일 읽기 실패", e);
            throw BusinessException.badRequest("파일을 읽을 수 없습니다: " + e.getMessage());
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("텍스트 추출 실패", e);
            throw BusinessException.badRequest("텍스트 추출에 실패했습니다: " + e.getMessage());
        }
    }

    /**
     * 마크다운 코드 블록 제거
     * LLM이 ```json ... ``` 형태로 응답할 수 있으므로 이를 제거
     * 
     * @param text 원본 텍스트
     * @return 마크다운 블록이 제거된 텍스트
     */
    private String removeMarkdownCodeBlocks(String text) {
        if (text == null || text.isEmpty()) {
            return text;
        }

        // ```json ... ``` 또는 ``` ... ``` 패턴 제거
        String cleaned = text.trim();
        
        // 시작 부분의 ```json 또는 ``` 제거
        if (cleaned.startsWith("```json")) {
            cleaned = cleaned.substring(7).trim();
        } else if (cleaned.startsWith("```")) {
            cleaned = cleaned.substring(3).trim();
        }
        
        // 끝 부분의 ``` 제거
        if (cleaned.endsWith("```")) {
            cleaned = cleaned.substring(0, cleaned.length() - 3).trim();
        }

        return cleaned;
    }
}
