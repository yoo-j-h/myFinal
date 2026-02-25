package com.kh.ct.domain.chat.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kh.ct.domain.chat.entity.ChatRoom;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class ChatRoomDto {

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ChatFriendDto {
        private String empId;
        private String empName;
        private String job;      // 건강관리사
        private String phone;
        private String email;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RoomKeyReq {
        private String roomKey;
    }

    @Getter
    @Builder
    @AllArgsConstructor
    public static class RoomRes {
        private Long chatRoomId;
        private String roomKey;
        private String lowUserId;
        private String highUserId;
        private String lastMessage;
        private LocalDateTime lastMessageTime;

        public static RoomRes from(ChatRoom room) {
            return RoomRes.builder()
                    .chatRoomId(room.getChatRoomId())
                    .roomKey(room.getRoomKey())
                    .lowUserId(room.getLowUserId())
                    .highUserId(room.getHighUserId())
                    .lastMessage(room.getLastMessage())
                    .lastMessageTime(room.getLastMessageTime())
                    .build();
        }
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RecentConversationRes {

        @JsonProperty("chat_room_id")
        private Long chatRoomId;

        @JsonProperty("room_key")
        private String roomKey;

        @JsonProperty("other_emp_id")
        private String otherEmpId;

        @JsonProperty("other_emp_name")
        private String otherEmpName;

        @JsonProperty("job")
        private String job;

        @JsonProperty("last_message")
        private String lastMessage;

        @JsonProperty("last_message_time")
        private LocalDateTime lastMessageTime;
    }


}
