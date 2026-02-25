import styled from 'styled-components';

// Main Container
export const MainContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 40px;

  @media (max-width: 1024px) {
    padding: 24px 20px;
  }
`;

// Survey Header
export const SurveyHeader = styled.div`
  background: ${({ theme }) => `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`};
  border-radius: 16px;
  padding: 40px;
  color: ${({ theme }) => theme.text.inverse};
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 1024px) {
    padding: 30px;
    flex-direction: column;
    text-align: center;
  }
`;

export const HeaderIcon = styled.i`
  font-size: 2.5rem;
  opacity: 0.9;
`;

export const HeaderContent = styled.div`
  flex: 1;
`;

export const HeaderTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 8px;

  @media (max-width: 1024px) {
    font-size: 1.5rem;
  }
`;

export const HeaderDescription = styled.p`
  font-size: 1rem;
  opacity: 0.9;
  line-height: 1.6;
`;

// Progress Bar
export const ProgressBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;
  position: relative;
  padding: 0 50px;

  @media (max-width: 1024px) {
    padding: 0 20px;
  }
`;

export const ProgressLine = styled.div`
  position: absolute;
  top: 20px;
  left: 80px;
  right: 80px;
  height: 3px;
  background: ${({ theme }) => theme.border};
  z-index: 0;

  @media (max-width: 1024px) {
    left: 50px;
    right: 50px;
  }
`;

export const ProgressStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: ${props => props.$active || props.$completed ? 'pointer' : 'default'};
  z-index: 1;
  opacity: ${props => props.$active || props.$completed ? 1 : 0.6};
  transition: all 0.3s ease;

  &:hover {
    opacity: ${props => props.$active || props.$completed ? 0.8 : 0.6};
  }
`;

export const StepCircle = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props =>
    props.$completed ? (props.theme.status?.success || '#10b981') :
      props.$active ? `linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.secondary} 100%)` :
        props.theme.border
  };
  color: ${props => props.$active || props.$completed ? props.theme.text.inverse : props.theme.text.tertiary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 12px;
  transition: all 0.3s ease;
  box-shadow: ${props => props.$active ? `0 4px 12px ${props.theme.colors.primary}4d` : 'none'};
`;

export const StepLabel = styled.span`
  font-size: 0.875rem;
  color: ${props => props.$active || props.$completed ? props.theme.text.primary : props.theme.text.tertiary};
  font-weight: ${props => props.$active || props.$completed ? '600' : '400'};
  text-align: center;
  white-space: nowrap;
`;

// Survey Card
export const SurveyCard = styled.div`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 16px;
  padding: 48px;
  box-shadow: ${({ theme }) => theme.shadow || '0 4px 20px rgba(0, 0, 0, 0.08)'};
  animation: fadeIn 0.4s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 1024px) {
    padding: 32px 24px;
  }
`;

// Role Badge
export const RoleBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: ${({ theme }) => `${theme.colors.primary}20`};
  color: ${({ theme }) => theme.colors.primary};
  padding: 10px 20px;
  border-radius: 24px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 24px;

  i {
    font-size: 1rem;
  }
`;

// Section Header
export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 2px solid ${({ theme }) => theme.border};
`;

export const SectionIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: ${props => {
    switch (props.$color) {
      case 'green': return `linear-gradient(135deg, ${props.theme.status?.success || '#10b981'} 0%, ${props.theme.status?.success || '#34d399'} 100%)`;
      case 'purple': return 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)';
      case 'orange': return `linear-gradient(135deg, ${props.theme.status?.warning || '#f97316'} 0%, ${props.theme.status?.warning || '#fb923c'} 100%)`;
      default: return `linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.secondary} 100%)`;
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text.inverse};
  font-size: 1.5rem;
  flex-shrink: 0;
`;

export const SectionInfo = styled.div`
  flex: 1;
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 6px;

  @media (max-width: 1024px) {
    font-size: 1.25rem;
  }
`;

export const SectionDescription = styled.p`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.text.secondary};
`;

// Info Grid (Step 1)
export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoItem = styled.div`
  background: ${({ theme }) => theme.background.secondary};
  padding: 20px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
`;

export const InfoLabel = styled.label`
  display: block;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 6px;
  font-weight: 500;
`;

export const InfoValue = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
`;

// Notice Box
export const NoticeBox = styled.div`
  background: ${({ theme }) => `${theme.status.warning}1a`};
  border: 1px solid ${({ theme }) => theme.status.warning};
  border-radius: 12px;
  padding: 24px;
  margin-top: 32px;
`;

export const NoticeTitle = styled.h4`
  color: ${({ theme }) => theme.status.warning};
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;

  i {
    font-size: 1.1rem;
  }
`;

export const NoticeList = styled.ul`
  color: ${({ theme }) => theme.status.warning};
  font-size: 0.95rem;
  padding-left: 24px;
  line-height: 1.8;

  li {
    margin-bottom: 6px;
  }
`;

// Stats Grid
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const StatBox = styled.div`
  background: ${({ theme }) => theme.background.secondary};
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.border};
`;

export const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => {
    switch (props.$color) {
      case 'green': return props.theme.status?.success || '#10b981';
      case 'purple': return '#8b5cf6';
      case 'orange': return props.theme.status?.warning || '#f97316';
      default: return props.theme.colors.primary;
    }
  }};
  margin-bottom: 8px;
`;

export const StatUnit = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
  margin-left: 4px;
`;

export const StatLabel = styled.div`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 500;
`;

// Question Item
export const QuestionItem = styled.div`
  margin-bottom: 40px;
  
  &:last-of-type {
    margin-bottom: 0;
  }
`;

export const QuestionText = styled.div`
  font-size: 1.05rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 20px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  line-height: 1.6;
`;

export const QuestionNumber = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.text.inverse};
  border-radius: 50%;
  font-size: 0.875rem;
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 2px;
`;

// Rating Scale
export const RatingScale = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 1024px) {
    gap: 8px;
  }
`;

export const RatingOption = styled.div`
  flex: 1;
`;

export const RatingInput = styled.input`
  display: none;
`;

export const RatingLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 12px;
  background: ${props => props.$checked ? `linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.secondary} 100%)` : props.theme.background.secondary};
  border: 2px solid ${props => props.$checked ? props.theme.colors.primary : props.theme.border};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 100px;
  color: ${props => props.$checked ? props.theme.text.inverse : props.theme.text.primary};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${props => props.$checked ? `linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.secondary} 100%)` : props.theme.background.hover};
  }
`;

export const RatingValue = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 8px;
`;

export const RatingText = styled.span`
  font-size: 0.8rem;
  text-align: center;
  white-space: pre-line;
  line-height: 1.4;
`;

// Comment Section
export const CommentSection = styled.div`
  margin-top: 40px;
`;

export const CommentLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 12px;
  font-weight: 500;

  i {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const CommentTextarea = styled.textarea`
  width: 100%;
  padding: 16px;
  border: 2px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  font-family: inherit;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.text.primary};
  background: ${({ theme }) => theme.background.input};
  resize: vertical;
  min-height: 120px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.background.paper};
  }

  &::placeholder {
    color: ${({ theme }) => theme.text.tertiary};
  }
`;

// Action Buttons
export const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    
    button {
      width: 100%;
    }
  }
`;

export const PrevButton = styled.button`
  padding: 14px 32px;
  background: ${({ theme }) => theme.background.secondary};
  color: ${({ theme }) => theme.text.secondary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.background.hover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  i {
    font-size: 0.875rem;
  }
`;

export const NextButton = styled.button`
  padding: 14px 32px;
  background: ${({ theme }) => `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`};
  color: ${({ theme }) => theme.text.inverse};
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => `0 6px 16px ${theme.colors.primary}66`};
  }

  i {
    font-size: 0.875rem;
  }
`;

export const SubmitButton = styled.button`
  padding: 14px 32px;
  background: ${({ theme }) => `linear-gradient(135deg, ${theme.status.success || '#10b981'} 0%, ${theme.status.success || '#34d399'} 100%)`};
  color: ${({ theme }) => theme.text.inverse};
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => `0 6px 16px ${theme.status.success}66`};
  }

  i {
    font-size: 0.875rem;
  }
`;

// Result Summary
export const ResultSummary = styled.div`
  text-align: center;
  padding: 40px 0;
`;

export const ResultScoreCircle = styled.div`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: ${({ theme }) => `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto 32px;
  color: ${({ theme }) => theme.text.inverse};
  box-shadow: ${({ theme }) => `0 8px 24px ${theme.colors.primary}4d`};
`;

export const ResultScore = styled.div`
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1;
`;

export const ResultMaxScore = styled.div`
  font-size: 1rem;
  opacity: 0.9;
  margin-top: 4px;
`;

export const ResultGrade = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: ${props => {
    switch (props.$type) {
      case 'good': return props.theme.status?.success || '#10b981';
      case 'normal': return props.theme.status?.warning || '#f59e0b';
      case 'bad': return props.theme.status?.error || '#ef4444';
      default: return props.theme.text.secondary;
    }
  }};
`;

export const ResultMessage = styled.p`
  color: ${({ theme }) => theme.text.secondary};
  font-size: 1rem;
  line-height: 1.8;
  max-width: 600px;
  margin: 0 auto;
`;

// Result Details
export const ResultDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ResultDetailCard = styled.div`
  background: ${({ theme }) => theme.background.secondary};
  padding: 28px;
  border-radius: 12px;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.border};
`;

export const DetailLabel = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 12px;
  font-weight: 500;
`;

export const DetailScore = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 12px;
`;

export const DetailGrade = styled.div`
  display: inline-block;
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 600;
  background: ${props => {
    switch (props.$type) {
      case 'good': return `${props.theme.status?.success || '#10b981'}20`;
      case 'normal': return `${props.theme.status?.warning || '#f59e0b'}20`;
      case 'bad': return `${props.theme.status?.error || '#ef4444'}20`;
      default: return props.theme.background.hover;
    }
  }};
  color: ${props => {
    switch (props.$type) {
      case 'good': return props.theme.status?.success || '#059669';
      case 'normal': return props.theme.status?.warning || '#d97706';
      case 'bad': return props.theme.status?.error || '#dc2626';
      default: return props.theme.text.secondary;
    }
  }};
`;

// Recommend Section
export const RecommendSection = styled.div`
  margin-top: 40px;
  padding: 32px;
  background: ${({ theme }) => `${theme.colors.primary}10`};
  border-radius: 12px;
`;

export const RecommendTitle = styled.h4`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;

  i {
    font-size: 1.3rem;
  }
`;

export const RecommendList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const RecommendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background: ${({ theme }) => theme.background.paper};
  padding: 20px;
  border-radius: 12px;
  transition: all 0.2s ease;
  border: 1px solid ${({ theme }) => theme.border};

  &:hover {
    transform: translateX(4px);
    box-shadow: ${({ theme }) => theme.shadow || '0 4px 12px rgba(0, 0, 0, 0.08)'};
  }
`;

export const RecommendIcon = styled.i`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.primary};
  width: 40px;
  text-align: center;
`;

export const RecommendContent = styled.div`
  flex: 1;
`;

export const RecommendItemTitle = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 4px;
`;

export const RecommendItemDesc = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text.secondary};
`;
