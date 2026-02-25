package com.kh.ct.domain.health.controller;

import com.kh.ct.domain.health.dto.SurveyDto;
import com.kh.ct.domain.health.service.SurveyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/survey")
@RequiredArgsConstructor
@Validated
public class SurveyController {

    private final SurveyService surveyService;

    /**
     * 설문 내 정보 조회
     * @param empId
     * @return
     */
    @GetMapping("/surveyInfo")
    public ResponseEntity<SurveyDto.SurveyResponse> surveyInfo(@RequestParam("empId") String empId) {
        System.out.println("empId: " + empId);

        SurveyDto.SurveyResponse surveyResponse = surveyService.surveyInfo(empId);

        return ResponseEntity.ok(surveyResponse);
    }


    /**
     * 설문 조사.
     * @param empId
     * @param workStressPoint
     * @param commuStressPoint
     * @param recoveryStressPoint
     * @return
     */
    @PostMapping("/saveSurvey")
    public ResponseEntity<String> saveSurvey(@RequestParam("empId") String empId,
                                             @RequestParam("workStressPoint") int workStressPoint,
                                             @RequestParam("commuStressPoint") int commuStressPoint,
                                             @RequestParam("recoveryStressPoint")  int recoveryStressPoint) {

        Long result = surveyService.saveSurvey(empId, workStressPoint, commuStressPoint, recoveryStressPoint);


        return ResponseEntity.ok(String.valueOf(result));
    }

}
