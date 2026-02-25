package com.kh.ct.domain.board.dto;


import com.kh.ct.domain.board.entity.Question;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Q&A 게시판 관련 DTO 모음
 */
public class QuestionDto {

    // 1. 질문 생성 요청
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateRequest {
        private String title;
        private String content;
    }

    // 2. 답변 등록/수정 요청
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AnswerRequest {
        private String content;
    }

    // 3. 리스트 조회 응답
    @Getter
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    @AllArgsConstructor
    @Builder
    public static class ListResponse {
        private Long questionId;
        private String questionTitle;
        private String questionerName;
        private LocalDateTime createDate;
        private boolean isAnswered;

        public static ListResponse from(Question entity) {
            return ListResponse.builder()
                    .questionId(entity.getQuestionId())
                    .questionTitle(entity.getQuestionTitle())
                    .questionerName(entity.getQuestioner().getEmpName())
                    .createDate(entity.getCreateDate())
                    .isAnswered(entity.getAnswerContent() != null)
                    .build();
        }
    }

    // 4. 상세 조회 응답
    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DetailResponse {
        private Long questionId;
        private String questionTitle;
        private String questionContent;
        private String questionerName;
        private String questionerId;
        private LocalDateTime createDate;
        private boolean answered;
        private String answerContent;
        private String answererName;
        private LocalDateTime answerDate;

        public static DetailResponse from(Question entity) {
            return DetailResponse.builder()
                    .questionId(entity.getQuestionId())
                    .questionTitle(entity.getQuestionTitle())
                    .questionContent(entity.getQuestionContent())
                    .questionerName(entity.getQuestioner().getEmpName())
                    .questionerId(entity.getQuestioner().getEmpId())
                    .createDate(entity.getCreateDate())
                    .answered(entity.getAnswerContent() != null)
                    .answerContent(entity.getAnswerContent())
                    .answererName(entity.getAnswerer() != null ? entity.getAnswerer().getEmpName() : null)
                    .answerDate(entity.getUpdateDate())
                    .build();
        }
    }
}