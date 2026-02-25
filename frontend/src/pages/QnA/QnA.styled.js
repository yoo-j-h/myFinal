import styled from 'styled-components';

export const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ theme }) => theme.background.main};
  width: 100%;
`;

export const MainContent = styled.main`
  width: 100%;
  flex: 1;
  min-height: 100vh;
`;

export const ContentWrapper = styled.div`
  padding: 48px;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 1440px) {
    padding: 32px;
  }
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

export const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export const EmailButton = styled.button`
  background: ${({ theme }) => theme.colors.secondary || theme.background.secondary};
  color: ${({ theme }) => theme.text.primary};
  border: 2px solid ${({ theme }) => theme.border};
  padding: 12px 28px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadowSm};

  &:hover {
    background: ${({ theme }) => theme.background.hover || theme.background.secondary};
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadow};
  }
`;

export const CreateButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.text.inverse || 'white'};
  border: none;
  padding: 12px 28px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: ${({ theme }) => theme.shadow};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover || theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadowLg};
  }
`;

export const SearchSection = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  align-items: center;
`;

export const SearchForm = styled.form`
  flex: 1;
  display: flex;
  max-width: 600px;
`;

export const SearchInput = styled.input`
  flex: 1;
  padding: 14px 20px;
  border: 2px solid ${({ theme }) => theme.border};
  border-right: none;
  border-radius: 8px 0 0 8px;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s;
  background: ${({ theme }) => theme.background.paper};
  color: ${({ theme }) => theme.text.primary};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.text.disabled || theme.text.tertiary};
  }
`;

export const SearchButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.text.inverse || 'white'};
  border: none;
  padding: 14px 24px;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover || theme.colors.primary};
  }
`;

export const FilterButton = styled.button`
  padding: 12px 24px;
  border: 2px solid ${({ theme, active }) => active ? theme.colors.primary : theme.border};
  background: ${({ theme, active }) => active ? theme.colors.primary : theme.background.paper};
  color: ${({ theme, active }) => active ? (theme.text.inverse || 'white') : theme.text.secondary};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme, active }) => active ? (theme.text.inverse || 'white') : theme.colors.primary};
  }
`;

export const QnaList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 48px;
`;

export const QnaItem = styled.div`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 12px;
  padding: 24px 28px;
  display: flex;
  gap: 20px;
  align-items: flex-start;
  box-shadow: ${({ theme }) => theme.shadowSm};
  transition: all 0.2s;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.border};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadow};
    transform: translateY(-2px);
  }
`;

export const CategoryBadge = styled.div`
  display: flex;           /* 수평 정렬 */
  align-items: center;     /* 세로 중앙 정렬 */
  justify-content: center;
  background: ${props => props.$bgColor || `${props.theme.colors.primary}15`};
  color: ${props => props.$textColor || props.theme.colors.primary};
  padding: 6px 12px;       /* 아이콘이 들어갔으므로 여백 살짝 조정 */
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  min-width: 90px;         /* 아이콘 때문에 가로가 넓어지므로 살짝 조정 */
  text-align: center;
  gap: 4px;                /* 아이콘과 글자 사이 간격 */
`;

export const QnaContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const QnaTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
  line-height: 1.5;
`;

export const QnaMetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const QnaMeta = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
`;

export const MetaIcon = styled.span`
  font-size: 14px;
`;

export const QnaStats = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

export const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 500;
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 48px;
`;

export const PaginationButton = styled.button`
  width: 40px;
  height: 40px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background.paper};
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  color: ${({ theme }) => theme.text.secondary};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const PageNumber = styled.button`
  width: 40px;
  height: 40px;
  border: 1px solid ${({ theme, $active }) => $active ? theme.colors.primary : theme.border};
  background: ${({ theme, $active }) => $active ? theme.colors.primary : theme.background.paper};
  color: ${({ theme, $active }) => $active ? (theme.text.inverse || 'white') : theme.text.secondary};
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: ${({ $active }) => $active ? '600' : '500'};
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme, $active }) => $active ? (theme.text.inverse || 'white') : theme.colors.primary};
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
`;

export const ModalContainer = styled.div`
  background: ${({ theme }) => theme.background.paper}; 
  width: 500px; 
  padding: 24px;
  border-radius: 12px; 
  box-shadow: ${({ theme }) => theme.shadowLg};
  border: 1px solid ${({ theme }) => theme.border};
`;

export const ModalHeader = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 20px;
  h3 { margin: 0; font-size: 20px; color: ${({ theme }) => theme.text.primary}; }
  button { 
    background: none; 
    border: none; 
    font-size: 24px; 
    cursor: pointer; 
    color: ${({ theme }) => theme.text.secondary};
  }
`;

export const ModalBody = styled.form`
  display: flex; flex-direction: column; gap: 16px;
`;

export const FormGroup = styled.div`
  display: flex; flex-direction: column; gap: 8px;
  label { font-weight: 600; font-size: 14px; color: ${({ theme }) => theme.text.primary}; }
  input, textarea {
    padding: 10px; 
    border: 1px solid ${({ theme }) => theme.border}; 
    background: ${({ theme }) => theme.background.paper};
    color: ${({ theme }) => theme.text.primary};
    border-radius: 6px; 
    font-size: 14px;
    &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary}; }
  }
`;

export const ReadOnlyInput = styled.input`
  padding: 10px; 
  border: 1px solid ${({ theme }) => theme.border}; 
  background: ${({ theme }) => theme.background.secondary || theme.background.hover};
  color: ${({ theme }) => theme.text.secondary};
  border-radius: 6px; 
  font-size: 14px;
  cursor: not-allowed;
  opacity: 0.7;
`;

export const ModalFooter = styled.div`
  display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;
`;

export const CancelButton = styled.button`
  padding: 10px 20px; 
  background: ${({ theme }) => theme.background.secondary}; 
  color: ${({ theme }) => theme.text.secondary};
  border: none; 
  border-radius: 6px; 
  cursor: pointer;
  &:hover { background: ${({ theme }) => theme.background.hover}; }
`;

export const SubmitButton = styled.button`
  padding: 10px 20px; 
  background: ${({ theme }) => theme.colors.primary}; 
  color: ${({ theme }) => theme.text.inverse || 'white'}; 
  border: none; 
  border-radius: 6px; 
  cursor: pointer;
  &:hover { background: ${({ theme }) => theme.colors.primaryHover || theme.colors.primary}; }
`;
