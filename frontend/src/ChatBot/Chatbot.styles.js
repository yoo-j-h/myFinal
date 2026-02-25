import styled, { keyframes } from 'styled-components';

// 애니메이션 정의
const fadeIn = keyframes`
  from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
`;

export const ChatIcon = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  
  /* 1. DB 색상 연동: 항공사별 브랜드 컬러 적용 */
  background-color: ${props => props.theme.colors.primary};
  
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
