import styled, { keyframes } from 'styled-components';

// 애니메이션 정의
const fadeIn = keyframes`
  from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
`;

export const ChatIcon = styled.button`
  position: fixed;
  bottom: 30px;
  right: 100px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  
  /* 1. DB 색상 연동: 항공사별 브랜드 컬러 적용 */
  background-color: yellow;
  
  /* 2. 디자인 디테일: 텍스트/아이콘 색상은 항상 흰색 고정 */
  color: #FFFFFF;
  
  border: none;
  
  /* 3. 그림자 효과: 테마의 shadow 변수 사용 */
  box-shadow: 0 4px 12px ${props => props.theme.shadow};
  
  cursor: pointer;
  
  /* 3. 위치 및 계층: 최상위 z-index */
  z-index: 9999;
  
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1); /* 크기 확대 효과 */
    opacity: 0.9; /* 약간 투명하게 하여 눌리는 느낌 */
  }
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${props => props.theme.overlay || 'rgba(0, 0, 0, 0.5)'};
  backdrop-filter: blur(4px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ChatWindow = styled.div`
  position: fixed; // Overlay 내부에서 중앙 정렬을 위해 fixed/absolute 사용 가능, 여기선 fixed로 명시
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 640px;
  max-width: 90%;
  height: 700px;
  max-height: 80vh;
  background-color: ${props => props.theme.background.modal};
  border-radius: 16px;
  box-shadow: 0 20px 60px ${props => props.theme.shadow};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ${fadeIn} 0.2s ease-out forwards;
  border: 1px solid ${props => props.theme.border};
`;

export const ChatHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid ${props => props.theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.theme.background.modal};

  h2 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: ${props => props.theme.text.primary};
    display: flex;
    align-items: center;
    gap: 10px;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    color: ${props => props.theme.text.tertiary};
    padding: 4px;
    border-radius: 4px;
    &:hover {
      background-color: ${props => props.theme.background.hover};
      color: ${props => props.theme.text.primary};
    }
  }
`;

export const MessageArea = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: ${props => props.theme.background.secondary};

  /* 스크롤바 커스터마이징 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${props => props.theme.border};
    border-radius: 3px;
  }
`;

export const MessageBubble = styled.div`
  max-width: 85%;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 0.95rem;
  line-height: 1.6;
  position: relative;
  
  // 봇 메시지 스타일
  ${props => props.$isBot && `
    align-self: flex-start;
    background-color: ${props.theme.background.modal}; // 카드 스타일 배경
    border: 1px solid ${props.theme.border};
    color: ${props.theme.text.primary};
    border-top-left-radius: 4px;
  `}

  // 사용자 메시지 스타일 (Notion 스타일: 투명 배경에 텍스트만 혹은 은은한 배경)
  ${props => !props.$isBot && `
    align-self: flex-end;
    background-color: ${props.theme.colors.primary};
    color: ${props.theme.text.inverse};
    border-bottom-right-radius: 4px;
    box-shadow: 0 2px 4px ${props.theme.shadow};
  `}
`;

export const InputArea = styled.div`
  padding: 20px 24px;
  background-color: ${props => props.theme.background.modal};
  border-top: 1px solid ${props => props.theme.border};
  display: flex;
  gap: 12px;
  align-items: center;

  // 입력창을 감싸는 래퍼
  div {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
  }

  input {
    width: 100%;
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid ${props => props.theme.border};
    background-color: ${props => props.theme.background.input};
    color: ${props => props.theme.text.primary};
    font-size: 1rem;
    outline: none;
    transition: all 0.2s;

    &::placeholder {
      color: ${props => props.theme.text.disabled};
    }

    &:focus {
      border-color: ${props => props.theme.colors.primary};
      box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}33; // 20% 투명도
    }
  }

  button {
    padding: 12px 20px;
    border-radius: 8px;
    border: none;
    background-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.text.inverse};
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
    white-space: nowrap;

    &:hover {
      background-color: ${props => props.theme.colors.secondary};
    }

    &:disabled {
      background-color: ${props => props.theme.text.disabled};
      cursor: not-allowed;
    }
  }
`;

// ====== 친구목록/프로필 레이아웃 추가 ======

export const ContentArea = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 320px 1fr;
  min-height: 0; /* overflow 영역에서 필수 */
  background-color: ${props => props.theme.background.secondary};

  @media (max-width: 720px) {
    grid-template-columns: 1fr; /* 좁아지면 단일 컬럼 */
  }
`;

export const UserList = styled.div`
  border-right: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.background.modal};
  overflow-y: auto;
  min-height: 0;

  /* 스크롤바 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${props => props.theme.border};
    border-radius: 3px;
  }

  @media (max-width: 720px) {
    border-right: none;
    border-bottom: 1px solid ${props => props.theme.border};
  }
`;

export const UserRow = styled.div`
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  align-items: center;
  transition: background-color 0.15s ease-in-out;

  background-color: ${props =>
    props.$active ? props.theme.background.hover : "transparent"};

  &:hover {
    background-color: ${props => props.theme.background.hover};
  }
`;

export const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  flex: 0 0 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${props => props.theme.background.secondary};
  border: 1px solid ${props => props.theme.border};
  color: ${props => props.theme.text.tertiary};
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

export const UserInfo = styled.div`
  flex: 1;
  min-width: 0; /* 말줄임 필수 */
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const UserName = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${props => props.theme.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const UserMeta = styled.div`
  font-size: 0.82rem;
  color: ${props => props.theme.text.tertiary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ProfilePanel = styled.div`
  background-color: ${props => props.theme.background.secondary};
  display: flex;
  flex-direction: column;
  padding: 18px 18px;
  overflow: hidden;
  min-height: 0;

  @media (max-width: 720px) {
    padding: 16px;
  }
`;

export const ProfileHeader = styled.div`
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 14px 14px;
  background-color: ${props => props.theme.background.modal};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
`;

export const ProfileAvatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  flex: 0 0 56px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${props => props.theme.background.secondary};
  border: 1px solid ${props => props.theme.border};
  color: ${props => props.theme.text.tertiary};
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

export const ProfileName = styled.div`
  font-size: 1.05rem;
  font-weight: 700;
  color: ${props => props.theme.text.primary};
`;

export const ProfileSub = styled.div`
  margin-top: 4px;
  font-size: 0.9rem;
  color: ${props => props.theme.text.tertiary};
`;

export const ProfileBody = styled.div`
  margin-top: 12px;
  padding: 14px 14px;
  background-color: ${props => props.theme.background.modal};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ProfileLine = styled.div`
  font-size: 0.92rem;
  color: ${props => props.theme.text.primary};

  span {
    color: ${props => props.theme.text.tertiary};
    margin-right: 8px;
  }
`;

export const ProfileActions = styled.div`
  margin-top: auto;
  padding-top: 14px;
  display: flex;
  gap: 10px;

  button {
    width: 100%;
    padding: 12px 16px;
    border-radius: 10px;
    border: none;
    background-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.text.inverse};
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: ${props => props.theme.colors.secondary};
    }
  }
`;

export const EmptyState = styled.div`
  flex: 1;
  border: 1px dashed ${props => props.theme.border};
  border-radius: 12px;
  padding: 18px;
  color: ${props => props.theme.text.tertiary};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.background.modal};
`;

export const TabBar = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid ${(p) => p.theme.border};
  background-color: ${(p) => p.theme.background.modal};
`;

export const TabButton = styled.button`
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid ${(p) => p.theme.border};
  background: ${(p) => (p.$active ? p.theme.colors.primary : p.theme.background.input)};
  color: ${(p) => (p.$active ? p.theme.text.inverse : p.theme.text.primary)};
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;

  &:hover {
    opacity: 0.9;
  }
`;

export const RightMeta = styled.div`
  margin-left: auto;
  font-size: 0.8rem;
  color: ${(p) => p.theme.text.tertiary};
`;