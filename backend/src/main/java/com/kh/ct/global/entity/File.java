package com.kh.ct.global.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class File extends com.kh.ct.global.entity.BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fileId;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String fileOriName;

    @Column(nullable = false)
    private String path;

    private Long size;
}