import styled from "styled-components";

// --- Layout Containers ---
export const MainContainer = styled.main`
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.background.secondary || theme.background.main};
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const BannerSection = styled.div`
  width: 100%;
  height: 240px;
  background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.secondary} 100%);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
`;

export const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1440px;
  padding: 0 40px;
  margin-top: 60px;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (max-width: 1024px) {
    padding: 0 24px;
  }
`;

export const BackButton = styled.button`
  position: relative;
  z-index: 2;
  align-self: flex-start;
  margin: 20px 0 0 40px;
  background: none;
  border: none;
  color: white;
  font-size: 14px;
  cursor: pointer;
  opacity: 0.9;
  
  &:hover {
    opacity: 1;
    text-decoration: underline;
  }
`;

// --- Info Card Section ---
export const InfoCard = styled.section`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadow};
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-top: 40px;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .title-group {
    display: flex;
    gap: 24px;
    align-items: center;

    .dept-icon {
      width: 80px;
      height: 80px;
      background-color: ${({ theme }) => `${theme.colors.primary}15`};
      border-radius: 12px;
    }

    h1 {
      font-size: 32px;
      font-weight: 700;
      color: ${({ theme }) => theme.text.primary};
      margin-bottom: 8px;
    }

    .eng-name {
      font-size: 16px;
      color: ${({ theme }) => theme.text.secondary};
    }
  }
`;

export const ActionGroup = styled.div`
  display: flex;
  gap: 12px;

  button {
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    
    &.primary {
      background-color: ${({ theme }) => theme.colors.primary};
      color: white;
      border: none;
      &:hover {
        filter: brightness(0.9);
      }
    }
    
    &.secondary {
      background-color: ${({ theme }) => theme.background.paper};
      color: ${({ theme }) => theme.text.primary};
      border: 1px solid ${({ theme }) => theme.border};
      &:hover {
        background-color: ${({ theme }) => theme.background.secondary};
      }
    }
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  padding-top: 32px;
  border-top: 1px solid ${({ theme }) => theme.border};

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  .label {
    font-size: 13px;
    color: ${({ theme }) => theme.text.secondary};
  }

  .value {
    font-size: 18px;
    color: ${({ theme }) => theme.text.primary};
    font-weight: 600;
  }
`;

// --- Tab & Content ---
export const TabNavigation = styled.nav`
  display: flex;
  gap: 32px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  margin-bottom: 16px;
`;

export const TabItem = styled.button`
  background: none;
  border: none;
  padding: 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.$isActive ? props.theme.colors.primary : props.theme.text.secondary};
  border-bottom: 2px solid ${props => props.$isActive ? props.theme.colors.primary : 'transparent'};
  cursor: pointer;
  transition: color 0.1s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const TableSection = styled.section`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  padding: 24px;
  min-height: 400px;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h3 {
    font-size: 18px;
    font-weight: 700;
    color: ${({ theme }) => theme.text.primary};
  }

  .add-btn {
    color: ${({ theme }) => theme.colors.primary};
    background: none;
    border: none;
    font-weight: 600;
    cursor: pointer;
    font-size: 14px;
    &:hover { text-decoration: underline; }
  }
`;

// --- Table Components ---
export const TeamTable = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TableRowBase = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.background.secondary};

  .col-id { width: 60px; text-align: center; color: ${({ theme }) => theme.text.tertiary}; }
  .col-name { width: 200px; font-weight: 600; color: ${({ theme }) => theme.text.primary}; }
  .col-leader { width: 150px; color: ${({ theme }) => theme.text.secondary}; }
  .col-count { width: 100px; text-align: center; color: ${({ theme }) => theme.text.primary}; }
  .col-task { flex: 1; color: ${({ theme }) => theme.text.secondary}; }
  .col-action { width: 80px; text-align: right; }
`;

export const TableHeader = styled(TableRowBase)`
  background-color: ${({ theme }) => theme.background.secondary};
  border-radius: 8px;
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 500;
  border-bottom: none;
`;

export const TableRow = styled(TableRowBase)`
  font-size: 15px;
  transition: background-color 0.1s;

  &:hover {
    background-color: ${({ theme }) => theme.background.hover};
  }

  .col-action .link {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
  }
`;

export const StatusBadge = styled.span`
  background-color: ${({ theme }) => `${theme.status.success}15`};
  color: ${({ theme }) => theme.status.success};
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
`;