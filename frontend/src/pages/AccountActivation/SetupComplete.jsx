import React from 'react';
import * as S from './SetupComplete.styled';

const SetupComplete = ({ setupData }) => {
  // setupData가 null이거나 undefined인 경우 처리
  if (!setupData) {
    console.warn('⚠️ [SetupComplete] setupData가 없습니다. 기본값을 사용합니다.');
  }
  
  // 백엔드에서 받은 데이터 사용
  const userInfo = {
    airline: setupData?.airlineName || '항공사',
    adminId: setupData?.adminId || '관리자 계정',
    status: '활성화됨',
  };
  
  console.log('🟢 [SetupComplete] 렌더링 - setupData:', setupData);
  console.log('🟢 [SetupComplete] userInfo:', userInfo);

  const handleMainRedirect = () => {
    window.location.href = '/';
  };

  return (
    <S.MainContainer>
      <S.ContentWrapper>
        <S.SuccessCard>
          <S.IconWrapper>
            <S.CheckIcon>✓</S.CheckIcon>
          </S.IconWrapper>

          <S.Title>설정이 완료되었습니다!</S.Title>
          <S.Subtitle>
            항공사 관리자 계정이 성공적으로 생성되었습니다.
            <br />
            이제 SkyHR 시스템을 사용할 수 있습니다.
          </S.Subtitle>

          <S.InfoCard>
            <S.InfoRow>
              <S.InfoLabel>항공사</S.InfoLabel>
              <S.InfoValue>{userInfo.airline}</S.InfoValue>
            </S.InfoRow>
            <S.Divider />
            <S.InfoRow>
              <S.InfoLabel>관리자 계정 ID</S.InfoLabel>
              <S.InfoValue>{userInfo.adminId}</S.InfoValue>
            </S.InfoRow>
            <S.Divider />
            <S.InfoRow>
              <S.InfoLabel>계정 상태</S.InfoLabel>
              <S.StatusBadge>
                <S.StatusIcon>✓</S.StatusIcon>
                {userInfo.status}
              </S.StatusBadge>
            </S.InfoRow>
          </S.InfoCard>

          <S.ActionButton onClick={handleMainRedirect}>
            메인으로
          </S.ActionButton>
        </S.SuccessCard>
      </S.ContentWrapper>
    </S.MainContainer>
  );
};

export default SetupComplete;