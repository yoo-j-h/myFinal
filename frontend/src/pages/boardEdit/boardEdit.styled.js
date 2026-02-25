import styled from 'styled-components';

export const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ theme }) => theme.background.secondary || theme.background.main};
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

export const CreateButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: ${({ theme }) => theme.shadow};

  &:hover {
    filter: brightness(0.9);
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadowHover};
  }
`;

export const TabSection = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
  border-bottom: 2px solid ${({ theme }) => theme.border};
  padding-bottom: 0;
`;

export const Tab = styled.button`
  background: none;
  border: none;
  padding: 14px 28px;
  font-size: 15px;
  font-weight: 600;
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.text.secondary};
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
  border-bottom: 3px solid ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  margin-bottom: -2px;

  &:hover {
    color: ${props => props.$active ? props.theme.colors.primary : props.theme.text.primary};
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
    color: ${({ theme }) => theme.text.disabled};
  }
`;

export const SearchButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover {
    filter: brightness(0.9);
  }
`;

export const FilterButton = styled.button`
  padding: 12px 24px;
  border: 2px solid ${props => props.active ? props.theme.colors.primary : props.theme.border};
  background: ${props => props.active ? props.theme.colors.primary : props.theme.background.paper};
  color: ${props => props.active ? 'white' : props.theme.text.secondary};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.primary};
    color: ${props => props.active ? 'white' : props.theme.colors.primary};
  }
`;

export const BoardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 48px;
`;

export const BoardItem = styled.div`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 12px;
  padding: 24px 28px;
  display: flex;
  gap: 20px;
  align-items: flex-start;
  box-shadow: ${({ theme }) => theme.shadow};
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadowHover};
    transform: translateY(-2px);
  }
`;

export const CategoryBadge = styled.div`
  background: ${props => props.bgColor || `${props.theme.colors.primary}15`};
  color: ${props => {
    if (props.bgColor === '#FFE5E5') return props.theme.status.error;
    if (props.bgColor === '#FFF9E5') return props.theme.status.warning;
    return props.theme.colors.primary;
  }};
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  min-width: 70px;
  text-align: center;
`;

export const BoardContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const BoardTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
  line-height: 1.5;
`;

export const BoardMetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const BoardMeta = styled.div`
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

export const BoardStats = styled.div`
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
  border: 1px solid ${props => props.active ? props.theme.colors.primary : props.theme.border};
  background: ${props => props.active ? props.theme.colors.primary : props.theme.background.paper};
  color: ${props => props.active ? 'white' : props.theme.text.secondary};
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: ${props => props.active ? '600' : '500'};
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${props => props.active ? 'white' : props.theme.colors.primary};
  }
`;

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
  backdrop-filter: blur(4px);
`;

export const ModalContainer = styled.div`
  background: ${({ theme }) => theme.background.paper};
  width: 600px;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: 90vh;
`;

export const ModalHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.background.secondary};
`;

export const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.text.secondary};
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.text.primary};
  }
`;

export const ModalBody = styled.div`
  padding: 24px;
  overflow-y: auto;
`;

export const PostForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FormLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
`;

export const FormInput = styled.input`
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s;
  background: ${({ theme }) => theme.background.input};
  color: ${({ theme }) => theme.text.primary};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const FormSelect = styled.select`
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s;
  background: ${({ theme }) => theme.background.input};
  color: ${({ theme }) => theme.text.primary};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const FormTextarea = styled.textarea`
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 15px;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
  background: ${({ theme }) => theme.background.input};
  color: ${({ theme }) => theme.text.primary};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
`;

export const CancelButton = styled.button`
  padding: 12px 24px;
  background: ${({ theme }) => theme.background.paper};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.secondary};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.background.secondary};
    border-color: ${({ theme }) => theme.text.disabled};
  }
`;

export const SubmitButton = styled.button`
  padding: 12px 24px;
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    filter: brightness(0.9);
  }
`;