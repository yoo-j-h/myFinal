package com.kh.ct.domain.board.dto;
import com.kh.ct.domain.board.entity.BoardFile;
import com.kh.ct.domain.board.entity.Board;
import lombok.Getter;
import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;
import java.util.List;
@Getter
public class Board_ListResponseDto {
    private Long boardId;
    private String boardType;
    private String boardTitle;
    private String boardContent; // 상세 내용 추가
    private String writerName;
    private String writerId;     // 수정/삭제 권한 체크용 사번 추가
    private Integer boardCount;
    private String createDate;
    private String updateDate;   // 수정일 추가
    private List<FileDto> files;

    public Board_ListResponseDto(Board board) {
        this(board, null); // 아래에 만든 상세용 생성자를 호출하되, 파일은 null로 전달
    }
    public Board_ListResponseDto(Board board, List<BoardFile> boardFiles) {
        this.boardId = board.getBoardId();
        this.boardType = board.getBoardType();
        this.boardTitle = board.getBoardTitle();
        this.boardContent = board.getBoardContent(); // @Lob 필드 포함

        // 작성자 정보 (Emp 엔티티 연관관계)
        if (board.getBoardWriter() != null) {
            this.writerName = board.getBoardWriter().getEmpName();
            this.writerId = board.getBoardWriter().getEmpId();
        } else {
            this.writerName = "익명";
        }

        this.boardCount = board.getBoardCount() != null ? board.getBoardCount() : 0;

        // BaseTimeEntity로부터 날짜 포맷팅 (시간까지 포함하여 상세하게 전달)
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

        if (board.getCreateDate() != null) {
            this.createDate = board.getCreateDate().format(formatter);
        }
        if (board.getUpdateDate() != null) {
            this.updateDate = board.getUpdateDate().format(formatter);
        }
        if (boardFiles != null) {
            this.files = boardFiles.stream()
                    .map(bf -> new FileDto(
                            bf.getFileId().getFileId(),
                            bf.getFileId().getFileOriName() // File 엔티티의 원본파일명 필드
                    ))
                    .collect(Collectors.toList());
        }
    }

    @Getter
    public static class FileDto {
        private Long fileId;
        private String originName;

        public FileDto(Long fileId, String originName) {
            this.fileId = fileId;
            this.originName = originName;
        }
    }
}