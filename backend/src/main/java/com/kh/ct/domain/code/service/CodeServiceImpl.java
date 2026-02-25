package com.kh.ct.domain.code.service;

import com.kh.ct.domain.code.dto.CodeDetailDto;
import com.kh.ct.domain.code.dto.CodeDto;
import com.kh.ct.domain.code.entity.Code;
import com.kh.ct.domain.code.entity.CodeDetail;
import com.kh.ct.domain.code.repository.CodeDetailRepository;
import com.kh.ct.domain.code.repository.CodeRepository;
import com.kh.ct.domain.emp.entity.Airline;
import com.kh.ct.domain.emp.entity.Emp;
import com.kh.ct.domain.emp.repository.AirlineRepository;
import com.kh.ct.domain.emp.repository.EmpRepository;
import com.kh.ct.global.common.CommonEnums;
import com.kh.ct.global.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CodeServiceImpl implements CodeService {
    private final CodeRepository codeRepository;
    private final CodeDetailRepository codeDetailRepository;
    private final AirlineRepository airlineRepository;
    private final EmpRepository empRepository;

    @Override
    public List<CodeDto> getCode() {
        List<CodeDto> codes = codeRepository.findCodesWithDetailCount();
        return enrichWithAirlineNames(codes);
    }

    @Override
    public List<CodeDto> getCodeByAirlineId(Long airlineId) {
        List<CodeDto> codes;
        if (airlineId == null) {
            codes = codeRepository.findCodesWithDetailCount();
        } else {
            codes = codeRepository.findCodesWithDetailCountByAirlineId(airlineId);
        }
        return enrichWithAirlineNames(codes);
    }

    private List<CodeDto> enrichWithAirlineNames(List<CodeDto> codes) {
        // 모든 항공사 정보를 한 번에 조회
        Map<Long, String> airlineMap = airlineRepository.findAll().stream()
                .collect(Collectors.toMap(
                        Airline::getAirlineId,
                        Airline::getAirlineName
                ));

        // 각 CodeDto에 airlineName을 포함한 새로운 객체 생성
        return codes.stream()
                .map(codeDto -> {
                    String airlineName;
                    if (codeDto.getAirlineId() != null) {
                        airlineName = airlineMap.get(codeDto.getAirlineId());
                        // 항공사 정보가 없을 경우 null 대신 기본값 설정
                        airlineName = airlineName != null ? airlineName : "알 수 없는 항공사";
                    } else {
                        airlineName = "공통 코드";
                    }

                    return CodeDto.builder()
                            .codeId(codeDto.getCodeId())
                            .codeName(codeDto.getCodeName())
                            .count(codeDto.getCount())
                            .createDate(codeDto.getCreateDate())
                            .updateDate(codeDto.getUpdateDate())
                            .airlineId(codeDto.getAirlineId())
                            .airlineName(airlineName)
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<CodeDetailDto> getCodeDetails(Long codeId) {
        return codeDetailRepository.findDetailDtosByCodeId(codeId);
    }

    @Override
    public List<CodeDto> getCodesByAuth(Authentication authentication) {
        List<CodeDto> codes;
        
        // 인증되지 않은 경우 전체 코드 조회
        if (authentication == null || !authentication.isAuthenticated()) {
            codes = codeRepository.findCodesWithDetailCount();
        } else {
            String empId = authentication.getName();
            Emp emp = empRepository.findById(empId)
                    .orElseThrow(() -> BusinessException.notFound("존재하지 않는 직원입니다. empId=" + empId));

            // SUPER_ADMIN은 모든 코드 조회
            if (emp.getRole() == CommonEnums.Role.SUPER_ADMIN) {
                codes = codeRepository.findCodesWithDetailCount();
            } else if (emp.getRole() == CommonEnums.Role.AIRLINE_ADMIN) {
                // AIRLINE_ADMIN은 자신의 항공사 코드만 조회
                if (emp.getAirlineId() == null) {
                    throw BusinessException.badRequest("항공사 관리자는 항공사 정보가 필요합니다. empId=" + empId);
                }
                Long airlineId = emp.getAirlineId().getAirlineId();
                codes = codeRepository.findCodesWithDetailCountByAirlineId(airlineId);
            } else {
                // 기타 권한은 자신의 항공사 코드만 조회 (항공사가 없으면 전체 조회)
                Long airlineId = emp.getAirlineId() != null ? emp.getAirlineId().getAirlineId() : null;
                if (airlineId != null) {
                    codes = codeRepository.findCodesWithDetailCountByAirlineId(airlineId);
                } else {
                    codes = codeRepository.findCodesWithDetailCount();
                }
            }
        }
        
        // 항공사 이름을 채워서 반환 (서비스 계층에서 처리)
        return enrichWithAirlineNames(codes);
    }

    @Override
    @Transactional
    public CodeDto.CreateResponse createCodeWithAuth(Authentication authentication, CodeDto.CreateRequest request) {
        // SUPER_ADMIN은 코드 추가 불가
        checkSuperAdminForbidden(authentication, "최상위관리자는 코드를 추가할 수 없습니다.");

        Long airlineId = extractAirlineIdFromAuth(authentication);
        
        // request의 airlineId가 있으면 우선 사용
        Long finalAirlineId = request.getAirlineId() != null ? request.getAirlineId() : airlineId;

        return createCode(request, finalAirlineId);
    }

    @Override
    @Transactional
    public CodeDetailDto.CreateResponse createCodeDetailWithAuth(Authentication authentication, Long codeId, CodeDetailDto.CreateRequest request) {
        // SUPER_ADMIN은 코드 디테일 추가 불가
        checkSuperAdminForbidden(authentication, "최상위관리자는 코드 디테일을 추가할 수 없습니다.");

        return createCodeDetail(codeId, request);
    }

    @Override
    @Transactional
    public void deleteCodeWithAuth(Authentication authentication, Long codeId) {
        // SUPER_ADMIN은 코드 삭제 불가
        checkSuperAdminForbidden(authentication, "최상위관리자는 코드를 삭제할 수 없습니다.");

        deleteCode(codeId);
    }

    @Override
    @Transactional
    public CodeDetailDto.CreateResponse updateCodeDetailWithAuth(Authentication authentication, Long codeId, Long codeDetailId, CodeDetailDto.UpdateRequest request) {
        // SUPER_ADMIN은 코드 디테일 수정 불가
        checkSuperAdminForbidden(authentication, "최상위관리자는 코드 디테일을 수정할 수 없습니다.");

        return updateCodeDetail(codeId, codeDetailId, request);
    }

    @Override
    @Transactional
    public void deleteCodeDetailWithAuth(Authentication authentication, Long codeId, Long codeDetailId) {
        // SUPER_ADMIN은 코드 디테일 삭제 불가
        checkSuperAdminForbidden(authentication, "최상위관리자는 코드 디테일을 삭제할 수 없습니다.");

        deleteCodeDetail(codeId, codeDetailId);
    }

    /**
     * SUPER_ADMIN 권한 체크 및 예외 발생
     * BoardService 스타일: 명확한 예외 메시지와 함께 예외 발생
     */
    private void checkSuperAdminForbidden(Authentication authentication, String message) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return;
        }

        String empId = authentication.getName();
        Emp emp = empRepository.findById(empId)
                .orElseThrow(() -> BusinessException.notFound("존재하지 않는 직원입니다. empId=" + empId));

        if (emp.getRole() == CommonEnums.Role.SUPER_ADMIN) {
            throw BusinessException.forbidden(message);
        }
    }

    /**
     * Authentication에서 항공사 ID 추출
     * BoardService 스타일: orElseThrow를 사용하여 명확한 예외 처리
     * 
     * 주의: AIRLINE_ADMIN이 항공사 정보가 없어도 null을 반환 (공통 코드 추가 가능)
     */
    private Long extractAirlineIdFromAuth(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        String empId = authentication.getName();
        Emp emp = empRepository.findById(empId)
                .orElseThrow(() -> BusinessException.notFound("존재하지 않는 직원입니다. empId=" + empId));

        // AIRLINE_ADMIN은 자신의 항공사ID가 있으면 반환, 없으면 null (공통 코드 추가 가능)
        if (emp.getRole() == CommonEnums.Role.AIRLINE_ADMIN) {
            if (emp.getAirlineId() != null) {
                return emp.getAirlineId().getAirlineId();
            }
            // 항공사 정보가 없어도 null 반환 (공통 코드 추가 허용)
            return null;
        }
        
        // 기타 권한도 항공사ID가 있으면 반환
        if (emp.getAirlineId() != null) {
            return emp.getAirlineId().getAirlineId();
        }

        return null;
    }

    @Override
    @Transactional
    public CodeDto.CreateResponse createCode(CodeDto.CreateRequest request, Long airlineId) {
        // airlineId 결정: request의 airlineId가 있으면 우선 사용, 없으면 파라미터의 airlineId 사용
        Long finalAirlineId = request.getAirlineId() != null ? request.getAirlineId() : airlineId;

        // 중복 검증 (BoardService 스타일: 명확한 예외 메시지)
        boolean exists;
        if (finalAirlineId != null) {
            exists = codeRepository.existsByCodeNameAndAirlineId(request.getCodeName(), finalAirlineId);
        } else {
            exists = codeRepository.existsByCodeNameAndAirlineIdIsNull(request.getCodeName());
        }

        if (exists) {
            throw BusinessException.conflict("동일한 코드명이 이미 존재합니다. (codeName: " + request.getCodeName() + ")");
        }

        // Code 엔티티 생성 및 저장
        Code code = Code.builder()
                .codeName(request.getCodeName())
                .airlineId(finalAirlineId)
                .build();

        Code saved = codeRepository.save(code);

        // 항공사 이름 조회 (안전하게 처리)
        String airlineName;
        if (finalAirlineId != null) {
            airlineName = airlineRepository.findById(finalAirlineId)
                    .map(Airline::getAirlineName)
                    .orElse("알 수 없는 항공사");
        } else {
            airlineName = "공통 코드";
        }

        // CreateResponse 생성 및 반환
        return CodeDto.CreateResponse.from(saved, airlineName);
    }

    @Override
    @Transactional
    public CodeDetailDto.CreateResponse createCodeDetail(Long codeId, CodeDetailDto.CreateRequest request) {
        // Code 존재 여부 확인 (BoardService 스타일: 명확한 예외 메시지)
        Code code = codeRepository.findById(codeId)
                .orElseThrow(() -> BusinessException.notFound("해당 코드가 존재하지 않습니다. codeId=" + codeId));

        // 중복 검증
        if (codeDetailRepository.existsByCodeIdAndCodeDetailName(code, request.getCodeDetailName())) {
            throw BusinessException.conflict("동일한 코드 디테일명이 이미 존재합니다. (detailName: " + request.getCodeDetailName() + ")");
        }

        // CodeDetail 엔티티 생성
        CodeDetail codeDetail = CodeDetail.builder()
                .codeId(code)
                .codeDetailName(request.getCodeDetailName())
                .codeDesc(request.getCodeDesc())
                .build();

        CodeDetail saved = codeDetailRepository.save(codeDetail);

        return CodeDetailDto.CreateResponse.from(saved);
    }

    @Override
    @Transactional
    public void deleteCode(Long codeId) {
        // Code 존재 여부 확인 (BoardService 스타일)
        Code code = codeRepository.findById(codeId)
                .orElseThrow(() -> BusinessException.notFound("해당 코드가 존재하지 않습니다. codeId=" + codeId));

        // Code 삭제 (Cascade로 인해 CodeDetail도 함께 삭제됨)
        codeRepository.delete(code);
    }

    @Override
    @Transactional
    public CodeDetailDto.CreateResponse updateCodeDetail(Long codeId, Long codeDetailId, CodeDetailDto.UpdateRequest request) {
        // Code 존재 여부 확인 (BoardService 스타일)
        Code code = codeRepository.findById(codeId)
                .orElseThrow(() -> BusinessException.notFound("해당 코드가 존재하지 않습니다. codeId=" + codeId));

        // CodeDetail 존재 여부 확인 (영속성 컨텍스트가 관리 시작)
        CodeDetail codeDetail = codeDetailRepository.findByCodeDetailIdAndCodeId_CodeId(codeDetailId, codeId)
                .orElseThrow(() -> BusinessException.notFound("해당 코드 디테일이 존재하지 않습니다. codeDetailId=" + codeDetailId));

        // 중복 검증 (자기 자신 제외)
        if (!codeDetail.getCodeDetailName().equals(request.getCodeDetailName())) {
            if (codeDetailRepository.existsByCodeIdAndCodeDetailName(code, request.getCodeDetailName())) {
                throw BusinessException.conflict("동일한 코드 디테일명이 이미 존재합니다. (detailName: " + request.getCodeDetailName() + ")");
            }
        }

        // 더티 체킹 방식으로 엔티티 수정 (BoardService 스타일)
        codeDetail.update(request.getCodeDetailName(), request.getCodeDesc());
        // 🚩 별도로 save()를 호출하지 않아도 트랜잭션이 끝날 때 DB에 반영됩니다. (더티 체킹)

        // 수정된 엔티티를 DTO로 변환하여 반환
        return CodeDetailDto.CreateResponse.from(codeDetail);
    }

    @Override
    @Transactional
    public void deleteCodeDetail(Long codeId, Long codeDetailId) {
        // Code 존재 여부 확인 (BoardService 스타일)
        Code code = codeRepository.findById(codeId)
                .orElseThrow(() -> BusinessException.notFound("해당 코드가 존재하지 않습니다. codeId=" + codeId));

        // CodeDetail 존재 여부 확인
        CodeDetail codeDetail = codeDetailRepository.findByCodeDetailIdAndCodeId_CodeId(codeDetailId, codeId)
                .orElseThrow(() -> BusinessException.notFound("해당 코드 디테일이 존재하지 않습니다. codeDetailId=" + codeDetailId));

        // CodeDetail 삭제
        codeDetailRepository.delete(codeDetail);
    }
}

