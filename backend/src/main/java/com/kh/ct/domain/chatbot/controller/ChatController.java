package com.kh.ct.domain.chatbot.controller;

import com.kh.ct.domain.chatbot.service.ChatService;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/chat")
    public Map<String, String> chat(@RequestBody Map<String, String> request) {
        try {
            String userMessage = request.get("message");

            // 1. 현재 로그인한 사용자 정보 가져오기
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String empId = null;

            // 인증 정보가 있고, 익명 사용자가 아닌 경우에만 empId 추출
            if (auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser")) {
                empId = auth.getName(); // 보통 사번이 Principal의 Name으로 설정됩니다.
            }

            // 2. 서비스에 메시지와 empId(없으면 null)를 전달
            String reply = chatService.getChatReply(userMessage, empId);

            return Map.of("reply", reply);
        } catch (Exception e) {
            e.printStackTrace(); // 디버깅을 위해 로그 출력
            return Map.of("reply", "죄송합니다. 챗봇 응답 중 오류가 발생했습니다.");
        }
    }
}