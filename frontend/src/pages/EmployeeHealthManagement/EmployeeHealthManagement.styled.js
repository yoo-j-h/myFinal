import styled from 'styled-components';

export const MainContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.background.secondary || theme.background.main};
  padding: 32px 48px;

  @media (max-width: 1024px) {
    padding: 24px;
  }
`;

export const ContentWrapper = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 16px;
  }
`;

export const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin: 0 0 8px 0;
`;

export const PageSubtitle = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.text.secondary};
  margin: 0;
`;

export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    filter: brightness(0.9);
  }

  span {
    font-size: 18px;
  }
`;

export const SearchSection = styled.form`
  background: ${({ theme }) => theme.background.paper};
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: ${({ theme }) => theme.shadow};
`;

export const SearchInputWrapper = styled.div`
  position: relative;
  margin-bottom: 20px;
  width: 100%;
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
  border: 1.5px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 15px;
  transition: border-color 0.2s;
  background: ${({ theme }) => theme.background.input || 'transparent'};
  color: ${({ theme }) => theme.text.primary};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.text.disabled};
  }
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
`;

export const FilterButton = styled.button`
  padding: 10px 20px;
  background-color: ${props => props.active ? props.theme.colors.primary : props.theme.background.secondary};
  color: ${props => props.active ? 'white' : props.theme.text.secondary};
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.active ? props.theme.colors.primary : props.theme.background.hover};
  }
`;

export const FilterDivider = styled.div`
  width: 1px;
  height: 20px;
  background-color: ${({ theme }) => theme.border};
`;

export const EmployeeCount = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 15px;
  color: ${({ theme }) => theme.text.secondary};

  strong {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 700;
  }
`;

export const FilterToggle = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    text-decoration: underline;
  }
`;

export const TableContainer = styled.table`
  width: 100%;
  background: ${({ theme }) => theme.background.paper};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow};
  border-collapse: collapse;
`;

export const TableHeader = styled.thead`
  background-color: ${({ theme }) => theme.background.secondary};
  border-bottom: 2px solid ${({ theme }) => theme.border};
`;

export const TableHeaderCell = styled.th`
  padding: 16px 20px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.secondary};
  width: ${props => props.width || 'auto'};
`;

export const TableBody = styled.tbody`
  tr:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.border};
  }
`;

export const TableRow = styled.tr`
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.background.hover};
  }

  td {
    padding: 20px;
    font-size: 14px;
    color: ${({ theme }) => theme.text.primary};
  }
`;

export const EmployeeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const EmployeeAvatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: ${props => props.color};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  flex-shrink: 0;
`;

export const EmployeeDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const EmployeeName = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
`;

export const EmployeeId = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
`;

export const DepartmentInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const DepartmentName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.primary};
`;

export const DepartmentRole = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
`;

export const DateText = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  background-color: ${props => {
    switch (props.type) {
      case 'normal':
        return `${props.theme.status.success}15`;
      case 'warning':
        return `${props.theme.status.warning}15`;
      case 'alert':
        return `${props.theme.status.error}15`;
      default:
        return props.theme.background.secondary;
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'normal':
        return props.theme.status.success;
      case 'warning':
        return props.theme.status.warning;
      case 'alert':
        return props.theme.status.error;
      default:
        return props.theme.text.secondary;
    }
  }};
`;

export const IconButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background.paper};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: ${({ theme }) => theme.text.secondary};
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.background.secondary};
    border-color: ${({ theme }) => theme.text.disabled};
    color: ${({ theme }) => theme.text.primary};
  }
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding: 0 8px;
`;

export const PageInfo = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
`;

export const PageButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid ${props => props.active ? props.theme.colors.primary : props.theme.border};
  background-color: ${props => props.active ? props.theme.colors.primary : props.theme.background.paper};
  color: ${props => props.active ? 'white' : props.theme.text.secondary};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${props => props.active ? 'white' : props.theme.colors.primary};
  }
`;