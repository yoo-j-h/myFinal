import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MainContainer,
  ContentWrapper,
  ErrorImageContainer,
  TeamImage,
  ErrorCode,
  IconContainer,
  ErrorTitle,
  ErrorDescription,
  ErrorSubtext,
  ButtonGroup,
  BackButton,
  HomeButton,
  HomeIcon,
  FooterSection,
  ContactText,
  ContactLink,
  Copyright,
} from './NotFound.styled';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <MainContainer>
      <ContentWrapper>
        <ErrorImageContainer>
          <TeamImage
            src="/image/faker2.png" 
            alt="SkyHR Team"
          />
        </ErrorImageContainer>

        <ErrorCode>404</ErrorCode>

        <IconContainer>
          <span>✈️</span>
          <span>🔍</span>
        </IconContainer>

        <ErrorTitle>앗! 존재하지 않는 항로입니다</ErrorTitle>

        <ErrorDescription>
          요청하신 페이지는 삭제되었거나
          <br />
          잘못된 경로로 입력되었습니다
        </ErrorDescription>

        <ErrorSubtext>이런 작은 난기류는 괜찮아요 😊</ErrorSubtext>

        <ButtonGroup>
          <BackButton onClick={handleGoBack}>
            <span>←</span>
            이전으로
          </BackButton>
          <HomeButton onClick={handleGoHome}>
            <HomeIcon>🏠</HomeIcon>
            홈으로
          </HomeButton>
        </ButtonGroup>

        <FooterSection>
          <ContactText>
            문제가 지속되면{' '}
            <ContactLink href="mailto:support@skyhr.com">
              고객지원팀
            </ContactLink>
            {' '}에 문의해주세요
          </ContactText>
          <Copyright>© 2026 SkyHR. All rights reserved.</Copyright>
        </FooterSection>
      </ContentWrapper>
    </MainContainer>
  );
};

export default NotFound;