package com.kh.ct.domain.board.service;


import com.kh.ct.domain.board.dto.QuestionDto;
import com.kh.ct.domain.board.entity.Question;
import com.kh.ct.domain.board.repository.QuestionRepository;
import com.kh.ct.domain.emp.entity.Emp;
import com.kh.ct.domain.emp.repository.EmpRepository;
import com.kh.ct.global.common.CommonEnums;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final EmpRepository empRepository;

    public List<QuestionDto.ListResponse> getQuestionList() {
        return questionRepository.findAllByOrderByCreateDateDesc().stream()
                .map(QuestionDto.ListResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public Long createQuestion(QuestionDto.CreateRequest dto, String empId) {
        // 사원 상태 확인 (Enums 설정에 따라 'Y' 또는 'ACTIVE' 확인)
        Emp questioner = empRepository.findByEmpIdAndEmpStatus(empId, CommonEnums.EmpStatus.Y)
                .orElseThrow(() -> new RuntimeException("활동 중인 사원 정보를 찾을 수 없습니다."));

        Question question = Question.builder()
                .questionTitle(dto.getTitle())
                .questionContent(dto.getContent())
                .questioner(questioner)
                .build();

        return questionRepository.save(question).getQuestionId();
    }

    public Page<QuestionDto.ListResponse> getQuestions(Pageable pageable, String keyword) {
        Page<Question> questions;
        if (keyword != null && !keyword.isEmpty()) {
            questions = questionRepository.findByQuestionTitleContaining(keyword, pageable);
        } else {
            questions = questionRepository.findAll(pageable);
        }

        return questions.map(QuestionDto.ListResponse::from);
    }


    public QuestionDto.DetailResponse getQuestionDetail(Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 질문입니다."));

        // 정적 메서드 사용으로 코드 한 줄 요약
        return QuestionDto.DetailResponse.from(question);
    }

    // 5. 답변 저장
    @Transactional
    public void saveAnswer(Long questionId, String content, String adminEmpId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 질문입니다."));

        Emp answerer = empRepository.findById(adminEmpId)
                .orElseThrow(() -> new IllegalArgumentException("관리자 정보를 찾을 수 없습니다."));

        // Question 엔티티 내부의 updateAnswer 메서드 호출
        question.updateAnswer(content, answerer);
    }

    @Transactional
    public void updateQuestion(Long id, QuestionDto.CreateRequest dto, String empId) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다."));

        // 본인 확인 로직
        if (!question.getQuestioner().getEmpId().equals(empId)) {
            throw new RuntimeException("수정 권한이 없습니다.");
        }

        question.update(dto.getTitle(), dto.getContent());
    }

    @Transactional
    public void deleteQuestion(Long id, String empId) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다."));

        // 본인 확인 (또는 관리자인 경우 삭제 가능하도록 조건 추가 가능)
        if (!question.getQuestioner().getEmpId().equals(empId)) {
            throw new RuntimeException("삭제 권한이 없습니다.");
        }

        questionRepository.delete(question);
    }
}