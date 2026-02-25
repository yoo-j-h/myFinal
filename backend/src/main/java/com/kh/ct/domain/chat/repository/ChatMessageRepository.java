package com.kh.ct.domain.chat.repository;

import com.kh.ct.domain.chat.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findTop50ByChatRoom_RoomKeyOrderByCreateDateDesc(String roomKey);

}
