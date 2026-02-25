import React, { useState, useEffect } from 'react';
import { useTheme } from 'styled-components';
import api from '../../api/axios';
import {
  MainContentArea,
  StatsGrid,
  StatCard,
  StatIcon,
  StatInfo,
  StatLabel,
  StatValue,
  StatSubtext,
  FilterSection,
  FilterTabs,
  FilterTab,
  TabIcon,
  TabLabel,
  SortDropdown,
  ApprovalListSection,
  ListHeader,
  ListTitle,
  SortButton,
  ApprovalList,
  ApprovalItem,
  ApprovalAvatar,
  ApprovalInfo,
  ApprovalName,
  ApprovalDepartment,
  ApprovalDetails,
  ApprovalType,
  ApprovalDate,
  ApprovalPeriod,
  ApprovalActions,
  ViewButton,
  ApproveButton,
  RejectButton,
  // 모달 관련 컴포넌트
  ModalOverlay,
  ModalContent,
  DetailRow,
  ButtonGroup,
  CloseButton,
  EmptyState
} from './LeaveApproval.styled';

const LeaveApproval = () => {
  const theme = useTheme();
  const [activeFilter, setActiveFilter] = useState('all');
  const [leaves, setLeaves] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // 상단 통계 데이터 계산
  const stats = [
    {
      icon: '📋',
      label: '대기 중',
      value: leaves.filter(l => l.status === 'PENDING').length,
      subtext: '처리 필요',
      color: theme.status.warning,
      iconColor: theme.status.warning
    },
    {
      icon: '✓',
      label: '승인',
      value: leaves.filter(l => l.status === 'APPROVED').length,
      subtext: '완료됨',
      color: theme.status.success,
      iconColor: theme.status.success
    },
    {
      icon: '⚠',
      label: '반려',
      value: leaves.filter(l => l.status === 'REJECTED').length,
      subtext: '처리됨',
      color: theme.status.error,
      iconColor: theme.status.error
    },
  ];

  const filterTabs = [
    { id: 'all', label: '전체', icon: '📋' },
    { id: 'pending', label: '대기중', icon: '⏳' },
    { id: 'processed', label: '처리완료', icon: '✅' },
  ];

  // 1. 데이터 조회 (API 연동)
  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/leave/admin/all'); // ✅ 올바른 API 경로

      console.log('🔍 API 응답:', response.data);

      // 백엔드 응답 구조에 맞춰 데이터 추출
      const data = response.data.data || response.data || [];
      console.log("✅ Fetched Leaves:", data);
      setLeaves(data);
    } catch (error) {
      console.error('❌ 휴가 신청 목록 조회 실패:', error);
      console.error('상세 에러:', error.response?.data);
      // 에러 발생 시 빈 배열로 초기화하지 않으면 map 에러 날 수 있음
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // 2. 상세 보기 핸들러
  const handleDetail = (data) => {
    let targetLeave = data;

    // 만약 객체가 아니라 ID만 넘어왔을 경우 (방어 코드)
    if (typeof data !== 'object') {
      targetLeave = leaves.find(leave => leave.leaveId === data || leave.id === data);
    }

    if (!targetLeave) {
      alert("해당 휴가 정보를 찾을 수 없습니다.");
      return;
    }

    setSelectedLeave(targetLeave);
    setIsModalOpen(true);
  };

  // 3. 승인/반려 처리
  const handleStatusUpdate = async (status, id = null) => {
    // 모달에서 호출 시 id가 없으므로 selectedLeave 사용
    const targetId = id || selectedLeave?.leaveId || selectedLeave?.id;

    if (!targetId) {
      alert("처리할 대상을 찾을 수 없습니다.");
      return;
    }

    if (!window.confirm(`${status === 'APPROVED' ? '승인' : '반려'} 하시겠습니까?`)) {
      return;
    }

    try {
      // API 호출: /admin/leave/approved 또는 /admin/leave/rejected
      await api.post(`/admin/leave/${status.toLowerCase()}`, {
        leaveId: targetId
      });

      alert(`정상적으로 ${status === 'APPROVED' ? '승인' : '반려'} 되었습니다.`);
      setIsModalOpen(false);
      fetchLeaves(); // 목록 새로고침
    } catch (error) {
      console.error('상태 변경 실패:', error);
      alert('처리 중 오류가 발생했습니다.');
    }
  };

  // 필터링 로직
  const filteredApprovals = leaves.filter((a) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pending') return a.status === 'PENDING';
    if (activeFilter === 'processed') return a.status === 'APPROVED' || a.status === 'REJECTED';
    return true;
  });

  // 휴가 타입에 따른 뱃지 스타일 결정 헬퍼
  const getBadgeType = (type) => {
    if (type?.includes('연차')) return 'annual';
    if (type?.includes('병가')) return 'sick';
    if (type?.includes('반차')) return 'half';
    return 'default';
  };

  return (
    <MainContentArea>
      {/* 상단 통계 카드 */}
      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard key={index} $bgColor={stat.color}>
            <StatIcon $color={stat.iconColor}>{stat.icon}</StatIcon>
            <StatInfo>
              <StatLabel>{stat.label}</StatLabel>
              <StatValue>{stat.value}</StatValue>
              <StatSubtext>{stat.subtext}</StatSubtext>
            </StatInfo>
          </StatCard>
        ))}
      </StatsGrid>

      {/* 필터 섹션 */}
      <FilterSection>
        <FilterTabs>
          {filterTabs.map((tab) => (
            <FilterTab
              key={tab.id}
              $active={activeFilter === tab.id}
              onClick={() => setActiveFilter(tab.id)}
            >
              <TabIcon>{tab.icon}</TabIcon>
              <TabLabel>{tab.label}</TabLabel>
            </FilterTab>
          ))}
        </FilterTabs>

        <SortDropdown>
          <option value="date">최신순</option>
          <option value="name">이름순</option>
        </SortDropdown>
      </FilterSection>

      {/* 휴가 목록 섹션 */}
      <ApprovalListSection>
        <ListHeader>
          <ListTitle>📋 휴가 신청 목록</ListTitle>
          <SortButton onClick={fetchLeaves}>새로고침 ↻</SortButton>
        </ListHeader>

        <ApprovalList>
          {loading ? (
            <EmptyState>
              데이터를 불러오는 중입니다...
            </EmptyState>
          ) : filteredApprovals.length === 0 ? (
            <EmptyState>
              신청 내역이 없습니다.
            </EmptyState>
          ) : (
            filteredApprovals.map((leave, index) => (
              <ApprovalItem key={leave.leaveId || leave.id || index}>
                <ApprovalAvatar $color="#3b82f6">
                  {(leave.empName || leave.name || '?').charAt(0)}
                </ApprovalAvatar>

                <ApprovalInfo>
                  <ApprovalName>{leave.empName || leave.name}</ApprovalName>
                  <ApprovalDepartment>{leave.deptName || leave.department}</ApprovalDepartment>
                </ApprovalInfo>

                <ApprovalDetails>
                  <ApprovalType $type={getBadgeType(leave.type || leave.leaveType)}>
                    {leave.type || leave.leaveType}
                  </ApprovalType>
                  <ApprovalDate>
                    {leave.startDate} ~ {leave.endDate}
                  </ApprovalDate>
                  <ApprovalPeriod>
                    {/* 상태 표시: PENDING, APPROVED, REJECTED */}
                    {leave.status === 'PENDING' ? '승인 대기' :
                      leave.status === 'APPROVED' ? '승인됨' : '반려됨'}
                  </ApprovalPeriod>
                </ApprovalDetails>

                <ApprovalActions>
                  <ViewButton onClick={() => handleDetail(leave)}>👁 상세</ViewButton>

                  {/* 대기 상태일 때만 승인/반려 버튼 표시 */}
                  {leave.status === 'PENDING' && (
                    <>
                      <ApproveButton onClick={() => handleStatusUpdate('APPROVED', leave.leaveId)}>
                        ✓ 승인
                      </ApproveButton>
                      <RejectButton onClick={() => handleStatusUpdate('REJECTED', leave.leaveId)}>
                        ✕ 반려
                      </RejectButton>
                    </>
                  )}
                </ApprovalActions>
              </ApprovalItem>
            ))
          )}
        </ApprovalList>
      </ApprovalListSection>

      {/* 상세 보기 모달 */}
      {isModalOpen && selectedLeave && (
        <ModalOverlay>
          <ModalContent>
            <h2>휴가 상세 정보</h2>
            <DetailRow>
              <label>이름</label>
              <span>{selectedLeave.empName || selectedLeave.name}</span>
            </DetailRow>
            <DetailRow>
              <label>부서</label>
              <span>{selectedLeave.deptName || selectedLeave.department}</span>
            </DetailRow>
            <DetailRow>
              <label>휴가 종류</label>
              <span>{selectedLeave.type || selectedLeave.leaveType}</span>
            </DetailRow>
            <DetailRow>
              <label>기간</label>
              <span>{selectedLeave.startDate} ~ {selectedLeave.endDate}</span>
            </DetailRow>
            <DetailRow>
              <label>사유</label>
              <p>{selectedLeave.reason || '사유 없음'}</p>
            </DetailRow>

            <ButtonGroup>
              {selectedLeave.status === 'PENDING' && (
                <>
                  <ApproveButton onClick={() => handleStatusUpdate('APPROVED')}>
                    승인
                  </ApproveButton>
                  <RejectButton onClick={() => handleStatusUpdate('REJECTED')}>
                    반려
                  </RejectButton>
                </>
              )}
              <CloseButton onClick={() => setIsModalOpen(false)}>
                닫기
              </CloseButton>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}
    </MainContentArea>
  );
};

export default LeaveApproval;