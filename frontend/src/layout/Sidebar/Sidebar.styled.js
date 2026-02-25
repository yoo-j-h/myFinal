import styled from 'styled-components';

export const Container = styled.aside`
  width: 280px;
  background-color: var(--bg-main);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  padding: 24px;
  flex-shrink: 0;
  transition: all 0.3s ease;
  height: 100vh;
  position: sticky;
  top: 0;
  overflow-x: hidden;
`;

export const Header = styled.div`
  margin-bottom: 40px;
  padding: 0 12px;
`;

export const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

// 로고 배경: 테마의 primary 컬러 사용
export const LogoIcon = styled.div`
  width: 36px;
  height: 36px;
  background-color: var(--primary-color); 
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white; /* 아이콘은 항상 흰색 */
  box-shadow: 0 4px 10px var(--shadow-color);
  transition: background-color 0.5s ease;
  
  /* 회전 애니메이션 제거 후 CSS로 처리하려면 여기서 transform 추가 가능 */
  svg {
    transform: rotate(-45deg);
    margin-left: 2px;
  }
`;

export const Title = styled.h1`
  font-size: 22px;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.5px;
  transition: color 0.3s ease;
`;

export const SubTitle = styled.div`
  font-size: 13px;
  color: var(--text-tertiary);
  font-weight: 500;
  margin-left: 4px;
  transition: color 0.3s ease;
`;

export const BrandingInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 12px;
  padding: 12px;
  background-color: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
`;

export const AirlineName = styled.span`
  font-weight: 700;
  color: var(--primary-color);
  font-size: 14px;
`;

export const ApprovalStatus = styled.span`
  font-size: 11px;
  color: ${props => props.$status === 'approved' ? 'var(--primary-color)' : 'var(--text-disabled)'};
  margin-top: 4px;
  font-weight: 500;
`;

export const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
  flex: 1;
  padding: 0 4px; /* 스크롤바 여백 */
  
  /* 스크롤바 커스텀 */
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--border-color);
    border-radius: 4px;
  }
`;

export const CategorySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const CategoryTitle = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: var(--text-disabled);
  margin-bottom: 8px;
  padding-left: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

// 메뉴 버튼: 활성화되거나 마우스 올렸을 때 테마 색상 적용
export const MenuButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 15px;
  font-weight: 500;
  text-align: left;
  
  /* 활성화 상태($isActive)일 때 테마 색상 적용 */
  background-color: ${props => props.$isActive ? 'var(--bg-hover)' : 'transparent'};
  color: ${props => props.$isActive ? 'var(--primary-color)' : 'var(--text-secondary)'};

  /* 마우스 호버 시 테마 색상 적용 */
  &:hover {
    background-color: var(--bg-hover);
    color: var(--primary-color);
    transform: translateX(4px);
  }

  /* 아이콘 색상 제어 */
  svg {
    color: ${props => props.$isActive ? 'var(--primary-color)' : 'var(--text-tertiary)'};
    transition: color 0.2s;
  }

  &:hover svg {
    color: var(--primary-color);
  }

  span {
    flex: 1;
  }
`;

export const SubMenuContainer = styled.div`
  margin-left: 12px;
  margin-top: 4px;
  padding-left: 12px;
  border-left: 2px solid var(--border-color);
`;

export const SubMenuButton = styled(MenuButton)`
  font-size: 14px;
  padding: 10px 12px;
`;

export const Footer = styled.div`
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ThemeToggleButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--bg-hover);
    color: var(--text-primary);
  }
`;