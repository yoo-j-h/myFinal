import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as S from "./FlightSchedule.styled";
import { flightScheduleService } from "../../api/flightSchedule/services";
import { airportService } from "../../api/airport/services";
import { empScheduleService } from "../../api/empSchedule/services";
import useAuthStore from "../../store/authStore";

const FlightSchedule = () => {
  const navigate = useNavigate();
  const { getRole, getEmpId, emp } = useAuthStore();
  const userRole = getRole();
  const empId = getEmpId();
  const isAdmin = userRole === 'AIRLINE_ADMIN' || userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';
  const airlineId = emp?.airlineId;

  // 관리자용 상태
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [departureCity, setDepartureCity] = useState("all");
  const [arrivalCity, setArrivalCity] = useState("all");
  const [flightList, setFlightList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [airports, setAirports] = useState([]);
  const [availableDepartures, setAvailableDepartures] = useState([]);
  const [availableDestinations, setAvailableDestinations] = useState([]);

  // 직원용 상태 (캘린더)
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date());
  const [calendarSchedules, setCalendarSchedules] = useState([]);
  const [selectedDaySchedules, setSelectedDaySchedules] = useState([]);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarError, setCalendarError] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const yearMonth = `${year}-${String(month).padStart(2, '0')}`;

  // 관리자용: 비행편 목록 조회 (날짜 변경 시 자동 검색)
  useEffect(() => {
    if (isAdmin) {
      loadFlightSchedules();
    }
  }, [selectedDate, isAdmin]);

  // 관리자용: 공항 목록 조회 (초기 로드 시)
  useEffect(() => {
    if (isAdmin) {
      loadAirports();
    }
  }, [isAdmin]);

  // 관리자용: 비행편 목록이 변경되면 출발지/도착지 목록 업데이트
  useEffect(() => {
    if (isAdmin) {
      updateAvailableAirports();
    }
  }, [flightList, isAdmin]);

  // 직원용: 월별 캘린더 조회 (empId 변경 시 재조회 보장)
  useEffect(() => {
    if (!isAdmin) {
      // 계정 변경 시 캐시 초기화
      setCalendarSchedules([]);
      setSelectedDaySchedules([]);
      loadCalendarSchedules();
    }
  }, [isAdmin, yearMonth, empId]); // empId 의존성 추가

  // 직원용: 선택된 날짜의 일정 업데이트
  useEffect(() => {
    if (!isAdmin && calendarSchedules.length > 0) {
      updateSelectedDaySchedules(calendarSchedules, selectedCalendarDate);
    }
  }, [calendarSchedules, selectedCalendarDate, isAdmin]);

  // 관리자용: 공항 목록 조회
  const loadAirports = async () => {
    try {
      const response = await airportService.getAirports();
      const airportList = response.data?.data || response.data || [];
      setAirports(airportList);
    } catch (error) {
      console.error('공항 목록 조회 실패:', error);
    }
  };

  // 관리자용: 비행편 목록 조회
  const loadFlightSchedules = async () => {
    try {
      setLoading(true);
      const params = {};

      // 관리자인 경우 항공사 ID 추가
      if (isAdmin && airlineId) {
        params.airlineId = airlineId;
      }

      // 날짜 필터 추가
      if (selectedDate) {
        const startDate = new Date(selectedDate);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(selectedDate);
        endDate.setDate(endDate.getDate() + 1);
        endDate.setHours(0, 0, 0, 0);

        params.startDate = startDate.toISOString();
        params.endDate = endDate.toISOString();
      }

      // 출발지/도착지 필터
      if (departureCity && departureCity !== "all") {
        params.departure = departureCity;
      }
      if (arrivalCity && arrivalCity !== "all") {
        params.destination = arrivalCity;
      }

      const response = await flightScheduleService.getFlightSchedules(params);
      const flights = response.data?.data || response.data || [];
      setFlightList(flights);
    } catch (error) {
      console.error('비행편 목록 조회 실패:', error);
      alert('비행편 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 관리자용: 비행편 목록에서 출발지/도착지 추출
  const updateAvailableAirports = async () => {
    try {
      const airportResponse = await airportService.getAirports();
      const airportList = airportResponse.data?.data || airportResponse.data || [];
      setAirports(airportList);

      const departures = [...new Set(flightList.map(flight => flight.departure).filter(Boolean))];
      const destinations = [...new Set(flightList.map(flight => flight.destination).filter(Boolean))];

      const departureAirports = departures
        .map(code => airportList.find(airport => airport.airportCode === code))
        .filter(Boolean)
        .sort((a, b) => (a.airportName || a.airportCode).localeCompare(b.airportName || b.airportCode));

      const destinationAirports = destinations
        .map(code => airportList.find(airport => airport.airportCode === code))
        .filter(Boolean)
        .sort((a, b) => (a.airportName || a.airportCode).localeCompare(b.airportName || b.airportCode));

      setAvailableDepartures(departureAirports);
      setAvailableDestinations(destinationAirports);
    } catch (error) {
      console.error('공항 정보 업데이트 실패:', error);
    }
  };

  // 직원용: 월별 캘린더 일정 조회
  const loadCalendarSchedules = async () => {
    setCalendarLoading(true);
    setCalendarError(null);
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
      updateSelectedDaySchedules(filteredSchedules, selectedCalendarDate);
    } catch (e) {
      console.error('캘린더 일정 조회 실패:', e);
      setCalendarError('일정을 불러오는데 실패했습니다.');
      setCalendarSchedules([]);
    } finally {
      setCalendarLoading(false);
    }
  };

  // 직원용: 선택된 날짜의 일정 필터링
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

  // 직원용: 월 변경 핸들러
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
  };

  // 직원용: 날짜 선택 핸들러
  const handleDateSelect = (day) => {
    const newDate = new Date(year, month - 1, day);
    setSelectedCalendarDate(newDate);
    updateSelectedDaySchedules(calendarSchedules, newDate);
  };

  // 직원용: 캘린더 렌더링
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
      const isSelected = selectedCalendarDate.getFullYear() === year &&
                        selectedCalendarDate.getMonth() + 1 === month &&
                        selectedCalendarDate.getDate() === day;

      // 해당 날짜의 일정 찾기
      const daySchedules = calendarSchedules.filter(schedule => {
        if (!schedule.startDate) return false;
        const scheduleDate = new Date(schedule.startDate);
        return scheduleDate.getFullYear() === year &&
               scheduleDate.getMonth() === month - 1 &&
               scheduleDate.getDate() === day;
      });

      // 일정 타입별 색상 결정 (scheduleCode 기반)
      let dotColor = null;
      if (daySchedules.length > 0) {
        const scheduleCodes = daySchedules.map(s => 
          s.scheduleCode || s.schedule_code || ''
        ).filter(Boolean);
        
        // 우선순위: FLIGHT > STANDBY > SHIFT_D > SHIFT_E > SHIFT_N > OFF
        if (scheduleCodes.some(code => code === 'FLIGHT')) {
          dotColor = '#3b82f6'; // 파란색 - 비행
        } else if (scheduleCodes.some(code => code === 'STANDBY')) {
          dotColor = '#f59e0b'; // 주황색 - 대기
        } else if (scheduleCodes.some(code => code === 'SHIFT_D')) {
          dotColor = '#10b981'; // 초록색 - 1교대
        } else if (scheduleCodes.some(code => code === 'SHIFT_E')) {
          dotColor = '#f59e0b'; // 주황색 - 2교대
        } else if (scheduleCodes.some(code => code === 'SHIFT_N')) {
          dotColor = '#6366f1'; // 보라색 - 3교대
        } else if (scheduleCodes.some(code => code === 'OFF')) {
          dotColor = '#6b7280'; // 회색 - 휴무
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

  const handleSearch = () => {
    loadFlightSchedules();
  };

  // 날짜 포맷팅
  const formatDate = (dateTimeString) => {
    if (!dateTimeString) return '';
    try {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) return '';
      const days = ['일', '월', '화', '수', '목', '금', '토'];
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const dayName = days[date.getDay()];
      return `${month}월 ${day}일 (${dayName})`;
    } catch (error) {
      console.error('날짜 포맷팅 오류:', error);
      return '';
    }
  };

  // 공항 코드로 공항명 찾기
  const getAirportName = (airportCode) => {
    if (!airportCode) return '';
    const airport = airports.find(a => a.airportCode === airportCode);
    return airport ? (airport.airportName || airport.cityName || airportCode) : airportCode;
  };

  // 비행 상태 한글 변환
  const getStatusText = (status) => {
    const statusMap = {
      'DELAYED': '지연',
      'CANCELLED': '취소',
      'DEPARTED': '출발',
      'ARRIVED': '도착',
      'ASSIGNING': '배정중',
      'ASSIGNED': '배정완료'
    };
    return statusMap[status] || status;
  };

  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  const monthTitle = `${year}년 ${month}월`;

  // 직원용 캘린더 뷰
  if (!isAdmin) {
    return (
      <S.PageContainer>
        {/* Page Header */}
        <S.PageHeader>
          <S.HeaderLeft>
            <S.PageTitle>나의 비행 일정</S.PageTitle>
            <S.PageSubtitle>
              내가 배정된 비행 일정을 확인하고 상세 정보를 조회합니다.
            </S.PageSubtitle>
          </S.HeaderLeft>
        </S.PageHeader>

        {/* Calendar Section */}
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

          {calendarLoading ? (
            <S.LoadingContainer>데이터를 불러오는 중...</S.LoadingContainer>
          ) : calendarError ? (
            <S.ErrorContainer>
              <S.ErrorMessage>{calendarError}</S.ErrorMessage>
              <S.RetryButton onClick={loadCalendarSchedules}>다시 시도</S.RetryButton>
            </S.ErrorContainer>
          ) : (
            <>
              <S.CalendarGrid>
                {daysOfWeek.map((day, index) => (
                  <S.DayHeader key={day} $isWeekend={index === 0 || index === 6}>
                    {day}
                  </S.DayHeader>
                ))}
                {renderCalendar()}
              </S.CalendarGrid>

              <S.Legend>
                {/* scheduleCode 기반 범례 표시 (현재 월에 존재하는 일정 타입만) */}
                {(() => {
                  const scheduleCodesInMonth = new Set(
                    calendarSchedules.map(s => s.scheduleCode || s.schedule_code).filter(Boolean)
                  );
                  const legendItems = [];
                  
                  // 운항직 일정 (FLIGHT, STANDBY, OFF)
                  if (scheduleCodesInMonth.has('FLIGHT')) {
                    legendItems.push({ code: 'FLIGHT', title: '비행', color: '#3b82f6' });
                  }
                  if (scheduleCodesInMonth.has('STANDBY')) {
                    legendItems.push({ code: 'STANDBY', title: '대기', color: '#f59e0b' });
                  }
                  if (scheduleCodesInMonth.has('OFF')) {
                    legendItems.push({ code: 'OFF', title: '휴무', color: '#6b7280' });
                  }
                  
                  // 지상직 일정 (SHIFT_D, SHIFT_E, SHIFT_N)
                  if (scheduleCodesInMonth.has('SHIFT_D')) {
                    legendItems.push({ code: 'SHIFT_D', title: '1교대', color: '#10b981' });
                  }
                  if (scheduleCodesInMonth.has('SHIFT_E')) {
                    legendItems.push({ code: 'SHIFT_E', title: '2교대', color: '#f59e0b' });
                  }
                  if (scheduleCodesInMonth.has('SHIFT_N')) {
                    legendItems.push({ code: 'SHIFT_N', title: '3교대', color: '#6366f1' });
                  }
                  
                  return legendItems.map(item => (
                    <S.LegendItem key={item.code}>
                      <S.LegendDot $color={item.color} />
                      {item.title}
                    </S.LegendItem>
                  ));
                })()}
              </S.Legend>
            </>
          )}
        </S.CalendarSection>

        {/* 선택된 날짜의 일정 목록 */}
        <S.ScheduleListSection>
          <S.ScheduleListTitle>
            {selectedCalendarDate.getFullYear()}년 {selectedCalendarDate.getMonth() + 1}월 {selectedCalendarDate.getDate()}일 일정
          </S.ScheduleListTitle>
          {selectedDaySchedules.length === 0 ? (
            <S.EmptyMessage>이 날짜에는 일정이 없습니다.</S.EmptyMessage>
          ) : (
            <S.ScheduleList>
              {selectedDaySchedules.map((schedule) => {
                const scheduleCode = schedule.scheduleCode || schedule.schedule_code || '';
                // scheduleCode 기반 제목 매핑
                const getScheduleTitle = (code) => {
                  const titleMap = {
                    'FLIGHT': '비행',
                    'STANDBY': '대기',
                    'OFF': '휴무',
                    'SHIFT_D': '1교대',
                    'SHIFT_E': '2교대',
                    'SHIFT_N': '3교대',
                  };
                  return titleMap[code] || schedule.title || code || '일정';
                };
                const title = getScheduleTitle(scheduleCode);
                
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
      </S.PageContainer>
    );
  }

  // 관리자용 비행편 목록 뷰
  return (
    <S.PageContainer>
      {/* Page Header */}
      <S.PageHeader>
        <S.HeaderLeft>
          <S.PageTitle>전체 비행편 및 크루 관리</S.PageTitle>
          <S.PageSubtitle>모든 비행편의 운항 정보와 배정된 크루 현황을 관리합니다.</S.PageSubtitle>
        </S.HeaderLeft>
      </S.PageHeader>

      {/* Search Filter Section */}
      <S.FilterSection>
        <S.FilterGroup>
          <S.FilterLabel>날짜 선택</S.FilterLabel>
          <S.DateInput
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
          />
        </S.FilterGroup>

        <S.FilterGroup>
          <S.FilterLabel>출발지</S.FilterLabel>
          <S.CitySelect
            value={departureCity}
            onChange={(e) => setDepartureCity(e.target.value)}
          >
            <option value="all">전체</option>
            {availableDepartures.map((airport) => (
              <option key={airport.airportCode} value={airport.airportCode}>
                {airport.airportCode} - {airport.airportName || airport.cityName || airport.airportCode}
              </option>
            ))}
          </S.CitySelect>
        </S.FilterGroup>

        <S.FilterGroup>
          <S.FilterLabel>도착지</S.FilterLabel>
          <S.CitySelect
            value={arrivalCity}
            onChange={(e) => setArrivalCity(e.target.value)}
          >
            <option value="all">전체</option>
            {availableDestinations.map((airport) => (
              <option key={airport.airportCode} value={airport.airportCode}>
                {airport.airportCode} - {airport.airportName || airport.cityName || airport.airportCode}
              </option>
            ))}
          </S.CitySelect>
        </S.FilterGroup>

        <S.SearchButton type="button" onClick={handleSearch}>검색</S.SearchButton>
      </S.FilterSection>

      {/* Flight List */}
      <S.FlightListContainer>
        {loading ? (
          <S.MessageContainer>
            로딩 중...
          </S.MessageContainer>
        ) : flightList.length > 0 ? (
          flightList.map((flight) => {
            const flyScheduleId = flight.flyScheduleId || flight.fly_schedule_id;
            const airlineName = flight.airlineName || flight.airline_name;

            if (!flyScheduleId) {
              console.warn('비행편에 flyScheduleId가 없습니다:', flight);
            }

            return (
              <S.FlightCard
                key={flyScheduleId}
                onClick={() => {
                  console.log('비행편 클릭 - flyScheduleId:', flyScheduleId);
                  if (flyScheduleId) {
                    navigate(`/flightschedule/${flyScheduleId}`);
                  }
                }}
              >
                <S.CardHeader>
                  <S.FlightBadge>
                    <S.AirlineIcon>✈</S.AirlineIcon>
                    <div>
                      <S.FlightNumber>
                        {flight.flightNumber || flight.flight_number}
                      </S.FlightNumber>
                      <S.FlightDate>
                        {formatDate(flight.flyStartTime || flight.fly_start_time)} • {airlineName && airlineName !== '.' ? airlineName : '항공사'}
                      </S.FlightDate>
                    </div>
                  </S.FlightBadge>

                  <S.StatusBadgeGroup>
                    <S.StatusBadge $status="normal">
                      운항 {getStatusText(flight.flightStatus || flight.flight_status)}
                    </S.StatusBadge>
                    {(flight.crewAssigned || flight.crew_assigned) && (
                      <S.StatusBadge $status="assigned">
                        승무원 배정
                      </S.StatusBadge>
                    )}
                  </S.StatusBadgeGroup>
                </S.CardHeader>

                <S.FlightRoute>
                  <S.RoutePoint>
                    <S.RouteTime>{flight.departureTime || flight.departure_time || ''}</S.RouteTime>
                    <S.RouteCode>{flight.departure}</S.RouteCode>
                    <S.RouteAirport>{getAirportName(flight.departure)}</S.RouteAirport>
                  </S.RoutePoint>

                  <S.RouteIndicator>
                    <S.AirplaneIcon>✈</S.AirplaneIcon>
                    <S.RouteLine />
                    <S.RouteDuration>{flight.duration || ''}</S.RouteDuration>
                  </S.RouteIndicator>

                  <S.RoutePoint>
                    <S.RouteTime>{flight.arrivalTime || flight.arrival_time || ''}</S.RouteTime>
                    <S.RouteCode>{flight.destination}</S.RouteCode>
                    <S.RouteAirport>{getAirportName(flight.destination)}</S.RouteAirport>
                  </S.RoutePoint>
                </S.FlightRoute>
              </S.FlightCard>
            );
          })
        ) : (
          <S.MessageContainer>
            배정된 비행 일정이 없거나 조회 결과가 없습니다.
          </S.MessageContainer>
        )}
      </S.FlightListContainer>
    </S.PageContainer>
  );
};

export default FlightSchedule;
