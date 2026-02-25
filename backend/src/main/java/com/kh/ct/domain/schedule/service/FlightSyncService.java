package com.kh.ct.domain.schedule.service;

import com.kh.ct.domain.schedule.dto.FlyScheduleDto;

public interface FlightSyncService {
    /**
     * 외부 API 데이터를 가져와서 DB와 동기화
     */
    void syncApiData();

    /**
     * 개별 데이터 하나를 파싱해서 DB에 저장
     */
    void processExternalData(FlyScheduleDto.ExternalFlightData data);
}
