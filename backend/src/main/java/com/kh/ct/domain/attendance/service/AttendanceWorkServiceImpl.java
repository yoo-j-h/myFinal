package com.kh.ct.domain.attendance.service;

import com.kh.ct.domain.attendance.dto.AttendanceWorkDto;
import com.kh.ct.domain.attendance.entity.Attendance;
import com.kh.ct.domain.attendance.repository.AttendanceRepository;
import com.kh.ct.domain.attendance.service.AttendanceWorkService;
import com.kh.ct.domain.emp.entity.Emp;
import com.kh.ct.domain.emp.repository.EmpRepository;
import com.kh.ct.global.common.CommonEnums;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;

@Service
@RequiredArgsConstructor
public class AttendanceWorkServiceImpl implements AttendanceWorkService {

    private static final ZoneId KST = ZoneId.of("Asia/Seoul");

    private final AttendanceRepository attendanceRepository;
    private final EmpRepository empRepository;

    @Override
    @Transactional(readOnly = true)
    public AttendanceWorkDto.TodayRes getToday(String empId) {
        LocalDate today = LocalDate.now(KST);

        return attendanceRepository.findTodayAttendance(empId, today)
                .map(this::toRes)
                .orElseGet(() -> new AttendanceWorkDto.TodayRes(today, null, null, null));
    }

    @Override
    @Transactional
    public AttendanceWorkDto.TodayRes checkIn(String empId) {
        LocalDate today = LocalDate.now(KST);
        LocalTime now = LocalTime.now(KST);

        Attendance att = attendanceRepository.findTodayAttendance(empId, today).orElse(null);

        // 1) 이미 오늘 기록이 있으면: 멱등 check-in
        if (att != null) {
            CommonEnums.AttendanceStatus status =
                    att.getAttendanceStatus() != null ? att.getAttendanceStatus() : CommonEnums.AttendanceStatus.PRESENT;
            att.checkIn(now, status);
            return toRes(att);
        }

        // 2) 없으면 생성
        Emp emp = empRepository.findById(empId)
                .orElseThrow(() -> new IllegalArgumentException("사원 정보가 없습니다. empId=" + empId));

        try {
            Attendance created = Attendance.builder()
                    .attendanceDate(today)
                    .inTime(now)
                    .outTime(null)
                    .attendanceStatus(CommonEnums.AttendanceStatus.PRESENT)
                    .empId(emp)  // 너 Attendance 엔티티 필드가 Emp empId 라서 그대로
                    .build();

            attendanceRepository.save(created);
            return toRes(created);

        } catch (DataIntegrityViolationException e) {
            // 3) 동시성(유니크 충돌): 재조회 후 멱등 처리
            Attendance retry = attendanceRepository.findTodayAttendance(empId, today)
                    .orElseThrow(() -> e);

            CommonEnums.AttendanceStatus status =
                    retry.getAttendanceStatus() != null ? retry.getAttendanceStatus() : CommonEnums.AttendanceStatus.PRESENT;
            retry.checkIn(now, status);

            return toRes(retry);
        }
    }

    @Override
    @Transactional
    public AttendanceWorkDto.TodayRes checkOut(String empId) {
        LocalDate today = LocalDate.now(KST);
        LocalTime now = LocalTime.now(KST);

        Attendance att = attendanceRepository.findTodayAttendance(empId, today)
                .orElseThrow(() -> new IllegalStateException("오늘 근태 기록이 없어 퇴근할 수 없습니다."));

        if (att.getInTime() == null) {
            throw new IllegalStateException("출근 처리 후 퇴근할 수 있습니다.");
        }

        att.checkOut(now); // 멱등
        return toRes(att);
    }

    private AttendanceWorkDto.TodayRes toRes(Attendance a) {
        return new AttendanceWorkDto.TodayRes(
                a.getAttendanceDate(),
                a.getInTime(),
                a.getOutTime(),
                a.getAttendanceStatus()
        );
    }
}