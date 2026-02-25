import styled from 'styled-components';
import {
  User, Lock, ArrowRight, CheckCircle,
  HelpCircle, Info, Plane, Zap
} from 'lucide-react';

/* ---------- Layout ---------- */
export const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.background.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

export const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1000px;
  min-height: 600px;
  display: flex;
  background: ${({ theme }) => theme.background.main};
  border-radius: 24px;
  box-shadow: 0 20px 40px ${({ theme }) => theme.shadow};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

/* ---------- Left : Brand ---------- */
export const BrandSection = styled.div`
  flex: 1;
  background: ${({ theme }) => theme.background.tertiary};
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: 1px solid ${({ theme }) => theme.border};

  @media (max-width: 768px) {
    border-right: none;
    border-bottom: 1px solid ${({ theme }) => theme.border};
    padding: 40px 30px;
  }
`;

export const BrandHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const LogoIcon = styled(Plane)`
  width: 32px;
  height: 32px;
  transform: rotate(-45deg);
  color: ${({ theme }) => theme.text.primary};
`;

export const BrandName = styled.h1`
  font-size: 24px;
  font-weight: 900;
  margin: 0;
  color: ${({ theme }) => theme.text.primary};
`;

export const ServiceInfo = styled.div`
  margin-top: 40px;
`;

export const ServiceTitle = styled.h2`
  font-size: 32px;
  font-weight: 900;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${({ theme }) => theme.text.primary};
`;

export const ServiceIcon = styled(Zap)`
  width: 28px;
  height: 28px;
  color: ${({ theme }) => theme.text.primary};
`;

export const ServiceSubtitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 18px;
  color: ${({ theme }) => theme.text.secondary};
`;

export const ServiceDescription = styled.p`
  font-size: 15px;
  line-height: 1.7;
  color: ${({ theme }) => theme.text.secondary};
  max-width: 92%;
`;

export const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
`;

export const FeatureCheckIcon = styled(CheckCircle)`
  width: 16px;
  height: 16px;
  color: ${({ theme }) => theme.text.tertiary};
`;

export const FeatureText = styled.span``;

/* ---------- Right : Login ---------- */
export const LoginSection = styled.div`
  flex: 1.2;
  background: ${({ theme }) => theme.background.main};
  padding: 60px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  isolation: isolate;

  @media (max-width: 768px) {
    padding: 40px 24px;
  }
`;

export const LoginCard = styled.div`
  width: 100%;
  max-width: 400px;
`;

export const LoginHeader = styled.div`
  margin-bottom: 36px;
`;

export const LoginTitle = styled.h2`
  font-size: 28px;
  font-weight: 900;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text.primary};
`;

export const LoginSubtitle = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.text.secondary};
`;

export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const InputLabel = styled.label`
  font-size: 14px;
  font-weight: 800;
  color: ${({ theme }) => theme.text.primary};
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const UserIcon = styled(User)`
  width: 16px;
  height: 16px;
  color: ${({ theme }) => theme.text.tertiary};
`;

export const LockIcon = styled(Lock)`
  width: 16px;
  height: 16px;
  color: ${({ theme }) => theme.text.tertiary};
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  font-size: 15px;
  background: ${({ theme }) => theme.background.input};
  color: ${({ theme }) => theme.text.primary};

  &:focus {
    background: ${({ theme }) => theme.background.main};
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.shadow};
    outline: none;
  }

  &::placeholder {
    color: ${({ theme }) => theme.text.tertiary};
  }
`;

export const RememberMeRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: ${({ theme }) => theme.colors.primary};
`;

export const CheckboxLabel = styled.label`
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 14px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.text.inverse};
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 900;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
    box-shadow: 0 4px 12px ${({ theme }) => theme.shadow};
    transform: translateY(-1px);
  }
`;

export const ArrowIcon = styled(ArrowRight)`
  width: 18px;
  height: 18px;
`;

export const FooterLinks = styled.div`
  margin-top: 32px;
  display: flex;
  justify-content: center;
  gap: 12px;
  font-size: 13px;
  color: ${({ theme }) => theme.text.tertiary};
`;

export const FooterLink = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-size: inherit;
  color: inherit;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.text.primary};
    text-decoration: underline;
  }
`;

export const FooterDivider = styled.div`
  width: 1px;
  height: 12px;
  background: ${({ theme }) => theme.border};
`;

export const HelpIcon = styled(HelpCircle)`
  width: 14px;
  height: 14px;
`;

export const InfoIcon = styled(Info)`
  width: 14px;
  height: 14px;
`;
