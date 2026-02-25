package com.kh.ct.domain.code.entity;


import com.kh.ct.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Code extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CODE_ID")
    private Long codeId;

    @Column(nullable = false, length = 100, name = "CODE_NAME")
    private String codeName;

    @OneToMany(mappedBy = "codeId", fetch = FetchType.LAZY,
            cascade = CascadeType.ALL, orphanRemoval = true)
    private List<com.kh.ct.domain.code.entity.CodeDetail> codeDetails = new ArrayList<>();

    // 필요하면 항공사 필터링용 (컬럼명이 AIRLINE__ID 라서 그대로 매핑)
    @Column(name = "AIRLINE_ID")
    private Long airlineId;
}