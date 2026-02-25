import styled from 'styled-components';

export const MainContentArea = styled.div`
  flex: 1;
  padding: 40px;
  background-color: ${({ theme }) => theme.background.secondary};
  overflow-y: auto;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
`;

export const StatCard = styled.div`
  background-color: ${({ theme }) => theme.background.paper};
  padding: 24px;
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadow};
  display: flex;
  align-items: flex-start;
  gap: 16px;
  border-left: 4px solid ${(props) => props.$bgColor || 'transparent'};
`;

export const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: ${(props) => props.$bgColor ? `${props.$bgColor}20` : props.theme.background.secondary};
  color: ${(props) => props.$color || props.theme.text.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

export const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StatLabel = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 4px;
`;

export const StatValue = styled.span`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 4px;
`;

export const StatSubtext = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.text.tertiary};
`;

export const FilterSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const FilterTabs = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.background.paper};
  padding: 4px;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow};
`;

export const FilterTab = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background-color: ${(props) => (props.$active ? `${props.theme.colors.primary}10` : 'transparent')};
  color: ${(props) => (props.$active ? props.theme.colors.primary : props.theme.text.secondary)};
  font-weight: ${(props) => (props.$active ? '600' : '500')};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => (props.$active ? `${props.theme.colors.primary}10` : props.theme.background.hover)};
  }
`;

export const TabIcon = styled.span`
  font-size: 16px;
`;

export const TabLabel = styled.span`
  font-size: 14px;
`;

export const SortDropdown = styled.select`
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text.primary};
  background-color: ${({ theme }) => theme.background.paper};
  font-size: 14px;
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const ApprovalListSection = styled.div`
  background-color: ${({ theme }) => theme.background.paper};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadow};
  overflow: hidden;
`;

export const ListHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ListTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

export const SortButton = styled.button`
  color: ${({ theme }) => theme.text.secondary};
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    color: ${({ theme }) => theme.text.primary};
  }
`;

export const ApprovalList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ApprovalItem = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  transition: background-color 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${({ theme }) => theme.background.hover};
  }
`;

export const ApprovalAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: ${(props) => props.$color || props.theme.background.secondary};
  color: ${({ theme }) => theme.text.inverse};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  margin-right: 16px;
`;

export const ApprovalInfo = styled.div`
  flex: 1;
`;

export const ApprovalName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 4px;
`;

export const ApprovalDepartment = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
`;

export const ApprovalDetails = styled.div`
  flex: 2;
  display: flex;
  align-items: center;
  gap: 24px;
`;

export const ApprovalType = styled.span`
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 600;
  
  ${(props) => {
    switch (props.$type) {
      case 'annual':
        return `background-color: ${props.theme.colors.primary}20; color: ${props.theme.colors.primary};`;
      case 'sick':
        return `background-color: ${props.theme.colors.secondary}20; color: ${props.theme.colors.secondary};`;
      case 'half':
        return `background-color: ${props.theme.status.warning}20; color: ${props.theme.status.warning};`;
      default:
        return `background-color: ${props.theme.text.tertiary}20; color: ${props.theme.text.tertiary};`;
    }
  }}
`;

export const ApprovalDate = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text.primary};
  font-weight: 500;
`;

export const ApprovalPeriod = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  background-color: ${({ theme }) => theme.background.secondary};
  padding: 4px 8px;
  border-radius: 6px;
`;

export const ApprovalActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const ViewButton = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.background.paper};
  color: ${({ theme }) => theme.text.primary};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.background.hover};
    border-color: ${({ theme }) => theme.text.secondary};
  }
`;

export const ApproveButton = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background-color: ${({ theme }) => theme.status.success};
  color: ${({ theme }) => theme.text.inverse};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

export const RejectButton = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background-color: ${({ theme }) => theme.status.error};
  color: ${({ theme }) => theme.text.inverse};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

/* ----- 모달 스타일 (추가됨) ----- */
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: ${({ theme }) => theme.background.paper};
  padding: 30px;
  border-radius: 12px;
  width: 500px;
  max-width: 90%;
  box-shadow: ${({ theme }) => theme.shadow};
  
  h2 {
    margin-bottom: 20px;
    font-size: 1.5rem;
    color: ${({ theme }) => theme.text.primary};
  }
`;

export const DetailRow = styled.div`
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  
  label {
    font-weight: bold;
    color: ${({ theme }) => theme.text.secondary};
    margin-bottom: 5px;
  }
  
  span, p {
    font-size: 1rem;
    color: ${({ theme }) => theme.text.primary};
  }
  
  p {
    background: ${({ theme }) => theme.background.secondary};
    padding: 10px;
    border-radius: 5px;
    min-height: 60px;
    margin-top: 0;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

export const CloseButton = styled.button`
  padding: 10px 20px;
  background: ${({ theme }) => theme.background.secondary};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  color: ${({ theme }) => theme.text.primary};
  
  &:hover {
    background: ${({ theme }) => theme.background.hover};
  }
`;

export const EmptyState = styled.div`
  padding: 40px;
  text-align: center;
  color: ${({ theme }) => theme.text.secondary};
`;
