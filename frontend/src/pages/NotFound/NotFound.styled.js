import styled from 'styled-components';

export const MainContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.background.main};
  padding: 40px 20px;
`;

export const ContentWrapper = styled.div`
  max-width: 800px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 24px;
`;

export const ErrorImageContainer = styled.div`
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`;

export const TeamImage = styled.img`
  width: 280px;
  height: 280px;
  border-radius: 50%;
  object-fit: cover;
  border: 6px solid ${({ theme }) => theme.background.paper};
  box-shadow: ${({ theme }) => theme.shadowLg};
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width: 200px;
    height: 200px;
  }
`;

export const ErrorCode = styled.h1`
  font-size: 120px;
  font-weight: 900;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
  line-height: 1;
  letter-spacing: -4px;
  background: ${({ theme }) => `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 80px;
    letter-spacing: -2px;
  }
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 48px;
  margin: 8px 0;

  span {
    animation: bounce 2s ease-in-out infinite;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

export const ErrorTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin: 16px 0 0 0;
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

export const ErrorDescription = styled.p`
  font-size: 18px;
  color: ${({ theme }) => theme.text.secondary};
  margin: 12px 0;
  line-height: 1.8;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

export const ErrorSubtext = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.text.disabled || theme.text.tertiary};
  margin: 8px 0 32px 0;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin: 24px 0;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.secondary};
  background: ${({ theme }) => theme.background.paper};
  border: 2px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${({ theme }) => theme.shadowSm};

  span {
    font-size: 20px;
    transition: transform 0.3s ease;
  }

  &:hover {
    background: ${({ theme }) => theme.background.hover};
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadow};

    span {
      transform: translateX(-4px);
    }
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 12px 24px;
    font-size: 15px;
  }
`;

export const HomeButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.inverse || 'white'};
  background: ${({ theme }) => `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`};
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${({ theme }) => theme.shadow};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadowLg};
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 12px 24px;
    font-size: 15px;
  }
`;

export const HomeIcon = styled.span`
  font-size: 20px;
  transition: transform 0.3s ease;

  ${HomeButton}:hover & {
    transform: scale(1.2) rotate(10deg);
  }
`;

export const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid ${({ theme }) => theme.border};
  width: 100%;
`;

export const ContactText = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.text.secondary};
  margin: 0;
  font-weight: 400;
`;

export const ContactLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primaryHover || theme.colors.primary};
    border-bottom-color: ${({ theme }) => theme.colors.primaryHover || theme.colors.primary};
  }
`;

export const Copyright = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text.disabled || theme.text.tertiary};
  margin: 0;
  font-weight: 400;
`;
