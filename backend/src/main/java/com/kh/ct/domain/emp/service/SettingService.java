package com.kh.ct.domain.emp.service;

import com.kh.ct.domain.emp.dto.SettingDto;

public interface SettingService {
    void updateEmpProfile(String empId, SettingDto dto);
    SettingDto getEmpProfile(String empId);
    void changePassword(String empId, SettingDto dto);
}
