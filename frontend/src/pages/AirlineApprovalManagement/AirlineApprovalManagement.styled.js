import styled from 'styled-components';

export const MainContainer = styled.div`
  flex: 1;
  padding: 32px 48px;
  max-width: 1600px;
  margin: 0 auto;

  @media (max-width: 1440px) {
    padding: 24px 32px;
  }

  @media (max-width: 1024px) {
    margin-left: 0;
    padding: 20px 24px;
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: ${({ theme, $type }) => {
    switch ($type) {
      case 'pending':
        return theme.mode === 'dark' ? `${theme.status.warning}20` : '#FFF8E1';
      case 'approved':
        return theme.mode === 'dark' ? `${theme.status.success}20` : '#E6FFFA';
      case 'rejected':
        return theme.mode === 'dark' ? `${theme.status.error}20` : '#FFF5F5';
      default:
        return theme.background.paper;
    }
  }};
  border: 1px solid ${({ theme, $type }) => {
    if (theme.mode === 'dark') {
      switch ($type) {
        case 'pending': return `${theme.status.warning}40`;
        case 'approved': return `${theme.status.success}40`;
        case 'rejected': return `${theme.status.error}40`;
        default: return theme.border;
      }
    }
    return 'transparent';
  }};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadowHover};
  }
`;

export const StatIcon = styled.div`
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  background: ${({ theme, $type }) => {
    switch ($type) {
      case 'pending': return theme.status.warning;
      case 'approved': return theme.status.success;
      case 'rejected': return theme.status.error;
      default: return theme.text.tertiary;
    }
  }};
  color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

export const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

export const StatLabel = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.secondary};
`;

export const StatValue = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

export const StatSubtext = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.tertiary};
`;

export const Header = styled.div`
  margin-bottom: 32px;
`;

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 8px;
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
`;

export const FilterBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`;

export const SearchInput = styled.input`
  flex: 1;
  padding: 10px 16px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 14px;
  background: ${({ theme }) => theme.background.input};
  color: ${({ theme }) => theme.text.primary};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.text.disabled};
  }
`;

export const FilterButton = styled.button`
  padding: 10px 20px;
  border: 1px solid ${({ theme, $active }) => $active ? theme.colors.primary : theme.border};
  border-radius: 8px;
  background: ${({ theme, $active }) => $active ? theme.colors.primary : theme.background.secondary};
  color: ${({ theme, $active }) => $active ? theme.text.inverse : theme.text.primary};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  
  &:hover {
    background: ${({ theme, $active }) => $active ? theme.colors.primary : theme.background.hover};
    filter: ${({ $active }) => $active ? 'brightness(0.9)' : 'none'};
  }
`;

export const ApprovalList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ApprovalCard = styled.div`
  background: ${({ theme }) => theme.background.paper};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 24px;
  box-shadow: ${({ theme }) => theme.shadow};
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadowHover};
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 20px;
`;

export const AirlineInfo = styled.div`
  flex: 1;
`;

export const AirlineName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  
  ${({ $status, theme }) => {
    switch ($status) {
      case 'pending':
        return `background: ${theme.status.warning}20; color: ${theme.status.warning};`;
      case 'approved':
        return `background: ${theme.status.success}20; color: ${theme.status.success};`;
      case 'rejected':
        return `background: ${theme.status.error}20; color: ${theme.status.error};`;
      default:
        return `background: ${theme.background.secondary}; color: ${theme.text.secondary};`;
    }
  }}
`;

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

export const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
`;

export const DetailLabel = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.text.primary};
`;

export const ThemeColorBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ColorSwatch = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background-color: ${props => props.$color};
  border: 1px solid ${({ theme }) => theme.border};
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

export const Button = styled.button`
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  
  ${({ $approve, theme }) => $approve && `
    background: ${theme.status.success};
    color: white;
    &:hover {
      filter: brightness(0.9);
    }
  `}
  
  ${({ $reject, theme }) => $reject && `
    background: ${theme.status.error};
    color: white;
    &:hover {
      filter: brightness(0.9);
    }
  `}
  
  ${({ $view, theme }) => $view && `
    background: ${theme.background.secondary};
    color: ${theme.text.primary};
    border: 1px solid ${theme.border};
    &:hover {
      background: ${theme.background.hover};
    }
  `}
`;

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
  backdrop-filter: blur(4px);
`;

export const ModalContainer = styled.div`
  background-color: ${({ theme }) => theme.background.paper};
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  padding: 24px;
  box-shadow: ${({ theme }) => theme.shadow};
`;

export const ModalHeader = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin: 0 0 16px 0;
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.background.input};
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 24px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;
