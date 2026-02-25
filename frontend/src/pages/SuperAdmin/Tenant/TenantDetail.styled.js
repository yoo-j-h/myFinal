import styled from 'styled-components';

export const MainContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.background.secondary};
  padding: 32px;
  box-sizing: border-box;
  overflow-x: hidden;

  @media (max-width: 1024px) {
    padding: 20px;
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
`;

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.secondary};
  background-color: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 24px;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.background.hover};
    color: ${({ theme }) => theme.text.primary};
  }
`;

export const TenantHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.background.paper};
  padding: 32px;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow || '0 1px 3px rgba(0, 0, 0, 0.05)'};
  margin-bottom: 24px;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    padding: 24px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 20px;
  }
`;

export const TenantHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const TenantIconLarge = styled.div`
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => `${theme.colors.primary}10`};
  border-radius: 16px;
  font-size: 36px;
`;

export const TenantHeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const TenantNameLarge = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

export const TenantId = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
`;

export const TenantHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

export const StatusBadgeLarge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  background-color: ${props => props.$status === 'active' ? `${props.theme.status.success}20` : `${props.theme.status.error}20`};
  color: ${props => props.$status === 'active' ? props.theme.status.success : props.theme.status.error};
`;

export const PlanBadgeLarge = styled.div`
  display: inline-block;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  background-color: ${props => {
    if (props.plan === 'Enterprise') return '#f3e8ff';
    if (props.plan === 'Professional') return '#dbeafe';
    return props.theme.background.secondary;
  }};
  color: ${props => {
    if (props.plan === 'Enterprise') return '#7c3aed';
    if (props.plan === 'Professional') return '#2563eb';
    return props.theme.text.secondary;
  }};
`;

export const QuickActionsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const QuickActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.background.paper};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  box-sizing: border-box;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.text.inverse};
  }

  @media (max-width: 768px) {
    padding: 12px;
    font-size: 14px;
  }
`;

export const ActionIcon = styled.span`
  font-size: 20px;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 32px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.background.paper};
  padding: 24px;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow || '0 1px 3px rgba(0, 0, 0, 0.05)'};
  transition: all 0.2s;
  box-sizing: border-box;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadowHover || '0 4px 12px rgba(0, 0, 0, 0.1)'};
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const StatIcon = styled.div`
  font-size: 28px;
  margin-bottom: 12px;
`;

export const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 8px;
`;

export const StatLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 4px;
`;

export const StatSubtext = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text.tertiary};
`;

export const TrendIndicator = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 24px;
  color: ${({ theme, $positive }) => $positive ? theme.status.success : theme.status.error};
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const InfoSection = styled.div`
  background-color: ${({ theme }) => theme.background.paper};
  padding: 24px;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow || '0 1px 3px rgba(0, 0, 0, 0.05)'};
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin: 0 0 20px 0;
`;

export const SectionIcon = styled.span`
  font-size: 22px;
`;

export const ViewAllLink = styled.a`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
    text-decoration: underline;
  }
`;

export const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

export const InfoLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.secondary};
  min-width: 140px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    min-width: 100px;
    font-size: 13px;
  }
`;

export const InfoValue = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.primary};
  text-align: right;
  flex: 1;
  word-break: break-word;
`;

export const UsageItem = styled.div`
  margin-bottom: 20px;
`;

export const UsageLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 12px;
`;

export const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.border};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
`;

export const ProgressBar = styled.div`
  width: ${props => props.$progress}%;
  height: 100%;
  background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.secondary} 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
`;

export const UsageValue = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  text-align: right;
`;

export const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ActivityItem = styled.div`
  display: flex;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

export const ActivityDot = styled.div`
  width: 8px;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
`;

export const ActivityContent = styled.div`
  flex: 1;
`;

export const ActivityAction = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 4px;
`;

export const ActivityMeta = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
`;

// Additional Components for Inline Style Replacement
export const LoadingWrapper = styled.div`
  text-align: center;
  padding: 50px;
  color: ${({ theme }) => theme.text.secondary};
`;

export const ErrorWrapper = styled.div`
  text-align: center;
  padding: 50px;
  color: ${({ theme }) => theme.status.error};
`;

export const RetryButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.background.paper};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  color: ${({ theme }) => theme.text.primary};

  &:hover {
    background-color: ${({ theme }) => theme.background.hover};
  }
`;

export const LogMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: ${({ theme }) => theme.text.secondary};
`;
