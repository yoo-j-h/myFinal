package com.kh.ct.domain.board.entity;


import com.kh.ct.global.entity.BaseTimeEntity;
import com.kh.ct.domain.emp.entity.Emp;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Question extends BaseTimeEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long questionId;

    @JoinColumn(name = "questioner",nullable = false)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Emp questioner;

    @Column(nullable = false, length = 100)
    private String questionTitle;

    @Lob
    @Column(nullable = false)
    private String questionContent;

    @JoinColumn(name = "answerer")
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    private Emp answerer;

    @Lob
    private String answerContent;

    public void updateAnswer(String answerContent, Emp answerer) {
        this.answerContent = answerContent;
        this.answerer = answerer;
        // BaseTimeEntity를 상속받고 있다면,
        // 이 메서드가 실행되어 데이터가 변경될 때 updateDate가 자동으로 갱신됩니다.
    }

    public void update(String title, String content) {
        this.questionTitle = title;
        this.questionContent = content;
        // Dirty Checking을 통해 변경 사항이 DB에 반영됩니다.
    }
}
