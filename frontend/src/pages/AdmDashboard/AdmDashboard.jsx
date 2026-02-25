import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as S from './AdmDashboard.styled';
import { getTodayString } from './Total_date';
import {
  FiUsers,
  FiSun,
  FiHeart,
  FiCalendar,
  FiClock,
  FiMapPin
} from 'react-icons/fi';
import { FaPlane } from "react-icons/fa";
import { ATTENDANCE_CONFIG } from './Total_working';
import { useNavigate } from 'react-router-dom';

const FLIGHT_STATUS_MAP = {
  DELAYED: { label: '지연', color: '#E74C3C' },
  CANCELLED: { label: '취소', color: '#C0392B' },
  NORMAL: { label: '정상', color: '#4A90E2' },
  DEFAULT: { label: '확정', color: '#4A90E2' }
};
const Dashboard = () => {
  // --- 1. State 관리 ---
  const [serverData, setServerData] = useState(null); // 서버 응답 데이터 저장
  const [currentTime, setCurrentTime] = useState('--:--');
  const [loading, setLoading] = useState(true);
  const [statusInfo, setStatusInfo] = useState(null);
  const navigate = useNavigate();
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [todaySchedule, setTodaySchedule] = useState([]);
  // --- 3. 데이터 호출 함수 (콘솔 확인용) ---
  useEffect(() => {

    const fetchAdminData = async () => {
      try {
        // auth-storage에서 empId 추출
        const storage = JSON.parse(localStorage.getItem('auth-storage'));
        const empId = storage?.state?.emp?.empId;

        if (!empId) {
          console.warn("⚠️ 사원 정보를 찾을 수 없습니다. 로그인이 필요합니다.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:8001/api/dashboard/admin/${empId}`);

        // 2. 응답 데이터를 'data'라는 변수에 담습니다. (이제 ReferenceError가 사라집니다)
        const data = response.data;
        console.log("✅ [서버 응답 데이터]:", data);

        // 3. 받아온 data를 사용하여 출결 상태를 처리합니다.
        if (data.attendanceList && data.attendanceList.length > 0) {
          const todayData = data.attendanceList[0];
          const config = ATTENDANCE_CONFIG[todayData.attendanceStatus] || ATTENDANCE_CONFIG.DEFAULT;
          setStatusInfo(config);

          if (todayData.inTime) {
            setCurrentTime(todayData.inTime.substring(0, 5));
          }
        } else {
          // 💡 데이터가 없을 때 기본값 설정
          setStatusInfo(ATTENDANCE_CONFIG.DEFAULT || { label: '기본', color: '#ccc' });
          setCurrentTime('--:--');
        }
        // 2. 알림(Notifications) 생성 로직
        const newNotifications = [];
        const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD

        // (1) 근태 알림 처리
        if (data.attendanceList && data.attendanceList.length > 0) {
          const sortedList = [...data.attendanceList].sort((a, b) => b.attendanceId - a.attendanceId);
          const lastWorkDay = sortedList.find(item => item.attendanceDate !== todayStr);

          if (lastWorkDay) {
            const status = ATTENDANCE_CONFIG[lastWorkDay.attendanceStatus] || ATTENDANCE_CONFIG.DEFAULT;
            const dateParts = lastWorkDay.attendanceDate.split('-');
            newNotifications.push({
              id: 1,
              icon: lastWorkDay.attendanceStatus === 'ABSENT' ? '❗' : '✅',
              title: '전일 근태 결과',
              message: `${dateParts[1]}월 ${dateParts[2]}일 [${status.label}]`,
              time: '최종',
              color: status.color
            });
          }
        }

        // (2) 비행 이슈 알림 처리
        const issueFlight = data.flightList?.find(f => f.flightStatus === 'DELAYED' || f.flightStatus === 'CANCELLED');
        if (issueFlight) {
          newNotifications.push({
            id: 2,
            icon: '⚠️',
            title: issueFlight.flightStatus === 'DELAYED' ? '비행 지연' : '비행 취소',
            message: `${issueFlight.flightNumber}편 ${issueFlight.flightStatus === 'DELAYED' ? '지연' : '취소'}`,
            time: '실시간',
            color: '#E74C3C'
          });
        } else {
          const nextFlight = data.flightList?.[0];
          newNotifications.push({
            id: 2,
            icon: '✈️',
            title: '스케줄 정상',
            message: nextFlight ? `다음: ${nextFlight.flightNumber}` : '특이사항 없음',
            time: '현재',
            color: '#4A90E2'
          });
        }

        setRecentNotifications(newNotifications);

        const flights = (data.flightList || []).map(f => ({
          id: `fly-${f.flyScheduleId}`,
          time: f.flyStartTime ? f.flyStartTime.substring(11, 16) : '--:--',
          date: f.flyStartTime ? f.flyStartTime.substring(0, 10) : '',
          type: '항공편',
          title: `${f.flightNumber} ${f.departure} → ${f.destination}`,
          subtitle: `${f.airplaneType} • 게이트 ${f.gate}`,
          badge: FLIGHT_STATUS_MAP[f.flightStatus]?.label || '확정',
          badgeColor: FLIGHT_STATUS_MAP[f.flightStatus]?.color || '#4A90E2'
        }));

        // (2) 지상 일정
        const grounds = (data.groundScheduleList || []).map(g => ({
          id: `ground-${g.groundScheduleId}`,
          time: g.scheduleStartTime.substring(0, 5),
          date: g.scheduleStartDate,
          type: '지상업무',
          title: g.workCode === 'SAFETY_TRAIN' ? '안전 교육' : g.workCode === 'NIGHT_SHIFT' ? '야간 근무' : '일반 근무',
          subtitle: `${g.scheduleStartTime} ~ ${g.scheduleEndTime}`,
          badge: g.scheduleStatus === 'Y' ? '확정' : '대기',
          badgeColor: g.scheduleStatus === 'Y' ? '#50C878' : '#3B82F6'
        }));

        // (3) 건강 프로그램
        const programs = (data.programList || []).map(p => ({
          id: `prog-${p.programApplyId}`,
          time: p.programStartTime,
          date: p.programDate,
          type: '건강',
          title: p.programName,
          subtitle: `📍 ${p.location}`,
          badge: p.status === 'APPROVED' ? '승인' : p.status === 'REJECTED' ? '반려' : '신청',
          badgeColor: p.status === 'APPROVED' ? '#50C878' : p.status === 'REJECTED' ? '#EF4444' : '#3B82F6'
        }));

        // 정렬 후 상태 업데이트
        const combined = [...flights, ...grounds, ...programs]
          .filter(item => item.date === todayStr) // ✅ 오늘 날짜와 일치하는 것만 필터링
          .sort((a, b) => {
            return a.time.localeCompare(b.time); // 같은 날짜이므로 시간순으로만 정렬
          });


        setTodaySchedule(combined);
        setServerData(response.data);
      } catch (error) {
        console.error("❌ 데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  // 데이터 로딩 중 표시
  if (loading) return <div style={{ color: 'white', padding: '20px' }}>데이터를 불러오는 중입니다...</div>;
  if (!serverData) return <div style={{ color: 'white', padding: '20px' }}>데이터를 표시할 수 없습니다.</div>;
  const totalPending = serverData.pendingCounts
    ? (serverData.pendingCounts.leaveCount || 0) +
    (serverData.pendingCounts.protestCount || 0) +
    (serverData.pendingCounts.programCount || 0)
    : 0;

  const dashboardData = {

    stats: [
      {
        id: 1,
        icon: <FaPlane />,
        label: '현재 근무 중 직원 수',
        // ✅ 서버에서 받아온 데이터 바인딩 (데이터가 없을 경우 0 표시)
        value: serverData.currentWorkingCount || 0,
        unit: `/ ${serverData.totalEmpCount || 0}명`,
        trend: '실시간 집계 중', // 트렌드 문구도 적절히 수정 가능
        color: '#4A90E2'
      },
      {
        id: 2,
        icon: <FiUsers />,
        label: '승인 대기 총 건수',
        // ✅ 여기서 프론트에서 계산한 합계값을 사용합니다!
        value: totalPending,
        unit: '건',
        trend: '미처리 결재 항목',
        color: '#50C878'
      },
      {
        id: 3,
        icon: <FiSun />,
        label: '이번 주 휴가 사용한 직원 수',
        value: serverData.totalWeekLeaveCount || 0,
        unit: '명',
        trend: '총 사용자',
        color: '#FFB347'
      },
      {
        id: 4,
        icon: <FiHeart />,
        label: '직원 평균 건강 점수',
        value: serverData.healthInfo?.healthPoint || 0,
        unit: '점',
        trend: '평균 지수',
        color: '#FF6B9D'
      }
    ],


    // 2. 하단 프로그레스 바 데이터 설정
    progress: {
      leave: {
        // ✅ 승인된 개수 = 전체(total) - (대기+반려(pending))
        current: (serverData.totalPendingCounts?.leaveCount || 0) - (serverData.pendingCounts?.leaveCount || 0),
        total: serverData.totalPendingCounts?.leaveCount || 0,
        label: '휴가 신청 승인 현황'
      },
      protest: {
        current: (serverData.totalPendingCounts?.protestCount || 0) - (serverData.pendingCounts?.protestCount || 0),
        total: serverData.totalPendingCounts?.protestCount || 0,
        label: '근태 정정 승인 현황'
      },
      program: {
        current: (serverData.totalPendingCounts?.programCount || 0) - (serverData.pendingCounts?.programCount || 0),
        total: serverData.totalPendingCounts?.programCount || 0,
        label: '건강 프로그램 승인 현황'
      }
    },


  };

  return (
    <S.MainContainer>
      {/* 상단 헤더 */}
      <S.DashboardHeader>
        <S.GreetingSection>
          <S.GreetingIcon>👋</S.GreetingIcon>
          <div>
            <S.GreetingText>오늘의 근무 상황</S.GreetingText>
            <S.DateDisplay>
              {statusInfo.label} - {getTodayString()}
            </S.DateDisplay>
          </div>
        </S.GreetingSection>
        <S.CurrentTime>{currentTime}</S.CurrentTime>
      </S.DashboardHeader>

      {/* 통계 카드 그리드 */}
      <S.StatsGrid>
        {dashboardData.stats.map(stat => (
          <S.StatCard key={stat.id} color={stat.color}>
            <S.StatIcon color={stat.color}>{stat.icon}</S.StatIcon>
            <S.StatLabel>{stat.label}</S.StatLabel>
            <S.StatValue>
              <span>{stat.value}</span>
              <S.StatUnit>{stat.unit}</S.StatUnit>
            </S.StatValue>
            <S.StatTrend>{stat.trend}</S.StatTrend>
          </S.StatCard>
        ))}
      </S.StatsGrid>

      {/* 메인 콘텐츠 영역 */}
      <S.ContentGrid>
        {/* 왼쪽: 오늘 일정 */}
        <S.ScheduleSection>
          <S.SectionHeader>
            <S.SectionTitle>
              <FiCalendar /> 오늘 일정
              {/* 📅 현재 날짜 표시 추가 */}
              <span style={{
                marginLeft: '12px',
                fontSize: '14px',
                fontWeight: 'normal',
                color: '#aaa'
              }}>
                {new Date().getFullYear()}년 {new Date().getMonth() + 1}월 {new Date().getDate()}일
              </span>
            </S.SectionTitle>

          </S.SectionHeader>

          <S.ScheduleList>
            {todaySchedule.length > 0 ? todaySchedule.map(schedule => (
              <S.ScheduleItem key={schedule.id}>
                <S.ScheduleTime><FiClock /> {schedule.time}</S.ScheduleTime>
                <S.ScheduleContent>
                  <S.ScheduleType>{schedule.type}</S.ScheduleType>
                  <S.ScheduleTitle>{schedule.title}</S.ScheduleTitle>
                  <S.ScheduleSubtitle><FiMapPin size={14} /> {schedule.subtitle}</S.ScheduleSubtitle>
                </S.ScheduleContent>
                <S.ScheduleBadge color={schedule.badgeColor}>{schedule.badge}</S.ScheduleBadge>
              </S.ScheduleItem>
            )) : (
              <div style={{ color: '#999', padding: '20px' }}>오늘 예정된 일정이 없습니다.</div>
            )}
          </S.ScheduleList>
        </S.ScheduleSection>

        {/* 오른쪽: 빠른 메뉴 & 건강 점수 */}
        <S.SidePanel>
          {/* 직원 평균 건강 점수 */}
          <S.HealthScoreCard>
            <S.SectionHeader>
              <S.SectionTitle style={{ fontSize: '16px' }}>
                ❤️ 직원 평균 건강 점수
              </S.SectionTitle>
            </S.SectionHeader>

            <S.HealthScoreDisplay>
              <S.TotalScore>{serverData.healthInfo?.healthPoint || 0}</S.TotalScore>
              <S.HealthMetrics>
                <S.HealthMetric>
                  <S.HealthGrade color="#50C878">
                    {serverData.healthInfo?.fatiguePoint || 0}
                  </S.HealthGrade>
                  <S.MetricLabel>피로도</S.MetricLabel>
                </S.HealthMetric>
                <S.HealthMetric>
                  <S.HealthGrade color="#FFB347">
                    {serverData.healthInfo?.stressPoint || 0}
                  </S.HealthGrade>
                  <S.MetricLabel>스트레스</S.MetricLabel>
                </S.HealthMetric>
              </S.HealthMetrics>
            </S.HealthScoreDisplay>

            <S.ViewReportButton onClick={() => navigate('/healthprogrammanagement')}>
              📊 건강 프로그램 승인
            </S.ViewReportButton>
          </S.HealthScoreCard>

          {/* 빠른 알림 */}
          <S.QuickMenuCard>
            <S.SectionHeader>
              <S.SectionTitle style={{ fontSize: '16px' }}>
                ⚡ 최근 알림
              </S.SectionTitle>

            </S.SectionHeader>

            <S.QuickMenuList>
              {recentNotifications.map((noti) => ( // 👈 여기 인자 이름이 'noti'입니다.
                <S.QuickMenuItem key={noti.id}>
                  {/* ❌ 기존: item.completed && <S.CheckIcon>✓</S.CheckIcon> */}
                  {/* ✅ 수정: noti.completed (또는 해당 조건 삭제) */}
                  {noti.completed && <S.CheckIcon>✓</S.CheckIcon>}

                  <div style={{ fontSize: '20px', marginRight: '12px' }}>{noti.icon}</div>
                  <S.QuickMenuContent>
                    <S.QuickMenuTitle>{noti.title}</S.QuickMenuTitle>
                    <S.QuickMenuStatus>{noti.message}</S.QuickMenuStatus>
                    <S.QuickMenuTime>{noti.time}</S.QuickMenuTime>
                  </S.QuickMenuContent>
                </S.QuickMenuItem>
              ))}
            </S.QuickMenuList>
          </S.QuickMenuCard>
        </S.SidePanel>
      </S.ContentGrid>

      {/* 하단: 진행률 섹션 */}
      <S.ProgressSection>
        <S.SectionHeader>
          <S.SectionTitle>📊 승인 현황</S.SectionTitle>

        </S.SectionHeader>

        <S.ProgressGrid>
          {/* 휴가 신청 */}
          <S.ProgressBar>
            <S.ProgressLabel>{dashboardData.progress.leave.label}</S.ProgressLabel>
            <S.ProgressTrack>
              <S.ProgressFill
                // ✅ (0 / 0)이 되면 NaN이므로, 그럴 경우 0%로 강제 고정
                width={((dashboardData.progress.leave.current / (dashboardData.progress.leave.total || 1)) * 100) || 0}
                color="#4A90E2"
              />
            </S.ProgressTrack>
            <S.ProgressValue>
              {/* ✅ 화면에는 실제 서버 데이터인 0건 / 0건 표시 */}
              {dashboardData.progress.leave.current}건 / {dashboardData.progress.leave.total}건
            </S.ProgressValue>
          </S.ProgressBar>

          {/* 근태 정정 */}
          <S.ProgressBar>
            <S.ProgressLabel>{dashboardData.progress.protest.label}</S.ProgressLabel>
            <S.ProgressTrack>
              <S.ProgressFill
                width={((dashboardData.progress.protest.current / (dashboardData.progress.protest.total || 1)) * 100) || 0}
                color="#50C878"
              />
            </S.ProgressTrack>
            <S.ProgressValue>
              {dashboardData.progress.protest.current}건 / {dashboardData.progress.protest.total}건
            </S.ProgressValue>
          </S.ProgressBar>

          {/* 건강 프로그램 */}
          <S.ProgressBar>
            <S.ProgressLabel>{dashboardData.progress.program.label}</S.ProgressLabel>
            <S.ProgressTrack>
              <S.ProgressFill
                width={((dashboardData.progress.program.current / (dashboardData.progress.program.total || 1)) * 100) || 0}
                color="#FFB347"
              />
            </S.ProgressTrack>
            <S.ProgressValue>
              {dashboardData.progress.program.current}건 / {dashboardData.progress.program.total}건
            </S.ProgressValue>
          </S.ProgressBar>
        </S.ProgressGrid>
      </S.ProgressSection>
    </S.MainContainer>
  );
};

export default Dashboard;