import React, { useEffect, useMemo, useState } from 'react';
import * as S from './StressSurvey.styled';
import useAuthStore from '../../store/authStore';
import healthService from '../../api/Health/healthService';

const StressSurvey = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [additionalComment, setAdditionalComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const totalSteps = 5;

  // {/* TODO: Zustand state mapping - 직원 정보, 비행 데이터 등 */}

  const empId = useAuthStore((s) => s.getEmpId());
  const [employeeInfo, setEmployeeInfo] = useState({
    name: "-",
    employeeId: "-",
    department: "-",
    position: "-",
    hireDate: "-",
    lastSurveyDate: "-",
  });

  const [loadingEmp, setLoadingEmp] = useState(false);

useEffect(() => {
  const fetchSurveyInfo = async () => {
    if (!empId) return;

    setLoadingEmp(true);
    try {
      const res = await healthService.surveyInfo(empId);
      const d = res.data;

      const rawCreateDate = d?.createDate; // ex) "2026-02-10T09:12:34" 또는 "2026-02-10"
      const createDateStr = rawCreateDate ? String(rawCreateDate) : "";
      const lastSurveyYMD = createDateStr ? createDateStr.slice(0, 10) : null;

      // ✅ 이번 달 제출 여부 판단 (YYYY-MM 비교)
      const now = new Date();
      const nowYM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      const lastYM = lastSurveyYMD ? lastSurveyYMD.slice(0, 7) : null;

      if (lastYM && lastYM === nowYM) {
        alert("이번 달 설문은 이미 제출하셨습니다.");
        window.location.href = "/dashboard";
        return; // 리다이렉트 후 아래 setState 방지
      }

      setEmployeeInfo({
        name: d?.empName ?? "-",
        employeeId: d?.empId ?? empId,
        department: d?.departmentName ?? "-",
        position: d?.job ?? "-",
        hireDate: d?.startDate ? String(d.startDate).slice(0, 10) : "-",
        lastSurveyDate: lastSurveyYMD ?? "-",
      });
    } catch (e) {
      console.error(e);
      // 실패해도 화면은 떠야 하니 값은 "-" 유지
    } finally {
      setLoadingEmp(false);
    }
  };

  fetchSurveyInfo();
}, [empId]);



  // const employeeInfo = {
  //   name: '김민수',
  //   employeeId: 'EMP001',
  //   department: '객실 승무원',
  //   position: '선임 승무원',
  //   hireDate: '2020-03-15',
  //   lastSurveyDate: '2025-12-15'
  // };

  const flightStats = {
    week7Hours: 48,
    day30Hours: 156,
    timezoneChanges: 3,
    recentTimezone: -9,
    workDays30: 22,
    consecutiveDays: 4
  };
  
  const section_config = [
    { key: "A", label: "업무량·업무명확성", ids: ["q1","q2","q3"], reverse: false },
    { key: "B", label: "관계·소통",         ids: ["q4","q5","q6"], reverse: false },
    { key: "C", label: "회복·번아웃",       ids: ["q7","q8","q9"], reverse: true  },
  ];

  //점수 3~15점
  const normalizeTo100 = (raw, min=3, max=15) => {
    if (raw == null) return null;
    const v = ((raw - min) / (max - min)) * 100;
    return Math.round(v);
  };

  const reverseScore = (v) => (v == null ? null : 6 - v);

  const calculateSurveyResults = (answers) => {
  const sections = section_config.map(sec => {
    // 각 문항 점수 (reverse면 변환)
    const vals = sec.ids.map(id => {
      const v = answers[id];
      if (v == null) return null;
      return sec.reverse ? reverseScore(v) : v;
    });

    const isComplete = vals.every(v => v != null);
    const raw = isComplete ? vals.reduce((a,b) => a + b, 0) : null;
    const score100 = raw != null ? normalizeTo100(raw) : null;

    // 섹션 상태(색상 등)
    const grade =
      score100 == null ? "none" :
      score100 >= 80 ? "good" :
      score100 >= 60 ? "normal" : "alert";

    

    return {
      key: sec.key,
      label: sec.label,
      raw,           // 3~15
      score: score100, // 0~100
      grade,
      complete: isComplete,
    };
  });

  const completedSections = sections.filter(s => s.score != null);
  const total =
    completedSections.length === sections.length
      ? Math.round(completedSections.reduce((sum, s) => sum + s.score, 0) / sections.length)
      : null;

  const gradeType =
    total == null ? "none" :
    total >= 80 ? "normal" :
    total >= 60 ? "warning" : "alert";

  const gradeText =
    total == null ? "-" :
    total >= 80 ? "양호" :
    total >= 60 ? "주의" : "위험";


  const buildRecommendations = (total) => {
  if (total == null) return [];

  if (total >= 80) {
    return [
      { icon: "bed", title: "수면 유지 프로그램", desc: "현재 루틴을 유지하며 수면 질을 지켜요" },
      { icon: "spa", title: "가벼운 회복 루틴", desc: "스트레칭/호흡으로 피로 누적을 예방" },
    ];
  }

  if (total >= 60) {
    return [
      { icon: "spa", title: "휴식 프로그램 (명상/요가)", desc: "긴장 완화와 회복 속도 개선" },
      { icon: "bed", title: "수면 개선 프로그램", desc: "수면 시간/질을 안정적으로 확보" },
      { icon: "comments", title: "1:1 상담(선택)", desc: "스트레스 요인을 정리하고 대응 전략 수립" },
    ];
  }

  return [
    { icon: "comments", title: "1:1 심리 상담", desc: "전문 상담사와 함께 우선순위와 부담 요인 정리" },
    { icon: "spa", title: "회복 집중 프로그램", desc: "번아웃 예방을 위한 회복 루틴 구축" },
    { icon: "bed", title: "수면·근무 패턴 점검", desc: "수면 부족/회복 문제를 우선 개선" },
  ];
};

  return {
    total,
    grade: total == null ? "-" : `${gradeText}`,
    gradeType,
    sections,
    recommendations: buildRecommendations(total),
  };
};

  const surveySteps = [
    { id: 1, label: '기본 정보', icon: 'user' },
    { id: 2, label: '업무 스트레스', icon: 'plane-departure' },
    { id: 3, label: '관계 영향', icon: 'clock' },
    { id: 4, label: '회복ㆍ번아웃', icon: 'calendar-check' },
    { id: 5, label: '결과 확인', icon: 'chart-pie' }
  ];

  const questions = {
    section1: [
      { id: 'q1', text: '최근 2주 동안 업무량이 감당 가능한 수준이었다.' },
      { id: 'q2', text: '내 역할과 우선순위가 명확하게 정해져 있다.' },
      { id: 'q3', text: '업무를 수행하는 데 필요한 정보/자원이 충분히 제공된다.' }
    ],
    section2: [
      { id: 'q4', text: '팀 내에서 의견을 말할 때 심리적으로 안전하다고 느낀다.' },
      { id: 'q5', text: '상사/동료와의 의사소통이 원활하다(요구사항, 피드백, 협의 등).' },
      { id: 'q6', text: '갈등이 생겼을 때 건설적으로 해결되는 문화가 있다.' }
    ],
    section3: [
      { id: 'q7', text: '최근 2주 동안 일 때문에 수면/휴식의 질이 떨어졌다.' },
      { id: 'q8', text: '출근이나 업무를 생각하면 무기력·불안·짜증이 늘었다.' },
      { id: 'q9', text: '업무 후에도 스트레스가 남아 회복이 잘 안 된다고 느낀다.' }
    ]
  };

  const ratingOptions = [
    { value: 1, label: '전혀\n아니다' },
    { value: 2, label: '아니다' },
    { value: 3, label: '보통\n이다' },
    { value: 4, label: '그렇다' },
    { value: 5, label: '매우\n그렇다' }
  ];

  const sleepOptions = [
    { value: 1, label: '4시간\n미만' },
    { value: 2, label: '4~5\n시간' },
    { value: 3, label: '5~6\n시간' },
    { value: 4, label: '6~7\n시간' },
    { value: 5, label: '7시간\n이상' }
  ];

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStepClick = (step) => {
    if (step <= currentStep) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

const handleSubmit = async () => {
  // 1) empId 확인
  if (!empId) {
    alert("로그인 정보(empId)가 없습니다.");
    return;
  }

  // 2) 설문 완료 여부 확인 (점수 null이면 아직 미완료)
  if (results.total == null) {
    alert("모든 문항에 답변해야 제출할 수 있습니다.");
    return;
  }

  // 3) 섹션 점수 추출
  const a = results.sections.find(s => s.key === "A")?.score ?? null;
  const b = results.sections.find(s => s.key === "B")?.score ?? null;
  const c = results.sections.find(s => s.key === "C")?.score ?? null;

  if (a == null || b == null || c == null) {
    alert("섹션 점수 계산에 실패했습니다. 답변을 다시 확인해 주세요.");
    return;
  }

  // 4) 백 호출
  setSubmitting(true);
  try {
    await healthService.saveSurvey(empId, a, b, c); // GET 버전일 때
    // POST 버전이면:
    // await healthService.saveSurvey({ empId, workStressPoint: a, commuStressPoint: b, recoveryStressPoint: c });

    alert("설문이 제출되었습니다!\n\n결과는 건강 현황 페이지에서 확인하실 수 있습니다.");
    window.location.href = "/dashboard";
  } catch (e) {
    console.error(e);
    alert("설문 제출 실패");
  } finally {
    setSubmitting(false);
  }
};

  const calculateResults = () => {
    // {/* TODO: 실제 점수 계산 로직 구현 */}
    return {
      total: 72,
      grade: '양호 (B+)',
      gradeType: 'normal',
      sections: [
        { label: '비행 스트레스', score: 78, grade: 'good' },
        { label: '시차 영향', score: 65, grade: 'normal' },
        { label: '근무 패턴', score: 73, grade: 'good' }
      ],
      recommendations: [
        { icon: 'bed', title: '수면 개선 프로그램', desc: '시차 적응과 수면 품질 향상' },
        { icon: 'spa', title: '휴식 프로그램 (명상/요가)', desc: '심신 안정과 스트레스 해소' },
        { icon: 'comments', title: '1:1 심리 상담', desc: '전문 상담사와 함께하는 맞춤 케어' }
      ]
    };
  };

  const results = useMemo(() => calculateSurveyResults(answers), [answers]);

  //const results = calculateResults();

  console.log(results);

  return (
    <S.MainContainer>
      <S.SurveyHeader>
        <S.HeaderIcon className="fas fa-clipboard-list" />
        <S.HeaderContent>
          <S.HeaderTitle>스트레스 자가진단 설문</S.HeaderTitle>
          <S.HeaderDescription>
            본 설문은 직원 건강관리 프로그램의 일환으로 진행됩니다. 솔직하게 답변해 주세요.
          </S.HeaderDescription>
        </S.HeaderContent>
      </S.SurveyHeader>

      <S.ProgressBarContainer>
        <S.ProgressLine />
        {surveySteps.map((step) => (
          <S.ProgressStep
            key={step.id}
            $active={step.id === currentStep}
            $completed={step.id < currentStep}
            onClick={() => handleStepClick(step.id)}
          >
            <S.StepCircle $active={step.id === currentStep} $completed={step.id < currentStep}>
              {step.id < currentStep ? (
                <i className="fas fa-check" />
              ) : (
                step.id
              )}
            </S.StepCircle>
            <S.StepLabel $active={step.id === currentStep} $completed={step.id < currentStep}>
              {step.label}
            </S.StepLabel>
          </S.ProgressStep>
        ))}
      </S.ProgressBarContainer>

      {/* Step 1: 기본 정보 */}
      {currentStep === 1 && (
        <S.SurveyCard>
          <S.SectionHeader>
            <S.SectionIcon $color="blue">
              <i className="fas fa-user" />
            </S.SectionIcon>
            <S.SectionInfo>
              <S.SectionTitle>기본 정보 확인</S.SectionTitle>
              <S.SectionDescription>설문 응답자 정보를 확인해주세요</S.SectionDescription>
            </S.SectionInfo>
          </S.SectionHeader>

          <S.InfoGrid>
            <S.InfoItem>
              <S.InfoLabel>이름</S.InfoLabel>
              <S.InfoValue>{employeeInfo.name}</S.InfoValue>
            </S.InfoItem>
            <S.InfoItem>
              <S.InfoLabel>사번</S.InfoLabel>
              <S.InfoValue>{employeeInfo.employeeId}</S.InfoValue>
            </S.InfoItem>
            <S.InfoItem>
              <S.InfoLabel>부서</S.InfoLabel>
              <S.InfoValue>{employeeInfo.department}</S.InfoValue>
            </S.InfoItem>
            <S.InfoItem>
              <S.InfoLabel>직급</S.InfoLabel>
              <S.InfoValue>{employeeInfo.position}</S.InfoValue>
            </S.InfoItem>
            <S.InfoItem>
              <S.InfoLabel>입사일</S.InfoLabel>
              <S.InfoValue>{employeeInfo.hireDate}</S.InfoValue>
            </S.InfoItem>
            <S.InfoItem>
              <S.InfoLabel>마지막 설문일</S.InfoLabel>
              <S.InfoValue>{employeeInfo.lastSurveyDate}</S.InfoValue>
            </S.InfoItem>
          </S.InfoGrid>

          <S.NoticeBox>
            <S.NoticeTitle>
              <i className="fas fa-info-circle" />
              설문 안내
            </S.NoticeTitle>
            <S.NoticeList>
              <li>본 설문은 약 5~10분 정도 소요됩니다.</li>
              <li>모든 응답은 익명으로 처리되며, 개인별 건강관리 목적으로만 사용됩니다.</li>
              <li>솔직하게 응답해 주시면 더 정확한 건강 분석이 가능합니다.</li>
              <li>설문 중간에 저장되며, 나중에 이어서 작성할 수 있습니다.</li>
            </S.NoticeList>
          </S.NoticeBox>

          <S.ActionButtons>
            <S.PrevButton disabled>
              <i className="fas fa-arrow-left" /> 이전
            </S.PrevButton>
            <S.NextButton onClick={handleNext}>
              설문 시작하기 <i className="fas fa-arrow-right" />
            </S.NextButton>
          </S.ActionButtons>
        </S.SurveyCard>
      )}

      {/* Step 2: 비행 스트레스 */}
      {currentStep === 2 && (
        <S.SurveyCard>

          <S.SectionHeader>
            <S.SectionIcon $color="blue">
              <i className="fas fa-plane-departure" />
            </S.SectionIcon>
            <S.SectionInfo>
              <S.SectionTitle>A. 업무량·업무명확성 스트레스 지수</S.SectionTitle>
              <S.SectionDescription>최근 업무 기반으로 스트레스 수준을 측정합니다</S.SectionDescription>
            </S.SectionInfo>
          </S.SectionHeader>

          {/* <S.StatsGrid>
            <S.StatBox>
              <S.StatValue>
                {flightStats.week7Hours}<S.StatUnit>시간</S.StatUnit>
              </S.StatValue>
              <S.StatLabel>최근 7일 비행시간</S.StatLabel>
            </S.StatBox>
            <S.StatBox>
              <S.StatValue>
                {flightStats.day30Hours}<S.StatUnit>시간</S.StatUnit>
              </S.StatValue>
              <S.StatLabel>최근 30일 비행시간</S.StatLabel>
            </S.StatBox>
          </S.StatsGrid> */}

          {questions.section1.map((question, index) => (
            <S.QuestionItem key={question.id}>
              <S.QuestionText>
                <S.QuestionNumber>{index + 1}</S.QuestionNumber>
                {question.text}
              </S.QuestionText>
              <S.RatingScale>
                {ratingOptions.map((option) => (
                  <S.RatingOption key={option.value}>
                    <S.RatingInput
                      type="radio"
                      id={`${question.id}-${option.value}`}
                      name={question.id}
                      value={option.value}
                      checked={answers[question.id] === option.value}
                      onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value))}
                    />
                    <S.RatingLabel
                      htmlFor={`${question.id}-${option.value}`}
                      $checked={answers[question.id] === option.value}
                    >
                      <S.RatingValue>{option.value}</S.RatingValue>
                      <S.RatingText>{option.label}</S.RatingText>
                    </S.RatingLabel>
                  </S.RatingOption>
                ))}
              </S.RatingScale>
            </S.QuestionItem>
          ))}

          <S.ActionButtons>
            <S.PrevButton onClick={handlePrev}>
              <i className="fas fa-arrow-left" /> 이전
            </S.PrevButton>
            <S.NextButton onClick={handleNext}>
              다음 <i className="fas fa-arrow-right" />
            </S.NextButton>
          </S.ActionButtons>
        </S.SurveyCard>
      )}

      {/* Step 3: 시차 영향 */}
      {currentStep === 3 && (
        <S.SurveyCard>

          <S.SectionHeader>
            <S.SectionIcon $color="green">
              <i className="fas fa-clock" />
            </S.SectionIcon>
            <S.SectionInfo>
              <S.SectionTitle>B. 관계·소통</S.SectionTitle>
              <S.SectionDescription>팀원과의 관계 및 소통을 기반으로 스트레스 수준을 측정합니다.</S.SectionDescription>
            </S.SectionInfo>
          </S.SectionHeader>

          <S.StatsGrid>
            <S.StatBox>
              <S.StatValue $color="green">
                {flightStats.timezoneChanges}<S.StatUnit>회</S.StatUnit>
              </S.StatValue>
              <S.StatLabel>최근 7일 시차 변경 횟수</S.StatLabel>
            </S.StatBox>
            <S.StatBox>
              <S.StatValue $color="green">
                {flightStats.recentTimezone}<S.StatUnit>시간</S.StatUnit>
              </S.StatValue>
              <S.StatLabel>최근 시차 (LA 노선)</S.StatLabel>
            </S.StatBox>
          </S.StatsGrid>

          {questions.section2.map((question, index) => (
            <S.QuestionItem key={question.id}>
              <S.QuestionText>
                <S.QuestionNumber>{index + 4}</S.QuestionNumber>
                {question.text}
              </S.QuestionText>
              <S.RatingScale>
                {(question.type === 'sleep' ? sleepOptions : ratingOptions).map((option) => (
                  <S.RatingOption key={option.value}>
                    <S.RatingInput
                      type="radio"
                      id={`${question.id}-${option.value}`}
                      name={question.id}
                      value={option.value}
                      checked={answers[question.id] === option.value}
                      onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value))}
                    />
                    <S.RatingLabel
                      htmlFor={`${question.id}-${option.value}`}
                      $checked={answers[question.id] === option.value}
                    >
                      <S.RatingValue>{option.value}</S.RatingValue>
                      <S.RatingText>{option.label}</S.RatingText>
                    </S.RatingLabel>
                  </S.RatingOption>
                ))}
              </S.RatingScale>
            </S.QuestionItem>
          ))}

          <S.ActionButtons>
            <S.PrevButton onClick={handlePrev}>
              <i className="fas fa-arrow-left" /> 이전
            </S.PrevButton>
            <S.NextButton onClick={handleNext}>
              다음 <i className="fas fa-arrow-right" />
            </S.NextButton>
          </S.ActionButtons>
        </S.SurveyCard>
      )}

      {/* Step 4: 근무 패턴 */}
      {currentStep === 4 && (
        <S.SurveyCard>
          <S.SectionHeader>
            <S.SectionIcon $color="purple">
              <i className="fas fa-calendar-check" />
            </S.SectionIcon>
            <S.SectionInfo>
              <S.SectionTitle>C. 회복·번아웃</S.SectionTitle>
              <S.SectionDescription>스트레스에 따른 회복을 기준으로 현 상황을 판단합니다.</S.SectionDescription>
            </S.SectionInfo>
          </S.SectionHeader>

          <S.StatsGrid>
            <S.StatBox>
              <S.StatValue $color="purple">
                {flightStats.workDays30}<S.StatUnit>일</S.StatUnit>
              </S.StatValue>
              <S.StatLabel>최근 30일 근무일수</S.StatLabel>
            </S.StatBox>
            <S.StatBox>
              <S.StatValue $color="purple">
                {flightStats.consecutiveDays}<S.StatUnit>일</S.StatUnit>
              </S.StatValue>
              <S.StatLabel>최근 연속 근무일</S.StatLabel>
            </S.StatBox>
          </S.StatsGrid>

          {questions.section3.map((question, index) => (
            <S.QuestionItem key={question.id}>
              <S.QuestionText>
                <S.QuestionNumber>{index + 7}</S.QuestionNumber>
                {question.text}
              </S.QuestionText>
              <S.RatingScale>
                {ratingOptions.map((option) => (
                  <S.RatingOption key={option.value}>
                    <S.RatingInput
                      type="radio"
                      id={`${question.id}-${option.value}`}
                      name={question.id}
                      value={option.value}
                      checked={answers[question.id] === option.value}
                      onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value))}
                    />
                    <S.RatingLabel
                      htmlFor={`${question.id}-${option.value}`}
                      $checked={answers[question.id] === option.value}
                    >
                      <S.RatingValue>{option.value}</S.RatingValue>
                      <S.RatingText>{option.label}</S.RatingText>
                    </S.RatingLabel>
                  </S.RatingOption>
                ))}
              </S.RatingScale>
            </S.QuestionItem>
          ))}

          <S.CommentSection>
            <S.CommentLabel>
              <i className="fas fa-comment-alt" /> 추가로 전달하고 싶은 의견이 있으시면 작성해 주세요 (선택)
            </S.CommentLabel>
            <S.CommentTextarea
              value={additionalComment}
              onChange={(e) => setAdditionalComment(e.target.value)}
              placeholder="업무 환경, 스케줄, 건강 관련 건의사항 등을 자유롭게 작성해 주세요..."
            />
          </S.CommentSection>

          <S.ActionButtons>
            <S.PrevButton onClick={handlePrev}>
              <i className="fas fa-arrow-left" /> 이전
            </S.PrevButton>
            <S.NextButton onClick={handleNext}>
              결과 확인 <i className="fas fa-arrow-right" />
            </S.NextButton>
          </S.ActionButtons>
        </S.SurveyCard>
      )}

      {/* Step 5: 결과 확인 */}
      {currentStep === 5 && (
        <S.SurveyCard>
          <S.SectionHeader>
            <S.SectionIcon $color="orange">
              <i className="fas fa-chart-pie" />
            </S.SectionIcon>
            <S.SectionInfo>
              <S.SectionTitle>설문 결과</S.SectionTitle>
              <S.SectionDescription>귀하의 스트레스 자가진단 결과입니다</S.SectionDescription>
            </S.SectionInfo>
          </S.SectionHeader>

          <S.ResultSummary>
            <S.ResultScoreCircle>
              <S.ResultScore>{results.total}</S.ResultScore>
              <S.ResultMaxScore>/ 100점</S.ResultMaxScore>
            </S.ResultScoreCircle>
            <S.ResultGrade $type={results.gradeType}>{results.grade}</S.ResultGrade>
            <S.ResultMessage>
              전반적인 스트레스 수준은 관리 가능한 범위입니다.<br />
              일부 항목에서 주의가 필요하며, 권장 프로그램 참여를 고려해 주세요.
            </S.ResultMessage>
          </S.ResultSummary>

          <S.ResultDetailsGrid>
            {results.sections.map((section) => (
              <S.ResultDetailCard key={section.label}>
                <S.DetailLabel>{section.label}</S.DetailLabel>
                <S.DetailScore>{section.score}</S.DetailScore>
                <S.DetailGrade $type={section.grade}>
                  {section.grade === 'good' ? '양호' : '주의'}
                </S.DetailGrade>
              </S.ResultDetailCard>
            ))}
          </S.ResultDetailsGrid>

          <S.RecommendSection>
            <S.RecommendTitle>
              <i className="fas fa-lightbulb" /> 맞춤 건강 프로그램 추천
            </S.RecommendTitle>
            <S.RecommendList>
              {results.recommendations.map((rec, index) => (
                <S.RecommendItem key={index}>
                  <S.RecommendIcon className={`fas fa-${rec.icon}`} />
                  <S.RecommendContent>
                    <S.RecommendItemTitle>{rec.title}</S.RecommendItemTitle>
                    <S.RecommendItemDesc>{rec.desc}</S.RecommendItemDesc>
                  </S.RecommendContent>
                </S.RecommendItem>
              ))}
            </S.RecommendList>
          </S.RecommendSection>

          <S.ActionButtons>
            <S.PrevButton onClick={handlePrev}>
              <i className="fas fa-arrow-left" /> 다시 수정
            </S.PrevButton>
            <S.SubmitButton onClick={handleSubmit}>
              <i className="fas fa-check" /> 설문 제출하기
            </S.SubmitButton>
          </S.ActionButtons>
        </S.SurveyCard>
      )}
    </S.MainContainer>
  );
};

export default StressSurvey;