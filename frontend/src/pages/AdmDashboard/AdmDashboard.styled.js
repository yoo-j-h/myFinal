import styled from 'styled-components';

export const MainContainer = styled.div`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 32px 40px;
  background: ${({ theme }) => theme.background.secondary};
  min-height: 100vh;

  @media (max-width: 1024px) {
    padding: 24px 20px;
  }
`;

/* ===== 헤더 ===== */
export const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28px 40px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.secondary} 100%);
  border-radius: 16px;
  margin-bottom: 32px;
  box-shadow: ${({ theme }) => theme.shadow || '0 4px 20px rgba(0, 0, 0, 0.15)'};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    padding: 24px;
  }
`;

export const GreetingSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const GreetingIcon = styled.div`
  font-size: 40px;
  animation: wave 1.5s ease-in-out infinite;

  @keyframes wave {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(20deg); }
    75% { transform: rotate(-20deg); }
  }
`;

export const GreetingText = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  margin-bottom: 4px;
`;

export const DateDisplay = styled.div`
  font-size: 24px;
  color: ${({ theme }) => theme.text.inverse};
  font-weight: 700;
  letter-spacing: -0.5px;
`;

export const CurrentTime = styled.div`
  font-size: 40px;
  font-weight: 800;
  color: ${({ theme }) => theme.text.inverse};
  font-family: 'Segoe UI', system-ui, sans-serif;
  letter-spacing: -2px;

  @media (max-width: 768px) {
    font-size: 40px;
  }
`;

/* ===== 통계 카드 ===== */
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 16px;
  padding: 28px 24px;
  box-shadow: ${({ theme }) => theme.shadow};
  transition: all 0.3s ease;
  border-left: 4px solid ${props => props.color || props.theme.colors.primary};

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadowLg || '0 8px 30px rgba(0, 0, 0, 0.12)'};
  }
`;

export const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  background: ${props => props.color ? `${props.color}15` : ({ theme }) => `${theme.colors.primary}15`};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  font-size: 24px;
  color: ${props => props.color || props.theme.colors.primary};
`;

export const StatLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 8px;
  font-weight: 500;
`;

export const StatValue = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 8px;

  span {
    font-size: 32px;
    font-weight: 700;
    color: ${({ theme }) => theme.text.primary};
    letter-spacing: -1px;
  }
`;

export const StatUnit = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.text.tertiary};
  font-weight: 500;
`;

export const StatTrend = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text.tertiary};
  display: flex;
  align-items: center;
  gap: 4px;
`;

/* ===== 콘텐츠 그리드 ===== */
export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

/* ===== 공통 섹션 스타일 ===== */
export const ScheduleSection = styled.div`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 16px;
  padding: 24px;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
`;

/* ===== 일정 리스트 ===== */
export const ScheduleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.border};
    border-radius: 4px;
  }
`;

export const ScheduleItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background: ${({ theme }) => theme.background.main};
  border-radius: 12px;
  border: 1px solid transparent;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateX(4px);
    box-shadow: ${({ theme }) => theme.shadow};
  }
`;

export const ScheduleTime = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.secondary};
  width: 80px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const ScheduleContent = styled.div`
  flex: 1;
  padding: 0 16px;
`;

export const ScheduleType = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  margin-bottom: 4px;
`;

export const ScheduleTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 4px;
`;

export const ScheduleSubtitle = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const ScheduleBadge = styled.div`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ color, theme }) => color ? `${color}15` : theme.background.secondary};
  color: ${({ color, theme }) => color || theme.text.secondary};
`;

/* ===== 사이드 패널 (건강점수 & 빠른 메뉴) ===== */
export const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const HealthScoreCard = styled(ScheduleSection)`
  background: ${({ theme }) => `linear-gradient(135deg, ${theme.background.paper} 0%, ${theme.background.secondary} 100%)`};
  min-height: 250px; /* 높이 확보 */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const HealthScoreDisplay = styled.div`
  text-align: center;
  padding: 20px 0;
`;

export const TotalScore = styled.div`
  font-size: 56px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1;
  margin-bottom: 16px;
  text-shadow: ${({ theme }) => `0 4px 12px ${theme.colors.primary}33`};
`;

export const HealthMetrics = styled.div`
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-top: 24px;
`;

export const HealthMetric = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

export const HealthGrade = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ color, theme }) => color ? `${color}15` : theme.background.secondary};
  color: ${({ color, theme }) => color || theme.text.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  border: 2px solid ${({ color, theme }) => color || theme.border};
`;

export const MetricLabel = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 500;
`;

export const ViewReportButton = styled.button`
  width: 100%;
  padding: 14px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.text.inverse};
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 10px;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
  }
`;

export const QuickMenuCard = styled(ScheduleSection)`
  flex: 1;
`;

export const QuickMenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const QuickMenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background: ${({ theme }) => theme.background.main};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;

  &:hover {
    background: ${({ theme }) => theme.background.hover};
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateX(4px);
    box-shadow: ${({ theme }) => theme.shadow};
  }
`;

export const QuickMenuIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.background.secondary};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-right: 16px;
  color: ${({ theme }) => theme.colors.primary};
`;

export const QuickMenuContent = styled.div`
flex: 1;
`;

export const QuickMenuTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 2px;
`;

export const QuickMenuStatus = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
`;

export const QuickMenuTime = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text.tertiary};
  margin-left: auto;
  font-weight: 500;
`;

export const CheckIcon = styled.div`
  color: ${({ theme }) => theme.status.success};
  font-weight: bold;
  margin-right: 8px;
`;

/* ===== 진행률 섹션 ===== */
export const ProgressSection = styled(ScheduleSection)`
  margin-top: 0;
`;

export const ProgressGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  padding: 0 16px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

export const ProgressBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ProgressLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 4px;
`;

export const ProgressTrack = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.background.main};
  border-radius: 4px;
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  height: 100%;
  background: ${props => props.color || props.theme.colors.primary};
  width: ${props => props.width}%;
  border-radius: 4px;
  transition: width 1s ease-in-out;
`;

export const ProgressValue = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text.tertiary};
  text-align: right;
  font-weight: 500;
`;