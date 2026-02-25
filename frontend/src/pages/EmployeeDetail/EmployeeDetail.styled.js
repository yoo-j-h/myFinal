import styled from "styled-components";

// --- Layout Containers ---
export const MainContainer = styled.main`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 40px;
  background-color: ${({ theme }) => theme.background.secondary || theme.background.main};
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

// --- Header Section ---
export const PageHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Breadcrumb = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
  display: flex;
  gap: 8px;

  .current {
    color: ${({ theme }) => theme.text.primary};
    font-weight: 600;
  }
`;

export const TitleGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-size: 24px;
    font-weight: 700;
    color: ${({ theme }) => theme.text.primary};
  }
`;

export const ActionButton = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  background-color: ${props => props.$primary ? props.theme.colors.primary : props.theme.background.paper}; 
  color: ${props => props.$primary ? '#ffffff' : props.theme.text.primary};
  border: ${props => props.$primary ? 'none' : `1px solid ${props.theme.border}`};
  transition: all 0.2s;

  &:hover {
    filter: brightness(0.9);
  }
`;

// --- Profile Card Section ---
export const ProfileCard = styled.section`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 16px;
  padding: 32px;
  box-shadow: ${({ theme }) => theme.shadow};
  display: flex;
  gap: 40px;
  align-items: flex-start;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

export const AvatarGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  min-width: 120px;

  .avatar-circle {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    font-size: 36px;
    font-weight: 700;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .name-box {
    text-align: center;
    h3 {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 4px;
      color: ${({ theme }) => theme.text.primary};
    }
    .rank {
      font-size: 14px;
      color: ${({ theme }) => theme.text.secondary};
    }
  }
`;

export const InfoGrid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  row-gap: 24px;
  column-gap: 32px;

  @media (max-width: 1280px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  &.full-width {
    grid-column: 1 / -1;
  }

  label {
    font-size: 13px;
    color: ${({ theme }) => theme.text.secondary};
    font-weight: 500;
  }

  p {
    font-size: 16px;
    color: ${({ theme }) => theme.text.primary};
    font-weight: 600;
    
    &.highlight {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

export const StatusBadge = styled.div`
  width: 120px;
  height: 100px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  background-color: ${({ theme }) => `${theme.status.success}10`}; 

  .label {
    font-size: 12px;
    color: ${({ theme }) => theme.text.secondary};
  }
  
  .value {
    font-size: 20px;
    font-weight: 700;
    color: ${({ theme }) => theme.status.success}; 
  }
`;

// --- Tab & History Section ---
export const TabNavigation = styled.nav`
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  gap: 24px;

  button {
    background: none;
    border: none;
    padding: 12px 4px;
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.text.secondary};
    cursor: pointer;
    position: relative;
    transition: color 0.1s;

    &.active {
      color: ${({ theme }) => theme.colors.primary};
      
      &:after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: ${({ theme }) => theme.colors.primary};
      }
    }

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

export const HistorySection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const HistoryCard = styled.div`
  background: ${({ theme }) => theme.background.paper};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  overflow: hidden;

  .card-header {
    padding: 20px 24px;
    border-bottom: 1px solid ${({ theme }) => theme.border};
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title-row {
      display: flex;
      align-items: center;
      gap: 12px;
      
      h4 {
        font-size: 16px;
        font-weight: 700;
        color: ${({ theme }) => theme.text.primary};
      }
    }
    
    .date {
      font-size: 14px;
      color: ${({ theme }) => theme.text.tertiary};
    }
  }

  .card-content {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;

    .meta-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
      background-color: ${({ theme }) => theme.background.secondary};
      padding: 20px;
      border-radius: 8px;

      @media (max-width: 1024px) {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .description-box {
      background-color: ${({ theme }) => `${theme.colors.primary}05`}; 
      border: 1px solid ${({ theme }) => `${theme.colors.primary}20`};
      border-radius: 8px;
      padding: 16px 20px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      label {
        font-size: 12px;
        color: ${({ theme }) => theme.colors.primary};
        font-weight: 600;
      }
      p {
        font-size: 15px;
        color: ${({ theme }) => theme.text.primary};
        line-height: 1.5;
      }
    }
  }
`;