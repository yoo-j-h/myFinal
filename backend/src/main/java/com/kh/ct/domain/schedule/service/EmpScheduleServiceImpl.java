package com.kh.ct.domain.schedule.service;

import com.kh.ct.domain.emp.entity.Emp;
import com.kh.ct.domain.emp.repository.EmpRepository;
import com.kh.ct.domain.schedule.dto.EmpScheduleDto;
import com.kh.ct.domain.schedule.entity.AllSchedule;
import com.kh.ct.domain.schedule.entity.EmpSchedule;
import com.kh.ct.domain.schedule.repository.AllScheduleRepository;
import com.kh.ct.domain.schedule.repository.EmpScheduleRepository;
import com.kh.ct.domain.schedule.repository.EmpFlyScheduleRepository;
import com.kh.ct.global.common.CommonEnums;
import com.kh.ct.global.exception.BusinessException;
import com.kh.ct.global.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpScheduleServiceImpl implements EmpScheduleService {

    private final EmpScheduleRepository empScheduleRepository;
    private final AllScheduleRepository allScheduleRepository;
    private final EmpRepository empRepository;
    private final SecurityUtil securityUtil;
    private final com.kh.ct.domain.schedule.repository.EmpFlyScheduleRepository empFlyScheduleRepository;

    @Override
    public List<EmpScheduleDto.ListResponse> getEmpSchedules(String empId) {
        log.info("직원 일정 조회 요청 - empId: {}", empId);
        
        List<EmpSchedule> empSchedules = empScheduleRepository.findByEmpId(empId);
        
        return EmpScheduleDto.ListResponse.fromList(empSchedules);
    }

    @Override
    public List<EmpScheduleDto.CalendarResponse> getEmpSchedulesByMonth(String empId, YearMonth yearMonth) {
        try {
            if (empId == null || empId.isEmpty()) {
                log.error("empId가 null이거나 비어있습니다.");
                throw BusinessException.badRequest("직원 ID가 필요합니다.");
            }

            if (yearMonth == null) {
                log.warn("yearMonth가 null입니다. 현재 월로 설정합니다.");
                yearMonth = YearMonth.now();
            }

            log.info("직원 월별 일정 조회 요청 - empId: {}, yearMonth: {}", empId, yearMonth);
            
            // 직원 정보 조회 (role 확인용)
            Emp emp = empRepository.findById(empId)
                .orElseThrow(() -> BusinessException.notFound("직원을 찾을 수 없습니다: " + empId));
            
            CommonEnums.Role role = emp.getRole();
            log.info("직원 역할 확인 - empId: {}, role: {}", empId, role);
            
            LocalDateTime startDate = yearMonth.atDay(1).atStartOfDay();
            LocalDateTime endDate = yearMonth.plusMonths(1).atDay(1).atStartOfDay(); // 다음 달 1일 00:00:00까지
            
            List<EmpScheduleDto.CalendarResponse> responses = new ArrayList<>();
            
            // 직군별 분기 처리
            if (role == CommonEnums.Role.PILOT || role == CommonEnums.Role.CABIN_CREW) {
                // 운항직: flights (emp_fly_schedule) + daily (emp_schedule)
                responses = getFlightCrewMonthlySchedule(empId, yearMonth, startDate, endDate, role);
            } else if (role == CommonEnums.Role.GROUND_STAFF || role == CommonEnums.Role.MAINTENANCE) {
                // 지상직: daily (emp_schedule)만
                responses = getGroundStaffMonthlySchedule(empId, yearMonth, startDate, endDate, role);
            } else {
                // 기타 역할: 기본 처리
                responses = getDefaultMonthlySchedule(empId, yearMonth, startDate, endDate, role);
            }
            
            log.info("직원 월별 일정 조회 완료 - empId: {}, yearMonth: {}, role: {}, 조회 건수: {}건", 
                    empId, yearMonth, role, responses.size());
            
            return responses;
        } catch (BusinessException e) {
            log.error("비즈니스 예외 발생 - empId: {}, yearMonth: {}, error: {}", 
                    empId, yearMonth, e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            log.error("직원 월별 일정 조회 중 예외 발생 - empId: {}, yearMonth: {}", 
                    empId, yearMonth, e);
            throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, 
                    "일정 조회 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
    
    /**
     * 운항직(CABIN_CREW/PILOT) 월별 일정 조회
     * 
     * 데이터 소스:
     * 1. 항공편 일정: EmpFlySchedule → FlySchedule → AllSchedule (Single Source of Truth)
     * 2. 일반 일정: EmpSchedule → AllSchedule (FLIGHT 제외)
     * 
     * 병합 규칙:
     * - 같은 날짜에 항공편 일정과 일반 일정이 모두 있으면 항공편 일정 우선
     * - 항공편 일정은 AllSchedule의 startDate/endDate 사용
     */
    private List<EmpScheduleDto.CalendarResponse> getFlightCrewMonthlySchedule(
            String empId, YearMonth yearMonth, LocalDateTime startDate, LocalDateTime endDate, CommonEnums.Role role
    ) {
        // ========================================
        // 1. 항공편 일정 조회 (EmpFlySchedule → FlySchedule → AllSchedule)
        // ========================================
        log.info("========================================");
        log.info("✅ [운항직 일정 조회] 항공편 일정 조회 시작");
        log.info("  - empId: {}", empId);
        log.info("  - 조회 기간: {} ~ {}", startDate, endDate);
        log.info("========================================");
        
        // EmpFlySchedule 조회 (FlySchedule과 AllSchedule JOIN FETCH 포함)
        List<com.kh.ct.domain.schedule.entity.EmpFlySchedule> empFlySchedules = 
            empFlyScheduleRepository.findByEmpIdAndMonth(empId, startDate, endDate);
        
        log.info("✅ [항공편 일정] EmpFlySchedule 조회 완료 - 건수: {}건", empFlySchedules.size());
        
        // EmpFlySchedule → CalendarResponse 변환 (AllSchedule 정보 포함)
        List<EmpScheduleDto.CalendarResponse> flightResponses = empFlySchedules.stream()
            .filter(efs -> {
                if (efs.getFlySchedule() == null) {
                    log.warn("⚠️ EmpFlySchedule에 FlySchedule이 null입니다 - empFlyScheduleId: {}", 
                        efs.getEmpFlyScheduleId());
                    return false;
                }
                
                com.kh.ct.domain.schedule.entity.FlySchedule flight = efs.getFlySchedule();
                
                // AllSchedule 정보 확인 (FlySchedule과 @MapsId 1:1 관계)
                com.kh.ct.domain.schedule.entity.AllSchedule allSchedule = flight.getSchedule();
                if (allSchedule == null) {
                    log.warn("⚠️ FlySchedule에 AllSchedule이 null입니다 - flyScheduleId: {}", 
                        flight.getFlyScheduleId());
                    // AllSchedule이 없어도 FlySchedule의 flyStartTime/flyEndTime 사용 가능
                    if (flight.getFlyStartTime() == null || flight.getFlyEndTime() == null) {
                        return false;
                    }
                }
                
                return true;
            })
            .map(efs -> {
                com.kh.ct.domain.schedule.entity.FlySchedule flight = efs.getFlySchedule();
                com.kh.ct.domain.schedule.entity.AllSchedule allSchedule = flight.getSchedule();
                
                // AllSchedule이 있으면 AllSchedule의 시간 사용, 없으면 FlySchedule의 시간 사용
                LocalDateTime startDateTime = (allSchedule != null && allSchedule.getStartDate() != null) 
                    ? allSchedule.getStartDate() 
                    : flight.getFlyStartTime();
                LocalDateTime endDateTime = (allSchedule != null && allSchedule.getEndDate() != null) 
                    ? allSchedule.getEndDate() 
                    : flight.getFlyEndTime();
                
                Long scheduleId = (allSchedule != null) ? allSchedule.getScheduleId() : null;
                
                return EmpScheduleDto.CalendarResponse.builder()
                    .empScheduleId(null) // emp_fly_schedule에는 empScheduleId가 없음
                    .scheduleId(scheduleId) // AllSchedule의 scheduleId (FlySchedule과 @MapsId로 동일)
                    .empId(empId)
                    .role(role != null ? role.name() : null)
                    .scheduleCode("FLIGHT")
                    .startDate(startDateTime) // AllSchedule 또는 FlySchedule의 시간
                    .endDate(endDateTime)     // AllSchedule 또는 FlySchedule의 시간
                    .title("비행")
                    .flyScheduleId(flight.getFlyScheduleId())
                    .flightNumber(flight.getFlightNumber())
                    .departure(flight.getDeparture())
                    .destination(flight.getDestination())
                    .build();
            })
            .collect(Collectors.toList());
        
        log.info("✅ [항공편 일정] 변환 완료 - 건수: {}건", flightResponses.size());
        
        // ========================================
        // 2. 일반 일정 조회 (EmpSchedule → AllSchedule, FLIGHT 제외)
        // ========================================
        log.info("========================================");
        log.info("✅ [운항직 일정 조회] 일반 일정 조회 시작");
        log.info("  - empId: {}", empId);
        log.info("========================================");
        
        // EmpSchedule 조회 (FLIGHT 제외 - Repository에서 자동 필터링)
        List<EmpSchedule> empSchedules = empScheduleRepository.findByEmpIdAndMonth(empId, startDate, endDate);
        
        log.info("✅ [일반 일정] EmpSchedule 조회 완료 - 건수: {}건 (FLIGHT 제외)", empSchedules.size());
        
        // EmpSchedule → CalendarResponse 변환
        List<EmpScheduleDto.CalendarResponse> dailyResponses = empSchedules.stream()
            .filter(es -> es != null)
            .map(es -> {
                try {
                    EmpScheduleDto.CalendarResponse response = EmpScheduleDto.CalendarResponse.from(es);
                    // 비행 일정 정보는 null로 설정 (일반 일정이므로)
                    response.setFlyScheduleId(null);
                    response.setFlightNumber(null);
                    response.setDeparture(null);
                    response.setDestination(null);
                    return response;
                } catch (Exception e) {
                    log.error("EmpSchedule DTO 변환 실패 - empScheduleId: {}", 
                        es.getEmpScheduleId(), e);
                    return null;
                }
            })
            .filter(response -> response != null)
            .collect(Collectors.toList());
        
        log.info("✅ [일반 일정] 변환 완료 - 건수: {}건", dailyResponses.size());
        
        // ========================================
        // 3. 날짜별 병합 (항공편 일정 우선)
        // ========================================
        log.info("========================================");
        log.info("✅ [운항직 일정 조회] 날짜별 병합 시작");
        log.info("========================================");
        
        Map<java.time.LocalDate, EmpScheduleDto.CalendarResponse> mergedMap = new HashMap<>();
        
        // 일반 일정 먼저 추가
        for (EmpScheduleDto.CalendarResponse daily : dailyResponses) {
            if (daily.getStartDate() != null) {
                java.time.LocalDate date = daily.getStartDate().toLocalDate();
                mergedMap.put(date, daily);
            }
        }
        
        // 항공편 일정 추가 (같은 날짜면 항공편 일정으로 덮어쓰기 - 항공편 우선)
        for (EmpScheduleDto.CalendarResponse flight : flightResponses) {
            if (flight.getStartDate() != null) {
                java.time.LocalDate date = flight.getStartDate().toLocalDate();
                mergedMap.put(date, flight);
            }
        }
        
        List<EmpScheduleDto.CalendarResponse> mergedList = new ArrayList<>(mergedMap.values());
        
        log.info("✅ [운항직 일정 조회] 병합 완료");
        log.info("  - 항공편 일정: {}건", flightResponses.size());
        log.info("  - 일반 일정: {}건", dailyResponses.size());
        log.info("  - 병합 결과: {}건 (같은 날짜는 항공편 우선)", mergedList.size());
        log.info("========================================");
        
        return mergedList;
    }
    
    /**
     * 지상직(GROUND_STAFF/MAINTENANCE) 월별 일정 조회
     * - daily: emp_schedule -> type=SHIFT_D/SHIFT_E/SHIFT_N/OFF
     * - shiftStartTime/shiftEndTime 포함
     */
    private List<EmpScheduleDto.CalendarResponse> getGroundStaffMonthlySchedule(
            String empId, YearMonth yearMonth, LocalDateTime startDate, LocalDateTime endDate, CommonEnums.Role role
    ) {
        List<EmpSchedule> empSchedules = empScheduleRepository.findByEmpIdAndMonth(empId, startDate, endDate);
        
        return empSchedules.stream()
            .filter(es -> es != null)
            .map(es -> {
                try {
                    EmpScheduleDto.CalendarResponse response = EmpScheduleDto.CalendarResponse.from(es);
                    
                    // 교대 근무 시간 정보 설정
                    if (es.getScheduleId() != null) {
                        response.setShiftStartTime(es.getScheduleId().getStartDate());
                        response.setShiftEndTime(es.getScheduleId().getEndDate());
                    }
                    
                    // 비행 일정 정보는 null로 설정
                    response.setFlyScheduleId(null);
                    response.setFlightNumber(null);
                    response.setDeparture(null);
                    response.setDestination(null);
                    
                    return response;
                } catch (Exception e) {
                    log.error("EmpSchedule DTO 변환 실패 - empScheduleId: {}", 
                        es.getEmpScheduleId(), e);
                    return null;
                }
            })
            .filter(response -> response != null)
            .collect(Collectors.toList());
    }
    
    /**
     * 기본 월별 일정 조회 (기타 역할)
     */
    private List<EmpScheduleDto.CalendarResponse> getDefaultMonthlySchedule(
            String empId, YearMonth yearMonth, LocalDateTime startDate, LocalDateTime endDate, CommonEnums.Role role
    ) {
        List<EmpSchedule> empSchedules = empScheduleRepository.findByEmpIdAndMonth(empId, startDate, endDate);
        
        return empSchedules.stream()
            .filter(es -> es != null)
            .map(es -> {
                try {
                    return EmpScheduleDto.CalendarResponse.from(es);
                } catch (Exception e) {
                    log.error("EmpSchedule DTO 변환 실패 - empScheduleId: {}", 
                        es.getEmpScheduleId(), e);
                    return null;
                }
            })
            .filter(response -> response != null)
            .collect(Collectors.toList());
    }

    @Override
    public List<EmpScheduleDto.ListResponse> getEmpSchedulesByAirlineAndRole(Long airlineId, CommonEnums.Role role) {
        log.info("관리자용 직원 일정 조회 요청 - airlineId: {}, role: {}", airlineId, role);
        
        List<EmpSchedule> empSchedules;
        
        // airlineId가 null이면 역할만으로 조회
        if (airlineId == null) {
            if (role != null) {
                log.info("항공사 필터 없이 역할만으로 조회 - role: {}", role);
                empSchedules = empScheduleRepository.findByRole(role);
            } else {
                log.info("전체 일정 조회 - airlineId가 null이므로 빈 리스트 반환 (보안상 전체 조회 제한)");
                // 보안상 airlineId가 null이면 전체 조회를 하지 않고 빈 리스트 반환
                empSchedules = new ArrayList<>();
            }
        } else {
            // airlineId와 role 모두 지정된 경우
            if (role != null) {
                empSchedules = empScheduleRepository.findByAirlineIdAndRole(airlineId, role);
            } else {
                // airlineId만 지정된 경우 (role이 null)
                log.info("항공사만으로 조회 - airlineId: {}", airlineId);
                empSchedules = empScheduleRepository.findByAirlineIdAndRole(airlineId, null);
            }
        }
        
        log.info("조회된 일정 수: {}건 (airlineId: {}, role: {})", empSchedules.size(), airlineId, role);
        
        // 결과가 0건인 경우 상세 로그
        if (empSchedules.isEmpty() && role != null) {
            log.warn("일정이 조회되지 않았습니다. - airlineId: {}, role: {}", airlineId, role);
            
            // 역할만으로 조회 시도 (디버깅용)
            if (airlineId != null) {
                List<EmpSchedule> roleOnlySchedules = empScheduleRepository.findByRole(role);
                log.info("역할만으로 조회 시도 결과: {}건", roleOnlySchedules.size());
            }
        }
        
        return EmpScheduleDto.ListResponse.fromList(empSchedules);
    }

    @Override
    public List<EmpScheduleDto.ListResponse> getEmpSchedulesWithAuth(
            Authentication authentication,
            String empId,
            CommonEnums.Role role
    ) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                throw BusinessException.forbidden("인증이 필요합니다.");
            }

            String authEmpId = authentication.getName();
            log.info("일정 조회 요청 - authEmpId: {}, empId: {}, role: {}", authEmpId, empId, role);
            
            Emp authEmp = empRepository.findById(authEmpId)
                    .orElseThrow(() -> BusinessException.notFound("존재하지 않는 직원입니다. empId=" + authEmpId));

            // 관리자인 경우
            if (authEmp.getRole() == CommonEnums.Role.AIRLINE_ADMIN || 
                authEmp.getRole() == CommonEnums.Role.SUPER_ADMIN) {
                
                Long airlineId = authEmp.getAirlineId() != null ? authEmp.getAirlineId().getAirlineId() : null;
                log.info("관리자 일정 조회 시작 - airlineId: {}, role: {}", airlineId, role);
                
                // 역할이 지정된 경우 로그 추가
                if (role != null) {
                    log.info("역할 필터 적용: {}", role);
                }
                
                List<EmpScheduleDto.ListResponse> result = getEmpSchedulesByAirlineAndRole(airlineId, role);
                log.info("관리자 일정 조회 완료 - 조회 결과: {}건 (airlineId: {}, role: {})", 
                    result.size(), airlineId, role);
                
                // 결과가 0건인 경우 상세 로그
                if (result.isEmpty() && role != null) {
                    log.warn("해당 역할({})의 일정이 없습니다. airlineId: {}", role, airlineId);
                }
                
                return result;
            }
            
            // 일반 직원인 경우: 자신의 일정만 조회
            if (empId != null && !empId.equals(authEmpId)) {
                throw BusinessException.forbidden("자신의 일정만 조회할 수 있습니다.");
            }
            
            return getEmpSchedules(authEmpId);
        } catch (BusinessException e) {
            log.error("비즈니스 예외 발생 - empId: {}, role: {}, error: {}", empId, role, e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            log.error("일정 조회 중 예외 발생 - empId: {}, role: {}", empId, role, e);
            throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, 
                    "일정 조회 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @Override
    public List<EmpScheduleDto.CalendarResponse> getEmpSchedulesByMonthWithAuth(
            Authentication authentication,
            YearMonth yearMonth
    ) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                log.error("인증 실패 - authentication: {}", authentication);
                throw BusinessException.forbidden("인증이 필요합니다.");
            }

            String authEmpId = authentication.getName();
            if (authEmpId == null || authEmpId.isEmpty()) {
                log.error("인증된 사용자 ID가 없습니다 - authentication: {}", authentication);
                throw BusinessException.forbidden("인증된 사용자 정보를 찾을 수 없습니다.");
            }

            if (yearMonth == null) {
                log.warn("yearMonth가 null입니다. 현재 월로 설정합니다.");
                yearMonth = YearMonth.now();
            }

            log.info("직원 월별 일정 조회 요청 (인증) - empId: {}, yearMonth: {}", authEmpId, yearMonth);
            
            List<EmpScheduleDto.CalendarResponse> schedules = getEmpSchedulesByMonth(authEmpId, yearMonth);
            
            // 안전장치: 응답 데이터에 empId가 포함되어 있는지 확인
            long matchingCount = schedules.stream()
                    .filter(s -> s != null && authEmpId.equals(s.getEmpId()))
                    .count();
            
            log.info("캘린더 일정 조회 완료 - 요청 empId: {}, 조회 건수: {}건, 일치하는 empId 건수: {}건", 
                    authEmpId, schedules.size(), matchingCount);
            
            if (matchingCount != schedules.size() && !schedules.isEmpty()) {
                log.warn("⚠️ 경고: 일부 일정의 empId가 요청한 empId와 일치하지 않습니다. 요청: {}, 일치: {}건/{}건", 
                        authEmpId, matchingCount, schedules.size());
            }
            
            return schedules;
        } catch (BusinessException e) {
            log.error("비즈니스 예외 발생 - {}", e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            log.error("캘린더 일정 조회 중 예외 발생 - authentication: {}, yearMonth: {}", 
                    authentication, yearMonth, e);
            throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, 
                    "캘린더 일정 조회 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void updateEmpSchedule(Long empScheduleId, EmpScheduleDto.UpdateRequest request, Authentication authentication) {
        // 관리자 권한 체크
        checkAdminPermission(authentication);
        
        log.info("일정 수정 요청 - empScheduleId: {}, startDate: {}, endDate: {}", 
                empScheduleId, request.getStartDate(), request.getEndDate());
        
        // EmpSchedule 조회
        EmpSchedule empSchedule = empScheduleRepository.findById(empScheduleId)
                .orElseThrow(() -> BusinessException.notFound("존재하지 않는 일정입니다. empScheduleId=" + empScheduleId));
        
        // AllSchedule 수정
        AllSchedule allSchedule = empSchedule.getScheduleId();
        if (allSchedule == null) {
            throw BusinessException.badRequest("일정 정보가 없습니다.");
        }
        
        // AllSchedule 수정 (JPA Dirty Checking 활용)
        allSchedule.updateSchedule(request.getStartDate(), request.getEndDate(), request.getScheduleCode());
        allScheduleRepository.save(allSchedule);
        
        // EmpSchedule의 scheduleCode도 수정
        if (request.getScheduleCode() != null) {
            empSchedule.updateScheduleCode(request.getScheduleCode());
            empScheduleRepository.save(empSchedule);
        }
        
        log.info("일정 수정 완료 - empScheduleId: {}", empScheduleId);
    }

    /**
     * 관리자 권한 체크
     * @deprecated SecurityUtil.checkAdminPermission() 사용 권장
     */
    @Deprecated
    private void checkAdminPermission(Authentication authentication) {
        securityUtil.checkAdminPermission(authentication);
    }
}
