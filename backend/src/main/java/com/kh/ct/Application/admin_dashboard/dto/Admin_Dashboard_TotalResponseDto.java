package com.kh.ct.Application.admin_dashboard.dto;

import com.kh.ct.domain.attendance.entity.Attendance;
import com.kh.ct.domain.emp.entity.Emp;
import com.kh.ct.domain.health.entity.ProgramApply;
import com.kh.ct.domain.schedule.entity.FlySchedule;
import com.kh.ct.domain.schedule.entity.GroundSchedule;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Admin_Dashboard_TotalResponseDto {

    private EmpInfo empInfo;
    private List<AttendanceInfo> attendanceList;
    private Long workingDays;
    private Long totalFlightCount;
    private Long totalFlightHours;
    private HealthInfo healthInfo; // 토탈건강점수
    private List<FlyInfo> flightList;
    private List<GroundInfo> groundScheduleList;
    private List<ProgramInfo> programList;

    private Long totalEmpCount;
    private Long currentWorkingCount;

    private PendingCounts pendingCounts;
    private PendingCounts TotalPendingCounts;
    private Long totalWeekLeaveCount;

    // --- 1. 사원 정보 Inner DTO ---
    @Getter
    @NoArgsConstructor
    public static class EmpInfo {
        private String empId;
        private String empName;
        private String role;
        private Double leaveCount;
        private String empNo;

        public EmpInfo(Emp emp) {
            this.empId = emp.getEmpId();
            this.empName = emp.getEmpName();
            this.role = emp.getRole() != null ? emp.getRole().toString() : null;
            this.leaveCount = emp.getLeaveCount();
            this.empNo = emp.getEmpNo();
        }
    }

    // --- 2. 출결 정보 Inner DTO ---
    @Getter
    @NoArgsConstructor
    public static class AttendanceInfo {
        private Long attendanceId;
        private String attendanceStatus;
        private LocalTime inTime;
        private LocalDate attendanceDate;
        private LocalDateTime createDate;

        public AttendanceInfo(Attendance attendance) {
            this.attendanceId = attendance.getAttendanceId();
            this.attendanceDate = attendance.getAttendanceDate();
            this.attendanceStatus = attendance.getAttendanceStatus() != null ? attendance.getAttendanceStatus().name()
                    : null;
            this.inTime = attendance.getInTime();
            this.createDate = attendance.getCreateDate();
        }
    }

    // --- 3. 비행 스케줄 Inner DTO ---
    @Getter
    @NoArgsConstructor
    public static class FlyInfo {
        private Long flyScheduleId;
        private String flightNumber;
        private String departure;
        private String destination;
        private String flyStartTime;
        private String flyEndTime;
        private String flightStatus;
        private String airplaneType;
        private String gate;

        public FlyInfo(FlySchedule flySchedule) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
            this.flyScheduleId = flySchedule.getFlyScheduleId();
            this.flightNumber = flySchedule.getFlightNumber();
            this.departure = flySchedule.getDeparture();
            this.destination = flySchedule.getDestination();
            this.flightStatus = flySchedule.getFlightStatus() != null ? flySchedule.getFlightStatus().name()
                    : "SCHEDULED";
            this.airplaneType = flySchedule.getAirplaneType();
            this.gate = flySchedule.getGate();
            if (flySchedule.getFlyStartTime() != null)
                this.flyStartTime = flySchedule.getFlyStartTime().format(formatter);
            if (flySchedule.getFlyEndTime() != null)
                this.flyEndTime = flySchedule.getFlyEndTime().format(formatter);
        }
    }

    // --- 4. 지상 업무 Inner DTO ---
    @Getter
    @NoArgsConstructor
    public static class GroundInfo {
        private Long groundScheduleId;
        private String workCode;
        private String scheduleStatus;
        private LocalDate scheduleStartDate;
        private LocalTime scheduleStartTime;
        private LocalTime scheduleEndTime;

        public GroundInfo(GroundSchedule entity) {
            this.groundScheduleId = entity.getGroundScheduleId();
            this.workCode = entity.getWorkCode();
            this.scheduleStatus = entity.getScheduleStatus() != null ? entity.getScheduleStatus().name() : null;
            this.scheduleStartDate = entity.getScheduleStartDate();
            this.scheduleStartTime = entity.getScheduleStartTime();
            this.scheduleEndTime = entity.getScheduleEndTime();
        }
    }

    // --- 5. 건강 프로그램 Inner DTO ---
    @Getter
    @NoArgsConstructor
    public static class ProgramInfo {
        private String programApplyId;
        private String programName;
        private String programDate;
        private String programStartTime;
        private String status;
        private String location;

        public ProgramInfo(ProgramApply pa) {
            this.programApplyId = pa.getProgramApplyId();
            this.programName = decode(pa.getProgramCode());
            this.programDate = pa.getProgramApplyDate().toLocalDate().toString();
            this.programStartTime = pa.getProgramApplyDate().toLocalTime().toString().substring(0, 5);
            this.status = pa.getProgramApplyStatus().name();
            this.location = "사내 보건센터";
        }

        private String decode(String code) {
            if (code == null)
                return "프로그램";
            return switch (code) {
                case "STRESS_CARE" -> "스트레스 상담";
                case "PHYSICAL_TRAINING" -> "체력 교육";
                default -> "건강 관리";
            };
        }
    }

    // --- 6. 건강 지수 Inner DTO ---
    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class HealthInfo {
        private Integer healthPoint;
        private Integer stressPoint;
        private Integer fatiguePoint;
        private Integer physicalPoint;
    }

    @Getter
    @Builder
    @AllArgsConstructor
    public static class PendingCounts {
        private Long leaveCount; // 휴가 신청 대기
        private Long programCount; // 건강 프로그램 대기
        private Long protestCount; // 근태 정정 대기
    }

    @Getter
    @Builder
    @AllArgsConstructor
    public static class TotalPendingCounts {
        private Long total_leaveCount; // 휴가 신청 대기 총 수
        private Long total_programCount; // 건강 프로그램 대기 총 수
        private Long total_protestCount; // 근태 정정 대기 총 수
    }

}