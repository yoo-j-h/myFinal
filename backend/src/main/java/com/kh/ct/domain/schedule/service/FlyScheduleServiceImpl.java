package com.kh.ct.domain.schedule.service;

import com.kh.ct.domain.emp.entity.Airline;
import com.kh.ct.domain.emp.entity.Emp;
import com.kh.ct.domain.emp.repository.AirlineRepository;
import com.kh.ct.domain.emp.repository.EmpRepository;
import com.kh.ct.domain.schedule.dto.FlyScheduleDto;
import com.kh.ct.domain.schedule.entity.Airport;
import com.kh.ct.domain.schedule.entity.EmpFlySchedule;
import com.kh.ct.domain.schedule.entity.EmpSchedule;
import com.kh.ct.domain.schedule.entity.FlySchedule;
import com.kh.ct.domain.schedule.repository.AirportRepository;
import com.kh.ct.domain.schedule.repository.AllScheduleRepository;
import com.kh.ct.domain.schedule.repository.EmpFlyScheduleRepository;
import com.kh.ct.domain.schedule.repository.EmpScheduleRepository;
import com.kh.ct.domain.schedule.repository.FlyScheduleRepository;
import com.kh.ct.global.common.CommonEnums;
import com.kh.ct.global.exception.BusinessException;
import com.kh.ct.global.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FlyScheduleServiceImpl implements FlyScheduleService {
    
    private final FlyScheduleRepository flyScheduleRepository;
    private final EmpScheduleRepository empScheduleRepository;
    private final EmpFlyScheduleRepository empFlyScheduleRepository;
    private final AllScheduleRepository allScheduleRepository;
    private final EmpRepository empRepository;
    private final AirlineRepository airlineRepository;
    private final AirportRepository airportRepository;
    private final SecurityUtil securityUtil;
    
    @Override
    public List<FlyScheduleDto.ListResponse> getFlightSchedules(
            Long airlineId,
            String empId,
            LocalDateTime startDate,
            LocalDateTime endDate,
            String departure,
            String destination
    ) {
        List<FlySchedule> schedules;
        try {
            log.info("비행편 목록 조회 요청 - airlineId: {}, empId: {}, startDate: {}, endDate: {}, departure: {}, destination: {}", 
                    airlineId, empId, startDate, endDate, departure, destination);
            
            // ✅ AIRLINE_ADMIN인 경우 airlineId가 null이면 안 됨 (이미 상위에서 설정되어야 함)
            // 주의: empId는 일반 직원용 필터이므로, 관리자 조회 시에는 null일 수 있음
            if (empId == null && airlineId == null) {
                log.warn("⚠️ airlineId와 empId가 모두 null입니다. 전체 비행편이 조회될 수 있습니다.");
            }
            
            // 통합 조회 메서드 사용 (모든 필터 조건을 한 번에 처리)
            schedules = flyScheduleRepository.findWithFilters(
                    empId,
                    airlineId,
                    startDate,
                    endDate,
                    departure != null ? departure.trim() : null,
                    destination != null ? destination.trim() : null
            );
            
            log.info("비행편 목록 조회 완료 - {}건", schedules.size());
            
            // ✅ 조회 결과 검증 로그 (airlineId 필터링 확인)
            if (airlineId != null) {
                long matchedCount = schedules.stream()
                    .filter(fs -> fs.getAirlineId() != null && fs.getAirlineId().equals(airlineId))
                    .count();
                long unmatchedCount = schedules.size() - matchedCount;
                
                if (unmatchedCount > 0) {
                    log.warn("⚠️ airlineId 필터링 검증 실패 - 요청 airlineId: {}, 일치: {}건, 불일치: {}건", 
                        airlineId, matchedCount, unmatchedCount);
                    schedules.stream()
                        .filter(fs -> fs.getAirlineId() == null || !fs.getAirlineId().equals(airlineId))
                        .limit(5)
                        .forEach(fs -> log.warn("  - 불일치 비행편: flightNumber={}, airlineId={}", 
                            fs.getFlightNumber(), fs.getAirlineId()));
                } else {
                    log.info("✅ airlineId 필터링 검증 통과 - 요청 airlineId: {}, 일치: {}건", airlineId, matchedCount);
                }
            }
            
            // 조회된 비행편이 없으면 빈 리스트 반환
            if (schedules.isEmpty()) {
                return List.of();
            }
        } catch (Exception e) {
            log.error("비행편 목록 조회 중 오류 발생 - airlineId: {}, empId: {}", airlineId, empId, e);
            throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, 
                    "비행편 목록 조회 중 오류가 발생했습니다: " + e.getMessage());
        }
        
        // 모든 비행편 ID 목록
        List<Long> flyScheduleIds = schedules.stream()
                .map(FlySchedule::getFlyScheduleId)
                .filter(id -> id != null)
                .collect(Collectors.toList());
        
        // 직원이 배정된 비행편 ID 목록 (isAssignedToMe 판단용)
        Set<Long> assignedScheduleIds = null;
        if (empId != null && !empId.trim().isEmpty()) {
            assignedScheduleIds = empFlyScheduleRepository.findByEmpId(empId).stream()
                    .map(efs -> {
                        if (efs.getFlySchedule() != null) {
                            return efs.getFlySchedule().getFlyScheduleId();
                        }
                        return null;
                    })
                    .filter(id -> id != null)
                    .collect(Collectors.toSet());
        }
        
        // 각 비행편에 배정된 직원 수 조회 (크루 배정 여부 판단용) - 배치 조회로 최적화
        Map<Long, Long> crewCountMap = new java.util.HashMap<>();
        if (!flyScheduleIds.isEmpty()) {
            List<EmpFlySchedule> allEmpFlySchedules = empFlyScheduleRepository.findByFlyScheduleIdIn(flyScheduleIds);
            Map<Long, Long> countMap = allEmpFlySchedules.stream()
                    .collect(Collectors.groupingBy(
                            efs -> {
                                if (efs.getFlySchedule() != null) {
                                    return efs.getFlySchedule().getFlyScheduleId();
                                }
                                return null;
                            },
                            Collectors.counting()
                    ));
            crewCountMap.putAll(countMap);
        }
        
        final Set<Long> finalAssignedScheduleIds = assignedScheduleIds;
        final Map<Long, Long> finalCrewCountMap = crewCountMap;
        
        return schedules.stream()
                .filter(fs -> fs != null && fs.getFlyScheduleId() != null)
                .map(fs -> convertToListResponse(fs, finalAssignedScheduleIds, finalCrewCountMap))
                .filter(response -> response != null)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<FlyScheduleDto.ListResponse> getFlightSchedulesWithAuth(
            Authentication authentication,
            Long airlineId,
            LocalDateTime startDate,
            LocalDateTime endDate,
            String departure,
            String destination
    ) {
        String empId = null;
        Long finalAirlineId = airlineId;
        CommonEnums.Role userRole = null;
        Long userAirlineId = null;
        
        if (authentication != null && authentication.isAuthenticated()) {
            String authEmpId = authentication.getName();
            Emp emp = empRepository.findById(authEmpId)
                    .orElseThrow(() -> BusinessException.notFound("존재하지 않는 직원입니다. empId=" + authEmpId));
            
            userRole = emp.getRole();
            userAirlineId = emp.getAirlineId() != null ? emp.getAirlineId().getAirlineId() : null;
            
            log.info("========================================");
            log.info("비행편 목록 조회 요청 - role: {}, userAirlineId: {}, requestAirlineId: {}", 
                userRole, userAirlineId, airlineId);
            log.info("========================================");
            
            // ADMIN(AIRLINE_ADMIN, SUPER_ADMIN): 전체 비행편 조회 가능
            // PILOT, CABIN_CREW, MAINTENANCE, GROUND_STAFF: 본인 배정 비행편만 조회
            if (emp.getRole() != CommonEnums.Role.AIRLINE_ADMIN && 
                emp.getRole() != CommonEnums.Role.SUPER_ADMIN) {
                // 일반 직원은 본인 배정 비행편만 조회
                empId = authEmpId;
                log.info("일반 직원 비행편 조회 - empId: {} (본인 배정 비행편만)", empId);
            } else {
                // AIRLINE_ADMIN: 자신의 항공사 전체 비행편만 조회 가능 (강제)
                if (emp.getRole() == CommonEnums.Role.AIRLINE_ADMIN) {
                    if (emp.getAirlineId() == null) {
                        log.error("AIRLINE_ADMIN이 항공사 정보가 없습니다. empId: {}", authEmpId);
                        throw BusinessException.badRequest(
                            "항공사 관리자는 항공사 정보가 필요합니다. empId=" + authEmpId);
                    }
                    // ✅ AIRLINE_ADMIN은 반드시 자신의 항공사 비행편만 조회 (프론트에서 보낸 airlineId 무시)
                    finalAirlineId = emp.getAirlineId().getAirlineId();
                    log.info("✅ AIRLINE_ADMIN 비행편 조회 - userAirlineId: {} (강제 필터링, requestAirlineId={} 무시)", 
                        finalAirlineId, airlineId);
                } else if (emp.getRole() == CommonEnums.Role.SUPER_ADMIN) {
                    // SUPER_ADMIN: airlineId가 없으면 전체 조회, 있으면 해당 항공사만 조회
                    if (finalAirlineId == null && emp.getAirlineId() != null) {
                        finalAirlineId = emp.getAirlineId().getAirlineId();
                    }
                    log.info("SUPER_ADMIN 비행편 조회 - appliedAirlineId: {}", finalAirlineId);
                }
            }
        } else {
            log.warn("인증되지 않은 사용자의 비행편 조회 요청");
        }
        
        // ✅ AIRLINE_ADMIN인 경우 finalAirlineId가 null이면 안 됨 (강제 검증)
        if (userRole == CommonEnums.Role.AIRLINE_ADMIN) {
            if (finalAirlineId == null) {
                log.error("❌ AIRLINE_ADMIN인데 finalAirlineId가 null입니다! userAirlineId: {}", userAirlineId);
                throw BusinessException.internalServerError(
                    "AIRLINE_ADMIN 비행편 조회 시 airlineId 필터가 설정되지 않았습니다.");
            }
            if (!finalAirlineId.equals(userAirlineId)) {
                log.error("❌ AIRLINE_ADMIN인데 finalAirlineId({})와 userAirlineId({})가 일치하지 않습니다!", 
                    finalAirlineId, userAirlineId);
                throw BusinessException.internalServerError(
                    String.format("AIRLINE_ADMIN 비행편 조회 시 airlineId 불일치 - finalAirlineId: %d, userAirlineId: %d", 
                        finalAirlineId, userAirlineId));
            }
            log.info("✅ AIRLINE_ADMIN 필터 강제 적용 확인 - finalAirlineId: {}", finalAirlineId);
        }
        
        log.info("========================================");
        log.info("최종 필터 조건 - role: {}, userAirlineId: {}, appliedAirlineId: {}, empId: {}", 
            userRole, userAirlineId, finalAirlineId, empId);
        log.info("========================================");
        
        List<FlyScheduleDto.ListResponse> results = getFlightSchedules(finalAirlineId, empId, startDate, endDate, departure, destination);
        
        // ✅ AIRLINE_ADMIN인 경우 추가 필터링 (Repository 쿼리 결과를 한 번 더 필터링)
        if (userRole == CommonEnums.Role.AIRLINE_ADMIN && userAirlineId != null) {
            // effectively final 변수로 복사 (람다 표현식에서 사용)
            final Long finalUserAirlineIdForValidation = userAirlineId;
            
            // Repository 쿼리 결과에서 airlineId가 일치하지 않는 항목 제거
            List<FlyScheduleDto.ListResponse> filteredResults = results.stream()
                .filter(r -> {
                    if (r == null) return false;
                    Long resultAirlineId = r.getAirlineId();
                    return resultAirlineId != null && resultAirlineId.equals(finalUserAirlineIdForValidation);
                })
                .collect(Collectors.toList());
            
            // 필터링된 결과와 원본 결과 비교
            if (filteredResults.size() != results.size()) {
                int removedCount = results.size() - filteredResults.size();
                log.error("========================================");
                log.error("❌ AIRLINE_ADMIN 필터링: Repository 쿼리 결과에서 {}건의 잘못된 항목 제거됨!", removedCount);
                log.error("  - userAirlineId: {}", userAirlineId);
                log.error("  - 원본 결과 수: {}건", results.size());
                log.error("  - 필터링 후 결과 수: {}건", filteredResults.size());
                
                // 제거된 항목 로그 출력
                results.stream()
                    .filter(r -> {
                        if (r == null) return true;
                        Long resultAirlineId = r.getAirlineId();
                        return resultAirlineId == null || !resultAirlineId.equals(finalUserAirlineIdForValidation);
                    })
                    .forEach(r -> log.error("  - 제거된 비행편: flightNumber={}, airlineId={}", 
                        r != null ? r.getFlightNumber() : "null",
                        r != null ? r.getAirlineId() : "null"));
                log.error("========================================");
            }
            
            // 필터링된 결과 사용
            results = filteredResults;
            
            // ✅ 최종 검증: 모든 결과의 airlineId가 일치하는지 확인
            boolean allMatch = results.stream()
                .allMatch(r -> r != null && r.getAirlineId() != null && r.getAirlineId().equals(finalUserAirlineIdForValidation));
            
            if (!allMatch) {
                log.error("❌ AIRLINE_ADMIN 최종 검증 실패 - 일부 결과의 airlineId가 userAirlineId({})와 일치하지 않습니다!", 
                    userAirlineId);
            } else {
                log.info("✅ AIRLINE_ADMIN 최종 검증 통과 - 모든 결과({}건)의 airlineId가 {}와 일치합니다.", 
                    results.size(), userAirlineId);
            }
        }
        
        return results;
    }

    @Override
    public FlyScheduleDto getFlightScheduleDetail(Long flyScheduleId, String empId) {
        if (flyScheduleId == null) {
            throw BusinessException.badRequest("비행편 ID가 필요합니다.");
        }
        
        FlySchedule flySchedule;
        try {
            // FlySchedule 조회 (JOIN FETCH로 AllSchedule, EmpFlySchedule, Emp 함께 로드 - N+1 문제 방지)
            Optional<FlySchedule> flyScheduleOpt = flyScheduleRepository.findByFlyScheduleIdWithCrew(flyScheduleId);
            if (!flyScheduleOpt.isPresent()) {
                flyScheduleOpt = flyScheduleRepository.findByFlyScheduleId(flyScheduleId);
            }
            
            flySchedule = flyScheduleOpt
                    .orElseThrow(() -> BusinessException.notFound("해당 비행편이 존재하지 않습니다. flyScheduleId=" + flyScheduleId));
            
            log.info("비행편 상세 조회 - flyScheduleId: {}, flightNumber: {}", flyScheduleId, 
                    flySchedule.getFlightNumber() != null ? flySchedule.getFlightNumber() : "N/A");
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("비행편 상세 조회 중 오류 발생 - flyScheduleId: {}", flyScheduleId, e);
            throw new BusinessException(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR, 
                    "비행편 상세 조회 중 오류가 발생했습니다: " + e.getMessage());
        }
        
        // 권한 검증: 일반 직원은 본인이 배정된 항공편만 조회 가능
        if (empId != null && !empId.isEmpty()) {
            Emp emp = empRepository.findById(empId)
                    .orElseThrow(() -> BusinessException.notFound("직원 정보를 찾을 수 없습니다. empId=" + empId));
            
            // 관리자가 아닌 경우, 본인이 배정된 항공편인지 확인
            if (emp.getRole() != CommonEnums.Role.AIRLINE_ADMIN && 
                emp.getRole() != CommonEnums.Role.SUPER_ADMIN) {
                boolean isAssigned = false;
                
                // ✅ EmpFlySchedule만 확인 (Single Source of Truth)
                // FLIGHT 일정은 EmpFlySchedule에서만 관리하므로 EmpSchedule 조회 제거
                List<EmpFlySchedule> empFlySchedules = empFlyScheduleRepository.findByFlyScheduleIdAndEmpId(flyScheduleId, empId);
                if (!empFlySchedules.isEmpty()) {
                    isAssigned = true;
                }
                
                if (!isAssigned) {
                    throw BusinessException.forbidden("본인이 배정된 항공편만 조회할 수 있습니다.");
                }
            }
        }
        
        // 크루 멤버 조회 (EmpFlySchedule 우선 조회)
        // EmpFlySchedule: 수동 배정 및 자동 배정 시스템에서 생성된 모든 승무원 정보 포함
        // EmpSchedule: 자동 배정 시스템에서 생성된 정보 (EmpFlySchedule과 중복될 수 있음)
        
        // ✅ 2단계: Repository에서 직접 조회 (가장 확실한 방법)
        log.info("========================================");
        log.info("✅ [서비스] EmpFlySchedule 조회 시작");
        log.info("  - flyScheduleId: {}", flyScheduleId);
        log.info("  - 실행될 JPQL: SELECT efs FROM EmpFlySchedule efs JOIN FETCH efs.emp emp LEFT JOIN FETCH emp.departmentId dept WHERE efs.flySchedule.flyScheduleId = :flyScheduleId");
        log.info("  - DB 직접 확인 SQL: SELECT * FROM emp_fly_schedule WHERE fly_schedule_id = {}", flyScheduleId);
        
        // ✅ DB 직접 확인 (네이티브 쿼리로 실제 데이터 존재 여부 확인)
        Long dbCount = empFlyScheduleRepository.countByFlyScheduleIdNative(flyScheduleId);
        log.info("  - ✅ DB 직접 확인 (네이티브 쿼리): {}건", dbCount);
        
        // ✅ 추가: DB에 데이터가 있는데도 조회가 안 되는 경우를 대비한 상세 로그
        if (dbCount > 0) {
            log.info("  - ✅ DB에 데이터가 존재합니다! ({}건)", dbCount);
            log.info("  - 확인 SQL: SELECT * FROM emp_fly_schedule WHERE fly_schedule_id = {};", flyScheduleId);
        } else {
            log.error("  - ❌ DB에 데이터가 없습니다! (0건)");
            log.error("  - 원인: ScheduleGenerationService에서 EmpFlySchedule 저장이 안 되었을 가능성");
            log.error("  - 확인 방법:");
            log.error("    1) 일정 배정이 실제로 실행되었는지 확인");
            log.error("    2) ScheduleGenerationService 로그에서 'EmpFlySchedule 저장 완료' 메시지 확인");
            log.error("    3) 트랜잭션 롤백 여부 확인");
        }
        
        List<EmpFlySchedule> empFlySchedules = empFlyScheduleRepository.findByFlyScheduleId(flyScheduleId);
        
        log.info("✅ [서비스] EmpFlySchedule 조회 완료");
        log.info("  - Repository 조회 결과: {}건", empFlySchedules.size());
        
        // ✅ 추가: DB에는 있는데 Repository 조회가 안 되는 경우 상세 로그
        if (dbCount > 0 && empFlySchedules.isEmpty()) {
            log.error("  ⚠️ CRITICAL: DB에는 {}건이 있지만 Repository 조회 결과가 0건입니다!", dbCount);
            log.error("  - 원인 가능성:");
            log.error("    1) Repository 쿼리 문제 (JOIN 조건 오류)");
            log.error("    2) 엔티티 매핑 문제 (flySchedule 필드 매핑 오류)");
            log.error("    3) LAZY 로딩 문제");
            log.error("  - 확인 SQL:");
            log.error("    SELECT efs.*, e.emp_id, e.emp_name, fs.fly_schedule_id");
            log.error("    FROM emp_fly_schedule efs");
            log.error("    LEFT JOIN emp e ON efs.emp_id = e.emp_id");
            log.error("    LEFT JOIN fly_schedule fs ON efs.fly_schedule_id = fs.fly_schedule_id");
            log.error("    WHERE efs.fly_schedule_id = {};", flyScheduleId);
        }
        
        // ✅ 2단계: DB 직접 검증 로그
        if (empFlySchedules.isEmpty()) {
            log.error("❌ [서비스] EmpFlySchedule 조회 결과가 비어있습니다!");
            log.error("  - flyScheduleId: {}", flyScheduleId);
            log.error("  - DB 직접 확인 결과: {}건", dbCount);
            
            if (dbCount > 0) {
                log.error("  ⚠️ DB에는 데이터가 있지만 Repository 조회가 실패했습니다!");
                log.error("  - 원인: Repository 쿼리 문제 또는 엔티티 매핑 문제");
                log.error("  - 확인 SQL: SELECT * FROM emp_fly_schedule WHERE fly_schedule_id = {};", flyScheduleId);
            } else {
                log.error("  ⚠️ DB에도 데이터가 없습니다!");
                log.error("  - 원인: ScheduleGenerationService에서 저장이 안 되었거나 롤백되었을 가능성");
                log.error("  - 확인 방법:");
                log.error("    1) ScheduleGenerationService 로그 확인");
                log.error("    2) 트랜잭션 롤백 여부 확인");
                log.error("    3) 일정 배정이 실제로 실행되었는지 확인");
            }
        } else {
            log.info("  ✅ DB에서 {}건 조회 성공 (DB 직접 확인: {}건)", empFlySchedules.size(), dbCount);
        }
        log.info("========================================");
        
        // 엔티티에서도 확인 (디버깅용)
        if (flySchedule.getEmpFlySchedules() != null) {
            log.info("FlySchedule 엔티티의 empFlySchedules 크기: {}건", flySchedule.getEmpFlySchedules().size());
            if (!flySchedule.getEmpFlySchedules().isEmpty() && empFlySchedules.isEmpty()) {
                log.warn("⚠️ 엔티티에는 있지만 Repository 조회 결과가 비어있습니다!");
                empFlySchedules = new ArrayList<>(flySchedule.getEmpFlySchedules());
            }
        } else {
            log.warn("FlySchedule 엔티티의 empFlySchedules가 null입니다.");
        }
        
        // 상세 로그
        if (!empFlySchedules.isEmpty()) {
            log.info("=== EmpFlySchedule 상세 목록 ===");
            for (EmpFlySchedule efs : empFlySchedules) {
                Emp emp = efs.getEmp();
                log.info("  - empFlyScheduleId: {}, empId: {}, empName: {}, role: {}", 
                    efs.getEmpFlyScheduleId(),
                    emp != null ? emp.getEmpId() : "null",
                    emp != null ? emp.getEmpName() : "null",
                    emp != null && emp.getRole() != null ? emp.getRole().name() : "null");
            }
        } else {
            log.warn("⚠️ EmpFlySchedule이 조회되지 않았습니다! flyScheduleId: {}", flyScheduleId);
        }
        
        log.info("최종 EmpFlySchedule 조회 결과: {}건", empFlySchedules.size());
        
        // ✅ FLIGHT 일정은 EmpFlySchedule에서만 관리 (Single Source of Truth)
        // EmpSchedule 조회 제거 - FLIGHT 일정은 EmpFlySchedule에만 저장됨
        log.info("=== 최종 승무원 조회 결과 ===");
        log.info("비행편 {} - EmpFlySchedule: {}건 (Single Source of Truth - FLIGHT는 EmpFlySchedule만 사용)", 
            flyScheduleId, empFlySchedules.size());
        
        // ✅ crewMembers DTO 생성 (EmpFlySchedule만 사용)
        log.info("========================================");
        log.info("✅ [서비스] crewMembers DTO 생성 시작");
        log.info("  - EmpFlySchedule 조회 결과: {}건", empFlySchedules.size());
        
        Set<String> addedEmpIds = new HashSet<>();
        List<FlyScheduleDto.CrewMemberResponse> crewMembers = new ArrayList<>();
        
        // 1. EmpFlySchedule에서 조회한 승무원 추가 (수동 배정)
        int empFlyScheduleProcessed = 0;
        int empFlyScheduleSkipped = 0;
        for (EmpFlySchedule efs : empFlySchedules) {
            Emp emp = efs.getEmp();
            if (emp == null) {
                log.warn("  ⚠️ EmpFlySchedule의 emp가 null입니다 - empFlyScheduleId: {}", efs.getEmpFlyScheduleId());
                empFlyScheduleSkipped++;
                continue;
            }
            if (emp.getEmpId() == null) {
                log.warn("  ⚠️ EmpFlySchedule의 emp.empId가 null입니다 - empFlyScheduleId: {}", efs.getEmpFlyScheduleId());
                empFlyScheduleSkipped++;
                continue;
            }
            if (addedEmpIds.contains(emp.getEmpId())) {
                log.debug("  - EmpFlySchedule의 empId가 이미 추가됨 - empId: {}", emp.getEmpId());
                empFlyScheduleSkipped++;
                continue;
            }
            
            String departmentName = null;
            if (emp.getDepartmentId() != null) {
                departmentName = emp.getDepartmentId().getDepartmentName();
            }
            
            String empStatus = null;
            if (emp.getEmpStatus() != null) {
                empStatus = emp.getEmpStatus().name();
            }
            
            FlyScheduleDto.CrewMemberResponse crewMember = FlyScheduleDto.CrewMemberResponse.builder()
                    .empId(emp.getEmpId())
                    .empName(emp.getEmpName())
                    .role(emp.getRole() != null ? emp.getRole().name() : null)
                    .job(emp.getJob())
                    .departmentName(departmentName)
                    .empStatus(empStatus)
                    .empFlyScheduleId(efs.getEmpFlyScheduleId())
                    .build();
            
            crewMembers.add(crewMember);
            addedEmpIds.add(emp.getEmpId());
            empFlyScheduleProcessed++;
            
            log.info("  ✅ EmpFlySchedule에서 crewMember 추가 - empId: {}, empName: {}, role: {}", 
                    emp.getEmpId(), emp.getEmpName(), emp.getRole() != null ? emp.getRole().name() : "null");
        }
        
        log.info("  - EmpFlySchedule 처리 결과: {}건 추가, {}건 스킵", empFlyScheduleProcessed, empFlyScheduleSkipped);
        
        // ✅ EmpSchedule 조회 제거 - FLIGHT 일정은 EmpFlySchedule에서만 관리 (Single Source of Truth)
        
        // 역할별 정렬 (PILOT -> CABIN_CREW -> 기타)
        crewMembers.sort((a, b) -> {
            String roleA = a.getRole() != null ? a.getRole() : "";
            String roleB = b.getRole() != null ? b.getRole() : "";
            
            // PILOT 우선, 그 다음 CABIN_CREW, 나머지는 알파벳 순
            int priorityA = roleA.equals("PILOT") ? 0 : (roleA.equals("CABIN_CREW") ? 1 : 2);
            int priorityB = roleB.equals("PILOT") ? 0 : (roleB.equals("CABIN_CREW") ? 1 : 2);
            
            if (priorityA != priorityB) {
                return Integer.compare(priorityA, priorityB);
            }
            
            // 같은 우선순위면 이름순
            String nameA = a.getEmpName() != null ? a.getEmpName() : "";
            String nameB = b.getEmpName() != null ? b.getEmpName() : "";
            return nameA.compareTo(nameB);
        });
        
        // 항공사 정보 (FlySchedule의 airlineId 사용)
        Long airlineId = flySchedule.getAirlineId();
        String airlineName = null;
        if (airlineId != null) {
            airlineName = airlineRepository.findById(airlineId)
                    .map(Airline::getAirlineName)
                    .orElse(null);
        }
        
        // 시간 포맷팅
        String departureTime = formatTime(flySchedule.getFlyStartTime());
        String arrivalTime = formatTime(flySchedule.getFlyEndTime());
        String duration = calculateDuration(
            flySchedule.getFlyStartTime(),
            flySchedule.getFlyEndTime(),
            flySchedule.getDeparture(),
            flySchedule.getDestination()
        );
        
        log.info("=== 최종 crewMembers 집계 ===");
        log.info("crewMembers 수: {}건", crewMembers.size());
        if (!crewMembers.isEmpty()) {
            log.info("배정된 승무원 목록:");
            for (FlyScheduleDto.CrewMemberResponse member : crewMembers) {
                log.info("  - empId: {}, empName: {}, role: {}, department: {}, empFlyScheduleId: {}", 
                    member.getEmpId(), member.getEmpName(), member.getRole(), 
                    member.getDepartmentName(), member.getEmpFlyScheduleId());
            }
        } else {
            log.warn("⚠️ 배정된 승무원이 없습니다. flyScheduleId: {}", flyScheduleId);
            log.warn("  - EmpFlySchedule 조회: {}건 (FLIGHT는 EmpFlySchedule만 사용)", empFlySchedules.size());
        }
        
        // DTO 생성 (crewMembers는 빈 리스트여도 반환 - 프론트엔드에서 처리 가능하도록)
        FlyScheduleDto dto = FlyScheduleDto.builder()
                .flyScheduleId(flySchedule.getFlyScheduleId())
                .flightNumber(flySchedule.getFlightNumber())
                .airplaneType(flySchedule.getAirplaneType())
                .departure(flySchedule.getDeparture())
                .flyStartTime(flySchedule.getFlyStartTime())
                .destination(flySchedule.getDestination())
                .flyEndTime(flySchedule.getFlyEndTime())
                .gate(flySchedule.getGate())
                .crewCount(flySchedule.getCrewCount() != null ? flySchedule.getCrewCount().intValue() : null)
                .flightStatus(flySchedule.getFlightStatus())
                .seatCount(flySchedule.getSeatCount() != null ? flySchedule.getSeatCount().intValue() : null)
                .crewMembers(crewMembers) // 빈 리스트도 반환 (프론트엔드에서 length 체크 가능)
                .airlineId(airlineId)
                .airlineName(airlineName)
                .departureTime(departureTime)
                .arrivalTime(arrivalTime)
                .duration(duration)
                .build();
        
        // ✅ 4단계: DTO 최종 검증 로그
        log.info("========================================");
        log.info("✅ [서비스] FlyScheduleDto 최종 검증");
        log.info("  - flyScheduleId: {}", flyScheduleId);
        log.info("  - crewMembers 필드 존재 여부: {}", dto.getCrewMembers() != null ? "존재" : "null");
        log.info("  - crewMembers 크기: {}", dto.getCrewMembers() != null ? dto.getCrewMembers().size() : 0);
        
        if (dto.getCrewMembers() != null && !dto.getCrewMembers().isEmpty()) {
            log.info("  ✅ crewMembers에 데이터가 있습니다!");
            log.info("  - 첫 번째 crew: empId={}, empName={}, role={}", 
                    dto.getCrewMembers().get(0).getEmpId(),
                    dto.getCrewMembers().get(0).getEmpName(),
                    dto.getCrewMembers().get(0).getRole());
        } else {
            log.error("  ❌ crewMembers가 비어있거나 null입니다!");
            log.error("  - 원인 가능성:");
            log.error("    1) DB에 emp_fly_schedule 데이터가 없음");
            log.error("    2) Repository 쿼리 문제");
            log.error("    3) Emp 엔티티 매핑 문제");
        }
        log.info("========================================");
        
        return dto;
    }

    @Override
    public FlyScheduleDto getFlightScheduleDetailWithAuth(Authentication authentication, Long flyScheduleId) {
        String empId = null;
        Long requiredAirlineId = null;
        
        if (authentication != null && authentication.isAuthenticated()) {
            String authEmpId = authentication.getName();
            Emp emp = empRepository.findById(authEmpId)
                    .orElseThrow(() -> BusinessException.notFound("존재하지 않는 직원입니다. empId=" + authEmpId));
            
            // AIRLINE_ADMIN: 자신의 항공사 비행편만 조회 가능 (강제)
            if (emp.getRole() == CommonEnums.Role.AIRLINE_ADMIN) {
                if (emp.getAirlineId() == null) {
                    throw BusinessException.badRequest(
                        "항공사 관리자는 항공사 정보가 필요합니다. empId=" + authEmpId);
                }
                requiredAirlineId = emp.getAirlineId().getAirlineId();
                log.info("AIRLINE_ADMIN 비행편 상세 조회 - flyScheduleId: {}, requiredAirlineId: {}", 
                    flyScheduleId, requiredAirlineId);
            } else if (emp.getRole() != CommonEnums.Role.SUPER_ADMIN) {
                // 일반 직원은 본인 배정 비행편만 조회
                empId = authEmpId;
            }
            // SUPER_ADMIN은 제한 없음
        }
        
        FlyScheduleDto detail = getFlightScheduleDetail(flyScheduleId, empId);
        
        // AIRLINE_ADMIN 권한 검증: 해당 항공사의 비행편인지 확인
        if (requiredAirlineId != null && detail != null) {
            // FlySchedule에서 airlineId 확인
            Optional<FlySchedule> flyScheduleOpt = flyScheduleRepository.findById(flyScheduleId);
            if (flyScheduleOpt.isPresent()) {
                FlySchedule flySchedule = flyScheduleOpt.get();
                Long flightAirlineId = flySchedule.getAirlineId();
                
                if (flightAirlineId == null || !flightAirlineId.equals(requiredAirlineId)) {
                    throw BusinessException.forbidden(
                        "해당 항공사의 비행편만 조회할 수 있습니다. 요청한 airlineId: " + requiredAirlineId + 
                        ", 비행편의 airlineId: " + flightAirlineId);
                }
            }
        }
        
        return detail;
    }
    
    private FlyScheduleDto.ListResponse convertToListResponse(FlySchedule fs, Set<Long> assignedScheduleIds, Map<Long, Long> crewCountMap) {
        if (fs == null || fs.getFlyScheduleId() == null) {
            return null;
        }
        
        try {
            // 시간 포맷팅 (null 체크)
            String departureTime = formatTime(fs.getFlyStartTime());
            String arrivalTime = formatTime(fs.getFlyEndTime());
            String duration = calculateDuration(
                fs.getFlyStartTime(), 
                fs.getFlyEndTime(),
                fs.getDeparture(),
                fs.getDestination()
            );
            
            // 크루 배정 여부 (실제 EmpFlySchedule에서 조회한 배정 직원 수로 판단)
            Long crewCount = crewCountMap.getOrDefault(fs.getFlyScheduleId(), 0L);
            boolean crewAssigned = crewCount > 0;
            
            // 본인 배정 여부 (flyScheduleId로 판단)
            boolean isAssignedToMe = assignedScheduleIds != null 
                    && assignedScheduleIds.contains(fs.getFlyScheduleId());
            
            // ✅ 항공사 정보 조회 (airlineId 기반, fallback 금지)
            Long airlineId = fs.getAirlineId();
            String airlineName = null;
            
            if (airlineId != null) {
                try {
                    // ✅ 반드시 airline_id 기반 조인 결과로 세팅 (fallback 금지)
                    airlineName = airlineRepository.findById(airlineId)
                            .map(Airline::getAirlineName)
                            .orElse(null); // fallback 제거 - null이면 null 반환
                    
                    if (airlineName == null) {
                        log.warn("⚠️ airlineId에 해당하는 항공사를 찾을 수 없습니다 - airlineId: {}, flightNumber: {}", 
                            airlineId, fs.getFlightNumber());
                    }
                } catch (Exception e) {
                    log.error("항공사 정보 조회 중 오류 발생 - airlineId: {}, flightNumber: {}", 
                        airlineId, fs.getFlightNumber(), e);
                    airlineName = null;
                }
            } else {
                log.warn("⚠️ 비행편의 airlineId가 null입니다 - flyScheduleId: {}, flightNumber: {}", 
                    fs.getFlyScheduleId(), fs.getFlightNumber());
            }
            
            return FlyScheduleDto.ListResponse.builder()
                    .flyScheduleId(fs.getFlyScheduleId())
                    .flightNumber(fs.getFlightNumber())
                    .departure(fs.getDeparture())
                    .destination(fs.getDestination())
                    .flyStartTime(fs.getFlyStartTime())
                    .flyEndTime(fs.getFlyEndTime())
                    .flightStatus(fs.getFlightStatus())
                    .crewCount(fs.getCrewCount() != null ? fs.getCrewCount().intValue() : null)
                    .crewAssigned(crewAssigned)
                    .isAssignedToMe(isAssignedToMe)
                    .departureTime(departureTime)
                    .arrivalTime(arrivalTime)
                    .duration(duration)
                    .airlineId(airlineId)
                    .airlineName(airlineName)
                    .build();
        } catch (Exception e) {
            log.error("비행편 DTO 변환 중 오류 발생 - flyScheduleId: {}, flightNumber: {}", 
                fs != null ? fs.getFlyScheduleId() : "null",
                fs != null ? fs.getFlightNumber() : "null", e);
            // 예외 발생 시 null 반환하여 해당 항목만 필터링
            return null;
        }
    }
    
    private String formatTime(LocalDateTime dateTime) {
        if (dateTime == null) return "";
        return dateTime.format(DateTimeFormatter.ofPattern("HH:mm"));
    }
    
    /**
     * 비행 시간 계산 (타임존 고려)
     * 출발지와 도착지의 타임존을 고려하여 정확한 비행 시간을 계산합니다.
     */
    private String calculateDuration(LocalDateTime start, LocalDateTime end, String departureCode, String destinationCode) {
        if (start == null || end == null) return "";
        
        try {
            // 출발지 타임존 조회
            ZoneId departureZone = getZoneId(departureCode);
            // 도착지 타임존 조회
            ZoneId destinationZone = getZoneId(destinationCode);
            
            // LocalDateTime을 각 공항의 타임존으로 ZonedDateTime으로 변환
            ZonedDateTime departureZoned = start.atZone(departureZone);
            ZonedDateTime arrivalZoned = end.atZone(destinationZone);
            
            // UTC로 변환하여 Duration 계산
            Instant departureInstant = departureZoned.toInstant();
            Instant arrivalInstant = arrivalZoned.toInstant();
            
            Duration duration = Duration.between(departureInstant, arrivalInstant);
            long hours = duration.toHours();
            long minutes = Math.abs(duration.toMinutes() % 60);
            
            if (hours > 0 && minutes > 0) {
                return hours + "시간 " + minutes + "분";
            } else if (hours > 0) {
                return hours + "시간";
            } else {
                return minutes + "분";
            }
        } catch (Exception e) {
            // 타임존 조회 실패 시 기존 방식으로 계산 (fallback)
            Duration duration = Duration.between(start, end);
            long hours = duration.toHours();
            long minutes = Math.abs(duration.toMinutes() % 60);
            
            if (hours > 0 && minutes > 0) {
                return hours + "시간 " + minutes + "분";
            } else if (hours > 0) {
                return hours + "시간";
            } else {
                return minutes + "분";
            }
        }
    }
    
    /**
     * 공항 코드로 ZoneId 조회
     */
    private ZoneId getZoneId(String airportCode) {
        if (airportCode == null || airportCode.trim().isEmpty()) {
            return ZoneId.systemDefault(); // 기본값: 시스템 타임존
        }
        
        try {
            // 공항 코드로 Airport 조회
            Airport airport = airportRepository.findByAirportCode(airportCode.trim().toUpperCase())
                    .orElse(null);
            
            if (airport != null && airport.getTimezone() != null && !airport.getTimezone().trim().isEmpty()) {
                // Airport 엔티티의 timezone 필드 사용 (예: "Asia/Seoul", "America/Los_Angeles")
                return ZoneId.of(airport.getTimezone());
            }
            
            // 공항 정보가 없거나 타임존이 없으면 기본 타임존 사용
            return ZoneId.systemDefault();
        } catch (Exception e) {
            // ZoneId 파싱 실패 시 기본 타임존 사용
            return ZoneId.systemDefault();
        }
    }
    
    @Override
    @Transactional
    public void addCrewMemberWithAuth(Authentication authentication, Long flyScheduleId, String empId) {
        // 관리자 권한 체크
        checkAdminPermission(authentication);
        
        addCrewMember(flyScheduleId, empId);
    }

    @Override
    @Transactional
    public void addCrewMember(Long flyScheduleId, String empId) {
        // 비행편 존재 확인 (BoardService 스타일)
        FlySchedule flySchedule = flyScheduleRepository.findByFlyScheduleId(flyScheduleId)
                .orElseThrow(() -> BusinessException.notFound("해당 비행편이 존재하지 않습니다. flyScheduleId=" + flyScheduleId));

        // 직원 존재 확인
        Emp emp = empRepository.findById(empId)
                .orElseThrow(() -> BusinessException.notFound("존재하지 않는 직원입니다. empId=" + empId));

        // 이미 배정되어 있는지 확인
        List<EmpFlySchedule> existing = empFlyScheduleRepository.findByFlyScheduleIdAndEmpId(flyScheduleId, empId);
        if (!existing.isEmpty()) {
            throw BusinessException.conflict("이미 해당 비행편에 배정된 직원입니다.");
        }
        
        // 승무원 배정 생성
        EmpFlySchedule empFlySchedule = EmpFlySchedule.builder()
                .emp(emp)
                .flySchedule(flySchedule)
                .build();
        
        empFlyScheduleRepository.save(empFlySchedule);
    }
    
    @Override
    @Transactional
    public void removeCrewMemberWithAuth(Authentication authentication, Long flyScheduleId, String empId) {
        // 관리자 권한 체크
        checkAdminPermission(authentication);
        
        removeCrewMember(flyScheduleId, empId);
    }

    @Override
    @Transactional
    public void removeCrewMember(Long flyScheduleId, String empId) {
        // 배정 정보 조회
        List<EmpFlySchedule> empFlySchedules = empFlyScheduleRepository.findByFlyScheduleIdAndEmpId(flyScheduleId, empId);
        
        if (empFlySchedules.isEmpty()) {
            throw BusinessException.notFound("해당 비행편에 배정된 직원을 찾을 수 없습니다. flyScheduleId=" + flyScheduleId + ", empId=" + empId);
        }
        
        // 배정 정보 삭제
        empFlyScheduleRepository.deleteAll(empFlySchedules);
    }

    /**
     * 관리자 권한 체크 메서드
     * @deprecated SecurityUtil.checkAdminPermission() 사용 권장
     */
    @Deprecated
    private void checkAdminPermission(Authentication authentication) {
        securityUtil.checkAdminPermission(authentication);
    }
    
    @Override
    public long countFlightsByMonth(Long airlineId, YearMonth yearMonth) {
        try {
            if (yearMonth == null) {
                yearMonth = YearMonth.now();
            }
            
            LocalDateTime startDate = yearMonth.atDay(1).atStartOfDay();
            LocalDateTime endDate = yearMonth.atEndOfMonth().atTime(23, 59, 59).plusSeconds(1);
            
            log.info("항공편 수 조회 - airlineId: {}, yearMonth: {}, startDate: {}, endDate: {}", 
                    airlineId, yearMonth, startDate, endDate);
            
            // fly_schedule 테이블의 일정 개수 조회 (항공사 필터링 포함)
            long count = flyScheduleRepository.countByFlyStartTimeBetween(airlineId, startDate, endDate);
            
            log.info("항공편 수 조회 완료 - airlineId: {}, yearMonth: {}, count: {}", 
                    airlineId, yearMonth, count);
            
            return count;
        } catch (Exception e) {
            log.error("항공편 수 조회 중 예외 발생 - airlineId: {}, yearMonth: {}", airlineId, yearMonth, e);
            log.error("예외 상세 정보:", e);
            throw new BusinessException(
                    org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR,
                    "항공편 수 조회 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}
