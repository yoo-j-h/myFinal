package com.kh.ct.domain.chat.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chat_id")
    private Long chatId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "chat_room_id", nullable = false)
    private ChatRoom chatRoom;

    @Column(name = "sender_id", nullable = false, length = 64)
    private String senderId;

    @Lob
    @Column(name = "content", nullable = false)
    private String content;

    @Column(name = "create_date", nullable = false)
    private LocalDateTime createDate;

    @PrePersist
    protected void onCreate() {
        if (this.createDate == null) {
            this.createDate = LocalDateTime.now();
        }
    }

}
