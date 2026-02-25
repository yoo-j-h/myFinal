package com.kh.ct.domain.emp.service;

import com.kh.ct.domain.emp.dto.AirlineDto;
import com.kh.ct.domain.emp.dto.EmpDto;
import com.kh.ct.domain.emp.entity.Emp;

import java.util.List;

public interface EmpService {
    boolean isEmpIdAvailable(String empId);
    Emp register(EmpDto.RegisterRequest request);
    EmpDto getEmpDetail(String empId);
    
    /**
     * 관리자(담당자) 후보 리스트 조회
     */
    java.util.List<EmpDto> getManagerCandidates();
    List<EmpDto.EmployeeListItem> getEmployees(String role, Long airlineId);
    EmpDto updateEmpRoleAndJob(String empId, EmpDto.UpdateRoleAndJobRequest request);

    EmpDto updateMyProfile(String empId, EmpDto.UpdateMyProfileRequest request);
    void changeMyPassword(String empId, String currentPassword, String newPassword);

    /**
     * 직원의 항공사 정보 조회 (테마 적용용)
     */
    AirlineDto.DetailResponse getAirlineByEmpId(String empId);

    EmpDto.FindIdResponse findEmpId(EmpDto.FindIdRequest request);
}
