package com.kh.ct.global.service;

import com.kh.ct.global.dto.NotificationDto;
import com.kh.ct.global.entity.Alarm;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationSseService {

    private final ConcurrentHashMap<String, SseEmitter> emitters = new ConcurrentHashMap<>();

    public SseEmitter createConnection(String empId) {
        log.info("SSE 연결 생성 - empId: {}", empId);

        SseEmitter emitter = new SseEmitter(30 * 60 * 1000L);

        emitter.onCompletion(() -> {
            log.info("SSE 연결 완료 - empId: {}", empId);
            emitters.remove(empId);
        });

        emitter.onTimeout(() -> {
            log.info("SSE 연결 타임아웃 - empId: {}", empId);
            emitters.remove(empId);
        });

        emitter.onError((ex) -> {
            log.error("SSE 연결 에러 - empId: {}", empId, ex);
            emitters.remove(empId);
        });

        emitters.put(empId, emitter);

        try {
            emitter.send(SseEmitter.event()
                    .name("connect")
                    .data("connected"));
        } catch (IOException e) {
            log.error("SSE 초기 메시지 전송 실패", e);
            emitters.remove(empId);
        }

        return emitter;
    }

    public void sendNotificationToUser(String empId, Alarm alarm) {
        log.info("알림 전송 시도 - empId: {}, alarmId: {}", empId, alarm.getAlarmId());

        SseEmitter emitter = emitters.get(empId);
        if (emitter != null) {
            try {
                NotificationDto.NotificationResponse response = NotificationDto.NotificationResponse.from(alarm);
                emitter.send(SseEmitter.event()
                        .id(String.valueOf(alarm.getAlarmId()))
                        .name("notification")
                        .data(response));
                log.info("알림 전송 성공 - empId: {}, alarmId: {}", empId, alarm.getAlarmId());
            } catch (IOException e) {
                log.error("알림 전송 실패 - empId: {}, alarmId: {}", empId, alarm.getAlarmId(), e);
                emitters.remove(empId);
            }
        } else {
            log.debug("SSE 연결이 없음 - empId: {}", empId);
        }
    }

    public void removeConnection(String empId) {
        log.info("SSE 연결 제거 - empId: {}", empId);
        SseEmitter emitter = emitters.remove(empId);
        if (emitter != null) {
            emitter.complete();
        }
    }
}

