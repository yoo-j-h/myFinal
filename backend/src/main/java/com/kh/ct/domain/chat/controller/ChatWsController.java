package com.kh.ct.domain.chat.controller;

import com.kh.ct.domain.chat.dto.ChatMessageDto;
import com.kh.ct.domain.chat.entity.ChatMessage;
import com.kh.ct.domain.chat.service.ChatRoomService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class ChatWsController {

    private final ChatRoomService chatRoomService;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatWsController(ChatRoomService chatRoomService,
                            SimpMessagingTemplate messagingTemplate) {
        this.chatRoomService = chatRoomService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat.send") // 클라 -> /app/chat.send
    public void send(ChatMessageDto.SendRequest req, Principal principal) {

        if (principal == null || principal.getName() == null) {
            throw new IllegalStateException("WS 인증 정보(principal)가 없습니다.");
        }

        String senderEmpId = principal.getName();

        // ✅ 저장 + lastMessage 업데이트까지 끝난 DTO
        ChatMessageDto.MessageResponse saved = chatRoomService.sendMessage(
                req.getRoomKey(),
                senderEmpId,
                req.getContent()
        );

        // ✅ 구독 중인 방에 브로드캐스트
        messagingTemplate.convertAndSend(
                "/topic/rooms/" + req.getRoomKey(),
                saved
        );
    }
}
