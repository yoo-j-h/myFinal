import styled from "styled-components";

export const RoomContainer = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.background.secondary};
`;

export const RoomHeader = styled.div`
  padding: 14px 16px;
  background-color: ${props => props.theme.background.modal};
  border-bottom: 1px solid ${props => props.theme.border};
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  align-items: center;
`;

export const BackBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  background: none;
  cursor: pointer;
  color: ${props => props.theme.text.primary};
  font-size: 1.1rem;

  &:hover {
    background-color: ${props => props.theme.background.hover};
  }
`;

export const RoomTitle = styled.div`
  text-align: center;
  font-size: 1rem;
  font-weight: 700;
  color: ${props => props.theme.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const RoomHeaderRight = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const HeaderIconBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  background: none;
  cursor: pointer;
  color: ${props => props.theme.text.primary};

  &:hover {
    background-color: ${props => props.theme.background.hover};
  }
`;

/* 아래는 메시지/입력 영역 (이전 답변 스타일 그대로 쓰셔도 됩니다) */
export const MessageList = styled.div`
  flex: 1;
  min-height: 0;
  padding: 18px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb {
    background-color: ${props => props.theme.border};
    border-radius: 3px;
  }
`;

export const MessageRow = styled.div`
  display: flex;
  justify-content: ${props => (props.$isMe ? "flex-end" : "flex-start")};
`;

export const Bubble = styled.div`
  max-width: 75%;
  padding: 12px 14px;
  border-radius: 12px;
  line-height: 1.5;

  background-color: ${props =>
    props.$isMe ? props.theme.colors.primary : props.theme.background.modal};
  color: ${props =>
    props.$isMe ? props.theme.text.inverse : props.theme.text.primary};

  border: ${props => (props.$isMe ? "none" : `1px solid ${props.theme.border}`)};
  box-shadow: ${props => (props.$isMe ? `0 2px 4px ${props.theme.shadow}` : "none")};
`;

export const Content = styled.div`
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 0.95rem;
`;

export const Meta = styled.div`
  margin-top: 6px;
  font-size: 0.75rem;
  opacity: 0.75;
  text-align: right;
`;

export const InputBar = styled.div`
  padding: 14px 18px;
  background-color: ${props => props.theme.background.modal};
  border-top: 1px solid ${props => props.theme.border};
  display: flex;
  gap: 10px;
  align-items: flex-end;
`;

export const TextArea = styled.textarea`
  flex: 1;
  resize: none;
  border-radius: 10px;
  border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.background.input};
  color: ${props => props.theme.text.primary};
  padding: 12px 12px;
  font-size: 1rem;
  outline: none;
  min-height: 44px;
  max-height: 120px;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}33;
  }
`;

export const SendButton = styled.button`
  padding: 12px 16px;
  border-radius: 10px;
  border: none;
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.text.inverse};
  font-weight: 700;
  cursor: pointer;

  &:hover { background-color: ${props => props.theme.colors.secondary}; }
  &:disabled {
    background-color: ${props => props.theme.text.disabled};
    cursor: not-allowed;
  }
`;