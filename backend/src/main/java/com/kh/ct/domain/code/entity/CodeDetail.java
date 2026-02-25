package com.kh.ct.domain.code.entity;

import com.kh.ct.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Table(name = "CODE_DETAIL")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class CodeDetail extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codeDetailId;

    @JoinColumn(name = "CODE_ID")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Code codeId;

    @Column(nullable = false)
    private String codeDetailName;

    @Lob
    private String codeDesc;

    /**
     * CodeDetail 수정 메서드 (더티 체킹 방식)
     * BoardService 스타일: 엔티티의 데이터를 직접 변경
     */
    public void update(String codeDetailName, String codeDesc) {
        this.codeDetailName = codeDetailName;
        this.codeDesc = codeDesc;
        // BaseTimeEntity를 상속받고 있어서 updateDate가 자동으로 갱신됩니다.
    }
}