package com.kh.ct.global.config;

import com.kh.ct.domain.chatbot.repository.ChatBotRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Description;

import java.util.List;
import java.util.function.Function;


@Configuration
public class ChatbotConfig {
    public record EmpRequest(String empId) {}
    public record FlyResponse(String flightNumber, String departure, String destination) {}
    public record LeaveResponse(String type, String status, String startDate) {}
    public record HealthResponse(Integer healthPoint, Integer stressPoint) {}
    public record AlarmResponse(String content, String date) {}
    // 1. 비행 스케줄 조회 기능
    @Bean
    @Description("사원의 ID를 사용하여 예정된 비행 일정(편명, 출발지, 목적지) 목록을 조회합니다.")
    public Function<EmpRequest, List<FlyResponse>> getFlightSchedule(ChatBotRepository repo) {
        return req -> repo.findFlyScheduleByEmpId(req.empId()).stream()
                .map(f -> new FlyResponse(f.getFlightNumber(), f.getDeparture(), f.getDestination()))
                .toList();
    }

    // 2. 휴가 신청 현황 조회 기능
    @Bean
    @Description("사원의 ID를 사용하여 신청한 휴가의 종류와 승인 상태를 확인합니다.")
    public Function<EmpRequest, List<LeaveResponse>> getLeaveStatus(ChatBotRepository repo) {
        return req -> repo.findLeaveStatusByEmpId(req.empId()).stream()
                .map(l -> new LeaveResponse(l.getLeaveApplyCode(), l.getLeaveApplyStatus().name(), l.getLeaveStartDate().toString()))
                .toList();
    }

    // 3. 건강 정보 조회 기능
    @Bean
    @Description("사원의 건강 점수, 스트레스 지수 등 현재의 건강 상태 데이터를 가져옵니다.")
    public Function<EmpRequest, HealthResponse> getHealthInfo(ChatBotRepository repo) {
        return req -> repo.findHealthByEmpId(req.empId())
                .map(h -> new HealthResponse(h.getHealthPoint(), h.getStressPoint()))
                .orElse(null);
    }

    // 4. 최근 알림 조회 기능
    @Bean
    @Description("사원에게 도착한 최근 안 읽은 알림 메시지 목록을 확인합니다.")
    public Function<EmpRequest, List<AlarmResponse>> getRecentAlarms(ChatBotRepository repo) {
        return req -> repo.findRecentAlarmsByEmpId(req.empId()).stream()
                .map(obj -> new AlarmResponse((String)obj[0], obj[1].toString()))
                .toList();
    }
}