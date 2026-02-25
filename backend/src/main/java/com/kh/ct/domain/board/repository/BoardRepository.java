package com.kh.ct.domain.board.repository;


import com.kh.ct.domain.board.entity.Board;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BoardRepository extends JpaRepository<Board, Long> {
    // 최신순 전체 조회
    Page<Board> findAll(Pageable pageable);
    // 2. 카테고리별 조회 (페이징)
    Page<Board> findByBoardType(String boardType, Pageable pageable);

    Page<Board> findByBoardTitleContainingOrBoardContentContaining(String keyword, String keyword1, Pageable pageable);

    @Modifying
    @Query("UPDATE Board b SET b.boardCount = b.boardCount + 1 WHERE b.boardId = :boardId")
    void updateViewCount(@Param("boardId") Long boardId);

}