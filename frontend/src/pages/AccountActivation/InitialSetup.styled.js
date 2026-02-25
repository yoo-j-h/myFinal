import styled from 'styled-components';

export const MainContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: ${({ theme }) => theme.background.main};
  padding: 60px 40px;
  display: flex;
  justify-content: center;
  align-items: flex-start;

  @media (max-width: 1024px) {
    padding: 40px 20px;
  }
`;

export const ContentWrapper = styled.div`
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const Header = styled.header`
  width: 100%;
`;

export const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  gap: 80px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    gap: 40px;
  }
`;

export const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  opacity: ${props => props.$active ? 1 : props.$completed ? 0.7 : 0.4};
  transition: opacity 0.3s ease;
`;

export const StepNumber = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
`;

export const StepLabel = styled.span`
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.primary};
`;

export const FormCard = styled.div`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 16px;
  padding: 60px 80px;
  box-shadow: ${({ theme }) => theme.shadow};

  @media (max-width: 1024px) {
    padding: 40px;
  }

  @media (max-width: 768px) {
    padding: 32px 24px;
  }
`;

export const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Icon = styled.div`
  font-size: 40px;
  color: white;
`;

export const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  text-align: center;
  margin-bottom: 12px;
`;

export const Subtitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.text.secondary};
  text-align: center;
  margin-bottom: 48px;
  line-height: 1.6;
`;

export const Section = styled.section`
  margin-bottom: 40px;
  padding-bottom: 40px;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  &:last-of-type {
    border-bottom: none;
    margin-bottom: 0;
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`;

export const SectionNumber = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
`;

export const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
`;

export const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 12px;
`;

export const LabelIcon = styled.span`
  font-size: 16px;
`;

export const LogoUploadSection = styled.div`
  margin-bottom: 24px;
`;

export const LogoUploadArea = styled.div`
  display: flex;
  gap: 24px;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const UploadBox = styled.div`
  width: 200px;
  height: 200px;
  border: 2px dashed ${({ theme }) => theme.border};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${({ theme }) => theme.background.input};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.background.hover};
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const UploadIcon = styled.div`
  font-size: 40px;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.text.secondary};
`;

export const UploadText = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
  text-align: center;
`;

export const UploadGuide = styled.div`
  flex: 1;
  background: ${({ theme }) => theme.background.subtle || theme.background.main};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 20px;
`;

export const GuideTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 12px;
`;

export const GuideItem = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 6px;
  line-height: 1.5;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const InputField = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const Input = styled.input`
  flex: 1;
  height: 48px;
  padding: 0 16px;
  border: 1.5px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 15px;
  color: ${({ theme }) => theme.text.primary};
  background: ${({ theme }) => theme.background.input};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}20`};
  }

  &::placeholder {
    color: ${({ theme }) => theme.text.disabled};
  }
`;

export const Select = styled.select`
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border: 1.5px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 15px;
  color: ${({ theme }) => theme.text.primary};
  background: ${({ theme }) => theme.background.input};
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}20`};
  }
`;

export const DepartmentInputWrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
`;

export const DepartmentIconWrapper = styled.div`
  width: 48px;
  height: 48px;
  background: ${({ theme }) => theme.background.subtle || theme.background.main};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const DepartmentIcon = styled.div`
  font-size: 24px;
  color: ${({ theme }) => theme.text.secondary};
`;

export const AddButton = styled.button`
  height: 48px;
  padding: 0 24px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    filter: brightness(0.9);
  }
`;

export const PositionDropdown = styled.select`
  width: 120px;
  height: 48px;
  padding: 0 12px;
  border: 1.5px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.text.primary};
  background: ${({ theme }) => theme.background.input};
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Description = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 20px;
  line-height: 1.6;
`;

export const BulkUploadInfo = styled.div`
  background: ${({ theme }) => theme.background.subtle || theme.background.main};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
`;

export const InfoIcon = styled.div`
  font-size: 24px;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.primary};
`;

export const InfoTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 12px;
`;

export const InfoList = styled.div`
  margin-bottom: 16px;
`;

export const InfoItem = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 6px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const TemplateButton = styled.button`
  padding: 8px 16px;
  background: ${({ theme }) => theme.background.paper};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primary};
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.background.hover};
  }
`;

export const FileUploadArea = styled.div`
  margin-bottom: 24px;
`;

export const UploadDropZone = styled.div`
  width: 100%;
  min-height: 200px;
  border: 2px dashed ${({ theme }) => theme.border};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${({ theme }) => theme.background.subtle || theme.background.main};
  padding: 40px 20px;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.background.hover};
  }
`;

export const UploadMainText = styled.div`
  font-size: 15px;
  color: ${({ theme }) => theme.text.primary};
  font-weight: 500;
  margin-bottom: 8px;
  text-align: center;
`;

export const UploadSubText = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
`;

export const WarningBox = styled.div`
  background: ${({ theme }) => `${theme.status.warning}10`};
  border: 1px solid ${({ theme }) => theme.status.warning};
  border-radius: 12px;
  padding: 20px;
`;

export const WarningIcon = styled.div`
  font-size: 20px;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.status.warning};
`;

export const WarningTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.status.warning};
  filter: brightness(0.8);
  margin-bottom: 12px;
`;

export const WarningList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const WarningItem = styled.li`
  font-size: 13px;
  color: ${({ theme }) => theme.status.warning};
  filter: brightness(0.6);
  margin-bottom: 6px;
  padding-left: 16px;
  position: relative;

  &:before {
    content: '•';
    position: absolute;
    left: 0;
    font-weight: 700;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  height: 56px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 32px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => `0 8px 24px ${theme.colors.primary}4D`};
  }

  &:active {
    transform: translateY(0);
  }
`;