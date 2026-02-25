package com.kh.ct.domain.chat.repository;

import com.kh.ct.domain.chat.entity.ChatRoom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    Optional<ChatRoom> findByRoomKey(String roomKey);

    Page<ChatRoom> findByLowUserIdOrHighUserIdOrderByLastMessageTimeDesc(
            String lowUserId,
            String highUserId,
            Pageable pageable
    );
}
