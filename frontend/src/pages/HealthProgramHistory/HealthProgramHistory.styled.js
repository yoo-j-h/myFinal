import styled from 'styled-components';

// ========== Layout ==========
export const PageLayout = styled.div`
  width: 100%;
  min-height: 100vh;
  background: ${({ theme }) => theme.background.main};
`;

export const MainContentArea = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`;

// ========== Header ==========
export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid ${({ theme }) => theme.border};
`;

export const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

export const PageDescription = styled.p`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.text.secondary};
  margin: 0.5rem 0 0 0;
`;

// ========== Table Container ==========
export const TableCard = styled.div`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
`;

export const TableHeader = styled.div`
  padding: 1.5rem;
  background: ${({ theme }) => theme.background.paper};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

export const TableTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

export const TableCount = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text.secondary};
  margin-left: 0.5rem;
`;

// ========== Table ==========
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHead = styled.thead`
  background: ${({ theme }) => theme.background.main};
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.border};
  cursor: pointer;
  
  &:hover {
    background: ${({ theme }) => theme.background.hover};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

export const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
`;

export const TableCell = styled.td`
  padding: 1.2rem 1rem;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.text.primary};
`;

// ========== Status Badge ==========
export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  
  ${({ $status, theme }) => {
    switch ($status) {
      case 'PENDING':
        return `
          background: ${theme.status.warning}15;
          color: ${theme.status.warning};
          border: 1px solid ${theme.status.warning}30;
        `;
      case 'APPROVED':
        return `
          background: ${theme.status.success}15;
          color: ${theme.status.success};
          border: 1px solid ${theme.status.success}30;
        `;
      case 'REJECTED':
        return `
          background: ${theme.status.error}15;
          color: ${theme.status.error};
          border: 1px solid ${theme.status.error}30;
        `;
      default:
        return `
          background: ${theme.background.main};
          color: ${theme.text.secondary};
          border: 1px solid ${theme.border};
        `;
    }
  }}
`;

export const StatusIcon = styled.span`
  margin-right: 0.3rem;
`;

// ========== Category Badge ==========
export const CategoryBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.7rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  
  ${({ $category, theme }) => {
    switch ($category) {
      case '상담':
        return `
          background: ${theme.colors.primary}15;
          color: ${theme.colors.primary};
        `;
      case '운동':
        return `
          background: ${theme.colors.secondary}15;
          color: ${theme.colors.secondary};
        `;
      case '휴식':
        return `
          background: ${theme.status.info}15;
          color: ${theme.status.info || '#00897b'};
        `;
      default:
        return `
          background: ${theme.background.main};
          color: ${theme.text.secondary};
        `;
    }
  }}
`;

// ========== Action Buttons ==========
export const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const CancelButton = styled(ActionButton)`
  background: ${({ theme }) => theme.status.error};
  color: ${({ theme }) => theme.text.inverse || 'white'};
  
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.dangerHover || '#b91c1c'};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadowHover};
  }
`;

// ========== Empty State ==========
export const EmptyState = styled.div`
  padding: 4rem 2rem;
  text-align: center;
`;

export const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.3;
  color: ${({ theme }) => theme.text.disabled};
`;

export const EmptyText = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.text.secondary};
  margin: 0;
`;

export const EmptySubText = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text.disabled};
  margin: 0.5rem 0 0 0;
`;

// ========== Loading State ==========
export const LoadingContainer = styled.div`
  padding: 4rem 2rem;
  text-align: center;
`;

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid ${({ theme }) => theme.border};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export const LoadingText = styled.p`
  margin-top: 1rem;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.text.secondary};
`;

// ========== Date Format ==========
export const DateText = styled.span`
  color: ${({ theme }) => theme.text.primary};
  font-weight: 500;
`;

export const DateRange = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const DateLabel = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.text.secondary};
`;

// ========== Modal ==========
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
`;

export const ModalContainer = styled.div`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  box-shadow: ${({ theme }) => theme.shadow};
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

export const ModalHeader = styled.div`
  padding: 1.5rem 2rem;
  background: ${({ theme }) => theme.background.paper};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ModalTitle = styled.h2`
  font-size: 1.35rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

export const ModalCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.text.secondary};
  cursor: pointer;
  padding: 0.5rem;
  line-height: 1;
  border-radius: 50%;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${({ theme }) => theme.text.primary};
    background: ${({ theme }) => theme.background.hover};
  }
`;

export const ModalBody = styled.div`
  padding: 2rem;
  overflow-y: auto;
  max-height: 70vh;
`;

export const ModalSection = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const ModalLabel = styled.label`
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.75rem;
`;

export const ModalValue = styled.div`
  font-size: 1.05rem;
  color: ${({ theme }) => theme.text.primary};
  line-height: 1.6;
  
  ${({ $isBox, theme }) => $isBox && `
    background: ${theme.background.main};
    padding: 1.2rem;
    border-radius: 8px;
    border: 1px solid ${theme.border};
    min-height: 3rem;
  `}
`;

export const ModalStatusValue = styled(ModalValue)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  
  ${({ $status, theme }) => {
    switch ($status) {
      case 'APPROVED':
        return `color: ${theme.status.success};`;
      case 'REJECTED':
        return `color: ${theme.status.error};`;
      case 'PENDING':
        return `color: ${theme.status.warning}; font-size: 0.95rem; font-weight: normal;`;
      default:
        return '';
    }
  }}
`;

export const ModalFooter = styled.div`
  padding: 1.5rem 2rem;
  background: ${({ theme }) => theme.background.main};
  border-top: 1px solid ${({ theme }) => theme.border};
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

export const ModalActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  min-width: 80px;

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary};
          color: white;
          box-shadow: ${theme.shadow};
          &:hover { filter: brightness(110%); transform: translateY(-1px); }
          &:active { transform: translateY(0); }
        `;
      case 'danger':
        return `
          background: ${theme.status.error};
          color: white;
          &:hover { filter: brightness(110%); }
        `;
      case 'secondary':
      default:
        return `
          background: ${theme.background.paper};
          color: ${theme.text.primary};
          border: 1px solid ${theme.border};
          &:hover { background: ${theme.background.hover}; border-color: ${theme.text.secondary}; }
        `;
    }
  }}
`;

export const TruncatedText = styled.div`
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
