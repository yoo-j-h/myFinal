import styled from "styled-components";


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

// ==================== Header ====================
export const PageHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 12px;
  }
`;

export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const BreadcrumbText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
  margin: 0;
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
  margin: 0;
`;

// ==================== Flight Summary Card ====================
export const FlightSummaryCard = styled.section`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 14px;
  padding: 22px;
  box-shadow: ${({ theme }) => theme.shadow};
  margin-bottom: 18px;
`;

export const FlightSummaryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const FlightBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const AirlineIcon = styled.div`
  width: 46px;
  height: 46px;
  background: ${props => `linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.secondary} 100%)`};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: ${({ theme }) => theme.text.inverse || 'white'};
`;

export const FlightNumber = styled.h3`
  font-size: 18px;
  font-weight: 900;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

export const FlightDate = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  margin: 4px 0 0 0;
`;

export const StatusBadgeGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const StatusBadge = styled.span`
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 800;
  border-radius: 999px;

  background-color: ${(props) => (props.$status === "normal" ? `${props.theme.colors.primary}15` : `${props.theme.status.success}15`)};
  color: ${(props) => (props.$status === "normal" ? props.theme.colors.primary : props.theme.status.success)};
`;

// ==================== Flight Route ====================
export const FlightRoute = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 14px;
  }
`;

export const RoutePoint = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

export const RouteTime = styled.p`
  font-size: 24px;
  font-weight: 900;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

export const RouteCode = styled.p`
  font-size: 16px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
`;

export const RouteAirport = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  margin: 0;
`;

export const RouteIndicator = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
`;

export const RoutePlaneIcon = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: ${({ theme }) => `${theme.colors.primary}15`};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
`;

export const RouteLine = styled.div`
  width: 100%;
  height: 2px;
  background: ${props => `linear-gradient(90deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.secondary} 100%)`};
  border-radius: 2px;
`;

export const RouteDuration = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  margin: 0;
`;

export const ViewDetailsButton = styled.button`
  margin-top: 16px;
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background.paper};
  color: ${({ theme }) => theme.text.primary};
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.background.secondary};
    border-color: ${({ theme }) => theme.border};
  }
`;

// ==================== Crew Section ====================
export const CrewSection = styled.section`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 14px;
  padding: 18px 22px;
  box-shadow: ${({ theme }) => theme.shadow};
  margin-top: 16px;
`;

export const CrewSectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
`;

export const CrewSectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 900;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

export const CrewMemberList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const CrewMemberCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 14px;
  padding: 14px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  background: ${({ theme }) => theme.background.secondary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.background.hover};
    border-color: ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

export const MessageContainer = styled.div`
  padding: 40px;
  text-align: center;
  color: ${({ theme }) => theme.text.secondary};
`;

export const SmallMessage = styled(MessageContainer)`
  padding: 20px;
`;

export const ErrorMessageContainer = styled.div`
  padding: 40px;
  text-align: center;
  color: ${({ theme }) => theme.status.error};
`;

export const CrewMemberLeft = styled.div`
  display: flex;
  gap: 12px;
`;

export const CrewAvatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: ${(props) => props.$bgColor || props.theme.colors.primary};
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex: 0 0 auto;
`;

export const CrewInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const CrewName = styled.div`
  font-size: 15px;
  font-weight: 900;
  color: ${({ theme }) => theme.text.primary};
`;

export const CrewMetadata = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  color: ${({ theme }) => theme.text.secondary};
  font-size: 12px;
`;

export const CrewRole = styled.span`
  font-weight: 800;
  color: ${({ theme }) => theme.text.secondary};
`;

export const CrewDivider = styled.span`
  color: ${({ theme }) => theme.border};
`;

export const CrewID = styled.span``;

export const CrewExperience = styled.span``;

export const CrewCertifications = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const CertBadge = styled.span`
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  background: ${({ theme }) => theme.background.secondary};
  color: ${({ theme }) => theme.colors.primary};
`;

export const CrewMemberRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 0 0 auto;

  @media (max-width: 1024px) {
    width: 100%;
    justify-content: space-between;
  }
`;

export const CrewStatusBadge = styled.span`
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;

  background: ${(props) => {
    if ((props.$status || "").includes("근무")) return `${props.theme.status.success}15`;
    if ((props.$status || "").includes("휴가")) return `${props.theme.status.error}15`;
    return props.theme.background.secondary;
  }};

  color: ${(props) => {
    if ((props.$status || "").includes("근무")) return props.theme.status.success;
    if ((props.$status || "").includes("휴가")) return props.theme.status.error;
    return props.theme.text.secondary;
  }};
`;

export const CrewActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const ActionButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background.paper};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};

  &:hover {
    background: ${({ theme }) => theme.background.secondary};
    border-color: ${({ theme }) => theme.border};
  }
`;

// 승무원 추가/삭제 버튼
export const AddCrewButton = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primary};
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
    border-color: ${({ theme }) => theme.colors.secondary};
  }
`;

export const EmptyCrewMessage = styled.div`
  padding: 48px 24px;
  text-align: center;
  color: ${({ theme }) => theme.text.secondary};
  font-size: 16px;
  background: ${({ theme }) => theme.background.secondary};
  border-radius: 8px;
  border: 1px dashed ${({ theme }) => theme.border.light};
`;

// ==================== Crew Table ====================
export const CrewTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.background.primary};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const CrewTableHeader = styled.thead`
  background: ${({ theme }) => theme.background.secondary};
`;

export const CrewTableRow = styled.tr`
  &:hover {
    background: ${({ theme }) => theme.background.hover};
  }
`;

export const CrewTableHeaderCell = styled.th`
  padding: 16px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.text.primary};
  border-bottom: 2px solid ${({ theme }) => theme.border.light};
`;

export const CrewTableBody = styled.tbody`
  ${CrewTableRow} {
    border-bottom: 1px solid ${({ theme }) => theme.border.light};
    
    &:last-child {
      border-bottom: none;
    }
  }
`;

export const CrewTableCell = styled.td`
  padding: 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.text.primary};
`;

export const CrewNameLink = styled.span`
  color: ${({ theme }) => theme.colors.primary || '#3b82f6'};
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
    color: ${({ theme }) => theme.colors.primaryHover || theme.colors.primary || '#2563eb'};
  }
`;

export const DeleteCrewButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.status.error};
  background: ${({ theme }) => theme.background.paper};
  color: ${({ theme }) => theme.status.error};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;

  &:hover {
    background: ${({ theme }) => `${theme.status.error}10`};
    border-color: ${({ theme }) => theme.status.error};
  }
`;

// 모달 스타일
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContainer = styled.div`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 14px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.shadow};
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 900;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

export const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.background.secondary};
  color: ${({ theme }) => theme.text.secondary};
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ theme }) => theme.border};
    color: ${({ theme }) => theme.text.primary};
  }
`;

export const ModalContent = styled.div`
  margin-bottom: 20px;
`;

export const FormGroup = styled.div`
  margin-bottom: 16px;
`;

export const FormLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 8px;
`;

export const EmployeeSelect = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 14px;
  background: ${({ theme }) => theme.background.input};
  color: ${({ theme }) => theme.text.primary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}15`};
  }
`;

export const EmptyMessage = styled.p`
  padding: 16px;
  text-align: center;
  color: ${({ theme }) => theme.text.secondary};
  font-size: 14px;
  background: ${({ theme }) => theme.background.secondary};
  border-radius: 8px;
  margin: 0;
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

export const CancelButton = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background.paper};
  color: ${({ theme }) => theme.text.secondary};
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.background.secondary};
    border-color: ${({ theme }) => theme.text.disabled};
  }
`;

export const SubmitButton = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primary};
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.secondary};
    border-color: ${({ theme }) => theme.colors.secondary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;