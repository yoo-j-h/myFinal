package com.kh.ct.domain.health.dto;

import com.kh.ct.domain.emp.entity.Emp;
import com.kh.ct.domain.health.entity.EmpSurvey;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class SurveyDto {

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SurveyRequest {

        private Emp empId;

        private Integer workStressPoint;

        private Integer commuStressPoint;

        private Integer recoveryStressPoint;

        public EmpSurvey toEntity() {
            return EmpSurvey.builder()
                    .empId(empId)
                    .workStressPoint(workStressPoint)
                    .commuStressPoint(commuStressPoint)
                    .recoveryStressPoint(recoveryStressPoint)
                    .build();
        }

    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SurveyResponse {
        private Long empSurveyId;

        private String empId;

        private Integer workStressPoint;

        private Integer commuStressPoint;

        private Integer recoveryStressPoint;

        private String empName;

        private String departmentName;

        private String job;

        private LocalDateTime startDate;

        private LocalDateTime createDate;

        public static SurveyResponse from (EmpSurvey empSurvey) {
            return SurveyResponse.builder()
                    .empSurveyId(empSurvey.getEmpSurveyId())
                    .empId(empSurvey.getEmpId().toString())
                    .workStressPoint(empSurvey.getWorkStressPoint())
                    .commuStressPoint(empSurvey.getCommuStressPoint())
                    .recoveryStressPoint(empSurvey.getRecoveryStressPoint())
                    .build();
        }
    }
}
