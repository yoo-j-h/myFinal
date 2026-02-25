import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as S from './TenantDetail.styled';
import { tenantService } from '../../../api/tenant/services';

const TenantDetail = () => {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const [tenantData, setTenantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTenantDetail();
  }, [tenantId]);

  const fetchTenantDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tenantService.getTenantDetail(tenantId);
      setTenantData(response.data);
    } catch (err) {
      console.error('테넌트 상세 정보 로드 실패:', err);
      setError('데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/super-admin/tenants');
  };

  const handleSuspendAccount = async () => {
    if (!window.confirm('정말로 이 계정을 정지하시겠습니까?')) {
      return;
    }

    try {
      await tenantService.updateTenantStatus(tenantId, 'INACTIVE');
      alert('계정이 정지되었습니다.');
      // 데이터 다시 로드
      fetchTenantDetail();
    } catch (err) {
      console.error('계정 정지 실패:', err);
      alert('계정 정지에 실패했습니다.');
    }
  };

  const handleActivateAccount = async () => {
    if (!window.confirm('이 계정을 활성화하시겠습니까?')) {
      return;
    }

    try {
      await tenantService.updateTenantStatus(tenantId, 'ACTIVE');
      alert('계정이 활성화되었습니다.');
      // 데이터 다시 로드
      fetchTenantDetail();
    } catch (err) {
      console.error('계정 활성화 실패:', err);
      alert('계정 활성화에 실패했습니다.');
    }
  };

  // 현재 상태에 따라 동적으로 Quick Actions 생성
  const isInactive = tenantData?.status?.toUpperCase() === 'INACTIVE';

  const quickActions = [
    { id: 1, label: '긴급 로그아웃', icon: '🔐', action: () => console.log('긴급 로그아웃') },
    {
      id: 2,
      label: isInactive ? '계정 활성화' : '계정 정지',
      icon: isInactive ? '✅' : '🚫',
      action: isInactive ? handleActivateAccount : handleSuspendAccount
    },
    { id: 3, label: '로그 보기', icon: '📄', action: () => console.log('로그 보기') }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR');
  };

  const getStatusText = (status) => {
    const upperStatus = status?.toUpperCase();
    switch (upperStatus) {
      case 'ACTIVE':
        return '정상 서비스 중';
      case 'PAYMENT_PENDING':
        return '결제 중';
      case 'INACTIVE':
        return '미납으로 인한 정지';
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    const upperStatus = status?.toUpperCase();
    switch (upperStatus) {
      case 'ACTIVE':
        return '✓';
      case 'PAYMENT_PENDING':
        return '⏱';
      case 'INACTIVE':
        return '⚠';
      default:
        return '✓';
    }
  };

  if (loading) {
    return (
      <S.MainContainer>
        <S.ContentWrapper>
          <S.LoadingWrapper>
            <p>데이터를 불러오는 중...</p>
          </S.LoadingWrapper>
        </S.ContentWrapper>
      </S.MainContainer>
    );
  }

  if (error || !tenantData) {
    return (
      <S.MainContainer>
        <S.ContentWrapper>
          <S.BackButton onClick={handleGoBack}>
            ← 테넌트 목록으로 돌아가기
          </S.BackButton>
          <S.ErrorWrapper>
            <p>{error || '데이터를 찾을 수 없습니다.'}</p>
            <S.RetryButton onClick={fetchTenantDetail}>
              다시 시도
            </S.RetryButton>
          </S.ErrorWrapper>
        </S.ContentWrapper>
      </S.MainContainer>
    );
  }

  return (
    <S.MainContainer>
      <S.ContentWrapper>
        <S.BackButton onClick={handleGoBack}>
          ← 테넌트 목록으로 돌아가기
        </S.BackButton>

        <S.TenantHeader>
          <S.TenantHeaderLeft>
            <S.TenantIconLarge>{tenantData.icon}</S.TenantIconLarge>
            <S.TenantHeaderInfo>
              <S.TenantNameLarge>{tenantData.name}</S.TenantNameLarge>
              <S.TenantId>테넌트 ID: {tenantData.id}</S.TenantId>
            </S.TenantHeaderInfo>
          </S.TenantHeaderLeft>
          <S.TenantHeaderRight>
            <S.StatusBadgeLarge $status={tenantData.status}>
              {getStatusIcon(tenantData.status)} {getStatusText(tenantData.status)}
            </S.StatusBadgeLarge>
          </S.TenantHeaderRight>
        </S.TenantHeader>

        <S.QuickActionsBar>
          {quickActions.map((action) => (
            <S.QuickActionButton key={action.id} onClick={action.action}>
              <S.ActionIcon>{action.icon}</S.ActionIcon>
              {action.label}
            </S.QuickActionButton>
          ))}
        </S.QuickActionsBar>

        <S.StatsGrid>
          <S.StatCard>
            <S.StatIcon>👥</S.StatIcon>
            <S.StatValue>{(tenantData.employeeCount || 0).toLocaleString()}</S.StatValue>
            <S.StatLabel>전체 직원 수</S.StatLabel>
            <S.StatSubtext>등록된 직원</S.StatSubtext>
            <S.TrendIndicator $positive>↗</S.TrendIndicator>
          </S.StatCard>

          <S.StatCard>
            <S.StatIcon>📊</S.StatIcon>
            <S.StatValue>{(tenantData.activeUsers || 0).toLocaleString()}</S.StatValue>
            <S.StatLabel>활성 사용자</S.StatLabel>
            <S.StatSubtext>현재 활성 상태</S.StatSubtext>
            <S.TrendIndicator $positive>↗</S.TrendIndicator>
          </S.StatCard>

          <S.StatCard>
            <S.StatIcon>⚙️</S.StatIcon>
            <S.StatValue>{tenantData.managedFeatures || 0}</S.StatValue>
            <S.StatLabel>관리 기능</S.StatLabel>
            <S.StatSubtext>활성화된 기능</S.StatSubtext>
            <S.TrendIndicator $positive>↗</S.TrendIndicator>
          </S.StatCard>
        </S.StatsGrid>

        <S.ContentGrid>
          <S.LeftColumn>
            <S.InfoSection>
              <S.SectionTitle>
                <S.SectionIcon>🏢</S.SectionIcon>
                회사 정보
              </S.SectionTitle>
              <S.InfoList>
                <S.InfoRow>
                  <S.InfoLabel>🌐 국가</S.InfoLabel>
                  <S.InfoValue>{tenantData.country}</S.InfoValue>
                </S.InfoRow>
                <S.InfoRow>
                  <S.InfoLabel>📍 주소</S.InfoLabel>
                  <S.InfoValue>{tenantData.address}</S.InfoValue>
                </S.InfoRow>
                <S.InfoRow>
                  <S.InfoLabel>✉️ 담당자 이메일</S.InfoLabel>
                  <S.InfoValue>{tenantData.email}</S.InfoValue>
                </S.InfoRow>
                <S.InfoRow>
                  <S.InfoLabel>📞 전화번호</S.InfoLabel>
                  <S.InfoValue>{tenantData.phone}</S.InfoValue>
                </S.InfoRow>
              </S.InfoList>
            </S.InfoSection>

            <S.InfoSection>
              <S.SectionTitle>
                <S.SectionIcon>📅</S.SectionIcon>
                가입 정보
              </S.SectionTitle>
              <S.InfoList>
                <S.InfoRow>
                  <S.InfoLabel>📅 가입일</S.InfoLabel>
                  <S.InfoValue>{formatDate(tenantData.joinDate)}</S.InfoValue>
                </S.InfoRow>
              </S.InfoList>
            </S.InfoSection>
          </S.LeftColumn>

          <S.RightColumn>
            <S.InfoSection>
              <S.SectionTitle>
                <S.SectionIcon>📊</S.SectionIcon>
                사용 현황
              </S.SectionTitle>
              <S.UsageItem>
                <S.UsageLabel>스토리지 사용량</S.UsageLabel>
                <S.ProgressBarContainer>
                  <S.ProgressBar $progress={tenantData.usageStats?.storageUsage || 0} />
                </S.ProgressBarContainer>
                <S.UsageValue>{tenantData.usageStats?.storageUsage || 0} / 100 GB</S.UsageValue>
              </S.UsageItem>
              <S.InfoList>
                <S.InfoRow>
                  <S.InfoLabel>⏰ 마지막 로그인</S.InfoLabel>
                  <S.InfoValue>{formatDateTime(tenantData.usageStats?.lastLogin) || '정보 없음'}</S.InfoValue>
                </S.InfoRow>
                <S.InfoRow>
                  <S.InfoLabel>👥 월간 활성 사용자</S.InfoLabel>
                  <S.InfoValue>{(tenantData.usageStats?.activeEmployees || 0).toLocaleString()}명</S.InfoValue>
                </S.InfoRow>
              </S.InfoList>
            </S.InfoSection>

            <S.InfoSection>
              <S.SectionTitle>
                <S.SectionIcon>📄</S.SectionIcon>
                최근 활동 로그
              </S.SectionTitle>
              <S.LogMessage>
                활동 로그 기능은 준비 중입니다.
              </S.LogMessage>
            </S.InfoSection>
          </S.RightColumn>
        </S.ContentGrid>
      </S.ContentWrapper>
    </S.MainContainer>
  );
};

export default TenantDetail;