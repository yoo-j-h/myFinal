import styled from "styled-components";

/**
 * ✅ 이 페이지는 Layout(사이드바/탑바) 바깥을 책임지지 않음.
 * ✅ default layout 내부에서 렌더링되는 "컨텐츠"만 스타일링.
 */

export const PageContainer = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 32px 48px;

  @media (max-width: 1440px) {
    padding: 24px 32px;
  }

  @media (max-width: 1024px) {
    padding: 20px 24px;
  }
`;

// ==================== Header ====================
export const PageHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 12px;
  }
`;

export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const BreadcrumbText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
  margin: 0;
`;

export const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

export const PageSubtitle = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.text.secondary};
  margin: 0;
`;

// ==================== Filter Section ====================
export const FilterSection = styled.section`
  display: flex;
  gap: 16px;
  padding: 20px;
  background-color: ${({ theme }) => theme.background.secondary};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow};
  margin-bottom: 20px;
  flex-wrap: wrap;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 180px;
`;

export const FilterLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
`;

export const FilterButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

export const FilterButton = styled.button`
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid ${(props) => (props.$active ? props.theme.colors.primary : props.theme.border)};
  background-color: ${(props) => (props.$active ? props.theme.background.secondary : props.theme.background.paper)};
  color: ${(props) => (props.$active ? props.theme.colors.primary : props.theme.text.secondary)};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => (props.$active ? props.theme.background.hover : props.theme.background.secondary)};
    filter: brightness(0.95);
  }
`;

export const DateInput = styled.input`
  padding: 10px 14px;
  font-size: 14px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  background-color: ${({ theme }) => theme.background.input};
  color: ${({ theme }) => theme.text.primary};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

export const CitySelect = styled.select`
  padding: 10px 14px;
  font-size: 14px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  background-color: ${({ theme }) => theme.background.input};
  color: ${({ theme }) => theme.text.primary};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

export const SearchButton = styled.button`
  align-self: flex-end;
  padding: 10px 28px;
  font-size: 15px;
  font-weight: 700;
  background: ${props => `linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.secondary} 100%)`};
  color: ${({ theme }) => theme.text.inverse || 'white'};
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px ${props => props.theme.colors.primary}38;
  }

  &:active {
    transform: translateY(0);
  }
`;

// ==================== Flight List ====================
export const FlightListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FlightCard = styled.div`
  background-color: ${({ theme }) => theme.background.secondary};
  border-radius: 14px;
  padding: 22px;
  box-shadow: ${({ theme }) => theme.shadow};
  transition: box-shadow 0.2s, transform 0.2s;
  cursor: pointer;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadowHover};
    transform: translateY(-2px);
  }
`;

export const MessageContainer = styled.div`
  padding: 40px;
  text-align: center;
  color: ${({ theme }) => theme.text.secondary};
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

export const FlightBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const AirlineIcon = styled.div`
  width: 46px;
  height: 46px;
  background: ${props => `linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.secondary} 100%)`};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: ${({ theme }) => theme.text.inverse || 'white'};
`;

export const FlightNumber = styled.h3`
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

export const FlightDate = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  margin: 4px 0 0 0;
`;

export const StatusBadgeGroup = styled.div`
  display: flex;
  gap: 8px;
`;

export const StatusBadge = styled.span`
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 700;
  border-radius: 999px;

  background-color: ${(props) => (props.$status === "normal" ? `${props.theme.colors.primary}15` : `${props.theme.status.success}15`)};
  color: ${(props) => (props.$status === "normal" ? props.theme.colors.primary : props.theme.status.success)};
`;

// ==================== Flight Route ====================

export const FlightRoute = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 14px;
  }
`;

export const RoutePoint = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

export const RouteTime = styled.p`
  font-size: 24px;
  font-weight: 800;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

export const RouteCode = styled.p`
  font-size: 16px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
`;

export const RouteAirport = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  margin: 0;
`;

export const RouteIndicator = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
`;

export const AirplaneIcon = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: ${({ theme }) => `${theme.colors.primary}15`};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
`;

export const RouteLine = styled.div`
  width: 100%;
  height: 2px;
  background: ${props => `linear-gradient(90deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.secondary} 100%)`};
  border-radius: 2px;
`;

export const RouteDuration = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  margin: 0;
`;

// ==================== 캘린더 관련 스타일 (직원용) ====================
export const CalendarSection = styled.section`
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
`;

export const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const MonthTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

export const NavButtons = styled.div`
  display: flex;
  gap: 8px;
`;

export const NavButton = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.background.input || '#f3f4f6'};
  border: 1px solid ${({ theme }) => theme.border || '#e5e7eb'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${({ theme }) => theme.text.primary || '#111827'};

  &:hover {
    background: ${({ theme }) => theme.colors.primary || '#3b82f6'};
    color: #ffffff;
    border-color: ${({ theme }) => theme.colors.primary || '#3b82f6'};
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
`;

export const DayHeader = styled.div`
  padding: 12px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.$isWeekend ? '#ef4444' : '#374151'};
  background: #f9fafb;
  border-radius: 8px;
`;

export const DayCell = styled.div`
  position: relative;
  min-height: 80px;
  padding: 8px;
  background: ${props => {
    if (props.$isOtherMonth) return '#f9fafb';
    if (props.$isSelected) return '#eff6ff';
    if (props.$isToday) return '#fef3c7';
    return '#ffffff';
  }};
  border: 2px solid ${props => {
    if (props.$isSelected) return props.theme.colors?.primary || '#3b82f6';
    if (props.$isToday) return '#fbbf24';
    return '#e5e7eb';
  }};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$isOtherMonth ? '#f3f4f6' : '#f0f9ff'};
    border-color: ${props => props.theme.colors?.primary || '#3b82f6'};
  }
`;

export const DayNumber = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
`;

export const ScheduleDot = styled.div`
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: ${props => Math.min(props.$count * 6, 24)}px;
  height: 6px;
  background: ${props => props.$color || props.theme.colors?.primary || '#3b82f6'};
  border-radius: 3px;
`;

export const Legend = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;
`;

export const LegendDot = styled.div`
  width: 12px;
  height: 12px;
  background: ${props => props.$color || props.theme.colors?.primary || '#3b82f6'};
  border-radius: 50%;
`;

export const ScheduleListSection = styled.section`
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
`;

export const ScheduleListTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 16px 0;
`;

export const ScheduleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ScheduleItem = styled.div`
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  border-left: 4px solid ${props => props.theme.colors?.primary || '#3b82f6'};
`;

export const ScheduleItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export const ScheduleItemTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
`;

export const ScheduleItemCode = styled.div`
  font-size: 12px;
  color: #6b7280;
  background: #e5e7eb;
  padding: 4px 8px;
  border-radius: 4px;
`;

export const ScheduleItemTime = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

export const EmptyMessage = styled.div`
  padding: 40px;
  text-align: center;
  color: #9ca3af;
  font-size: 14px;
`;

export const LoadingContainer = styled.div`
  padding: 60px;
  text-align: center;
  color: #6b7280;
  font-size: 16px;
`;

export const ErrorContainer = styled.div`
  padding: 60px;
  text-align: center;
`;

export const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 16px;
  margin-bottom: 16px;
`;

export const RetryButton = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  background: ${props => props.theme.colors?.primary || '#3b82f6'};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors?.primaryHover || props.theme.colors?.primary || '#2563eb'};
    transform: translateY(-2px);
  }
`;