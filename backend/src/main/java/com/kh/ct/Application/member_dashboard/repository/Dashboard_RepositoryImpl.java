package com.kh.ct.Application.member_dashboard.repository;

import com.kh.ct.domain.attendance.entity.Attendance;
import com.kh.ct.domain.attendance.entity.LeaveApply;
import com.kh.ct.domain.emp.entity.Emp;
import com.kh.ct.domain.health.entity.EmpHealth;
import com.kh.ct.domain.health.entity.ProgramApply;
import com.kh.ct.domain.schedule.entity.FlySchedule;
import com.kh.ct.domain.schedule.entity.GroundSchedule;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
@Primary
public class Dashboard_RepositoryImpl implements Dashboard_Repository {

    private final EntityManager em;

   @Override
    public List<Attendance> findByEmp_Leave_Apply(String empId) {
        // JPQL을 사용하여 Emp 엔티티의 empId 필드를 조건으로 조회
        String jpql = "SELECT a FROM Attendance a WHERE a.empId.empId = :empId ORDER BY a.createDate DESC";

        return em.createQuery(jpql, Attendance.class)
                .setParameter("empId", empId)
                .getResultList();
    }

    @Override
    public Optional<Emp> findByEmp_Emp(String empId) {
        // find() 메서드는 PK를 통해 바로 조회가 가능합니다.
        Emp emp = em.find(Emp.class, empId);
        return Optional.ofNullable(emp);
    }

    @Override
    public Long find_Working(String empId) {
        // JPQL: 결석(ABSENT)이 아닌 데이터의 개수만 조회
        String jpql = "SELECT COUNT(a) FROM Attendance a " +
                "WHERE a.empId.empId = :empId " +
                "AND a.attendanceStatus <> :status";

        return em.createQuery(jpql, Long.class)
                .setParameter("empId", empId)
                .setParameter("status", com.kh.ct.global.common.CommonEnums.AttendanceStatus.ABSENT)
                .getSingleResult();
    }

    @Override
    public Long findTotalFlightMinutes(String empId) {
        String jpql = "SELECT SUM(FUNCTION('TIMESTAMPDIFF', MINUTE, f.flyStartTime, f.flyEndTime)) " +
                "FROM FlySchedule f " +
                "JOIN EmpSchedule es ON f.flyScheduleId = es.empScheduleId " +
                "WHERE es.empId.empId = :empId " +
                "AND f.flightStatus = :status";

        // Long.class 대신 Number.class 사용
        Number result = em.createQuery(jpql, Number.class)
                .setParameter("empId", empId)
                .setParameter("status", com.kh.ct.global.common.CommonEnums.flightStatus.ARRIVED)
                .getSingleResult();

        // 결과가 null이면 0, 아니면 longValue로 변환
        return result != null ? result.longValue() : 0L;
    }

    @Override
    public Long findTotalFlightCount(String empId) {
        String jpql = "SELECT COUNT(f) FROM FlySchedule f " +
                "JOIN EmpSchedule es ON f.flyScheduleId = es.empScheduleId " +
                "WHERE es.empId.empId = :empId " +
                "AND f.flightStatus = :status";

        // COUNT는 보통 Long을 반환하지만, 안전하게 Number로 처리 가능
        Number result = em.createQuery(jpql, Number.class)
                .setParameter("empId", empId)
                .setParameter("status", com.kh.ct.global.common.CommonEnums.flightStatus.ARRIVED)
                .getSingleResult();

        return result != null ? result.longValue() : 0L;
    }

    @Override
    public Optional<EmpHealth> find_Health(String empId) {
        // 가장 최근 등록된 1건의 건강 엔티티 조회
        String jpql = "SELECT h FROM EmpHealth h WHERE h.empId.empId = :empId ORDER BY h.createDate DESC";

        List<EmpHealth> results = em.createQuery(jpql, EmpHealth.class)
                .setParameter("empId", empId)
                .setMaxResults(1)
                .getResultList();

        return results.stream().findFirst();
    }

    @Override
    public List<FlySchedule> findFlySchedulesByEmpId(String empId) {
        // [FlySchedule] -> [FlySchedule_ID (MapsId)] -> [AllSchedule (es)] -> [Emp (empId)]
        // 엔티티 구조에 따라 es.empId.empId 경로로 접근합니다.
        String jpql = "SELECT f FROM FlySchedule f " +
                "JOIN EmpSchedule es ON f.flyScheduleId = es.empScheduleId " +
                "WHERE es.empId.empId = :empId " +
                "ORDER BY f.flyStartTime ASC"; // 시간순 정렬 (대시보드용)

        return em.createQuery(jpql, FlySchedule.class)
                .setParameter("empId", empId)
                .getResultList();
    }

    @Override
    public List<GroundSchedule> findGroundSchedulesByEmpId(String empId) {
        return em.createQuery(
                        "select g from GroundSchedule g where g.empId.empId = :empId " +
                                "order by g.scheduleStartDate asc", GroundSchedule.class)
                .setParameter("empId", empId)
                .setMaxResults(3)
                .getResultList();
    }


    @Override
    public List<ProgramApply> findProgramAppliesByEmpId(String empId, java.time.LocalDateTime start, java.time.LocalDateTime end) {
        // 🚩 날짜와 상태 필터를 제거하고 empId로만 전체 조회
        String jpql = "SELECT pa FROM ProgramApply pa " +
                "WHERE pa.programApplyApplicant.empId = :empId " +
                "ORDER BY pa.programApplyDate DESC"; // 최신 신청 건부터 보이게 DESC로 변경

        return em.createQuery(jpql, ProgramApply.class)
                .setParameter("empId", empId)
                .getResultList();
    }

}

/*
@Override
public List<FlySchedule> findFlySchedulesByEmpId(String empId) {
    // 1. 날짜 범위 설정 (오늘 00:00:00 ~ 내일 23:59:59)
    java.time.LocalDateTime startDateTime = java.time.LocalDate.now().atStartOfDay();
    java.time.LocalDateTime endDateTime = java.time.LocalDate.now().plusDays(1).atTime(23, 59, 59);

    // 2. FlySchedule은 LocalDateTime(flyStartTime)을 사용하므로 시간까지 비교
    String jpql = "SELECT f FROM FlySchedule f " +
            "JOIN EmpSchedule es ON f.flyScheduleId = es.empScheduleId " +
            "WHERE es.empId.empId = :empId " +
            "AND f.flyStartTime BETWEEN :start AND :end " + // 🚩 날짜 필터 추가
            "ORDER BY f.flyStartTime ASC";

    return em.createQuery(jpql, FlySchedule.class)
            .setParameter("empId", empId)
            .setParameter("start", startDateTime)
            .setParameter("end", endDateTime)
            .getResultList();
}

@Override
public List<GroundSchedule> findGroundSchedulesByEmpId(String empId) {
    // 1. 오늘과 내일 날짜 계산
    java.time.LocalDate today = java.time.LocalDate.now();
    java.time.LocalDate tomorrow = today.plusDays(1);

    // 2. GroundSchedule은 LocalDate(scheduleStartDate)를 사용하므로 날짜 비교
    return em.createQuery(
            "SELECT g FROM GroundSchedule g " +
            "WHERE g.empId.empId = :empId " +
            "AND g.scheduleStartDate BETWEEN :startDate AND :endDate " + // 🚩 날짜 필터 추가
            "ORDER BY g.scheduleStartDate ASC, g.scheduleStartTime ASC", GroundSchedule.class)
            .setParameter("empId", empId)
            .setParameter("startDate", today)
            .setParameter("endDate", tomorrow)
            .getResultList(); // .setMaxResults(3)는 제거해도 됩니다 (오늘/내일 데이터만 가져오므로)
}

@Override
    public List<ProgramApply> findProgramAppliesByEmpId(String empId, java.time.LocalDateTime start, java.time.LocalDateTime end) {
        // 🚩 제공해주신 스타일대로 날짜 범위와 사번을 필터링하는 JPQL 작성
        String jpql = "SELECT pa FROM ProgramApply pa " +
                "WHERE pa.programApplyApplicant.empId = :empId " +
                "AND pa.programApplyDate BETWEEN :start AND :end " +
                "AND pa.programApplyStatus = :status " + // 승인된 것만 보고 싶을 경우 추가 (선택사항)
                "ORDER BY pa.programApplyDate ASC";

        return em.createQuery(jpql, ProgramApply.class)
                .setParameter("empId", empId)
                .setParameter("start", start)
                .setParameter("end", end)
                .setParameter("status", com.kh.ct.global.common.CommonEnums.ApplyStatus.APPROVED) // 예: 승인된 일정만
                .getResultList();
    }
* */