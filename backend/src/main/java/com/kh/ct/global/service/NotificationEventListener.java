package com.kh.ct.global.service;

import com.kh.ct.global.entity.Alarm;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationEventListener {

    private final NotificationService notificationService;
    private final NotificationSseService notificationSseService;

    @Async
    @EventListener
    public void handleNotificationEvent(NotificationEvent event) {
        log.info("알림 이벤트 수신 - receiverEmpId: {}, alarmType: {}", event.getReceiverEmpId(), event.getAlarmType());

        try {
            Alarm alarm = notificationService.createNotification(
                    event.getReceiverEmpId(),
                    event.getAlarmContent(),
                    event.getAlarmType(),
                    event.getAlarmLink()
            );

            notificationSseService.sendNotificationToUser(event.getReceiverEmpId(), alarm);
        } catch (Exception e) {
            log.error("알림 생성 및 전송 실패", e);
        }
    }
}

