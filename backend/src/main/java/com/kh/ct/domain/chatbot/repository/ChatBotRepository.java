package com.kh.ct.domain.chatbot.repository;

import com.kh.ct.domain.schedule.entity.EmpSchedule;
import com.kh.ct.domain.schedule.entity.FlySchedule;
import com.kh.ct.domain.attendance.entity.LeaveApply;
import com.kh.ct.domain.health.entity.EmpHealth;
import java.util.List;
import java.util.Optional;



public interface ChatBotRepository {
    // 1. 비행 스케줄 조회
    List<FlySchedule> findFlyScheduleByEmpId(String empId);

    // 2. 휴가 신청 상태 조회
    List<LeaveApply> findLeaveStatusByEmpId(String empId);

    // 3. 건강 점수 및 상태 조회
    Optional<EmpHealth> findHealthByEmpId(String empId);

    // 4. 최근 알림 조회
    List<Object[]> findRecentAlarmsByEmpId(String empId);

}
