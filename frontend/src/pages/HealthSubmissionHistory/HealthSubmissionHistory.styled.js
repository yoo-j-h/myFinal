import styled from 'styled-components';

export const CardContent = styled.div`
  padding: 16px;
`;

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
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  gap: 24px;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
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

export const StatsCard = styled.div`
  background: ${({ theme }) => `linear-gradient(135deg, ${theme.colors.primary}10 0%, ${theme.colors.primary}20 100%)`};
  border: 1.5px solid ${({ theme }) => `${theme.colors.primary}40`};
  border-radius: 12px;
  padding: 20px 28px;
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 200px;

  @media (max-width: 1024px) {
    width: 100%;
  }
`;

export const StatsIcon = styled.div`
  font-size: 32px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.primary};
`;

export const StatsLabel = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
  margin-bottom: 4px;
`;

export const StatsValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1;
`;

export const SearchSection = styled.form`
  background: ${({ theme }) => theme.background.paper};
  padding: 20px 24px;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow};
  margin-bottom: 32px;
  display: flex;
  gap: 12px;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.border};

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

export const SearchBar = styled.div`
  flex: 1;
  position: relative;
  min-width: 300px;

  @media (max-width: 768px) {
    min-width: 100%;
  }
`;

export const SearchIcon = styled.span`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  color: ${({ theme }) => theme.text.secondary};
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 1.5px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 15px;
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

export const FilterButton = styled.button`
  width: 48px;
  height: 48px;
  border: 1.5px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background.paper || 'white'};
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text.primary};

  &:hover {
    background: ${({ theme }) => theme.background.hover};
    border-color: ${({ theme }) => theme.text.secondary};
  }
`;

export const SubmitButton = styled.button`
  padding: 14px 32px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.text.inverse || 'white'};
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover || theme.colors.primary};
  }
`;

export const HistorySection = styled.div`
  margin-bottom: 32px;
`;

export const HistoryCount = styled.div`
  font-size: 15px;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 16px;
  font-weight: 500;
`;

export const HistoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

export const HistoryCard = styled.div`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 12px;
  padding: 24px;
  box-shadow: ${({ theme }) => theme.shadow};
  border-left: 4px solid ${props => props.hasAdminNote ? (props.theme.status.success || '#10B981') : (props.theme.border || '#E5E7EB')};
  transition: all 0.2s;
  border: 1px solid ${({ theme }) => theme.border};
  border-left-width: 4px;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadowHover};
    transform: translateY(-2px);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const CardIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: ${props => props.type === 'pdf' ? `${props.theme.status.error}15` : `${props.theme.colors.primary}15`};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
  color: ${props => props.type === 'pdf' ? props.theme.status.error : props.theme.colors.primary};
`;

export const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
  line-height: 1.4;
`;

export const CardDate = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const FileAttachment = styled.div`
  background: ${({ theme }) => theme.background.main};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const FileIcon = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.text.secondary};
`;

export const FileName = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.text.primary};
  font-weight: 500;
  word-break: break-word;
`;

export const ContentSection = styled.div`
  padding: 16px;
  background: ${props => props.isAdminNote ? `${props.theme.status.success}10` : props.theme.background.main};
  border-radius: 8px;
  margin-top: 12px;
  border: 1px solid ${props => props.isAdminNote ? `${props.theme.status.success}30` : props.theme.border};
`;

export const ContentLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.isAdminNote ? (props.theme.status.success || '#065F46') : (props.theme.colors.primary || '#1E88E5')};
  margin-bottom: 8px;
`;

export const ContentText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.6;
  margin: 0;
  white-space: pre-line;
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

export const CardTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;
