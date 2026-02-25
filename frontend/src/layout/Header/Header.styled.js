import styled from 'styled-components';


export const LogoutButton = styled.button`
  margin-left: 16px;
  padding: 8px 14px;

  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.secondary};

  background: transparent;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;

  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.danger};
    border-color: ${({ theme }) => theme.colors.danger};
    background-color: ${({ theme }) => theme.background.hover};
  }

  &:active {
    transform: scale(0.97);
  }
`;

export const HeaderContainer = styled.header`
  background: var(--bg-main);
  padding: 16px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px var(--shadow-color);
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  box-sizing: border-box;
  border-bottom: 1px solid var(--border-color);
`;

export const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
`;

export const BreadcrumbItem = styled.span`
  color: ${props => props.$active ? 'var(--text-main)' : 'var(--text-sub)'};
  font-weight: ${props => props.$active ? '600' : '400'};
`;

export const BreadcrumbSeparator = styled.span`
  color: ${({ theme }) => theme.border};
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

export const SearchIconButton = styled.button`
  background: none;
  border: none;
  color: var(--text-sub);
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;

  &:hover {
    color: var(--primary-color);
    background-color: var(--bg-hover);
  }
`;

export const NotificationBadge = styled.div`
  position: relative;
  cursor: pointer;
`;

export const NotificationIcon = styled.div`
  font-size: 24px;
`;

export const Badge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.text.inverse};
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
`;

export const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
`;

export const UserAvatar = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 16px;
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const UserName = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
`;

export const UserRole = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
`;