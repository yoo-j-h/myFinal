package com.kh.ct.domain.board.controller;

import com.kh.ct.domain.board.dto.Board_ListResponseDto;
import com.kh.ct.domain.board.dto.Board_RequestDto;
import com.kh.ct.domain.board.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    // ✅ 게시글 목록 가져오기 (페이징 적용)
    @GetMapping("/list")
    public ResponseEntity<Page<Board_ListResponseDto>> getBoardList(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String keyword, // ✅ 검색어 추가
            @PageableDefault(size = 10, sort = "createDate", direction = Sort.Direction.DESC) Pageable pageable) {

        return ResponseEntity.ok(boardService.getAllPosts(category, keyword, pageable));
    }

    // 새 글 등록
    @PostMapping(value = "/write", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Long> writePost(@ModelAttribute Board_RequestDto dto) throws IOException {
        return ResponseEntity.ok(boardService.createPost(dto));
    }

    @GetMapping("/detail/{boardId}")
    public ResponseEntity<Board_ListResponseDto> getBoardDetail(@PathVariable Long boardId) {
        // 조회수 증가와 함께 데이터를 가져옵니다.
        return ResponseEntity.ok(boardService.getPostDetail(boardId));
    }

    @DeleteMapping("/delete/{boardId}")
    public ResponseEntity<String> deleteBoard(@PathVariable Long boardId) {
        try {
            boardService.deletePost(boardId);
            return ResponseEntity.ok("게시글이 성공적으로 삭제되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("삭제 중 오류가 발생했습니다.");
        }
    }

    @PutMapping(value = "/update/{boardId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> updatePost(
            @PathVariable Long boardId,
            @ModelAttribute Board_RequestDto dto) {

        try {
            boardService.updatePost(boardId, dto);
            return ResponseEntity.ok("게시글이 수정되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("수정 중 오류가 발생했습니다.");
        }
    }



}