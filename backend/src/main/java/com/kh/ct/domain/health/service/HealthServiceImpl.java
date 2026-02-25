package com.kh.ct.domain.health.service;

import com.kh.ct.domain.attendance.entity.Attendance;
import com.kh.ct.domain.attendance.repository.AttendanceRepository;
import com.kh.ct.domain.emp.entity.Emp;
import com.kh.ct.domain.emp.repository.EmpRepository;
import com.kh.ct.domain.health.dto.HealthDto;
import com.kh.ct.domain.health.entity.EmpHealth;
import com.kh.ct.domain.health.entity.EmpPhysicalTest;
import com.kh.ct.domain.health.entity.Program;
import com.kh.ct.domain.health.entity.HealthScoreRule;
import com.kh.ct.domain.health.entity.ProgramApply;
import com.kh.ct.domain.health.repository.*;
import com.kh.ct.domain.health.service.parser.HealthLabelParser;
import com.kh.ct.domain.health.service.parser.PdfTextExtractor;
import com.kh.ct.domain.schedule.entity.AllSchedule;
import com.kh.ct.domain.schedule.repository.AllScheduleRepository;
import com.kh.ct.global.common.CommonEnums;
import com.kh.ct.global.entity.File;
import com.kh.ct.global.repository.FileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor

public class HealthServiceImpl implements HealthService {

    private final HealthRepository healthRepository;
    private final HealthLabelParser healthLabelParser;
    private final PdfTextExtractor pdfTextExtractor;
    private final EmpRepository empRepository;
    private final FileRepository fileRepository;
    private final EmpHealthRepository empHealthRepository;
    private final ProgramApplyRepository programApplyRepository; // DDD - Repository 주입
    private final AllScheduleRepository allScheduleRepository;
    private final ProgramRepository programRepository;
    private final HealthScoreRuleRepository healthScoreRuleRepository;
    private final SurveyRepository surveyRepository;
    private final AttendanceRepository attendanceRepository;
    private final PdfRenderService pdfRenderService;

    private final Path baseDir = Paths.get("uploads", "pdf").toAbsolutePath().normalize();

    @Transactional(readOnly = true)
    @Override
    public HealthDto.PhysicalTestResponse preview(MultipartFile pdfFile) {

        if (pdfFile == null || pdfFile.isEmpty()) {
            throw new IllegalArgumentException("파일이 비어있습니다.");
        }

        String text = pdfTextExtractor.extract(pdfFile);
        System.out.println("TEST" + text);
        HealthDto.PhysicalTestRequest parsed = healthLabelParser.parse(text);
        System.out.println("TEST" + parsed);
        System.out.println("TEST" + parsed.getWeight());

        return HealthDto.PhysicalTestResponse.from(parsed);
    }

    @Transactional
    @Override
    public Long save(MultipartFile pdfFile, String empId, HealthDto.PhysicalTestRequest body) {
        if (pdfFile == null || pdfFile.isEmpty()) {
            throw new IllegalArgumentException("파일이 비어있습니다.");
        }

        Emp emp = empRepository.findById(empId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 empId: " + empId));
        // 1) 파일 디스크 저장 + File row 저장
        String originalName = Optional.ofNullable(pdfFile.getOriginalFilename()).orElse("unknown.pdf");
        long size = pdfFile.getSize();
        String ext = getExt(originalName);
        String storedName = UUID.randomUUID().toString().replace("-", "") + ext;

        Path dir = baseDir;
        Path target = dir.resolve(storedName);

        try {
            Files.createDirectories(dir);
            try (InputStream is = pdfFile.getInputStream()) {
                Files.copy(is, target);
            }
        } catch (IOException e) {
            throw new RuntimeException("파일 저장 실패", e);
        }

        File savedFile = fileRepository.save(
                File.builder()
                        .fileOriName(originalName)
                        .fileName(storedName)
                        .path(target.toString())
                        .size(size)
                        .build());

        HealthDto.PhysicalTestRequest req = HealthDto.PhysicalTestRequest.builder()
                .empId(emp)
                .fileId(savedFile)
                .testDate(body.getTestDate())
                .weight(body.getWeight())
                .height(body.getHeight())
                .bloodSugar(body.getBloodSugar())
                .systolicBloodPressure(body.getSystolicBloodPressure())
                .diastolicBloodPressure(body.getDiastolicBloodPressure())
                .cholesterol(body.getCholesterol())
                .heartRate(body.getHeartRate())
                .bmi(body.getBmi())
                .bodyFat(body.getBodyFat())
                .build();

        EmpPhysicalTest saved = healthRepository.save(req.toEntity());

        Integer bloodSugarScore = scoreOf("BLOOD_SUGAR", toBD(body.getBloodSugar()));
        Integer sysScore = scoreOf("SYSTOLIC_BLOOD_PRESSURE", toBD(body.getSystolicBloodPressure()));
        Integer diaScore = scoreOf("DIASTOLIC_BLOOD_PRESSURE", toBD(body.getDiastolicBloodPressure()));
        Integer cholScore = scoreOf("CHOLESTEROL", toBD(body.getCholesterol()));
        Integer hrScore = scoreOf("HEART_RATE", toBD(body.getHeartRate()));
        Integer bmiScore = scoreOf("BMI", toBD(body.getBmi()));
        Integer fatScore = scoreOf("BODY_FAT", toBD(body.getBodyFat()));

        // 혈압은 하나로 합치기(추천): 둘 다 있으면 min, 하나만 있으면 그 값
        Integer bpScore = null;
        if (sysScore != null && diaScore != null)
            bpScore = Math.min(sysScore, diaScore);
        else if (sysScore != null)
            bpScore = sysScore;
        else if (diaScore != null)
            bpScore = diaScore;

        Integer physicalPoint = avgScore(List.of(
                bloodSugarScore, bpScore, cholScore, hrScore, bmiScore, fatScore));

        EmpHealth prev = empHealthRepository
                .findTopByEmpId_EmpIdOrderByEmpHealthIdDesc(empId)
                .orElse(null);

        Integer prevStress = (prev != null) ? prev.getStressPoint() : null;
        Integer prevFatigue = (prev != null) ? prev.getFatiguePoint() : null;

        // 3) health_point = 3개 평균 (null 제외)
        Integer healthPoint = avgNonNull(physicalPoint, prevStress, prevFatigue);

        // 4) 새 row INSERT (stress/fatigue는 직전 값 복사)
        EmpHealth newRow = EmpHealth.builder()
                .empId(emp) // Emp 엔티티
                .physicalPoint(physicalPoint) // 새로 계산
                .stressPoint(prevStress) // 직전 값 복사
                .fatiguePoint(prevFatigue) // 직전 값 복사
                .healthPoint(healthPoint) // 평균(null 제외)
                .build();

        empHealthRepository.save(newRow);

        return saved.getPhysicalTestId();

    }

    @Override
    public HealthDto.PhysicalTestDetailResponse getEmpPhysicalTestById(String empId) {

        Emp emp = empRepository.findById(empId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 empId: " + empId));

        EmpPhysicalTest test = healthRepository
                .findTopByEmpId_EmpIdOrderByTestDateDesc(empId)
                .orElse(null);

        EmpHealth empHealth = empHealthRepository.findTopByEmpId_EmpIdOrderByEmpHealthIdDesc(empId)
                .orElse(null);

        if (test != null && (test.getEmpId() == null || !empId.equals(test.getEmpId().getEmpId()))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "해당 사원의 검진 데이터가 아닙니다.");
        }

        return HealthDto.PhysicalTestDetailResponse.builder()
                .empId(empId)
                .empName(emp.getEmpName())
                .startDate(emp.getStartDate())
                .departmentName(emp.getDepartmentId() == null ? null : emp.getDepartmentId().getDepartmentName())
                .job(emp.getJob())
                .email(emp.getEmail())
                .phone(emp.getPhone())
                .address(emp.getAddress())

                .testDate(test == null ? null : test.getTestDate())
                .height(test == null ? null : test.getHeight())
                .weight(test == null ? null : test.getWeight())
                .bloodSugar(test == null ? null : test.getBloodSugar())
                .systolicBloodPressure(test == null ? null : test.getSystolicBloodPressure())
                .diastolicBloodPressure(test == null ? null : test.getDiastolicBloodPressure())
                .cholesterol(test == null ? null : test.getCholesterol())
                .heartRate(test == null ? null : test.getHeartRate())
                .bmi(test == null ? null : test.getBmi())
                .bodyFat(test == null ? null : test.getBodyFat())
                .healthPoint(empHealth == null ? null : empHealth.getHealthPoint())
                .build();
    }

    @Override
    public Page<HealthDto.PhysicalTestResponse> getPhysicalTestByEmpId(String empId, Pageable pageable) {
        Page<EmpPhysicalTest> posts;

        posts = healthRepository.findByEmpId_EmpId(empId, pageable);
        return posts.map(HealthDto.PhysicalTestResponse::from);
    }

    @Override
    public Page<HealthDto.AdminEmpHealthRow> getAllPhysicalTest(String empName, Pageable pageable) {
        System.out.println("pageable = " + pageable);

        return empRepository.findAdminEmpHealthRows(empName.trim(), pageable);
    }

    /**
     * 건강 프로그램 신청 내역 조회
     * DDD 아키텍처 - Application Service 구현
     * 
     * @param empNo 사원번호
     * @return 프로그램 신청 내역 리스트 (최신순)
     */
    @Override
    @Transactional(readOnly = true)
    public List<HealthDto.ProgramHistoryResponse> getProgramHistory(String empNo) {
        // 1. Repository를 통해 엔티티 조회 (Infrastructure Layer)
        List<ProgramApply> programApplies = programApplyRepository.findByApplicantEmpNoWithDetails(empNo);

        // 2. Domain Entity를 Application DTO로 변환 (Application Layer)
        return programApplies.stream()
                .map(HealthDto.ProgramHistoryResponse::from)
                .collect(toList());
    }

    /**
     * 건강 프로그램 신청
     * DDD 아키텍처 - Domain Service 구현
     * 
     * @param request 신청 요청 DTO
     * @param empId   신청자 사원 ID
     */
    @Override
    @Transactional
    public void applyProgram(HealthDto.ApplyRequest request, String empId) {
        try {
            // [VALIDATION] 시작일 기준 최소 3일 전 예약 필수
            LocalDate startDate = request.getStartDate().toLocalDate();
            LocalDate minDate = LocalDate.now().plusDays(3);

            if (startDate.isBefore(minDate)) {
                throw new IllegalArgumentException("프로그램은 시작일 기준 최소 3일 전에만 신청 가능합니다.");
            }

            // 1. 신청자 조회
            Emp applicant = empRepository.findById(empId)
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

            // 2. 이미 신청한 내역이 있는지 확인 (PENDING 상태인 경우 중복 신청 방지 등)
            // 비즈니스 규칙: 동일 기간 중복 신청 불가? 혹은 그냥 허용? 일단 구현 생략 or Simple Validation
            // 여기서는 간단히 진행.

            // 3. ProgramApply 생성 (신청 내역)
            String applyId = UUID.randomUUID().toString();
            ProgramApply apply = ProgramApply.builder()
                    .programApplyId(applyId)
                    .programCode(request.getProgramCode()) // counseling, exercise, rest
                    .programApplyApplicant(applicant)
                    .programApplyDate(java.time.LocalDateTime.now())
                    .programApplyStatus(com.kh.ct.global.common.CommonEnums.ApplyStatus.PENDING)
                    .programApplyReason(request.getReason())
                    .build();

            // [FIX] 먼저 저장하여 Managed 상태로 전환 (Program 생성 시 사용하기 위함)
            apply = programApplyRepository.save(apply);

            // 4. AllSchedule 생성 (일정)
            // request.getStartDate()가 null인지 확인
            if (request.getStartDate() == null || request.getEndDate() == null) {
                throw new IllegalArgumentException("Start date or End date cannot be null");
            }

            AllSchedule schedule = AllSchedule
                    .builder()
                    .scheduleCode("HEALTH_" + request.getProgramCode().toUpperCase())
                    .startDate(request.getStartDate())
                    .endDate(request.getEndDate())
                    .build();
            schedule = allScheduleRepository.save(schedule); // [FIX] Managed Instance 반환값 사용

            // 5. Program 생성 (세부 프로그램 정보)
            // Program은 ProgramApply와 OneToOne (MapsId)
            Program program = Program.builder()
                    .programApply(apply) // [FIX] Managed 'apply' 사용
                    .scheduleId(schedule)
                    .programContent(parseProgramContent(request.getProgramCode()))
                    .programStatus("APPLIED")
                    .build();

            // apply = programApplyRepository.save(apply); // [REMOVED] 위에서 이미 저장함

            programRepository.save(program); // Child 저장

        } catch (Exception e) {
            e.printStackTrace();
            throw e; // Rethrow to ensure transaction rollback
        }
    }

    private String parseProgramContent(String code) {
        if ("counseling".equals(code))
            return "건강 심리 상담";
        if ("exercise".equals(code))
            return "체력 증진 운동";
        if ("rest".equals(code))
            return "휴식 및 힐링";
        return "건강 프로그램";
    }

    /**
     * 나의 신청 내역 조회
     */
    @Override
    @Transactional(readOnly = true)
    public List<HealthDto.ProgramHistoryResponse> getMyProgramHistory(String empId) {
        List<ProgramApply> list = programApplyRepository.findByApplicantIdWithDetails(empId);
        return list.stream()
                .map(HealthDto.ProgramHistoryResponse::from)
                .collect(toList());
    }

    private String getExt(String filename) {
        int idx = filename.lastIndexOf('.');
        if (idx < 0)
            return "";
        return filename.substring(idx);
    }

    @Override
    @Transactional
    public void cancelProgram(String programApplyId) {
        ProgramApply apply = programApplyRepository.findById(programApplyId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 신청 내역입니다."));

        // 상태 확인 (PENDING일 때만 취소 가능)
        if (apply.getProgramApplyStatus() != com.kh.ct.global.common.CommonEnums.ApplyStatus.PENDING) {
            throw new IllegalStateException("이미 처리되었거나 취소할 수 없는 상태입니다.");
        }

        // 관련 데이터 삭제 순서: Program -> AllSchedule -> ProgramApply
        // 1. Program 조회
        programRepository.findById(programApplyId).ifPresent(program -> {
            // 2. Schedule 삭제를 위해 조회 (Program이 Schedule을 참조함)
            AllSchedule schedule = program.getScheduleId();

            // Program 삭제
            programRepository.delete(program);

            // Schedule 삭제 (Program 삭제 후)
            if (schedule != null) {
                allScheduleRepository.delete(schedule);
            }
        });

        // 3. ProgramApply 삭제
        programApplyRepository.delete(apply);
    }

    @Override
    @Transactional(readOnly = true)
    public List<HealthDto.ApplyDetailResponse> getAdminApplyList(CommonEnums.ApplyStatus status,
            String programName) {
        return programApplyRepository.findAllByFilters(status, programName).stream()
                .map(apply -> {
                    Program program = apply.getProgram();
                    AllSchedule schedule = (program != null) ? program.getScheduleId()
                            : null;
                    Emp applicant = apply.getProgramApplyApplicant();
                    String managerName = (apply.getProgramApplyManager() != null)
                            ? apply.getProgramApplyManager().getEmpName()
                            : null;

                    return HealthDto.ApplyDetailResponse.builder()
                            .programApplyId(apply.getProgramApplyId())
                            .empName(applicant.getEmpName())
                            .empNo(applicant.getEmpNo())
                            .departmentName(
                                    applicant.getDepartmentId() != null
                                            ? applicant.getDepartmentId().getDepartmentName()
                                            : "")
                            .programName(program != null ? program.getProgramContent() : "")
                            .applyReason(apply.getProgramApplyReason())
                            .applyDate(apply.getProgramApplyDate())
                            .status(apply.getProgramApplyStatus().name())
                            .startDate(schedule != null ? schedule.getStartDate() : null)
                            .endDate(schedule != null ? schedule.getEndDate() : null)
                            .managerName(managerName)
                            .rejectReason(apply.getProgramApplyCancelReason())
                            .build();
                })
                .collect(toList());
    }

    @Override
    @Transactional(readOnly = true)
    public HealthDto.ApplyDetailResponse getApplyDetail(String programApplyId) {
        ProgramApply apply = programApplyRepository.findById(programApplyId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 신청 내역입니다."));

        Program program = apply.getProgram();
        AllSchedule schedule = (program != null) ? program.getScheduleId() : null;
        Emp applicant = apply.getProgramApplyApplicant();

        String managerName = (apply.getProgramApplyManager() != null) ? apply.getProgramApplyManager().getEmpName()
                : null;

        return HealthDto.ApplyDetailResponse.builder()
                .programApplyId(apply.getProgramApplyId())
                .empName(applicant.getEmpName())
                .empNo(applicant.getEmpNo())
                .departmentName(
                        applicant.getDepartmentId() != null ? applicant.getDepartmentId().getDepartmentName() : "") // Department
                // Entity
                // 가정
                .programName(program != null ? program.getProgramContent() : "")
                .applyReason(apply.getProgramApplyReason())
                .applyDate(apply.getProgramApplyDate())
                .status(apply.getProgramApplyStatus().name())
                .startDate(schedule != null ? schedule.getStartDate() : null)
                .endDate(schedule != null ? schedule.getEndDate() : null)
                .managerName(managerName)
                .rejectReason(apply.getProgramApplyCancelReason())
                .build();
    }

    @Override
    @Transactional
    public void approveApply(HealthDto.ApproveRequest request) {
        ProgramApply apply = programApplyRepository.findById(request.getProgramApplyId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 신청 내역입니다."));

        Emp manager = empRepository.findById(request.getManagerId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 담당자입니다."));

        apply.approve(manager);
    }

    @Override
    @Transactional
    public void rejectApply(HealthDto.RejectRequest request) {
        ProgramApply apply = programApplyRepository.findById(request.getProgramApplyId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 신청 내역입니다."));

        apply.reject(request.getReason());
    }

    @Override
    public HealthDto.EmpHealthResponse healthPoint(String empId) {

        Emp emp = empRepository.findById(empId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 empId: " + empId));

        EmpHealth eh = empHealthRepository
                .findTopByEmpId_EmpIdOrderByEmpHealthIdDesc(empId)
                .orElse(null);

        return HealthDto.EmpHealthResponse.builder()
                .empId(empId)
                .empName(emp.getEmpName())
                .healthPoint(eh != null ? eh.getHealthPoint() : null)
                .physicalPoint(eh != null ? eh.getPhysicalPoint() : null)
                .stressPoint(eh != null ? eh.getStressPoint() : null)
                .fatiguePoint(eh != null ? eh.getFatiguePoint() : null)
                .build();
    }

    @Override
    public HealthDto.EmpHealthTrendResponse healthPointTrend(String empId, int days) {
        if (days != 7 && days != 30 && days != 90) {
            throw new IllegalArgumentException("days는 7/30/90만 허용합니다.");
        }

        // 1) DB에서 일자별 최신값 조회
        List<Object[]> rows = empHealthRepository.findDailyLatestScores(empId, days);

        // 2) Map<LocalDate, Point>로 변환
        Map<LocalDate, HealthDto.HealthTrendPoint> byDate = new HashMap<>();
        for (Object[] r : rows) {
            // day: java.sql.Date or String로 올 수 있음 (드라이버 설정에 따라 다름)
            LocalDate day = null;
            Object dayObj = r[0];
            if (dayObj instanceof java.sql.Date d) {
                day = d.toLocalDate();
            } else {
                day = LocalDate.parse(String.valueOf(dayObj));
            }

            byDate.put(day, HealthDto.HealthTrendPoint.builder()
                    .date(day)
                    .healthPoint(toInt(r[1]))
                    .physicalPoint(toInt(r[2]))
                    .stressPoint(toInt(r[3]))
                    .fatiguePoint(toInt(r[4]))
                    .build());
        }

        // 3) 기간 날짜 생성 (오늘 포함)
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(days - 1L);

        List<HealthDto.HealthTrendPoint> series = new ArrayList<>(days);

        // forward fill용 "직전 값"
        Integer lastHealth = null;
        Integer lastPhysical = null;
        Integer lastStress = null;
        Integer lastFatigue = null;

        for (LocalDate d = start; !d.isAfter(end); d = d.plusDays(1)) {
            HealthDto.HealthTrendPoint cur = byDate.get(d);

            if (cur != null) {
                // 값이 있는 날: 갱신 + last 업데이트
                if (cur.getHealthPoint() != null)
                    lastHealth = cur.getHealthPoint();
                if (cur.getPhysicalPoint() != null)
                    lastPhysical = cur.getPhysicalPoint();
                if (cur.getStressPoint() != null)
                    lastStress = cur.getStressPoint();
                if (cur.getFatiguePoint() != null)
                    lastFatigue = cur.getFatiguePoint();

                series.add(cur);
            } else {
                // 값이 없는 날: 직전값으로 채움
                series.add(HealthDto.HealthTrendPoint.builder()
                        .date(d)
                        .healthPoint(lastHealth)
                        .physicalPoint(lastPhysical)
                        .stressPoint(lastStress)
                        .fatiguePoint(lastFatigue)
                        .build());
            }
        }

        return HealthDto.EmpHealthTrendResponse.builder()
                .empId(empId)
                .days(days)
                .series(series)
                .build();
    }

    @Override
    public HealthDto.EmpHealthRecordResponse healthRecord(String empId) {

        // emp 존재 검증 (선택)
        empRepository.findById(empId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 empId: " + empId));

        Integer surveyCnt = surveyRepository.countByEmpId(empId);

        Integer programCnt = programApplyRepository.countApprovedByEmpId(empId, CommonEnums.ApplyStatus.APPROVED);

        Integer scoreDelta = 0;

        List<Attendance> list = attendanceRepository.findByEmpId(empId);

        Long totalWork = list.stream()
                .mapToLong(a -> calcMinutes(a.getInTime(), a.getOutTime()))
                .sum();

        List<EmpHealth> lastTwo = empHealthRepository
                .findTop2ByEmpId_EmpIdOrderByEmpHealthIdDesc(empId);

        if (lastTwo.size() >= 2) {
            Integer latest = lastTwo.get(0).getHealthPoint(); // 최신
            Integer prev = lastTwo.get(1).getHealthPoint(); // 직전

            // null 방어: 둘 중 하나라도 null이면 0
            if (latest != null && prev != null) {
                scoreDelta = latest - prev;
            }
        }

        return HealthDto.EmpHealthRecordResponse.builder()
                .programCnt(programCnt)
                .surveyCnt(surveyCnt)
                .scoreChg(scoreDelta)
                .workTime(totalWork)
                .build();
    }

    @Override
    public HealthDto.HealthReportDto healthReport(HealthDto.HealthReportPreviewRequest req, int days) {
        // 1) 방어 코드
        if (req == null) {
            throw new IllegalArgumentException("요청 바디가 비었습니다.");
        }

        // record면 req.empId(), lombok getter면 req.getEmpId()
        final String empId = extractEmpId(req);
        if (empId == null || empId.isBlank()) {
            throw new IllegalArgumentException("empId가 필요합니다.");
        }

        // (권장) days 검증: 컨트롤러에서도 했지만 서비스에서도 한번 더
        if (days != 7 && days != 30 && days != 90) {
            days = 7;
        }

        // 2) 사원 정보 조회(JPA)
        Emp emp = empRepository.findById(empId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 사원입니다. empId=" + empId));

        // 3) 요청 데이터 + 사원 정보 합쳐서 DTO 생성
        // DTO가 record면 "new HealthDto.HealthReportDto(...)" 형태로 생성 가능
        // (아래는 record/생성자 기반이라는 가정)
        return new HealthDto.HealthReportDto(
                empId,
                emp.getEmpName(),          // 사원명
                emp.getDepartmentId().getDepartmentName(),         // 없으면 제거

                req.getHealthPoint(),
                req.getPhysicalPoint(),
                req.getStressPoint(),
                req.getFatiguePoint(),

                mapTrend(req.getTrend()),
                mapRecord(req.getRecord()),
                mapTips(req.getTips()),

                LocalDateTime.now()
        );
    }

    @Override
    public byte[] healthReportPdf(HealthDto.HealthReportPreviewRequest req, int days) {
        if (days != 7 && days != 30 && days != 90) days = 7;

        // 기존 DTO 합치기 로직 재사용
        HealthDto.HealthReportDto dto = healthReport(req, days);

        // 여기서 "방금 만든 PDF 서비스" 호출
        return pdfRenderService.renderHealthReport(dto, days);
    }

    private String extractEmpId(HealthDto.HealthReportPreviewRequest req) {
        // 1) record라면: return req.empId();
        // 2) lombok getter라면:
        return req.getEmpId();
    }

    private List<HealthDto.HealthReportDto.TrendPointDto> mapTrend(
            List<HealthDto.HealthReportPreviewRequest.TrendPoint> trend
    ) {
        if (trend == null) return List.of();

        return trend.stream()
                .map(p -> new HealthDto.HealthReportDto.TrendPointDto(
                        p.getDate(),
                        p.getHealthPoint()
                ))
                .toList(); // Java 16+ / 17이면 OK
    }

    private HealthDto.HealthReportDto.RecordDto mapRecord(
            HealthDto.HealthReportPreviewRequest.Record record
    ) {
        if (record == null) {
            return new HealthDto.HealthReportDto.RecordDto(0, 0, 0, 0);
        }
        return new HealthDto.HealthReportDto.RecordDto(
                record.getWorkTimeHours(),
                record.getSurveyCnt(),
                record.getProgramCnt(),
                record.getScoreChg()
        );
    }

    private List<HealthDto.HealthReportDto.TipDto> mapTips(
            List<HealthDto.HealthReportPreviewRequest.Tip> tips
    ) {
        if (tips == null) return List.of();

        return tips.stream()
                .map(t -> new HealthDto.HealthReportDto.TipDto(
                        t.getCategory(),
                        t.getTitle()
                ))
                .toList();
    }

    private Integer toInt(Object o) {
        if (o == null)
            return null;
        if (o instanceof Number n)
            return n.intValue();
        return Integer.valueOf(String.valueOf(o));
    }

    private Integer scoreOf(String kind, BigDecimal v) {
        if (v == null)
            return null;
        return healthScoreRuleRepository.findMatchedRule(kind, v)
                .map(HealthScoreRule::getScore)
                .orElse(null);
    }

    private Integer avgScore(List<Integer> scores) {
        List<Integer> valid = scores.stream().filter(Objects::nonNull).toList();
        if (valid.isEmpty())
            return null;
        double avg = valid.stream().mapToInt(i -> i).average().orElse(0);
        return (int) Math.round(avg);
    }

    private BigDecimal toBD(Number n) {
        if (n == null)
            return null;
        return new BigDecimal(String.valueOf(n));
    }

    private Integer avgNonNull(Integer... values) {
        int sum = 0;
        int cnt = 0;
        for (Integer v : values) {
            if (v != null) {
                sum += v;
                cnt++;
            }
        }
        if (cnt == 0)
            return null; // 평균 대상이 없으면 null
        return (int) Math.round((double) sum / cnt);
    }

    private long calcMinutes(LocalTime inTime, LocalTime outTime) {
        if (inTime == null || outTime == null)
            return 0;

        long minutes = Duration.between(inTime, outTime).toMinutes();

        // 야간근무(자정 넘어감) 보정
        if (minutes < 0)
            minutes += 24 * 60;

        // 음수 방어
        if (minutes < 0)
            return 0;

        return minutes;
    }
}
