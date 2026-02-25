import styled from 'styled-components';

export const MainContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.background.secondary};
  padding: 32px 48px;

  @media (max-width: 1024px) {
    padding: 24px;
  }
`;

export const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

export const PageHeader = styled.div`
  margin-bottom: 32px;
`;

export const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin: 0 0 8px 0;
`;

export const PageSubtitle = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.text.secondary};
  margin: 0;
`;

export const InfoNotice = styled.div`
  background: ${({ theme }) => `linear-gradient(135deg, ${theme.colors.primary}10 0%, ${theme.colors.primary}20 100%)`};
  border: 1.5px solid ${({ theme }) => `${theme.colors.primary}40`};
  border-radius: 12px;
  padding: 24px;
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
`;

export const NoticeIcon = styled.div`
  font-size: 24px;
  line-height: 1;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.primary};
`;

export const NoticeContent = styled.div`
  flex: 1;
`;

export const NoticeTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 12px;
`;

export const NoticeList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const NoticeItem = styled.li`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1.6;
  padding-left: 20px;
  position: relative;

  &:before {
    content: '•';
    position: absolute;
    left: 8px;
    font-weight: 700;
  }
`;

export const FormContainer = styled.div`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow};
  overflow: hidden;
  margin-bottom: 24px;
  border: 1px solid ${({ theme }) => theme.border};
`;

export const FormSection = styled.div`
  padding: 28px 32px;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  &:last-child {
    border-bottom: none;
  }
`;

export const SectionHeader = styled.div`
  margin-bottom: 20px;
`;

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

export const UploadMethodSection = styled.div`
  width: 100%;
`;

export const UploadOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const UploadOption = styled.button`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: ${props => props.selected ? `${props.theme.colors.primary}10` : props.theme.background.main};
  border: 2px solid ${props => props.selected ? props.theme.colors.primary : props.theme.border};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;

  &:hover {
    background: ${props => props.selected ? `${props.theme.colors.primary}20` : props.theme.background.hover};
    border-color: ${props => props.selected ? props.theme.colors.primary : props.theme.colors.primary};
  }
`;

export const UploadIcon = styled.div`
  font-size: 32px;
  line-height: 1;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.primary};
`;

export const UploadOptionContent = styled.div`
  flex: 1;
`;

export const UploadOptionTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 4px;
`;

export const UploadOptionDescription = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
`;

export const FormGroup = styled.div`
  width: 100%;
`;

export const FormLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 8px;
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 1.5px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 15px;
  color: ${({ theme }) => theme.text.primary};
  background: ${({ theme }) => theme.background.main};
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.text.disabled || '#9CA3AF'};
  }
`;

export const FormTextArea = styled.textarea`
  width: 100%;
  padding: 16px;
  border: 1.5px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 15px;
  color: ${({ theme }) => theme.text.primary};
  background: ${({ theme }) => theme.background.main};
  line-height: 1.6;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s;
  min-height: 300px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.text.disabled || '#9CA3AF'};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.background.secondary};
    cursor: not-allowed;
  }
`;

export const CharacterCounter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 8px;
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
`;

export const FormActions = styled.div`
  padding: 24px 32px;
  background: ${({ theme }) => theme.background.secondary};
  display: flex;
  justify-content: flex-end;
  gap: 12px;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    
    button {
      width: 100%;
    }
  }
`;

export const ResetButton = styled.button`
  padding: 14px 32px;
  background: ${({ theme }) => theme.background.paper || 'white'};
  color: ${({ theme }) => theme.text.primary};
  border: 1.5px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.background.hover};
    border-color: ${({ theme }) => theme.text.secondary};
  }
`;

export const SubmitButton = styled.button`
  padding: 14px 32px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.text.inverse || 'white'};
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover || theme.colors.primary};
    opacity: 0.9;
  }

  &:disabled {
    background: ${({ theme }) => theme.text.disabled || '#D1D5DB'};
    cursor: not-allowed;
  }
`;

export const GuideSection = styled.div`
  background: ${({ theme }) => `${theme.status.warning}10` || '#FFFBEB'};
  border: 1.5px solid ${({ theme }) => `${theme.status.warning}40` || '#FDE68A'};
  border-radius: 12px;
  padding: 28px;
`;

export const GuideTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.status.warning || '#92400E'};
  margin: 0 0 20px 0;
`;

export const GuideList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const GuideItem = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
`;

export const GuideNumber = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => `${theme.status.warning}40` || '#FCD34D'};
  color: ${({ theme }) => theme.status.warning || '#92400E'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 700;
  flex-shrink: 0;
`;

export const GuideContent = styled.div`
  flex: 1;
`;

export const GuideItemTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.status.warning || '#92400E'};
  margin-bottom: 6px;
`;

export const GuideItemDescription = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.status.warning || '#B45309'};
  opacity: 0.9;
  line-height: 1.5;
`;

export const HiddenInput = styled.input`
  display: none;
`;

export const ErrorMessage = styled.span`
  color: ${({ theme }) => theme.status.error};
  margin-left: 12px;
  font-size: 14px;
`;