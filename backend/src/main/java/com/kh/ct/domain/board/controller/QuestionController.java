package com.kh.ct.domain.board.controller;

import com.kh.ct.domain.board.dto.QuestionDto;
import com.kh.ct.domain.board.service.QuestionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;


    @PostMapping
    public ResponseEntity<Long> createQuestion(
            @RequestBody QuestionDto.CreateRequest dto, // ✅ 수정
            @AuthenticationPrincipal String empId) {

        Long questionId = questionService.createQuestion(dto, empId);
        return ResponseEntity.ok(questionId);
    }

    @GetMapping
    public ResponseEntity<Page<QuestionDto.ListResponse>> getQuestions(
            @PageableDefault(page = 0, size = 10, sort = "createDate", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false) String keyword) {

        return ResponseEntity.ok(questionService.getQuestions(pageable, keyword));
    }
    // 3. 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<QuestionDto.DetailResponse> getQuestion(@PathVariable(name = "id") Long id) { // ✅ 수정
        return ResponseEntity.ok(questionService.getQuestionDetail(id));
    }

    // 4. 답변 등록
    @PostMapping("/{id}/answers")
    public ResponseEntity<Void> createAnswer(
            @PathVariable(name = "id") Long id,
            @RequestBody QuestionDto.AnswerRequest dto, // ✅ 수정
            @AuthenticationPrincipal String adminEmpId) {

        questionService.saveAnswer(id, dto.getContent(), adminEmpId);
        return ResponseEntity.ok().build();
    }

    // 질문 수정
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateQuestion(
            @PathVariable(name = "id") Long id,
            @RequestBody QuestionDto.CreateRequest dto,
            @AuthenticationPrincipal String empId) {

        questionService.updateQuestion(id, dto, empId);
        return ResponseEntity.ok().build();
    }

    // 질문 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(
            @PathVariable(name = "id") Long id,
            @AuthenticationPrincipal String empId) {

        questionService.deleteQuestion(id, empId);
        return ResponseEntity.ok().build();
    }

}
