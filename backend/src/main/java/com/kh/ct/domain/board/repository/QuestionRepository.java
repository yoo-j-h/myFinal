package com.kh.ct.domain.board.repository;


import com.kh.ct.domain.board.entity.Question;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    // 모든 질문을 생성일 내림차순(최신순)으로 조회
    List<Question> findAllByOrderByCreateDateDesc();

    Page<Question> findByQuestionTitleContaining(String keyword, Pageable pageable);

    // 기존에 있던 것 (그대로 두셔도 됩니다)
    Page<Question> findByQuestionTitleContainingOrQuestionContentContaining(
            String titleKeyword, String contentKeyword, Pageable pageable);

    // 제목, 내용, 질문자 이름으로 검색 (대소문자 무시)
    @Query("SELECT q FROM Question q WHERE " +
            "q.questionTitle LIKE %:keyword% OR " +
            "q.questionContent LIKE %:keyword% OR " +
            "q.questioner.empName LIKE %:keyword% " +
            "ORDER BY q.createDate DESC")
    List<Question> findByKeyword(@Param("keyword") String keyword);
}