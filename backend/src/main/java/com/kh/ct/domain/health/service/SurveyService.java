package com.kh.ct.domain.health.service;

import com.kh.ct.domain.health.dto.SurveyDto;

public interface SurveyService {

    SurveyDto.SurveyResponse surveyInfo(String empId);

    Long saveSurvey(String empId,int workStressPoint, int commuStressPoint, int recoveryStressPoint);
}
