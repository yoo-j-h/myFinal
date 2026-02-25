import styled from 'styled-components';

// Main Container
export const MainContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.background.secondary};
  padding: 32px;

  @media (max-width: 1024px) {
    padding: 20px;
  }
`;

export const ContentWrapper = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
`;

// Page Header
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

// Search Section
export const SearchSection = styled.div`
  margin-bottom: 24px;
`;

export const SearchInputWrapper = styled.div`
  position: relative;
  max-width: 500px;
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

// Table
export const TableContainer = styled.div`
  background-color: ${({ theme }) => theme.background.paper};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow || '0 1px 3px rgba(0, 0, 0, 0.05)'};
  overflow: hidden;
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

export const AirlineName = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
`;

// Status Badges
export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  background-color: ${props => props.$status === '완치' ? `${props.theme.status.success}20` : `${props.theme.status.error}20`};
  color: ${props => props.$status === '완치' ? props.theme.status.success : props.theme.status.error};
`;

export const DocumentStatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  background-color: ${props => {
    if (props.$status === '대기') return `${props.theme.status.warning}20`;
    if (props.$status === '승인') return `${props.theme.status.success}20`;
    if (props.$status === '반려') return `${props.theme.status.error}20`;
    return props.theme.background.secondary;
  }};
  color: ${props => {
    if (props.$status === '대기') return props.theme.status.warning;
    if (props.$status === '승인') return props.theme.status.success;
    if (props.$status === '반려') return props.theme.status.error;
    return props.theme.text.secondary;
  }};
`;

export const ViewDetailButton = styled.button`
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

// Modal Overlay
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

export const ModalContainer = styled.div`
  background-color: ${({ theme }) => theme.background.paper};
  border-radius: 16px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

  @media (max-width: 1024px) {
    max-width: 600px;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px;
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
    color: ${({ theme }) => theme.text.primary};
  }
`;

export const ModalContent = styled.div`
  padding: 32px;
`;

// Progress Section
export const ProgressSection = styled.div`
  background-color: ${({ theme }) => theme.background.secondary};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
`;

export const ProgressHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

export const ProgressIcon = styled.span`
  font-size: 20px;
`;

export const ProgressTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
  flex: 1;
`;

export const ProgressCount = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.border};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 20px;

  &::after {
    content: '';
    display: block;
    width: ${props => props.$progress}%;
    height: 100%;
    background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.secondary} 100%);
    border-radius: 4px;
    transition: width 0.3s ease;
  }
`;

export const ProgressStepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ProgressStep = styled.div`
  display: flex;
  gap: 12px;
  opacity: ${props => props.$completed ? 1 : 0.5};
`;

export const StepIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.$error ? `${props.theme.status.error}20` : `${props.theme.status.success}20`};
  color: ${props => props.$error ? props.theme.status.error : props.theme.status.success};
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
`;

export const StepLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 4px;
`;

export const StepDescription = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
`;

// Info Section
export const InfoSection = styled.div`
  margin-bottom: 24px;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const InfoLabel = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.secondary};
`;

export const InfoValue = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.primary};
`;

// Verification Box
export const VerificationBox = styled.div`
  background-color: ${props => props.$error ? `${props.theme.status.error}10` : `${props.theme.colors.primary}10`};
  border: 1px solid ${props => props.$error ? props.theme.status.error : props.theme.colors.primary};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
`;

export const VerificationHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

export const VerificationIcon = styled.span`
  font-size: 18px;
`;

export const VerificationTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

export const VerificationMessage = styled.p`
  font-size: 14px;
  color: ${props => props.$error ? props.theme.status.error : props.$success ? props.theme.status.success : props.theme.text.primary};
  margin: 0;
  line-height: 1.5;
`;

// Document Section
export const DocumentSection = styled.div`
  margin-bottom: 24px;
`;

export const DocumentTitle = styled.h4`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin: 0 0 12px 0;
`;

export const DocumentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const DocumentItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: ${({ theme }) => theme.background.secondary};
  border-radius: 8px;
`;

export const DocumentIcon = styled.span`
  font-size: 20px;
`;

export const DocumentName = styled.span`
  flex: 1;
  font-size: 14px;
  color: ${({ theme }) => theme.text.primary};
`;
export const DownloadLink = styled.a`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
    text-decoration: underline;
  }
`;

// Status Section
export const StatusSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background-color: ${({ theme }) => theme.background.secondary};
  border-radius: 8px;
`;

export const StatusLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.secondary};
`;

export const StatusBadgeLarge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  background-color: ${props => {
    if (props.$status === 'pending') return `${props.theme.status.warning}20`;
    if (props.$status === 'approved') return `${props.theme.status.success}20`;
    if (props.$status === 'rejected') return `${props.theme.status.error}20`;
    return props.theme.background.secondary;
  }};
  color: ${props => {
    if (props.$status === 'pending') return props.theme.status.warning;
    if (props.$status === 'approved') return props.theme.status.success;
    if (props.$status === 'rejected') return props.theme.status.error;
    return props.theme.text.secondary;
  }};
`;

// Modal Footer
export const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 32px;
  border-top: 1px solid ${({ theme }) => theme.border};
`;
export const RejectButton = styled.button`
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.status.error};
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.status.error};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.status.error};
    color: ${({ theme }) => theme.text.inverse};
  }
`;

export const ApproveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.inverse};
  background-color: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

export const CloseOnlyButton = styled.button`
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.secondary};
  background-color: ${({ theme }) => theme.background.secondary};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.background.hover};
    color: ${({ theme }) => theme.text.primary};
  }
`;

export const InitialSetupSuccessBox = styled.div`
  background-color: ${({ theme }) => `${theme.status.success}10`};
  border: 1px solid ${({ theme }) => theme.status.success};
  color: ${({ theme }) => theme.status.success};
  padding: 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const EmptyMessage = styled.div`
  padding: 40px;
  text-align: center;
  color: ${({ theme }) => theme.text.tertiary};
  font-size: 15px;
`;
