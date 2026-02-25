package com.kh.ct.domain.code.service;

import com.kh.ct.domain.code.dto.CodeDetailDto;
import com.kh.ct.domain.code.dto.CodeDto;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface CodeService {

    //코드 조회
    List<CodeDto> getCode();
    List<CodeDto> getCodeByAirlineId(Long airlineId);
    List<CodeDetailDto> getCodeDetails(Long codeId);
    
    /**
     * 권한 기반 코드 조회
     * - SUPER_ADMIN: 모든 항공사의 코드 조회
     * - AIRLINE_ADMIN: 자신의 항공사 코드만 조회
     * - 기타: 자신의 항공사 코드 또는 전체 코드
     */
    List<CodeDto> getCodesByAuth(Authentication authentication);

    //코드등록
    CodeDto.CreateResponse createCode(CodeDto.CreateRequest request, Long airlineId);
    
    /**
     * 권한 기반 코드 등록
     * - SUPER_ADMIN: 등록 불가 (예외 발생)
     * - AIRLINE_ADMIN: 자신의 항공사ID로 자동 설정
     */
    CodeDto.CreateResponse createCodeWithAuth(Authentication authentication, CodeDto.CreateRequest request);

    //코드 디테일 등록
    CodeDetailDto.CreateResponse createCodeDetail(Long codeId, CodeDetailDto.CreateRequest request);
    
    /**
     * 권한 기반 코드 디테일 등록
     * - SUPER_ADMIN: 등록 불가 (예외 발생)
     */
    CodeDetailDto.CreateResponse createCodeDetailWithAuth(Authentication authentication, Long codeId, CodeDetailDto.CreateRequest request);

    //코드 그룹 삭제
    void deleteCode(Long codeId);
    
    /**
     * 권한 기반 코드 그룹 삭제
     * - SUPER_ADMIN: 삭제 불가 (예외 발생)
     */
    void deleteCodeWithAuth(Authentication authentication, Long codeId);

    //코드 디테일 수정
    CodeDetailDto.CreateResponse updateCodeDetail(Long codeId, Long codeDetailId, CodeDetailDto.UpdateRequest request);
    
    /**
     * 권한 기반 코드 디테일 수정
     * - SUPER_ADMIN: 수정 불가 (예외 발생)
     */
    CodeDetailDto.CreateResponse updateCodeDetailWithAuth(Authentication authentication, Long codeId, Long codeDetailId, CodeDetailDto.UpdateRequest request);

    //코드 디테일 삭제
    void deleteCodeDetail(Long codeId, Long codeDetailId);
    
    /**
     * 권한 기반 코드 디테일 삭제
     * - SUPER_ADMIN: 삭제 불가 (예외 발생)
     */
    void deleteCodeDetailWithAuth(Authentication authentication, Long codeId, Long codeDetailId);

}
