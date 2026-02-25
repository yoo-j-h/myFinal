# 이메일 문의 Reply-To 설정 완료

## 수정 완료 요약

### 문제
Gmail에서 "답장하기"를 누르면 관리자 메일(khacademy1team@gmail.com)로 다시 보내지는 문제가 있었습니다.

### 원인
메일 헤더에 `Reply-To`가 설정되지 않아, Gmail이 기본적으로 From 주소로 답장을 보내려고 했습니다.

### 해결 방법
메일 발송 시 `Reply-To` 헤더를 문의 작성자 이메일로 설정하여, 관리자가 "답장하기"를 누르면 자동으로 문의 작성자에게 답장이 가도록 수정했습니다.

## 수정된 파일

### 1. EmailSender.java
**추가된 메서드**:
```java
void sendWithReplyTo(String to, String replyTo, String subject, String text);
```

### 2. SmtpEmailSender.java
**추가된 기능**:
- `sendWithReplyTo()` 메서드 구현
- `From` 헤더를 `spring.mail.username`으로 설정
- `Reply-To` 헤더를 문의 작성자 이메일로 설정

```java
@Override
public void sendWithReplyTo(String to, String replyTo, String subject, String text) {
    MimeMessage mimeMessage = mailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
    
    // From 헤더 설정
    if (mailUsername != null && !mailUsername.trim().isEmpty()) {
        helper.setFrom(mailUsername);
    }
    
    helper.setTo(to);
    helper.setSubject(subject);
    helper.setText(text, false);
    
    // Reply-To 헤더 설정
    if (replyTo != null && !replyTo.trim().isEmpty()) {
        helper.setReplyTo(replyTo);
    }
    
    mailSender.send(mimeMessage);
}
```

### 3. SupportServiceImpl.java
**수정된 로직**:
- 문의 작성자 이메일(`senderEmail`) 추출
- `senderEmail`이 있으면 `sendWithReplyTo()` 사용
- `senderEmail`이 없으면 기본 `send()` 사용 (경고 로그)

```java
// 문의 작성자 이메일 (Reply-To로 사용)
String senderEmail = emp.getEmail();
if (senderEmail == null || senderEmail.trim().isEmpty()) {
    log.warn("문의 작성자 이메일이 없습니다 - empId: {}, Reply-To 설정 불가", emp.getEmpId());
    senderEmail = null;
}

// 이메일 발송 (Reply-To 설정)
if (senderEmail != null && !senderEmail.trim().isEmpty()) {
    emailSender.sendWithReplyTo(adminEmail, senderEmail, subject, emailBody);
    log.info("이메일 문의 발송 완료 (Reply-To 설정) - to: {}, replyTo: {}, subject: {}", 
            adminEmail, senderEmail, subject);
} else {
    emailSender.send(adminEmail, subject, emailBody);
    log.warn("이메일 문의 발송 완료 (Reply-To 없음) - to: {}, subject: {}", adminEmail, subject);
}
```

## 메일 헤더 구조

### 발송되는 메일 헤더
```
From: khacademy1team@gmail.com (spring.mail.username)
To: adminEmail (관리자 이메일)
Reply-To: senderEmail (문의 작성자 이메일)
Subject: [문의 제목]
```

### Gmail에서 "답장하기" 클릭 시
- **이전**: To가 `khacademy1team@gmail.com` (본인)
- **수정 후**: To가 `senderEmail` (문의 작성자 이메일)

## 검증 방법

### 1. 메일 발송 테스트
1. 사용자가 이메일 문의 보내기
2. 관리자 Gmail에서 메일 수신 확인
3. "답장하기" 버튼 클릭
4. **받는 사람이 문의 작성자 이메일로 자동 설정되는지 확인**

### 2. 서버 로그 확인
다음 로그가 출력되어야 합니다:
```
[INFO] 이메일 발송 시도 - to: admin@airline.com, replyTo: user@airline.com, subject: ...
[INFO] 이메일 문의 발송 완료 (Reply-To 설정) - to: admin@airline.com, replyTo: user@airline.com, subject: ...
```

### 3. 메일 헤더 확인
Gmail에서 메일을 열고 "원본 보기" 또는 "Show original"을 통해 다음 헤더 확인:
```
Reply-To: user@airline.com
```

## 메일 설정 확인

### application_secret.yaml
```yaml
spring:
  mail:
    host: smtp.gmail.com
    port: 465
    username: khacademy1team@gmail.com
    password: [앱 비밀번호]
    properties:
      mail:
        smtp:
          auth: true
          ssl:
            enable: true
```

**주의사항**:
- Gmail은 일반 비밀번호가 아닌 **앱 비밀번호**를 사용해야 합니다
- 포트 465는 SSL 사용, 포트 587은 STARTTLS 사용
- 현재 설정은 465 + SSL로 통일되어 있음

## 예외 처리

### 문의 작성자 이메일이 없는 경우
- `senderEmail`이 null이거나 빈 문자열이면 기본 `send()` 메서드 사용
- 경고 로그 출력: `"이메일 문의 발송 완료 (Reply-To 없음)"`
- 메일은 정상 발송되지만 Reply-To는 설정되지 않음

## 추가 개선 사항 (선택)

### 답장 API 구현 (향후)
현재는 Reply-To만 설정되어 있어 Gmail에서 수동으로 답장해야 합니다.
향후 관리자가 시스템에서 직접 답장할 수 있는 API를 구현한다면:

1. **Support 엔티티 생성** (문의 저장)
   - `supportId`, `senderEmail`, `subject`, `content`, `createDate` 등

2. **답장 API 추가**
   - `POST /api/support/email/reply`
   - `supportId`로 원문의 `senderEmail` 조회
   - `To`를 `senderEmail`로 설정하여 발송

3. **문의 이력 관리**
   - 문의와 답장을 연결하여 이력 관리

## 테스트 시나리오

### 정상 케이스
1. 사용자(이메일: user@airline.com)가 문의 발송
2. 관리자(이메일: admin@airline.com)가 메일 수신
3. Gmail에서 "답장하기" 클릭
4. ✅ 받는 사람이 `user@airline.com`으로 자동 설정됨

### 예외 케이스
1. 사용자 이메일이 없는 경우
   - Reply-To 설정 없이 메일 발송
   - 경고 로그 출력
   - 메일은 정상 발송됨

## 주의사항

1. **메일 설정 확인**
   - `spring.mail.username`이 올바르게 설정되어 있는지 확인
   - Gmail 앱 비밀번호가 유효한지 확인

2. **이메일 형식 검증**
   - `senderEmail`이 유효한 이메일 형식인지 확인 (현재는 DB에서 가져오므로 검증됨)

3. **로깅**
   - Reply-To 설정 여부를 로그로 확인 가능
   - 문제 발생 시 로그를 통해 원인 파악 가능
