import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
`;

export const Header = styled.div`
  margin-bottom: 32px;
`;

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

// 탭 메뉴
export const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  border-bottom: 2px solid ${({ theme }) => theme.border};
  margin-bottom: 24px;
`;

export const Tab = styled.button`
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.text.secondary};
  background: ${props => props.$active ? `${props.theme.colors.primary}15` : 'transparent'};
  border: none;
  border-bottom: 3px solid ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: -2px;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.background.hover};
  }
`;

// 테이블
export const TableContainer = styled.div`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHead = styled.thead`
  background: ${({ theme }) => theme.background.secondary};
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.border};
  cursor: ${props => props.onClick ? 'pointer' : 'default'};
  transition: background 0.2s;
  background: ${({ theme }) => theme.background.paper};

  &:hover {
    background: ${props => props.onClick ? props.theme.background.hover : props.theme.background.paper};
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const TableHeader = styled.th`
  padding: 16px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.secondary};
  white-space: nowrap;
`;

export const TableCell = styled.td`
  padding: 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.text.primary};
`;

// 상태 배지
export const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  color: white;
  background: ${props => props.color || props.theme.text.secondary};
`;

// 로딩 및 빈 상태
export const LoadingText = styled.div`
  text-align: center;
  padding: 48px;
  font-size: 16px;
  color: ${({ theme }) => theme.text.secondary};
`;

export const EmptyMessage = styled.div`
  text-align: center;
  padding: 64px 24px;
  font-size: 16px;
  color: ${({ theme }) => theme.text.disabled};
`;

// 모달
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
`;

export const ModalContent = styled.div`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.shadowLg};
  border: 1px solid ${({ theme }) => theme.border};
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

export const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

export const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.background.secondary};
  color: ${({ theme }) => theme.text.secondary};
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.background.hover};
    color: ${({ theme }) => theme.text.primary};
  }
`;

export const ModalBody = styled.div`
  padding: 24px;
`;

export const DetailRow = styled.div`
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  &:last-child {
    border-bottom: none;
  }
`;

export const DetailLabel = styled.div`
  flex: 0 0 180px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.secondary};
`;

export const DetailValue = styled.div`
  flex: 1;
  font-size: 14px;
  color: ${({ theme }) => theme.text.primary};
`;

// 반려 사유 박스
export const RejectReasonBox = styled.div`
  margin-top: 24px;
  padding: 16px;
  background: ${({ theme }) => `${theme.status.error}15`};
  border: 1px solid ${({ theme }) => `${theme.status.error}30`};
  border-radius: 8px;
`;

export const RejectReasonTitle = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.status.error};
  margin-bottom: 8px;
`;

export const RejectReasonText = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.status.error};
  line-height: 1.6;
`;

export const ModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid ${({ theme }) => theme.border};
  display: flex;
  justify-content: flex-end;
`;

export const CloseModalButton = styled.button`
  padding: 10px 24px;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.text.inverse || 'white'};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover || theme.colors.primary};
  }
`;
