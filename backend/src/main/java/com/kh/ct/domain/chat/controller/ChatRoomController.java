package com.kh.ct.domain.chat.controller;

import com.kh.ct.domain.chat.dto.ChatMessageDto;
import com.kh.ct.domain.chat.dto.ChatRoomDto;
import com.kh.ct.domain.chat.service.ChatRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Validated
public class ChatRoomController {

    private final ChatRoomService chatRoomService;

    /**
     * 채팅 친구 리스트
     * @return
     */
    @GetMapping("/friends")
    public List<ChatRoomDto.ChatFriendDto> getHealthFriends() {
        return chatRoomService.getFriendsByDepartment("건강관리부");
    }

    /**
     * 채팅방 생성 or 조회
     * @param req
     * @param authentication
     * @return
     */
    @PostMapping("/room")
    public ChatRoomDto.RoomRes getOrCreateByRoomKey(
            @RequestBody ChatRoomDto.RoomKeyReq req,
            Authentication authentication
    ) {
        // 로그인 사용자 ID (보통 username = empId로 세팅)
        String myEmpId = authentication.getName();

        return chatRoomService.getOrCreateByRoomKey(req.getRoomKey(), myEmpId);
    }

    /**
     * 메세지 저장
     * @param req
     * @param authentication
     * @return
     */
    @PostMapping("/messages")
    public ChatMessageDto.MessageResponse send(
            @RequestBody ChatMessageDto.SendRequest req,
            Authentication authentication
    ) {
        String myEmpId = authentication.getName();
        return chatRoomService.sendMessage(req.getRoomKey(), myEmpId, req.getContent());
    }

    /**
     * 메세지 호출
     * @param roomKey
     * @param authentication
     * @return
     */
    @GetMapping("/messages")
    public List<ChatMessageDto.MessageResponse> recent(
            @RequestParam("roomKey") String roomKey,
            Authentication authentication
    ) {
        String myEmpId = authentication.getName();
        return chatRoomService.getRecent(roomKey, myEmpId);
    }

    /**
     * 최근 대화 목록
     * @param limit
     * @param authentication
     * @return
     */
    @GetMapping("/conversations")
    public List<ChatRoomDto.RecentConversationRes> recent(
            @RequestParam(name = "limit", defaultValue = "30") int limit,
            Authentication authentication
    ) {
        String myEmpId = authentication.getName();
        return chatRoomService.getRecentConversations(myEmpId, limit);
    }

}
