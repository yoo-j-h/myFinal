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
  opacity: ${props => props.active ? 1 : 0.4};
  transition: opacity 0.3s ease;
`;

export const StepNumber = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text}; // Assuming text on primary is white or defined
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

export const ShieldIcon = styled.div`
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

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  background: ${({ theme }) => theme.background.subtle || theme.background.main};
  padding: 24px;
  border-radius: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const InfoLabel = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 500;
`;

export const InfoValue = styled.span`
  font-size: 15px;
  color: ${({ theme }) => theme.text.primary};
  font-weight: 500;
`;

export const PasswordField = styled.div`
  margin-bottom: 20px;
`;

export const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 8px;
`;

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const Input = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 48px 0 16px;
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

export const ToggleButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  padding: 4px;
  opacity: 0.6;
  color: ${({ theme }) => theme.text.primary};
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

export const PasswordHint = styled.div`
  background: ${({ theme }) => theme.background.subtle || theme.background.main};
  border: 1px solid ${({ theme }) => theme.border};
  padding: 16px 20px;
  border-radius: 8px;
  margin-top: 16px;
`;

export const HintTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 8px;
`;

export const HintList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const HintItem = styled.li`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.$valid ? props.theme.status.success : props.theme.status.error};
  padding: 8px 12px;
  border-radius: 6px;
  background: ${props => props.$valid ? `${props.theme.status.success}10` : `${props.theme.status.error}10`};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const TermsBox = styled.div`
  background: ${({ theme }) => theme.background.subtle || theme.background.main};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 24px;
`;

export const TermItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

export const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.primary};
`;

export const TermLabel = styled.label`
  flex: 1;
  font-size: 15px;
  color: ${({ theme }) => theme.text.primary};
  font-weight: 500;
  cursor: pointer;
`;

export const TermLink = styled.a`
  font-size: 18px;
  text-decoration: none;
  opacity: 0.7;
  color: ${({ theme }) => theme.colors.primary};
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

export const TermDescription = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  margin: 0 0 20px 32px;
  line-height: 1.5;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  height: 56px;
  background: ${props => props.disabled
    ? props.theme.background.disabled
    : props.theme.colors.primary};
  color: white;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  margin-top: 32px;

  &:hover {
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.disabled
    ? 'none'
    : `0 8px 24px ${props.theme.colors.primary}4D`};
  }

  &:active {
    transform: ${props => props.disabled ? 'none' : 'translateY(0)'};
  }
`;