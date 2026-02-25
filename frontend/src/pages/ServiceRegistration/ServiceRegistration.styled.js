import styled from 'styled-components';

export const MainContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: ${({ theme }) => theme.background.main};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 24px;

  @media (max-width: 1024px) {
    padding: 40px 20px;
  }
`;

export const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  background: ${({ theme }) => theme.background.paper};
  border-radius: 24px;
  box-shadow: ${({ theme }) => theme.shadow || '0 20px 60px rgba(0, 0, 0, 0.15)'};
  padding: 60px 80px;

  @media (max-width: 1024px) {
    max-width: 768px;
    padding: 40px 32px;
  }

  @media (max-width: 768px) {
    padding: 32px 24px;
    border-radius: 16px;
  }
`;

export const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 56px;
`;

export const HeaderIcon = styled.div`
  width: 72px;
  height: 72px;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  box-shadow: ${({ theme }) => theme.shadowHover || '0 8px 24px rgba(0, 0, 0, 0.2)'};
`;

export const PageTitle = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin: 0 0 12px 0;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

export const PageDescription = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.text.secondary};
  margin: 0;
  line-height: 1.6;
`;

export const FormSection = styled.section`
  margin-bottom: 48px;
  padding-bottom: 48px;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  &:last-of-type {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
`;

export const SectionNumber = styled.div`
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.text.inverse};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  flex-shrink: 0;
`;

export const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  grid-column: ${props => props.$fullWidth ? 'span 2' : 'span 1'};

  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

export const Label = styled.label`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const RequiredMark = styled.span`
  color: ${({ theme }) => theme.status.error || '#dc2626'};
  font-size: 15px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 2px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  font-size: 15px;
  color: ${({ theme }) => theme.text.primary};
  transition: all 0.2s ease;
  background: ${({ theme }) => theme.background.input || '#ffffff'};

  &::placeholder {
    color: ${({ theme }) => theme.text.tertiary};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}20`};
  }

  &:hover {
    border-color: ${({ theme }) => theme.text.secondary};
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 14px 16px;
  border: 2px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  font-size: 15px;
  color: ${({ theme }) => theme.text.primary};
  background: ${({ theme }) => theme.background.input || '#ffffff'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}20`};
  }

  &:hover {
    border-color: ${({ theme }) => theme.text.secondary};
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 14px 16px;
  border: 2px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  font-size: 15px;
  color: ${({ theme }) => theme.text.primary};
  font-family: inherit;
  resize: vertical;
  transition: all 0.2s ease;
  background: ${({ theme }) => theme.background.input || '#ffffff'};

  &::placeholder {
    color: ${({ theme }) => theme.text.tertiary};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}20`};
  }

  &:hover {
    border-color: ${({ theme }) => theme.text.secondary};
  }
`;

export const HelpText = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  margin: 0;
  line-height: 1.5;
`;

export const FileUploadArea = styled.div`
  width: 100%;
  padding: 48px 24px;
  border: 2px dashed ${({ theme }) => theme.text.tertiary || '#cbd5e1'};
  border-radius: 12px;
  background: ${({ theme }) => theme.background.secondary};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.background.hover};
  }
`;

export const UploadIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const UploadText = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

export const UploadHint = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.text.tertiary};
  margin: 0;
`;

export const InfoBox = styled.div`
  background: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 16px;
  padding: 32px;
  margin: 48px 0;

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

export const InfoTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin: 0 0 16px 0;
`;

export const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const InfoItem = styled.li`
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.6;
`;

export const SubmitButton = styled.button`
  width: 100%;
  max-width: 400px;
  display: block;
  margin: 0 auto;
  padding: 18px 32px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.text.inverse};
  font-size: 17px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${({ theme }) => theme.shadowHover};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadow || '0 8px 24px rgba(0, 0, 0, 0.3)'};
    background: ${({ theme }) => theme.colors.primaryHover || theme.colors.primary};
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export const Footer = styled.footer`
  text-align: center;
  margin-top: 56px;
  padding-top: 32px;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

export const Copyright = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text.tertiary};
  margin: 4px 0;
`;