import React, { useState } from 'react';
import * as S from './Chatbot.styles'; // 스타일 파일 로드

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "안녕하세요! 무엇을 도와드릴까요?", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const inputRef = React.useRef(null); // 입력창 포커스용

  // 채팅창 열릴 때 인풋에 포커스
  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { text: input, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput("");

    try {
      // 1. localStorage에서 auth-storage 꺼내기
      const authStorage = localStorage.getItem('auth-storage');
      let token = null;

      if (authStorage) {
        const parsedAuth = JSON.parse(authStorage);
        // Zustand의 persist 구조인 state 안의 token 값을 가져옵니다.
        token = parsedAuth.state?.token;
      }

      // 2. fetch 요청 시 headers에 토큰 추가
      const response = await fetch('http://localhost:8001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Bearer 토큰 형식으로 인증 헤더 추가
          'Authorization': token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify({ message: currentInput }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessages(prev => [...prev, { text: data.reply, isBot: true }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, { text: "죄송합니다. 서버와 연결할 수 없습니다.", isBot: true }]);
    }
  };

  // 오버레이 클릭 시 닫기 (이벤트 버블링 방지)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* 챗봇 토글 버튼 */}
      <S.ChatIcon onClick={() => setIsOpen(!isOpen)} title="AI 챗봇 열기">
        {isOpen ? "✕" : "💬"}
      </S.ChatIcon>

      {/* 중앙 집중형 챗봇 (Notion AI Style) */}
      {isOpen && (
        <S.Overlay onClick={handleOverlayClick}>
          <S.ChatWindow>
            <S.ChatHeader>
              <h2>✨ AI Chat Assistant</h2>
              <button onClick={() => setIsOpen(false)} title="닫기">✕</button>
            </S.ChatHeader>

            <S.MessageArea>
              {messages.map((msg, i) => (
                <S.MessageBubble key={i} $isBot={msg.isBot}>
                  {msg.text}
                </S.MessageBubble>
              ))}
            </S.MessageArea>

            <S.InputArea>
              <div>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="무엇이든 물어보세요..."
                />
              </div>
              <button onClick={handleSend}>전송</button>
            </S.InputArea>
          </S.ChatWindow>
        </S.Overlay>
      )}
    </>
  );
};

export default Chatbot;