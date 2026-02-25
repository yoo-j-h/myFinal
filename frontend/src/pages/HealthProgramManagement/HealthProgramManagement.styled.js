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
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
`;

export const PageHeader = styled.div`
  margin-bottom: 32px;
`;

export const HeaderBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: ${({ theme }) => `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`};
  color: ${({ theme }) => theme.text.inverse || 'white'};
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 12px;
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

export const ActionBar = styled.div`
  background: ${({ theme }) => theme.background.paper};
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow};
  margin-bottom: 24px;
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  border: 1px solid ${({ theme }) => theme.border};
`;

export const ActionButton = styled.button`
  padding: 10px 20px;
  background: ${props => props.$active ? props.theme.colors.primary : props.theme.background.main};
  color: ${props => props.$active ? props.theme.text.inverse || 'white' : props.theme.text.secondary};
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  white-space: nowrap;

  &:hover {
    background: ${props => props.$active ? props.theme.colors.primaryHover : props.theme.background.hover};
  }
`;

export const FilterButton = styled.button`
  padding: 10px 20px;
  background: ${({ theme }) => theme.background.main};
  color: ${({ theme }) => theme.text.secondary};
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.background.hover};
  }
`;

export const SortButton = styled.button`
  padding: 10px 20px;
  background: ${({ theme }) => theme.background.main};
  color: ${({ theme }) => theme.text.secondary};
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.background.hover};
  }
`;

export const SearchBar = styled.div`
  flex: 1;
  min-width: 300px;
  position: relative;

  @media (max-width: 768px) {
    width: 100%;
    min-width: 100%;
  }
`;

export const SearchIcon = styled.span`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: ${({ theme }) => theme.text.secondary};
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 10px 14px 10px 42px;
  border: 1.5px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 14px;
  background: ${({ theme }) => theme.background.main};
  color: ${({ theme }) => theme.text.primary};
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.text.disabled || '#9CA3AF'};
  }
`;

export const ProgramList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ProgramCard = styled.div`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 12px;
  padding: 28px;
  box-shadow: ${({ theme }) => theme.shadow};
  transition: all 0.2s;
  border: 1px solid ${({ theme }) => theme.border};
  cursor: pointer;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadowHover};
  }
`;

export const RejectReasonText = styled.div`
  color: ${({ theme }) => theme.status.error};
`;

export const ProgramHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const ParticipantAvatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${props => props.color || props.theme.colors.primary};
  color: ${({ theme }) => theme.text.inverse || 'white'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  flex-shrink: 0;
`;

export const ParticipantInfo = styled.div`
  flex: 1;
`;

export const ParticipantName = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
`;

export const ParticipantId = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 500;
`;

export const ParticipantDepartment = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
`;

export const StatusBadge = styled.div`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  background: ${props => {
    switch (props.$statusType) {
      case 'warning':
        return `${props.theme.status.warning}15`;
      case 'success':
        return `${props.theme.status.success}15`;
      case 'info':
        return `${props.theme.status.info || props.theme.colors.primary}15`;
      default:
        return props.theme.background.main;
    }
  }};
  color: ${props => {
    switch (props.$statusType) {
      case 'warning':
        return props.theme.status.warning;
      case 'success':
        return props.theme.status.success;
      case 'info':
        return props.theme.status.info || props.theme.colors.primary;
      default:
        return props.theme.text.secondary;
    }
  }};
`;

export const ProgramContent = styled.div`
  margin-bottom: 24px;
`;

export const SectionLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 8px;
`;

export const ProgramDescription = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.text.primary};
  line-height: 1.6;
  margin: 0;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 20px;
  background: ${({ theme }) => theme.background.main};
  border-radius: 10px;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const StatItem = styled.div`
  text-align: center;
`;

export const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 6px;
`;

export const StatLabel = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 500;
`;

export const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const FooterDate = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const CardActions = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 768px) {
    width: 100%;
    
    button {
      flex: 1;
    }
  }
`;

export const RejectButton = styled.button`
  padding: 12px 28px;
  background: ${({ theme }) => theme.background.paper || 'white'};
  color: ${({ theme }) => theme.status.error};
  border: 1.5px solid ${({ theme }) => theme.status.error};
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: center;

  &:hover {
    background: ${({ theme }) => `${theme.status.error}15`};
  }
`;

export const ApproveButton = styled.button`
  padding: 12px 28px;
  background: ${({ theme }) => theme.status.success};
  color: ${({ theme }) => theme.text.inverse || 'white'};
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: center;

  &:hover {
    background: ${({ theme }) => theme.status.successHover || theme.status.success};
  }
`;

export const EmptyState = styled.div`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 12px;
  padding: 80px 20px;
  text-align: center;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
`;

export const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
  color: ${({ theme }) => theme.text.disabled};
`;

export const EmptyText = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.text.secondary};
  margin: 0;
`;

// === Modal Components ===

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  padding: 24px;
  backdrop-filter: blur(4px);
`;

export const ModalContainer = styled.div`
  background: ${({ theme }) =>
    theme.mode === 'dark' ? theme.background.paper : '#ffffff'};
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
  animation: modalFadeIn 0.2s ease-out;

  @keyframes modalFadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export const ModalHeader = styled.div`
  padding: 24px 24px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

export const ModalCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: ${({ theme }) => theme.text.secondary};
  cursor: pointer;
  padding: 4px;
  
  &:hover {
    color: ${({ theme }) => theme.text.primary};
  }
`;

export const ModalBody = styled.div`
  padding: 24px;
  overflow-y: auto;
  flex: 1;
`;

export const ModalSection = styled.div`
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const ModalLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 8px;
`;

export const ModalValue = styled.div`
  font-size: 15px;
  color: ${props => props.$isError ? props.theme.status.error : props.theme.text.primary};
  padding: 10px 12px;
  background: ${props => props.$isBox ? props.theme.background.main : 'transparent'};
  border: ${props => props.$isBox ? `1px solid ${props.theme.border}` : 'none'};
  border-radius: 6px;
  
  ${props => props.$grid && `
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  `}
`;

export const InputTextarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 15px;
  min-height: 100px;
  resize: vertical;
  background: ${({ theme }) => theme.background.paper};
  color: ${({ theme }) => theme.text.primary};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.colors.primary}20`};
  }
`;

export const SelectBox = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 15px;
  background-color: ${({ theme }) => theme.background.paper};
  color: ${({ theme }) => theme.text.primary};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const ModalFooter = styled.div`
  padding: 16px 24px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

export const ModalActionButton = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.$variant === 'primary' && `
    background: ${props.theme.colors.primary};
    color: white;
    border: none;
    &:hover { background: ${props.theme.colors.primaryHover}; }
    &:disabled { background: ${props.theme.text.disabled}; cursor: not-allowed; }
  `}

  ${props => props.$variant === 'danger' && `
    background: ${props.theme.status.error};
    color: white;
    border: none;
    &:hover { filter: brightness(110%); }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
  `}

  ${props => props.$variant === 'secondary' && `
    background: ${props.theme.background.paper};
    color: ${props.theme.text.primary};
    border: 1px solid ${props.theme.border};
    &:hover { background: ${props.theme.background.hover}; }
  `}
`;

export const FilterGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

  @media (max-width: 640px) {
    flex-wrap: wrap;
    width: 100%;
  }
`;

export const FilterSelect = styled.select`
  height: 40px;
  padding: 0 12px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.background.paper};
  color: ${({ theme }) => theme.text.primary};
  font-size: 14px;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const ActionGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

export const HeaderContent = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex: 1;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

export const ParticipantDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

export const ProgramTitleText = styled.span`
  display: block;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 4px;
  font-size: 16px;
`;

export const ProgramDateText = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text.tertiary};
  margin-top: 4px;
  display: block;
`;
