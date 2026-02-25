import styled from 'styled-components';

// ==================== 전체 레이아웃 ====================

export const PageLayout = styled.div`
  display: flex;
  min-height: 100%;
  width: 100%;
  background: ${({ theme }) => theme.background.secondary || theme.background.main};
`;

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

// ==================== 헤더 ====================

export const PageHeader = styled.header`
  margin-bottom: 32px;
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
  font-weight: ${(props) => (props.$active ? '600' : '400')};
  color: ${(props) => (props.$active ? props.theme.text.primary : props.theme.text.secondary)};
  cursor: ${(props) => (props.$active ? 'default' : 'pointer')};
  transition: color 0.2s ease;

  &:hover {
    color: ${(props) => (props.$active ? props.theme.text.primary : props.theme.colors.primary)};
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
  margin: 0 0 8px 0;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

export const PageDescription = styled.p`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: ${({ theme }) => theme.text.secondary};
  margin: 0;
`;

// ==================== 레이아웃 그리드 ====================

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 32px;

  @media (max-width: 1280px) {
    grid-template-columns: 1fr;
  }
`;

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 1280px) {
    grid-row: 1;
  }
`;

// ==================== 공통 카드 ====================

export const SectionCard = styled.div`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 12px;
  padding: 28px;
  box-shadow: ${({ theme }) => theme.shadow};
`;

export const SectionTitle = styled.h2`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
`;

// ==================== 휴가 유형 선택 ====================

export const LeaveTypeSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const LeaveTypeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: ${(props) => (props.$active ? `${props.theme.colors.primary}10` : props.theme.background.paper)};
  border: 2px solid ${(props) => (props.$active ? props.theme.colors.primary : props.theme.border)};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;

  &:hover {
    background: ${({ theme }) => `${theme.colors.primary}10`};
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => `0 4px 12px ${theme.colors.primary}20`};
  }

  &:active {
    transform: translateY(0);
  }
`;

export const LeaveTypeIcon = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: ${({ theme }) => theme.background.paper};
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  color: ${({ theme }) => theme.colors.primary};
`;

export const LeaveTypeName = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 4px;
`;

export const LeaveTypeCount = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.secondary};
`;

// ==================== 날짜 선택 ====================

export const DateRangeSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const DateInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const DateLabel = styled.label`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.secondary};
`;

export const DateInput = styled.input`
  width: 100%;
  height: 44px;
  padding: 12px 16px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 15px;
  color: ${({ theme }) => theme.text.primary};
  background: ${({ theme }) => theme.background.input};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  outline: none;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.background.hover};
  }

  &:focus {
    background: ${({ theme }) => theme.background.paper};
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}20`};
  }
`;

// ==================== 휴가 사유 ====================

export const ReasonSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
`;

export const ReasonLabel = styled.label`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.secondary};
`;

export const ReasonTextarea = styled.textarea`
  width: 100%;
  padding: 14px 16px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 15px;
  line-height: 1.6;
  color: ${({ theme }) => theme.text.primary};
  background: ${({ theme }) => theme.background.input};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  outline: none;
  resize: vertical;
  min-height: 120px;
  transition: all 0.2s ease;

  &::placeholder {
    color: ${({ theme }) => theme.text.disabled};
  }

  &:hover {
    background: ${({ theme }) => theme.background.hover};
  }

  &:focus {
    background: ${({ theme }) => theme.background.paper};
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}20`};
  }
`;

// ==================== 정보 박스 ====================

export const InfoBox = styled.div`
  padding: 16px;
  background: ${({ theme }) => `${theme.status.info}15`};
  border-left: 4px solid ${({ theme }) => theme.status.info};
  border-radius: 8px;
  margin-bottom: 24px;
`;

export const InfoTitle = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.status.info};
  filter: brightness(0.8);
  margin-bottom: 12px;
`;

export const InfoList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const InfoItem = styled.li`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: ${({ theme }) => theme.status.info};
  filter: brightness(0.7);
  line-height: 1.8;
`;

// ==================== 액션 버튼 ====================

export const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;

  @media (max-width: 640px) {
    flex-direction: column-reverse;
  }
`;

export const CancelButton = styled.button`
  padding: 12px 32px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.secondary};
  background: ${({ theme }) => theme.background.paper};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.background.hover};
    border-color: ${({ theme }) => theme.text.disabled};
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const SubmitButton = styled.button`
  padding: 12px 32px;
  font-family: inherit;
  font-size: 15px;
  font-weight: 600;
  color: white;
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    filter: brightness(0.9);
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => `0 8px 16px ${theme.colors.primary}4D`};
  }

  &:active {
    transform: translateY(0);
  }
`;

// ==================== 잔여 휴가 카드 ====================

export const RemainingLeaveCard = styled.div`
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 16px;
  padding: 32px;
  color: white;
  box-shadow: ${({ theme }) => `0 8px 24px ${theme.colors.primary}4D`};
`;

export const RemainingStat = styled.div`
  margin-bottom: 24px;
`;

export const RemainingLabel = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 12px;
`;

export const RemainingValue = styled.span`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 48px;
  font-weight: 700;
  color: #ffffff;
  margin-right: 8px;

  @media (max-width: 768px) {
    font-size: 40px;
  }
`;

export const RemainingUnit = styled.span`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
`;

export const RemainingSubtext = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 8px;
`;

// ==================== 사용 진행바 ====================

export const UsageProgressBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
`;

export const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  overflow: hidden;
`;

export const ProgressBarFill = styled.div`
  width: ${(props) => props.$percentage}%;
  height: 100%;
  background: #ffffff;
  border-radius: 4px;
  transition: width 0.3s ease;
`;

export const ProgressPercentage = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  text-align: right;
`;

// ==================== 쿼터 카드 ====================

export const QuotaCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: ${({ theme }) => theme.background.input};
  border-radius: 10px;
  margin-bottom: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.background.hover};
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const QuotaBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: #ffffff;
  background: ${(props) => {
    if ((props.$type || '').includes('연차')) return props.theme.status.info;
    if ((props.$type || '').includes('반차')) return props.theme.status.warning;
    if ((props.$type || '').includes('병가')) return props.theme.status.error;
    return props.theme.text.secondary;
  }};
  border-radius: 6px;
  margin-right: 8px;
`;

export const QuotaType = styled.span`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
`;

export const QuotaValue = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.secondary};
  margin-top: 4px;
`;

export const QuotaDetail = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.text.tertiary};
  margin-top: 2px;
`;

// ==================== 히스토리 ====================

export const HistoryCard = styled(SectionCard)``;

export const HistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 14px 0;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-of-type {
    padding-top: 0;
  }
`;

export const HistoryType = styled.span`
  display: inline-block;
  padding: 4px 8px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: #ffffff;
  background: ${(props) => {
    if ((props.$type || '').includes('연차')) return props.theme.status.info;
    if ((props.$type || '').includes('반차')) return props.theme.status.warning;
    if ((props.$type || '').includes('병가')) return props.theme.status.error;
    return props.theme.text.secondary;
  }};
  border-radius: 4px;
  margin-bottom: 6px;
`;

export const HistoryDate = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 4px;
`;

export const HistoryDuration = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.text.tertiary};
`;

export const HistoryStatus = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: ${(props) => (props.$status === 'approved' ? props.theme.status.success : props.theme.status.error)};
  background: ${(props) => (props.$status === 'approved' ? `${props.theme.status.success}20` : `${props.theme.status.error}20`)};
  border-radius: 6px;
  white-space: nowrap;
`;

// ==================== 아래 2개는 LeaveApply.jsx에서 import만 되어있던 것들(호환용) ====================
// 실제 JSX에서 쓰진 않아도, import 목록에 있으면 export 없다고 터지니까 "최소 정의"로 채워둠.

export const HistoryTypeName = styled.span``; // 혹시 다른 파일에서 쓰면 대비
export const HistoryStatusText = styled.span``;
