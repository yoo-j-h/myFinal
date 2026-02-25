import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    /* [Core] 항공사 브랜드 컬러 (동적) */
    --primary-color: ${props => props.theme.colors.primary};
    --secondary-color: ${props => props.theme.colors.secondary};
    --accent-color: ${props => props.theme.colors.accent};
    --danger-color: ${props => props.theme.colors.danger};

    /* [Background] 배경 색상 */
    --bg-main: ${props => props.theme.background.main};
    --bg-secondary: ${props => props.theme.background.secondary};
    --bg-tertiary: ${props => props.theme.background.tertiary};
    --bg-hover: ${props => props.theme.background.hover};
    --bg-modal: ${props => props.theme.background.modal};
    --bg-input: ${props => props.theme.background.input};

    /* [Text] 텍스트 색상 */
    --text-primary: ${props => props.theme.text.primary};
    --text-secondary: ${props => props.theme.text.secondary};
    --text-tertiary: ${props => props.theme.text.tertiary};
    --text-disabled: ${props => props.theme.text.disabled};
    --text-inverse: ${props => props.theme.text.inverse};

    /* [Common] 공통 UI 요소 */
    --border-color: ${props => props.theme.border};
    --shadow-color: ${props => props.theme.shadow};
    --overlay-color: ${props => props.theme.overlay};
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    
    /* 모든 요소에 부드러운 테마 전환 적용 */
    transition: background-color 0.3s ease, 
                color 0.3s ease, 
                border-color 0.3s ease,
                box-shadow 0.3s ease;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    
    /* 테마 배경 및 텍스트 적용 */
    background-color: var(--bg-main);
    color: var(--text-primary);
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  /* 링크 스타일 */
  a {
    color: var(--primary-color);
    text-decoration: none;

    &:hover {
      color: var(--secondary-color);
    }
  }

  /* 버튼 기본 스타일 */
  button {
    font-family: inherit;
    cursor: pointer;
  }

  /* 입력 폼 스타일 */
  input, textarea, select {
    font-family: inherit;
    background-color: var(--bg-input);
    color: var(--text-primary);
    border: 1px solid var(--border-color);

    &:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px var(--shadow-color);
    }

    &::placeholder {
      color: var(--text-disabled);
    }
  }

  /* 스크롤바 커스터마이징 */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: var(--bg-secondary);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 5px;
    
    &:hover {
      background: var(--text-tertiary);
    }
  }

  /* 선택 영역 스타일 */
  ::selection {
    background-color: var(--primary-color);
    color: white;
  }
`;


export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 48px;
`;

export const PaginationButton = styled.button`
  width: 40px;
  height: 40px;
  border: 1px solid #E5E8EB;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  color: #666;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    border-color: ${props => props.theme.primary};
    color: ${props => props.theme.primary};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const PageNumber = styled.button`
  width: 40px;
  height: 40px;
  border: 1px solid ${props => props.active ? props.theme.primary : '#E5E8EB'};
  background: ${props => props.active ? props.theme.primary : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: ${props => props.active ? '600' : '500'};
  transition: all 0.2s;

  &:hover {
    border-color: ${props => props.theme.primary};
    color: ${props => props.active ? 'white' : props.theme.primary};
  }
`;

export default GlobalStyle;
