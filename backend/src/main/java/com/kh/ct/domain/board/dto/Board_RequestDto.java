package com.kh.ct.domain.board.dto;


import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter @Setter
public class Board_RequestDto {
    private String category; // 리액트의 category
    private String title;
    private String content;
    private String writerId; // EMP002 같은 사번
    private List<MultipartFile> files;

    
}