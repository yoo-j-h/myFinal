import styled from 'styled-components';

export const NotificationContainer = styled.div`
  position: relative;
  margin-right: 16px;
`;

export const NotificationButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px; /* UserAvatar와 동일한 크기 */
  height: 42px;
  padding: 0; /* 패딩 제거하여 아이콘 크기 확보 */
  flex-shrink: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 50%; /* 원형 버튼 */
  
  /* 테마 변수 대신 CSS 변수 사용 (AirlineThemeContext에서 확실히 설정됨) */
  color: var(--text-secondary, #4A5568);
  transition: all 0.2s ease;
  z-index: 10;

  &:hover {
    color: var(--text-primary, #1A202C);
    background-color: var(--bg-hover, #E2E8F0);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const Badge = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  background-color: ${({ theme }) => theme.colors.danger || '#ff4444'};
  color: ${({ theme }) => theme.text.inverse};
  border-radius: 9px;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
`;

export const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 400px;
  max-height: 600px;
  background: ${({ theme }) => theme.background.main};
  border-radius: 8px;
  box-shadow: 0 4px 12px ${({ theme }) => theme.shadow};
  z-index: 1000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const DropdownHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const DropdownTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
`;

export const UnreadCount = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
`;

