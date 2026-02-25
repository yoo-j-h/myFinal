package com.kh.ct.domain.schedule.entity;

import com.kh.ct.domain.schedule.entity.EmpFlySchedule;
import com.kh.ct.global.common.CommonEnums;
import com.kh.ct.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "fly_schedule")
public class FlySchedule extends BaseTimeEntity {

    @Id
    @Column(name = "fly_schedule_id")  // ✅ 3단계: 명시적 컬럼 매핑 (Repository 쿼리 검증)
    private Long flyScheduleId;

    /**
     * ALL_SCHEDULE 과 1:1
     * @MapsId를 사용하여 flyScheduleId가 AllSchedule의 scheduleId를 참조
     * PK를 공유하는 표준 JPA 방식
     */
    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false, cascade = CascadeType.ALL)
    @JoinColumn(name = "fly_schedule_id", referencedColumnName = "schedule_id")
    private AllSchedule schedule;
    
    /**
     * AllSchedule과의 연관관계 편의 메서드
     * FlySchedule 생성 시 AllSchedule을 함께 설정
     */
    public void setSchedule(AllSchedule schedule) {
        this.schedule = schedule;
        if (schedule != null && schedule.getScheduleId() != null) {
            this.flyScheduleId = schedule.getScheduleId();
        }
    }

    @Column(name = "airline_id", nullable = true)
    private Long airlineId;

    @Column(name = "flight_number", length = 20)
    private String flightNumber;

    @Column(name = "airplane_type", length = 30)
    private String airplaneType;

    @Column(name = "departure", length = 50)
    private String departure;

    @Column(name = "fly_start_time")
    private LocalDateTime flyStartTime;

    @Column(name = "destination", length = 50)
    private String destination;

    @Column(name = "fly_end_time")
    private LocalDateTime flyEndTime;

    @Column(name = "gate", length = 20)
    private String gate;

    @Column(name = "crew_count")
    private Long crewCount;

    @Enumerated(EnumType.STRING)
    @Column(name = "flight_status", nullable = true)
    private CommonEnums.flightStatus flightStatus;

    @Column(name = "seat_count")
    private Long seatCount;
    
    /**
     * EMP_FLY_SCHEDULE과 1:N 관계
     * 배정된 직원 목록을 가져올 수 있도록 양방향 연관관계 설정
     * JSON 직렬화 시 순환 참조 방지를 위해 @JsonIgnore 추가
     */
    @OneToMany(mappedBy = "flySchedule", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<EmpFlySchedule> empFlySchedules = new ArrayList<>();
}
