# 이메일 문의 API 500 에러 수정 완료

## 수정 사항 요약

### 1. DTO 검증 수정 ✅
**문제**: `subject` 필드의 `@Size(max = 10)` 제한이 너무 작음
**수정**: `@Size(max = 200)`으로 변경

```java
@Size(max = 200, message = "제목은 200자 이하여야 합니다.")
private String subject;
```

### 2. 서비스 로직 안정화 ✅

#### 2.1 요청 데이터 검증 강화
- `request` null 체크
- `subject`, `content` null/빈 문자열 체크
- 각 단계별 상세한 로깅

#### 2.2 관리자 이메일 fallback 보장
- `getAdminEmail()` 메서드에서 이미 fallback 처리됨
- 추가로 null 체크 강화

#### 2.3 이메일 본문 생성 안정화
- `emp`, `request` null 체크
- 모든 필드에 null-safe 처리

#### 2.4 메일 전송 예외 처리 세분화
- `AuthenticationFailedException`: SMTP 인증 실패
- `MessagingException`: 메일 전송 실패
- `MailException`: Spring Mail 예외
- `IllegalArgumentException`: 잘못된 이메일 주소
- 기타 예외: 일반적인 오류 메시지

### 3. GlobalExceptionHandler 개선 ✅

#### 3.1 메일 전송 예외 처리 추가
```java
@ExceptionHandler({
    jakarta.mail.AuthenticationFailedException.class,
    jakarta.mail.MessagingException.class,
    org.springframework.mail.MailException.class
})
public ResponseEntity<ErrorResponse> handleMailException(Exception ex) {
    // 인증 실패와 일반 전송 실패를 구분하여 처리
}
```

#### 3.2 BusinessException 로깅 추가
- 예외 발생 시 로그 기록

### 4. 프론트엔드 에러 처리 개선 ✅

- `error.response?.data?.message` 우선 사용
- ErrorResponse와 ApiResponse 모두 지원

## 예상되는 500 원인 및 해결

### 원인 1: DTO 검증 실패 (400)
**증상**: 제목이 10자 초과 시 400 에러
**해결**: ✅ `@Size(max = 200)`으로 수정 완료

### 원인 2: 메일 전송 설정 오류 (500)
**증상**: SMTP 인증 실패, 호스트/포트 오류
**해결**: ✅ 예외 처리 추가, 사용자 친화적 메시지 반환

### 원인 3: NullPointerException (500)
**증상**: `request`, `emp`, `adminEmail` 등이 null
**해결**: ✅ 모든 단계에서 null 체크 추가

### 원인 4: 인증 실패 (401/403)
**증상**: `Authentication`이 null이거나 유효하지 않음
**해결**: ✅ `SecurityUtil.getAuthenticatedEmp()`에서 처리

## API 응답 형식

### 성공 응답
```json
{
  "success": true,
  "message": "이메일 문의가 발송되었습니다.",
  "data": null
}
```

### 실패 응답 (400 - 검증 실패)
```json
{
  "success": false,
  "message": "입력값 검증에 실패하였습니다.",
  "errors": {
    "subject": "제목은 필수입니다.",
    "content": "내용은 필수입니다."
  },
  "timestamp": "2024-01-01T12:00:00"
}
```

### 실패 응답 (400 - 잘못된 요청)
```json
{
  "success": false,
  "message": "제목은 필수입니다.",
  "timestamp": "2024-01-01T12:00:00"
}
```

### 실패 응답 (401/403 - 인증/권한)
```json
{
  "success": false,
  "message": "인증이 필요합니다.",
  "timestamp": "2024-01-01T12:00:00"
}
```

### 실패 응답 (500 - 서버 오류)
```json
{
  "success": false,
  "message": "이메일 전송에 실패했습니다. 잠시 후 다시 시도해주세요.",
  "timestamp": "2024-01-01T12:00:00"
}
```

## 디버깅 가이드

### 1. 서버 로그 확인
다음 로그를 확인하여 원인 파악:
```
[INFO] 이메일 문의 발송 요청 - subject: ...
[INFO] 이메일 발송 시도 - to: ..., subject: ...
[ERROR] 이메일 문의 발송 실패 - ...
```

### 2. 프론트엔드 콘솔 확인
```javascript
// 에러 응답 구조 확인
console.error("에러 응답:", error.response?.data);
```

### 3. 메일 설정 확인
`application.yml` 또는 `application.properties`에서:
```yaml
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: your-email@gmail.com
    password: your-app-password  # Gmail은 앱 비밀번호 필요
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true
```

## 추가 확인 사항

### 1. 메일 서버 설정
- SMTP 호스트/포트가 올바른지 확인
- Gmail 사용 시 앱 비밀번호 사용 여부 확인
- 방화벽/네트워크 설정 확인

### 2. 관리자 이메일 조회
- `emp_fly_schedule` 테이블에 관리자 계정이 있는지 확인
- `airline_id`가 올바르게 설정되어 있는지 확인
- fallback 이메일(`khacademy1team@gmail.com`)이 유효한지 확인

### 3. 인증 토큰
- JWT 토큰이 유효한지 확인
- 토큰에서 추출한 `empId`가 DB에 존재하는지 확인

## 테스트 시나리오

### 정상 케이스
1. 로그인 상태에서 "이메일 문의" 버튼 클릭
2. 제목과 내용 입력 (200자 이하, 5000자 이하)
3. "발송하기" 버튼 클릭
4. ✅ 성공 메시지 표시

### 검증 실패 케이스
1. 제목 없이 발송 시도 → 400 에러
2. 내용 없이 발송 시도 → 400 에러
3. 제목 200자 초과 → 400 에러
4. 내용 5000자 초과 → 400 에러

### 인증 실패 케이스
1. 로그인하지 않은 상태에서 발송 시도 → 401 에러
2. 유효하지 않은 토큰 → 401 에러

### 서버 오류 케이스
1. SMTP 설정 오류 → 500 에러 (사용자 친화적 메시지)
2. 관리자 이메일 조회 실패 → 500 에러 (fallback 적용)

## 수정된 파일 목록

1. `backend/src/main/java/com/kh/ct/domain/support/dto/SupportDto.java`
   - `subject` 필드 `@Size(max = 200)` 수정

2. `backend/src/main/java/com/kh/ct/domain/support/service/SupportServiceImpl.java`
   - 요청 데이터 검증 강화
   - null 체크 추가
   - 메일 전송 예외 처리 세분화

3. `backend/src/main/java/com/kh/ct/global/exception/GlobalExceptionHandler.java`
   - 메일 전송 예외 처리 추가
   - BusinessException 로깅 추가

4. `frontend/src/pages/QnA/QnA.jsx`
   - 에러 메시지 처리 개선

## 다음 단계

1. **서버 재시작 후 테스트**
   - 백엔드 서버 재시작
   - 프론트엔드에서 이메일 문의 기능 테스트

2. **서버 로그 모니터링**
   - 실제 에러 발생 시 로그 확인
   - 스택트레이스 분석

3. **메일 설정 확인**
   - `application.yml`의 메일 설정 확인
   - 필요 시 메일 서버 설정 수정
