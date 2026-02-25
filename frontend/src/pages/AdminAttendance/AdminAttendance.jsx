import React, { useState, useEffect } from 'react';
import { Users, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { attendanceService } from '../../api/attendance/services';
import * as S from './AdminAttendance.styled';

const AdminAttendance = () => {
  // 탭 상태: 'dashboard' | 'realtime' | 'abnormal'
  const [activeTab, setActiveTab] = useState('dashboard');

  // 탭 1: 대시보드 데이터
  const [stats, setStats] = useState([]);
  const [yesterdayList, setYesterdayList] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [departmentStatus, setDepartmentStatus] = useState([]);

  // 탭 2: 직원별 실시간 현황 데이터
  const [employeeStatusList, setEmployeeStatusList] = useState([]);

  // 탭 3: 근태 특이사항 기록 데이터
  const [abnormalList, setAbnormalList] = useState([]);

  // 로딩 및 에러 상태
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 날짜 범위 필터 (탭 3용)
  const [dateRange, setDateRange] = useState({
    startDate: getDefaultStartDate(),
    endDate: getDefaultEndDate()
  });

  // 기본 날짜 범위 설정 (최근 30일)
  function getDefaultStartDate() {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  }

  function getDefaultEndDate() {
    return new Date().toISOString().split('T')[0];
  }

  // 탭 1: 대시보드 데이터 조회
  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardData();
    }
  }, [activeTab]);

  // 탭 2: 직원별 실시간 현황 조회
  useEffect(() => {
    if (activeTab === 'realtime') {
      fetchEmployeeStatus();
    }
  }, [activeTab]);

  // 탭 3: 근태 특이사항 조회
  useEffect(() => {
    if (activeTab === 'abnormal') {
      fetchAbnormalAttendance();
    }
  }, [activeTab, dateRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await attendanceService.getAdminDashboard();
      console.log('Dashboard API Response:', response);

      // 통계 데이터 변환
      const { summary } = response.data;
      setStats([
        {
          label: '전체 직원',
          value: summary.totalEmployees || 0,
          icon: Users,
          color: '#e0e7ff',
          textColor: '#4f46e5'
        },
        {
          label: '출근',
          value: summary.presentCount || 0,
          icon: CheckCircle,
          color: '#d1fae5',
          textColor: '#059669'
        },
        {
          label: '지각',
          value: summary.lateCount || 0,
          icon: Clock,
          color: '#fef3c7',
          textColor: '#d97706'
        },
        {
          label: '결근',
          value: summary.absentCount || 0,
          icon: AlertCircle,
          color: '#fee2e2',
          textColor: '#dc2626'
        },
      ]);

      // 어제 리스트 데이터
      setYesterdayList(response.data.yesterdayList || []);

      // 휴가 승인 대기 목록
      setPendingLeaves(response.data.pendingLeaves || []);

      // 부서별 현황
      setDepartmentStatus(response.data.departmentStatus || []);

    } catch (err) {
      console.error('Dashboard API Error:', err);
      setError(err.response?.data?.message || '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await attendanceService.getEmployeeStatus();
      console.log('Employee Status Response:', response);
      setEmployeeStatusList(response.data || []);
    } catch (err) {
      console.error('Employee Status Error:', err);
      setError(err.response?.data?.message || '직원 현황을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAbnormalAttendance = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await attendanceService.getAbnormalAttendance(
        dateRange.startDate,
        dateRange.endDate
      );
      console.log('Abnormal Attendance Response:', response);
      setAbnormalList(response.data || []);
    } catch (err) {
      console.error('Abnormal Attendance Error:', err);
      setError(err.response?.data?.message || '특이사항을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 탭 전환 핸들러
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError(null);
  };

  return (
    <S.Container>
      {/* 헤더 */}
      <S.Header>
        <S.Title>근태관리 시스템</S.Title>
      </S.Header>

      {/* 3단 탭 버튼 (상단) */}
      <S.MainTabContainer>
        <S.MainTab
          $active={activeTab === 'dashboard'}
          onClick={() => handleTabChange('dashboard')}
        >
          <S.TabIcon>📊</S.TabIcon>
          <S.TabText>대시보드</S.TabText>
        </S.MainTab>
        <S.MainTab
          $active={activeTab === 'realtime'}
          onClick={() => handleTabChange('realtime')}
        >
          <S.TabIcon>👥</S.TabIcon>
          <S.TabText>직원별 실시간 현황</S.TabText>
        </S.MainTab>
        <S.MainTab
          $active={activeTab === 'abnormal'}
          onClick={() => handleTabChange('abnormal')}
        >
          <S.TabIcon>⚠️</S.TabIcon>
          <S.TabText>근태 특이사항 기록</S.TabText>
        </S.MainTab>
      </S.MainTabContainer>

      {/* 탭 1: 대시보드 */}
      {activeTab === 'dashboard' && (
        <S.TabContent>
          {loading ? (
            <S.LoadingContainer>
              <S.LoadingSpinner />
              <S.LoadingText>데이터를 불러오는 중...</S.LoadingText>
            </S.LoadingContainer>
          ) : error ? (
            <S.ErrorContainer>
              <AlertCircle size={48} color="#dc2626" />
              <S.ErrorText>{error}</S.ErrorText>
              <S.RetryButton onClick={fetchDashboardData}>
                다시 시도
              </S.RetryButton>
            </S.ErrorContainer>
          ) : (
            <>
              {/* 상단 통계 카드 */}
              <S.StatsGrid>
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <S.StatCard key={index} $color={stat.color}>
                      <S.StatIcon $color={stat.textColor}>
                        <IconComponent size={24} />
                      </S.StatIcon>
                      <S.StatInfo>
                        <S.StatLabel>{stat.label}</S.StatLabel>
                        <S.StatValue $color={stat.textColor}>{stat.value}</S.StatValue>
                      </S.StatInfo>
                    </S.StatCard>
                  );
                })}
              </S.StatsGrid>

              {/* 메인 레이아웃 (좌측: 휴가 승인 대기 목록, 우측: 부서별 현황) */}
              <S.ContentGrid>
                {/* 좌측: 휴가 승인 대기 목록 */}
                <S.LeftPanel>
                  <S.SectionHeader>
                    <S.SectionTitle>
                      <S.SectionIcon>📝</S.SectionIcon>
                      휴가 승인 대기 목록
                    </S.SectionTitle>
                  </S.SectionHeader>

                  {pendingLeaves.length === 0 ? (
                    <S.EmptyMessage>승인 대기 중인 휴가 신청이 없습니다.</S.EmptyMessage>
                  ) : (
                    <S.LeaveTable>
                      <S.TableHeader>
                        <S.TableRow>
                          <S.TableHeaderCell width="15%">신청자</S.TableHeaderCell>
                          <S.TableHeaderCell width="15%">부서</S.TableHeaderCell>
                          <S.TableHeaderCell width="12%">휴가 종류</S.TableHeaderCell>
                          <S.TableHeaderCell width="18%">기간</S.TableHeaderCell>
                          <S.TableHeaderCell width="10%">일수</S.TableHeaderCell>
                          <S.TableHeaderCell width="12%">신청일</S.TableHeaderCell>
                          <S.TableHeaderCell width="18%">액션</S.TableHeaderCell>
                        </S.TableRow>
                      </S.TableHeader>
                      <S.TableBody>
                        {pendingLeaves.map((leave) => (
                          <S.TableRow key={leave.leaveId}>
                            <S.TableCell>
                              <strong>{leave.empName}</strong>
                            </S.TableCell>
                            <S.TableCell>{leave.departmentName}</S.TableCell>
                            <S.TableCell>
                              <S.LeaveTypeBadge $type={leave.leaveType}>
                                {getLeaveTypeLabel(leave.leaveType)}
                              </S.LeaveTypeBadge>
                            </S.TableCell>
                            <S.TableCell>
                              {leave.startDate} ~ {leave.endDate}
                            </S.TableCell>
                            <S.TableCell>{leave.leaveDays}일</S.TableCell>
                            <S.TableCell>{leave.requestDate}</S.TableCell>
                            <S.TableCell>
                              <S.ActionButtonGroup>
                                <S.ActionButton $type="approve">승인</S.ActionButton>
                                <S.ActionButton $type="reject">반려</S.ActionButton>
                              </S.ActionButtonGroup>
                            </S.TableCell>
                          </S.TableRow>
                        ))}
                      </S.TableBody>
                    </S.LeaveTable>
                  )}
                </S.LeftPanel>

                {/* 우측: 부서별 근태 현황 */}
                <S.RightPanel>
                  <S.SectionHeader>
                    <S.SectionTitle>
                      <S.SectionIcon>📊</S.SectionIcon>
                      부서별 근태 현황
                    </S.SectionTitle>
                  </S.SectionHeader>

                  {departmentStatus.length === 0 ? (
                    <S.EmptyMessage>부서별 현황 데이터가 없습니다.</S.EmptyMessage>
                  ) : (
                    <S.DepartmentCards>
                      {departmentStatus.map((dept) => (
                        <S.DepartmentCard key={dept.departmentName}>
                          <S.DepartmentCardHeader>
                            <S.DepartmentName>{dept.departmentName}</S.DepartmentName>
                            <S.DepartmentTotal>총 {dept.totalEmployees}명</S.DepartmentTotal>
                          </S.DepartmentCardHeader>
                          <S.DepartmentCardBody>
                            <S.DepartmentStatRow>
                              <S.DepartmentStatLabel>
                                <S.StatDot $color="#059669" />
                                근무중
                              </S.DepartmentStatLabel>
                              <S.DepartmentStatValue>{dept.presentCount}명</S.DepartmentStatValue>
                            </S.DepartmentStatRow>
                            <S.DepartmentStatRow>
                              <S.DepartmentStatLabel>
                                <S.StatDot $color="#2563eb" />
                                휴가
                              </S.DepartmentStatLabel>
                              <S.DepartmentStatValue>{dept.leaveCount}명</S.DepartmentStatValue>
                            </S.DepartmentStatRow>
                            <S.DepartmentStatRow>
                              <S.DepartmentStatLabel>
                                <S.StatDot $color="#d97706" />
                                지각
                              </S.DepartmentStatLabel>
                              <S.DepartmentStatValue>{dept.lateCount}명</S.DepartmentStatValue>
                            </S.DepartmentStatRow>
                            <S.DepartmentStatRow>
                              <S.DepartmentStatLabel>
                                <S.StatDot $color="#dc2626" />
                                결근
                              </S.DepartmentStatLabel>
                              <S.DepartmentStatValue>{dept.absentCount}명</S.DepartmentStatValue>
                            </S.DepartmentStatRow>
                          </S.DepartmentCardBody>
                        </S.DepartmentCard>
                      ))}
                    </S.DepartmentCards>
                  )}
                </S.RightPanel>
              </S.ContentGrid>
            </>
          )}
        </S.TabContent>
      )}

      {/* 탭 2: 직원별 실시간 현황 */}
      {activeTab === 'realtime' && (
        <S.TabContent>
          <S.TabHeader>
            <S.TabTitle>
              <S.SectionIcon>👥</S.SectionIcon>
              오늘 직원 근무 현황
            </S.TabTitle>
            <S.RefreshButton onClick={fetchEmployeeStatus}>
              🔄 새로고침
            </S.RefreshButton>
          </S.TabHeader>

          {loading ? (
            <S.LoadingContainer>
              <S.LoadingSpinner />
              <S.LoadingText>데이터를 불러오는 중...</S.LoadingText>
            </S.LoadingContainer>
          ) : error ? (
            <S.ErrorContainer>
              <AlertCircle size={48} color="#dc2626" />
              <S.ErrorText>{error}</S.ErrorText>
              <S.RetryButton onClick={fetchEmployeeStatus}>
                다시 시도
              </S.RetryButton>
            </S.ErrorContainer>
          ) : (
            <S.EmployeeGrid>
              {employeeStatusList.length === 0 ? (
                <S.EmptyMessage>오늘 근태 기록이 없습니다.</S.EmptyMessage>
              ) : (
                employeeStatusList.map((employee) => (
                  <S.EmployeeCard key={employee.empId}>
                    <S.EmployeeCardHeader>
                      <S.EmployeeName>{employee.empName}</S.EmployeeName>
                      <S.StatusBadge $status={employee.currentStatus}>
                        {getStatusLabel(employee.currentStatus)}
                      </S.StatusBadge>
                    </S.EmployeeCardHeader>
                    <S.EmployeeInfo>
                      <S.EmployeeDepartment>
                        {employee.departmentName} · {employee.job}
                      </S.EmployeeDepartment>
                      <S.EmployeeTime>
                        {employee.todayInTime ? `출근: ${employee.todayInTime}` : '출근 기록 없음'}
                        {employee.todayOutTime && ` | 퇴근: ${employee.todayOutTime}`}
                      </S.EmployeeTime>
                    </S.EmployeeInfo>
                  </S.EmployeeCard>
                ))
              )}
            </S.EmployeeGrid>
          )}
        </S.TabContent>
      )}

      {/* 탭 3: 근태 특이사항 기록 */}
      {activeTab === 'abnormal' && (
        <S.TabContent>
          <S.TabHeader>
            <S.TabTitle>
              <S.SectionIcon>⚠️</S.SectionIcon>
              근태 특이사항 기록 (정상 출근 제외)
            </S.TabTitle>
            <S.FilterContainer>
              <S.DateRangeInput
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              />
              <span style={{ margin: '0 8px', color: '#6b7280' }}>~</span>
              <S.DateRangeInput
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              />
            </S.FilterContainer>
          </S.TabHeader>

          <S.InfoBanner>
            <AlertCircle size={16} />
            <span>지각, 결근, 조퇴, 휴가 등 특이사항이 있는 기록만 표시됩니다.</span>
          </S.InfoBanner>

          {loading ? (
            <S.LoadingContainer>
              <S.LoadingSpinner />
              <S.LoadingText>데이터를 불러오는 중...</S.LoadingText>
            </S.LoadingContainer>
          ) : error ? (
            <S.ErrorContainer>
              <AlertCircle size={48} color="#dc2626" />
              <S.ErrorText>{error}</S.ErrorText>
              <S.RetryButton onClick={fetchAbnormalAttendance}>
                다시 시도
              </S.RetryButton>
            </S.ErrorContainer>
          ) : (
            <>
              <S.ResultCount>
                총 <strong>{abnormalList.length}건</strong>의 특이사항이 있습니다.
              </S.ResultCount>

              <S.AbnormalTable>
                <S.TableHeader>
                  <S.TableRow>
                    <S.TableHeaderCell width="10%">날짜</S.TableHeaderCell>
                    <S.TableHeaderCell width="12%">직원명</S.TableHeaderCell>
                    <S.TableHeaderCell width="15%">부서</S.TableHeaderCell>
                    <S.TableHeaderCell width="10%">직급</S.TableHeaderCell>
                    <S.TableHeaderCell width="12%">상태</S.TableHeaderCell>
                    <S.TableHeaderCell width="12%">출근시간</S.TableHeaderCell>
                    <S.TableHeaderCell width="12%">퇴근시간</S.TableHeaderCell>
                  </S.TableRow>
                </S.TableHeader>
                <S.TableBody>
                  {abnormalList.length === 0 ? (
                    <S.TableRow>
                      <S.TableCell colSpan="7">
                        <S.EmptyMessage>특이사항이 없습니다.</S.EmptyMessage>
                      </S.TableCell>
                    </S.TableRow>
                  ) : (
                    abnormalList.map((record) => (
                      <S.TableRow key={record.attendanceId}>
                        <S.TableCell>{record.attendanceDate}</S.TableCell>
                        <S.TableCell>
                          <strong>{record.empName}</strong>
                        </S.TableCell>
                        <S.TableCell>{record.departmentName}</S.TableCell>
                        <S.TableCell>{record.job}</S.TableCell>
                        <S.TableCell>
                          <S.StatusBadge $status={record.attendanceStatus}>
                            {getStatusLabel(record.attendanceStatus)}
                          </S.StatusBadge>
                        </S.TableCell>
                        <S.TableCell>
                          {record.inTime || '-'}
                        </S.TableCell>
                        <S.TableCell>
                          {record.outTime || '-'}
                        </S.TableCell>
                      </S.TableRow>
                    ))
                  )}
                </S.TableBody>
              </S.AbnormalTable>
            </>
          )}
        </S.TabContent>
      )}
    </S.Container>
  );
};

// 상태 라벨 변환 함수
const getStatusLabel = (status) => {
  const statusMap = {
    'PRESENT': '출근',
    'LATE': '지각',
    'ABSENT': '결근',
    'EARLY_LEAVE': '조퇴',
    'HALF_DAY': '반차',
    'VACATION': '휴가',
    'LEAVE_PENDING': '휴가 대기',
    'LEAVE': '휴가',
    'PROTEST_PENDING': '정정 대기'
  };
  return statusMap[status] || status;
};

const getLeaveTypeLabel = (type) => {
  const typeMap = {
    'ANNUAL': '연차',
    'HALF_DAY': '반차',
    'SICK': '병가',
    'SPECIAL': '특별휴가',
    'UNPAID': '무급휴가',
  };
  return typeMap[type] || type;
};

export default AdminAttendance;
