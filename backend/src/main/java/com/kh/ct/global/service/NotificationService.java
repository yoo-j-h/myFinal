package com.kh.ct.global.service;

import com.kh.ct.domain.emp.entity.Emp;
import com.kh.ct.domain.emp.repository.EmpRepository;
import com.kh.ct.global.common.CommonEnums;
import com.kh.ct.global.dto.NotificationDto;
import com.kh.ct.global.entity.Alarm;
import com.kh.ct.global.repository.AlarmRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class NotificationService {

    private final AlarmRepository alarmRepository;
    private final EmpRepository empRepository;

    @Transactional
    public Alarm createNotification(String receiverEmpId, String alarmContent, String alarmType, String alarmLink) {
        log.info("알림 생성 - receiverEmpId: {}, alarmType: {}", receiverEmpId, alarmType);

        Emp receiver = empRepository.findById(receiverEmpId)
                .orElseThrow(() -> new RuntimeException("수신자를 찾을 수 없습니다: " + receiverEmpId));

        Alarm alarm = Alarm.builder()
                .receiver(receiver)
                .alarmContent(alarmContent)
                .alarmType(alarmType)
                .alarmLink(alarmLink)
                .alarmStatus(CommonEnums.CommonStatus.N)
                .build();

        return alarmRepository.save(alarm);
    }

    public Page<NotificationDto.NotificationListResponse> getNotifications(String empId, Pageable pageable) {
        log.info("알림 목록 조회 - empId: {}", empId);
        Page<Alarm> alarms = alarmRepository.findByReceiver_EmpIdOrderByCreateDateDesc(empId, pageable);
        return alarms.map(NotificationDto.NotificationListResponse::from);
    }

    @Transactional
    public void markAsRead(Long alarmId, String empId) {
        log.info("알림 읽음 처리 - alarmId: {}, empId: {}", alarmId, empId);

        Alarm alarm = alarmRepository.findById(alarmId)
                .orElseThrow(() -> new RuntimeException("알림을 찾을 수 없습니다"));

        if (!alarm.getReceiver().getEmpId().equals(empId)) {
            throw new RuntimeException("본인의 알림만 읽음 처리할 수 있습니다");
        }

        Alarm updatedAlarm = Alarm.builder()
                .alarmId(alarm.getAlarmId())
                .receiver(alarm.getReceiver())
                .alarmContent(alarm.getAlarmContent())
                .alarmType(alarm.getAlarmType())
                .alarmLink(alarm.getAlarmLink())
                .alarmStatus(CommonEnums.CommonStatus.Y)
                .build();

        alarmRepository.save(updatedAlarm);
    }

    public long getUnreadCount(String empId) {
        log.info("안읽음 알림 개수 조회 - empId: {}", empId);
        return alarmRepository.countByReceiver_EmpIdAndAlarmStatus(empId, CommonEnums.CommonStatus.N);
    }

    public List<NotificationDto.NotificationResponse> getUnreadNotificationsAfterId(String empId, Long lastEventId) {
        log.info("재연결 후 누락 알림 조회 - empId: {}, lastEventId: {}", empId, lastEventId);
        List<Alarm> alarms = alarmRepository.findUnreadNotificationsAfterId(empId, lastEventId);
        return alarms.stream()
                .map(NotificationDto.NotificationResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteNotification(Long alarmId, String empId) {
        log.info("알림 삭제 - alarmId: {}, empId: {}", alarmId, empId);

        Alarm alarm = alarmRepository.findById(alarmId)
                .orElseThrow(() -> new RuntimeException("알림을 찾을 수 없습니다"));

        if (!alarm.getReceiver().getEmpId().equals(empId)) {
            throw new RuntimeException("본인의 알림만 삭제할 수 있습니다");
        }

        alarmRepository.delete(alarm);
    }
}

