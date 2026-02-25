import React, { useState } from 'react';
import * as S from './AirlineApprovalManagement.styled';

const AirlineApprovalManagement = () => {
  const [filter, setFilter] = useState('pending'); // 'all', 'pending', 'approved', 'rejected'
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedAirline, setSelectedAirline] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  // TODO: Zustand state mapping
  const approvalRequests = [
    {
      id: 1,
      airlineName: '아시아나항공',
      country: '대한민국',
      domain: 'flyasiana.com',
      airlineAddress: '서울시 강서구 하늘길 112',
      mainNumber: '1588-8000',
      theme: {
        mainColor: '#E31E24',
        subColor: '#8B0000'
      },
      description: '아시아나항공 HR 시스템 도입 신청',
      managerName: '김철수',
      managerEmail: 'manager@flyasiana.com',
      managerPhone: '02-1234-5678',
      submittedDate: '2026-01-18',
      status: 'pending'
    },
    {
      id: 2,
      airlineName: 'Jin Air',
      country: '대한민국',
      domain: 'jinair.com',
      airlineAddress: '서울시 강서구 공항대로 260',
      mainNumber: '1600-6200',
      theme: {
        mainColor: '#FFD700',
        subColor: '#FFA500'
      },
      description: 'Jin Air 인사 관리 시스템 가입',
      managerName: '이영희',
      managerEmail: 'hr@jinair.com',
      managerPhone: '02-2345-6789',
      submittedDate: '2026-01-19',
      status: 'pending'
    },
    {
      id: 3,
      airlineName: 'T\'way Air',
      country: '대한민국',
      domain: 'twayair.com',
      airlineAddress: '서울시 강서구 하늘길 38',
      mainNumber: '1688-8686',
      theme: {
        mainColor: '#E30613',
        subColor: '#990000'
      },
      description: 'T\'way Air HR 솔루션 도입',
      managerName: '박민수',
      managerEmail: 'admin@twayair.com',
      managerPhone: '02-3456-7890',
      submittedDate: '2026-01-20',
      status: 'pending'
    }
  ];

  const handleApprove = (id) => {
    // TODO: Zustand action - approveAirline(id)
    console.log('Approve airline:', id);
  };

  const handleReject = (airline) => {
    setSelectedAirline(airline);
    setRejectModalOpen(true);
  };

  const handleRejectConfirm = () => {
    if (!rejectReason.trim()) {
      alert('반려 사유를 입력해주세요.');
      return;
    }
    // TODO: Zustand action - rejectAirline(selectedAirline.id, rejectReason)
    console.log('Reject airline:', selectedAirline.id, 'Reason:', rejectReason);
    setRejectModalOpen(false);
    setRejectReason('');
    setSelectedAirline(null);
  };

  const handleViewDetails = (id) => {
    // TODO: Navigate to detail page or open modal
    console.log('View details:', id);
  };

  const filteredRequests = approvalRequests.filter(request => {
    const matchesFilter = filter === 'all' || request.status === filter;
    const matchesSearch = request.airlineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.managerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <S.MainContainer>
      <S.Header>
        <S.Title>항공사 승인 관리</S.Title>
        <S.Subtitle>항공사 가입 신청 검토 및 승인 처리</S.Subtitle>
      </S.Header>

      <S.StatsGrid>
        <S.StatCard $type="pending">
          <S.StatIcon $type="pending">📋</S.StatIcon>
          <S.StatInfo>
            <S.StatLabel>대기 중</S.StatLabel>
            <S.StatValue>{approvalRequests.filter(r => r.status === 'pending').length}</S.StatValue>
            <S.StatSubtext>처리 필요</S.StatSubtext>
          </S.StatInfo>
        </S.StatCard>

        <S.StatCard $type="approved">
          <S.StatIcon $type="approved">✓</S.StatIcon>
          <S.StatInfo>
            <S.StatLabel>승인</S.StatLabel>
            <S.StatValue>{approvalRequests.filter(r => r.status === 'approved').length}</S.StatValue>
            <S.StatSubtext>승인 완료</S.StatSubtext>
          </S.StatInfo>
        </S.StatCard>

        <S.StatCard $type="rejected">
          <S.StatIcon $type="rejected">⚠</S.StatIcon>
          <S.StatInfo>
            <S.StatLabel>반려</S.StatLabel>
            <S.StatValue>{approvalRequests.filter(r => r.status === 'rejected').length}</S.StatValue>
            <S.StatSubtext>반려 처리</S.StatSubtext>
          </S.StatInfo>
        </S.StatCard>
      </S.StatsGrid>

      <S.FilterBar>
        <S.SearchInput
          type="text"
          placeholder="항공사명 또는 이메일로 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <S.FilterButton
          $active={filter === 'all'}
          onClick={() => setFilter('all')}
        >
          전체
        </S.FilterButton>
        <S.FilterButton
          $active={filter === 'pending'}
          onClick={() => setFilter('pending')}
        >
          대기 중
        </S.FilterButton>
        <S.FilterButton
          $active={filter === 'approved'}
          onClick={() => setFilter('approved')}
        >
          승인됨
        </S.FilterButton>
        <S.FilterButton
          $active={filter === 'rejected'}
          onClick={() => setFilter('rejected')}
        >
          반려됨
        </S.FilterButton>
      </S.FilterBar>

      <S.ApprovalList>
        {filteredRequests.map(request => (
          <S.ApprovalCard key={request.id}>
            <S.CardHeader>
              <S.AirlineInfo>
                <S.AirlineName>
                  <Building2 size={20} />
                  {request.airlineName}
                </S.AirlineName>
              </S.AirlineInfo>
              <S.StatusBadge $status={request.status}>
                {request.status === 'pending' && '승인 대기'}
                {request.status === 'approved' && '승인 완료'}
                {request.status === 'rejected' && '반려됨'}
              </S.StatusBadge>
            </S.CardHeader>

            <S.DetailGrid>
              <S.DetailItem>
                <Mail size={16} />
                <S.DetailLabel>이메일:</S.DetailLabel> {request.managerEmail}
              </S.DetailItem>
              <S.DetailItem>
                <Phone size={16} />
                <S.DetailLabel>전화번호:</S.DetailLabel> {request.managerPhone}
              </S.DetailItem>
              <S.DetailItem>
                <Building2 size={16} />
                <S.DetailLabel>도메인:</S.DetailLabel> @{request.domain}
              </S.DetailItem>
              <S.DetailItem>
                <Calendar size={16} />
                <S.DetailLabel>신청일:</S.DetailLabel> {request.submittedDate}
              </S.DetailItem>
              <S.DetailItem>
                <Building2 size={16} />
                <S.DetailLabel>주소:</S.DetailLabel> {request.airlineAddress}
              </S.DetailItem>
              <S.DetailItem>
                <Phone size={16} />
                <S.DetailLabel>대표번호:</S.DetailLabel> {request.mainNumber}
              </S.DetailItem>
              <S.DetailItem style={{ gridColumn: 'span 2' }}>
                <S.DetailLabel>테마 컬러:</S.DetailLabel>
                <S.ThemeColorBox>
                  <S.ColorSwatch $color={request.theme.mainColor} />
                  <span>{request.theme.mainColor}</span>
                  <S.ColorSwatch $color={request.theme.subColor} />
                  <span>{request.theme.subColor}</span>
                </S.ThemeColorBox>
              </S.DetailItem>
              {request.description && (
                <S.DetailItem style={{ gridColumn: 'span 2' }}>
                  <S.DetailLabel>설명:</S.DetailLabel> {request.description}
                </S.DetailItem>
              )}
            </S.DetailGrid>

            {request.status === 'pending' && (
              <S.ActionButtons>
                <S.Button $view onClick={() => handleViewDetails(request.id)}>
                  <FileText size={16} />
                  상세 보기
                </S.Button>
                <S.Button $reject onClick={() => handleReject(request)}>
                  <XCircle size={16} />
                  반려
                </S.Button>
                <S.Button $approve onClick={() => handleApprove(request.id)}>
                  <CheckCircle size={16} />
                  승인
                </S.Button>
              </S.ActionButtons>
            )}
          </S.ApprovalCard>
        ))}
      </S.ApprovalList>

      {/* 반려 모달 */}
      {rejectModalOpen && (
        <S.ModalOverlay onClick={() => setRejectModalOpen(false)}>
          <S.ModalContainer onClick={e => e.stopPropagation()}>
            <S.ModalHeader>반려 사유 입력</S.ModalHeader>
            <S.TextArea
              placeholder="반려 사유를 입력해주세요."
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
            />
            <S.ModalActions>
              <S.Button $view onClick={() => setRejectModalOpen(false)}>취소</S.Button>
              <S.Button $reject onClick={handleRejectConfirm}>반려 확인</S.Button>
            </S.ModalActions>
          </S.ModalContainer>
        </S.ModalOverlay>
      )}
    </S.MainContainer>
  );
};

export default AirlineApprovalManagement;
