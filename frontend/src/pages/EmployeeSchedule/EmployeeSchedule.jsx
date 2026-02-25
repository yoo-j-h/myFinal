import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as S from './EmployeeSchedule.styled';
import { empScheduleService } from '../../api/empSchedule/services';
import useAuthStore from '../../store/authStore';

// scheduleCode 기반 색상 매핑 상수
const SCHEDULE_COLORS = {
  // 운항직 (PILOT, CABIN_CREW)
  FLIGHT: '#3b82f6',   // 파란색 - 비행
  STANDBY: '#f59e0b',  // 주황색 - 대기
  OFF: '#6b7280',      // 회색 - 휴무
  
  // 지상직 (GROUND_STAFF, MAINTENANCE)
  SHIFT_D: '#10b981',  // 초록색 - 1교대
  SHIFT_E: '#f59e0b',  // 주황색 - 2교대
  SHIFT_N: '#6366f1',  // 보라색 - 3교대
};

// scheduleCode 기반 제목 매핑 상수
const SCHEDULE_TITLES = {
  FLIGHT: '비행',
  STANDBY: '대기',
  OFF: '휴무',
  SHIFT_D: '1교대',
  SHIFT_E: '2교대',
  SHIFT_N: '3교대',
};

const EmployeeSchedule = () => {
  const { getRole, getEmpId, emp } = useAuthStore();
  const userRole = getRole();
  const empId = getEmpId();
  const isAdmin = userRole === 'AIRLINE_ADMIN' || userRole === 'SUPER_ADMIN';

  // 공통 상태
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 관리자용 상태
  const [selectedRole, setSelectedRole] = useState(null);
  const [scheduleList, setScheduleList] = useState([]);

  // 직원용 상태 (캘린더)
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarSchedules, setCalendarSchedules] = useState([]);
  const [selectedDaySchedules, setSelectedDaySchedules] = useState([]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const yearMonth = `${year}-${String(month).padStart(2, '0')}`;

  // 역할 옵션
  const roleOptions = [
    { value: null, label: '전체' },
    { value: 'PILOT', label: '기장' },
    { value: 'CABIN_CREW', label: '객실승무원' },
    { value: 'GROUND_STAFF', label: '지상직승무원' },
    { value: 'MAINTENANCE', label: '정비사' },
  ];

  // 관리자용: 일정 목록 조회
  useEffect(() => {
    if (isAdmin) {
      loadAdminSchedules();
    }
  }, [isAdmin, selectedRole]);

  // 직원용: 월별 캘린더 조회 (empId 변경 시 재조회 보장)
  useEffect(() => {
    if (!isAdmin) {
      // 계정 변경 시 캐시 초기화
      setCalendarSchedules([]);
      setSelectedDaySchedules([]);
      loadCalendarSchedules();
    }
  }, [isAdmin, yearMonth, empId]); // empId 의존성 추가

  const loadAdminSchedules = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (selectedRole) {
        params.role = selectedRole;
      }
      const response = await empScheduleService.getEmpSchedules(params);
      const schedules = response.data?.data || response.data || [];
      setScheduleList(schedules);
    } catch (e) {
      console.error('일정 조회 실패:', e);
      setError('일정을 불러오는데 실패했습니다.');
      setScheduleList([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCalendarSchedules = async () => {
    setLoading(true);
    setError(null);
    try {
      // ✅ 반드시 /api/emp-schedules/calendar 엔드포인트만 사용
      const response = await empScheduleService.getEmpSchedulesByMonth(yearMonth);
      const schedules = response.data?.data || response.data || [];
      
      // ✅ 안전장치: 응답 데이터의 empId가 현재 로그인한 empId와 일치하는지 확인
      const currentEmpId = getEmpId();
      const filteredSchedules = schedules.filter(schedule => {
        const scheduleEmpId = schedule.empId || schedule.emp_id;
        if (currentEmpId && scheduleEmpId && scheduleEmpId !== currentEmpId) {
          console.warn('⚠️ 다른 직원의 일정이 포함되어 있습니다. 필터링합니다.', {
            currentEmpId,
            scheduleEmpId,
            scheduleCode: schedule.scheduleCode
          });
          return false;
        }
        return true;
      });
      
      console.log('캘린더 일정 조회 완료:', {
        yearMonth,
        currentEmpId,
        totalSchedules: schedules.length,
        filteredSchedules: filteredSchedules.length,
        role: userRole
      });
      
      setCalendarSchedules(filteredSchedules);
      
      // 선택된 날짜의 일정 필터링
      updateSelectedDaySchedules(filteredSchedules, selectedDate);
    } catch (e) {
      console.error('캘린더 일정 조회 실패:', e);
      setError('일정을 불러오는데 실패했습니다.');
      setCalendarSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  const updateSelectedDaySchedules = (schedules, date) => {
    const daySchedules = schedules.filter(schedule => {
      if (!schedule.startDate) return false;
      const scheduleDate = new Date(schedule.startDate);
      return scheduleDate.getFullYear() === date.getFullYear() &&
             scheduleDate.getMonth() === date.getMonth() &&
             scheduleDate.getDate() === date.getDate();
    });
    setSelectedDaySchedules(daySchedules);
  };

  // 월 변경 핸들러
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
  };

  // 날짜 선택 핸들러
  const handleDateSelect = (day) => {
    const newDate = new Date(year, month - 1, day);
    setSelectedDate(newDate);
    updateSelectedDaySchedules(calendarSchedules, newDate);
  };

  // 일정 수정 핸들러 (관리자용)
  const handleUpdateSchedule = async (empScheduleId, updateData) => {
    try {
      await empScheduleService.updateEmpSchedule(empScheduleId, updateData);
      alert('일정이 수정되었습니다.');
      loadAdminSchedules();
    } catch (e) {
      console.error('일정 수정 실패:', e);
      alert('일정 수정에 실패했습니다.');
    }
  };

  // scheduleCode 기반 색상 매핑
  const getScheduleColor = (scheduleCode) => {
    if (!scheduleCode) return '#3b82f6'; // 기본 색상
    return SCHEDULE_COLORS[scheduleCode] || '#3b82f6';
  };

  // scheduleCode 기반 제목 매핑
  const getScheduleTitle = (scheduleCode) => {
    if (!scheduleCode) return '일정';
    return SCHEDULE_TITLES[scheduleCode] || scheduleCode;
  };

  // 캘린더 렌더링 (직원용)
  const renderCalendar = () => {
    const days = [];
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === month;

    // 첫 날의 요일 (0=일요일)
    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();

    // 이전 달의 빈 칸
    for (let i = 0; i < firstDay; i++) {
      days.push(<S.DayCell key={`empty-${i}`} $isOtherMonth />);
    }

    // 현재 달의 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = isCurrentMonth && day === today.getDate();
      const isSelected = selectedDate.getFullYear() === year &&
                        selectedDate.getMonth() + 1 === month &&
                        selectedDate.getDate() === day;

      // 해당 날짜의 일정 찾기
      const daySchedules = calendarSchedules.filter(schedule => {
        if (!schedule.startDate) return false;
        const scheduleDate = new Date(schedule.startDate);
        return scheduleDate.getFullYear() === year &&
               scheduleDate.getMonth() === month - 1 &&
               scheduleDate.getDate() === day;
      });

      // 일정 타입별 색상 결정 (우선순위: FLIGHT > STANDBY > SHIFT_D > SHIFT_E > SHIFT_N > OFF)
      let dotColor = null;
      if (daySchedules.length > 0) {
        const scheduleCodes = daySchedules.map(s => 
          s.scheduleCode || s.schedule_code || ''
        ).filter(Boolean);
        
        if (scheduleCodes.some(code => code === 'FLIGHT')) {
          dotColor = getScheduleColor('FLIGHT');
        } else if (scheduleCodes.some(code => code === 'STANDBY')) {
          dotColor = getScheduleColor('STANDBY');
        } else if (scheduleCodes.some(code => code === 'SHIFT_D')) {
          dotColor = getScheduleColor('SHIFT_D');
        } else if (scheduleCodes.some(code => code === 'SHIFT_E')) {
          dotColor = getScheduleColor('SHIFT_E');
        } else if (scheduleCodes.some(code => code === 'SHIFT_N')) {
          dotColor = getScheduleColor('SHIFT_N');
        } else if (scheduleCodes.some(code => code === 'OFF')) {
          dotColor = getScheduleColor('OFF');
        } else {
          dotColor = '#3b82f6'; // 기본 색상
        }
      }

      days.push(
        <S.DayCell
          key={day}
          $isToday={isToday}
          $isSelected={isSelected}
          onClick={() => handleDateSelect(day)}
        >
          <S.DayNumber>{day}</S.DayNumber>
          {daySchedules.length > 0 && (
            <S.ScheduleDot $count={daySchedules.length} $color={dotColor} />
          )}
        </S.DayCell>
      );
    }

    return days;
  };

  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  const monthTitle = `${year}년 ${month}월`;

  // 로딩 상태
  if (loading && scheduleList.length === 0 && calendarSchedules.length === 0) {
    return (
      <S.MainContentArea>
        <S.LoadingContainer>데이터를 불러오는 중...</S.LoadingContainer>
      </S.MainContentArea>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <S.MainContentArea>
        <S.ErrorContainer>
          <S.ErrorMessage>{error}</S.ErrorMessage>
          <S.RetryButton onClick={isAdmin ? loadAdminSchedules : loadCalendarSchedules}>
            다시 시도
          </S.RetryButton>
        </S.ErrorContainer>
      </S.MainContentArea>
    );
  }

  // 관리자용 뷰
  if (isAdmin) {
    return (
      <S.MainContentArea>
        <S.PageHeader>
          <div>
            <S.PageTitle>직원 일정 관리</S.PageTitle>
          </div>
        </S.PageHeader>

        {/* 역할 필터 */}
        <S.ControlPanel>
          <S.RoleFilter>
            <S.RoleFilterLabel>역할 필터:</S.RoleFilterLabel>
            {roleOptions.map(option => (
              <S.RoleFilterButton
                key={option.value || 'all'}
                $active={selectedRole === option.value}
                onClick={() => setSelectedRole(option.value)}
              >
                {option.label}
              </S.RoleFilterButton>
            ))}
          </S.RoleFilter>
        </S.ControlPanel>

        {/* 일정 목록 테이블 */}
        <S.ScheduleTableWrapper>
          <S.ScheduleTable>
            <S.TableHeader>
              <tr>
                <S.TableHeaderCell>직원명</S.TableHeaderCell>
                <S.TableHeaderCell>일정 코드</S.TableHeaderCell>
                <S.TableHeaderCell>시작 일시</S.TableHeaderCell>
                <S.TableHeaderCell>종료 일시</S.TableHeaderCell>
                <S.TableHeaderCell>관리</S.TableHeaderCell>
              </tr>
            </S.TableHeader>
            <S.TableBody>
              {scheduleList.length === 0 ? (
                <S.TableRow>
                  <S.TableCell colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>
                    일정이 없습니다.
                  </S.TableCell>
                </S.TableRow>
              ) : (
                scheduleList.map((schedule) => (
                  <S.TableRow key={schedule.empScheduleId}>
                    <S.TableCell>
                      <S.EmpName>{schedule.empName || schedule.empId}</S.EmpName>
                    </S.TableCell>
                    <S.TableCell>
                      <S.ScheduleCode>{schedule.scheduleCode || '-'}</S.ScheduleCode>
                    </S.TableCell>
                    <S.TableCell>
                      {schedule.startDate 
                        ? new Date(schedule.startDate).toLocaleString('ko-KR')
                        : '-'
                      }
                    </S.TableCell>
                    <S.TableCell>
                      {schedule.endDate 
                        ? new Date(schedule.endDate).toLocaleString('ko-KR')
                        : '-'
                      }
                    </S.TableCell>
                    <S.TableCell>
                      <S.ActionButton onClick={() => {
                        // TODO: 수정 모달 구현
                        const newStartDate = prompt('시작 일시를 입력하세요 (YYYY-MM-DD HH:mm):', 
                          schedule.startDate ? new Date(schedule.startDate).toISOString().slice(0, 16) : '');
                        const newEndDate = prompt('종료 일시를 입력하세요 (YYYY-MM-DD HH:mm):',
                          schedule.endDate ? new Date(schedule.endDate).toISOString().slice(0, 16) : '');
                        
                        if (newStartDate && newEndDate) {
                          handleUpdateSchedule(schedule.empScheduleId, {
                            startDate: new Date(newStartDate).toISOString(),
                            endDate: new Date(newEndDate).toISOString(),
                          });
                        }
                      }}>
                        ✏️ 수정
                      </S.ActionButton>
                    </S.TableCell>
                  </S.TableRow>
                ))
              )}
            </S.TableBody>
          </S.ScheduleTable>
        </S.ScheduleTableWrapper>
      </S.MainContentArea>
    );
  }

  // 직원용 캘린더 뷰
  return (
    <S.MainContentArea>
      <S.PageHeader>
        <div>
          <S.PageTitle>나의 일정</S.PageTitle>
        </div>
      </S.PageHeader>

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
            <S.LegendDot $color="#3b82f6" />
            일정 있음
          </S.LegendItem>
        </S.Legend>
      </S.CalendarSection>

      {/* 선택된 날짜의 일정 목록 */}
      <S.ScheduleListSection>
        <S.ScheduleListTitle>
          {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일 일정
        </S.ScheduleListTitle>
        {selectedDaySchedules.length === 0 ? (
          <S.EmptyMessage>이 날짜에는 일정이 없습니다.</S.EmptyMessage>
        ) : (
          <S.ScheduleList>
            {selectedDaySchedules.map((schedule) => {
              const scheduleCode = schedule.scheduleCode || schedule.schedule_code || '';
              const title = schedule.title || getScheduleTitle(scheduleCode);
              
              return (
                <S.ScheduleItem key={schedule.empScheduleId}>
                  <S.ScheduleItemHeader>
                    <S.ScheduleItemTitle>{title}</S.ScheduleItemTitle>
                    <S.ScheduleItemCode>{scheduleCode}</S.ScheduleItemCode>
                  </S.ScheduleItemHeader>
                <S.ScheduleItemTime>
                  {schedule.startDate 
                    ? new Date(schedule.startDate).toLocaleString('ko-KR', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : '-'
                  }
                  {' ~ '}
                  {schedule.endDate 
                    ? new Date(schedule.endDate).toLocaleString('ko-KR', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : '-'
                  }
                </S.ScheduleItemTime>
              </S.ScheduleItem>
              );
            })}
          </S.ScheduleList>
        )}
      </S.ScheduleListSection>
    </S.MainContentArea>
  );
};

export default EmployeeSchedule;