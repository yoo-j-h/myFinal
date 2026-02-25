package com.kh.ct.domain.emp.entity;

import com.kh.ct.domain.schedule.entity.Airport;
import com.kh.ct.global.common.CommonEnums;
import com.kh.ct.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class AirlineAirport extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long AirlineAirportId;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private CommonEnums.CommonStatus routeStatus;

    @JoinColumn(name = "airline_id")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Airline airlineId;

    @JoinColumn(name = "airport_id")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Airport airportId;
}
