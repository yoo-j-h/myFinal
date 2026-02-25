package com.kh.ct.global.controller;

import com.kh.ct.global.dto.NotificationDto;
import com.kh.ct.global.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Slf4j
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<Page<NotificationDto.NotificationListResponse>> getNotifications(
            @PageableDefault(size = 20, sort = "createDate", direction = Sort.Direction.DESC) Pageable pageable) {
        String empId = getCurrentEmpId();
        log.info("알림 목록 조회 요청 - empId: {}, page: {}, size: {}", empId, pageable.getPageNumber(), pageable.getPageSize());
        Page<NotificationDto.NotificationListResponse> notifications = notificationService.getNotifications(empId, pageable);
        log.info("알림 목록 조회 완료 - empId: {}, totalElements: {}, totalPages: {}", 
                empId, notifications.getTotalElements(), notifications.getTotalPages());
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<NotificationDto.NotificationCountResponse> getUnreadCount() {
        String empId = getCurrentEmpId();
        log.info("안읽음 알림 개수 조회 요청 - empId: {}", empId);
        long count = notificationService.getUnreadCount(empId);
        log.info("안읽음 알림 개수 조회 완료 - empId: {}, unreadCount: {}", empId, count);
        return ResponseEntity.ok(NotificationDto.NotificationCountResponse.builder()
                .unreadCount(count)
                .build());
    }

    @PutMapping("/{alarmId}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long alarmId) {
        String empId = getCurrentEmpId();
        notificationService.markAsRead(alarmId, empId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{alarmId}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long alarmId) {
        String empId = getCurrentEmpId();
        notificationService.deleteNotification(alarmId, empId);
        return ResponseEntity.ok().build();
    }

    private String getCurrentEmpId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName();
        }
        throw new RuntimeException("인증되지 않은 사용자입니다");
    }
}

