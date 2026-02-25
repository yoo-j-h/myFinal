package com.kh.ct.domain.emp.service;

import com.kh.ct.domain.emp.dto.AccountActivationDto;
import com.kh.ct.domain.emp.entity.ActivationToken;
import com.kh.ct.domain.emp.entity.Airline;
import com.kh.ct.domain.emp.entity.AirlineApply;
import com.kh.ct.domain.emp.entity.Emp;
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

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AccountActivationServiceImpl implements AccountActivationService {

    private final ActivationTokenRepository activationTokenRepository;
    private final EmpRepository empRepository;
    private final PasswordEncoder passwordEncoder;
    private final AirlineApplyRepository airlineApplyRepository;
    private final AirlineRepository airlineRepository;

    @Override
    public AccountActivationDto.ActivationInfoResponse getActivationInfo(String token) {
        ActivationToken activationToken = activationTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 토큰입니다."));

        // 만료 시간 체크 제거 - used만 확인
        if (activationToken.getUsed()) {
            throw new IllegalArgumentException("이미 사용된 토큰입니다.");
        }

        Emp emp = activationToken.getEmpId();
        
        // AirlineApply에서 정보 가져오기 (Airline이 아직 생성되지 않았을 수 있음)
        AirlineApply application = airlineApplyRepository.findByAirlineApplyEmail(emp.getEmail())
                .orElse(null);

        return AccountActivationDto.ActivationInfoResponse.builder()
                .email(emp.getEmail())
                .airlineName(application != null ? application.getAirlineName() : "정보 없음")
                .airlineAddress(application != null ? application.getAirlineAddress() : "정보 없음")
                .country("대한민국") // 국내 서비스
                .activationDate(activationToken.getCreateDate())
                .isValid(true)
                .build();
    }

    @Override
    @Transactional
    public AccountActivationDto.ActivationResponse activateAccount(
            String token,
            AccountActivationDto.ActivationRequest request
    ) {
        // 1. 비밀번호 확인 일치 검증
        if (!request.getPassword().equals(request.getPasswordConfirm())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 2. 토큰 검증
        ActivationToken activationToken = activationTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 토큰입니다."));

        // 만료 시간 체크 제거 - used만 확인
        if (activationToken.getUsed()) {
            throw new IllegalArgumentException("이미 사용된 토큰입니다.");
        }

        // 3. 비밀번호 업데이트 및 계정 상태 활성화
        Emp emp = activationToken.getEmpId();
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        emp.updatePassword(encodedPassword);
        // 계정 상태를 Y(활성)로 변경
        emp.updateEmpStatus(CommonEnums.EmpStatus.Y);
        empRepository.save(emp);

        // 4. 토큰 사용 처리
        activationToken.markAsUsed();
        activationTokenRepository.save(activationToken);

        return AccountActivationDto.ActivationResponse.builder()
                .message("계정 활성화가 완료되었습니다.")
                .success(true)
                .build();
    }

    // 재발급 기능 제거됨

    @Override
    @Transactional
    public AccountActivationDto.InitialSetupResponse completeInitialSetup(
            String token,
            AccountActivationDto.InitialSetupRequest request,
            String logoFilePath
    ) {
        // 1. 토큰으로 Emp 찾기 (사용된 토큰도 조회 가능하도록)
        ActivationToken activationToken = activationTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 토큰입니다."));

        Emp emp = activationToken.getEmpId();

        // 2. Emp의 email로 AirlineApply 찾기
        AirlineApply application = airlineApplyRepository.findByAirlineApplyEmail(emp.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("해당 신청 정보를 찾을 수 없습니다."));

        // 3. 이미 Airline이 생성되었는지 확인
        if (airlineRepository.existsByAirlineApplyId(application.getAirlineApplyId())) {
            throw new com.kh.ct.global.exception.BusinessException(
                    org.springframework.http.HttpStatus.CONFLICT,
                    "이미 초기 설정이 완료되었습니다."
            );
        }

        // 4. AirlineApply 정보 + InitialSetup 정보로 Airline 생성
        Airline airline = Airline.builder()
                .airlineName(request.getAirlineName()) // 수정 가능한 항공사명
                .airlineAddress(request.getAirlineAddress()) // 수정 가능한 주소
                .theme(request.getTheme()) // 선택한 테마
                .mainNumber(request.getRepresentativePhone()) // 대표자 번호
                .airlineDesc(request.getAirlineDesc() != null ? request.getAirlineDesc() : "") // 항공사 설명
                .email(request.getRepresentativeEmail()) // 대표 이메일
                .phone(request.getRepresentativePhone()) // 대표자 번호
                .plan("Professional") // 기본 플랜
                .status(CommonEnums.AirlineStatus.ACTIVE)
                .icon("✈️") // 기본 아이콘
                .country("대한민국") // 국내 서비스
                .joinDate(LocalDate.now())
                .storageUsage(0.0)
                .lastLoginDate(LocalDateTime.now())
                .airlineApplyId(application)
                .build();
        airline = airlineRepository.save(airline);

        // 5. Emp의 airlineId 업데이트
        emp.updateAirlineId(airline);
        empRepository.save(emp);

        return AccountActivationDto.InitialSetupResponse.builder()
                .message("초기 설정이 완료되었습니다.")
                .success(true)
                .airlineId(airline.getAirlineId())
                .airlineName(airline.getAirlineName())
                .adminId(emp.getEmpId())
                .build();
    }
}

