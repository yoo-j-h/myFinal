import styled from 'styled-components';

export const MainContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.background.secondary};
  padding: 32px 40px;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    padding: 24px 20px;
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  gap: 32px;
  max-width: 1600px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 24px;
  }
`;

export const LeftPanel = styled.div`
  flex: 0 0 380px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 1024px) {
    flex: 1;
  }
`;

export const RightPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.text.inverse};
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    filter: brightness(0.9);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const CodeGroupCard = styled.div`
  background-color: ${({ theme }) => theme.background.paper};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadow};
  }
`;

export const CodeGroupCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

export const CodeGroupTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin: 0 0 4px 0;
`;

export const CodeGroupSubtitle = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const CodeGroupLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 8px;
`;

export const CodeCountBadge = styled.div`
  display: inline-block;
  padding: 4px 12px;
  background-color: ${({ theme }) => `${theme.colors.primary}15`};
  color: ${({ theme }) => theme.colors.primary};
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
`;

export const SearchInputWrapper = styled.div`
  position: relative;
  margin-bottom: 24px;
`;

export const SearchIcon = styled.span`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  opacity: 0.5;
  color: ${({ theme }) => theme.text.secondary};
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.text.primary};
  background-color: ${({ theme }) => theme.background.paper};
  box-sizing: border-box;
  transition: border-color 0.2s;

  &::placeholder {
    color: ${({ theme }) => theme.text.disabled};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const TableWrapper = styled.div`
  background-color: ${({ theme }) => theme.background.paper};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  overflow: hidden;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHeader = styled.thead`
  background-color: ${({ theme }) => theme.background.secondary};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

export const TableHeaderCell = styled.th`
  padding: 16px 20px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.secondary};
  white-space: nowrap;

  &:first-child {
    width: 80px;
  }

  &:nth-child(2) {
    width: 120px;
  }

  &:nth-child(5) {
    width: 120px;
  }

  &:last-child {
    width: 100px;
    text-align: center;
  }
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.border};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.background.hover};
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const TableCell = styled.td`
  padding: 16px 20px;
  font-size: 14px;
  color: ${({ theme }) => theme.text.primary};
  vertical-align: middle;

  &:last-child {
    text-align: center;
  }
`;

export const CodeLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  background-color: ${({ status, theme }) => status === '사용' ? `${theme.status.success}20` : `${theme.status.error}20`};
  color: ${({ status, theme }) => status === '사용' ? theme.status.success : theme.status.error};
`;

export const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  margin: 0 4px;
  font-size: 18px;
  opacity: 0.6;
  transition: opacity 0.2s;
  color: ${({ theme }) => theme.text.secondary};

  &:hover {
    opacity: 1;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const EditIcon = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

export const DeleteIcon = styled.span`
  color: ${({ theme }) => theme.status.error};
`;

// Modal Styles
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
  backdrop-filter: blur(4px);
`;

export const ModalContainer = styled.div`
  background-color: ${({ theme }) => theme.background.paper};
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.shadow};
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
  background: none;
  border: none;
  font-size: 28px;
  color: ${({ theme }) => theme.text.secondary};
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.text.primary};
  }
`;

export const ModalBody = styled.div`
  padding: 24px;
`;

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
  background-color: ${({ theme }) => theme.background.input};
  box-sizing: border-box;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
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
  box-sizing: border-box;
  transition: border-color 0.2s;
  background-color: ${({ theme }) => theme.background.input};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

export const CancelButton = styled.button`
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.background.secondary};
  color: ${({ theme }) => theme.text.secondary};
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.background.hover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const SubmitButton = styled.button`
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.text.inverse};
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    filter: brightness(0.9);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const DeleteCodeGroupButton = styled.button`
  width: 500px;
  align-items: end;
  padding: 12px 24px;
  background-color: ${({ theme }) => theme.status.error};
  color: ${({ theme }) => theme.text.inverse};
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 24px;

  &:hover {
    filter: brightness(0.9);
  }

  &:active {
    filter: brightness(0.8);
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.background.input};
  color: ${({ theme }) => theme.text.primary};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

// 항공사 필터 관련 스타일
export const AirlineFilterWrapper = styled.div`
  margin-bottom: 16px;
`;

export const AirlineSelectWrapper = styled.div`
  width: 100%;
`;

export const AirlineSelect = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.text.primary};
  box-sizing: border-box;
  transition: border-color 0.2s;
  background-color: ${({ theme }) => theme.background.input};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

// 코드 그룹 삭제 버튼
export const CodeGroupDeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 16px;
  opacity: 0.6;
  transition: opacity 0.2s;
  margin-left: auto;
  color: ${({ theme }) => theme.text.secondary};

  &:hover {
    opacity: 1;
    color: ${({ theme }) => theme.status.error};
  }
`;

// 폼 관련 스타일 (별칭)
export const FormLabel = styled(Label)``;

export const FormInput = styled(Input)``;

export const FormTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.text.primary};
  box-sizing: border-box;
  transition: border-color 0.2s;
  font-family: inherit;
  resize: vertical;
  background-color: ${({ theme }) => theme.background.input};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.text.disabled};
  }
`;

// 모달 컨텐츠
export const ModalContent = styled(ModalBody)``;

// 폼 액션 (별칭)
export const FormActions = styled(ModalFooter)``;