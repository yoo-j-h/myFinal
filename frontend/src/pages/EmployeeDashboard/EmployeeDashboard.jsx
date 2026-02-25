import React, { useState, useEffect } from 'react';
import * as S from './EmployeeDashboard.styled';
import { getTodayString, getYearString, getWorkingDaysInMonth } from './Total_date';
import { fetchDashboardData } from "./dashboardApi";
import { ATTENDANCE_CONFIG } from './Total_working';
import { useNavigate } from 'react-router-dom';
const FLIGHT_STATUS_MAP = {
    'DELAYED': { label: '지연', color: '#E74C3C' },    // 빨간색
    'CANCELLED': { label: '결항', color: '#95A5A6' },  // 회색
    'DEPARTED': { label: '출발', color: '#27AE60' },   // 초록색
    'ARRIVED': { label: '도착', color: '#2ECC71' },    // 연초록
    'ASSIGNING': { label: '배정중', color: '#F1C40F' }, // 노란색
    'ASSIGNED': { label: '배정완료', color: '#3498DB' }, // 파란색
    'DEFAULT': { label: '확인중', color: '#BDC3C7' }
};
const EmployeeDashboard = () => {
    // --- State 관리 ---
    const [todaySchedule, setTodaySchedule] = useState([]);
    const [leaveCount, setLeaveCount] = useState(0);
    const [currentTime, setCurrentTime] = useState('--:--');
    const [currentDate] = useState(getTodayString());
    const [statusInfo, setStatusInfo] = useState(ATTENDANCE_CONFIG.DEFAULT);
    const [currentYear] = useState(getYearString());
    const [totalWorkingDays, setTotalWorkingDays] = useState(0);
    const [actualWorkingDays, setActualWorkingDays] = useState(0);
    const [flightTime, setFlightTime] = useState(0);
    const [flightCount, setFlightCount] = useState(0);
    const [healthData, setHealthData] = useState({
        healthPoint: 0,
        stressPoint: 0,
        fatiguePoint: 0,
        physicalPoint: 0
    });
    const [recentNotifications, setRecentNotifications] = useState([]);
    const navigate = useNavigate();

    // --- 핸들러 ---
    const handleHealthDetailClick = () => {
        navigate('/health-dashboard');
    };

    // --- 데이터 로드 (useEffect) ---
    useEffect(() => {
        const loadData = async () => {
            try {
                // --- 사용자 인증 정보 확인 ---
                const storageData = localStorage.getItem('auth-storage');
                if (!storageData) {
                    navigate('/login');
                    return;
                }
                const parsedData = JSON.parse(storageData);
                const token = parsedData.state?.token;
                const empId = parsedData.state?.emp?.empId;
                const empName = parsedData.state?.emp?.empName;
                const role = parsedData.state?.emp?.role;

                if (!token) {
                    navigate('/login');
                    return;
                }

                // 슈퍼관리자는 대시보드 API를 호출하지 않음
                if (role === 'SUPER_ADMIN') {
                    navigate('/super-admin-dashboard', { replace: true });
                    return;
                }

                // empId가 없거나 유효하지 않은 경우 처리
                if (!empId || empId === 'SUPERADMIN' || empId === 'SUPER_ADMIN') {
                    console.warn('유효하지 않은 empId:', empId);
                    if (role === 'SUPER_ADMIN') {
                        navigate('/super-admin-dashboard', { replace: true });
                        return;
                    }
                    navigate('/login');
                    return;
                }

                console.log("확인된 사번:", empId);
                console.log("확인된 이름:", empName);
                console.log("확인된 역할:", role);
                console.log("현재 로컬스토리에서 가져온 토큰:", token);

                // API 호출 (백엔드에서 토큰으로 유저 식별)
                const data = await fetchDashboardData();
                const todayStr = new Date().toLocaleDateString('en-CA'); // "YYYY-MM-DD"

                console.log("1. 전체 응답 데이터:", data);

                setTotalWorkingDays(getWorkingDaysInMonth());

                // 1. 연차 개수 설정
                if (data.empInfo) {
                    setLeaveCount(data.empInfo.leaveCount || 0);
                }

                // 2. 실제 근무일 설정
                if (data.workingDays !== undefined) {
                    setActualWorkingDays(data.workingDays);
                }

                // 3. 비행 시간 및 횟수 설정
                if (data.totalFlightHours !== undefined) {
                    setFlightTime(data.totalFlightHours);
                }
                if (data.totalFlightCount !== undefined) {
                    setFlightCount(data.totalFlightCount);
                }

                // 4. 건강 정보 설정
                if (data.healthInfo) {
                    setHealthData({
                        healthPoint: data.healthInfo.healthPoint || 0,
                        stressPoint: data.healthInfo.stressPoint || 0,
                        fatiguePoint: data.healthInfo.fatiguePoint || 0,
                        physicalPoint: data.healthInfo.physicalPoint || 0
                    });
                }

                // 5. 비행 일정 가공
                const flights = (data.flightList || []).map(f => {
                    const statusConfig = FLIGHT_STATUS_MAP[f.flightStatus] || FLIGHT_STATUS_MAP.DEFAULT;
                    return {
                        id: `fly-${f.flyScheduleId}`,
                        time: f.flyStartTime ? f.flyStartTime.substring(11, 16) : '--:--',
                        date: f.flyStartTime ? f.flyStartTime.substring(0, 10) : '',
                        type: 'flight',
                        title: `${f.flightNumber} ${f.departure} → ${f.destination}`,
                        subtitle: `${f.airplaneType} • 게이트 ${f.gate}`,
                        status: statusConfig.label,
                        statusColor: statusConfig.color
                    };
                });

                // 6. 지상 일정 가공
                const grounds = (data.groundScheduleList || []).map(g => ({
                    id: `ground-${g.groundScheduleId}`,
                    time: g.scheduleStartTime.substring(0, 5),
                    date: g.scheduleStartDate,
                    type: 'ground',
                    title: g.workCode === 'SAFETY_TRAIN' ? '안전 교육' :
                        g.workCode === 'NIGHT_SHIFT' ? '야간 근무' : '지상 업무',
                    subtitle: `${g.scheduleStartTime} ~ ${g.scheduleEndTime}`,
                    status: g.scheduleStatus === 'Y' ? '확정' : '대기',
                    statusColor: '#F39C12'
                }));

                // 7. 건강 프로그램 일정 가공
                const programs = (data.programList || []).map(p => ({
                    id: `prog-${p.programApplyId}`,
                    time: p.programStartTime,
                    date: p.programDate,
                    type: 'health',
                    title: `[건강] ${p.programName}`,
                    subtitle: `📍 ${p.location}`,
                    status: p.status === 'APPROVED' ? '확정' : '신청',
                    statusColor: '#E67E22'
                }));

                // 8. 모든 일정 합치기 및 날짜/시간순 정렬
                const combined = [...flights, ...grounds, ...programs]
                    .filter(item => item.date === todayStr) // 오늘 날짜와 일치하는 항목만 남김
                    .sort((a, b) => {
                        // 같은 날짜이므로 시간(time) 순서로만 정렬
                        return a.time.localeCompare(b.time);
                    });
                setTodaySchedule(combined);

                // 9. 출결 및 알림 로직
                const newNotifications = [];
                if (data.attendanceList && data.attendanceList.length > 0) {
                    const todayData = data.attendanceList[0];
                    const config = ATTENDANCE_CONFIG[todayData.attendanceStatus] || ATTENDANCE_CONFIG.DEFAULT;
                    setStatusInfo(config);
                    if (todayData.inTime) setCurrentTime(todayData.inTime.substring(0, 5));

                    // 전일 근태 알림 추출
                    const sortedList = [...data.attendanceList].sort((a, b) => b.attendanceId - a.attendanceId);
                    const lastWorkDay = sortedList.find(item => item.attendanceDate !== todayStr);

                    if (lastWorkDay) {
                        const lastStatus = ATTENDANCE_CONFIG[lastWorkDay.attendanceStatus] || ATTENDANCE_CONFIG.DEFAULT;
                        newNotifications.push({
                            id: 1,
                            icon: lastWorkDay.attendanceStatus === 'ABSENT' ? '❗' : '✅',
                            title: '전일 근태 결과 확인',
                            message: `${lastWorkDay.attendanceDate.substring(5)} 근태가 [${lastStatus.label}]로 처리되었습니다.`,
                            time: '최종 반영',
                            color: lastStatus.color
                        });
                    }
                }

                // 비행 이슈 알림
                const issueFlight = data.flightList?.find(f => f.flightStatus === 'DELAYED' || f.flightStatus === 'CANCELLED');
                if (issueFlight) {
                    newNotifications.push({
                        id: 2,
                        icon: '⚠️',
                        title: issueFlight.flightStatus === 'DELAYED' ? '비행 지연' : '비행 취소',
                        message: `${issueFlight.flightNumber}편이 ${issueFlight.flightStatus === 'DELAYED' ? '지연' : '취소'}되었습니다.`,
                        time: '실시간',
                        color: '#E74C3C'
                    });
                } else {
                    const nextFlight = data.flightList?.[0];
                    newNotifications.push({
                        id: 2,
                        icon: '✈️',
                        title: '스케줄 정상',
                        message: nextFlight ? `다음 비행: ${nextFlight.flightNumber}` : '예정된 비행이 없습니다.',
                        time: '현재',
                        color: '#4A90E2'
                    });
                }
                setRecentNotifications(newNotifications);

            } catch (error) {
                console.error("데이터를 불러오는데 실패했습니다.", error);
                if (error.response?.status === 401) navigate('/login');
            }
        };
        loadData();
    }, [navigate]);

    // --- 통계 및 차트 데이터 계산 ---
    const statistics = [
        { id: 'day', icon: '💼', label: '이번 달 근무일', value: actualWorkingDays, unit: `/ ${totalWorkingDays}일`, subInfo: '정상 근무 중', color: '#F39C12' },
        { id: 'flight', icon: '✈️', label: '누적 비행시간', value: flightTime, unit: '시간', subInfo: `비행 수 : ${flightCount}회`, color: '#27AE60' },
        { id: 'leave', icon: '📅', label: '남은 연차', value: leaveCount, unit: `일`, subInfo: `${currentYear}`, color: '#4A90E2' },
        { id: 'stress', icon: '❤️', label: '건강 점수', value: healthData.healthPoint, unit: '점', subInfo: '평균 지수', color: '#E74C3C' }
    ];

    const performanceData = {
        attendance: {
            label: '연차 사용',
            current: Math.max(0, 15 - leaveCount),
            total: 15,
            percentage: Math.min(100, ((15 - leaveCount) / 15) * 100)
        },
        leave: {
            label: '근무일',
            current: actualWorkingDays,
            total: totalWorkingDays,
            percentage: totalWorkingDays > 0 ? (actualWorkingDays / totalWorkingDays) * 100 : 0
        }
    };

    return (
        <S.DashboardContainer>
            <S.MainContent>
                {/* 상단 배너 */}
                <S.AttendanceBanner>
                    <S.BannerContent>
                        <S.BannerInfo>
                            <S.BannerLabel>오늘의 근무 상태</S.BannerLabel>
                            <S.BannerTitle>{statusInfo.label} - {currentDate}</S.BannerTitle>
                        </S.BannerInfo>
                        <S.BannerTime>{currentTime}</S.BannerTime>
                    </S.BannerContent>
                </S.AttendanceBanner>

                {/* 통계 그리드 */}
                <S.StatisticsGrid>
                    {statistics.map((stat) => (
                        <S.StatCard key={stat.id} color={stat.color}>
                            <S.StatHeader>
                                <S.StatIcon>{stat.icon}</S.StatIcon>
                                <S.StatLabel>{stat.label}</S.StatLabel>
                            </S.StatHeader>
                            <S.StatValue>
                                {stat.value} <S.StatUnit>{stat.unit}</S.StatUnit>
                            </S.StatValue>
                            <S.StatSubInfo>{stat.subInfo}</S.StatSubInfo>
                        </S.StatCard>
                    ))}
                </S.StatisticsGrid>

                <S.ContentGrid>
                    {/* 통합 일정 섹션 */}
                    <S.ScheduleSection>
                        <S.SectionHeader>
                            <S.SectionTitle>📅 오늘 일정 현황</S.SectionTitle>
                        </S.SectionHeader>
                        <S.ScheduleList>
                            {todaySchedule.length > 0 ? (
                                todaySchedule.map((schedule) => (
                                    <S.ScheduleItem key={schedule.id}>
                                        <S.ScheduleTime>
                                            <span style={{ fontSize: '10px', display: 'block', opacity: 0.7 }}>
                                                {schedule.date.substring(5)}
                                            </span>
                                            {schedule.time}
                                        </S.ScheduleTime>
                                        <S.ScheduleContent>
                                            <S.ScheduleTitle>{schedule.title}</S.ScheduleTitle>
                                            <S.ScheduleSubtitle>{schedule.subtitle}</S.ScheduleSubtitle>
                                        </S.ScheduleContent>
                                        <S.ScheduleStatus color={schedule.statusColor}>
                                            {schedule.status}
                                        </S.ScheduleStatus>
                                    </S.ScheduleItem>
                                ))
                            ) : (
                                <div style={{ padding: '40px', textAlign: 'center', color: '#95A5A6' }}>
                                    조회된 일정이 없습니다.
                                </div>
                            )}
                        </S.ScheduleList>
                    </S.ScheduleSection>

                    {/* 우측 패널 (건강 & 알림) */}
                    <S.RightPanel>
                        <S.HealthSection>
                            <S.SectionHeader>
                                <S.SectionTitle>❤️ 나의 건강 현황</S.SectionTitle>
                            </S.SectionHeader>
                            <S.HealthScore>
                                <S.ScoreValue>{healthData.healthPoint}</S.ScoreValue>
                                <S.ScoreGrid>
                                    <S.ScoreItem>
                                        <S.ScoreGrade $grade="A">{healthData.physicalPoint}</S.ScoreGrade>
                                        <S.ScoreLabel>체력</S.ScoreLabel>
                                    </S.ScoreItem>
                                    <S.ScoreItem>
                                        <S.ScoreGrade $grade="B+">{healthData.stressPoint}</S.ScoreGrade>
                                        <S.ScoreLabel>스트레스</S.ScoreLabel>
                                    </S.ScoreItem>
                                </S.ScoreGrid>
                            </S.HealthScore>
                            <S.HealthActionButton onClick={handleHealthDetailClick}>
                                📊 상세 정보보기
                            </S.HealthActionButton>
                        </S.HealthSection>

                        <S.NotificationSection>
                            <S.SectionHeader>
                                <S.SectionTitle>🔔 최근 알림</S.SectionTitle>
                            </S.SectionHeader>
                            <S.NotificationList>
                                {recentNotifications.map((noti) => (
                                    <S.NotificationItem key={noti.id}>
                                        <S.NotificationIcon color={noti.color}>{noti.icon}</S.NotificationIcon>
                                        <S.NotificationContent>
                                            <S.NotificationTitle>{noti.title}</S.NotificationTitle>
                                            <S.NotificationMessage>{noti.message}</S.NotificationMessage>
                                            <S.NotificationTime>{noti.time}</S.NotificationTime>
                                        </S.NotificationContent>
                                    </S.NotificationItem>
                                ))}
                            </S.NotificationList>
                        </S.NotificationSection>
                    </S.RightPanel>
                </S.ContentGrid>

                {/* 하단 성과 섹션 */}
                <S.PerformanceSection>
                    <S.SectionHeader>
                        <S.SectionTitle>📊 이번 달 현황</S.SectionTitle>
                    </S.SectionHeader>
                    <S.PerformanceChart>
                        <S.ChartBar>
                            <S.ChartLabel>연차</S.ChartLabel>
                            <S.ChartProgress>
                                <S.ChartFill width={performanceData.attendance.percentage} color="#4A90E2" />
                            </S.ChartProgress>
                            <S.ChartValue>
                                {performanceData.attendance.current}일 사용
                                <S.ChartTotal>/ 15일</S.ChartTotal>
                            </S.ChartValue>
                        </S.ChartBar>

                        <S.ChartBar>
                            <S.ChartLabel>근무</S.ChartLabel>
                            <S.ChartProgress>
                                <S.ChartFill width={performanceData.leave.percentage} color="#27AE60" />
                            </S.ChartProgress>
                            <S.ChartValue>
                                {performanceData.leave.current}일 출근
                                <S.ChartTotal>/ {totalWorkingDays}일</S.ChartTotal>
                            </S.ChartValue>
                        </S.ChartBar>
                    </S.PerformanceChart>
                </S.PerformanceSection>
            </S.MainContent>
        </S.DashboardContainer>
    );
};

export default EmployeeDashboard;