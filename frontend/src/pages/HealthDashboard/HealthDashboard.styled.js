import styled from 'styled-components';

// Main Container
export const MainContainer = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 32px 40px;

  @media (max-width: 1024px) {
    padding: 24px 20px;
  }
`;

// Hero Section
export const HeroSection = styled.div`
  background: ${props => `linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.secondary} 100%)`};
  border-radius: 20px;
  padding: 48px 56px;
  color: ${({ theme }) => theme.text.inverse || 'white'};
  margin-bottom: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${({ theme }) => theme.shadow};

  @media (max-width: 1024px) {
    flex-direction: column;
    padding: 40px 32px;
    text-align: center;
  }
`;

export const HeroContent = styled.div`
  flex: 1;
  max-width: 700px;
`;

export const HeroTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1.3;
  color: ${({ theme }) => theme.text.inverse || 'white'};

  @media (max-width: 1024px) {
    font-size: 1.75rem;
  }
`;

export const HeroDescription = styled.p`
  font-size: 1.125rem;
  opacity: 0.95;
  margin-bottom: 28px;
  line-height: 1.6;
  color: ${({ theme }) => theme.text.inverse || 'white'};
`;

export const HeroActions = styled.div`
  display: flex;
  gap: 16px;

  @media (max-width: 1024px) {
    justify-content: center;
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const HeroButton = styled.button`
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;

  ${props => props.$variant === 'primary' ? `
    background: ${props.theme.background.paper || 'white'};
    color: ${props.theme.colors.primary};
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${({ theme }) => theme.shadowHover};
    }
  ` : `
    background: rgba(255, 255, 255, 0.15);
    color: ${({ theme }) => theme.text.inverse || 'white'};
    border: 2px solid rgba(255, 255, 255, 0.3);
    
    &:hover {
      background: rgba(255, 255, 255, 0.25);
      border-color: rgba(255, 255, 255, 0.5);
    }
  `}

  i {
    font-size: 1rem;
  }
`;

export const HeroScore = styled.div`
  @media (max-width: 1024px) {
    margin-top: 32px;
  }
`;

export const ScoreCircle = styled.div`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 3px solid rgba(255, 255, 255, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
`;

export const ScoreValue = styled.div`
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 4px;
`;

export const ScoreLabel = styled.div`
  font-size: 0.95rem;
  opacity: 0.9;
  font-weight: 500;
`;

// Grade Cards Grid
export const GradeCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 32px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const GradeCard = styled.div`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 16px;
  padding: 24px;
  box-shadow: ${({ theme }) => theme.shadow};
  transition: all 0.3s ease;
  border: 1px solid ${({ theme }) => theme.border};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadowHover};
  }
`;

export const GradeIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 12px;
`;

export const GradeInfo = styled.div`
  margin-bottom: 16px;
`;

export const GradeCategory = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 6px;
`;

export const GradeDescription = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.5;
`;

export const GradeBadge = styled.div`
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.$color};
  background: ${props => props.$color}15;
  margin-bottom: 12px;
`;

export const GradeProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: ${({ theme }) => theme.background.main};
  border-radius: 3px;
  overflow: hidden;
`;

export const GradeProgress = styled.div`
  width: ${props => props.$width}%;
  height: 100%;
  background: ${props => props.$color};
  border-radius: 3px;
  transition: width 0.6s ease;
`;

// Alert Banner
export const AlertBanner = styled.div`
  background: ${({ theme }) => `${theme.status.warning}15` || '#fef3c7'};
  border: 1px solid ${({ theme }) => theme.status.warning || '#f59e0b'};
  border-radius: 16px;
  padding: 20px 28px;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 1024px) {
    flex-direction: column;
    text-align: center;
  }
`;

export const AlertIcon = styled.i`
  font-size: 2rem;
  color: ${({ theme }) => theme.status.warning || '#f59e0b'};
  flex-shrink: 0;
`;

export const AlertContent = styled.div`
  flex: 1;
`;

export const AlertTitle = styled.div`
  font-size: 1.05rem;
  font-weight: 700;
  color: ${({ theme }) => theme.status.warning || '#b45309'};
  margin-bottom: 4px;
`;

export const AlertPeriod = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.status.warning || '#92400e'};
  opacity: 0.9;
`;

export const AlertButton = styled.button`
  padding: 12px 24px;
  background: ${({ theme }) => theme.background.paper || 'white'};
  color: ${({ theme }) => theme.status.warning || '#f59e0b'};
  border: 2px solid ${({ theme }) => theme.status.warning || '#f59e0b'};
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;

  &:hover {
    background: ${({ theme }) => theme.status.warning || '#f59e0b'};
    color: ${({ theme }) => theme.text.inverse || 'white'};
    transform: translateY(-2px);
  }

  i {
    font-size: 0.875rem;
  }
`;

// Content Grid
export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

// Section Components
export const ChartSection = styled.div`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 16px;
  padding: 28px;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
`;

export const StatisticsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  display: flex;
  align-items: center;
  gap: 10px;

  i {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 1.2rem;
  }
`;

export const PeriodTabs = styled.div`
  display: flex;
  gap: 8px;
`;

export const PeriodTab = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  
  ${props => props.$active ? `
    background: ${props.theme.colors.primary};
    color: ${props.theme.text.inverse || 'white'};
  ` : `
    background: ${props.theme.background.main};
    color: ${props.theme.text.secondary};
    
    &:hover {
      background: ${props.theme.background.hover};
    }
  `}
`;

export const ChartPlaceholder = styled.div`
  height: 350px;
  background: ${({ theme }) => theme.background.main};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed ${({ theme }) => theme.border};
`;

export const ChartIcon = styled.i`
  font-size: 4rem;
  color: ${({ theme }) => theme.border};
  margin-bottom: 16px;
`;

export const ChartText = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 8px;
`;

export const ChartSubText = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text.disabled || '#9ca3af'};
`;

// Statistics
export const StatsGrid = styled.div`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 16px;
  padding: 28px;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;

export const StatCard = styled.div`
  text-align: center;
  padding: 20px;
  background: ${({ theme }) => theme.background.main};
  border-radius: 12px;
`;

export const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.$color || props.theme.colors.primary};
  margin-bottom: 8px;
`;

export const StatLabel = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 500;
`;

// Tips Section
export const TipsSection = styled.div`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 16px;
  padding: 28px;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
`;

export const TipsTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;

  i {
    color: ${({ theme }) => theme.status.warning || '#f59e0b'};
  }
`;

export const TipsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const TipItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: ${({ theme }) => theme.background.main};
  border-radius: 12px;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.background.hover};
    transform: translateX(4px);
  }
`;

export const TipIcon = styled.div`
  font-size: 1.5rem;
  flex-shrink: 0;
`;

export const TipContent = styled.div`
  flex: 1;
`;

export const TipCategory = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 4px;
`;

export const TipTitle = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text.primary};
  line-height: 1.5;
`;

// Programs Section
export const ProgramsSection = styled.div`
  margin-bottom: 32px;
`;

export const ViewAllButton = styled.button`
  padding: 10px 20px;
  background: ${({ theme }) => theme.background.main};
  color: ${({ theme }) => theme.text.secondary};
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: ${({ theme }) => theme.background.hover};
    color: ${({ theme }) => theme.text.primary};
  }

  i {
    font-size: 0.8rem;
  }
`;

export const ProgramsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ProgramCard = styled.div`
  background: ${props => {
    switch (props.$type) {
      case 'sleep': return 'linear-gradient(135deg, #10b981 0%, #34d399 100%)';
      case 'stress': return 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)';
      case 'exercise': return 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)';
      default: return `linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.secondary} 100%)`;
    }
  }};
  border-radius: 16px;
  padding: 32px;
  color: white;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-8px);
    box-shadow: ${({ theme }) => theme.shadowHover};
  }
`;

export const ProgramIcon = styled.i`
  font-size: 2.5rem;
  margin-bottom: 20px;
  display: block;
  opacity: 0.9;
`;

export const ProgramContent = styled.div``;

export const ProgramTitle = styled.h4`
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 10px;
  line-height: 1.4;
`;

export const ProgramDesc = styled.p`
  font-size: 0.9rem;
  opacity: 0.95;
  margin-bottom: 16px;
  line-height: 1.6;
`;

export const ProgramMeta = styled.div`
  display: flex;
  gap: 16px;
`;

export const ProgramMetaItem = styled.div`
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: 0.9;

  i {
    font-size: 0.9rem;
  }
`;

// Department Section
export const DepartmentSection = styled.div`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 16px;
  padding: 32px;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
`;

export const ExportButton = styled.button`
  padding: 10px 20px;
  background: ${({ theme }) => theme.background.paper || 'white'};
  color: ${({ theme }) => theme.colors.primary};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.text.inverse || 'white'};
    transform: translateY(-2px);
  }

  i {
    font-size: 0.9rem;
  }
`;

// Department Table
export const DepartmentTable = styled.div`
  width: 100%;
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 25% 15% 35% 15% 10%;
  gap: 16px;
  padding: 16px 20px;
  background: ${({ theme }) => theme.background.main};
  border-radius: 12px 12px 0 0;
  border-bottom: 2px solid ${({ theme }) => theme.border};

  @media (max-width: 1024px) {
    display: none;
  }
`;

export const TableHeaderCell = styled.div`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const TableBody = styled.div`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 0 0 12px 12px;
`;

export const TableRow = styled.div`
  display: grid;
  grid-template-columns: 25% 15% 35% 15% 10%;
  gap: 16px;
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  align-items: center;
  transition: all 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${({ theme }) => theme.background.hover};
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 20px 16px;
  }
`;

export const TableCell = styled.div`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.text.primary};
  display: flex;
  align-items: center;

  @media (max-width: 1024px) {
    justify-content: space-between;
    
    &:before {
      content: attr(data-label);
      font-weight: 600;
      color: ${({ theme }) => theme.text.secondary};
      font-size: 0.85rem;
    }
  }
`;

export const ScoreNumber = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => {
    switch (props.$color) {
      case 'good': return props.theme.status.success || '#10b981';
      case 'warning': return props.theme.status.warning || '#f59e0b';
      case 'danger': return props.theme.status.error || '#ef4444';
      default: return props.theme.text.secondary || '#6b7280';
    }
  }};
`;

export const ProgressBarContainer = styled.div`
  width: 100%;
  height: 10px;
  background: ${({ theme }) => theme.background.main};
  border-radius: 5px;
  overflow: hidden;
`;

export const ProgressBar = styled.div`
  width: ${props => props.$width}%;
  height: 100%;
  background: ${props => {
    switch (props.$color) {
      case 'good': return 'linear-gradient(90deg, #10b981 0%, #34d399 100%)';
      case 'warning': return 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)';
      case 'danger': return 'linear-gradient(90deg, #ef4444 0%, #f87171 100%)';
      default: return 'linear-gradient(90deg, #6b7280 0%, #9ca3af 100%)';
    }
  }};
  border-radius: 5px;
  transition: width 0.6s ease;
`;

export const EmployeeCount = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
`;

export const EmployeeLabel = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.text.secondary};
  margin-left: 4px;
`;

export const StatusBadge = styled.div`
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  
  ${props => {
    switch (props.$status) {
      case 'good':
        return `
          background: ${props.theme.status.success}15;
          color: ${props.theme.status.success};
        `;
      case 'warning':
        return `
          background: ${props.theme.status.warning}15;
          color: ${props.theme.status.warning};
        `;
      case 'danger':
        return `
          background: ${props.theme.status.error}15;
          color: ${props.theme.status.error};
        `;
      default:
        return `
          background: ${props.theme.background.main};
          color: ${props.theme.text.secondary};
        `;
    }
  }}
`;