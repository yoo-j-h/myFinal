import styled from 'styled-components';

// 전체 컨테이너
export const DashboardContainer = styled.div`
  display: flex;
  min-height: 100%;
  background: ${({ theme }) => theme.background.secondary || theme.background.main};
  width: 100%;
`;

// 메인 컨텐츠 영역
export const MainContent = styled.main`
  flex: 1;
  width: 100%;
  padding: 32px 40px;
  
  @media (max-width: 1024px) {
    padding: 24px;
  }
`;

// ============ 출퇴근 배너 ============
export const AttendanceBanner = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.secondary} 100%);
  border-radius: 16px;
  padding: 32px 40px;
  margin-bottom: 32px;
  box-shadow: 0 4px 20px rgba(0, 85, 170, 0.15);
`;

export const BannerContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const BannerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const BannerLabel = styled.span`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
`;

export const BannerTitle = styled.h2`
  font-size: 24px;
  color: white;
  font-weight: 700;
  margin: 0;
`;

export const BannerTime = styled.div`
  font-size: 48px;
  font-weight: 700;
  color: white;
  letter-spacing: -1px;
`;

// ============ 통계 카드 ============
export const StatisticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 16px;
  padding: 24px;
  border-left: 4px solid ${props => props.color || props.theme.colors.primary};
  box-shadow: ${({ theme }) => theme.shadow};
  transition: all 0.3s;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadowHover};
    transform: translateY(-4px);
  }
`;

export const StatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

export const StatIcon = styled.span`
  font-size: 32px;
`;

export const StatLabel = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 500;
`;

export const StatValue = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 8px;
  line-height: 1;
`;

export const StatUnit = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.text.tertiary};
  font-weight: 500;
  margin-left: 4px;
`;

export const StatSubInfo = styled.div`
  font-size: 13px;
  color: ${props => props.$positive ? props.theme.status.success : props.theme.text.secondary};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;

  &::before {
    content: '${props => props.$positive ? '↑' : '•'}';
    font-size: 14px;
  }
`;

// ============ 메인 그리드 (일정 + 알림) ============
export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

// ============ 일정 섹션 ============
export const ScheduleSection = styled.section`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 16px;
  padding: 32px;
  box-shadow: ${({ theme }) => theme.shadow};
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

export const SectionAction = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => `${theme.colors.primary}15`};
  }
`;

export const ScheduleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ScheduleItem = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  border-radius: 12px;
  background: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border};
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => `${theme.colors.primary}05`};
  }
`;

export const ScheduleTime = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  min-width: 60px;
`;

export const ScheduleContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const ScheduleTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

export const ScheduleSubtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
  margin: 0;
`;

export const ScheduleStatus = styled.span`
  padding: 6px 16px;
  border-radius: 20px;
  background: ${props => props.color || props.theme.text.tertiary};
  color: white;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
`;

// ============ 우측 패널 (건강 + 알림) ============
export const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const HealthSection = styled.section`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 16px;
  padding: 32px;
  box-shadow: ${({ theme }) => theme.shadow};
`;

export const HealthScore = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin: 24px 0;
`;

export const ScoreValue = styled.div`
  font-size: 56px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  line-height: 1;
`;

export const ScoreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  flex: 1;
`;

export const ScoreItem = styled.div`
  text-align: center;
`;

export const ScoreGrade = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: ${props => {
    if (props.$grade === 'A') return props.theme.status.success;
    if (props.$grade === 'B+') return props.theme.status.warning;
    return props.theme.text.tertiary;
  }};
  color: white;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 8px;
`;

export const ScoreLabel = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 500;
`;

export const HealthActionButton = styled.button`
  width: 100%;
  padding: 14px;
  background: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

// ============ 알림 섹션 ============
export const NotificationSection = styled.section`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 16px;
  padding: 32px;
  box-shadow: ${({ theme }) => theme.shadow};
`;

export const NotificationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const NotificationItem = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border};
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => `${theme.colors.primary}05`};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const NotificationIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${props => props.color || props.theme.colors.primary};
  color: white;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const NotificationContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const NotificationTitle = styled.h4`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

export const NotificationMessage = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
  margin: 0;
`;

export const NotificationTime = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.text.tertiary};
`;

// ============ 성과 섹션 ============
export const PerformanceSection = styled.section`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 16px;
  padding: 32px;
  box-shadow: ${({ theme }) => theme.shadow};
`;

export const PerformanceButton = styled.button`
  padding: 10px 20px;
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    filter: brightness(0.9);
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadowHover};
  }
`;

export const PerformanceChart = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-top: 24px;
`;

export const ChartBar = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr 120px;
  align-items: center;
  gap: 24px;
`;

export const ChartLabel = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
`;

export const ChartProgress = styled.div`
  height: 12px;
  background: ${({ theme }) => theme.border};
  border-radius: 6px;
  overflow: hidden;
  position: relative;
`;

export const ChartFill = styled.div`
  height: 100%;
  width: ${props => props.width}%;
  background: ${props => props.color || props.theme.colors.primary};
  border-radius: 6px;
  transition: width 0.6s ease;
`;

export const ChartValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  text-align: right;
`;

export const ChartTotal = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.text.tertiary};
  font-weight: 500;
`;