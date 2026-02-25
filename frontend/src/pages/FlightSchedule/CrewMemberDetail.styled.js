import styled from "styled-components";

/**
 * ✅ 이 페이지는 Layout(사이드바/탑바) 바깥을 책임지지 않음.
 * ✅ MainLayout 내부에서 렌더링되는 "컨텐츠"만 스타일링.
 */

/* ==================== Page Container ==================== */
export const PageContainer = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 32px 48px;

  @media (max-width: 1440px) {
    padding: 24px 32px;
  }

  @media (max-width: 1024px) {
    padding: 20px 24px;
  }
`;

/* ==================== Header ==================== */
export const PageHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 12px;
  }
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
`;

export const BackButton = styled.button`
  width: 40px;
  height: 40px;
  background-color: ${({ theme }) => theme.background.paper};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  color: ${({ theme }) => theme.text.primary};
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.background.hover};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const BreadcrumbText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
  margin: 0 0 4px 0;
`;

export const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

export const PageSubtitle = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.text.secondary};
  margin: 4px 0 0 0;
`;

/* ==================== Profile Card ==================== */
export const ProfileCard = styled.div`
  background-color: ${({ theme }) => theme.background.paper};
  border-radius: 14px;
  padding: 32px;
  box-shadow: ${({ theme }) => theme.shadow};
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    padding: 24px;
  }
`;

export const ProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  padding-bottom: 22px;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

export const ProfileLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const ProfileAvatar = styled.div`
  width: 80px;
  height: 80px;
  background-color: ${(props) => props.$bgColor || props.theme.colors.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 800;
  color: ${({ theme }) => theme.text.inverse};
  flex-shrink: 0;
`;

export const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ProfileName = styled.h2`
  font-size: 24px;
  font-weight: 800;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

export const ProfileMetadata = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

export const MetadataItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const MetadataLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.text.secondary};
`;

export const MetadataValue = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
`;

export const MetadataDivider = styled.span`
  color: ${({ theme }) => theme.border};
  font-size: 14px;
`;

export const ProfileRight = styled.div`
  display: flex;
  align-items: center;
`;

export const EditButton = styled.button`
  padding: 10px 22px;
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.inverse};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.secondary} 100%);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 18px ${({ theme }) => `${theme.colors.primary}38`};
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ProfileDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const DetailRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const DetailLabel = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 700;
`;

export const DetailValue = styled.span`
  font-size: 15px;
  color: ${({ theme }) => theme.text.primary};
  font-weight: 600;
`;

export const StatusBadge = styled.span`
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 800;
  border-radius: 999px;
  width: fit-content;

  background-color: ${(props) =>
    props.$status === "근무 가능" ? props.theme.status.success + '20' : props.theme.status.error + '20'};
  color: ${(props) =>
    props.$status === "근무 가능" ? props.theme.status.success : props.theme.status.error};
`;

/* ==================== Tabs ==================== */
export const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 2px solid ${({ theme }) => theme.border};
`;

export const TabButton = styled.button`
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 800;
  color: ${(props) => (props.$active ? props.theme.colors.primary : props.theme.text.secondary)};
  background-color: transparent;
  border: none;
  border-bottom: 2px solid ${(props) => (props.$active ? props.theme.colors.primary : "transparent")};
  margin-bottom: -2px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

/* ==================== Leave History ==================== */
export const HistorySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const LeaveCard = styled.div`
  background-color: ${({ theme }) => theme.background.paper};
  border-radius: 14px;
  padding: 24px;
  box-shadow: ${({ theme }) => theme.shadow};
  transition: box-shadow 0.2s, transform 0.2s;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadowHover};
    transform: translateY(-2px);
  }
`;

export const LeaveHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
`;

export const LeaveIcon = styled.div`
  width: 40px;
  height: 40px;
  background-color: ${({ theme }) => `${theme.colors.primary}15`};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

export const LeaveTitle = styled.h3`
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
  flex: 1;
`;

export const LeaveDate = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
`;

export const LeaveDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const LeaveDetailRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const LeaveDetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const LeaveDetailLabel = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 700;
`;

export const LeaveDetailValue = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.text.primary};
  font-weight: 600;
`;

export const LeaveStatusBadge = styled.span`
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 800;
  border-radius: 999px;
  background-color: ${({ theme }) => `${theme.status.success}20`};
  color: ${({ theme }) => theme.status.success};
  width: fit-content;
`;

export const LeaveDurationBadge = styled.span`
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 800;
  border-radius: 999px;
  background-color: ${({ theme }) => `${theme.colors.primary}20`};
  color: ${({ theme }) => theme.colors.primary};
  width: fit-content;
`;

export const LeaveReason = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background-color: ${({ theme }) => theme.background.secondary};
  border-radius: 12px;
`;

export const LeaveReasonLabel = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 800;
`;

export const LeaveReasonText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
  line-height: 1.6;
`;

/* ==================== Modal ==================== */
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
  padding: 20px;
`;

export const ModalContainer = styled.div`
  background-color: ${({ theme }) => theme.background.paper};
  border-radius: 14px;
  width: 100%;
  max-width: 500px;
  box-shadow: ${({ theme }) => theme.shadow};
  overflow: hidden;
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
  font-weight: 800;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

export const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  background-color: transparent;
  border: none;
  font-size: 24px;
  color: ${({ theme }) => theme.text.secondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.background.secondary};
    color: ${({ theme }) => theme.text.primary};
  }
`;

export const ModalContent = styled.div`
  padding: 24px;
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
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
`;

export const FormSelect = styled.select`
  padding: 10px 14px;
  font-size: 14px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.background.input};
  color: ${({ theme }) => theme.text.primary};
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}1a`};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.background.secondary};
    cursor: not-allowed;
  }
`;

export const FormInput = styled.input`
  padding: 10px 14px;
  font-size: 14px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.background.input};
  color: ${({ theme }) => theme.text.primary};
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}1a`};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.background.secondary};
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${({ theme }) => theme.text.tertiary};
  }
`;

export const FormActions = styled.div`
  display: flex;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid ${({ theme }) => theme.border};
  justify-content: flex-end;
`;

export const CancelButton = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.secondary};
  background-color: ${({ theme }) => theme.background.paper};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.background.secondary};
    border-color: ${({ theme }) => theme.text.tertiary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const SubmitButton = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.inverse};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.secondary} 100%);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 10px 18px ${({ theme }) => `${theme.colors.primary}38`};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

export const EmptyState = styled.div`
  padding: 40px;
  text-align: center;
  color: ${({ theme }) => theme.text.secondary};
`;

export const ErrorState = styled.div`
  padding: 40px;
  text-align: center;
  color: ${({ theme }) => theme.status.error};
`;