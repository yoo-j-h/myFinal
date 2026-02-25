package com.kh.ct.global.util;

import com.kh.ct.domain.emp.entity.Emp;
import com.kh.ct.domain.emp.repository.EmpRepository;
import com.kh.ct.global.common.CommonEnums;
import com.kh.ct.global.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

/**
 * 권한 검증 공통 유틸리티
 * 중복된 권한 체크 로직을 통합하여 관리
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SecurityUtil {
    
    private final EmpRepository empRepository;
    
    /**
     * 관리자 권한 체크
     * ADMIN(AIRLINE_ADMIN, SUPER_ADMIN)만 허용
     * 
     * @param authentication 인증 정보
     * @throws BusinessException 권한이 없을 경우
     */
    public void checkAdminPermission(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw BusinessException.forbidden("인증이 필요합니다.");
        }
        
        String authEmpId = authentication.getName();
        Emp emp = empRepository.findById(authEmpId)
                .orElseThrow(() -> BusinessException.notFound("존재하지 않는 직원입니다. empId=" + authEmpId));
        
        if (emp.getRole() != CommonEnums.Role.AIRLINE_ADMIN && 
            emp.getRole() != CommonEnums.Role.SUPER_ADMIN) {
            throw BusinessException.forbidden("관리자 권한이 필요합니다. 현재 권한: " + emp.getRole());
        }
    }
    
    /**
     * 인증된 사용자의 Emp 엔티티 조회
     * 
     * @param authentication 인증 정보
     * @return Emp 엔티티
     * @throws BusinessException 인증되지 않았거나 직원을 찾을 수 없는 경우
     */
    public Emp getAuthenticatedEmp(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw BusinessException.forbidden("인증이 필요합니다.");
        }
        
        String authEmpId = authentication.getName();
        return empRepository.findById(authEmpId)
                .orElseThrow(() -> BusinessException.notFound("존재하지 않는 직원입니다. empId=" + authEmpId));
    }
    
    /**
     * 관리자 여부 확인 (예외 없이 boolean 반환)
     * 
     * @param authentication 인증 정보
     * @return 관리자 여부
     */
    public boolean isAdmin(Authentication authentication) {
        try {
            Emp emp = getAuthenticatedEmp(authentication);
            return emp.getRole() == CommonEnums.Role.AIRLINE_ADMIN || 
                   emp.getRole() == CommonEnums.Role.SUPER_ADMIN;
        } catch (Exception e) {
            log.debug("관리자 권한 확인 실패: {}", e.getMessage());
            return false;
        }
    }
    
    /**
     * 인증된 사용자의 항공사 ID 조회
     * 
     * @param authentication 인증 정보
     * @return 항공사 ID (없으면 null)
     */
    public Long getAirlineId(Authentication authentication) {
        Emp emp = getAuthenticatedEmp(authentication);
        return emp.getAirlineId() != null ? emp.getAirlineId().getAirlineId() : null;
    }
}
