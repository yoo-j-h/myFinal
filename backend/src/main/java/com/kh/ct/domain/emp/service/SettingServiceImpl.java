package com.kh.ct.domain.emp.service;

import com.kh.ct.domain.emp.dto.SettingDto;
import com.kh.ct.domain.emp.entity.Emp;
import com.kh.ct.domain.emp.repository.EmpRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SettingServiceImpl implements SettingService {

    private final EmpRepository empRepository;
    private final PasswordEncoder passwordEncoder;
    @Override // 어노테이션 추가
    @Transactional
    public void updateEmpProfile(String empId, SettingDto dto) {
        Emp emp = empRepository.findById(empId)
                .orElseThrow(() -> new RuntimeException("해당 직원을 찾을 수 없습니다."));

        // 엔티티 내부의 updateProfile 메서드 호출
        emp.updateProfile(
                dto.getEmpName(),
                dto.getAge(),
                dto.getEmail(),
                dto.getPhone(),
                dto.getAddress()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public SettingDto getEmpProfile(String empId) {
        Emp emp = empRepository.findById(empId)
                .orElseThrow(() -> new RuntimeException("해당 직원을 찾을 수 없습니다."));

        // 엔티티를 DTO로 변환하여 반환
        return SettingDto.builder()
                .empName(emp.getEmpName())
                .age(emp.getAge())
                .email(emp.getEmail())
                .phone(emp.getPhone())
                .address(emp.getAddress())
                .build();
    }


    @Override
    @Transactional
    public void changePassword(String empId, SettingDto dto) { // ID 타입을 String으로 수정
        // 1. 사원 정보 조회
        Emp employee = empRepository.findById(empId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 2. 현재 비밀번호 확인 (matches 메서드 사용)
        // employee.getEmpPwd()를 사용하여 DB의 암호화된 비밀번호와 대조
        if (!passwordEncoder.matches(dto.getCurrentPassword(), employee.getEmpPwd())) {
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }

        // 3. 새 비밀번호 암호화
        String encryptedPassword = passwordEncoder.encode(dto.getNewPassword());

        // 4. 엔티티 내부의 updatePassword 메서드 호출
        employee.updatePassword(encryptedPassword);

        // @Transactional 덕분에 별도의 save 호출 없이 업데이트됩니다.
    }
}