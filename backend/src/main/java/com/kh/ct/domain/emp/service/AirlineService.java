package com.kh.ct.domain.emp.service;

import com.kh.ct.domain.emp.dto.AirlineDto;

import java.util.List;

public interface AirlineService {

    List<AirlineDto.ListResponse> getAllTenants();

    List<AirlineDto.ListResponse> searchTenants(String keyword);

    AirlineDto.DetailResponse getTenantDetail(Long id);

    void updateTenantStatus(Long id, String status);
}

