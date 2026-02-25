package com.kh.ct.domain.schedule.service;

import com.kh.ct.domain.schedule.dto.EmpScheduleDto;
import com.kh.ct.global.common.CommonEnums;
import org.springframework.security.core.Authentication;

import java.time.YearMonth;
import java.util.List;

public interface EmpScheduleService {
    /**
     * 직원 ID로 배정된 일정 조회
     * @param empId 직원 ID
     * @return 직원 일정 목록
     */
    List<EmpScheduleDto.ListResponse> getEmpSchedules(String empId);

    /**
     * 직원의 월별 일정 조회 (캘린더용)
     * @param empId 직원 ID
     * @param yearMonth 조회할 년월
     * @return 캘린더용 일정 목록
     */
    List<EmpScheduleDto.CalendarResponse> getEmpSchedulesByMonth(String empId, YearMonth yearMonth);

    /**
     * 관리자용: 항공사별, 역할별 직원 일정 조회
     * @param airlineId 항공사 ID
     * @param role 역할 (선택적)
     * @return 직원 일정 목록
     */
    List<EmpScheduleDto.ListResponse> getEmpSchedulesByAirlineAndRole(Long airlineId, CommonEnums.Role role);

    /**
     * 권한 기반 직원 일정 조회
     * - 관리자: 항공사별, 역할별 조회 가능
     * - 직원: 자신의 일정만 조회
     */
    List<EmpScheduleDto.ListResponse> getEmpSchedulesWithAuth(
            Authentication authentication,
            String empId,
            CommonEnums.Role role
    );

    /**
     * 권한 기반 월별 일정 조회 (캘린더용)
     * - 직원: 자신의 일정만 조회
     */
    List<EmpScheduleDto.CalendarResponse> getEmpSchedulesByMonthWithAuth(
            Authentication authentication,
            YearMonth yearMonth
    );

    /**
     * 일정 수정 (관리자만 가능)
     */
    void updateEmpSchedule(Long empScheduleId, EmpScheduleDto.UpdateRequest request, Authentication authentication);
}
