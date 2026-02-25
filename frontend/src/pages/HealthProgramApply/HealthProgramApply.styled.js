import styled from 'styled-components';

/* ==================== 전체 레이아웃 ==================== */

export const PageLayout = styled.div`
  display: flex;
  min-height: 100%;
  width: 100%;
  background: ${({ theme }) => theme.background.main};
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

/* ==================== 헤더 ==================== */

export const PageHeader = styled.header`
  margin-bottom: 32px;
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

export const EmptyHistory = styled.div`
  text-align: center;
  padding: 40px;
  color: ${({ theme }) => theme.text.secondary};
  font-size: 15px;
`;

/* ==================== 레이아웃 그리드 ==================== */

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

/* ==================== 공통 카드 ==================== */

export const SectionCard = styled.div`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 12px;
  padding: 28px;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
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

/* ==================== Native Select ==================== */

export const SelectGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SelectLabel = styled.label`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
`;

export const SelectBox = styled.select`
  width: 100%;
  height: 48px;
  padding: 0 14px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  background: ${({ theme }) => theme.background.main};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.background.hover};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}20`};
    background: ${({ theme }) => theme.background.paper};
  }
`;

export const SelectHint = styled.span`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 12px;
  color: ${({ theme }) => theme.text.secondary};
`;

/* ==================== 날짜 선택 ==================== */

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
  color: ${({ theme }) => theme.text.primary};
`;

export const DateInput = styled.input`
  width: 100%;
  height: 44px;
  padding: 12px 16px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 15px;
  color: ${({ theme }) => theme.text.primary};
  background: ${({ theme }) => theme.background.main};
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

/* ==================== 사유 입력 ==================== */

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
  color: ${({ theme }) => theme.text.primary};
`;

export const ReasonTextarea = styled.textarea`
  width: 100%;
  padding: 14px 16px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 15px;
  line-height: 1.6;
  color: ${({ theme }) => theme.text.primary};
  background: ${({ theme }) => theme.background.main};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  outline: none;
  resize: vertical;
  min-height: 120px;
  transition: all 0.2s ease;
  font-family: inherit;

  &::placeholder {
    color: ${({ theme }) => theme.text.disabled || '#9ca3af'};
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

/* ==================== 정보 박스 ==================== */

export const InfoBox = styled.div`
  padding: 16px;
  background: ${({ theme }) => `${theme.colors.primary}10`};
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  margin-bottom: 24px;
`;

export const InfoTitle = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
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
  color: ${({ theme }) => theme.text.primary};
  line-height: 1.8;
`;

/* ==================== 버튼 ==================== */

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
  background: ${({ theme }) => theme.background.paper || 'white'};
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
  color: ${({ theme }) => theme.text.inverse || 'white'};
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover || theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadowHover};
  }

  &:active {
    transform: translateY(0);
  }
`;

/* ==================== 히스토리 ==================== */

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
  color: ${({ theme }) => theme.text.inverse || 'white'};
  background: ${(props) => {
    const type = (props.$type || '').toLowerCase();
    if (type.includes('counseling') || type.includes('상담')) return props.theme.status.success || '#10b981';
    if (type.includes('exercise') || type.includes('운동')) return props.theme.status.warning || '#f59e0b';
    if (type.includes('rest') || type.includes('휴식')) return props.theme.colors.secondary || '#8b5cf6';
    return props.theme.text.disabled || '#6b7280';
  }};
  border-radius: 4px;
  margin-bottom: 6px;
`;

export const HistoryDate = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 4px;
`;

export const HistoryDuration = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.text.secondary};
`;

export const HistoryStatus = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: ${(props) => {
    const status = (props.$status || '').toLowerCase();
    if (status === 'approved') return props.theme.status.success || '#047857';
    if (status === 'rejected') return props.theme.status.error || '#dc2626';
    return props.theme.status.info || '#3B82F6';
  }};
  background: ${(props) => {
    const status = (props.$status || '').toLowerCase();
    if (status === 'approved') return `${props.theme.status.success}15`;
    if (status === 'rejected') return `${props.theme.status.error}15`;
    return `${props.theme.status.info || '#3B82F6'}15`;
  }};
  border-radius: 6px;
  white-space: nowrap;
`;
