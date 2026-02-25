import React, { useEffect, useMemo, useState } from 'react';
import * as S from './HealthDashboard.styled';
import useAuthStore from '../../store/authStore';
import healthService from '../../api/Health/healthService';
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const HealthDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7일');
  const empId = useAuthStore((s) => s.getEmpId());

  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState(null); // 백에서 내려준 EmpHealthResponse 저장용
  const [trend, setTrend] = useState([]);     // 차트용 series
  const [loadingTrend, setLoadingTrend] = useState(false);

  const [record, setRecord] = useState(null);
  const [loadingRecord, setLoadingRecord] = useState(false);
  // {/* TODO: Zustand state mapping */}


const handleHealthReportClick = async () => {
    try {
      const days = periodToDays(selectedPeriod);
      if (!empId) return;

      const req = {
        empId,
        healthPoint: apiData?.health_point ?? null,
        physicalPoint: apiData?.physical_point ?? null,
        stressPoint: apiData?.stress_point ?? null,
        fatiguePoint: apiData?.fatigue_point ?? null,
        trend: (Array.isArray(trend) ? trend : []).map((p) => ({
          date: p.date,
          healthPoint: p.healthPoint ?? 0,
        })),
        record: {
          workTimeHours: record?.workTimeHours ?? 0,
          surveyCnt: record?.surveyCnt ?? 0,
          programCnt: record?.programCnt ?? 0,
          scoreChg: record?.scoreChg ?? 0,
        },
        tips: (healthData.healthTips ?? []).map((t) => ({
          category: t.category,
          title: t.title,
        })),
      };

      const res = await healthService.healthReportPdf(days, req);

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `health-report-${empId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("PDF 호출 실패(콘솔 확인)");
    }
  };



  useEffect(() => {
    const fetchHealthRecord = async () => {
      if (!empId) return;

      setLoadingRecord(true);
      try {
        const res = await healthService.healthRecord(empId);
        // 백 응답 예시(권장):
        // { workTimeHours: 847, surveyCnt: 12, programCnt: 3, scoreChg: 5 }
        setRecord(res.data);
        console.log("healthRecord:", res.data);
      } catch (e) {
        console.error(e);
        setRecord(null);
      } finally {
        setLoadingRecord(false);
      }
    };

    fetchHealthRecord();
  }, [empId]);


  useEffect(() => {
  const fetchTrend = async () => {
    if (!empId) return;

    const days = periodToDays(selectedPeriod);
    setLoadingTrend(true);
    try {
      const res = await healthService.healthPointTrend(empId, days);
      console.log("res",res);
      // 백 응답: { empId, days, series: [{date, healthPoint, physicalPoint, ...}] }
      setTrend(res?.data?.series ?? []);
    } catch (e) {
      console.error(e);
      setTrend([]); // 실패해도 화면은 떠야 하니 빈 배열로
    } finally {
      setLoadingTrend(false);
    }
  };

  fetchTrend();
}, [empId, selectedPeriod]);
  useEffect(() => {
    const fetchHealthPoint = async () => {
      if (!empId) return;

      setLoading(true);
      try {
        const res = await healthService.healthPoint(empId);
        setApiData(res.data);
        console.log(res.data); // { empId, empName, healthPoint, physicalPoint, stressPoint, fatiguePoint, createDate ... }
      } catch (e) {
        console.error(e);
        // 실패해도 화면은 떠야 하니 apiData는 null 유지
      } finally {
        setLoading(false);
      }
    };

    fetchHealthPoint();
  }, [empId]);

  const n0 = (v) => (v == null ? 0 : Number(v)); // null/undefined -> 0

  const formatHours = (v) => `${n0(v)}h`;
  const formatCount = (v) => `${n0(v)}회`;
  const formatScoreChg = (v) => {
    const num = n0(v);
    const sign = num > 0 ? "+" : ""; // 음수는 -가 자동으로 붙음
    return `${sign}${num}점`;
  };

  const chartData = useMemo(() => {
    const safeTrend = Array.isArray(trend) ? trend : [];

    const labels = safeTrend.map((p) => p.date ?? "");
    const data = safeTrend.map((p) => (p.healthPoint ?? 0)); // null -> 0

    return { labels, data };
  }, [trend]);

  const periodToDays = (p) => {
    if (p === "7일") return 7;
    if (p === "30일") return 30;
    if (p === "90일") return 90;
    return 7;
  };

  const healthData = useMemo(() => {
    // apiData 없으면 기본값으로 렌더링
    const userName = apiData?.emp_name ?? "사용자";
    const overallScore = apiData?.health_point ?? "-";

    // 예: 각 항목 점수는 API에서 내려준 값 사용 (null이면 "-")
    const physical = apiData?.physical_point ?? "-";
    const stress = apiData?.stress_point ?? "-";
    const fatigue = apiData?.fatigue_point ?? "-";

    return {
      userName,
      overallScore,
      greeting: `안녕하세요, ${userName}님!`,
      message:
        overallScore === "-"
          ? "아직 건강 점수 데이터가 없습니다."
          : "오늘 건강 상태를 확인해 주세요.",

      grades: [
        {
          id: 1,
          category: "신체건강",
          grade: physical === "-" ? "-" : String(physical),
          gradeColor: "#10b981",
          icon: "💪",
          description: "최근 건강 검진 점수",
        },
        {
          id: 2,
          category: "스트레스",
          grade: stress === "-" ? "-" : String(stress),
          gradeColor: "#f59e0b",
          icon: "😊",
          description: "최근 설문 점수",
        },
        {
          id: 3,
          category: "피로도",
          grade: fatigue === "-" ? "-" : String(fatigue),
          gradeColor: "#ef4444",
          icon: "📋",
          description: "최근 근무 강도 분석",
        },
      ],
      statistics: {
        workTime: formatHours(record?.workTimeHours),   // "847h"
        workTimeLabel: "누적 근무시간",

        surveyCnt: formatCount(record?.surveyCnt),      // "12회"
        surveyCntLabel: "설문 참여",

        programCnt: formatCount(record?.programCnt),    // "3회"
        programCntLabel: "프로그램 참여",

        scoreChg: formatScoreChg(record?.scoreChg),     // "+5점" / "-2점" / "0점"
        scoreChgLabel: "점수 변화",
      },

      // ↓ 나머지 기존 하드코딩 데이터는 그대로 두셔도 됩니다
      alert: {
        type: "warning",
        title: "1월 스트레스 심층분석 완료했어요",
        period: "데이터 정리일: 2025-12-15, 다음 설문 마감: 2026-01-20",
        actionText: "설문 보기",
      },
      healthTips: [ {
        id: 1,
        icon: '🛡️',
        category: '수면 관리',
        title: '숙면을 위한 정보와 꿀잠을 위한 제품을 추천해요.'
      },
      {
        id: 2,
        icon: '⏰',
        category: '시차 적응',
        title: '시차 적응에 효과 제대로된 방법을 소개해 드립니다'
      },
      {
        id: 3,
        icon: '🧘',
        category: '기분관 운동',
        title: '업무 후 간단한 스트레칭으로 심신의 균형을 찾습니다'
      }],
      recommendations: [
        { type: 'sleep', icon: 'bed', title: '1:1 심리 상담', desc: '전문 상담사와 함께하는 맞춤 심리 케어', duration: '30분', participants: '개인상담' },
        { type: 'stress', icon: 'dumbbell', title: '스트레칭 클래스', desc: '비행 후 몸의 균형 찾아 상쾌한 회복 스트레칭', duration: '50분', participants: '6-10명' },
        { type: 'exercise', icon: 'bed', title: '수면 개선 프로그램', desc: '시차 적응과 불규칙 수면 개선을 위한 코칭', duration: '4주', participants: '온라인' }
       ],
      departmentScores: [ /* 기존 그대로 */ ],
    };
  }, [apiData]);




  // const healthData = {
  //   userName: '김민수',
  //   overallScore: 82,
  //   greeting: '안녕하세요, 김민수님!',
  //   message: '오늘 건강 상태는 양호합니다! 자율적인 관리를 권장해요.',
  //   grades: [
  //     { 
  //       id: 1, 
  //       category: '신체건강', 
  //       grade: 'A', 
  //       gradeColor: '#10b981',
  //       icon: '💪',
  //       description: '최근 건강 검진 점수'
  //     },
  //     { 
  //       id: 2, 
  //       category: '스트레스', 
  //       grade: 'B+', 
  //       gradeColor: '#f59e0b',
  //       icon: '😊',
  //       description: '최근 설문 점수'
  //     },
      
  //     { 
  //       id: 3, 
  //       category: '피로도', 
  //       grade: 'C+', 
  //       gradeColor: '#ef4444',
  //       icon: '📋',
  //       description: '최근 근무 강도 분석'
  //     }
  //   ],
  //   alert: {
  //     type: 'warning',
  //     title: '1월 스트레스 심층분석 완료했어요',
  //     period: '데이터 정리일: 2025-12-15, 다음 설문 마감: 2026-01-20',
  //     actionText: '설문 보기'
  //   },
  //   statistics: {
  //     totalFlightHours: '847h',
  //     totalFlightHoursLabel: '누적 비행시간',
  //     recentFlights: '12회',
  //     recentFlightsLabel: '완료 횟수',
  //     timezoneChanges: '3회',
  //     timezoneChangesLabel: '최근 3개월',
  //     upcomingFlights: '+5회',
  //     upcomingFlightsLabel: '남은 일정'
  //   },
  //   healthTips: [
  //     {
  //       id: 1,
  //       icon: '🛡️',
  //       category: '수면 관리',
  //       title: '숙면을 위한 정보와 꿀잠을 위한 제품을 추천해요.'
  //     },
  //     {
  //       id: 2,
  //       icon: '⏰',
  //       category: '시차 적응',
  //       title: '시차 적응에 효과 제대로된 방법을 소개해 드립니다'
  //     },
  //     {
  //       id: 3,
  //       icon: '🧘',
  //       category: '기분관 운동',
  //       title: '업무 후 간단한 스트레칭으로 심신의 균형을 찾습니다'
  //     }
  //   ],
  //   recommendations: [
  //     { type: 'sleep', icon: 'bed', title: '1:1 심리 상담', desc: '전문 상담사와 함께하는 맞춤 심리 케어', duration: '30분', participants: '개인상담' },
  //     { type: 'stress', icon: 'dumbbell', title: '스트레칭 클래스', desc: '비행 후 몸의 균형 찾아 상쾌한 회복 스트레칭', duration: '50분', participants: '6-10명' },
  //     { type: 'exercise', icon: 'bed', title: '수면 개선 프로그램', desc: '시차 적응과 불규칙 수면 개선을 위한 코칭', duration: '4주', participants: '온라인' }
  //   ],
  //   departmentScores: [
  //     { department: '객실 승무원', score: 84, avgScore: '1,245명', status: '양호', statusColor: 'good' },
  //     { department: '운항 승무원', score: 76, avgScore: '432명', status: '주의', statusColor: 'warning' },
  //     { department: '지상직', score: 81, avgScore: '678명', status: '양호', statusColor: 'good' },
  //     { department: '정비팀', score: 68, avgScore: '289명', status: '주의필요', statusColor: 'danger' }
  //   ]
  // };

  const handleSurveyClick = () => {
    // {/* TODO: 설문 페이지로 이동 */}
    window.location.href = '/stress-survey';
  };

  return (
    <S.MainContainer>
      {/* Hero Section */}
      <S.HeroSection>
        <S.HeroContent>
          <S.HeroTitle>{healthData.greeting}</S.HeroTitle>
          <S.HeroDescription>{healthData.message}</S.HeroDescription>
          <S.HeroActions>
            <S.HeroButton $variant="primary" onClick={handleHealthReportClick}>
              <i className="fas fa-heartbeat" /> 건강 리포트
            </S.HeroButton>
            <S.HeroButton $variant="secondary">
              <i className="fas fa-clipboard-list" /> 설문 참여하기
            </S.HeroButton>
          </S.HeroActions>
        </S.HeroContent>
        <S.HeroScore>
          <S.ScoreCircle>
            <S.ScoreValue>{healthData.overallScore}</S.ScoreValue>
            <S.ScoreLabel>건강 점수</S.ScoreLabel>
          </S.ScoreCircle>
        </S.HeroScore>
      </S.HeroSection>

      {/* Grade Cards */}
      <S.GradeCardsGrid>
        {healthData.grades.map((grade) => (
          <S.GradeCard key={grade.id}>
            <S.GradeIcon>{grade.icon}</S.GradeIcon>
            <S.GradeInfo>
              <S.GradeCategory>{grade.category}</S.GradeCategory>
              <S.GradeDescription>{grade.description}</S.GradeDescription>
            </S.GradeInfo>
            <S.GradeBadge $color={grade.gradeColor}>{grade.grade}</S.GradeBadge>
            <S.GradeProgressBar>
              <S.GradeProgress $width={grade.grade === 'A' ? 95 : grade.grade === 'B+' ? 85 : grade.grade === 'B' ? 80 : 70} $color={grade.gradeColor} />
            </S.GradeProgressBar>
          </S.GradeCard>
        ))}
      </S.GradeCardsGrid>

      {/* Alert Banner */}
      <S.AlertBanner>
        <S.AlertIcon className="fas fa-exclamation-circle" />
        <S.AlertContent>
          <S.AlertTitle>{healthData.alert.title}</S.AlertTitle>
          <S.AlertPeriod>{healthData.alert.period}</S.AlertPeriod>
        </S.AlertContent>
        <S.AlertButton onClick={handleSurveyClick}>
          {healthData.alert.actionText} <i className="fas fa-arrow-right" />
        </S.AlertButton>
      </S.AlertBanner>

      {/* Main Content Grid */}
      <S.ContentGrid>
        {/* Left Column - Chart */}
        <S.ChartSection>
          <S.SectionHeader>
            <S.SectionTitle>
              <i className="fas fa-chart-line" /> 건강 점수 추이
            </S.SectionTitle>
            <S.PeriodTabs>
              {["7일", "30일", "90일"].map((period) => (
                <S.PeriodTab
                  key={period}
                  $active={selectedPeriod === period}
                  onClick={() => setSelectedPeriod(period)}
                >
                  {period}
                </S.PeriodTab>
              ))}
            </S.PeriodTabs>
          </S.SectionHeader>

          {loadingTrend ? (
            <S.ChartPlaceholder>
              <S.ChartText>불러오는 중...</S.ChartText>
            </S.ChartPlaceholder>
          ) : trend.length === 0 ? (
            <S.ChartPlaceholder>
              <S.ChartText>표시할 데이터가 없습니다.</S.ChartText>
            </S.ChartPlaceholder>
          ) : (
            <div style={{ height: 500, position: "relative" }}>
              <Line
                data={{
                  labels: chartData.labels,
                  datasets: [
                    {
                      label: "건강 점수",
                      data: chartData.data,
                      tension: 0.3,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { min: 0, max: 100, ticks: { stepSize: 10 } },
                  },
                }}
              />
            </div>
          )}
        </S.ChartSection>
        {/* Right Column - Statistics */}
        <S.StatisticsSection>
          <S.SectionHeader>
            <S.SectionTitle>
              <i className="fas fa-tachometer-alt" /> 최근 기록
            </S.SectionTitle>
          </S.SectionHeader>
          <S.StatsGrid>
            <S.StatCard>
              <S.StatValue>{healthData.statistics.workTime}</S.StatValue>
              <S.StatLabel>{healthData.statistics.workTimeLabel}</S.StatLabel>
            </S.StatCard>
            <S.StatCard>
              <S.StatValue $color="#10b981">{healthData.statistics.surveyCnt}</S.StatValue>
              <S.StatLabel>{healthData.statistics.surveyCntLabel}</S.StatLabel>
            </S.StatCard>
            <S.StatCard>
              <S.StatValue $color="#f59e0b">{healthData.statistics.programCnt}</S.StatValue>
              <S.StatLabel>{healthData.statistics.programCntLabel}</S.StatLabel>
            </S.StatCard>
            <S.StatCard>
              <S.StatValue $color="#8b5cf6">{healthData.statistics.scoreChg}</S.StatValue>
              <S.StatLabel>{healthData.statistics.scoreChgLabel}</S.StatLabel>
            </S.StatCard>
          </S.StatsGrid>

          {/* Health Tips */}
          <S.TipsSection>
            <S.TipsTitle>
              <i className="fas fa-lightbulb" /> 맞춤 건강팁
            </S.TipsTitle>
            <S.TipsList>
              {healthData.healthTips.map((tip) => (
                <S.TipItem key={tip.id}>
                  <S.TipIcon>{tip.icon}</S.TipIcon>
                  <S.TipContent>
                    <S.TipCategory>{tip.category}</S.TipCategory>
                    <S.TipTitle>{tip.title}</S.TipTitle>
                  </S.TipContent>
                </S.TipItem>
              ))}
            </S.TipsList>
          </S.TipsSection>
        </S.StatisticsSection>
      </S.ContentGrid>

      {/* Recommended Programs */}
      <S.ProgramsSection>
        <S.SectionHeader>
          <S.SectionTitle>
            <i className="fas fa-spa" /> 추천 건강 프로그램
          </S.SectionTitle>
          <S.ViewAllButton>
            전체보기 <i className="fas fa-arrow-right" />
          </S.ViewAllButton>
        </S.SectionHeader>
        <S.ProgramsGrid>
          {healthData.recommendations.map((program, index) => (
            <S.ProgramCard key={index} $type={program.type}>
              <S.ProgramIcon className={`fas fa-${program.icon}`} />
              <S.ProgramContent>
                <S.ProgramTitle>{program.title}</S.ProgramTitle>
                <S.ProgramDesc>{program.desc}</S.ProgramDesc>
                <S.ProgramMeta>
                  <S.ProgramMetaItem>
                    <i className="fas fa-clock" /> {program.duration}
                  </S.ProgramMetaItem>
                  <S.ProgramMetaItem>
                    <i className="fas fa-users" /> {program.participants}
                  </S.ProgramMetaItem>
                </S.ProgramMeta>
              </S.ProgramContent>
            </S.ProgramCard>
          ))}
        </S.ProgramsGrid>
      </S.ProgramsSection>

      {/* Department Health Scores 직원 화면에서 제거 */}
      {/* <S.DepartmentSection>
        <S.SectionHeader>
          <S.SectionTitle>
            <i className="fas fa-building" /> 부서별 건강 현황 (전체평균)
          </S.SectionTitle>
          <S.ExportButton>
            <i className="fas fa-download" /> 리포트
          </S.ExportButton>
        </S.SectionHeader>
        <S.DepartmentTable>
          <S.TableHeader>
            <S.TableHeaderCell $width="25%">부서</S.TableHeaderCell>
            <S.TableHeaderCell $width="15%">평균 점수</S.TableHeaderCell>
            <S.TableHeaderCell $width="35%">점수 분포</S.TableHeaderCell>
            <S.TableHeaderCell $width="15%">인원</S.TableHeaderCell>
            <S.TableHeaderCell $width="10%">상태</S.TableHeaderCell>
          </S.TableHeader>
          <S.TableBody>
            {healthData.departmentScores.map((dept, index) => (
              <S.TableRow key={index}>
                <S.TableCell>{dept.department}</S.TableCell>
                <S.TableCell>
                  <S.ScoreNumber $color={dept.statusColor}>{dept.score}</S.ScoreNumber>
                </S.TableCell>
                <S.TableCell>
                  <S.ProgressBarContainer>
                    <S.ProgressBar $width={dept.score} $color={dept.statusColor} />
                  </S.ProgressBarContainer>
                </S.TableCell>
                <S.TableCell>
                  <S.EmployeeCount>{dept.avgScore}</S.EmployeeCount>
                  <S.EmployeeLabel>명</S.EmployeeLabel>
                </S.TableCell>
                <S.TableCell>
                  <S.StatusBadge $status={dept.statusColor}>{dept.status}</S.StatusBadge>
                </S.TableCell>
              </S.TableRow>
            ))}
          </S.TableBody>
        </S.DepartmentTable>
      </S.DepartmentSection> */}
    </S.MainContainer>
  );
};

export default HealthDashboard;