package com.kh.ct.domain.chat.service;

import com.kh.ct.domain.chat.dto.ChatMessageDto;
import com.kh.ct.domain.chat.dto.ChatRoomDto;
import com.kh.ct.domain.chat.entity.ChatMessage;

import java.util.List;

public interface ChatRoomService {

    public List<ChatRoomDto.ChatFriendDto> getFriendsByDepartment(String departmentName);

    public ChatRoomDto.RoomRes getOrCreateByRoomKey(String roomKey, String myEmpId);

    public ChatMessageDto.MessageResponse sendMessage(String roomKey, String senderEmpId, String content);

    public List<ChatMessageDto.MessageResponse> getRecent(String roomKey, String myEmpId);

    public List<ChatRoomDto.RecentConversationRes> getRecentConversations(String myEmpId, int limit);
}
