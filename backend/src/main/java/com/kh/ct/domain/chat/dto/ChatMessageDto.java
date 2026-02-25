package com.kh.ct.domain.chat.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kh.ct.domain.chat.entity.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageDto {

    private Long chatId;

    private Long chatRoomId;

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SendRequest {

        @JsonProperty("room_key")
        private String roomKey;

        @JsonProperty("content")
        private String content;

        // sender는 Authentication에서 가져오므로 Request에 넣지 않는 걸 권장
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MessageResponse {

        @JsonProperty("message_id")
        private Long messageId;

        @JsonProperty("chat_room_id")
        private Long chatRoomId;

        @JsonProperty("room_key")
        private String roomKey;

        @JsonProperty("sender_emp_id")
        private String senderEmpId;

        @JsonProperty("content")
        private String content;

        @JsonProperty("create_date")
        private LocalDateTime createDate;

        public static MessageResponse from(ChatMessage m) {
            return MessageResponse.builder()
                    .messageId(m.getChatId())
                    .chatRoomId(m.getChatRoom().getChatRoomId())
                    .roomKey(m.getChatRoom().getRoomKey())
                    .senderEmpId(m.getSenderId())
                    .content(m.getContent())
                    .createDate(m.getCreateDate())
                    .build();
        }
    }

}
