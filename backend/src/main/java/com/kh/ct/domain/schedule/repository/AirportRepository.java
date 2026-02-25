package com.kh.ct.domain.schedule.repository;

import com.kh.ct.domain.schedule.entity.Airport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AirportRepository extends JpaRepository<Airport, String> {
    Optional<Airport> findByAirportCode(String airportCode);
}
