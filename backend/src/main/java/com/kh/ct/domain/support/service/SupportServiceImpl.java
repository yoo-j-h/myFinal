package com.kh.ct.domain.support.service;

import com.kh.ct.domain.emp.entity.Emp;
import com.kh.ct.domain.emp.repository.EmpRepository;
import com.kh.ct.domain.emp.service.EmailSender;
import com.kh.ct.domain.support.dto.SupportDto;
import com.kh.ct.global.exception.BusinessException;
import com.kh.ct.global.service.NotificationEventPublisher;
import com.kh.ct.global.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 고객 지원 서비스 구현체
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SupportServiceImpl implements SupportService {
    
    private static final String DEFAULT_ADMIN_EMAIL = "khacademy1team@gmail.com";
    
    private final EmpRepository empRepository;
    private final EmailSender emailSender;
    private final SecurityUtil securityUtil;
    private final NotificationEventPublisher notificationEventPublisher;
    
    @Override
    @Transactional(readOnly = true)
    public SupportDto.EmailPrefillResponse getEmailPrefill(Authentication authentication) {
        log.info("이메일 문의 사전 입력 정보 조회 요청");
        
        try {
            // 인증된 사용자 조회
            if (authentication == null) {
                log.error("Authentication이 null입니다.");
                throw BusinessException.forbidden("인증이 필요합니다.");
            }
            
            Emp emp = securityUtil.getAuthenticatedEmp(authentication);
            
            if (emp == null) {
                log.error("Emp가 null입니다.");
                throw BusinessException.notFound("사용자 정보를 찾을 수 없습니다.");
            }
            
            log.info("인증된 사용자 조회 성공 - empId: {}, empName: {}", emp.getEmpId(), emp.getEmpName());
            
            // 내 이메일
            String myEmail = emp.getEmail();
            if (myEmail == null || myEmail.trim().isEmpty()) {
                log.warn("사용자 이메일이 없습니다 - empId: {}", emp.getEmpId());
                myEmail = ""; // 빈 문자열로 처리
            }
            
            // 관리자 이메일 조회
            String adminEmail = getAdminEmail(emp);
            
            if (adminEmail == null || adminEmail.trim().isEmpty()) {
                log.warn("관리자 이메일이 비어있습니다 - 기본값 사용");
                adminEmail = DEFAULT_ADMIN_EMAIL;
            }
            
            log.info("이메일 문의 사전 입력 정보 조회 완료 - adminEmail: {}, myEmail: {}", adminEmail, myEmail);
            
            return SupportDto.EmailPrefillResponse.builder()
                    .adminEmail(adminEmail)
                    .myEmail(myEmail)
                    .build();
        } catch (BusinessException e) {
            log.error("BusinessException 발생 - status: {}, message: {}", e.getStatus(), e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("이메일 문의 사전 입력 정보 조회 중 예상치 못한 오류 발생", e);
            throw BusinessException.internalServerError("이메일 정보를 조회하는 중 오류가 발생했습니다: " + 
                    (e.getMessage() != null ? e.getMessage() : "알 수 없는 오류"));
        }
    }
    
    @Override
    @Transactional
    public void sendEmail(Authentication authentication, SupportDto.SendEmailRequest request) {
        log.info("이메일 문의 발송 요청 - subject: {}", request.getSubject());
        
        // 1. 인증된 사용자 조회
        Emp emp = securityUtil.getAuthenticatedEmp(authentication);
        
        // 2. 요청 데이터 검증
        if (request == null) {
            log.error("SendEmailRequest가 null입니다.");
            throw BusinessException.badRequest("요청 데이터가 없습니다.");
        }
        
        String subject = request.getSubject();
        String content = request.getContent();
        
        if (subject == null || subject.trim().isEmpty()) {
            log.error("제목이 비어있습니다.");
            throw BusinessException.badRequest("제목은 필수입니다.");
        }
        
        if (content == null || content.trim().isEmpty()) {
            log.error("내용이 비어있습니다.");
            throw BusinessException.badRequest("내용은 필수입니다.");
        }
        
        // 3. 관리자 이메일 조회 (fallback 포함)
        String adminEmail = getAdminEmail(emp);
        
        if (adminEmail == null || adminEmail.trim().isEmpty()) {
            log.error("관리자 이메일을 조회할 수 없습니다 - 기본값도 설정되지 않음");
            throw BusinessException.internalServerError("관리자 이메일을 조회할 수 없습니다.");
        }
        
        // 4. 이메일 본문 생성
        String emailBody = buildEmailBody(emp, request);
        
        if (emailBody == null || emailBody.trim().isEmpty()) {
            log.error("이메일 본문 생성 실패");
            throw BusinessException.internalServerError("이메일 본문 생성에 실패했습니다.");
        }
        
        // 5. 문의 작성자 이메일 (Reply-To로 사용)
        String senderEmail = emp.getEmail();
        if (senderEmail == null || senderEmail.trim().isEmpty()) {
            log.warn("문의 작성자 이메일이 없습니다 - empId: {}, Reply-To 설정 불가", emp.getEmpId());
            senderEmail = null; // Reply-To 설정 불가
        }
        
        // 6. 이메일 발송 (Reply-To 설정)
        try {
            log.info("이메일 발송 시도 - to: {}, replyTo: {}, subject: {}", adminEmail, senderEmail, subject);
            
            if (senderEmail != null && !senderEmail.trim().isEmpty()) {
                // Reply-To가 설정된 메일 발송
                emailSender.sendWithReplyTo(adminEmail, senderEmail, subject, emailBody);
                log.info("이메일 문의 발송 완료 (Reply-To 설정) - to: {}, replyTo: {}, subject: {}", 
                        adminEmail, senderEmail, subject);
            } else {
                // Reply-To가 없으면 기본 send 메서드 사용
                emailSender.send(adminEmail, subject, emailBody);
                log.warn("이메일 문의 발송 완료 (Reply-To 없음) - to: {}, subject: {}", adminEmail, subject);
            }
            
            // 7. 관리자에게 알림 발행
            try {
                String adminEmpId = getAdminEmpId(emp);
                if (adminEmpId != null && !adminEmpId.trim().isEmpty()) {
                    String alarmContent = String.format("%s님이 이메일 문의를 보냈습니다: %s", 
                            emp.getEmpName() != null ? emp.getEmpName() : emp.getEmpId(), 
                            subject);
                    String alarmLink = "/qna"; // Q&A 페이지로 이동
                    notificationEventPublisher.publishNotificationEvent(
                            adminEmpId,
                            alarmContent,
                            "EMAIL_INQUIRY",
                            alarmLink
                    );
                    log.info("관리자에게 이메일 문의 알림 발행 완료 - adminEmpId: {}, subject: {}", adminEmpId, subject);
                } else {
                    log.warn("관리자 empId를 찾을 수 없어 알림을 발행하지 않습니다 - airlineId: {}", 
                            emp.getAirlineId() != null ? emp.getAirlineId().getAirlineId() : "null");
                }
            } catch (Exception e) {
                // 알림 발행 실패는 이메일 발송 성공에 영향을 주지 않도록 로그만 남김
                log.error("관리자에게 알림 발행 실패 - 이메일은 정상 발송됨", e);
            }
        } catch (org.springframework.mail.MailAuthenticationException e) {
            log.error("이메일 인증 실패 - SMTP 설정을 확인해주세요", e);
            throw BusinessException.internalServerError("이메일 서버 인증에 실패했습니다. 관리자에게 문의해주세요.");
        } catch (org.springframework.mail.MailException e) {
            log.error("이메일 전송 실패 - MailException: {}", e.getMessage(), e);
            // MailException의 원인 예외 확인
            Throwable cause = e.getCause();
            if (cause instanceof jakarta.mail.AuthenticationFailedException) {
                log.error("이메일 인증 실패 - AuthenticationFailedException", cause);
                throw BusinessException.internalServerError("이메일 서버 인증에 실패했습니다. 관리자에게 문의해주세요.");
            } else if (cause instanceof jakarta.mail.MessagingException) {
                log.error("이메일 전송 실패 - MessagingException", cause);
                throw BusinessException.internalServerError("이메일 전송에 실패했습니다. 잠시 후 다시 시도해주세요.");
            }
            throw BusinessException.internalServerError("이메일 전송에 실패했습니다. 잠시 후 다시 시도해주세요.");
        } catch (IllegalArgumentException e) {
            log.error("이메일 전송 실패 - 잘못된 인자: {}", e.getMessage(), e);
            throw BusinessException.badRequest("이메일 주소 형식이 올바르지 않습니다.");
        } catch (RuntimeException e) {
            // SmtpEmailSender의 sendHtml/sendMultipart에서 발생할 수 있는 RuntimeException
            log.error("이메일 전송 실패 - RuntimeException: {}", e.getMessage(), e);
            Throwable cause = e.getCause();
            if (cause instanceof jakarta.mail.AuthenticationFailedException) {
                log.error("이메일 인증 실패 - AuthenticationFailedException", cause);
                throw BusinessException.internalServerError("이메일 서버 인증에 실패했습니다. 관리자에게 문의해주세요.");
            } else if (cause instanceof jakarta.mail.MessagingException) {
                log.error("이메일 전송 실패 - MessagingException", cause);
                throw BusinessException.internalServerError("이메일 전송에 실패했습니다. 잠시 후 다시 시도해주세요.");
            }
            throw BusinessException.internalServerError("이메일 발송 중 오류가 발생했습니다: " + 
                    (e.getMessage() != null ? e.getMessage() : "알 수 없는 오류"));
        } catch (Exception e) {
            log.error("이메일 문의 발송 실패 - 예상치 못한 오류 - to: {}, from: {}, subject: {}", 
                    adminEmail, emp.getEmail() != null ? emp.getEmail() : "없음", subject, e);
            // 민감한 정보는 마스킹
            String errorMessage = e.getMessage();
            if (errorMessage != null && errorMessage.contains("password")) {
                errorMessage = "이메일 서버 설정 오류가 발생했습니다.";
            }
            throw BusinessException.internalServerError("이메일 발송 중 오류가 발생했습니다: " + 
                    (errorMessage != null ? errorMessage : "알 수 없는 오류"));
        }
    }
    
    /**
     * 관리자 empId 조회
     * - 같은 airline_id 소속 관리자 empId 조회
     * - 없으면 null 반환
     */
    private String getAdminEmpId(Emp emp) {
        try {
            if (emp == null) {
                log.warn("Emp가 null입니다 - 관리자 empId 조회 불가");
                return null;
            }
            
            Long airlineId = emp.getAirlineId() != null ? emp.getAirlineId().getAirlineId() : null;
            
            if (airlineId == null) {
                log.warn("사용자의 airlineId가 null입니다 - empId: {}, 관리자 empId 조회 불가", emp.getEmpId());
                return null;
            }
            
            // 같은 airline_id 소속 관리자 empId 조회
            List<String> adminEmpIds = empRepository.findAdminEmpIdsByAirlineId(
                    airlineId,
                    com.kh.ct.global.common.CommonEnums.EmpStatus.Y,
                    com.kh.ct.global.common.CommonEnums.Role.SUPER_ADMIN,
                    com.kh.ct.global.common.CommonEnums.Role.AIRLINE_ADMIN
            );
            
            if (adminEmpIds == null || adminEmpIds.isEmpty()) {
                log.warn("항공사({})에 관리자 empId가 없습니다", airlineId);
                return null;
            }
            
            String adminEmpId = adminEmpIds.get(0); // 첫 번째 관리자 empId 사용
            if (adminEmpId == null || adminEmpId.trim().isEmpty()) {
                log.warn("항공사({})의 관리자 empId가 비어있습니다", airlineId);
                return null;
            }
            
            log.info("관리자 empId 조회 성공 - airlineId: {}, adminEmpId: {}", airlineId, adminEmpId);
            return adminEmpId;
        } catch (Exception e) {
            log.error("관리자 empId 조회 중 오류 발생", e);
            return null;
        }
    }
    
    /**
     * 관리자 이메일 조회
     * - 같은 airline_id 소속 관리자 이메일 조회
     * - 없으면 기본값 반환
     */
    private String getAdminEmail(Emp emp) {
        try {
            if (emp == null) {
                log.warn("Emp가 null입니다 - 기본 관리자 이메일 사용");
                return DEFAULT_ADMIN_EMAIL;
            }
            
            Long airlineId = emp.getAirlineId() != null ? emp.getAirlineId().getAirlineId() : null;
            
            if (airlineId == null) {
                log.warn("사용자의 airlineId가 null입니다 - empId: {}, 기본 관리자 이메일 사용", emp.getEmpId());
                return DEFAULT_ADMIN_EMAIL;
            }
            
            // 같은 airline_id 소속 관리자 이메일 조회
            List<String> adminEmails = empRepository.findAdminEmailsByAirlineId(
                    airlineId,
                    com.kh.ct.global.common.CommonEnums.EmpStatus.Y,
                    com.kh.ct.global.common.CommonEnums.Role.SUPER_ADMIN,
                    com.kh.ct.global.common.CommonEnums.Role.AIRLINE_ADMIN
            );
            
            if (adminEmails == null || adminEmails.isEmpty()) {
                log.warn("항공사({})에 관리자 이메일이 없습니다 - 기본 관리자 이메일 사용", airlineId);
                return DEFAULT_ADMIN_EMAIL;
            }
            
            String adminEmail = adminEmails.get(0); // 첫 번째 관리자 이메일 사용
            if (adminEmail == null || adminEmail.trim().isEmpty()) {
                log.warn("항공사({})의 관리자 이메일이 비어있습니다 - 기본 관리자 이메일 사용", airlineId);
                return DEFAULT_ADMIN_EMAIL;
            }
            
            log.info("관리자 이메일 조회 성공 - airlineId: {}, adminEmail: {}", airlineId, adminEmail);
            return adminEmail;
        } catch (Exception e) {
            log.error("관리자 이메일 조회 중 오류 발생 - 기본 관리자 이메일 사용", e);
            return DEFAULT_ADMIN_EMAIL;
        }
    }
    
    /**
     * 이메일 본문 생성
     * - 보낸 사람 이름, 이메일, 제목, 내용 포함
     */
    private String buildEmailBody(Emp emp, SupportDto.SendEmailRequest request) {
        if (emp == null) {
            log.error("Emp가 null입니다.");
            throw BusinessException.internalServerError("사용자 정보를 찾을 수 없습니다.");
        }
        
        if (request == null) {
            log.error("SendEmailRequest가 null입니다.");
            throw BusinessException.internalServerError("요청 정보를 찾을 수 없습니다.");
        }
        
        StringBuilder body = new StringBuilder();
        body.append("=== 이메일 문의 ===\n\n");
        body.append("보낸 사람: ").append(emp.getEmpName() != null ? emp.getEmpName() : "없음").append("\n");
        body.append("이메일: ").append(emp.getEmail() != null ? emp.getEmail() : "없음").append("\n");
        body.append("사번: ").append(emp.getEmpNo() != null ? emp.getEmpNo() : "없음").append("\n");
        body.append("역할: ").append(emp.getRole() != null ? emp.getRole().name() : "없음").append("\n\n");
        body.append("제목: ").append(request.getSubject() != null ? request.getSubject() : "").append("\n\n");
        body.append("내용:\n").append(request.getContent() != null ? request.getContent() : "").append("\n");
        
        return body.toString();
    }

    @Override
    @Transactional
    public void replyEmail(Authentication authentication, SupportDto.ReplyEmailRequest request) {
        log.info("관리자 이메일 답변 발송 요청 - employeeEmail: {}, subject: {}", request.getEmployeeEmail(), request.getSubject());

        // 1. 인증된 관리자 조회
        Emp admin = securityUtil.getAuthenticatedEmp(authentication);
        if (admin == null) {
            log.error("관리자 정보를 찾을 수 없습니다.");
            throw BusinessException.notFound("관리자 정보를 찾을 수 없습니다.");
        }

        // 관리자 권한 확인
        if (admin.getRole() != com.kh.ct.global.common.CommonEnums.Role.AIRLINE_ADMIN &&
            admin.getRole() != com.kh.ct.global.common.CommonEnums.Role.SUPER_ADMIN) {
            log.error("관리자 권한이 없습니다 - empId: {}, role: {}", admin.getEmpId(), admin.getRole());
            throw BusinessException.forbidden("관리자만 답변할 수 있습니다.");
        }

        // 2. 요청 데이터 검증
        if (request == null) {
            log.error("ReplyEmailRequest가 null입니다.");
            throw BusinessException.badRequest("요청 데이터가 없습니다.");
        }

        String employeeEmail = request.getEmployeeEmail();
        String subject = request.getSubject();
        String content = request.getContent();

        if (employeeEmail == null || employeeEmail.trim().isEmpty()) {
            log.error("직원 이메일이 비어있습니다.");
            throw BusinessException.badRequest("직원 이메일은 필수입니다.");
        }

        if (subject == null || subject.trim().isEmpty()) {
            log.error("제목이 비어있습니다.");
            throw BusinessException.badRequest("제목은 필수입니다.");
        }

        if (content == null || content.trim().isEmpty()) {
            log.error("내용이 비어있습니다.");
            throw BusinessException.badRequest("내용은 필수입니다.");
        }

        // 3. 직원 조회 (이메일 기반)
        Emp employee = empRepository.findByEmailAndEmpStatus(
                employeeEmail.trim(),
                com.kh.ct.global.common.CommonEnums.EmpStatus.Y
        ).orElse(null);

        if (employee == null) {
            log.warn("직원을 찾을 수 없습니다 - email: {}", employeeEmail);
            throw BusinessException.notFound("해당 이메일의 직원을 찾을 수 없습니다.");
        }

        // 4. 이메일 본문 생성
        String emailBody = buildReplyEmailBody(admin, employee, request);

        // 5. 직원 empId 확인 (알림 발행을 위해 미리 확인)
        String employeeEmpId = employee.getEmpId();
        if (employeeEmpId == null || employeeEmpId.trim().isEmpty()) {
            log.error("직원 empId가 없습니다 - email: {}, 알림 발행 불가", employeeEmail);
            throw BusinessException.internalServerError("직원 정보를 찾을 수 없습니다.");
        }
        log.info("직원 정보 확인 완료 - employeeEmpId: {}, email: {}", employeeEmpId, employeeEmail);

        // 6. 이메일 발송
        boolean emailSent = false;
        try {
            log.info("이메일 답변 발송 시도 - to: {}, from: {}, subject: {}", 
                    employeeEmail, admin.getEmail() != null ? admin.getEmail() : "시스템", subject);

            emailSender.send(employeeEmail, subject, emailBody);
            emailSent = true;
            log.info("이메일 답변 발송 완료 - to: {}, subject: {}", employeeEmail, subject);
        } catch (org.springframework.mail.MailAuthenticationException e) {
            log.error("이메일 인증 실패 - SMTP 설정을 확인해주세요", e);
            throw BusinessException.internalServerError("이메일 서버 인증에 실패했습니다. 관리자에게 문의해주세요.");
        } catch (org.springframework.mail.MailException e) {
            log.error("이메일 전송 실패 - MailException: {}", e.getMessage(), e);
            Throwable cause = e.getCause();
            if (cause instanceof jakarta.mail.AuthenticationFailedException) {
                log.error("이메일 인증 실패 - AuthenticationFailedException", cause);
                throw BusinessException.internalServerError("이메일 서버 인증에 실패했습니다. 관리자에게 문의해주세요.");
            } else if (cause instanceof jakarta.mail.MessagingException) {
                log.error("이메일 전송 실패 - MessagingException", cause);
                throw BusinessException.internalServerError("이메일 전송에 실패했습니다. 잠시 후 다시 시도해주세요.");
            }
            throw BusinessException.internalServerError("이메일 전송에 실패했습니다. 잠시 후 다시 시도해주세요.");
        } catch (IllegalArgumentException e) {
            log.error("이메일 전송 실패 - 잘못된 인자: {}", e.getMessage(), e);
            throw BusinessException.badRequest("이메일 주소 형식이 올바르지 않습니다.");
        } catch (RuntimeException e) {
            log.error("이메일 전송 실패 - RuntimeException: {}", e.getMessage(), e);
            Throwable cause = e.getCause();
            if (cause instanceof jakarta.mail.AuthenticationFailedException) {
                log.error("이메일 인증 실패 - AuthenticationFailedException", cause);
                throw BusinessException.internalServerError("이메일 서버 인증에 실패했습니다. 관리자에게 문의해주세요.");
            } else if (cause instanceof jakarta.mail.MessagingException) {
                log.error("이메일 전송 실패 - MessagingException", cause);
                throw BusinessException.internalServerError("이메일 전송에 실패했습니다. 잠시 후 다시 시도해주세요.");
            }
            throw BusinessException.internalServerError("이메일 발송 중 오류가 발생했습니다: " + 
                    (e.getMessage() != null ? e.getMessage() : "알 수 없는 오류"));
        } catch (Exception e) {
            log.error("이메일 답변 발송 실패 - 예상치 못한 오류 - to: {}, subject: {}", employeeEmail, subject, e);
            throw BusinessException.internalServerError("이메일 발송 중 오류가 발생했습니다: " + 
                    (e.getMessage() != null ? e.getMessage() : "알 수 없는 오류"));
        }

        // 7. 직원에게 알림 발행 (이메일 발송 성공 후)
        if (emailSent) {
            try {
                log.info("직원에게 알림 발행 시도 - employeeEmpId: {}, subject: {}", employeeEmpId, subject);
                String alarmContent = String.format("관리자가 이메일 답변을 보냈습니다: %s", subject);
                String alarmLink = "/qna"; // Q&A 페이지로 이동
                
                notificationEventPublisher.publishNotificationEvent(
                        employeeEmpId,
                        alarmContent,
                        "EMAIL_REPLY",
                        alarmLink
                );
                log.info("✅ 직원에게 이메일 답변 알림 발행 완료 - employeeEmpId: {}, subject: {}, alarmContent: {}", 
                        employeeEmpId, subject, alarmContent);
            } catch (Exception e) {
                // 알림 발행 실패는 이메일 발송 성공에 영향을 주지 않도록 로그만 남김
                log.error("❌ 직원에게 알림 발행 실패 - employeeEmpId: {}, subject: {}, error: {}", 
                        employeeEmpId, subject, e.getMessage(), e);
                log.error("알림 발행 실패 상세 - 이메일은 정상 발송됨, 알림만 실패", e);
            }
        } else {
            log.warn("이메일 발송이 실패하여 알림을 발행하지 않습니다 - employeeEmpId: {}", employeeEmpId);
        }
    }

    /**
     * 관리자 답변 이메일 본문 생성
     * - 관리자 이름, 답변 내용 포함
     */
    private String buildReplyEmailBody(Emp admin, Emp employee, SupportDto.ReplyEmailRequest request) {
        if (admin == null) {
            log.error("관리자 정보가 null입니다.");
            throw BusinessException.internalServerError("관리자 정보를 찾을 수 없습니다.");
        }

        if (employee == null) {
            log.error("직원 정보가 null입니다.");
            throw BusinessException.internalServerError("직원 정보를 찾을 수 없습니다.");
        }

        if (request == null) {
            log.error("ReplyEmailRequest가 null입니다.");
            throw BusinessException.internalServerError("요청 정보를 찾을 수 없습니다.");
        }

        StringBuilder body = new StringBuilder();
        body.append("=== 이메일 답변 ===\n\n");
        body.append("답변 작성자: ").append(admin.getEmpName() != null ? admin.getEmpName() : "관리자").append("\n");
        body.append("수신자: ").append(employee.getEmpName() != null ? employee.getEmpName() : employee.getEmpId()).append("\n");
        body.append("수신자 이메일: ").append(employee.getEmail() != null ? employee.getEmail() : "없음").append("\n\n");
        body.append("제목: ").append(request.getSubject() != null ? request.getSubject() : "").append("\n\n");
        body.append("답변 내용:\n").append(request.getContent() != null ? request.getContent() : "").append("\n");

        return body.toString();
    }
}
