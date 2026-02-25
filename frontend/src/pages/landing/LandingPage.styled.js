import styled from "styled-components";

export const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.background.main};
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

export const HeaderContainer = styled.header`
  padding: 24px 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.background.paper}F2; /* 95% opacity */
  backdrop-filter: blur(10px);
  box-shadow: ${({ theme }) => theme.shadow};
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  @media (max-width: 768px) {
    padding: 16px 24px;
  }
`;

export const HeaderLogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const HeaderLogoWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const RotatedIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(-45deg);
`;

export const HeaderTitle = styled.h1`
  font-size: 24px;
  font-weight: 800;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;

  span {
    font-weight: 400;
    color: ${({ theme }) => theme.text.tertiary || theme.text.secondary};
    font-size: 18px;
  }
`;

export const HeaderRegisterButton = styled.button`
  padding: 12px 24px;
  background-color: transparent;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.25s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.text.inverse || 'white'};
  }
`;

export const MainContainer = styled.main`
  max-width: 1440px;
  margin: 0 auto;
  padding: 80px 80px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    padding: 48px 24px;
    gap: 48px;
  }
`;

export const HeroContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const HeroBadge = styled.div`
  display: inline-block;
  padding: 8px 16px;
  background-color: ${({ theme }) => `${theme.colors.primary}15`};
  color: ${({ theme }) => theme.colors.primary};
  border-radius: 30px;
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 24px;
`;

export const HeroTitle = styled.h2`
  font-size: 56px;
  font-weight: 900;
  color: ${({ theme }) => theme.text.primary};
  line-height: 1.2;
  margin-bottom: 24px;

  span {
    color: ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: 768px) {
    font-size: 40px;
  }
`;

export const HeroDescription = styled.p`
  font-size: 20px;
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.8;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

export const HeroStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const HeroStatCard = styled.div`
  padding: 24px;
  background-color: ${({ theme }) => theme.background.paper};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow};
  text-align: center;
  transition: transform 0.25s ease;
  cursor: default;
  border: 1px solid ${({ theme }) => theme.border};

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadowHover};
  }
`;

export const CenteredIconWrapper = styled.div`
  margin: 0 auto 12px;
  display: flex;
  justify-content: center;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const StatValue = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 4px;
`;

export const StatDesc = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
`;

export const ActionCardContainer = styled.div`
  background-color: ${({ theme }) => theme.background.paper};
  border-radius: 32px;
  padding: 48px;
  box-shadow: ${({ theme }) => theme.shadowLg || theme.shadow};
  position: relative;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};

  @media (max-width: 768px) {
    padding: 32px 24px;
  }
`;

export const ActionCardBackgroundCircle = styled.div`
  position: absolute;
  top: -10%;
  right: -10%;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, ${({ theme }) => theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(17,24,39,0.08)'} 0%, transparent 70%);
  z-index: 0;
`;

export const ActionCardContent = styled.div`
  position: relative;
  z-index: 1;
`;

export const ActionCardTitle = styled.h3`
  font-size: 32px;
  font-weight: 900;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 12px;
  text-align: center;
`;

export const ActionCardDescription = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 40px;
`;

export const ActionButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ActionRegisterWrapper = styled.div`
  margin-top: 32px;
  padding: 24px;
  background-color: ${({ theme }) => theme.background.main};
  border-radius: 16px;
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
  border: 1px solid ${({ theme }) => theme.border};
`;

export const CheckIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.primary};
`;

export const ActionRegisterTitle = styled.strong`
  color: ${({ theme }) => theme.text.primary};
  display: block;
  margin-bottom: 4px;
`;

export const ActionRegisterButton = styled.button`
  margin-top: 12px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 800;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;

  &:hover {
    text-decoration: underline;
  }
`;

export const ActionButtonStyled = styled.button`
  padding: 24px;
  background-color: ${({ $isHovered, theme }) =>
    $isHovered ? theme.background.hover : theme.background.paper};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 20px;
  transform: ${({ $isHovered }) => ($isHovered ? "translateY(-2px)" : "translateY(0)")};
  box-shadow: ${({ $isHovered, theme }) => ($isHovered ? theme.shadowHover : "none")};
  width: 100%;
  text-align: left;
`;

export const ActionIconWrapper = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background-color: ${({ $isHovered, theme, $color }) =>
    $isHovered ? $color : `${$color}15`};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.25s ease;
  color: ${({ $isHovered, theme }) =>
    $isHovered ? (theme.mode === 'dark' ? theme.text.inverse : 'white') : theme.text.primary};
`;

export const ActionTextWrapper = styled.div`
  flex: 1;
`;

export const ActionLabel = styled.div`
  font-size: 18px;
  font-weight: 900;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 4px;
`;

export const ActionSubText = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 600;
`;

export const ActionArrowWrapper = styled.div`
  opacity: ${({ $isHovered }) => ($isHovered ? 1 : 0)};
  transform: ${({ $isHovered }) => ($isHovered ? "translateX(0)" : "translateX(-10px)")};
  transition: all 0.25s ease;
  color: ${({ theme }) => theme.text.primary};
`;
