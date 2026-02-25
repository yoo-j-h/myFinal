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

export const PageHeader = styled.div`
  margin-bottom: 32px;
`;

export const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin: 0 0 8px 0;
`;

export const PageDescription = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.text.secondary};
  margin: 0;
`;

export const ControlBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const SearchInputWrapper = styled.div`
  position: relative;
  flex: 1;
  max-width: 500px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export const SearchIcon = styled.span`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  color: ${({ theme }) => theme.text.tertiary};
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 14px 16px 14px 48px;
  font-size: 15px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.background.input};
  color: ${({ theme }) => theme.text.primary};
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}1a`};
  }

  &::placeholder {
    color: ${({ theme }) => theme.text.tertiary};
  }
`;

export const ViewToggle = styled.div`
  display: flex;
  gap: 4px;
  background-color: ${({ theme }) => theme.background.paper};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 4px;
`;

export const ViewButton = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  background-color: ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.$active ? props.theme.text.inverse : props.theme.text.secondary};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.$active ? props.theme.colors.secondary : props.theme.background.hover};
  }
`;

// Grid View
export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const TenantCard = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.background.paper};
  border-radius: 12px;
  padding: 24px;
  box-shadow: ${({ theme }) => theme.shadow || '0 1px 3px rgba(0, 0, 0, 0.05)'};
  transition: all 0.2s;
  box-sizing: border-box;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadowHover || '0 4px 12px rgba(0, 0, 0, 0.1)'};
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

export const TenantIcon = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => `${theme.colors.primary}10`};
  border-radius: 12px;
  font-size: 24px;
`;

export const TenantName = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

export const CardBody = styled.div`
  margin-bottom: 16px;
`;

export const TenantId = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 8px;
`;

export const PlanBadge = styled.span`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 12px;
  background-color: ${props => {
    if (props.plan === 'Enterprise') return `${props.theme.colors.primary}20`; // Assuming purple is primary related or specific color needed? Keeping consistent with original intent but using theme logic if possible, or keeping specific colors if they are distinct from theme.
    // Actually, Enterprise was purple, Professional was blue. Let's use theme colors if possible or static colors if they imply specific tiers.
    // Original: Enterprise #f3e8ff (purple-100), Professional #dbeafe (blue-100), Basic #f1f3f5 (gray-100)
    // Let's keep specific colors but maybe use theme variables for base if available, or just hardcoded for these specific business logic badges.
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

export const EmployeeCount = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text.primary};
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

export const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  background-color: ${props => {
    if (props.$status === 'active') return `${props.theme.status.success}20`;
    if (props.$status === 'payment-pending') return `${props.theme.status.warning}20`;
    if (props.$status === 'inactive') return `${props.theme.status.error}20`;
    return props.theme.background.secondary;
  }};
  color: ${props => {
    if (props.$status === 'active') return props.theme.status.success;
    if (props.$status === 'payment-pending') return props.theme.status.warning;
    if (props.$status === 'inactive') return props.theme.status.error;
    return props.theme.text.secondary;
  }};
`;

export const StatusIcon = styled.span`
  font-size: 14px;
`;

export const ViewDetailButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.inverse};
  background-color: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

export const CardActions = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
`;

export const ActionButton = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  border-radius: 6px;
  font-size: 20px;
  color: ${({ theme }) => theme.text.secondary};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.background.hover};
  }
`;

// Table View
export const TableContainer = styled.div`
  background-color: ${({ theme }) => theme.background.paper};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow || '0 1px 3px rgba(0, 0, 0, 0.05)'};
  overflow-x: auto;
  box-sizing: border-box;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHead = styled.thead`
  background-color: ${({ theme }) => theme.background.secondary};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.border};
  }

  &:hover {
    background-color: ${({ theme }) => theme.background.hover};
  }
`;

export const TableHeader = styled.th`
  padding: 16px 20px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  white-space: nowrap;
`;

export const TableCell = styled.td`
  padding: 18px 20px;
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
  vertical-align: middle;
`;

export const TenantInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const TenantIconSmall = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => `${theme.colors.primary}10`};
  border-radius: 8px;
  font-size: 18px;
`;

export const TenantNameText = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
`;

export const ViewDetailButtonSmall = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.text.inverse};
  }
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
