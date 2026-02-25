package com.kh.ct.domain.chat.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chatRoomId;

    @Column(nullable = false, unique = true)
    private String roomKey;

    @Column(nullable = false)
    private String lowUserId;

    @Column(nullable = false)
    private String highUserId;


    private String lastMessage;


    private LocalDateTime lastMessageTime;

    public void updateLastMessage(String lastMessage, LocalDateTime lastMessageTime) {
        this.lastMessage = lastMessage;
        this.lastMessageTime = lastMessageTime;
    }

    public boolean isParticipant(String empId) {
        if (empId == null) return false;
        return empId.equals(this.lowUserId) || empId.equals(this.highUserId);
    }

}
