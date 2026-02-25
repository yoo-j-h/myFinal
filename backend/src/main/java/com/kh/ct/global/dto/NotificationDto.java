package com.kh.ct.global.dto;

import com.kh.ct.global.entity.Alarm;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class NotificationDto {

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NotificationResponse {
        private Long alarmId;
        private String alarmContent;
        private String alarmType;
        private String alarmLink;
        private String alarmStatus;
        private LocalDateTime createDate;

        public static NotificationResponse from(Alarm alarm) {
            return NotificationResponse.builder()
                    .alarmId(alarm.getAlarmId())
                    .alarmContent(alarm.getAlarmContent())
                    .alarmType(alarm.getAlarmType())
                    .alarmLink(alarm.getAlarmLink())
                    .alarmStatus(alarm.getAlarmStatus() != null ? alarm.getAlarmStatus().name() : null)
                    .createDate(alarm.getCreateDate())
                    .build();
        }
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NotificationListResponse {
        private Long alarmId;
        private String alarmContent;
        private String alarmType;
        private String alarmLink;
        private String alarmStatus;
        private LocalDateTime createDate;

        public static NotificationListResponse from(Alarm alarm) {
            return NotificationListResponse.builder()
                    .alarmId(alarm.getAlarmId())
                    .alarmContent(alarm.getAlarmContent())
                    .alarmType(alarm.getAlarmType())
                    .alarmLink(alarm.getAlarmLink())
                    .alarmStatus(alarm.getAlarmStatus() != null ? alarm.getAlarmStatus().name() : null)
                    .createDate(alarm.getCreateDate())
                    .build();
        }
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NotificationCountResponse {
        private long unreadCount;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateNotificationRequest {
        private String receiverEmpId;
        private String alarmContent;
        private String alarmType;
        private String alarmLink;
    }
}

