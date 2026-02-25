package com.kh.ct.global.service;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class NotificationEvent extends ApplicationEvent {
    private final String receiverEmpId;
    private final String alarmContent;
    private final String alarmType;
    private final String alarmLink;

    public NotificationEvent(Object source, String receiverEmpId, String alarmContent, String alarmType, String alarmLink) {
        super(source);
        this.receiverEmpId = receiverEmpId;
        this.alarmContent = alarmContent;
        this.alarmType = alarmType;
        this.alarmLink = alarmLink;
    }
}

