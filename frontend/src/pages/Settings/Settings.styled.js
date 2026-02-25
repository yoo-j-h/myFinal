import styled from 'styled-components';

export const MainContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: ${({ theme }) => theme.background.main};
  padding: 40px 60px;

  @media (max-width: 1024px) {
    padding: 24px 20px;
  }
`;

export const ContentWrapper = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  background: ${({ theme }) => theme.background.paper};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadow || '0 2px 12px rgba(0, 0, 0, 0.08)'};
  overflow: hidden;
`;

export const TabContainer = styled.div`
  display: flex;
  border-bottom: 2px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background.secondary};
`;

export const Tab = styled.button`
  flex: 1;
  padding: 20px 32px;
  font-size: 16px;
  font-weight: ${(props) => (props.$active ? '600' : '400')};
  color: ${(props) => (props.$active ? props.theme.colors.primary : props.theme.text.secondary)};
  background: ${(props) => (props.$active ? props.theme.background.paper : 'transparent')};
  border: none;
  border-bottom: ${(props) =>
    props.$active ? `3px solid ${props.theme.colors.primary}` : '3px solid transparent'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.$active ? props.theme.background.paper : props.theme.background.hover)};
    color: ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: 768px) {
    padding: 16px 20px;
    font-size: 14px;
  }
`;

export const TabContent = styled.div`
  padding: 40px 60px;
  @media (max-width: 1024px) {
    padding: 32px 24px;
  }
`;

// ===== Profile Section =====
export const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const ProfileHeader = styled.div`
  h2 {
    font-size: 24px;
    font-weight: 700;
    color: ${({ theme }) => theme.text.primary};
    margin: 0;
  }
`;

export const ProfileAvatar = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

export const InputRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  width: 100%;
`;

export const SmallButton = styled.button`
  flex-shrink: 0;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.inverse};
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  /* 입력창 높이(12px 상하 패딩 + 폰트)와 비슷하게 맞춤 */
  height: 44px;

  &:hover {
    filter: brightness(1.08);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    height: 42px;
    padding: 10px 12px;
    font-size: 12px;
  }
`;

export const AvatarCircle = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${({ theme }) => `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => `0 4px 16px ${theme.colors.primary}50`};
`;

export const AvatarInitial = styled.div`
  font-size: 48px;
  font-weight: 700;
  color: #ffffff;
`;

export const CameraIcon = styled.div`
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 36px;
  height: 36px;
  background: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px 40px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

export const InfoRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  grid-column: ${(props) => (props.$fullWidth ? '1 / -1' : 'auto')};
`;

export const InfoLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.secondary};
`;

export const InfoValue = styled.div`
  width: 100%;
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  font-size: 15px;
  color: ${({ theme }) => theme.text.primary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  transition: all 0.2s ease;

  /* ✅ 기본: 입력 가능 */
  background: ${({ theme }) => theme.background.input};
  cursor: text;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.background.paper};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}20`};
  }

  &::placeholder {
    color: ${({ theme }) => theme.text.tertiary};
  }

  /* ✅ 입력 불가(읽기 전용): 배경색/커서/선택만 막기 */
  &[readonly] {
    background: ${({ theme }) => theme.background.secondary};
    color: ${({ theme }) => theme.text.disabled};
    cursor: default;
    user-select: none;
  }

  /* ✅ 완전 비활성(disabled): 더 진하게 + 커서 */
  &:disabled {
    background: ${({ theme }) => theme.background.disabled || '#e5e7eb'};
    color: ${({ theme }) => theme.text.disabled};
    cursor: not-allowed;
  }

  /* ✅ readOnly/disabled는 포커스 스타일이 불필요하니 제거(선택) */
  &[readonly]:focus,
  &:disabled:focus {
    box-shadow: none;
    border-color: ${({ theme }) => theme.border};
    background: inherit;
  }
`;

export const AddressTextarea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  font-size: 15px;
  font-family: inherit;
  color: ${({ theme }) => theme.text.primary};
  background: ${({ theme }) => theme.background.input};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  resize: vertical;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.background.paper};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}20`};
  }

  &::placeholder {
    color: ${({ theme }) => theme.text.tertiary};
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.border};

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const CancelButton = styled.button`
  padding: 12px 32px;
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.secondary};
  background: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.background.hover};
    border-color: ${({ theme }) => theme.text.tertiary};
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const SaveButton = styled.button`
  padding: 12px 32px;
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.inverse};
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${({ theme }) => theme.shadow || '0 2px 8px rgba(0,0,0,0.1)'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadowHover || '0 4px 12px rgba(0,0,0,0.15)'};
    filter: brightness(1.1);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

// ===== Security Section =====
export const SecuritySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const SecurityCard = styled.div`
  background: ${({ theme }) => theme.background.paper};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadowHover || '0 2px 8px rgba(0, 0, 0, 0.06)'};
  }
`;

export const SecurityCardHeader = styled.div`
  padding: 20px 24px;
  background: ${({ theme }) => theme.background.secondary};
  border-bottom: 1px solid ${({ theme }) => theme.border};

  h3 {
    font-size: 18px;
    font-weight: 700;
    color: ${({ theme }) => theme.text.primary};
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

export const SecurityCardBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const SecurityItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 16px;
  }
`;

export const SecurityItemLeft = styled.div`
  flex: 1;
  min-width: 0;
`;

export const SecurityItemRight = styled.div`
  flex-shrink: 0;
  min-width: 300px;

  @media (max-width: 1024px) {
    width: 100%;
    min-width: unset;
  }
`;

export const SecurityItemTitle = styled.h4`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin: 0 0 6px 0;
`;

export const SecurityItemDescription = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
  margin: 0;
  line-height: 1.6;
`;

export const PasswordInputGroup = styled.div`
  width: 100%;
`;

export const PasswordInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  font-size: 15px;
  color: ${({ theme }) => theme.text.primary};
  background: ${({ theme }) => theme.background.input};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.background.paper};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}20`};
  }

  &::placeholder {
    color: ${({ theme }) => theme.text.tertiary};
  }
`;

export const ChangePasswordButton = styled.button`
  padding: 12px 32px;
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.inverse};
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${({ theme }) => theme.shadow || '0 2px 8px rgba(0,0,0,0.1)'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadowHover || '0 4px 12px rgba(0,0,0,0.15)'};
    filter: brightness(1.1);
  }
`;

export const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 56px;
  height: 28px;
  cursor: pointer;
`;

export const ToggleSlider = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${(props) => (props.checked ? props.theme.colors.primary : props.theme.border)};
  border-radius: 28px;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    height: 22px;
    width: 22px;
    left: ${(props) => (props.checked ? '30px' : '3px')};
    bottom: 3px;
    background: #ffffff;
    border-radius: 50%;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

export const ThemeSelector = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const ThemeOption = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

export const ThemeRadio = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.primary};
`;

export const ThemeLabel = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 500;
`;

export const LanguageSelect = styled.select`
  width: 100%;
  padding: 12px 16px;
  font-size: 15px;
  color: ${({ theme }) => theme.text.primary};
  background: ${({ theme }) => theme.background.input};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.background.paper};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}20`};
  }
`;

export const NotificationPreferences = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const NotificationItem = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  padding: 16px;
  background: ${({ theme }) => theme.background.input};
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.background.hover};
  }
`;

export const NotificationCheckbox = styled.input`
  width: 20px;
  height: 20px;
  margin-top: 2px;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.primary};
`;

export const DangerZone = styled.div`
  background: ${({ theme }) => theme.status.error}0d; /* 0d is ~5% opacity */
  border: 2px solid ${({ theme }) => theme.status.error}33; /* 33 is ~20% opacity */
  border-radius: 12px;
  overflow: hidden;

  ${SecurityCardHeader} {
    background: ${({ theme }) => theme.status.error}1a; /* 1a is ~10% opacity */
    border-bottom-color: ${({ theme }) => theme.status.error}33;

    h3 {
      color: ${({ theme }) => theme.status.error};
    }
  }
`;

export const DangerButton = styled.button`
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  background: ${({ theme }) => theme.status.error};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.status.error}e6; /* e6 is 90% opacity */
    transform: translateY(-1px);
    box-shadow: 0 2px 8px ${({ theme }) => theme.status.error}4d;
  }
`;
