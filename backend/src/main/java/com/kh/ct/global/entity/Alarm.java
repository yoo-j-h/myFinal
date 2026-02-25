package com.kh.ct.global.entity;

import com.kh.ct.domain.emp.entity.Emp;
import com.kh.ct.global.common.CommonEnums;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Alarm extends BaseTimeEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long alarmId;

    @Lob
    @Column(nullable = false)
    private String alarmContent;

    @JoinColumn(name = "receiver")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Emp receiver;

    @Column(length = 1)
    @Enumerated(EnumType.STRING)
    private CommonEnums.CommonStatus alarmStatus;

    @Column(length = 50)
    private String alarmType;

    @Column(length = 255)
    private String alarmLink;
}
