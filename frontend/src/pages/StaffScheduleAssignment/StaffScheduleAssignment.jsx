import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  MainContentArea,
  PageHeader,
  PageTitle,
  StatsCardGrid,
  StatCard,
  StatLabel,
  StatValue,
  StatUnit,
  ControlPanel,
  MonthNavigator,
  NavButton,
  CurrentMonth,
  RefreshButton,
  FilterTabs,
  FilterTab,
  TabLabel,
  TabBadge,
  ScheduleTableWrapper,
  ScheduleTable,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  EmpName,
  ScheduleCode,
  ActionButton,
  LoadingContainer,
  ErrorContainer,
  ErrorMessage,
  RetryButton,
  Pagination,
  PaginationButton,
  PageNumber,
} from './StaffScheduleAssignment.styled';
import { empScheduleService } from '../../api/empSchedule/services';
import { empService } from '../../api/emp/services';
import useAuthStore from '../../store/authStore';

const StaffScheduleAssignment = () => {
  const { getRole, emp } = useAuthStore();
  const userRole = getRole();
  const isAdmin = userRole === 'AIRLINE_ADMIN' || userRole === 'SUPER_ADMIN';
  const airlineId = emp?.airlineId;

  // 일정 조회 관련 상태
  const [scheduleList, setScheduleList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null); // null = 전체
  const [roleCounts, setRoleCounts] = useState({}); // 역할별 카운트
  const [generating, setGenerating] = useState(false); // 일정 배정 중 상태
  const [flightCount, setFlightCount] = useState(0); // 항공편 수
  
  // 페이징 관련 상태 (UI는 1-based, API는 0-based)
  const [currentPage, setCurrentPage] = useState(1); // UI는 1부터 시작
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 15; // 페이지당 항목 수
  const pagesPerGroup = 10; // 한 번에 표시할 페이지 번호 개수

  // UI 상태
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentMonth = `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`;

  // 역할 옵션
  const roleOptions = [
    { value: null, label: '전체' },
    { value: 'PILOT', label: '기장' },
    { value: 'CABIN_CREW', label: '객실승무원' },
    { value: 'GROUND_STAFF', label: '지상직승무원' },
    { value: 'MAINTENANCE', label: '정비사' },
  ];

  // 역할별 직원 수 조회 함수
  const loadRoleCounts = async () => {
    try {
      const counts = {};
      for (const roleOption of roleOptions) {
        if (roleOption.value) {
          // 역할별 직원 수 조회
          const params = { role: roleOption.value };
          if (airlineId) {
            params.airlineId = airlineId;
          }
          const response = await empService.getEmployees(params);
          const employees = response.data?.data || [];
          
          // 중복 제거 (empId 기준) - null/undefined 제외
          const uniqueEmpIds = new Set();
          employees.forEach(emp => {
            const empId = emp.empId || emp.emp_id;
            if (empId) {
              uniqueEmpIds.add(empId);
            }
          });
          
          // 직원 ID가 같으면 1명으로 카운트
          counts[roleOption.value] = uniqueEmpIds.size;
        }
        // '전체'는 항공편 수로 설정 (loadFlightCount에서 설정됨)
      }
      setRoleCounts(counts);
    } catch (e) {
      console.error('역할별 직원 수 조회 실패:', e);
    }
  };

  // 항공편 수 조회 함수
  const loadFlightCount = async () => {
    try {
      const yearMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      const response = await empScheduleService.getFlightCount(yearMonth);
      const count = response.data?.data || 0;
      setFlightCount(count);
    } catch (e) {
      console.error('항공편 수 조회 실패:', e);
      setFlightCount(0);
    }
  };

  // 일정 조회 함수 (페이징 지원, UI는 1-based, API는 0-based)
  const loadSchedules = async (uiPage = 1) => {
    setLoading(true);
    setError(null);
    try {
      // UI 페이지(1-based)를 API 페이지(0-based)로 변환
      const backendPage = uiPage - 1;
      
      const params = {
        page: backendPage,
        size: pageSize
      };
      if (selectedRole) {
        params.role = selectedRole;
      }
      console.log('일정 조회 요청 - params:', params);
      const response = await empScheduleService.getEmpSchedules(params);
      console.log('일정 조회 응답:', response);
      
      // 백엔드가 Page 객체를 반환하는 경우
      if (response.data?.content !== undefined) {
        const { content, totalPages } = response.data;
        setScheduleList(content || []);
        setTotalPages(totalPages || 1);
      } else {
        // 백엔드가 배열을 반환하는 경우 (클라이언트 사이드 페이징)
        const allSchedules = response.data?.data || response.data || [];
        const startIndex = backendPage * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedSchedules = allSchedules.slice(startIndex, endIndex);
        const calculatedTotalPages = Math.max(1, Math.ceil(allSchedules.length / pageSize));
        
        setScheduleList(paginatedSchedules);
        setTotalPages(calculatedTotalPages);
      }
      
      console.log('일정 목록:', scheduleList);
      console.log('일정 수:', scheduleList.length);
    } catch (e) {
      console.error('일정 조회 실패:', e);
      console.error('에러 상세:', e.response?.data || e.message);
      setError('일정을 불러오는데 실패했습니다: ' + (e.response?.data?.message || e.message));
      setScheduleList([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드 및 역할 변경 시 일정 조회 및 카운트 갱신
  useEffect(() => {
    if (isAdmin) {
      setCurrentPage(1); // 필터 변경 시 첫 페이지로 리셋 (UI는 1-based)
      loadRoleCounts(); // 역할별 카운트 먼저 로드
      loadFlightCount(); // 항공편 수 조회
    }
  }, [isAdmin, selectedRole, currentDate]);
  
  // 페이지 변경 시 일정 조회 (필터 변경 시에도 currentPage가 1로 리셋되므로 여기서 처리)
  useEffect(() => {
    if (isAdmin) {
      loadSchedules(currentPage);
    }
  }, [currentPage, isAdmin, selectedRole]);

  // 통계 계산
  const stats = [
    { label: '전체 일정', value: flightCount || 0, unit: '건', color: '#e0e7ff' },
    { label: '배정 완료', value: scheduleList.filter(s => s.scheduleCode).length, unit: '건', color: '#d1fae5' },
    { label: '수정 필요', value: scheduleList.filter(s => !s.scheduleCode).length, unit: '건', color: '#fef3c7' },
    { label: '총 직원', value: new Set(scheduleList.map(s => s.empId)).size, unit: '명', color: '#e5e7eb' },
  ];

  // 월 변경 핸들러
  const handleMonthChange = (direction) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  // 새로고침 핸들러
  const handleRefresh = () => {
    setCurrentPage(1); // 첫 페이지로 리셋 (UI는 1-based)
    loadRoleCounts();
    loadSchedules(1);
    loadFlightCount();
  };

  // 일정 배정 핸들러
  const handleGenerateSchedules = async () => {
    if (generating) return; // 이미 실행 중이면 무시
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const yearMonth = `${year}-${String(month).padStart(2, '0')}`;
    
    // 확인 다이얼로그
    const confirmMessage = `${year}년 ${month}월 일정을 자동 배정하시겠습니까?\n기존 일정이 있다면 수정됩니다.`;
    if (!window.confirm(confirmMessage)) {
      return;
    }
    
    setGenerating(true);
    setError(null);
    
    try {
      const response = await empScheduleService.generateMonthlySchedules(yearMonth, airlineId);
      const count = response.data?.data || 0;
      
      alert(`일정 배정이 완료되었습니다.\n총 ${count}건의 일정이 생성/수정되었습니다.`);
      
      // 일정 목록 새로고침
      setCurrentPage(1); // 첫 페이지로 리셋 (UI는 1-based)
      await loadRoleCounts();
      await loadSchedules(1);
    } catch (e) {
      console.error('일정 배정 실패:', e);
      const errorMessage = e.response?.data?.message || e.message || '일정 배정에 실패했습니다.';
      alert('일정 배정 실패: ' + errorMessage);
      setError(errorMessage);
    } finally {
      setGenerating(false);
    }
  };

  // 일정 수정 핸들러
  const handleEdit = async (empScheduleId, currentSchedule) => {
    const newScheduleCode = prompt(`일정 코드 수정 (${currentSchedule.scheduleCode || '없음'}):`, currentSchedule.scheduleCode || '');
    if (newScheduleCode === null) return; // 취소 시

    const newStartDateStr = prompt(`시작 날짜 수정 (YYYY-MM-DD HH:mm, 현재: ${currentSchedule.startDate ? new Date(currentSchedule.startDate).toLocaleString('ko-KR') : '없음'}):`, 
      currentSchedule.startDate ? new Date(currentSchedule.startDate).toISOString().slice(0, 16) : '');
    if (newStartDateStr === null) return;

    const newEndDateStr = prompt(`종료 날짜 수정 (YYYY-MM-DD HH:mm, 현재: ${currentSchedule.endDate ? new Date(currentSchedule.endDate).toLocaleString('ko-KR') : '없음'}):`,
      currentSchedule.endDate ? new Date(currentSchedule.endDate).toISOString().slice(0, 16) : '');
    if (newEndDateStr === null) return;

    try {
      const newStartDate = new Date(newStartDateStr);
      const newEndDate = new Date(newEndDateStr);

      if (isNaN(newStartDate.getTime()) || isNaN(newEndDate.getTime())) {
        alert('유효하지 않은 날짜 형식입니다. YYYY-MM-DD HH:mm 형식으로 입력해주세요.');
        return;
      }

      await empScheduleService.updateEmpSchedule(empScheduleId, {
        scheduleCode: newScheduleCode,
        startDate: newStartDate.toISOString(),
        endDate: newEndDate.toISOString(),
      });
      alert('일정이 성공적으로 수정되었습니다.');
      loadRoleCounts(); // 카운트 새로고침
      loadSchedules(currentPage); // 현재 페이지 목록 새로고침
    } catch (e) {
      console.error('일정 수정 실패:', e);
      alert('일정 수정에 실패했습니다: ' + (e.response?.data?.message || e.message));
    }
  };

  // 일정 코드 한글 변환
  const getScheduleCodeText = (code) => {
    const codeMap = {
      'FLIGHT': '비행',
      'STANDBY': '대기',
      'OFF': '휴무',
      'COUNSEL': '상담',
      'EXERCISE': '운동',
      'REST': '휴식',
      'SHIFT_D': '주간근무',
      'SHIFT_E': '오후근무',
      'SHIFT_N': '야간근무',
    };
    return codeMap[code] || code || '-';
  };

  if (!isAdmin) {
    return (
      <MainContentArea>
        <ErrorContainer>
          <ErrorMessage>관리자만 접근할 수 있는 페이지입니다.</ErrorMessage>
        </ErrorContainer>
      </MainContentArea>
    );
  }

  return (
    <MainContentArea>
      {/* Page Header */}
      <PageHeader>
        <div>
          <PageTitle>직원 일정 배정 및 관리</PageTitle>
        </div>
      </PageHeader>

      {/* Statistics Cards */}
      <StatsCardGrid>
        {stats.map((stat, index) => (
          <StatCard key={index} $color={stat.color}>
            <StatLabel>{stat.label}</StatLabel>
            <div>
              <StatValue>{stat.value}</StatValue>
              <StatUnit>{stat.unit}</StatUnit>
            </div>
          </StatCard>
        ))}
      </StatsCardGrid>

      {/* Control Panel */}
      <ControlPanel>
        <MonthNavigator>
          <NavButton onClick={() => handleMonthChange('prev')}>
            <ChevronLeft size={18} />
          </NavButton>
          <CurrentMonth>{currentMonth}</CurrentMonth>
          <NavButton onClick={() => handleMonthChange('next')}>
            <ChevronRight size={18} />
          </NavButton>
        </MonthNavigator>

        <RefreshButton 
          onClick={handleGenerateSchedules}
          disabled={generating}
        >
          {generating ? '⏳ 배정 중...' : '📅 일정배정'}
        </RefreshButton>
      </ControlPanel>

      {/* 역할 필터 탭 */}
      <FilterTabs>
        {roleOptions.map((role) => {
          // 전체는 항공편 수, 역할별은 직원 수
          const count = role.value ? (roleCounts[role.value] || 0) : (flightCount || 0);
          const unit = role.value ? '명' : '건';
          
          return (
            <FilterTab
              key={role.value || 'all'}
              $active={selectedRole === role.value}
              onClick={() => {
                setSelectedRole(role.value);
                setCurrentPage(1); // 필터 변경 시 첫 페이지로 리셋 (UI는 1-based)
              }}
            >
              <TabLabel>{role.label}</TabLabel>
              <TabBadge $active={selectedRole === role.value}>
                ({count}{unit})
              </TabBadge>
            </FilterTab>
          );
        })}
      </FilterTabs>

      {/* Schedule Table */}
      <ScheduleTableWrapper>
        {loading && scheduleList.length === 0 ? (
          <LoadingContainer>데이터를 불러오는 중...</LoadingContainer>
        ) : error ? (
          <ErrorContainer>
            <ErrorMessage>{error}</ErrorMessage>
            <RetryButton onClick={handleRefresh}>다시 시도</RetryButton>
          </ErrorContainer>
        ) : (
          <ScheduleTable>
            <TableHeader>
              <tr>
                <TableHeaderCell>직원 ID</TableHeaderCell>
                <TableHeaderCell>직원 이름</TableHeaderCell>
                <TableHeaderCell>일정 코드</TableHeaderCell>
                <TableHeaderCell>시작 일시</TableHeaderCell>
                <TableHeaderCell>종료 일시</TableHeaderCell>
                <TableHeaderCell>관리</TableHeaderCell>
              </tr>
            </TableHeader>
            <TableBody>
              {scheduleList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                    조회된 일정이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                scheduleList.map((schedule) => (
                  <TableRow key={schedule.empScheduleId}>
                    <TableCell>{schedule.empId}</TableCell>
                    <TableCell>
                      <EmpName>{schedule.empName || '-'}</EmpName>
                    </TableCell>
                    <TableCell>
                      <ScheduleCode>{getScheduleCodeText(schedule.scheduleCode)}</ScheduleCode>
                    </TableCell>
                    <TableCell>
                      {schedule.startDate 
                        ? new Date(schedule.startDate).toLocaleString('ko-KR')
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      {schedule.endDate 
                        ? new Date(schedule.endDate).toLocaleString('ko-KR')
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      <ActionButton onClick={() => handleEdit(schedule.empScheduleId, schedule)}>
                        ✏️ 수정
                      </ActionButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </ScheduleTable>
        )}
      </ScheduleTableWrapper>
      
      {/* 페이징 UI (페이지 그룹 단위, 최대 10개씩 표시) */}
      {!loading && scheduleList.length > 0 && totalPages > 1 && (() => {
        // 페이지 그룹 계산 (UI는 1-based)
        const currentGroup = Math.floor((currentPage - 1) / pagesPerGroup);
        const startPage = currentGroup * pagesPerGroup + 1;
        const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);
        
        // 표시할 페이지 번호 배열 생성
        const pageNumbers = [];
        for (let p = startPage; p <= endPage; p++) {
          pageNumbers.push(p);
        }
        
        return (
          <Pagination>
            <PaginationButton
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              ‹
            </PaginationButton>

            {pageNumbers.map((pageNum) => (
              <PageNumber
                key={pageNum}
                $active={currentPage === pageNum}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </PageNumber>
            ))}

            <PaginationButton
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage >= totalPages}
            >
              ›
            </PaginationButton>
          </Pagination>
        );
      })()}
    </MainContentArea>
  );
};

export default StaffScheduleAssignment;
