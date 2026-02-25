package com.kh.ct.domain.health.service;

import com.kh.ct.domain.emp.entity.Emp;
import com.kh.ct.domain.emp.repository.EmpRepository;
import com.kh.ct.domain.health.dto.SurveyDto;
import com.kh.ct.domain.health.entity.EmpHealth;
import com.kh.ct.domain.health.entity.EmpSurvey;
import com.kh.ct.domain.health.repository.EmpHealthRepository;
import com.kh.ct.domain.health.repository.SurveyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SurveyServiceImpl implements SurveyService {

    private final EmpRepository empRepository;
    private final SurveyRepository surveyRepository;
    private final EmpHealthRepository empHealthRepository;

    @Transactional(readOnly = true)
    @Override
    public SurveyDto.SurveyResponse surveyInfo(String empId) {

        Emp emp = empRepository.findById(empId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 empId: " + empId));

        EmpSurvey survey = surveyRepository
                .findTopByEmpId_EmpIdOrderByCreateDateDesc(empId)   // 메서드명은 실제에 맞게
                .orElse(null);


        return SurveyDto.SurveyResponse.builder()
                .empId(empId)
                .empName(emp.getEmpName())
                .departmentName(
                        emp.getDepartmentId() == null ? null : emp.getDepartmentId().getDepartmentName()
                )
                .job(emp.getJob())
                .startDate(emp.getStartDate())
                .createDate(survey == null ? null : survey.getCreateDate())
                .build();
    }

    @Transactional
    @Override
    public Long saveSurvey(String empId, int workStressPoint, int commuStressPoint, int recoveryStressPoint) {


        Emp emp = empRepository.findById(empId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 empId: " + empId));

        SurveyDto.SurveyRequest req = SurveyDto.SurveyRequest.builder()
                .empId(emp)
                .workStressPoint(workStressPoint)
                .commuStressPoint(commuStressPoint)
                .recoveryStressPoint(recoveryStressPoint)
                .build();

        EmpSurvey survey =  surveyRepository.save(req.toEntity());

        Integer stressPoint = avg3(workStressPoint, commuStressPoint, recoveryStressPoint);

        EmpHealth prev = empHealthRepository
                .findTopByEmpId_EmpIdOrderByEmpHealthIdDesc(empId)
                .orElse(null);

        Integer prevPhysical = (prev != null) ? prev.getPhysicalPoint() : null;
        Integer prevFatigue  = (prev != null) ? prev.getFatiguePoint()  : null;

        // 4) health_point = (physical, fatigue, stress) 평균 (null 제외)
        Integer healthPoint = avgNonNull(prevPhysical, prevFatigue, stressPoint);

        // 5) EmpHealth 새 row INSERT
        EmpHealth newRow = EmpHealth.builder()
                .empId(emp)
                .physicalPoint(prevPhysical) // 직전 값 복사
                .fatiguePoint(prevFatigue)   // 직전 값 복사
                .stressPoint(stressPoint)    // 이번 설문 값
                .healthPoint(healthPoint)    // 평균(null 제외)
                .build();

        empHealthRepository.save(newRow);

        return survey.getEmpSurveyId();
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
        if (cnt == 0) return null;
        return (int) Math.round((double) sum / cnt);
    }

    private int avg3(int a, int b, int c) {
        return (int) Math.round((a + b + c) / 3.0);
    }
}
