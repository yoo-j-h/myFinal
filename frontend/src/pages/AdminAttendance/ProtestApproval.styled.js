import styled from 'styled-components';

// LeaveApproval의 스타일을 재사용하고, 정정 신청 전용 스타일 추가

// ==================== 기본 레이아웃 ====================

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

// ==================== 통계 카드 ====================

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: ${({ theme, $type }) => {
    switch ($type) {
      case 'pending':
        return theme.mode === 'dark' ? `${theme.status.warning}20` : '#FFF8E1'; // Light Amber
      case 'approved':
        return theme.mode === 'dark' ? `${theme.status.success}20` : '#E6FFFA'; // Light Emerald
      case 'rejected':
        return theme.mode === 'dark' ? `${theme.status.error}20` : '#FFF5F5'; // Light Red
      default:
        return theme.background.paper;
    }
  }};
  border: 1px solid ${({ theme, $type }) => {
    if (theme.mode === 'dark') {
      switch ($type) {
        case 'pending': return `${theme.status.warning}40`;
        case 'approved': return `${theme.status.success}40`;
        case 'rejected': return `${theme.status.error}40`;
        default: return theme.border;
      }
    }
    return 'transparent';
  }};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadowHover};
  }
`;

export const StatIcon = styled.div`
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  background: ${({ theme, $type }) => {
    switch ($type) {
      case 'pending': return theme.status.warning;
      case 'approved': return theme.status.success;
      case 'rejected': return theme.status.error;
      default: return theme.text.tertiary;
    }
  }};
  color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

export const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

export const StatLabel = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.secondary};
`;

export const StatValue = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

export const StatSubtext = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.tertiary};
`;

// ==================== 필터 섹션 ====================

export const FilterSection = styled.div`
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

export const FilterTabs = styled.div`
  display: flex;
  gap: 12px;
  background: ${({ theme }) => theme.background.paper};
  padding: 6px;
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadow};

  @media (max-width: 768px) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
`;

export const FilterTab = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: ${props => props.$active ? '600' : '500'};
  color: ${props => props.$active ? '#ffffff' : props.theme.text.secondary};
  background: ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: ${props => props.$active ? props.theme.colors.primary : props.theme.background.secondary};
    color: ${props => props.$active ? '#ffffff' : props.theme.text.primary};
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const TabLabel = styled.span``;

export const SortDropdown = styled.select`
  padding: 10px 16px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.primary};
  background: ${({ theme }) => theme.background.paper};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}20`};
  }
`;

// ==================== 신청 목록 ====================

export const ApprovalListSection = styled.div`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 12px;
  padding: 28px;
  box-shadow: ${({ theme }) => theme.shadow};
`;

export const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid ${({ theme }) => theme.background.secondary || theme.background.main};
`;

export const ListTitle = styled.h2`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

export const SortButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.secondary};
  background: ${({ theme }) => theme.background.secondary || theme.background.main};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.background.hover};
    border-color: ${({ theme }) => theme.text.disabled};
  }
`;

export const ApprovalList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ApprovalItem = styled.div`
  display: grid;
  grid-template-columns: auto 1fr 2fr auto;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: ${({ theme }) => theme.background.secondary || theme.background.main};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.background.hover};
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  @media (max-width: 1024px) {
    grid-template-columns: auto 1fr;
    gap: 16px;
  }
`;

export const ApprovalAvatar = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  background: ${props => props.$color || props.theme.text.tertiary};
  border-radius: 50%;
`;

export const ApprovalInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ApprovalName = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
`;

export const ApprovalDepartment = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.secondary};
`;

export const ApprovalDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  @media (max-width: 1024px) {
    grid-column: 1 / -1;
  }
`;

export const ApprovalDate = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
`;

export const ApprovalPeriod = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: ${({ theme }) => theme.text.secondary};
`;

export const ApprovalActions = styled.div`
  display: flex;
  gap: 8px;

  @media (max-width: 1024px) {
    grid-column: 1 / -1;
    justify-content: flex-end;
  }

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

export const ViewButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.secondary};
  background: ${({ theme }) => theme.background.paper};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.background.hover};
    border-color: ${({ theme }) => theme.text.disabled};
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const ApproveButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  background: ${({ theme }) => theme.status.success};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    filter: brightness(0.9);
    box-shadow: ${({ theme }) => `0 4px 12px ${theme.status.success}4D`};
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const RejectButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  background: ${({ theme }) => theme.status.error};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    filter: brightness(0.9);
    box-shadow: ${({ theme }) => `0 4px 12px ${theme.status.error}4D`};
  }

  &:active {
    transform: scale(0.98);
  }
`;

// ==================== 모달 ====================

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;                  /* top: 0; left: 0; right: 0; bottom: 0 */
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;            /* 사이드바(z-index~1000)보다 높게 */
  padding: 24px;
  backdrop-filter: blur(4px);
`;

export const ModalContent = styled.div`
  background: ${({ theme }) =>
    theme.mode === 'dark' ? theme.background.paper : '#ffffff'};
  border-radius: 16px;
  width: 100%;
  max-width: 820px;          /* 700 → 820px 확장 */
  min-width: 340px;
  max-height: 92vh;
  display: flex;
  flex-direction: column;    /* header / body / footer 분리 */
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
  animation: modalSlideIn 0.25s ease;

  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: translateY(-16px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

export const ModalHeader = styled.div`
  padding: 24px 28px;
  border-bottom: 2px solid ${({ theme }) => theme.background.secondary || theme.background.main};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ModalTitle = styled.h2`
  font-family: 'Noto Sans KR', sans-serif;
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
  background: ${({ theme }) => theme.background.secondary || theme.background.main};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 20px;
  color: ${({ theme }) => theme.text.secondary};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.background.hover};
    color: ${({ theme }) => theme.text.primary};
  }
`;

export const ModalBody = styled.div`
  padding: 28px;
  overflow-y: auto;          /* body만 스크롤 */
  flex: 1;
`;

export const DetailSection = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const DetailLabel = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const DetailValue = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.primary};
  line-height: 1.6;
`;

export const ApplicantInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: ${({ theme }) => theme.background.secondary || theme.background.main};
  border-radius: 10px;
  margin-bottom: 24px;
`;

export const ReasonBox = styled.div`
  padding: 16px;
  background: ${({ theme }) => theme.background.secondary || theme.background.main};
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.text.primary};
  line-height: 1.6;
  white-space: pre-wrap;
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 6px 16px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
  background: ${props => {
    if (props.$status === 'PENDING') return props.theme.status.warning;
    if (props.$status === 'APPROVED') return props.theme.status.success;
    if (props.$status === 'REJECTED') return props.theme.status.error;
    return props.theme.text.tertiary;
  }};
  border-radius: 8px;
`;

export const ModalFooter = styled.div`
  padding: 20px 28px;
  border-top: 2px solid ${({ theme }) => theme.background.secondary || theme.background.main};
  display: flex;
  gap: 12px;
  justify-content: flex-end;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

export const RejectReasonInput = styled.textarea`
  width: 100%;
  padding: 12px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  color: ${({ theme }) => theme.text.primary};
  background: ${({ theme }) => theme.background.paper};
  border: 2px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  resize: vertical;
  min-height: 80px;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${({ theme }) => theme.status.error};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.status.error}20`};
  }

  &::placeholder {
    color: ${({ theme }) => theme.text.disabled};
  }
`;

export const CancelButton = styled.button`
  padding: 10px 20px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.secondary};
  background: ${({ theme }) => theme.background.secondary || theme.background.main};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.background.hover};
  }

  &:active {
    transform: scale(0.98);
  }
`;

// ==================== 정정 전/후 비교 컴포넌트 (신규) ====================

export const ComparisonBox = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 16px;
  padding: 20px;
  background: ${({ theme }) => theme.background.secondary || theme.background.main};
  border-radius: 10px;
  align-items: center;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

export const ComparisonItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: ${({ theme }) => theme.background.paper};
  border-radius: 8px;
  border: 2px solid ${props => props.$highlight ? props.theme.status.error : props.theme.border};
`;

export const ComparisonLabel = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const ComparisonValue = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.$highlight ? props.theme.status.error : props.theme.text.primary};
`;

export const ComparisonArrow = styled.div`
  font-size: 24px;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 640px) {
    transform: rotate(90deg);
  }
`;

export const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: ${({ theme }) => theme.background.paper};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.background.hover};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const FileIcon = styled.div`
  font-size: 20px;
  color: ${({ theme }) => theme.text.secondary};
`;

export const FileName = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.primary};
  flex: 1;
  word-break: break-all;
`;

export const FileSize = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.text.tertiary};
`;

export const FileActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const FileActionButton = styled.button`
  padding: 6px 12px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.$variant === 'preview' ? props.theme.colors.primary : props.theme.text.secondary};
  background: ${props => props.$variant === 'preview' ? `${props.theme.colors.primary}15` : props.theme.background.secondary};
  border: 1px solid ${props => props.$variant === 'preview' ? props.theme.colors.primary : props.theme.text.disabled};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: ${props => props.$variant === 'preview' ? `${props.theme.colors.primary}40` : props.theme.background.hover};
  }

  &:active {
    transform: scale(0.95);
  }
`;

// ==================== 파일 미리보기 모달 ====================

export const PreviewModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999; /* ModalOverlay(99999)보다 높게 */
  padding: 20px;
  backdrop-filter: blur(8px);
`;

export const PreviewModalContent = styled.div`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 16px;
  max-width: 90vw;
  max-height: 90vh;
  width: ${props => props.$fullWidth ? '90vw' : 'auto'};
  height: ${props => props.$fullHeight ? '90vh' : 'auto'};
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
`;

export const PreviewHeader = styled.div`
  padding: 16px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.background.secondary || theme.background.main};
`;

export const PreviewTitle = styled.h3`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
  word-break: break-all;
`;

export const PreviewBody = styled.div`
  flex: 1;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: ${({ theme }) => theme.background.subtle || '#f3f4f6'};
`;

export const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};
`;

export const PreviewIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 8px;
`;

export const PreviewMessage = styled.div`
  padding: 40px;
  text-align: center;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
`;
