package com.kh.ct.domain.attendance.service;

import com.kh.ct.domain.attendance.dto.ProtestDto;
import com.kh.ct.domain.attendance.entity.Attendance;
import com.kh.ct.domain.attendance.entity.ProtestApply;
import com.kh.ct.domain.attendance.entity.ProtestApplyFile;
import com.kh.ct.domain.attendance.repository.AttendanceRepository;
import com.kh.ct.domain.attendance.repository.ProtestApplyFileRepository;
import com.kh.ct.domain.attendance.repository.ProtestApplyRepository;
import com.kh.ct.global.service.FileService;
import com.kh.ct.domain.emp.entity.Emp;
import com.kh.ct.domain.emp.repository.EmpRepository;
import com.kh.ct.global.common.CommonEnums;
import com.kh.ct.global.entity.File;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


/**
 * 근태 정정 신청 Service 구현체
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ProtestApplyServiceImpl implements ProtestApplyService {

    private final ProtestApplyRepository protestApplyRepository;
    private final ProtestApplyFileRepository protestApplyFileRepository;
    private final AttendanceRepository attendanceRepository;
    private final EmpRepository empRepository;
    private final FileService fileService;

    /**
     * 근태 정정 신청
     */
    @Override
    @Transactional
    public ProtestDto.ListResponse applyProtest(
            String empId,
            ProtestDto.ApplyRequest request,
            List<MultipartFile> files
    ) {
        log.info("근태 정정 신청 시작 - empId: {}, attendanceId: {}, attendanceDate: {}", 
                empId, request.getAttendanceId(), request.getAttendanceDate());

        // 1. 직원 조회
        Emp applicant = empRepository.findById(empId)
                .orElseThrow(() -> new RuntimeException("직원을 찾을 수 없습니다"));

        // 2. 정정 대상 근태 조회 또는 생성
        Attendance targetAttendance;
        
        if (request.getAttendanceId() != null) {
            // 기존 근태 기록이 있는 경우
            targetAttendance = attendanceRepository.findById(request.getAttendanceId())
                    .orElseThrow(() -> new RuntimeException("근태 기록을 찾을 수 없습니다"));
        } else if (request.getAttendanceDate() != null) {
            // 근태 기록이 없는 경우 새로 생성
            LocalDate attendanceDate = LocalDate.parse(request.getAttendanceDate());
            
            // 해당 날짜에 이미 근태 기록이 있는지 확인
            targetAttendance = attendanceRepository
                    .findByEmpId_EmpIdAndAttendanceDate(empId, attendanceDate)
                    .orElseGet(() -> {
                        // 근태 기록이 없으면 새로 생성
                        Attendance newAttendance = Attendance.builder()
                                .empId(applicant)
                                .attendanceDate(attendanceDate)
                                .attendanceStatus(CommonEnums.AttendanceStatus.ABSENT)  // 기본값: 결근
                                .build();
                        return attendanceRepository.save(newAttendance);
                    });
        } else {
            throw new RuntimeException("attendanceId 또는 attendanceDate 중 하나는 필수입니다");
        }

        // 3. 시간 파싱
        LocalTime requestInTime = null;
        LocalTime requestOutTime = null;
        
        if (request.getProtestRequestInTime() != null && !request.getProtestRequestInTime().isEmpty()) {
            requestInTime = LocalTime.parse(request.getProtestRequestInTime(), DateTimeFormatter.ofPattern("HH:mm"));
        }
        
        if (request.getProtestRequestOutTime() != null && !request.getProtestRequestOutTime().isEmpty()) {
            requestOutTime = LocalTime.parse(request.getProtestRequestOutTime(), DateTimeFormatter.ofPattern("HH:mm"));
        }

        // 4. 근무 유형 파싱
        CommonEnums.AttendanceType attendanceType = CommonEnums.AttendanceType.NORMAL; // 기본값
        if (request.getAttendanceType() != null && !request.getAttendanceType().isEmpty()) {
            try {
                attendanceType = CommonEnums.AttendanceType.valueOf(request.getAttendanceType().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("유효하지 않은 근무 유형입니다: " + request.getAttendanceType());
            }
        }

        // 5. 파일 업로드 처리
        List<File> uploadedFiles = new ArrayList<>();
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                try {
                    File savedFile = fileService.saveFile(file);
                    if (savedFile != null) {
                        uploadedFiles.add(savedFile);
                    }
                } catch (Exception e) {
                    log.error("파일 업로드 실패", e);
                    throw new RuntimeException("파일 업로드에 실패했습니다: " + e.getMessage());
                }
            }
        }

        // 파일이 없으면 에러
        if (uploadedFiles.isEmpty()) {
            throw new RuntimeException("증빙 파일은 필수입니다");
        }

        // 6. 정정 신청 엔티티 생성
        ProtestApply protestApply = ProtestApply.builder()
                .protestApplyDate(LocalDateTime.now())
                .protestApplyApplicant(applicant)
                .protestApplyStatus(CommonEnums.ApplyStatus.PENDING)
                .protestAttendanceStatus(targetAttendance.getAttendanceStatus())
                .protestRequestInTime(requestInTime)
                .protestRequestOutTime(requestOutTime)
                .protestReason(request.getProtestReason())
                .targetAttendance(targetAttendance)
                .originalAttendanceStatus(targetAttendance.getAttendanceStatus())
                .attendanceType(attendanceType)  // 근무 유형 설정
                .build();

        // 7. 정정 신청 저장
        protestApply = protestApplyRepository.save(protestApply);

        // 6. ProtestApplyFile 생성 (파일 연결)
        for (File file : uploadedFiles) {
            ProtestApplyFile protestApplyFile = ProtestApplyFile.builder()
                    .protestApplyId(protestApply)
                    .fileId(file)
                    .build();
            protestApplyFileRepository.save(protestApplyFile);
        }

        // 참고: Attendance 상태는 신청 시점에는 변경하지 않음
        // 관리자가 승인했을 때만 변경됨 (approveProtestByAdmin 메서드 참조)

        log.info("근태 정정 신청 완료 - protestApplyId: {}", protestApply.getProtestApplyId());

        return convertToListResponse(protestApply);
    }

    /**
     * 내 정정 신청 목록 조회
     */
    @Override
    @Transactional(readOnly = true)
    public List<ProtestDto.ListResponse> getMyProtestList(String empId) {
        log.info("정정 신청 목록 조회 - empId: {}", empId);

        List<ProtestApply> protestList = protestApplyRepository
                .findByProtestApplyApplicant_EmpIdOrderByCreateDateDesc(empId);

        return protestList.stream()
                .map(this::convertToListResponse)
                .collect(Collectors.toList());
    }

    /**
     * 정정 신청 상세 조회
     */
    @Override
    @Transactional(readOnly = true)
    public ProtestDto.DetailResponse getProtestDetail(Long protestId) {
        log.info("정정 신청 상세 조회 - protestId: {}", protestId);

        ProtestApply protestApply = protestApplyRepository.findById(protestId)
                .orElseThrow(() -> new RuntimeException("정정 신청을 찾을 수 없습니다"));

        return convertToDetailResponse(protestApply);
    }

    /**
     * 정정 승인/반려
     */
    @Override
    @Transactional
    public ProtestDto.ListResponse approveProtest(
            Long protestId,
            String approverId,
            ProtestDto.ApproveRequest request
    ) {
        log.info("정정 승인/반려 - protestId: {}, approverId: {}, approved: {}", 
                protestId, approverId, request.getApproved());

        // 1. 정정 신청 조회
        ProtestApply protestApply = protestApplyRepository.findById(protestId)
                .orElseThrow(() -> new RuntimeException("정정 신청을 찾을 수 없습니다"));

        // 2. 승인자 조회
        Emp approver = empRepository.findById(approverId)
                .orElseThrow(() -> new RuntimeException("승인자를 찾을 수 없습니다"));

        // 3. 승인/반려 처리
        if (request.getApproved()) {
            // 승인: Attendance 실제 수정
            Attendance targetAttendance = protestApply.getTargetAttendance();
            
            Attendance updatedAttendance = Attendance.builder()
                    .attendanceId(targetAttendance.getAttendanceId())
                    .empId(targetAttendance.getEmpId())
                    .attendanceDate(targetAttendance.getAttendanceDate())
                    .inTime(protestApply.getProtestRequestInTime() != null ? 
                            protestApply.getProtestRequestInTime() : targetAttendance.getInTime())
                    .outTime(protestApply.getProtestRequestOutTime() != null ? 
                            protestApply.getProtestRequestOutTime() : targetAttendance.getOutTime())
                    .attendanceStatus(protestApply.getProtestAttendanceStatus())
                    .build();
            
            attendanceRepository.save(updatedAttendance);

            protestApply = ProtestApply.builder()
                    .protestApplyId(protestApply.getProtestApplyId())
                    .protestApplyDate(protestApply.getProtestApplyDate())
                    .protestApplyApplicant(protestApply.getProtestApplyApplicant())
                    .protestApplyApprover(approver)
                    .protestApplyStatus(CommonEnums.ApplyStatus.APPROVED)
                    .protestAttendanceStatus(protestApply.getProtestAttendanceStatus())
                    .protestRequestInTime(protestApply.getProtestRequestInTime())
                    .protestRequestOutTime(protestApply.getProtestRequestOutTime())
                    .protestReason(protestApply.getProtestReason())
                    .targetAttendance(protestApply.getTargetAttendance())
                    .originalAttendanceStatus(protestApply.getOriginalAttendanceStatus())
                    .build();

            log.info("정정 승인 완료 - protestId: {}", protestId);
        } else {
            // 반려: Attendance 상태 원복
            Attendance targetAttendance = protestApply.getTargetAttendance();
            
            // 원래 상태로 복원 (저장된 원래 상태 사용)
            Attendance updatedAttendance = Attendance.builder()
                    .attendanceId(targetAttendance.getAttendanceId())
                    .empId(targetAttendance.getEmpId())
                    .attendanceDate(targetAttendance.getAttendanceDate())
                    .inTime(targetAttendance.getInTime())
                    .outTime(targetAttendance.getOutTime())
                    .attendanceStatus(protestApply.getOriginalAttendanceStatus())  // 원래 상태로 복원
                    .build();
            
            attendanceRepository.save(updatedAttendance);

            protestApply = ProtestApply.builder()
                    .protestApplyId(protestApply.getProtestApplyId())
                    .protestApplyDate(protestApply.getProtestApplyDate())
                    .protestApplyApplicant(protestApply.getProtestApplyApplicant())
                    .protestApplyApprover(approver)
                    .protestApplyStatus(CommonEnums.ApplyStatus.REJECTED)
                    .protestApplyCancelReason(request.getCancelReason())
                    .protestAttendanceStatus(protestApply.getProtestAttendanceStatus())
                    .protestRequestInTime(protestApply.getProtestRequestInTime())
                    .protestRequestOutTime(protestApply.getProtestRequestOutTime())
                    .protestReason(protestApply.getProtestReason())
                    .targetAttendance(protestApply.getTargetAttendance())
                    .originalAttendanceStatus(protestApply.getOriginalAttendanceStatus())
                    .build();

            log.info("정정 반려 완료 - protestId: {}, reason: {}", protestId, request.getCancelReason());
        }

        protestApplyRepository.save(protestApply);

        return convertToListResponse(protestApply);
    }

    /**
     * Entity -> ListResponse 변환
     */
    private ProtestDto.ListResponse convertToListResponse(ProtestApply entity) {
        return ProtestDto.ListResponse.builder()
                .protestApplyId(entity.getProtestApplyId())
                .protestApplyDate(entity.getProtestApplyDate())
                .targetDate(entity.getTargetAttendance().getAttendanceDate())
                .currentInTime(entity.getTargetAttendance().getInTime())
                .currentOutTime(entity.getTargetAttendance().getOutTime())
                .protestRequestInTime(entity.getProtestRequestInTime())
                .protestRequestOutTime(entity.getProtestRequestOutTime())
                .protestReason(entity.getProtestReason())
                .status(entity.getProtestApplyStatus().name())
                .attendanceType(entity.getAttendanceType() != null ? entity.getAttendanceType().name() : null)
                .applicantName(entity.getProtestApplyApplicant().getEmpName())
                .approverName(entity.getProtestApplyApprover() != null ? 
                        entity.getProtestApplyApprover().getEmpName() : null)
                .cancelReason(entity.getProtestApplyCancelReason())
                .createdDate(entity.getCreateDate())
                .fileCount(entity.getFiles() != null ? entity.getFiles().size() : 0)
                .build();
    }

    /**
     * Entity -> DetailResponse 변환
     */
    private ProtestDto.DetailResponse convertToDetailResponse(ProtestApply entity) {
        List<ProtestDto.FileInfo> fileInfos = entity.getFiles().stream()
                .map(protestFile -> ProtestDto.FileInfo.builder()
                        .fileId(protestFile.getFileId().getFileId())
                        .fileName(protestFile.getFileId().getFileName())
                        .fileOriName(protestFile.getFileId().getFileOriName())
                        .path(protestFile.getFileId().getPath())
                        .size(protestFile.getFileId().getSize())
                        .build())
                .collect(Collectors.toList());

        return ProtestDto.DetailResponse.builder()
                .protestApplyId(entity.getProtestApplyId())
                .protestApplyDate(entity.getProtestApplyDate())
                .targetDate(entity.getTargetAttendance().getAttendanceDate())
                .currentInTime(entity.getTargetAttendance().getInTime())
                .currentOutTime(entity.getTargetAttendance().getOutTime())
                .protestRequestInTime(entity.getProtestRequestInTime())
                .protestRequestOutTime(entity.getProtestRequestOutTime())
                .protestReason(entity.getProtestReason())
                .status(entity.getProtestApplyStatus().name())
                .attendanceType(entity.getAttendanceType() != null ? entity.getAttendanceType().name() : null)
                .applicantName(entity.getProtestApplyApplicant().getEmpName())
                .approverName(entity.getProtestApplyApprover() != null ? 
                        entity.getProtestApplyApprover().getEmpName() : null)
                .cancelReason(entity.getProtestApplyCancelReason())
                .createdDate(entity.getCreateDate())
                .files(fileInfos)
                .build();
    }

    // ===== 관리자용 메서드 구현 =====

    /**
     * 관리자용 - 전체 정정 신청 목록 조회 (페이징)
     */
    @Override
    @Transactional(readOnly = true)
    public Page<ProtestDto.AdminListResponse> getAllProtestsForAdmin(Pageable pageable) {
        log.info("관리자용 전체 정정 신청 목록 조회");

        Page<ProtestApply> protestPage = protestApplyRepository.findAllByOrderByCreateDateDesc(pageable);

        return protestPage.map(this::convertToAdminListResponse);
    }

    /**
     * 관리자용 - 상태별 정정 신청 목록 조회 (페이징)
     */
    @Override
    @Transactional(readOnly = true)
    public Page<ProtestDto.AdminListResponse> getProtestsByStatusForAdmin(String status, Pageable pageable) {
        log.info("관리자용 상태별 정정 신청 목록 조회 - status: {}", status);

        CommonEnums.ApplyStatus applyStatus = CommonEnums.ApplyStatus.valueOf(status.toUpperCase());
        Page<ProtestApply> protestPage = protestApplyRepository
                .findByProtestApplyStatusOrderByCreateDateDesc(applyStatus, pageable);

        return protestPage.map(this::convertToAdminListResponse);
    }

    /**
     * 관리자용 - 정정 신청 승인 처리 (트랜잭션)
     * DDD 방식으로 엔티티의 비즈니스 메서드 활용
     */
    @Override
    @Transactional
    public void approveProtestByAdmin(Long protestId, String approverId) {
        log.info("관리자용 정정 신청 승인 - protestId: {}, approverId: {}", protestId, approverId);

        // 1. 정정 신청 조회
        ProtestApply protestApply = protestApplyRepository.findById(protestId)
                .orElseThrow(() -> new RuntimeException("정정 신청을 찾을 수 없습니다"));

        // 2. 승인자 조회
        Emp approver = empRepository.findById(approverId)
                .orElseThrow(() -> new RuntimeException("승인자를 찾을 수 없습니다"));

        // 3. 정정 신청 승인 처리 (엔티티 비즈니스 메서드 활용)
        protestApply.approve(approver);

        // 4. 실제 근태 기록 업데이트 (엔티티 비즈니스 메서드 활용)
        Attendance attendance = protestApply.getTargetAttendance();
        attendance.updateAttendance(
                protestApply.getProtestRequestInTime(),
                protestApply.getProtestRequestOutTime(),
                protestApply.getProtestAttendanceStatus()
        );

        // 5. Dirty Checking으로 자동 저장
        log.info("정정 신청 승인 완료 - protestId: {}", protestId);
    }

    /**
     * 관리자용 - 정정 신청 반려 처리
     */
    @Override
    @Transactional
    public void rejectProtestByAdmin(Long protestId, String approverId, String cancelReason) {
        log.info("관리자용 정정 신청 반려 - protestId: {}, approverId: {}", protestId, approverId);

        // 1. 정정 신청 조회
        ProtestApply protestApply = protestApplyRepository.findById(protestId)
                .orElseThrow(() -> new RuntimeException("정정 신청을 찾을 수 없습니다"));

        // 2. 승인자 조회
        Emp approver = empRepository.findById(approverId)
                .orElseThrow(() -> new RuntimeException("승인자를 찾을 수 없습니다"));

        // 3. 정정 신청 반려 처리 (엔티티 비즈니스 메서드 활용)
        protestApply.reject(approver, cancelReason);

        // 4. 근태 기록 원상태로 복구
        Attendance attendance = protestApply.getTargetAttendance();
        attendance.updateAttendance(null, null, protestApply.getOriginalAttendanceStatus());

        // 5. Dirty Checking으로 자동 저장
        log.info("정정 신청 반려 완료 - protestId: {}, reason: {}", protestId, cancelReason);
    }

    /**
     * Entity -> AdminListResponse 변환
     */
    private ProtestDto.AdminListResponse convertToAdminListResponse(ProtestApply entity) {
        Emp applicant = entity.getProtestApplyApplicant();
        
        return ProtestDto.AdminListResponse.builder()
                .protestApplyId(entity.getProtestApplyId())
                .protestApplyDate(entity.getProtestApplyDate())
                .applicantName(applicant.getEmpName())
                .departmentName(applicant.getDepartmentId() != null ? applicant.getDepartmentId().getDepartmentName() : "부서 미지정")
                .positionName(applicant.getJob())
                .targetDate(entity.getTargetAttendance().getAttendanceDate())
                .currentInTime(entity.getTargetAttendance().getInTime())
                .currentOutTime(entity.getTargetAttendance().getOutTime())
                .protestRequestInTime(entity.getProtestRequestInTime())
                .protestRequestOutTime(entity.getProtestRequestOutTime())
                .protestReason(entity.getProtestReason())
                .status(entity.getProtestApplyStatus().name())
                .approverName(entity.getProtestApplyApprover() != null ? 
                        entity.getProtestApplyApprover().getEmpName() : null)
                .fileCount(entity.getFiles() != null ? entity.getFiles().size() : 0)
                .createdDate(entity.getCreateDate())
                .build();
    }
}
