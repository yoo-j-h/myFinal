import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAirlineTheme } from '../../context/AirlineThemeContext';
import * as S from './Sidebar.styled';
import { USER_MENU, ADMIN_MENU, SUPER_ADMIN_MENU } from '../../constants/menu';
import { Plane, Sun, Moon } from 'lucide-react'; // Import minimal icons needed for Sidebar layout itself

const Sidebar = ({ userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const { theme, isDarkMode, toggleDarkMode, approvalStatus } = useAirlineTheme();

  // 권한에 따라 보여줄 메뉴 리스트 결정
  let currentMenuItems;
  let roleLabel;

  if (userRole === 'SUPER_ADMIN') {
    currentMenuItems = SUPER_ADMIN_MENU;
    roleLabel = '슈퍼 관리자';
  } else if (userRole === 'AIRLINE_ADMIN') {
    currentMenuItems = ADMIN_MENU;
    roleLabel = '관리자';
  } else {
    currentMenuItems = USER_MENU;
    roleLabel = '직원';
  }

  // 현재 경로가 속한 서브메뉴 자동 열기
  useEffect(() => {
    currentMenuItems.forEach(section => {
      section.items.forEach(item => {
        if (item.subItems) {
          const isSubActive = item.subItems.some(sub => sub.id === location.pathname);
          if (isSubActive) {
            setOpenSubMenu(item.id);
          }
        }
      });
    });
  }, [location.pathname, currentMenuItems]);

  const toggleSubMenu = (id) => {
    setOpenSubMenu(openSubMenu === id ? null : id);
  };

  return (
    <S.Container>
      {/* 1. 헤더 */}
      <S.Header>
        <S.LogoWrapper>
          <S.LogoIcon>
            {/* styled-components 내부에서 transform 적용됨 */}
            <Plane size={22} strokeWidth={2.5} />
          </S.LogoIcon>
          <S.Title>{theme.airline.name}</S.Title>
        </S.LogoWrapper>
        <S.SubTitle>Airline HR System ({roleLabel})</S.SubTitle>

        {/* 브랜딩 정보 표시 (승인 상태) */}
        <S.BrandingInfo>
          <S.AirlineName>{theme.airline.name}</S.AirlineName>
          <S.ApprovalStatus $status={approvalStatus}>
            {approvalStatus === 'approved' ? '● 승인 완료' : '○ 승인 대기'}
          </S.ApprovalStatus>
        </S.BrandingInfo>
      </S.Header>

      {/* 2. 네비게이션 메뉴 */}
      <S.Nav>
        {currentMenuItems.map((section, index) => (
          <S.CategorySection key={index}>
            <S.CategoryTitle>{section.category}</S.CategoryTitle>

            {section.items.map((item) => {
              const IconComponent = item.icon;

              // 활성화 로직
              const isSelfActive = location.pathname === item.id;
              const isSubActive = item.subItems && item.subItems.some(sub => sub.id === location.pathname);
              const isActive = isSelfActive || isSubActive;

              return (
                <div key={item.id}>
                  <S.MenuButton
                    onClick={() => {
                      if (item.subItems) {
                        toggleSubMenu(item.id);
                      } else {
                        navigate(item.id);
                      }
                    }}
                    $isActive={isActive}
                  >
                    {IconComponent && <IconComponent size={20} />}
                    <span>{item.label}</span>
                  </S.MenuButton>

                  {/* 하위 메뉴 렌더링 */}
                  {item.subItems && openSubMenu === item.id && (
                    <S.SubMenuContainer>
                      {item.subItems.map((sub) => (
                        <S.SubMenuButton
                          key={sub.id}
                          onClick={() => navigate(sub.id)}
                          $isActive={location.pathname === sub.id}
                        >
                          <span>{sub.label}</span>
                        </S.SubMenuButton>
                      ))}
                    </S.SubMenuContainer>
                  )}
                </div>
              );
            })}
          </S.CategorySection>
        ))}
      </S.Nav>

      {/* 3. 푸터 (다크모드 토글) */}
      <S.Footer>
        <S.ThemeToggleButton onClick={toggleDarkMode}>
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          {isDarkMode ? '라이트 모드' : '다크 모드'}
        </S.ThemeToggleButton>
      </S.Footer>
    </S.Container>
  );
};

export default Sidebar;