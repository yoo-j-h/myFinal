package com.kh.ct.domain.chatbot.repository;
import com.kh.ct.domain.attendance.entity.LeaveApply;
import com.kh.ct.domain.health.entity.EmpHealth;
import com.kh.ct.domain.schedule.entity.FlySchedule;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public class ChatBotRepositoryImpl implements ChatBotRepository{

    @PersistenceContext
    private EntityManager em;

    // 1. 비행 스케줄 (기존 코드 유지 또는 명확하게 수정)
    @Override
    public List<FlySchedule> findFlyScheduleByEmpId(String empId) {
        String jpql = "SELECT efs.flySchedule FROM EmpFlySchedule efs " +
                "WHERE efs.emp.empId = :empId " + // .empId 명시
                "ORDER BY efs.flySchedule.flyStartTime ASC";
        return em.createQuery(jpql, FlySchedule.class)
                .setParameter("empId", empId)
                .setMaxResults(3)
                .getResultList();
    }

    // 2. 휴가 신청 현황 (수정됨)
    @Override
    public List<LeaveApply> findLeaveStatusByEmpId(String empId) {
        String jpql = "SELECT l FROM LeaveApply l " +
                // l.leaveApplyApplicant가 Emp 객체이므로 .empId까지 접근해야 합니다.
                "WHERE l.leaveApplyApplicant.empId = :empId " +
                "ORDER BY l.createDate DESC";
        return em.createQuery(jpql, LeaveApply.class)
                .setParameter("empId", empId)
                .getResultList();
    }

    // 3. 건강 정보 조회 (수정됨)
    @Override
    public Optional<EmpHealth> findHealthByEmpId(String empId) {
        // h.empId가 변수명은 이렇지만 타입은 Emp 객체이므로 .empId 접근 필요
        String jpql = "SELECT h FROM EmpHealth h WHERE h.empId.empId = :empId";
        try {
            return Optional.of(em.createQuery(jpql, EmpHealth.class)
                    .setParameter("empId", empId)
                    .getSingleResult());
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    // 4. 최근 안 읽은 알림 목록 (수정됨)
    @Override
    public List<Object[]> findRecentAlarmsByEmpId(String empId) {
        String jpql = "SELECT a.alarmContent, a.createDate FROM Alarm a " +
                // a.receiver가 Emp 객체이므로 .empId까지 접근
                "WHERE a.receiver.empId = :empId AND a.alarmStatus = 'N' " +
                "ORDER BY a.createDate DESC";
        return em.createQuery(jpql, Object[].class)
                .setParameter("empId", empId)
                .getResultList();
    }
}
