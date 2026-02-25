package com.kh.ct.global.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationEventPublisher {

    private final ApplicationEventPublisher eventPublisher;

    public void publishNotificationEvent(String receiverEmpId, String alarmContent, String alarmType, String alarmLink) {
        log.info("알림 이벤트 발행 - receiverEmpId: {}, alarmType: {}", receiverEmpId, alarmType);
        NotificationEvent event = new NotificationEvent(this, receiverEmpId, alarmContent, alarmType, alarmLink);
        eventPublisher.publishEvent(event);
    }
}

