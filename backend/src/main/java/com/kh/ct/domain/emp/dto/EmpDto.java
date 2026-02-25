package com.kh.ct.domain.emp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kh.ct.domain.emp.entity.Emp;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmpDto {

    private String empId;
    private String empName;
    private String empNo;
    private String role;
    private String job;
    private String phone;
    private String email;
    private String address;
    private String empStatus;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer age;
    private String departmentName;
    private String airlineName;
    private Long profileImageId;

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RegisterRequest {

        @JsonProperty("emp_id")
        @NotBlank(message = "아이디(empId)는 필수입니다.")
        @Size(max = 50, message = "아이디는 50자 이하여야 합니다.")
        private String empId;

        @JsonProperty("emp_no")
        @NotBlank(message = "사번(empNo)은 필수입니다.")
        private String empNo;

        @JsonProperty("emp_name")
        @NotBlank(message = "이름(empName)은 필수입니다.")
        @Size(max = 100, message = "이름은 100자 이하여야 합니다.")
        private String empName;

        @JsonProperty("age")
        @NotNull(message = "나이(age)는 필수입니다.")
        @Min(value = 0, message = "나이는 0 이상이어야 합니다.")
        private Integer age;

        @JsonProperty("emp_pwd")
        @NotBlank(message = "비밀번호(empPwd)는 필수입니다.")
        @Size(min = 4, max = 255, message = "비밀번호는 4~255자여야 합니다.")
        private String empPwd;

        @JsonProperty("email")
        @Email(message = "이메일 형식이 올바르지 않습니다.")
        @Size(max = 150, message = "이메일은 150자 이하여야 합니다.")
        private String email;

        @JsonProperty("phone")
        @Size(max = 30, message = "전화번호는 30자 이하여야 합니다.")
        private String phone;

        @JsonProperty("address")
        @Size(max = 255, message = "주소는 255자 이하여야 합니다.")
        private String address;

        @JsonProperty("job")
        @Size(max = 100, message = "직급/직책은 100자 이하여야 합니다.")
        private String job;

        @JsonProperty("profile_image_id")
        private Long profileImageId;
    }

    @Getter
    @AllArgsConstructor
    @Builder
    public static class RegisterResponse {

        @JsonProperty("emp_id")
        private String empId;

        @JsonProperty("emp_name")
        private String empName;

        @JsonProperty("email")
        private String email;

        @JsonProperty("create_date")
        private LocalDateTime createDate;

        public static RegisterResponse from(Emp emp) {
            return RegisterResponse.builder()
                    .empId(emp.getEmpId())
                    .empName(emp.getEmpName())
                    .email(emp.getEmail())
                    .createDate(emp.getCreateDate())
                    .build();
        }
    }

    @Getter
    @AllArgsConstructor
    @Builder
    public static class IdCheckResponse {

        @JsonProperty("available")
        private boolean available;

        public static IdCheckResponse of(boolean available) {
            return IdCheckResponse.builder()
                    .available(available)
                    .build();
        }
    }

    @Getter
    @AllArgsConstructor
    @Builder
    public static class EmpNoPreviewResponse {
        @JsonProperty("emp_no")
        private String empNo;

        public static EmpNoPreviewResponse of(String empNo) {
            return EmpNoPreviewResponse.builder().empNo(empNo).build();
        }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class EmployeeListItem {
        @JsonProperty("emp_id")
        private String empId;

        @JsonProperty("emp_name")
        private String empName;

        @JsonProperty("role")
        private String role;

        @JsonProperty("job")
        private String job;

        @JsonProperty("department_name")
        private String departmentName;

        @JsonProperty("airline_name")
        private String airlineName;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateRoleAndJobRequest {
        @JsonProperty("role")
        @NotBlank(message = "직급(role)은 필수입니다.")
        private String role;

        @JsonProperty("job")
        @NotBlank(message = "직책(job)은 필수입니다.")
        @Size(max = 50, message = "직책은 50자 이하여야 합니다.")
        private String job;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ChangeMyPasswordRequest {

        @JsonProperty("current_password")
        @NotBlank(message = "현재 비밀번호(current_password)는 필수입니다.")
        private String currentPassword;

        @JsonProperty("new_password")
        @NotBlank(message = "새 비밀번호(new_password)는 필수입니다.")
        @Size(max = 255, message = "새 비밀번호는 255자 이하여야 합니다.")
        private String newPassword;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateMyProfileRequest {

        @JsonProperty("emp_name")
        @Size(max = 100, message = "이름은 100자 이하여야 합니다.")
        private String empName;

        @JsonProperty("age")
        @Min(value = 0, message = "나이는 0 이상이어야 합니다.")
        private Integer age;

        @JsonProperty("email")
        @Email(message = "이메일 형식이 올바르지 않습니다.")
        @Size(max = 150, message = "이메일은 150자 이하여야 합니다.")
        private String email;

        @JsonProperty("phone")
        @Size(max = 30, message = "전화번호는 30자 이하여야 합니다.")
        private String phone;

        @JsonProperty("address")
        @Size(max = 255, message = "주소는 255자 이하여야 합니다.")
        private String address;

        @JsonProperty("profile_image_id")
        private Long profileImageId;
    }

    @Getter
    @AllArgsConstructor
    @Builder
    public static class MyProfileResponse {

        @JsonProperty("emp_id")
        private String empId;

        @JsonProperty("emp_name")
        private String empName;

        @JsonProperty("age")
        private Integer age;

        @JsonProperty("email")
        private String email;

        @JsonProperty("phone")
        private String phone;

        @JsonProperty("address")
        private String address;

        @JsonProperty("profile_image_id")
        private Long profileImageId;

        public static MyProfileResponse from(Emp emp) {
            return MyProfileResponse.builder()
                    .empId(emp.getEmpId())
                    .empName(emp.getEmpName())
                    .age(emp.getAge())
                    .email(emp.getEmail())
                    .phone(emp.getPhone())
                    .address(emp.getAddress())
                    .profileImageId(emp.getProfileImage() != null ? emp.getProfileImage().getFileId() : null)
                    .build();
        }
    }

    // ===============================
    // 아이디 찾기 DTO
    // ===============================

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FindIdRequest {

        @JsonProperty("emp_name")
        @NotBlank(message = "이름(empName)은 필수입니다.")
        @Size(max = 100, message = "이름은 100자 이하여야 합니다.")
        private String empName;

        @JsonProperty("email")
        @Email(message = "이메일 형식이 올바르지 않습니다.")
        @NotBlank(message = "이메일(email)은 필수입니다.")
        @Size(max = 150, message = "이메일은 150자 이하여야 합니다.")
        private String email;
    }

    @Getter
    @AllArgsConstructor
    @Builder
    public static class FindIdResponse {

        @JsonProperty("found")
        private boolean found;

        @JsonProperty("emp_id")
        private String empId;

        @JsonProperty("message")
        private String message;

        public static FindIdResponse success(String empId) {
            return FindIdResponse.builder()
                    .found(true)
                    .empId(empId)
                    .message("아이디를 찾았습니다.")
                    .build();
        }

        public static FindIdResponse fail() {
            return FindIdResponse.builder()
                    .found(false)
                    .empId(null)
                    .message("일치하는 정보가 없습니다.")
                    .build();
        }
    }

    // ===============================
    // 비밀번호 재설정(링크/토큰) DTO
    // ===============================

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SendPasswordResetLinkRequest {

        @JsonProperty("empId")
        @NotBlank(message = "아이디(empId)는 필수입니다.")
        @Size(max = 50, message = "아이디는 50자 이하여야 합니다.")
        private String empId;

        @JsonProperty("email")
        @Email(message = "이메일 형식이 올바르지 않습니다.")
        @NotBlank(message = "이메일(email)은 필수입니다.")
        @Size(max = 150, message = "이메일은 150자 이하여야 합니다.")
        private String email;
    }

    @Getter
    @AllArgsConstructor
    @Builder
    public static class SendPasswordResetLinkResponse {

        @JsonProperty("message")
        private String message;

        public static SendPasswordResetLinkResponse ok() {
            // ✅ 보안상 계정 존재 여부를 노출하지 않도록 "항상 같은 메시지" 권장
            return SendPasswordResetLinkResponse.builder()
                    .message("입력하신 정보가 확인되면 이메일이 발송됩니다.")
                    .build();
        }
    }

    @Getter
    @AllArgsConstructor
    @Builder
    public static class ValidatePasswordTokenResponse {

        @JsonProperty("valid")
        private boolean valid;

        @JsonProperty("message")
        private String message;

        public static ValidatePasswordTokenResponse valid() {
            return ValidatePasswordTokenResponse.builder()
                    .valid(true)
                    .message("사용 가능한 토큰입니다.")
                    .build();
        }

        public static ValidatePasswordTokenResponse invalid(String message) {
            return ValidatePasswordTokenResponse.builder()
                    .valid(false)
                    .message(message)
                    .build();
        }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ResetPasswordByTokenRequest {

        @JsonProperty("token")
        @NotBlank(message = "토큰(token)은 필수입니다.")
        private String token; // ✅ raw token (URL에 들어있는 값)

        @JsonProperty("newPassword")
        @NotBlank(message = "새 비밀번호(new_password)는 필수입니다.")
        @Size(max = 255)
        private String newPassword;
    }

    @Getter
    @AllArgsConstructor
    @Builder
    public static class ResetPasswordByTokenResponse {

        @JsonProperty("message")
        private String message;

        public static ResetPasswordByTokenResponse ok() {
            return ResetPasswordByTokenResponse.builder()
                    .message("비밀번호가 변경되었습니다.")
                    .build();
        }
    }

}
