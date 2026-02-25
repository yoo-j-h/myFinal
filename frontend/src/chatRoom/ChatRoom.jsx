import React, { useEffect, useRef, useState } from "react";
import * as S from "./ChatRoom.styled";
import healthService from "../api/Health/healthService";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const ChatRoom = ({
  roomTitle = "채팅",
  roomId = null,
  roomKey = null,
  onBack,
  myEmpId,
}) => {
  const [activeRoomId, setActiveRoomId] = useState(roomId);

  const [loadingRoom, setLoadingRoom] = useState(false);
  const [roomError, setRoomError] = useState(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const listRef = useRef(null);
  const inputRef = useRef(null);

  // ✅ STOMP client ref
  const stompRef = useRef(null);

  // 1) 진입 시: roomKey로 방 조회/생성 + 최근 메시지 로딩
  useEffect(() => {
    if (!roomKey) return;

    const init = async () => {
      try {
        setLoadingRoom(true);
        setRoomError(null);

        // 방 보장
        const roomRes = await healthService.chatRoom(roomKey);
        setActiveRoomId(roomRes.data.chatRoomId);

        // 최근 메시지 로딩(50개)
        const recentRes = await healthService.getRecentMessages(roomKey);
        setMessages(recentRes.data ?? []);
      } catch (e) {
        console.error(e);
        setRoomError("채팅방 정보를 불러오지 못했습니다.");
      } finally {
        setLoadingRoom(false);
      }
    };

    init();
  }, [roomKey]);

  // 2) roomKey가 준비되면: WS 연결 + 구독
  useEffect(() => {
    if (!roomKey) return;

    // 이미 연결되어 있으면 중복 연결 방지
    if (stompRef.current?.active) return;

    const token = (() => {
      const authStorage = localStorage.getItem("auth-storage");
      if (!authStorage) return null;
      try {
        const parsed = JSON.parse(authStorage);
        return parsed.state?.token ?? null;
      } catch {
        return null;
      }
    })();

    const client = new Client({
      // ✅ SockJS 사용
      webSocketFactory: () => new SockJS("http://localhost:8001/ws"),
      reconnectDelay: 3000,

      // ✅ STOMP CONNECT 헤더에 JWT 전달 (서버 interceptor에서 읽음)
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},

      onConnect: () => {
        // ✅ 방 구독
        client.subscribe(`/topic/rooms/${roomKey}`, (frame) => {
          try {
            const payload = JSON.parse(frame.body);
            // payload: MessageResponse (message_id, sender_emp_id, content, create_date, ...)
            setMessages((prev) => [...prev, payload]);
          } catch (err) {
            console.error("WS parse error", err);
          }
        });
      },

      onStompError: (frame) => {
        console.error("Broker error", frame);
      },
      onWebSocketError: (e) => {
        console.error("WS error", e);
      },
    });

    stompRef.current = client;
    client.activate();

    return () => {
      // ✅ 언마운트/뒤로가기 시 연결 정리
      try {
        client.deactivate();
      } catch {}
      stompRef.current = null;
    };
  }, [roomKey]);

  // 스크롤 하단 고정
  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight);
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 3) 전송: publish만 하고, 화면 갱신은 "구독 수신"으로만 처리 (중복 방지)
  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    if (!roomKey) return;

    const client = stompRef.current;
    if (!client || !client.connected) {
      alert("채팅 서버와 연결되지 않았습니다.");
      return;
    }

    client.publish({
      destination: "/app/chat.send",
      body: JSON.stringify({
        room_key: roomKey,
        content: text,
      }),
    });

    setInput("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <S.RoomContainer>
      <S.RoomHeader>
        <S.BackBtn
          type="button"
          onClick={() => {
            // 뒤로가기 시 연결은 cleanup에서 deactivate 됨
            onBack();
          }}
          title="뒤로가기"
        >
          ←
        </S.BackBtn>

        <S.RoomTitle>{roomTitle}</S.RoomTitle>

        <S.RoomHeaderRight>
          <S.HeaderIconBtn type="button" title="옵션">⋯</S.HeaderIconBtn>
        </S.RoomHeaderRight>
      </S.RoomHeader>

      {loadingRoom && <div style={{ padding: 12 }}>채팅방 준비 중...</div>}
      {roomError && <div style={{ padding: 12 }}>{roomError}</div>}

      <S.MessageList ref={listRef}>
        {messages.map((m) => {
          const sender = m.sender_emp_id ?? m.senderId; // 백 필드명에 맞춰 방어
          const isMe = m.sender_emp_id === myEmpId;
          const timeText = m.create_date
            ? String(m.create_date).slice(11, 16)
            : (m.createdAt ?? "");

          return (
            <S.MessageRow key={m.messageId ?? m.id ?? `${sender}-${timeText}-${m.content}`} $isMe={isMe}>
              <S.Bubble $isMe={isMe}>
                <S.Content>{m.content}</S.Content>
                <S.Meta>{timeText}</S.Meta>
              </S.Bubble>
            </S.MessageRow>
          );
        })}
      </S.MessageList>

      <S.InputBar>
        <S.TextArea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="메시지를 입력하세요..."
          disabled={!roomKey}
        />
        <S.SendButton
          type="button"
          onClick={handleSend}
          disabled={!input.trim() || !roomKey}
        >
          전송
        </S.SendButton>
      </S.InputBar>
    </S.RoomContainer>
  );
};

export default ChatRoom;