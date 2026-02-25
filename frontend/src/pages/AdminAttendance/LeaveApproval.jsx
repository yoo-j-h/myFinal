import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import useAuthStore from '../../store/authStore';
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
  // Modal 관련
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  DetailSection,
  DetailLabel,
  DetailValue,
  ApplicantInfo,
  ReasonBox,
  StatusBadge,
  ModalFooter,
  RejectReasonInput,
  CancelButton,
} from './LeaveApproval.styled';

const LeaveApproval = () => {
  const { emp } = useAuthStore();
  const [activeFilter, setActiveFilter] = useState('all');
  const [leaveList, setLeaveList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔥 모달 상태 - 반드시 초기값 확인
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const filterTabs = [
    { id: 'all', label: '전체' },
    { id: 'pending', label: '대기중' },
    { id: 'approved', label: '승인' },
    { id: 'rejected', label: '반려' },
  ];

  useEffect(() => {
    fetchLeaveApplications();
  }, [activeFilter]);

  // 🔍 1. Data Integrity Check - API 응답 확인
  const fetchLeaveApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (activeFilter === 'all') {
        response = await api.get('/api/leave/admin/all');
      } else {
        response = await api.get(`/api/leave/admin/status/${activeFilter.toUpperCase()}`);
      }

      console.log('� [Step 1] API 원본 응답:', response);
      console.log('🔍 [Step 1] response.data:', response.data);

      // ApiResponse로 감싸져 있는 경우와 직접 배열인 경우 모두 처리
      let data;
      if (response.data && typeof response.data === 'object' && response.data.data !== undefined) {
        // ApiResponse { success, message, data } 구조
        data = response.data.data;
        console.log('✅ ApiResponse 구조 감지:', data);
      } else if (Array.isArray(response.data)) {
        // 직접 배열
        data = response.data;
        console.log('✅ 배열 직접 리턴:', data);
      } else {
        console.error('❌ 예상하지 못한 응답 구조:', response.data);
        data = [];
      }

      if (!Array.isArray(data)) {
        console.error('❌ 최종 data가 배열이 아닙니다:', typeof data, data);
        setError('데이터 형식이 올바르지 않습니다.');
        setLeaveList([]);
        return;
      }

      console.log(`✅ 총 ${data.length}건 로드 완료`);
      console.log('🔍 첫 번째 항목 샘플:', data[0]);
      console.log('🔍 첫 번째 항목 전체 필드:', JSON.stringify(data[0], null, 2));

      // 필드명 확인
      if (data[0]) {
        console.log('📋 사용 가능한 필드명:', Object.keys(data[0]));
        console.log('👤 applicantName:', data[0].applicantName);
        console.log('🏢 departmentName:', data[0].departmentName);
      }

      setLeaveList(data);
      calculateStats(data);
    } catch (err) {
      console.error('❌ API 호출 실패:', err);
      console.error('❌ 에러 상세:', err.response?.data);
      setError('데이터를 불러오는 데 실패했습니다.');
      setLeaveList([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    if (!Array.isArray(data)) {
      console.error('❌ calculateStats: 배열이 아닙니다');
      return;
    }

    const pending = data.filter(item => item?.status === 'PENDING').length;
    const approved = data.filter(item => item?.status === 'APPROVED').length;
    const rejected = data.filter(item => item?.status === 'REJECTED').length;

    console.log('📊 통계:', { pending, approved, rejected });
    setStats({ pending, approved, rejected });
  };

  // ⚡ 2. State Synchronization - 상태 동기화 강제 보장
  const handleViewDetail = (leave) => {
    console.log('🔥🔥🔥 [Step 2] handleViewDetail 호출됨!');
    console.log('� 선택된 휴가 정보:', leave);
    console.log('🔥 현재 isModalOpen:', isModalOpen);
    console.log('🔥 현재 selectedLeave:', selectedLeave);

    // null 체크
    if (!leave) {
      console.error('❌ leave 데이터가 없습니다!');
      alert('휴가 정보를 불러오지 못했습니다.');
      return;
    }

    // 상태 업데이트 - 반드시 실행
    console.log('✅ setSelectedLeave 실행...');
    setSelectedLeave(leave);

    console.log('✅ setIsModalOpen(true) 실행...');
    setIsModalOpen(true); // ★ 반드시 실행되어야 함!

    setShowRejectInput(false);
    setRejectReason('');

    console.log('✅ 모달 상태 업데이트 완료!');

    // 다음 렌더링 사이클에서 확인하기 위해 setTimeout 사용
    setTimeout(() => {
      console.log('🔍 [확인] 업데이트 후 isModalOpen:', isModalOpen);
      console.log('🔍 [확인] 업데이트 후 selectedLeave:', selectedLeave);
    }, 100);
  };

  const handleCloseModal = () => {
    console.log('✕ 모달 닫기');
    setIsModalOpen(false);
    setSelectedLeave(null);
    setShowRejectInput(false);
    setRejectReason('');
  };

  const handleApprove = async () => {
    if (!selectedLeave) {
      console.error('❌ selectedLeave 없음');
      return;
    }

    console.log('✓ 승인 처리:', selectedLeave.leaveApplyId);
    console.log('👤 현재 사용자:', emp);
    console.log('🆔 approverId:', emp?.empId);

    if (!emp?.empId) {
      alert('승인자 정보를 불러올 수 없습니다. 다시 로그인해주세요.');
      return;
    }

    try {
      await api.put(`/api/leave/${selectedLeave.leaveApplyId}/approve`,
        {
          approved: true,
          cancelReason: null
        },
        {
          params: { approverId: emp.empId }
        }
      );

      console.log('✅ 승인 완료');
      alert('휴가 신청이 승인되었습니다.');
      handleCloseModal();
      fetchLeaveApplications();
    } catch (err) {
      console.error('❌ 승인 실패:', err);
      console.error('❌ 에러 상세:', err.response?.data);
      alert('승인 처리에 실패했습니다.');
    }
  };

  const handleShowRejectInput = () => {
    console.log('✕ 반려 사유 입력 표시');
    setShowRejectInput(true);
  };

  const handleReject = async () => {
    if (!selectedLeave) {
      console.error('❌ selectedLeave 없음');
      return;
    }

    if (!rejectReason.trim()) {
      alert('반려 사유를 입력해주세요.');
      return;
    }

    console.log('✕ 반려 처리:', selectedLeave.leaveApplyId);
    console.log('👤 현재 사용자:', emp);
    console.log('🆔 approverId:', emp?.empId);
    console.log('📝 반려 사유:', rejectReason);

    if (!emp?.empId) {
      alert('승인자 정보를 불러올 수 없습니다. 다시 로그인해주세요.');
      return;
    }

    try {
      await api.put(`/api/leave/${selectedLeave.leaveApplyId}/approve`,
        {
          approved: false,
          cancelReason: rejectReason
        },
        {
          params: { approverId: emp.empId }
        }
      );

      console.log('✅ 반려 완료');
      alert('휴가 신청이 반려되었습니다.');
      handleCloseModal();
      fetchLeaveApplications();
    } catch (err) {
      console.error('❌ 반려 실패:', err);
      console.error('❌ 에러 상세:', err.response?.data);
      alert('반려 처리에 실패했습니다.');
    }
  };

  // 헬퍼 함수들
  const getLeaveTypeLabel = (type) => {
    const types = {
      'ANNUAL': '연차',
      'HALF_DAY': '반차',
      'SICK': '병가',
      'UNPAID': '무급'
    };
    return types[type] || type;
  };

  const getLeaveTypeBadge = (type) => {
    const badges = {
      'ANNUAL': 'annual',
      'HALF_DAY': 'half',
      'SICK': 'sick',
      'UNPAID': 'unpaid'
    };
    return badges[type] || 'annual';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      // ISO 문자열에서 날짜 부분만 추출
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (e) {
      console.error('날짜 포맷 오류:', e);
      return dateString;
    }
  };

  const getAvatarColor = (name) => {
    const colors = [
      '#3b82f6', '#f59e0b', '#8b5cf6', '#10b981',
      '#06b6d4', '#ef4444', '#f97316', '#14b8a6'
    ];
    if (!name) return colors[0];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.substring(0, 2);
  };

  const getStatusLabel = (status) => {
    const labels = {
      'PENDING': '대기중',
      'APPROVED': '승인',
      'REJECTED': '반려'
    };
    return labels[status] || status;
  };

  // 🔍 디버깅: 모달 상태 변경 감지
  useEffect(() => {
    console.log('🎯 [useEffect] 모달 상태 변경 감지!');
    console.log('  - isModalOpen:', isModalOpen);
    console.log('  - selectedLeave ID:', selectedLeave?.leaveApplyId);
    console.log('  - 모달이 렌더링되어야 함:', isModalOpen && selectedLeave ? 'YES ✅' : 'NO ❌');
  }, [isModalOpen, selectedLeave]);

  console.log('🔄 [Render] 컴포넌트 렌더링 - isModalOpen:', isModalOpen, 'selectedLeave:', !!selectedLeave);

  return (
    <MainContentArea>
      {/* Statistics Cards */}
      <StatsGrid>
        <StatCard $type="pending">
          <StatIcon $type="pending">📋</StatIcon>
          <StatInfo>
            <StatLabel>대기 중</StatLabel>
            <StatValue>{stats.pending}</StatValue>
            <StatSubtext>처리 필요</StatSubtext>
          </StatInfo>
        </StatCard>

        <StatCard $type="approved">
          <StatIcon $type="approved">✓</StatIcon>
          <StatInfo>
            <StatLabel>승인</StatLabel>
            <StatValue>{stats.approved}</StatValue>
            <StatSubtext>승인 완료</StatSubtext>
          </StatInfo>
        </StatCard>

        <StatCard $type="rejected">
          <StatIcon $type="rejected">⚠</StatIcon>
          <StatInfo>
            <StatLabel>반려</StatLabel>
            <StatValue>{stats.rejected}</StatValue>
            <StatSubtext>반려 처리</StatSubtext>
          </StatInfo>
        </StatCard>
      </StatsGrid>

      {/* Filter Section */}
      <FilterSection>
        <FilterTabs>
          {filterTabs.map((tab) => (
            <FilterTab
              key={tab.id}
              $active={activeFilter === tab.id}
              onClick={() => setActiveFilter(tab.id)}
            >
              <TabLabel>{tab.label}</TabLabel>
            </FilterTab>
          ))}
        </FilterTabs>

        <SortDropdown>
          <option value="date">최신순</option>
          <option value="type">유형별</option>
          <option value="status">상태별</option>
        </SortDropdown>
      </FilterSection>

      {/* Approval List */}
      <ApprovalListSection>
        <ListHeader>
          <ListTitle>📋 휴가 신청 목록</ListTitle>
          <SortButton>총 {leaveList.length}건</SortButton>
        </ListHeader>

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            로딩 중...
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
            {error}
          </div>
        )}

        {!loading && !error && leaveList.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            휴가 신청 내역이 없습니다.
          </div>
        )}

        <ApprovalList>
          {leaveList.map((leave, index) => {
            // 🔍 Optional Chaining으로 안전하게 데이터 접근
            const applicantName = leave?.applicantName || leave?.empName || '-';
            const departmentName = leave?.departmentName || leave?.deptName || '부서 미지정';
            const leaveType = leave?.leaveType || 'ANNUAL';
            const startDate = leave?.startDate;
            const endDate = leave?.endDate;
            const leaveDays = leave?.leaveDays || 0;
            const status = leave?.status || 'PENDING';

            console.log(`🔍 [Render] 항목 ${index}:`, { applicantName, departmentName, leaveType });

            return (
              <ApprovalItem key={leave?.leaveApplyId || index}>
                <ApprovalAvatar $color={getAvatarColor(applicantName)}>
                  {getInitials(applicantName)}
                </ApprovalAvatar>

                <ApprovalInfo>
                  <ApprovalName>{applicantName}</ApprovalName>
                  <ApprovalDepartment>{departmentName}</ApprovalDepartment>
                </ApprovalInfo>

                <ApprovalDetails>
                  <ApprovalType $type={getLeaveTypeBadge(leaveType)}>
                    {getLeaveTypeLabel(leaveType)}
                  </ApprovalType>
                  <ApprovalDate>
                    {formatDate(startDate)} ~ {formatDate(endDate)} ({leaveDays}일)
                  </ApprovalDate>
                  <ApprovalPeriod>{getStatusLabel(status)}</ApprovalPeriod>
                </ApprovalDetails>

                <ApprovalActions>
                  <ViewButton onClick={() => handleViewDetail(leave)}>
                    👁 상세
                  </ViewButton>
                </ApprovalActions>
              </ApprovalItem>
            );
          })}
        </ApprovalList>
      </ApprovalListSection>

      {/* 🛠 3. Modal Rendering - 조건부 렌더링 확인 */}
      {console.log('🔍 [Modal 렌더링 조건]', { isModalOpen, hasSelectedLeave: !!selectedLeave })}
      {isModalOpen && selectedLeave ? (
        <ModalOverlay onClick={handleCloseModal}>
          {console.log('✅ ModalOverlay 렌더링됨!')}
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>휴가 신청 상세</ModalTitle>
              <CloseButton onClick={handleCloseModal}>✕</CloseButton>
            </ModalHeader>

            <ModalBody>
              {/* 신청자 정보 */}
              <ApplicantInfo>
                <ApprovalAvatar $color={getAvatarColor(selectedLeave?.applicantName || selectedLeave?.empName)}>
                  {getInitials(selectedLeave?.applicantName || selectedLeave?.empName)}
                </ApprovalAvatar>
                <div>
                  <ApprovalName>{selectedLeave?.applicantName || selectedLeave?.empName || '-'}</ApprovalName>
                  <ApprovalDepartment>{selectedLeave?.departmentName || selectedLeave?.deptName || '부서 미지정'}</ApprovalDepartment>
                </div>
              </ApplicantInfo>

              {/* 휴가 구분 */}
              <DetailSection>
                <DetailLabel>휴가 구분</DetailLabel>
                <DetailValue>
                  <ApprovalType $type={getLeaveTypeBadge(selectedLeave?.leaveType)}>
                    {getLeaveTypeLabel(selectedLeave?.leaveType)}
                  </ApprovalType>
                </DetailValue>
              </DetailSection>

              {/* 휴가 기간 */}
              <DetailSection>
                <DetailLabel>휴가 기간</DetailLabel>
                <DetailValue>
                  {formatDate(selectedLeave?.startDate)} ~ {formatDate(selectedLeave?.endDate)} ({selectedLeave?.leaveDays || 0}일)
                </DetailValue>
              </DetailSection>

              {/* 신청 사유 */}
              <DetailSection>
                <DetailLabel>신청 사유</DetailLabel>
                <ReasonBox>
                  {selectedLeave?.reason || selectedLeave?.leaveApplyReason || '사유 없음'}
                </ReasonBox>
              </DetailSection>

              {/* 현재 상태 */}
              <DetailSection>
                <DetailLabel>현재 상태</DetailLabel>
                <DetailValue>
                  <StatusBadge $status={selectedLeave?.status}>
                    {getStatusLabel(selectedLeave?.status)}
                  </StatusBadge>
                </DetailValue>
              </DetailSection>

              {/* 승인자 정보 */}
              {selectedLeave?.approverName && (
                <DetailSection>
                  <DetailLabel>처리자</DetailLabel>
                  <DetailValue>{selectedLeave.approverName}</DetailValue>
                </DetailSection>
              )}

              {/* 반려 사유 입력 */}
              {showRejectInput && (
                <DetailSection>
                  <DetailLabel>반려 사유</DetailLabel>
                  <RejectReasonInput
                    placeholder="반려 사유를 입력해주세요..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    autoFocus
                  />
                </DetailSection>
              )}
            </ModalBody>

            {/* 모달 하단 버튼 (PENDING 상태만) */}
            {selectedLeave?.status === 'PENDING' && (
              <ModalFooter>
                <CancelButton onClick={handleCloseModal}>취소</CancelButton>
                {showRejectInput ? (
                  <RejectButton onClick={handleReject}>반려 확정</RejectButton>
                ) : (
                  <>
                    <RejectButton onClick={handleShowRejectInput}>✕ 반려</RejectButton>
                    <ApproveButton onClick={handleApprove}>✓ 승인</ApproveButton>
                  </>
                )}
              </ModalFooter>
            )}
          </ModalContent>
        </ModalOverlay>
      ) : (
        console.log('❌ 모달 조건 미충족 - isModalOpen:', isModalOpen, 'selectedLeave:', !!selectedLeave)
      )}
    </MainContentArea>
  );
};

export default LeaveApproval;
