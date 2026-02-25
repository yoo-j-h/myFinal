package com.kh.ct.domain.board.repository;


import com.kh.ct.domain.board.entity.Board;
import com.kh.ct.domain.board.entity.BoardFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardFileRepository extends JpaRepository<BoardFile, Long> {
    // 나중에 게시글 ID로 첨부파일 목록을 찾을 때 사용합니다.

    // List<BoardFile> findByBoardId_BoardId(Long boardId);
    void deleteByBoardId(Board board);
    List<BoardFile> findByBoardId(Board board);
}