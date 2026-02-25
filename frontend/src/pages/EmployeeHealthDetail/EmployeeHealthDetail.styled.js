import styled from 'styled-components';

export const MainContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.background.secondary || theme.background.main};
  padding: 32px 48px;

  @media (max-width: 1024px) {
    padding: 24px;
  }
`;

export const ContentWrapper = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 16px;
  }
`;

export const BackButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background.paper};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: ${({ theme }) => theme.text.secondary};
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.background.secondary};
    border-color: ${({ theme }) => theme.text.disabled};
  }
`;

export const PageHeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

export const PageSubtitle = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.text.secondary};
  margin: 0;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 1024px) {
    width: 100%;
    
    button {
      flex: 1;
    }
  }
`;

export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background-color: ${({ theme }) => theme.background.paper};
  color: ${({ theme }) => theme.text.primary};
  border: 1.5px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background-color: ${({ theme }) => theme.background.secondary};
  }
`;

export const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;

  &:hover {
    filter: brightness(0.9);
  }
`;

export const EmployeeProfileCard = styled.div`
  background: ${({ theme }) => theme.background.paper};
  padding: 32px;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow};
  margin-bottom: 24px;
`;

export const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

export const AvatarLarge = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.secondary} 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 700;
  flex-shrink: 0;
`;

export const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const ProfileLabel = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 500;
`;

export const ProfileValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const InfoLabel = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const InfoValue = styled.div`
  font-size: 15px;
  color: ${({ theme }) => theme.text.primary};
  font-weight: 600;
`;

export const HealthStatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  background-color: ${props => {
    switch (props.status) {
      case 'normal':
        return `${props.theme.status.success}15`;
      case 'warning':
        return `${props.theme.status.warning}15`;
      case 'alert':
        return `${props.theme.status.error}15`;
      default:
        return props.theme.background.secondary;
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'normal':
        return props.theme.status.success;
      case 'warning':
        return props.theme.status.warning;
      case 'alert':
        return props.theme.status.error;
      default:
        return props.theme.text.secondary;
    }
  }};
  width: fit-content;
`;

export const AlertSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const AlertBox = styled.div`
  background: ${({ theme }) => `${theme.status.warning}10`};
  border: 1.5px solid ${({ theme }) => `${theme.status.warning}30`};
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
`;

export const AlertIcon = styled.div`
  font-size: 24px;
  flex-shrink: 0;
  color: ${({ theme }) => theme.status.warning};
`;

export const AlertContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const AlertTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.status.warning};
`;

export const AlertDate = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.status.warning};
  opacity: 0.8;
`;

export const SuccessBox = styled.div`
  background: ${({ theme }) => `${theme.status.success}10`};
  border: 1.5px solid ${({ theme }) => `${theme.status.success}30`};
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
`;

export const SuccessIcon = styled.div`
  font-size: 24px;
  flex-shrink: 0;
  color: ${({ theme }) => theme.status.success};
`;

export const SuccessContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const SuccessTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.status.success};
`;

export const SuccessDate = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.status.success};
  opacity: 0.8;
`;

export const TabContainer = styled.div`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow};
  overflow: hidden;
`;

export const TabList = styled.div`
  display: flex;
  border-bottom: 2px solid ${({ theme }) => theme.border};
  padding: 0 24px;
`;

export const Tab = styled.button`
  padding: 16px 24px;
  background: none;
  border: none;
  border-bottom: 3px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.primary : props.theme.text.secondary};
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: -2px;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const TabContent = styled.div`
  padding: 32px;
`;

export const CheckupCard = styled.div`
  border: 1.5px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
`;

export const CheckupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.background.secondary};
`;

export const CheckupIcon = styled.div`
  font-size: 24px;
  color: ${({ theme }) => theme.text.secondary};
`;

export const CheckupTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

export const CheckupDate = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 500;
`;

export const CheckupDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const DetailLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 500;
`;

export const DetailValue = styled.div`
  font-size: 15px;
  color: ${({ theme }) => theme.text.primary};
  font-weight: 600;
`;

export const DetailBadge = styled.span`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  background-color: ${props => props.status === 'normal' ? `${props.theme.status.success}15` : `${props.theme.status.error}15`};
  color: ${props => props.status === 'normal' ? props.theme.status.success : props.theme.status.error};
`;

export const DoctorNote = styled.div`
  background: ${({ theme }) => theme.background.secondary};
  border-radius: 8px;
  padding: 16px;
`;

export const NoteLabel = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  margin-bottom: 8px;
`;

export const NoteText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.6;
  margin: 0;
`;

export const VitalSignsCard = styled.div`
  border: 1.5px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 24px;
`;

export const VitalSignsTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin: 0 0 24px 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const VitalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;

  @media (max-width: 1280px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const VitalItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: ${({ theme }) => theme.background.secondary};
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.border};
`;

export const VitalIcon = styled.div`
  font-size: 24px;
  flex-shrink: 0;
  color: ${({ theme }) => theme.text.secondary};
`;

export const VitalLabel = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 4px;
`;

export const VitalValue = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: ${props => props.status === 'warning' ? props.theme.status.warning : props.theme.text.primary};
`;

export const VitalUnit = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 500;
`;

export const VitalStatus = styled.span`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  background-color: ${props => props.status === 'warning' ? `${props.theme.status.warning}15` : `${props.theme.status.success}15`};
  color: ${props => props.status === 'warning' ? props.theme.status.warning : props.theme.status.success};
  white-space: nowrap;
`;