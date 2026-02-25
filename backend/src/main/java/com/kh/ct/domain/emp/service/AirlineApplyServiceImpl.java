package com.kh.ct.domain.emp.service;

import com.kh.ct.domain.emp.dto.AirlineApplyDto;
import com.kh.ct.domain.emp.entity.Airline;
import com.kh.ct.domain.emp.entity.AirlineApply;
import com.kh.ct.domain.emp.entity.Emp;
import com.kh.ct.domain.emp.entity.ActivationToken;
import com.kh.ct.domain.emp.repository.ActivationTokenRepository;
import com.kh.ct.domain.emp.repository.AirlineApplyRepository;
import com.kh.ct.domain.emp.repository.AirlineRepository;
import com.kh.ct.domain.emp.repository.EmpRepository;
import com.kh.ct.global.common.CommonEnums;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AirlineApplyServiceImpl implements AirlineApplyService {

    private final AirlineApplyRepository airlineApplyRepository;
    private final AirlineRepository airlineRepository;
    private final EmpRepository empRepository;
    private final PasswordEncoder passwordEncoder;
    private final ActivationTokenRepository activationTokenRepository;

    @Override
    public List<AirlineApplyDto.ListResponse> getAllApplications() {
        List<AirlineApply> applications = airlineApplyRepository.findAllByOrderByCreateDateDesc();
        return applications.stream()
                .map(this::convertToListResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AirlineApplyDto.ListResponse> searchApplications(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllApplications();
        }
        List<AirlineApply> applications = airlineApplyRepository.searchByKeyword(keyword);
        return applications.stream()
                .map(this::convertToListResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AirlineApplyDto.DetailResponse getApplicationDetail(Long id) {
        AirlineApply application = airlineApplyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 신청을 찾을 수 없습니다. ID: " + id));
        
        // 자동 생성 로직 제거: 초기 설정이 완료된 경우에만 Airline이 존재함
        
        return convertToDetailResponse(application);
    }

    @Override
    @Transactional
    public void approveApplication(Long id, String adminId) {
        // 1. 신청 정보 조회
        AirlineApply application = airlineApplyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 신청을 찾을 수 없습니다. ID: " + id));
        
        // 2. 이미 승인된 경우 체크
        if (application.getAirlineApplyStatus() == com.kh.ct.global.common.CommonEnums.ApplyStatus.APPROVED) {
            throw new IllegalArgumentException("이미 승인된 신청입니다.");
        }
        
        // 3. 아이디 중복 체크
        if (empRepository.findById(adminId).isPresent()) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다: " + adminId);
        }
        
        // 4. 승인 처리
        application.approve();
        
        // 5. Airline(테넌트) 엔티티 생성 (이미 존재하는지 확인)
        Airline airline = airlineRepository.findByAirlineApplyId(application.getAirlineApplyId())
                .orElse(null);
        
        if (airline == null) {
            // Airline이 없으면 생성 (중복 체크를 한 번 더 수행)
            if (!airlineRepository.existsByAirlineApplyId(application.getAirlineApplyId())) {
                airline = Airline.builder()
                        .airlineName(application.getAirlineName())
                        .theme("gray") // 기본 테마
                        .mainNumber("") // 기본값
                        .airlineAddress("") // 기본값
                        .airlineDesc("") // 기본값
                        .email(application.getAirlineApplyEmail())
                        .phone(application.getManagerPhone())
                        .plan("Professional") // 기본 플랜
                        .status(CommonEnums.AirlineStatus.ACTIVE)
                        .icon("✈️")
                        .country("대한민국") // 국내 서비스
                        .joinDate(LocalDate.now())
                        .storageUsage(0.0)
                        .lastLoginDate(LocalDateTime.now())
                        .airlineApplyId(application)
                        .build();
                airline = airlineRepository.save(airline);
            } else {
                // 저장 전에 다른 트랜잭션에서 생성되었을 수 있으므로 다시 조회
                airline = airlineRepository.findByAirlineApplyId(application.getAirlineApplyId())
                        .orElseThrow(() -> new IllegalStateException("Airline 생성 중 오류가 발생했습니다."));
            }
        }
        
        // 6. 항공사 관리자 계정 생성
        String tempPassword = generateTempPassword();
        String encodedPassword = passwordEncoder.encode(tempPassword);
        
        Emp adminAccount = Emp.builder()
                .empId(adminId)
                .airlineId(airline) // 생성된 Airline과 연결
                .empName(application.getManagerName() != null ? application.getManagerName() : "관리자")
                .empPwd(encodedPassword)
                .age(30) // 기본값
                .role(CommonEnums.Role.AIRLINE_ADMIN)
                .phone(application.getManagerPhone())
                .job("항공사 관리자")
                .email(application.getAirlineApplyEmail())
                .empStatus(CommonEnums.EmpStatus.Y)
                .startDate(LocalDateTime.now())
                .leaveCount(15.0)
                .empNo(generateEmpNo(application.getAirlineName()))
                .build();
        
        empRepository.save(adminAccount);
        
        // TODO: 실제 운영 환경에서는 이메일로 임시 비밀번호 전송 필요
        System.out.println("=== 항공사 관리자 계정 생성 완료 ===");
        System.out.println("아이디: " + adminId);
        System.out.println("임시 비밀번호: " + tempPassword);
        System.out.println("이메일: " + application.getAirlineApplyEmail());
    }
    
    /**
     * 임시 비밀번호 생성 (8자리 랜덤)
     */
    private String generateTempPassword() {
        return UUID.randomUUID().toString().substring(0, 8);
    }
    
    /**
     * 사원번호 생성 (항공사명 약자 + 타임스탬프)
     */
    private String generateEmpNo(String airlineName) {
        String prefix = airlineName.length() >= 3 
            ? airlineName.substring(0, 3).toUpperCase() 
            : airlineName.toUpperCase();
        return prefix + "-" + System.currentTimeMillis();
    }

    @Override
    @Transactional
    public void rejectApplication(Long id, String reason) {
        AirlineApply application = airlineApplyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 신청을 찾을 수 없습니다. ID: " + id));
        application.reject(reason);
    }

    @Override
    @Transactional
    public AirlineApplyDto.ApplyResponse createApplication(
            AirlineApplyDto.ApplyRequest request,
            String businessLicensePath,
            String employmentCertPath
    ) {
        // AirlineApply 엔티티 생성
        AirlineApply application = AirlineApply.builder()
                .airlineName(request.getAirlineName())
                .airlineAddress(request.getAirlineAddress())
                .airlineApplyEmail(request.getManagerEmail())
                .managerName(request.getManagerName())
                .managerPhone(request.getManagerPhone())
                .airlineApplyStatus(CommonEnums.ApplyStatus.PENDING)
                .emailDomainVerified(false) // 도메인 검증 비활성화
                .businessLicensePath(businessLicensePath)
                .employmentCertPath(employmentCertPath)
                .build();

        AirlineApply saved = airlineApplyRepository.save(application);

        return AirlineApplyDto.ApplyResponse.builder()
                .id(saved.getAirlineApplyId())
                .message("가입 신청이 완료되었습니다.")
                .build();
    }

    @Override
    @Transactional
    public AirlineApplyDto.ApproveResponse approveApplicationWithLink(Long id, String adminId) {
        // 1. 신청 정보 조회
        AirlineApply application = airlineApplyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 신청을 찾을 수 없습니다. ID: " + id));
        
        // 2. 이미 승인된 경우 체크
        if (application.getAirlineApplyStatus() == CommonEnums.ApplyStatus.APPROVED) {
            throw new IllegalArgumentException("이미 승인된 신청입니다.");
        }
        
        // 3. 아이디 중복 체크
        if (empRepository.findById(adminId).isPresent()) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다: " + adminId);
        }
        
        // 4. 승인 처리
        application.approve();
        
        // 5. 항공사 관리자 계정 생성 (Airline은 InitialSetup에서 생성)
        // 공통 초기 비밀번호 사용
        String initialPassword = "admin1234";
        String encodedPassword = passwordEncoder.encode(initialPassword);
        
        Emp adminAccount = Emp.builder()
                .empId(adminId)
                .airlineId(null) // InitialSetup 완료 후 업데이트됨
                .empName(application.getManagerName() != null ? application.getManagerName() : "관리자")
                .empPwd(encodedPassword)
                .age(30)
                .role(CommonEnums.Role.AIRLINE_ADMIN)
                .phone(application.getManagerPhone())
                .job("항공사 관리자")
                .email(application.getAirlineApplyEmail())
                .empStatus(CommonEnums.EmpStatus.S) // 초기 상태: S (활성화 대기)
                .startDate(LocalDateTime.now())
                .leaveCount(15.0)
                .empNo(generateEmpNo(application.getAirlineName()))
                .build();
        
        adminAccount = empRepository.save(adminAccount);
        
        // 7. ActivationToken 생성 (토큰은 링크에 포함되어야 함)
        String token = ActivationToken.generateToken();
        ActivationToken activationToken = ActivationToken.builder()
                .empId(adminAccount)
                .token(token)
                .expiresAt(LocalDateTime.now().plusYears(100)) // 만료 시간 제거 (거의 무제한)
                .used(false)
                .build();
        activationTokenRepository.save(activationToken);
        
        // 8. 활성화 링크 생성 및 AirlineApply에 저장
        String activationLink = "http://localhost:5173/account-activation?token=" + token;
        application.setActivationLink(activationLink);
        airlineApplyRepository.save(application);
        
        return AirlineApplyDto.ApproveResponse.builder()
                .activationLink(activationLink)
                .adminId(adminId)
                .tempPassword(initialPassword) // 공통 초기 비밀번호 반환
                .build();
    }


    // Entity -> DTO 변환 메서드
    private AirlineApplyDto.ListResponse convertToListResponse(AirlineApply entity) {
        return AirlineApplyDto.ListResponse.builder()
                .id(entity.getAirlineApplyId())
                .date(entity.getCreateDate())
                .airlineName(entity.getAirlineName())
                .email(entity.getAirlineApplyEmail())
                .documentStatus(entity.getAirlineApplyStatus().name())
                .status(entity.getAirlineApplyStatus().name().toLowerCase())
                .build();
    }

    private AirlineApplyDto.DetailResponse convertToDetailResponse(AirlineApply entity) {
        // 첨부 서류 목록 생성
        List<AirlineApplyDto.DocumentInfo> documents = new ArrayList<>();
        
        if (entity.getBusinessLicensePath() != null && !entity.getBusinessLicensePath().isEmpty()) {
            documents.add(AirlineApplyDto.DocumentInfo.builder()
                    .fileName("사업자등록증.pdf")
                    .filePath(entity.getBusinessLicensePath())
                    .build());
        }
        
        if (entity.getEmploymentCertPath() != null && !entity.getEmploymentCertPath().isEmpty()) {
            documents.add(AirlineApplyDto.DocumentInfo.builder()
                    .fileName("재직증명서.pdf")
                    .filePath(entity.getEmploymentCertPath())
                    .build());
        }

        // 승인된 경우 Airline ID 및 활성화 링크 조회
        Long airlineId = null;
        String activationLink = null;
        if (entity.getAirlineApplyStatus() == com.kh.ct.global.common.CommonEnums.ApplyStatus.APPROVED) {
            // Airline 조회 (InitialSetup 완료 시 생성됨)
            java.util.Optional<Airline> airlineOpt = airlineRepository.findByAirlineApplyId(entity.getAirlineApplyId());
            if (airlineOpt.isPresent()) {
                airlineId = airlineOpt.get().getAirlineId();
            }
            
            // 초기 설정이 완료되지 않은 경우에만 활성화 링크 제공
            // (airlineId가 null이면 아직 InitialSetup 미완료)
            if (airlineId == null) {
                // AirlineApply에 저장된 activationLink 사용
                activationLink = entity.getActivationLink();
            }
            // airlineId가 있으면 초기 설정 완료된 것이므로 activationLink는 null로 유지
        }

        return AirlineApplyDto.DetailResponse.builder()
                .id(entity.getAirlineApplyId())
                .date(entity.getCreateDate())
                .airlineName(entity.getAirlineName())
                .email(entity.getAirlineApplyEmail())
                .managerName(entity.getManagerName())
                .managerPhone(entity.getManagerPhone())
                .status(entity.getAirlineApplyStatus().name())
                .cancelReason(entity.getAirlineApplyCancelReason())
                .documents(documents)
                .airlineId(airlineId)
                .activationLink(activationLink)
                .build();
    }
}

