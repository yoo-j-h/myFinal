import styled from 'styled-components';

export const PageContainer = styled.div`
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.background.secondary || theme.background.main};
`;

export const ContentWrapper = styled.div`
  padding: 40px;
  max-width: 1600px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    padding: 24px;
  }
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
`;

export const PageTitle = styled.h1`
  font-size: 26px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

export const EmployeeCount = styled.span`
  color: ${({ theme }) => theme.text.secondary};
  font-size: 15px;
  font-weight: 500;
`;

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    filter: brightness(0.9);
    transform: translateY(-2px);
  }
`;

export const FilterSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 20px;

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const SearchForm = styled.form`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.background.paper};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 10px 16px;
  width: 300px;
  gap: 10px;

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const SearchInput = styled.input`
  border: none;
  outline: none;
  font-size: 14px;
  width: 100%;
  background: transparent;
  color: ${({ theme }) => theme.text.primary};

  &::placeholder {
    color: ${({ theme }) => theme.text.disabled};
  }
`;

export const FilterGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const FilterButton = styled.button`
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid ${props => props.$active ? props.theme.colors.primary : props.theme.border};
  background: ${props => props.$active ? props.theme.colors.primary : props.theme.background.paper};
  color: ${props => props.$active ? 'white' : props.theme.text.secondary};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${props => props.$active ? 'white' : props.theme.colors.primary};
  }
`;

export const TableContainer = styled.div`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow};
  overflow: hidden;
  margin-bottom: 32px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const Th = styled.th`
  text-align: left;
  padding: 16px 24px;
  background: ${({ theme }) => theme.background.secondary};
  color: ${({ theme }) => theme.text.secondary};
  font-size: 13px;
  font-weight: 600;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  white-space: nowrap;
`;

export const Tr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.border};
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.background.hover};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

export const Td = styled.td`
  padding: 16px 24px;
  font-size: 14px;
  color: ${({ theme }) => theme.text.primary};
  vertical-align: middle;
`;

export const ProfileImage = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${props => props.color || props.theme.text.tertiary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
`;

export const NameInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Name = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
`;

export const Email = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.text.tertiary};
`;

export const DepartmentBadge = styled.span`
  background: ${({ theme }) => `${theme.colors.primary}15`};
  color: ${({ theme }) => theme.colors.primary};
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
`;

export const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.text.secondary};
  font-size: 13px;
`;

export const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  
  ${props => {
    switch (props.$status) {
      case '재직':
        return `background: ${props.theme.status.success}15; color: ${props.theme.status.success};`;
      case '휴직':
        return `background: ${props.theme.status.warning}15; color: ${props.theme.status.warning};`;
      case '퇴직':
        return `background: ${props.theme.status.error}15; color: ${props.theme.status.error};`;
      default:
        return `background: ${props.theme.text.tertiary}15; color: ${props.theme.text.tertiary};`;
    }
  }}
`;

export const MoreButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text.tertiary};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;

  &:hover {
    background: ${({ theme }) => theme.background.secondary};
    color: ${({ theme }) => theme.text.primary};
  }
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

export const PaginationButton = styled.button`
  width: 36px;
  height: 36px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background.paper};
  border-radius: 6px;
  cursor: pointer;
  color: ${({ theme }) => theme.text.secondary};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const PageNumber = styled.button`
  width: 36px;
  height: 36px;
  border: 1px solid ${props => props.$active ? props.theme.colors.primary : props.theme.border};
  background: ${props => props.$active ? props.theme.colors.primary : props.theme.background.paper};
  color: ${props => props.$active ? 'white' : props.theme.text.secondary};
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${props => props.$active ? 'white' : props.theme.colors.primary};
  }
`;