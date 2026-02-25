package com.kh.ct.domain.health.service;

import com.kh.ct.domain.health.dto.HealthDto;

public interface PdfRenderService {
    public byte[] renderHealthReport(HealthDto.HealthReportDto dto, int days);
}
