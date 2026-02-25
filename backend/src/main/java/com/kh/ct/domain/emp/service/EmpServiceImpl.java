package com.kh.ct.domain.emp.service;

import com.kh.ct.domain.emp.dto.AirlineDto;
import com.kh.ct.domain.emp.dto.EmpDto;
import com.kh.ct.domain.emp.entity.Airline;
import com.kh.ct.domain.emp.entity.Emp;
import com.kh.ct.domain.emp.repository.EmpRepository;
import com.kh.ct.global.common.CommonEnums;
import com.kh.ct.global.entity.File;
import com.kh.ct.global.exception.BusinessException;
import com.kh.ct.global.exception.EmpNoConflictException;
import com.kh.ct.global.repository.FileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpServiceImpl implements EmpService {

    private final EmpRepository empRepository;
    private final FileRepository fileRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmpNoService empNoService;

    @Override
    public boolean isEmpIdAvailable(String empId) {
        if (empId == null || empId.isBlank()) {
            throw new IllegalArgumentException("아이디(empId)는 필수입니다.");
        }
        return !empRepository.existsById(empId);
    }

    @Override
    @Transactional
    public Emp register(EmpDto.RegisterRequest request) {

        // 1) 아이디 중복 체크
        if (empRepository.existsById(request.getEmpId())) {
            // ✅ 회원가입 실패는 400이 자연스럽다(너 핸들러에서 BusinessException을 처리하므로)
            throw new BusinessException(HttpStatus.BAD_REQUEST, "이미 존재하는 아이디(empId)입니다.");
        }

        // 2) 사번 중복(사전 체크) - UX 개선용
        if (empRepository.existsByEmpNo(request.getEmpNo())) {
            String newEmpNo = empNoService.previewEmpNo();
            throw new EmpNoConflictException("사번이 이미 사용되었습니다.", newEmpNo);
        }

        File profileImage = null;
        if (request.getProfileImageId() != null) {
            profileImage = fileRepository.findById(request.getProfileImageId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "프로필 이미지 파일이 존재하지 않습니다. fileId=" + request.getProfileImageId()));
        }

        Emp emp = Emp.builder()
                .empId(request.getEmpId())
                .empNo(request.getEmpNo())
                .empName(request.getEmpName())
                .age(request.getAge())
                .empPwd(passwordEncoder.encode(request.getEmpPwd()))
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .profileImage(profileImage)

                // 기본값 (정책)
                .role(CommonEnums.Role.CABIN_CREW)
                .job(request.getJob() != null ? request.getJob() : "")
                .empStatus(CommonEnums.EmpStatus.Y)

                // 기본값(정책)
                .startDate(LocalDateTime.now())
                .endDate(null)
                .leaveCount(15.0)

                // nullable이라면 유지
                .airlineId(null)
                .departmentId(null)
                .build();

        // 5) 저장 (동시성 경합으로 UNIQUE(emp_no) 터질 수 있음)
        try {
            return empRepository.save(emp);
        } catch (DataIntegrityViolationException e) {
            // ✅ 최종 방어선: 유니크 충돌이면 새 사번 내려주고 409 처리
            String newEmpNo = empNoService.previewEmpNo();
            throw new EmpNoConflictException("사번이 이미 사용되었습니다.", newEmpNo);
        }
    }

    @Override
    public EmpDto getEmpDetail(String empId) {
        // JOIN FETCH를 사용하여 Department와 Airline을 한 번에 가져옴 (LAZY 직렬화 문제 방지)
        Emp emp = empRepository.findByIdWithDetails(empId)
                .orElseThrow(() -> new IllegalArgumentException("직원을 찾을 수 없습니다. (empId: " + empId + ")"));

        // Department 정보 (이미 JOIN FETCH로 로드됨)
        String departmentName = null;
        if (emp.getDepartmentId() != null) {
            departmentName = emp.getDepartmentId().getDepartmentName();
        }

        // Airline 정보 (이미 JOIN FETCH로 로드됨)
        String airlineName = null;
        if (emp.getAirlineId() != null) {
            airlineName = emp.getAirlineId().getAirlineName();
        }

        Long profileImageId = null;
        if (emp.getProfileImage() != null) {
            profileImageId = emp.getProfileImage().getFileId();
        }

        // DTO로 변환 (엔티티를 직접 반환하지 않아 순환 참조 방지)
        return EmpDto.builder()
                .empId(emp.getEmpId())
                .empName(emp.getEmpName())
                .empNo(emp.getEmpNo())
                .role(emp.getRole() != null ? emp.getRole().name() : null)
                .job(emp.getJob())
                .phone(emp.getPhone())
                .email(emp.getEmail())
                .address(emp.getAddress())
                .empStatus(emp.getEmpStatus() != null ? emp.getEmpStatus().name() : null)
                .startDate(emp.getStartDate())
                .endDate(emp.getEndDate())
                .age(emp.getAge())
                .departmentName(departmentName)
                .airlineName(airlineName)
                .profileImageId(profileImageId)
                .build();
    }

    @Override
    public java.util.List<EmpDto> getManagerCandidates() {
        // 모든 활성 직원 조회 (또는 특정 부서/직책 필터링 가능)
        return empRepository.findByEmpStatus(CommonEnums.EmpStatus.Y).stream()
                .map(emp -> {
                    String deptName = (emp.getDepartmentId() != null) ? emp.getDepartmentId().getDepartmentName() : "";
                    return EmpDto.builder()
                            .empId(emp.getEmpId())
                            .empName(emp.getEmpName())
                            .departmentName(deptName)
                            .role(emp.getRole() != null ? emp.getRole().name() : "")
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<EmpDto.EmployeeListItem> getEmployees(String role, Long airlineId) {
        try {
            List<Emp> employees;

            CommonEnums.Role roleEnum = null;
            if (role != null && !role.isEmpty()) {
                try {
                    roleEnum = CommonEnums.Role.valueOf(role.toUpperCase());
                    log.info("역할 필터링: {}", roleEnum);
                } catch (IllegalArgumentException e) {
                    // 잘못된 역할 값이면 null로 처리하여 전체 조회
                    log.warn("잘못된 역할 값: {}, 전체 조회로 처리", role);
                    roleEnum = null;
                }
            }

            log.info("직원 조회 파라미터 - role: {}, airlineId: {}", roleEnum, airlineId);

            // JOIN FETCH를 사용한 쿼리로 조회 (LAZY 직렬화 문제 방지)
            employees = empRepository.findByRoleAndAirlineId(roleEnum, airlineId);

            log.info("조회된 직원 수: {}", employees.size());

            // DTO로 변환
            return employees.stream()
                    .filter(emp -> emp != null) // null 체크
                    .map(emp -> {
                        try {
                            String departmentName = null;
                            if (emp.getDepartmentId() != null) {
                                departmentName = emp.getDepartmentId().getDepartmentName();
                            }

                            String airlineName = null;
                            if (emp.getAirlineId() != null) {
                                airlineName = emp.getAirlineId().getAirlineName();
                            }

                            return EmpDto.EmployeeListItem.builder()
                                    .empId(emp.getEmpId())
                                    .empName(emp.getEmpName())
                                    .role(emp.getRole() != null ? emp.getRole().name() : null)
                                    .job(emp.getJob())
                                    .departmentName(departmentName)
                                    .airlineName(airlineName)
                                    .build();
                        } catch (Exception e) {
                            log.error("직원 DTO 변환 실패 - empId: {}, error: {}", 
                                    emp.getEmpId(), e.getMessage(), e);
                            return null;
                        }
                    })
                    .filter(dto -> dto != null) // 변환 실패한 항목 제거
                    .collect(java.util.stream.Collectors.toList());
        } catch (Exception e) {
            log.error("직원 목록 조회 중 오류 발생 - role: {}, airlineId: {}", role, airlineId, e);
            throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, 
                    "직원 목록 조회 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public EmpDto updateEmpRoleAndJob(String empId, EmpDto.UpdateRoleAndJobRequest request) {
        Emp emp = empRepository.findByIdWithDetails(empId)
                .orElseThrow(
                        () -> new BusinessException(HttpStatus.NOT_FOUND, "직원을 찾을 수 없습니다. (empId: " + empId + ")"));

        // Role enum 변환
        CommonEnums.Role roleEnum;
        try {
            roleEnum = CommonEnums.Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "유효하지 않은 직급(role)입니다: " + request.getRole());
        }

        // 직급과 직책 업데이트
        emp.updateRoleAndJob(roleEnum, request.getJob());
        emp = empRepository.save(emp);

        // Department와 Airline 정보 가져오기
        String departmentName = null;
        if (emp.getDepartmentId() != null) {
            departmentName = emp.getDepartmentId().getDepartmentName();
        }

        String airlineName = null;
        if (emp.getAirlineId() != null) {
            airlineName = emp.getAirlineId().getAirlineName();
        }

        // DTO로 변환하여 반환
        return EmpDto.builder()
                .empId(emp.getEmpId())
                .empName(emp.getEmpName())
                .empNo(emp.getEmpNo())
                .role(emp.getRole() != null ? emp.getRole().name() : null)
                .job(emp.getJob())
                .phone(emp.getPhone())
                .email(emp.getEmail())
                .address(emp.getAddress())
                .empStatus(emp.getEmpStatus() != null ? emp.getEmpStatus().name() : null)
                .startDate(emp.getStartDate())
                .endDate(emp.getEndDate())
                .age(emp.getAge())
                .departmentName(departmentName)
                .airlineName(airlineName)
                .build();
    }

    @Override
    @Transactional
    public EmpDto updateMyProfile(String empId, EmpDto.UpdateMyProfileRequest request) {

        Emp emp = empRepository.findByIdWithDetails(empId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND,
                        "직원을 찾을 수 없습니다. (empId: " + empId + ")"));

        // 1) 텍스트 프로필 업데이트 (setter X)
        emp.updateProfile(
                request.getEmpName(),
                request.getAge(),
                request.getEmail(),
                request.getPhone(),
                request.getAddress());

        // 2) 이미지 업데이트 (있을 때만)
        if (request.getProfileImageId() != null) {
            File file = fileRepository.findById(request.getProfileImageId())
                    .orElseThrow(() -> new BusinessException(HttpStatus.BAD_REQUEST,
                            "프로필 이미지 파일이 존재하지 않습니다. fileId=" + request.getProfileImageId()));

            emp.updateProfileImage(file); // ✅ 엔티티 메서드 필요
        }

        empRepository.save(emp);

        // 3) 응답은 기존 getEmpDetail 재사용 (DTO 변환 중복 제거)
        return getEmpDetail(empId);
    }

    @Override
    @Transactional
    public void changeMyPassword(String empId, String currentPassword, String newPassword) {

        if (empId == null || empId.isBlank()) {
            throw new IllegalArgumentException("empId는 필수입니다.");
        }
        if (currentPassword == null || currentPassword.isBlank()) {
            throw new IllegalArgumentException("현재 비밀번호는 필수입니다.");
        }
        if (newPassword == null || newPassword.isBlank()) {
            throw new IllegalArgumentException("새 비밀번호는 필수입니다.");
        }

        // ✅ 정책(필요하면 더 강화)
        if (newPassword.length() < 8) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "새 비밀번호는 8자 이상이어야 합니다.");
        }

        Emp emp = empRepository.findById(empId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND,
                        "직원을 찾을 수 없습니다. (empId: " + empId + ")"));

        // ✅ 현재 비번 검증
        if (!passwordEncoder.matches(currentPassword, emp.getEmpPwd())) {
            throw new BusinessException(HttpStatus.UNAUTHORIZED, "현재 비밀번호가 일치하지 않습니다.");
        }

        // ✅ 동일 비번 방지(권장)
        if (passwordEncoder.matches(newPassword, emp.getEmpPwd())) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "현재 비밀번호와 다른 비밀번호를 사용해주세요.");
        }

        // ✅ setter 대신 도메인 메서드 호출
        emp.changePassword(passwordEncoder.encode(newPassword));

        empRepository.save(emp);
    }

    @Override
    public EmpDto.FindIdResponse findEmpId(EmpDto.FindIdRequest request) {

        if (request == null) {
            throw new IllegalArgumentException("요청값(request)은 필수입니다.");
        }

        // 공백/입력 흔들림 방지 (프론트에서 ' ' 포함해서 오는 경우가 꽤 있음)
        String empName = request.getEmpName() != null ? request.getEmpName().trim() : null;
        String email = request.getEmail() != null ? request.getEmail().trim() : null;

        if (empName == null || empName.isBlank()) {
            throw new IllegalArgumentException("이름(empName)은 필수입니다.");
        }
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("이메일(email)은 필수입니다.");
        }

        // ✅ 프로젝트 정책상 활성 상태 = Y 로 이미 쓰고 있으니 그대로 사용
        return empRepository
                .findByEmpNameAndEmailAndEmpStatus(empName, email, CommonEnums.EmpStatus.Y)
                .map(emp -> EmpDto.FindIdResponse.success(emp.getEmpId()))
                .orElseGet(EmpDto.FindIdResponse::fail);
    }

    @Override
    public AirlineDto.DetailResponse getAirlineByEmpId(String empId) {
        Emp emp = empRepository.findByIdWithDetails(empId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND,
                        "직원을 찾을 수 없습니다. (empId: " + empId + ")"));

        if (emp.getAirlineId() == null) {
            throw new BusinessException(HttpStatus.NOT_FOUND,
                    "해당 직원은 항공사에 소속되어 있지 않습니다.");
        }

        Airline airline = emp.getAirlineId();
        // AirlineDto.DetailResponse 생성
        return AirlineDto.DetailResponse.builder()
                .id(airline.getAirlineId())
                .name(airline.getAirlineName())
                .primaryColor(airline.getPrimaryColor())
                .secondaryColor(airline.getSecondaryColor())
                .icon(airline.getIcon() != null ? airline.getIcon() : "✈️")
                .businessNumber(airline.getBusinessNumber() != null ? airline.getBusinessNumber() : "")
                .mainNumber(airline.getMainNumber() != null ? airline.getMainNumber() : "")
                .address(airline.getAirlineAddress() != null ? airline.getAirlineAddress() : "")
                .email(airline.getEmail() != null ? airline.getEmail() : "")
                .build();
    }

}
