import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: ${({ theme }) => theme.background.secondary};
  padding: 24px;
`;

// 로딩 상태
export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;
`;

export const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid ${({ theme }) => theme.border};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export const LoadingText = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 500;
`;

// 에러 상태
export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;
`;

export const ErrorText = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.status.error};
  font-weight: 500;
`;

export const RetryButton = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.inverse};
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    filter: brightness(0.9);
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

export const UserInfo = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
`;

/* ===== 3단 탭 버튼 ===== */
export const MainTabContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  padding: 4px;
  background: ${({ theme }) => theme.background.paper};
  border-radius: 12px;
  padding: 6px;
  box-shadow: ${({ theme }) => theme.shadow};
`;

export const MainTab = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px;
  gap: 8px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.2s ease;
  
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : 'transparent'};
    
  color: ${({ $active, theme }) =>
    $active ? theme.text.inverse : theme.text.secondary};

  &:hover {
    background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.background.hover};
  }
`;

export const TabIcon = styled.span`
  font-size: 18px;
`;

export const TabText = styled.span``;

export const TabContent = styled.div`
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

/* ===== 탭 1: 대시보드 ===== */

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadowLg || theme.shadow};
  }
`;

export const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $color }) => $color ? `${$color}20` : '#F3F4F6'};
  color: ${({ $color }) => $color || '#6B7280'};
`;

export const StatInfo = styled.div`
  flex: 1;
`;

export const StatLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 4px;
`;

export const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  gap: 8px;
  margin: 0;
`;

export const SectionIcon = styled.span`
  font-size: 20px;
`;

/* 좌측 패널: 휴가 승인 대기 */
export const LeftPanel = styled.div`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 16px;
  padding: 24px;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
`;

export const LeaveTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

export const TableHeader = styled.thead`
  background: ${({ theme }) => theme.background.secondary};
`;

export const TableHeaderCell = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.secondary};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  width: ${({ width }) => width || 'auto'};
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  &:hover {
    background: ${({ theme }) => theme.background.hover};
  }
  
  &:last-child td {
    border-bottom: none;
  }
`;

export const TableCell = styled.td`
  padding: 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.text.primary};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  vertical-align: middle;
`;

export const LeaveTypeBadge = styled.span`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  background: ${({ theme }) => theme.background.secondary};
  color: ${({ theme }) => theme.text.secondary};
`;

export const ActionButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

export const ActionButton = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;

  ${({ $type, theme }) =>
    $type === 'approve' && `
      background: ${theme.status.success};
      color: white;
      &:hover { filter: brightness(0.9); }
    `}

  ${({ $type, theme }) =>
    $type === 'reject' && `
      background: ${theme.status.error};
      color: white;
      &:hover { filter: brightness(0.9); }
    `}
`;

export const EmptyMessage = styled.div`
  padding: 40px;
  text-align: center;
  color: ${({ theme }) => theme.text.secondary};
  font-size: 14px;
  background: ${({ theme }) => theme.background.secondary};
  border-radius: 8px;
`;

/* 우측 패널: 부서별 현황 */
export const RightPanel = styled.div`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 16px;
  padding: 24px;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
`;

export const DepartmentCards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const DepartmentCard = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  overflow: hidden;
`;

export const DepartmentCardHeader = styled.div`
  padding: 12px 16px;
  background: ${({ theme }) => theme.background.secondary};
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

export const DepartmentName = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.text.primary};
`;

export const DepartmentTotal = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text.tertiary};
`;

export const DepartmentCardBody = styled.div`
  padding: 12px 16px;
`;

export const DepartmentStatRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const DepartmentStatLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
`;

export const StatDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

export const DepartmentStatValue = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
`;

/* ===== 탭 2: 직원별 실시간 현황 ===== */

export const TabHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background: ${({ theme }) => theme.background.paper};
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
`;

export const TabTitle = styled.h2`
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  gap: 8px;
  margin: 0;
`;

export const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  color: ${({ theme }) => theme.text.primary};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.background.hover};
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const EmployeeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
`;

export const EmployeeCard = styled.div`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 12px;
  padding: 20px;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadowLg};
  }
`;

export const EmployeeCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const EmployeeName = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
`;

export const StatusBadge = styled.span`
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  
  ${({ $status, theme }) => {
    switch ($status) {
      case 'PRESENT': return `background: ${theme.status.success}20; color: ${theme.status.success};`;
      case 'LATE': return `background: ${theme.status.warning}20; color: ${theme.status.warning};`;
      case 'ABSENT': return `background: ${theme.status.error}20; color: ${theme.status.error};`;
      case 'VACATION': return `background: ${theme.status.info}20; color: ${theme.status.info};`;
      default: return `background: ${theme.background.secondary}; color: ${theme.text.secondary};`;
    }
  }}
`;

export const EmployeeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const EmployeeDepartment = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
`;

export const EmployeeTime = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text.tertiary};
  margin-top: 4px;
`;

/* ===== 탭 3: 근태 특이사항 ===== */

export const InfoBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: ${({ theme }) => `${theme.status.info}15`};
  border: 1px solid ${({ theme }) => `${theme.status.info}30`};
  border-radius: 8px;
  margin-bottom: 24px;
  color: ${({ theme }) => theme.status.info};
  font-size: 14px;
`;

export const DateRangeInput = styled.input`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  font-size: 14px;
  background: ${({ theme }) => theme.background.paper};
  color: ${({ theme }) => theme.text.primary};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const ResultCount = styled.div`
  margin-bottom: 12px;
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};

  strong {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const AbnormalTable = styled(LeaveTable)`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow};
`;
