package com.kh.ct.domain.attendance.service;

import com.kh.ct.domain.attendance.dto.AttendanceDto;
import com.kh.ct.domain.attendance.entity.Attendance;
import com.kh.ct.domain.attendance.repository.AttendanceRepository;
import com.kh.ct.global.common.CommonEnums;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * 근태 서비스 구현체
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;

    /**
     * 월별 근태 통계 조회
     */
    @Override
    public AttendanceDto.MonthlyStatsRes getMonthlyStats(String empId, int year, int month) {
        log.info("월별 근태 통계 조회 - empId: {}, year: {}, month: {}", empId, year, month);

        // 해당 월의 시작일과 종료일 계산
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
        LocalDate today = LocalDate.now();

        // 오늘의 근태 상태 조회
        String todayStatus = "미출근";
        LocalTime todayInTime = null;
        LocalTime todayOutTime = null;

        Optional<Attendance> todayAttendance = attendanceRepository.findTodayAttendance(empId, today);
        if (todayAttendance.isPresent()) {
            Attendance attendance = todayAttendance.get();
            todayInTime = attendance.getInTime();
            todayOutTime = attendance.getOutTime();

            if (attendance.getOutTime() != null) {
                todayStatus = "퇴근 완료";
            } else if (attendance.getInTime() != null) {
                todayStatus = "근무 중";
            }
        }

        // 월별 지각 횟수
        long lateCount = attendanceRepository.countByStatusInMonth(
                empId, startDate, endDate, CommonEnums.AttendanceStatus.LATE);

        // 월별 결근 횟수
        long absentCount = attendanceRepository.countByStatusInMonth(
                empId, startDate, endDate, CommonEnums.AttendanceStatus.ABSENT);

        // 월별 출근 일수 (PRESENT 상태)
        long presentDaysCount = attendanceRepository.countByStatusInMonth(
                empId, startDate, endDate, CommonEnums.AttendanceStatus.PRESENT);

        // 월별 총 근무시간 계산 (분 -> 시간)
        Long totalMinutes = attendanceRepository.calculateTotalWorkMinutes(empId, startDate, endDate);
        long totalWorkHours = (totalMinutes != null) ? totalMinutes / 60 : 0;

        // 비행시간 (추후 별도 테이블에서 조회 예정, 현재는 총 근무시간 사용)
        long flightHours = totalWorkHours;

        log.info("통계 결과 - 오늘: {}, 출근: {}일, 지각: {}, 결근: {}, 총근무시간: {}h, 비행시간: {}h",
                todayStatus, presentDaysCount, lateCount, absentCount, totalWorkHours, flightHours);

        return AttendanceDto.MonthlyStatsRes.builder()
                .todayStatus(todayStatus)
                .lateCount(lateCount)
                .absentCount(absentCount)
                .totalWorkHours(totalWorkHours)
                .presentDaysCount(presentDaysCount)
                .flightHours(flightHours)
                .todayInTime(todayInTime)
                .todayOutTime(todayOutTime)
                .build();
    }

    /**
     * 월별 캘린더 데이터 조회
     */
    @Override
    public AttendanceDto.CalendarRes getCalendarData(String empId, int year, int month) {
        log.info("월별 캘린더 데이터 조회 - empId: {}, year: {}, month: {}", empId, year, month);

        // 해당 월의 시작일과 종료일 계산
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        // 해당 월의 모든 근태 기록 조회
        List<Attendance> attendanceList = attendanceRepository
                .findByEmpId_EmpIdAndAttendanceDateBetween(empId, startDate, endDate);

        // 날짜별 근태 상태 맵 생성
        Map<Integer, String> attendanceMap = new HashMap<>();
        // 날짜별 상세 정보 맵 생성
        Map<Integer, AttendanceDto.DailyAttendanceDto> dailyDataMap = new HashMap<>();

        for (Attendance attendance : attendanceList) {
            int day = attendance.getAttendanceDate().getDayOfMonth();

            // [수정됨] 별도 메서드 호출 대신 Enum의 .name() 사용 (Null Safety 적용)
            String status = (attendance.getAttendanceStatus() != null)
                    ? attendance.getAttendanceStatus().name()
                    : "UNKNOWN";

            attendanceMap.put(day, status);

            // 상세 정보 추가
            AttendanceDto.DailyAttendanceDto dailyData = AttendanceDto.DailyAttendanceDto.builder()
                    .attendanceId(attendance.getAttendanceId())
                    .attendanceDate(attendance.getAttendanceDate())
                    .inTime(attendance.getInTime())
                    .outTime(attendance.getOutTime())
                    .attendanceStatus(attendance.getAttendanceStatus())
                    .workHours(calculateWorkHours(attendance))
                    .build();
            dailyDataMap.put(day, dailyData);
        }

        log.info("캘린더 데이터 조회 완료 - 총 {}일의 근태 기록", attendanceMap.size());

        return AttendanceDto.CalendarRes.builder()
                .attendanceMap(attendanceMap)
                .dailyDataMap(dailyDataMap)
                .year(year)
                .month(month)
                .build();
    }

    /**
     * 근무시간 계산 헬퍼 메서드
     */
    private Long calculateWorkHours(Attendance attendance) {
        if (attendance.getInTime() != null && attendance.getOutTime() != null) {
            return Duration.between(attendance.getInTime(), attendance.getOutTime()).toHours();
        }
        return null;
    }
}