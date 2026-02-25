import styled from 'styled-components';

// 메인 레이아웃
export const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ theme }) => theme.background.secondary};
`;

export const ContentArea = styled.div`
  flex: 1;
  padding: 32px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
`;

export const Breadcrumb = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text.tertiary};
  margin-bottom: 24px;
  
  span {
    margin: 0 8px;
  }
`;

export const PageHeader = styled.div`
  margin-bottom: 32px;
`;

export const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 8px;
`;

export const PageSubtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
`;

// 통계 카드
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const StatCard = styled.div`
  background: ${({ theme }) => theme.background.main};
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px ${({ theme }) => theme.shadow};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
  border: 1px solid ${({ theme }) => theme.border};
`;

export const StatIconWrapper = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${props => props.$bgColor || props.theme.background.tertiary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$iconColor || props.theme.colors.primary};
  margin-bottom: 8px;
`;

export const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
`;

export const StatLabel = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 500;
`;

// 캘린더 섹션
export const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const CalendarSection = styled.div`
  background: ${({ theme }) => theme.background.main};
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 1px 3px ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
`;

export const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const MonthTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
`;

export const NavButtons = styled.div`
  display: flex;
  gap: 8px;
`;

export const NavButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background.main};
  color: ${({ theme }) => theme.text.secondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.background.hover};
    border-color: ${({ theme }) => theme.border};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
`;

export const DayHeader = styled.div`
  text-align: center;
  padding: 12px 0;
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.$isWeekend ? props.theme.status.error : props.theme.text.secondary};
`;

export const DayCell = styled.div`
  aspect-ratio: 1;
  border: 1px solid ${props => props.$isToday ? props.theme.colors.primary : props.theme.border};
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  background: ${props => {
    if (props.$isSelected) return props.theme.colors.primary;
    if (props.$isToday) return `${props.theme.colors.primary}1A`; // 10% opacity
    return props.theme.background.main;
  }};
  color: ${props => {
    if (props.$isSelected) return props.theme.text.inverse;
    if (props.$isOtherMonth) return props.theme.text.disabled;
    return props.theme.text.primary;
  }};
  position: relative;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  &:hover {
    background: ${props => props.$isSelected ? props.theme.colors.primary : props.theme.background.hover};
    border-color: ${props => props.$isSelected ? props.theme.colors.primary : props.theme.border};
  }
`;

export const DayNumber = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
`;

export const StatusDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${props => {
    if (props.$status === 'PRESENT' || props.$status === 'present') return props.theme.status.success;
    if (props.$status === 'LATE' || props.$status === 'late') return props.theme.status.warning;
    if (props.$status === 'EARLY_LEAVE' || props.$status === 'early_leave') return props.theme.status.warning;
    if (props.$status === 'ABSENT' || props.$status === 'absent') return props.theme.status.error;
    if (props.$status === 'VACATION' || props.$status === 'vacation') return props.theme.status.info;
    if (props.$status === 'HALF_DAY' || props.$status === 'half_day') return '#8b5cf6';
    if (props.$status === 'LEAVE_PENDING') return props.theme.status.warning;
    if (props.$status === 'LEAVE') return props.theme.status.info;
    return 'transparent';
  }};
  margin-top: 2px;
`;

export const Legend = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid ${({ theme }) => theme.border};
  flex-wrap: wrap;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
`;

export const LegendDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.$color};
`;

// 오른쪽 사이드바
export const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SidebarCard = styled.div`
  background: ${({ theme }) => theme.background.main};
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
`;

export const SidebarTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 16px;
`;

export const ScheduleItem = styled.div`
  padding: 12px;
  background: ${({ theme }) => theme.background.secondary}; // or tertiary
  border-radius: 8px;
  margin-bottom: 12px;
`;

export const ScheduleName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 4px;
`;

export const ScheduleDate = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text.secondary};
`;

export const ScheduleStatus = styled.div`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  margin-top: 8px;
  
  ${({ theme, $status }) => {
    let color = theme.colors.primary; // default
    if ($status === 'PRESENT') color = theme.status.success;
    else if (['LATE', 'EARLY_LEAVE', 'LEAVE_PENDING'].includes($status)) color = theme.status.warning;
    else if ($status === 'ABSENT') color = theme.status.error;
    else if (['VACATION', 'LEAVE', 'HALF_DAY'].includes($status)) color = theme.status.info;

    return `
      background-color: ${color}20; // 12% opacity (approx for hex 20)
      color: ${color};
    `;
  }}
`;

export const ActionButton = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: none;
  background: ${props => props.$primary ? props.theme.colors.primary : props.theme.background.main};
  color: ${props => props.$primary ? props.theme.text.inverse : props.theme.colors.primary};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid ${props => props.theme.colors.primary};
  margin-bottom: 8px;

  &:hover {
    background: ${props => props.$primary ? props.theme.colors.secondary : props.theme.background.hover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: ${props => props.$primary ? props.theme.text.disabled : props.theme.background.tertiary};
    border-color: ${({ theme }) => theme.text.disabled};
    color: ${({ theme }) => theme.text.tertiary};
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

// 로딩 & 에러
export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 16px;
  color: ${({ theme }) => theme.text.secondary};
`;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  gap: 16px;
`;

export const ErrorMessage = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.status.error};
  text-align: center;
`;

export const RetryButton = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.text.inverse};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
  }
`;
