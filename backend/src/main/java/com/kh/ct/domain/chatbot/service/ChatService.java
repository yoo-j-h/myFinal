package com.kh.ct.domain.chatbot.service;

import org.springframework.ai.chat.client.ChatClient; // 이 경로가 정확해야 함
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    private final ChatClient chatClient;

    // 생성자 주입 방식
    public ChatService(ChatClient.Builder builder) {
        this.chatClient = builder
                .defaultSystem("너는 항공 시스템 지원 센터의 상담원이야.")
                .defaultFunctions("getFlightSchedule", "getLeaveStatus", "getHealthInfo", "getRecentAlarms")
                .build();
    }

    public String getChatReply(String userMessage, String loginEmpId) {
        // 1. 로그인 여부 확인
        if (loginEmpId == null || loginEmpId.isBlank()) {
            return "죄송합니다. 사원 정보를 조회하기 위해서는 로그인이 필요합니다. 로그인 후 다시 이용해주세요!";
        }

        // 2. 로그인된 경우에만 AI 호출
        return chatClient.prompt()
                .user(userMessage)
                .system("현재 로그인한 사원의 ID는 " + loginEmpId + "입니다.")
                .call()
                .content();
    }
}