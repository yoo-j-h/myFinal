import styled from 'styled-components';

export const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ theme }) => theme.background.secondary || theme.background.main};
  width: 100%;
`;

export const MainContent = styled.main`
  width: 100%;
  flex: 1;
  min-height: 100vh;
`;

export const ContentWrapper = styled.div`
  padding: 48px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 1440px) {
    padding: 32px;
  }
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${({ theme }) => theme.background.paper};
  border: 2px solid ${({ theme }) => theme.border};
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.secondary};
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 24px;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const PostCard = styled.article`
  background: ${({ theme }) => theme.background.paper};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadow};
  overflow: hidden;
  margin-bottom: 32px;
`;

export const PostHeader = styled.div`
  padding: 40px 48px 32px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

export const CategoryBadge = styled.div`
  display: inline-block;
  background: ${props => props.$bgColor || `${props.theme.colors.primary}15`};
  color: ${props => {
    if (props.bgColor === '#FFE5E5') return props.theme.status.error;
    if (props.bgColor === '#FFF9E5') return props.theme.status.warning;
    return props.theme.colors.primary;
  }};
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 16px;
`;

export const PostTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin: 0 0 20px 0;
  line-height: 1.4;

  @media (max-width: 1024px) {
    font-size: 26px;
  }
`;

export const PostMeta = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
`;

export const MetaIcon = styled.span`
  font-size: 16px;
`;

export const PostBody = styled.div`
  padding: 48px;
  font-size: 16px;
  line-height: 1.8;
  color: ${({ theme }) => theme.text.primary};

  @media (max-width: 1024px) {
    padding: 32px;
    font-size: 15px;
  }
`;

export const GreetingText = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 24px;
  font-weight: 500;
`;

export const ContentParagraph = styled.p`
  margin-bottom: 32px;
  line-height: 1.8;
  color: ${({ theme }) => theme.text.secondary};
`;

export const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin: 40px 0 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ScheduleList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 32px 0;
`;

export const ScheduleItem = styled.li`
  padding: 14px 20px;
  background: ${({ theme }) => theme.background.secondary};
  border-radius: 8px;
  margin-bottom: 12px;
  display: flex;
  gap: 12px;
  align-items: baseline;
`;

export const ScheduleTitle = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  min-width: 80px;
`;

export const SchedulePeriod = styled.span`
  color: ${({ theme }) => theme.text.secondary};
`;

export const LocationList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 32px 0;
`;

export const LocationItem = styled.li`
  padding: 14px 20px;
  background: ${({ theme }) => theme.background.secondary};
  border-radius: 8px;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const LocationTitle = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;
export const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: ${({ theme }) => `${theme.status.error}10`};
  color: ${({ theme }) => theme.status.error};
  border: 1px solid ${({ theme }) => `${theme.status.error}30`};
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => `${theme.status.error}20`};
    border-color: ${({ theme }) => `${theme.status.error}50`};
  }

  &:active {
    background-color: ${({ theme }) => `${theme.status.error}30`};
  }
`;
export const LocationAddress = styled.span`
  color: ${({ theme }) => theme.text.secondary};
  font-size: 15px;
`;

export const ExamList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 32px 0;
`;

export const ExamItem = styled.li`
  padding: 12px 0 12px 24px;
  position: relative;
  color: ${({ theme }) => theme.text.secondary};

  &:before {
    content: '•';
    position: absolute;
    left: 8px;
    color: ${({ theme }) => theme.colors.primary};
    font-weight: bold;
  }
`;

export const PrecautionSection = styled.div`
  background: ${({ theme }) => `${theme.status.warning}15`};
  border-left: 4px solid ${({ theme }) => theme.status.warning};
  padding: 24px;
  border-radius: 8px;
  margin: 32px 0;
`;

export const PrecautionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
`;

export const PrecautionTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.status.warning};
  margin: 0;
`;

export const PrecautionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const PrecautionItem = styled.li`
  padding: 10px 0 10px 24px;
  position: relative;
  color: ${({ theme }) => theme.text.secondary};

  &:before {
    content: '⚠';
    position: absolute;
    left: 0;
    color: ${({ theme }) => theme.status.warning};
  }
`;

export const ContactSection = styled.div`
  background: ${({ theme }) => `${theme.colors.primary}10`};
  padding: 24px;
  border-radius: 8px;
  margin: 32px 0;
`;

export const ContactTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ContactText = styled.p`
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 16px;
  line-height: 1.6;
`;

export const ContactList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ContactItem = styled.div`
  display: flex;
  gap: 12px;
  align-items: baseline;
`;

export const ContactLabel = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  min-width: 140px;
`;

export const ContactValue = styled.span`
  color: ${({ theme }) => theme.text.secondary};
`;

export const ClosingText = styled.p`
  margin-top: 40px;
  margin-bottom: 12px;
  line-height: 1.8;
  color: ${({ theme }) => theme.text.secondary};
`;

export const SignatureText = styled.p`
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

export const PostFooter = styled.div`
  padding: 24px 48px;
  border-top: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background.secondary};
`;

export const PostStats = styled.div`
  display: flex;
  gap: 16px;
`;

export const StatButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${({ theme }) => theme.background.paper};
  border: 2px solid ${props => props.$active ? '#FF4757' : props.theme.border};
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.$active ? '#FF4757' : props.theme.text.secondary};

  &:hover {
    border-color: ${props => props.$active ? '#FF4757' : props.theme.colors.primary};
    color: ${props => props.$active ? '#FF4757' : props.theme.colors.primary};
  }
`;

export const StatCount = styled.span`
  font-weight: 700;
`;

export const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
`;

export const ListButton = styled.button`
  padding: 14px 32px;
  background: ${({ theme }) => theme.background.paper};
  border: 2px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.secondary};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const EditButton = styled.button`
  padding: 14px 32px;
  background: #FF4757;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(255, 71, 87, 0.3);

  &:hover {
    background: #E63946;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(255, 71, 87, 0.4);
  }
`;