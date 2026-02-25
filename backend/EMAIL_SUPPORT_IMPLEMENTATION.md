# 이메일 문의 기능 구현 완료

## 구현 개요

Q&A 페이지에 "이메일 문의" 기능을 추가했습니다. 사용자는 관리자에게 직접 이메일을 보낼 수 있습니다.

## 패키지 구조

```
backend/src/main/java/com/kh/ct/domain/support/
├── controller/
│   └── SupportController.java
├── dto/
│   └── SupportDto.java
└── service/
    ├── SupportService.java
    └── SupportServiceImpl.java
```

## API 엔드포인트

### 1. GET /api/support/email/prefill
**설명**: 이메일 문의 모달에 필요한 사전 입력 정보 조회

**인증**: 필요 (Authentication)

**응답**:
```json
{
  "success": true,
  "message": "이메일 문의 사전 입력 정보 조회 성공",
  "data": {
    "adminEmail": "admin@airline.com",
    "myEmail": "user@airline.com"
  }
}
```

**로직**:
- `adminEmail`: 같은 `airline_id` 소속 관리자(AIRLINE_ADMIN, SUPER_ADMIN) 이메일
  - 없으면 기본값: `khacademy1team@gmail.com`
- `myEmail`: 로그인 사용자의 `emp.email`

### 2. POST /api/support/email/send
**설명**: 이메일 문의 발송

**인증**: 필요 (Authentication)

**요청**:
```json
{
  "subject": "문의 제목",
  "content": "문의 내용"
}
```

**응답**:
```json
{
  "success": true,
  "message": "이메일 문의가 발송되었습니다.",
  "data": null
}
```

**로직**:
- 관리자 이메일로 문의 내용 전송
- 본문에 보낸 사람 정보 포함 (이름, 이메일, 사번, 역할)

## 주요 코드

### 1. SupportDto.java

```java
public class SupportDto {
    // 이메일 문의 사전 입력 정보 응답
    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EmailPrefillResponse {
        private String adminEmail;
        private String myEmail;
    }
    
    // 이메일 문의 발송 요청
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SendEmailRequest {
        @NotBlank(message = "제목은 필수입니다.")
        @Size(max = 200, message = "제목은 200자 이하여야 합니다.")
        private String subject;
        
        @NotBlank(message = "내용은 필수입니다.")
        @Size(max = 5000, message = "내용은 5000자 이하여야 합니다.")
        private String content;
    }
}
```

### 2. EmpRepository.findAdminEmailsByAirlineId()

```java
@Query("SELECT e.email FROM Emp e " +
       "WHERE e.airlineId.airlineId = :airlineId " +
       "AND e.empStatus = :empStatus " +
       "AND (e.role = :superAdminRole OR e.role = :airlineAdminRole) " +
       "AND e.email IS NOT NULL " +
       "AND e.email != '' " +
       "ORDER BY " +
       "  CASE WHEN e.role = :superAdminRole THEN 1 " +
       "       WHEN e.role = :airlineAdminRole THEN 2 " +
       "       ELSE 3 END, " +
       "  e.createDate ASC")
List<String> findAdminEmailsByAirlineId(
        @Param("airlineId") Long airlineId,
        @Param("empStatus") CommonEnums.EmpStatus empStatus,
        @Param("superAdminRole") CommonEnums.Role superAdminRole,
        @Param("airlineAdminRole") CommonEnums.Role airlineAdminRole
);
```

**특징**:
- SUPER_ADMIN 우선, 그 다음 AIRLINE_ADMIN
- 활성 상태(empStatus='Y')만 조회
- 이메일이 NULL이거나 빈 문자열인 경우 제외

### 3. SupportServiceImpl.getEmailPrefill()

```java
@Override
@Transactional(readOnly = true)
public SupportDto.EmailPrefillResponse getEmailPrefill(Authentication authentication) {
    // 인증된 사용자 조회
    Emp emp = securityUtil.getAuthenticatedEmp(authentication);
    
    // 내 이메일
    String myEmail = emp.getEmail();
    if (myEmail == null || myEmail.trim().isEmpty()) {
        myEmail = "";
    }
    
    // 관리자 이메일 조회
    String adminEmail = getAdminEmail(emp);
    
    return SupportDto.EmailPrefillResponse.builder()
            .adminEmail(adminEmail)
            .myEmail(myEmail)
            .build();
}
```

### 4. SupportServiceImpl.sendEmail()

```java
@Override
@Transactional
public void sendEmail(Authentication authentication, SupportDto.SendEmailRequest request) {
    // 인증된 사용자 조회
    Emp emp = securityUtil.getAuthenticatedEmp(authentication);
    
    // 관리자 이메일 조회
    String adminEmail = getAdminEmail(emp);
    
    // 이메일 본문 생성
    String emailBody = buildEmailBody(emp, request);
    
    // 이메일 발송 (기존 EmailSender 재사용)
    emailSender.send(adminEmail, request.getSubject(), emailBody);
}
```

### 5. 이메일 본문 형식

```
=== 이메일 문의 ===

보낸 사람: 홍길동
이메일: hong@airline.com
사번: 2024001
역할: PILOT

제목: 문의 제목

내용:
문의 내용
```

## 주요 특징

### ✅ 기존 코드 재사용
- `EmailSender` 인터페이스와 `SmtpEmailSender` 구현체 재사용
- `SecurityUtil.getAuthenticatedEmp()` 사용
- `ApiResponse` 패턴 준수

### ✅ 예외 처리
- 관리자 이메일이 없으면 기본값 사용 (`khacademy1team@gmail.com`)
- 사용자 이메일이 없으면 빈 문자열 처리
- 이메일 발송 실패 시 `BusinessException` 발생

### ✅ 트랜잭션
- `getEmailPrefill()`: `@Transactional(readOnly = true)`
- `sendEmail()`: `@Transactional`

### ✅ 검증
- 제목: 필수, 최대 200자
- 내용: 필수, 최대 5000자
- `@Valid` 어노테이션으로 자동 검증

## 프론트엔드 연동 가이드

### 1. 이메일 문의 모달 열기
```javascript
// Q&A 페이지에 "이메일 문의" 버튼 추가
<button onClick={handleOpenEmailModal}>이메일 문의</button>
```

### 2. 사전 입력 정보 조회
```javascript
const loadEmailPrefill = async () => {
  try {
    const response = await axios.get('/api/support/email/prefill', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setAdminEmail(response.data.data.adminEmail);
    setMyEmail(response.data.data.myEmail);
  } catch (error) {
    console.error('이메일 정보 조회 실패:', error);
  }
};
```

### 3. 이메일 발송
```javascript
const handleSendEmail = async () => {
  try {
    await axios.post('/api/support/email/send', {
      subject: subject,
      content: content
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert('이메일이 발송되었습니다.');
    // 모달 닫기
  } catch (error) {
    console.error('이메일 발송 실패:', error);
    alert('이메일 발송에 실패했습니다.');
  }
};
```

## 테스트 시나리오

1. **정상 케이스**
   - 관리자 이메일 조회 성공
   - 사용자 이메일 조회 성공
   - 이메일 발송 성공

2. **관리자 이메일 없음**
   - 기본값(`khacademy1team@gmail.com`) 사용

3. **사용자 이메일 없음**
   - 빈 문자열 반환

4. **이메일 발송 실패**
   - `BusinessException` 발생
   - 에러 메시지 반환

## 주의사항

- 관리자 이메일은 같은 `airline_id` 소속 관리자만 조회
- `airline_id`가 null이면 기본 관리자 이메일 사용
- 이메일 발송은 기존 SMTP 설정 사용
- 프론트엔드에서 `adminEmail`과 `myEmail`은 readOnly로 표시
