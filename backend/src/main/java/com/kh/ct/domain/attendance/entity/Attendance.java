package com.kh.ct.domain.attendance.entity;

import com.kh.ct.global.entity.BaseTimeEntity;
import com.kh.ct.global.common.CommonEnums;
import com.kh.ct.domain.emp.entity.Emp;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(
        name = "attendance",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_attendance_emp_date",
                columnNames = {"emp_id", "attendance_date"}
        )
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Attendance extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long attendanceId;

    @Column(nullable = false)
    private LocalDate attendanceDate;

    private LocalTime inTime;

    private LocalTime outTime;


    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private CommonEnums.AttendanceStatus attendanceStatus;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "emp_id", nullable = false )
    private Emp empId;

    // ✅ 출근(멱등)
    public void checkIn(LocalTime now, CommonEnums.AttendanceStatus status) {
        if (this.inTime == null) this.inTime = now;
        if (status != null) this.attendanceStatus = status; // 규칙에 따라 설정
    }

    // ✅ 퇴근(멱등)
    public void checkOut(LocalTime now) {
        if (this.outTime == null) this.outTime = now;
    }

    public void updateAttendance(LocalTime inTime, LocalTime outTime,
                                 CommonEnums.AttendanceStatus status) {

        if (inTime != null) {
            this.inTime = inTime;
        }

        if (outTime != null) {
            this.outTime = outTime;
        }

        if (status != null) {
            this.attendanceStatus = status;
        }
    }
}