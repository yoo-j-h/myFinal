import styled from 'styled-components';

// 전체 페이지 레이아웃 (사이드바 260px 제외한 영역)
export const PageLayout = styled.div`
  display: flex;
  min-height: 100%;
  width: 100%;
  background: ${({ theme }) => theme.background.secondary || theme.background.main};
`;

// 메인 콘텐츠 영역 (사이드바 우측)
export const MainContentArea = styled.div`
  flex: 1;
  padding: 32px 48px;
  max-width: 1600px;
  margin: 0 auto;

  @media (max-width: 1440px) {
    padding: 24px 32px;
  }

  @media (max-width: 1024px) {
    margin-left: 0;
    padding: 20px 24px;
  }
`;

// ==================== 헤더 영역 ====================

export const PageHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  gap: 24px;

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 16px;
  }
`;

export const Breadcrumb = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

export const BreadcrumbItem = styled.span`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: ${props => props.$active ? '600' : '400'};
  color: ${props => props.$active ? props.theme.text.primary : props.theme.text.secondary};
  cursor: ${props => props.$active ? 'default' : 'pointer'};
  transition: color 0.2s ease;

  &:hover {
    color: ${props => props.$active ? props.theme.text.primary : props.theme.colors.primary};
  }
`;

export const BreadcrumbSeparator = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.text.tertiary};
  user-select: none;
`;

export const PageTitle = styled.h1`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const SearchButton = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.background.paper};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 18px;
  color: ${({ theme }) => theme.text.secondary};

  &:hover {
    background: ${({ theme }) => theme.background.secondary};
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const NotificationButton = styled.button`
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.background.paper};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 18px;
  color: ${({ theme }) => theme.text.secondary};

  &:hover {
    background: ${({ theme }) => theme.background.secondary};
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const NotificationBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.status.error};
  color: #ffffff;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 11px;
  font-weight: 600;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.background.paper};
`;

export const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px 8px 8px;
  background: ${({ theme }) => theme.background.paper};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.background.secondary};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.primary};
  color: #ffffff;
  border-radius: 50%;
  font-size: 18px;
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const UserName = styled.span`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  line-height: 1.2;
`;

export const UserDepartment = styled.span`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.2;
`;

// ==================== 통계 카드 ====================

export const StatsCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;

  @media (max-width: 1280px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  background: ${({ theme }) => theme.background.paper};
  border-left: 4px solid ${props => props.$color || props.theme.border};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadowHover};
  }
`;

export const StatLabel = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 4px;
`;

export const StatValue = styled.span`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 36px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin-right: 8px;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

export const StatUnit = styled.span`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.secondary};
`;

// ==================== 컨트롤 패널 ====================

export const ControlPanel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const MonthNavigator = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 16px;
  background: ${({ theme }) => theme.background.paper};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 10px;
`;

export const NavButton = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.background.secondary};
  border: none;
  border-radius: 6px;
  font-size: 18px;
  color: ${({ theme }) => theme.text.primary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: #ffffff;
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const CurrentMonth = styled.span`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  min-width: 120px;
  text-align: center;
`;

export const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.background.paper};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: #ffffff;
  }
`;

// ==================== 필터 탭 ====================

export const FilterTabs = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  border-bottom: 2px solid ${({ theme }) => theme.border};
  padding-bottom: 2px;

  @media (max-width: 768px) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
`;

export const FilterTab = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 15px;
  font-weight: ${props => props.$active ? '600' : '500'};
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.text.secondary};
  background: ${props => props.$active ? `${props.theme.colors.primary}10` : 'transparent'};
  border: none;
  border-bottom: 2px solid ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  position: relative;
  bottom: -2px;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => `${theme.colors.primary}05`};
  }
`;

export const TabIcon = styled.span`
  font-size: 16px;
`;

export const TabLabel = styled.span``;

export const TabBadge = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.$active ? props.theme.colors.secondary : props.theme.text.tertiary};
`;

// ==================== 스케줄 테이블 ====================

export const ScheduleTableWrapper = styled.div`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow};
  overflow: hidden;
`;

export const ScheduleTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHeader = styled.thead`
  background: ${({ theme }) => theme.background.secondary};
  border-bottom: 2px solid ${({ theme }) => theme.border};
`;

export const TableHeaderCell = styled.th`
  padding: 16px 20px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.secondary};
  text-align: left;
  white-space: nowrap;

  &:first-child {
    padding-left: 28px;
  }

  &:last-child {
    text-align: center;
  }
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.border};
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.background.hover};
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const TableCell = styled.td`
  padding: 16px 20px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  color: ${({ theme }) => theme.text.primary};
  vertical-align: middle;

  &:first-child {
    padding-left: 28px;
  }

  &:last-child {
    text-align: center;
  }
`;

export const FlightNumber = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
`;

export const RouteCode = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.text.secondary};
`;

export const RouteArrow = styled.span`
  margin: 0 8px;
  color: ${({ theme }) => theme.text.tertiary};
`;

export const FlightTime = styled.span`
  font-weight: 500;
`;

export const Duration = styled.span`
  margin-right: 8px;
  font-weight: 500;
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.$type === '완결' ? props.theme.status.success : props.theme.colors.primary};
  background: ${props => props.$type === '완결' ? `${props.theme.status.success}15` : `${props.theme.colors.primary}15`};
  border-radius: 6px;
`;

export const PassengerCount = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.text.secondary};
`;

export const CrewSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const CrewMember = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const CrewRole = styled.span`
  display: inline-block;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 6px;
`;

export const CrewName = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
`;

export const CrewBadge = styled.span`
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.secondary};
  background: ${({ theme }) => theme.background.secondary};
  border-radius: 4px;
`;

export const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.background.paper};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: #ffffff;
  }

  &:active {
    transform: scale(0.98);
  }
`;

// ==================== 캘린더 관련 스타일 ====================

export const CalendarSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`;

export const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const MonthTitle = styled.h2`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #1d2838;
  margin: 0;
`;

export const NavButtons = styled.div`
  display: flex;
  gap: 8px;
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-bottom: 24px;
`;

export const DayHeader = styled.div`
  text-align: center;
  padding: 12px 0;
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.$isWeekend ? '#ef4444' : '#6b7280'};
`;

export const DayCell = styled.div`
  aspect-ratio: 1;
  border: 1px solid ${props => props.$isToday ? '#2563eb' : '#e5e7eb'};
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  background: ${props => {
    if (props.$isSelected) return '#1e40af';
    if (props.$isToday) return '#dbeafe';
    return 'white';
  }};
  color: ${props => {
    if (props.$isSelected) return 'white';
    if (props.$isOtherMonth) return '#d1d5db';
    return '#1f2937';
  }};
  position: relative;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  &:hover {
    background: ${props => props.$isSelected ? '#1e40af' : '#f9fafb'};
    border-color: ${props => props.$isSelected ? '#1e40af' : '#d1d5db'};
  }
`;

export const DayNumber = styled.div`
  font-size: 14px;
  font-weight: 600;
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

export const ScheduleDotOld = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #3b82f6;
  margin-top: 4px;
`;

export const Legend = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #6b7280;
`;

export const LegendDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.$color || '#6b7280'};
`;

export const ScheduleListSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const ScheduleListTitle = styled.h3`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #1d2838;
  margin: 0 0 16px 0;
`;

export const ScheduleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ScheduleItem = styled.div`
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
  transition: all 0.2s;

  &:hover {
    border-color: #0284c7;
    background: #eff6ff;
  }
`;

export const ScheduleItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export const ScheduleItemTitle = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #1d2838;
`;

export const ScheduleItemCode = styled.span`
  font-size: 12px;
  padding: 4px 8px;
  background: #e0e7ff;
  color: #4f46e5;
  border-radius: 4px;
  font-weight: 500;
`;

export const ScheduleItemTime = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

export const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #9ca3af;
  font-size: 14px;
`;

// ==================== 관리자용 스타일 ====================

export const RoleFilter = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

export const RoleFilterLabel = styled.span`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
`;

export const RoleFilterButton = styled.button`
  padding: 8px 16px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.$active ? '#ffffff' : '#6b7280'};
  background: ${props => props.$active ? '#0284c7' : '#ffffff'};
  border: 1px solid ${props => props.$active ? '#0284c7' : '#e5e7eb'};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$active ? '#0284c7' : '#f9fafb'};
    border-color: #0284c7;
  }
`;

export const EmpName = styled.span`
  font-weight: 600;
  color: #1d2838;
`;

export const ScheduleCode = styled.span`
  padding: 4px 8px;
  background: #e0e7ff;
  color: #4f46e5;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
`;

// ==================== 공통 스타일 ====================

export const LoadingContainer = styled.div`
  text-align: center;
  padding: 60px;
  color: #6b7280;
  font-size: 16px;
`;

export const ErrorContainer = styled.div`
  text-align: center;
  padding: 60px;
`;

export const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 16px;
  margin-bottom: 16px;
`;

export const RetryButton = styled.button`
  padding: 10px 20px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  background: #0284c7;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #0369a1;
  }
`;