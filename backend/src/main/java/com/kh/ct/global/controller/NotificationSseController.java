package com.kh.ct.global.controller;

import com.kh.ct.global.dto.NotificationDto;
import com.kh.ct.global.security.JwtTokenProvider;
import com.kh.ct.global.service.NotificationService;
import com.kh.ct.global.service.NotificationSseService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Slf4j
public class NotificationSseController {

    private final NotificationSseService notificationSseService;
    private final NotificationService notificationService;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public ResponseEntity<SseEmitter> streamNotifications(
            @RequestParam(value = "token", required = false) String tokenParam,
            @RequestParam(value = "lastEventId", required = false) String lastEventId,
            @RequestHeader(value = "Last-Event-ID", required = false) String lastEventIdHeader,
            HttpServletRequest request) {
        
        String lastEventIdValue = lastEventId != null ? lastEventId : lastEventIdHeader;

        String empId = getCurrentEmpId(request, tokenParam);
        if (empId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        log.info("SSE 연결 요청 - empId: " + empId + ", lastEventId: " + lastEventIdValue);

        SseEmitter emitter = notificationSseService.createConnection(empId);

        if (StringUtils.hasText(lastEventIdValue)) {
            try {
                Long lastId = Long.parseLong(lastEventIdValue);
                List<NotificationDto.NotificationResponse> missedNotifications =
                        notificationService.getUnreadNotificationsAfterId(empId, lastId);

                for (NotificationDto.NotificationResponse notification : missedNotifications) {
                    try {
                        emitter.send(SseEmitter.event()
                                .id(String.valueOf(notification.getAlarmId()))
                                .name("notification")
                                .data(notification));
                    } catch (Exception e) {
                        log.error("누락 알림 전송 실패", e);
                    }
                }
            } catch (NumberFormatException e) {
                log.warn("잘못된 Last-Event-ID 형식: " + lastEventIdValue);
            }
        }

        return ResponseEntity.ok(emitter);
    }

    private String getCurrentEmpId(HttpServletRequest request, String tokenParam) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            log.debug("SecurityContext 인증 상태 - authenticated: " + (authentication != null ? authentication.isAuthenticated() : false) + 
                    ", name: " + (authentication != null ? authentication.getName() : null) + 
                    ", path: " + request.getRequestURI());
            
            if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getName())) {
                return authentication.getName();
            }

            // SecurityContext에 인증 정보가 없으면 토큰으로 직접 검증
            String token = tokenParam != null ? tokenParam : getJwtFromRequest(request);
            log.debug("토큰 추출 - tokenParam: " + (tokenParam != null ? "있음" : "없음") + 
                    ", token: " + (token != null ? "있음" : "없음") + 
                    ", path: " + request.getRequestURI());
            
            if (StringUtils.hasText(token)) {
                try {
                    String empId = jwtTokenProvider.getempIdFromToken(token);
                    log.debug("토큰에서 empId 추출 성공 - empId: " + empId);
                    return empId;
                } catch (Exception e) {
                    log.error("토큰에서 empId 추출 실패", e);
                }
            }
        } catch (Exception e) {
            log.error("사용자 ID 추출 실패", e);
        }
        return null;
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}

