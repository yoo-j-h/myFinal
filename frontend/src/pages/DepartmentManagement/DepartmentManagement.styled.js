import styled from "styled-components";

// --- Layout Containers ---
export const MainContainer = styled.main`
  width: 100%;
  max-width: 1600px; /* 대형 모니터 대응, 중앙 정렬 */
  margin: 0 auto;
  padding: 40px;
  background-color: ${({ theme }) => theme.background.secondary || theme.background.main};
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (max-width: 1024px) {
    padding: 24px;
  }
`;

// --- Header Section ---
export const PageHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Breadcrumb = styled.nav`
  font-size: 14px;
  color: ${({ theme }) => theme.text.tertiary};
  display: flex;
  gap: 8px;

  .current {
    color: ${({ theme }) => theme.text.primary};
    font-weight: 600;
  }
`;

export const TitleSection = styled.div`
  h2 {
    font-size: 28px;
    font-weight: 700;
    color: ${({ theme }) => theme.text.primary};
    margin-bottom: 8px;
  }
  
  p {
    font-size: 16px;
    color: ${({ theme }) => theme.text.secondary};
  }
`;

// --- Action Bar ---
export const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  width: 100%;
`;

export const SearchInputWrapper = styled.div`
  position: relative;
  width: 400px; /* 데스크탑에서 넉넉한 너비 */

  .search-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.text.secondary};
    font-size: 18px;
  }

  input {
    width: 100%;
    padding: 14px 16px 14px 48px;
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 50px; /* 둥근 검색창 스타일 */
    font-size: 15px;
    outline: none;
    transition: all 0.2s;
    background-color: ${({ theme }) => theme.background.paper};
    color: ${({ theme }) => theme.text.primary};

    &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}1A`};
    }

    &::placeholder {
      color: ${({ theme }) => theme.text.disabled};
    }
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const CreateButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    filter: brightness(0.9);
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadowHover};
  }
`;

// --- Grid & Cards ---
export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 데스크탑 기본 3열 */
  gap: 24px;
  width: 100%;

  /* 반응형 처리 */
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const DepartmentCard = styled.article`
  background: ${({ theme }) => theme.background.paper};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 16px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  /* 상단 컬러 바 효과 (옵션) */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background-color: ${props => props.$type === 'CABIN' ? props.theme.colors.primary : props.$type === 'MAINTENANCE' ? props.theme.text.secondary : props.theme.colors.secondary};
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadowHover};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;

  .icon-box {
    width: 48px;
    height: 48px;
    background-color: ${({ theme }) => theme.background.secondary};
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    color: ${({ theme }) => theme.text.primary};
  }

  h3 {
    font-size: 20px;
    font-weight: 700;
    color: ${({ theme }) => theme.text.primary};
    margin: 0;
  }
`;

export const CardDescription = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.6;
  min-height: 48px; /* 2줄 정도의 높이 확보 */
  margin: 0;
`;

export const ManagerSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background-color: ${({ theme }) => theme.background.secondary};
  border-radius: 8px;

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.border};
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    color: ${({ theme }) => theme.text.secondary};
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .info {
    display: flex;
    flex-direction: column;
    
    .role {
      font-size: 12px;
      color: ${({ theme }) => theme.text.secondary};
      margin-bottom: 2px;
    }
    
    .name {
      font-size: 14px;
      font-weight: 600;
      color: ${({ theme }) => theme.text.primary};
    }
  }
`;

export const StatsFooter = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.border};
  margin-top: auto; /* 카드가 길어지면 하단 고정 */

  .stat-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: ${({ theme }) => theme.text.secondary};
    font-weight: 500;

    .icon {
      font-size: 16px;
      color: ${({ theme }) => theme.text.tertiary};
    }
  }
`;