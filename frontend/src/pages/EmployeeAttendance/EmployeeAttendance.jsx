import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle, Plane, Sun, Calendar as CalendarIcon } from 'lucide-react';
import { attendanceService } from '../../api/attendance';
import useAuthStore from '../../store/authStore';
import * as S from './EmployeeAttendance.styled';

const EmployeeAttendance = () => {
  const navigate = useNavigate();
  const getEmpId = useAuthStore((state) => state.getEmpId);
  const empId = getEmpId();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [stats, setStats] = useState(null);
  const [calendarData, setCalendarData] = useState({});
  const [dailyDataMap, setDailyDataMap] = useState({});  // 날짜별 상세 정보
  const [selectedDailyData, setSelectedDailyData] = useState(null);  // 선택된 날짜의 상세 정보
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  /**
   * 데이터 로드 함수
   */
  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [statsData, calendarDataRes] = await Promise.all([
        attendanceService.getMonthlyStats(empId, year, month),
        attendanceService.getCalendarData(empId, year, month)
      ]);

      console.log('📊 근태 통계 데이터:', statsData);
      console.log('📅 캘린더 데이터:', calendarDataRes);
      console.log('🗓️ attendanceMap:', calendarDataRes.attendanceMap);
      console.log('📋 dailyDataMap:', calendarDataRes.dailyDataMap);

      setStats(statsData);
      setCalendarData(calendarDataRes.attendanceMap || {});
      setDailyDataMap(calendarDataRes.dailyDataMap || {});  // 상세 정보 저장

      // LEAVE_PENDING과 LEAVE 상태 확인
      const leaveStatuses = Object.entries(calendarDataRes.attendanceMap || {})
        .filter(([_, status]) => status === 'LEAVE_PENDING' || status === 'LEAVE');
      if (leaveStatuses.length > 0) {
        console.log('✅ 휴가 관련 상태 발견:', leaveStatuses);
      } else {
        console.log('⚠️ 휴가 관련 상태 없음');
      }
    } catch (err) {
      console.error('❌ 데이터 로드 실패:', err);
      setError('근태 데이터를 불러오는데 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentDate]);

  // selectedDate 변경 시 해당 날짜 데이터 찾기
  useEffect(() => {
    const day = selectedDate.getDate();
    const selectedMonth = selectedDate.getMonth() + 1;
    const selectedYear = selectedDate.getFullYear();

    // 선택한 날짜가 현재 표시 중인 월과 같은지 확인
    if (selectedYear === year && selectedMonth === month) {
      const dailyData = dailyDataMap[day] || null;
      setSelectedDailyData(dailyData);
    } else {
      setSelectedDailyData(null);
    }
  }, [selectedDate, dailyDataMap, year, month]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
  };

  /**
   * 상태 텍스트 변환 헬퍼 함수
   */
  const getStatusText = (status) => {
    const statusMap = {
      'PRESENT': '정상 출근',
      'LATE': '지각',
      'ABSENT': '결근',
      'EARLY_LEAVE': '조퇴',
      'HALF_DAY': '반차',
      'VACATION': '휴가',
      'LEAVE_PENDING': '휴가 대기',
      'LEAVE': '휴가'
    };
    return statusMap[status] || '알 수 없음';
  };

  /**
   * 상태 색상 변환 헬퍼 함수
   */
  const getStatusColor = (status) => {
    const colorMap = {
      'PRESENT': '#10b981',        // 초록색
      'LATE': '#f59e0b',           // 주황색
      'ABSENT': '#ef4444',         // 빨간색
      'EARLY_LEAVE': '#f59e0b',    // 주황색
      'HALF_DAY': '#8b5cf6',       // 보라색
      'VACATION': '#3b82f6',       // 파란색
      'LEAVE_PENDING': '#fbbf24',  // 노란색 (휴가 대기)
      'LEAVE': '#3b82f6'           // 파란색 (휴가 승인)
    };
    return colorMap[status] || '#9ca3af';
  };

  /**
   * 시간 포맷팅 헬퍼 함수 (HH:MM:SS -> HH:MM)
   */
  const formatTime = (time) => {
    if (!time) return '-';
    // LocalTime 형식이 "HH:MM:SS" 또는 "HH:MM" 형식으로 오는 경우
    if (typeof time === 'string') {
      const parts = time.split(':');
      return `${parts[0]}:${parts[1]}`;
    }
    return time;
  };

  /**
   * 3일 이내 날짜 여부 확인 함수 (오늘 포함)
   * 휴가는 최소 3일 전에 신청 가능
   */
  const isWithinThreeDays = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + 3);
    return compareDate < minDate;
  };

  /**
   * 근태 정정 신청 페이지로 이동
   * 출근 기록이 없는 날에도 정정 신청 가능
   */
  const handleCorrectionModalOpen = () => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    // 선택된 날짜와 근태 데이터를 state로 전달하여 정정 신청 페이지로 이동
    // selectedDailyData가 없어도 날짜 정보만으로 정정 신청 가능
    navigate('/protest-apply', {
      state: {
        selectedDate: dateString,
        selectedDailyData: selectedDailyData || null
      }
    });
  };

  /**
   * 휴가 신청 페이지로 이동
   */
  const handleLeaveApply = () => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    // 선택된 날짜를 state로 전달하여 휴가 신청 페이지로 이동
    navigate('/leave-apply', {
      state: {
        selectedDate: dateString
      }
    });
  };

  /**
   * 캘린더 렌더링
   */
  const renderCalendar = () => {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === month;

    // 이전 달의 빈 칸
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<S.DayCell key={`empty-${i}`} $isOtherMonth />);
    }

    // 현재 달의 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = isCurrentMonth && day === today.getDate();
      const isSelected = selectedDate.getFullYear() === year &&
        selectedDate.getMonth() + 1 === month &&
        selectedDate.getDate() === day;
      const status = calendarData[day];

      days.push(
        <S.DayCell
          key={day}
          $isToday={isToday}
          $isSelected={isSelected}
          onClick={() => setSelectedDate(new Date(year, month - 1, day))}
        >
          <S.DayNumber>{day}</S.DayNumber>
          {status && <S.StatusDot $status={status} />}
        </S.DayCell>
      );
    }

    return days;
  };

  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  const monthTitle = `${year}년 ${month}월`;

  // 로그인 확인
  if (!empId) {
    return (
      <S.PageContainer>
        <S.ContentArea>
          <S.ErrorContainer>
            <S.ErrorMessage>로그인이 필요합니다.</S.ErrorMessage>
          </S.ErrorContainer>
        </S.ContentArea>
      </S.PageContainer>
    );
  }

  if (loading) {
    return (
      <S.PageContainer>
        <S.ContentArea>
          <S.LoadingContainer>데이터를 불러오는 중...</S.LoadingContainer>
        </S.ContentArea>
      </S.PageContainer>
    );
  }

  if (error) {
    return (
      <S.PageContainer>
        <S.ContentArea>
          <S.ErrorContainer>
            <S.ErrorMessage>{error}</S.ErrorMessage>
            <S.RetryButton onClick={loadData}>다시 시도</S.RetryButton>
          </S.ErrorContainer>
        </S.ContentArea>
      </S.PageContainer>
    );
  }

  return (
    <S.PageContainer>
      <S.ContentArea>

        <S.PageHeader>
          <S.PageTitle>근태 관리</S.PageTitle>
          <S.PageSubtitle>나의 근태 현황을 확인하고 출퇴근 기록을 관리하세요</S.PageSubtitle>
        </S.PageHeader>

        <S.StatsGrid>
          <S.StatCard>
            <S.StatIconWrapper $bgColor="#d1fae5" $iconColor="#10b981">
              <CheckCircle size={28} />
            </S.StatIconWrapper>
            <S.StatValue>{stats?.presentDaysCount || 0}일</S.StatValue>
            <S.StatLabel>이번 달 출근</S.StatLabel>
          </S.StatCard>

          <S.StatCard>
            <S.StatIconWrapper $bgColor="#dbeafe" $iconColor="#3b82f6">
              <Plane size={28} />
            </S.StatIconWrapper>
            <S.StatValue>{stats?.totalWorkHours || 0}h</S.StatValue>
            <S.StatLabel>이번 달 근무시간</S.StatLabel>
          </S.StatCard>

          <S.StatCard>
            <S.StatIconWrapper $bgColor="#fef3c7" $iconColor="#f59e0b">
              <Sun size={28} />
            </S.StatIconWrapper>
            <S.StatValue>{stats?.lateCount || 0}</S.StatValue>
            <S.StatLabel>지각 횟수</S.StatLabel>
          </S.StatCard>

          <S.StatCard>
            <S.StatIconWrapper $bgColor="#fce7f3" $iconColor="#ec4899">
              <CalendarIcon size={28} />
            </S.StatIconWrapper>
            <S.StatValue>{stats?.absentCount || 0}</S.StatValue>
            <S.StatLabel>결근 내역</S.StatLabel>
          </S.StatCard>
        </S.StatsGrid>

        <S.MainContent>
          <S.CalendarSection>
            <S.CalendarHeader>
              <S.MonthTitle>{monthTitle}</S.MonthTitle>
              <S.NavButtons>
                <S.NavButton onClick={handlePrevMonth}>
                  <ChevronLeft size={18} />
                </S.NavButton>
                <S.NavButton onClick={handleNextMonth}>
                  <ChevronRight size={18} />
                </S.NavButton>
              </S.NavButtons>
            </S.CalendarHeader>

            <S.CalendarGrid>
              {daysOfWeek.map((day, index) => (
                <S.DayHeader key={day} $isWeekend={index === 0 || index === 6}>
                  {day}
                </S.DayHeader>
              ))}
              {renderCalendar()}
            </S.CalendarGrid>

            <S.Legend>
              <S.LegendItem>
                <S.LegendDot $color="#10b981" />
                출근
              </S.LegendItem>
              <S.LegendItem>
                <S.LegendDot $color="#f59e0b" />
                지각/조퇴
              </S.LegendItem>
              <S.LegendItem>
                <S.LegendDot $color="#ef4444" />
                결근
              </S.LegendItem>
              <S.LegendItem>
                <S.LegendDot $color="#8b5cf6" />
                반차
              </S.LegendItem>
              <S.LegendItem>
                <S.LegendDot $color="#fbbf24" />
                휴가 대기
              </S.LegendItem>
              <S.LegendItem>
                <S.LegendDot $color="#3b82f6" />
                휴가 승인
              </S.LegendItem>
            </S.Legend>
          </S.CalendarSection>

          <S.Sidebar>
            <S.SidebarCard>
              <S.SidebarTitle>
                {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일
              </S.SidebarTitle>

              {selectedDailyData ? (
                <>
                  <S.ScheduleItem>
                    <S.ScheduleName>근태 정보</S.ScheduleName>
                    <S.ScheduleDate>
                      출근: {formatTime(selectedDailyData.inTime)}
                    </S.ScheduleDate>
                    <S.ScheduleDate>
                      퇴근: {formatTime(selectedDailyData.outTime)}
                    </S.ScheduleDate>
                    <S.ScheduleDate>
                      근무시간: {selectedDailyData.workHours !== null ? `${selectedDailyData.workHours}시간` : '계산 불가'}
                    </S.ScheduleDate>
                    <S.ScheduleStatus $status={selectedDailyData.attendanceStatus}>
                      {getStatusText(selectedDailyData.attendanceStatus)}
                    </S.ScheduleStatus>
                  </S.ScheduleItem>
                </>
              ) : (
                <S.ScheduleItem>
                  <S.ScheduleName>근태 기록 없음</S.ScheduleName>
                  <S.ScheduleDate>
                    {selectedDate.getFullYear()}-{String(selectedDate.getMonth() + 1).padStart(2, '0')}-{String(selectedDate.getDate()).padStart(2, '0')}
                  </S.ScheduleDate>
                  <S.ScheduleDate style={{ color: ({ theme }) => theme?.status?.warning || '#f59e0b', marginTop: '8px' }}>
                    출근 기록이 없는 날입니다. 정정 신청을 통해 근태를 등록할 수 있습니다.
                  </S.ScheduleDate>
                </S.ScheduleItem>
              )}

              <S.ActionButton
                onClick={handleCorrectionModalOpen}
              >
                근태 정정 신청하기
              </S.ActionButton>

              <S.ActionButton
                $primary
                onClick={handleLeaveApply}
                disabled={isWithinThreeDays(selectedDate)}
                title={isWithinThreeDays(selectedDate) ? '휴가는 최소 3일 전에 신청 가능합니다.' : '휴가 신청 페이지로 이동'}
              >
                휴가 신청하기
              </S.ActionButton>
            </S.SidebarCard>
          </S.Sidebar>
        </S.MainContent>
      </S.ContentArea>
    </S.PageContainer>
  );
};

export default EmployeeAttendance;
