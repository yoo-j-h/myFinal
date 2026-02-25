package com.kh.ct.domain.board.entity;

import com.kh.ct.global.entity.File;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class BoardFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long boardFileId;

    @JoinColumn(name = "board_id")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Board boardId;

    @JoinColumn(name = "file_id")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private File fileId;
}
