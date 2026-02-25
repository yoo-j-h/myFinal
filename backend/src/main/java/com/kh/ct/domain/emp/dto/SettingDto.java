package com.kh.ct.domain.emp.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL) // null인 필드는 JSON 응답/요청에서 제외
public class SettingDto {

    // --- 프로필 관련 필드 ---
    private String empName;
    private Integer age;
    private String email;
    private String phone;
    private String address;

    // --- 비밀번호 관련 필드 ---
    private String currentPassword;
    private String newPassword;
}