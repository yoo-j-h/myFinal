import styled from 'styled-components';

// 메인 컨테이너
export const MainContentArea = styled.div`
  padding: 32px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
`;

// 페이지 헤더
export const PageHeader = styled.div`
  margin-bottom: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 8px;
`;

export const PageDescription = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
`;

// 컨텐츠 그리드
export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;

  @media (max-width: 1024px) {
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
`;

// 섹션 카드
export const SectionCard = styled.div`
  background: ${({ theme }) => theme.background.main};
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 1px 3px ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
`;

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 20px;
`;

// 현재 기록 섹션
export const CurrentRecordSection = styled.div`
  background: ${({ theme }) => theme.background.secondary};
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid ${({ theme }) => theme.border};
`;

export const RecordTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 12px;
`;

export const RecordItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  &:last-child {
    border-bottom: none;
  }
`;

export const RecordLabel = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
`;

export const RecordValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
`;

// 시간 입력 그룹
export const TimeInputGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
`;

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const InputLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
`;

export const TimeInput = styled.input`
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.text.primary};
  background: ${({ theme }) => theme.background.input};
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}1A`};
  }

  &::placeholder {
    color: ${({ theme }) => theme.text.disabled};
  }
`;

// 정정 사유 섹션
export const ReasonSection = styled.div`
  margin-bottom: 24px;
`;

export const ReasonHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export const ReasonLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
`;

export const OcrButton = styled.button`
  padding: 8px 16px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.secondary} 100%);
  color: ${({ theme }) => theme.text.inverse};
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${({ theme }) => theme.shadow};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// 날짜 섹션 컨테이너
export const DateSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
`;

// 날짜 입력 필드
export const DateInput = styled.input`
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.2s;
  background: ${({ theme }) => theme.background.input};
  color: ${({ theme }) => theme.text.primary};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}1A`};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.background.secondary};
    cursor: not-allowed;
    color: ${({ theme }) => theme.text.disabled};
  }
`;

// 도움말 텍스트
export const HelpText = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  margin: 0;
  line-height: 1.5;
`;

export const ReasonTextarea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.text.primary};
  background: ${({ theme }) => theme.background.input};
  resize: vertical;
  min-height: 120px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}1A`};
  }

  &::placeholder {
    color: ${({ theme }) => theme.text.disabled};
  }
`;

// 파일 업로드 섹션
export const FileUploadSection = styled.div`
  margin-bottom: 24px;
`;

export const FileUploadLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 8px;
`;

export const FileUploadArea = styled.div`
  border: 2px dashed ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ theme }) => theme.background.secondary};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.background.hover};
  }

  input[type="file"] {
    display: none;
  }
`;

export const FileUploadIcon = styled.div`
  font-size: 48px;
  color: ${({ theme }) => theme.text.tertiary};
  margin-bottom: 12px;
`;

export const FileUploadText = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 4px;
`;

export const FileUploadHint = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text.disabled};
`;

// 파일 목록
export const FileList = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FileItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: ${({ theme }) => theme.background.secondary};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
`;

export const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

export const FileIcon = styled.div`
  font-size: 24px;
  color: ${({ theme }) => theme.text.secondary};
`;

export const FileName = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text.primary};
  font-weight: 500;
`;

export const FileSize = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text.tertiary};
`;

export const RemoveButton = styled.button`
  padding: 4px 8px;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.status.error};
  cursor: pointer;
  font-size: 20px;
  transition: all 0.2s;

  &:hover {
    color: #dc2626;
  }
`;

// 정보 박스
export const InfoBox = styled.div`
  background: ${({ theme }) => `${theme.status.info}1A`};
  border: 1px solid ${({ theme }) => `${theme.status.info}33`}; // 20% opacity
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
`;

export const InfoTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.status.info};
  margin-bottom: 8px;
`;

export const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const InfoItem = styled.li`
  font-size: 13px;
  color: ${({ theme }) => theme.status.info};
  padding: 4px 0;
`;

// 액션 버튼
export const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

export const CancelButton = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background.main};
  color: ${({ theme }) => theme.text.primary};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.background.hover};
    border-color: ${({ theme }) => theme.text.disabled};
  }
`;

export const SubmitButton = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.text.inverse};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
  }

  &:disabled {
    background: ${({ theme }) => theme.text.disabled};
    cursor: not-allowed;
  }
`;

// 사이드바 카드
export const SidebarCard = styled.div`
  background: ${({ theme }) => theme.background.main};
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
`;

export const SidebarTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 16px;
`;

export const GuideItem = styled.div`
  padding: 12px;
  background: ${({ theme }) => theme.background.secondary};
  border-radius: 8px;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const GuideTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 4px;
`;

export const GuideText = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.5;
`;

// Form 관련 스타일
export const FormGroup = styled.div`
  margin-bottom: 20px;
`;

export const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 8px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.text.primary};
  background: ${({ theme }) => theme.background.input};
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}1A`};
  }

  &::placeholder {
    color: ${({ theme }) => theme.text.disabled};
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.text.primary};
  background: ${({ theme }) => theme.background.input};
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}1A`};
  }

  &:disabled {
    background: ${({ theme }) => theme.background.secondary};
    cursor: not-allowed;
  }
`;
