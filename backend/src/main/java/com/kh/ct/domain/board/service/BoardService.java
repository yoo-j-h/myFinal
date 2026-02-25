package com.kh.ct.domain.board.service;

import com.kh.ct.domain.board.dto.Board_ListResponseDto;
import com.kh.ct.domain.board.dto.Board_RequestDto;
import com.kh.ct.domain.board.repository.BoardFileRepository;
import com.kh.ct.domain.board.entity.Board;
import com.kh.ct.domain.board.repository.BoardRepository;
import com.kh.ct.domain.board.entity.BoardFile;
import com.kh.ct.domain.emp.entity.Emp;
import com.kh.ct.domain.emp.repository.EmpRepository;
import com.kh.ct.global.entity.File;
import com.kh.ct.global.service.FileService;
import com.kh.ct.global.service.NotificationEventPublisher;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BoardService {

    private final BoardRepository boardRepository;
    private final EmpRepository empRepository;
    private final FileService fileService; // ✅ 주입
    private final BoardFileRepository boardFileRepository;
    private final NotificationEventPublisher notificationEventPublisher;

    // ✅ 게시글 전체 조회 (페이징 적용)
    public Page<Board_ListResponseDto> getAllPosts(String type, String keyword , Pageable pageable) {
        Page<Board> posts;

        // "전체"이거나 type이 없으면 전체 페이징 조회
        if (keyword != null && !keyword.trim().isEmpty()) {
            posts = boardRepository.findByBoardTitleContainingOrBoardContentContaining(keyword, keyword, pageable);
        } else if (type == null || type.equals("전체") || type.trim().isEmpty()) {
            posts = boardRepository.findAll(pageable);
        } else {
            posts = boardRepository.findByBoardType(type, pageable);
        }

        // Page 객체의 map 메서드를 사용하여 DTO로 변환
        return posts.map(Board_ListResponseDto::new);
    }

    // 게시글 등록 (기존 유지)
    @Transactional
    public Long createPost(Board_RequestDto dto) {
        // 1. 게시글 생성 및 저장
        Board board = Board.builder()
                .boardType(dto.getCategory())
                .boardTitle(dto.getTitle())
                .boardContent(dto.getContent())
                .boardWriter(empRepository.findById(dto.getWriterId())
                        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사원입니다.")))
                .boardCount(0)
                .build();

        Board savedBoard = boardRepository.save(board);

        // 2. 파일 처리 (DTO의 getFiles() 사용)
        List<MultipartFile> files = dto.getFiles();
        if (files != null && !files.isEmpty()) {
            for (MultipartFile multipartFile : files) {
                if (multipartFile.isEmpty()) continue;

                try {
                    // (1) 물리적 파일 저장 및 File 엔티티 생성
                    File savedFile = fileService.saveFile(multipartFile);

                    // (2) Board와 File을 연결하는 BoardFile 매핑 엔티티 생성 및 저장
                    BoardFile boardFile = BoardFile.builder()
                            .boardId(savedBoard)
                            .fileId(savedFile)
                            .build();

                    boardFileRepository.save(boardFile);

                } catch (IOException e) {
                    // 예외 처리: 실제 서비스 환경에서는 로그를 남기고 사용자에게 알림
                    throw new RuntimeException("파일 저장 중 오류가 발생했습니다: " + multipartFile.getOriginalFilename());
                }
            }
        }

        // 공지사항인 경우 알림 발행
        if ("공지사항".equals(savedBoard.getBoardType())) {
            Emp writer = savedBoard.getBoardWriter();
            if (writer.getAirlineId() != null) {
                Long airlineId = writer.getAirlineId().getAirlineId();
                List<Emp> employees = empRepository.findByRoleAndAirlineId(null, airlineId);

                String alarmContent = String.format("새로운 공지사항이 등록되었습니다: %s", savedBoard.getBoardTitle());
                String alarmType = "BOARD_NOTICE";
                String alarmLink = "/board/detail/" + savedBoard.getBoardId();

                for (Emp employee : employees) {
                    notificationEventPublisher.publishNotificationEvent(
                            employee.getEmpId(),
                            alarmContent,
                            alarmType,
                            alarmLink
                    );
                }
            }
        }

        return savedBoard.getBoardId();
    }

    @Transactional // 조회수 업데이트를 위해 트랜잭션 필요
    public Board_ListResponseDto getPostDetail(Long boardId) {

        boardRepository.updateViewCount(boardId);
        // 1. 게시글 조회 (없으면 예외 발생)
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("해당 게시글이 존재하지 않습니다."));
        List<BoardFile> boardFiles = boardFileRepository.findByBoardId(board);

        // 3. DTO로 변환하여 반환
        return new Board_ListResponseDto(board,boardFiles);
    }
    @Transactional
    public void deletePost(Long boardId) {
        // 1. 게시글 존재 확인
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 존재하지 않습니다. id=" + boardId));

        // 2. 관련 파일 매핑 데이터 삭제 (BoardFile)
        // 만약 Board 엔티티에서 BoardFile을 CascadeType.REMOVE로 설정했다면 이 과정은 자동 생략 가능합니다.
        boardFileRepository.deleteByBoardId(board);

        // 3. 게시글 삭제
        boardRepository.delete(board);
    }

    @Transactional
    public void updatePost(Long boardId, Board_RequestDto dto) {
        // 1. 기존 게시글 조회 (영속성 컨텍스트가 관리 시작)
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 존재하지 않습니다. id=" + boardId));

        // 2. 값 수정 (엔티티에 @Setter가 있다면 아래처럼 직접 세팅)
        // 만약 @Setter가 없다면 board.update(...) 메서드를 엔티티에 하나 만드시는 게 정신 건강에 좋습니다.
        board.update(dto.getCategory(), dto.getTitle(), dto.getContent());

        // 🚩 별도로 save()를 호출하지 않아도 트랜잭션이 끝날 때 DB에 반영됩니다. (더티 체킹)

        // 3. 신규 파일 처리
        List<MultipartFile> newFiles = dto.getFiles();
        if (newFiles != null && !newFiles.isEmpty()) {
            for (MultipartFile multipartFile : newFiles) {
                if (multipartFile.isEmpty()) continue;
                try {
                    File savedFile = fileService.saveFile(multipartFile);
                    BoardFile boardFile = BoardFile.builder()
                            .boardId(board) // 기존 board 객체 그대로 사용
                            .fileId(savedFile)
                            .build();
                    boardFileRepository.save(boardFile);
                } catch (IOException e) {
                    throw new RuntimeException("파일 수정 중 오류 발생");
                }
            }
        }
    }

}