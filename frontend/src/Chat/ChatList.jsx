import React, { useEffect, useMemo, useState } from "react";
import * as S from "./ChatList.styles";
import healthService from "../api/Health/healthService";
import ChatRoom from "../chatRoom/ChatRoom";
import useAuthStore from "../store/authStore";

const VIEW = { LIST: "LIST", ROOM: "ROOM" };
const TAB = { RECENT: "RECENT", HEALTH: "HEALTH" };

// roomKey 생성
const makeRoomKey = (a, b) => {
  if (!a || !b) return null;
  const [low, high] = a.localeCompare(b) <= 0 ? [a, b] : [b, a];
  return `${low}#${high}`;
};

const ChatList = () => {
  const empId = useAuthStore((s) => s.getEmpId());

  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState(VIEW.LIST);

  const [tab, setTab] = useState(TAB.RECENT); // ✅ 탭 추가 (기본: 최근대화)

  const [users, setUsers] = useState([]); // 탭에 따라 "리스트 아이템"으로 씀
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const [selectedUserId, setSelectedUserId] = useState(null);
  const selectedUser = useMemo(
    () => users.find((u) => u.userId === selectedUserId) ?? null,
    [users, selectedUserId]
  );

  const [roomTitle, setRoomTitle] = useState("채팅");
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [roomKey, setRoomKey] = useState(null);

  // ✅ LIST 화면 + 모달 open 상태일 때 탭별 목록 로딩
  useEffect(() => {
    if (!isOpen) return;
    if (view !== VIEW.LIST) return;

    const fetchList = async () => {
      try {
        setLoading(true);
        setLoadError(null);

        // 1) 최근대화 탭
        if (tab === TAB.RECENT) {
          const res = await healthService.chatRecentList(30);
          const data = res?.data ?? [];

          // ✅ 서버가 snake_case로 내려준다고 가정
          const mapped = data.map((c) => ({
            userId: c.other_emp_id,
            name: c.other_emp_name,
            dept: c.job,
            status: "",
            avatarUrl: null,

            // 최근대화 전용
            roomId: c.chat_room_id,
            roomKey: c.room_key,
            lastMessage: c.last_message,
            lastMessageTime: c.last_message_time,
          }));

          setUsers(mapped);
          setSelectedUserId(mapped.length > 0 ? mapped[0].userId : null);
          return;
        }

        // 2) 건강관리부 탭(기존)
        const res = await healthService.chatFriendList();
        const mapped = (res.data ?? []).map((f) => ({
          userId: f.empId,
          name: f.empName,
          dept: f.job,
          status: "",
          avatarUrl: null,
          phone: f.phone,
          email: f.email,
        }));

        setUsers(mapped);

        if (mapped.length > 0) setSelectedUserId(mapped[0].userId);
        else setSelectedUserId(null);
      } catch (e) {
        console.error(e);
        setLoadError("목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [isOpen, view, tab]);

  const onClickTab = (nextTab) => {
    if (tab === nextTab) return;
    setSelectedUserId(null);
    setUsers([]);
    setTab(nextTab);
  };

  const resetAll = () => {
    setView(VIEW.LIST);
    setActiveRoomId(null);
    setRoomTitle("채팅");
    setRoomKey(null);
    setUsers([]);
    setSelectedUserId(null);
    setLoadError(null);
    setLoading(false);
    setTab(TAB.RECENT);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
      resetAll();
    }
  };

  // ✅ 채팅하기 클릭
  const handleOpenChat = () => {
    if (!selectedUser) return;
    if (!empId) {
      alert("내 empId를 확인할 수 없습니다.");
      return;
    }

    // 최근대화 탭이면: roomId/roomKey가 이미 있을 수 있음
    if (tab === TAB.RECENT) {
      if (selectedUser.roomKey) setRoomKey(selectedUser.roomKey);
      else setRoomKey(makeRoomKey(empId, selectedUser.userId));

      setRoomTitle(selectedUser.name ?? selectedUser.userId);
      setActiveRoomId(selectedUser.roomId ?? null); // 있으면 활용
      setView(VIEW.ROOM);
      return;
    }

    // 건강관리부 탭이면: roomKey 생성
    const rk = makeRoomKey(empId, selectedUser.userId);
    setRoomKey(rk);
    setRoomTitle(selectedUser.name ?? selectedUser.userId);
    setActiveRoomId(null);
    setView(VIEW.ROOM);
  };

  const handleBackToList = () => {
    setView(VIEW.LIST);
    setActiveRoomId(null);
    setRoomTitle("채팅");
    setRoomKey(null);
  };

  return (
    <>
      <S.ChatIcon
        onClick={() => {
          const next = !isOpen;
          setIsOpen(next);
          if (next) setView(VIEW.LIST);
        }}
        title="채팅"
      >
        {isOpen ? "✕" : "💬"}
      </S.ChatIcon>

      {isOpen && (
        <S.Overlay onClick={handleOverlayClick}>
          <S.ChatWindow>
            <S.ChatHeader>
              <h2>💬 메신저</h2>
              <button
                onClick={() => {
                  setIsOpen(false);
                  resetAll();
                }}
                title="닫기"
              >
                ✕
              </button>
            </S.ChatHeader>

            {view === VIEW.LIST && (
              <>
                {/* ✅ 탭 영역 */}
                <S.TabBar>
                  <S.TabButton
                    type="button"
                    $active={tab === TAB.HEALTH}
                    onClick={() => setTab(TAB.HEALTH)}
                  >
                    건강관리부
                  </S.TabButton>
                  <S.TabButton
                    type="button"
                    $active={tab === TAB.RECENT}
                    onClick={() => onClickTab(TAB.RECENT)}
                  >
                    최근대화
                  </S.TabButton>


                </S.TabBar>

                <S.ContentArea>
                  <S.UserList>
                    {loading && <S.EmptyState>불러오는 중...</S.EmptyState>}
                    {!loading && loadError && <S.EmptyState>{loadError}</S.EmptyState>}
                    {!loading && !loadError && users.length === 0 && (
                      <S.EmptyState>
                        {tab === TAB.RECENT ? "최근 대화가 없습니다." : "표시할 인원이 없습니다."}
                      </S.EmptyState>
                    )}

                    {!loading &&
                      !loadError &&
                      users.map((u) => (
                        <S.UserRow
                          key={`${tab}-${u.userId}`}
                          $active={u.userId === selectedUserId}
                          onClick={() => setSelectedUserId(u.userId)}
                          role="button"
                          tabIndex={0}
                        >
                          <S.Avatar>{u.avatarUrl ? <img src={u.avatarUrl} alt={u.name} /> : "👤"}</S.Avatar>
                          <S.UserInfo>
                            <S.UserName>{u.name ?? u.userId}</S.UserName>

                            {/* ✅ 최근대화 탭이면 lastMessage 우선 표시 */}
                            <S.UserMeta>
                              {tab === TAB.RECENT
                                ? (u.lastMessage ?? " ")
                                : (u.dept ?? " ")}
                            </S.UserMeta>
                          </S.UserInfo>

                          {/* ✅ 최근대화 탭이면 시간 표시 (원하면 스타일링) */}
                          {tab === TAB.RECENT && u.lastMessageTime && (
                            <S.RightMeta>{String(u.lastMessageTime).slice(11, 16)}</S.RightMeta>
                          )}
                        </S.UserRow>
                      ))}
                  </S.UserList>

                  <S.ProfilePanel>
                    {selectedUser ? (
                      <>
                        <S.ProfileHeader>
                          <S.ProfileAvatar>
                            {selectedUser.avatarUrl ? (
                              <img src={selectedUser.avatarUrl} alt={selectedUser.name} />
                            ) : (
                              "👤"
                            )}
                          </S.ProfileAvatar>
                          <div>
                            <S.ProfileName>{selectedUser.name ?? selectedUser.userId}</S.ProfileName>
                            <S.ProfileSub>{tab === TAB.RECENT ? (selectedUser.dept ?? selectedUser.userId) : (selectedUser.dept ?? selectedUser.userId)}</S.ProfileSub>
                          </div>
                        </S.ProfileHeader>

                        <S.ProfileBody>
                          <S.ProfileLine>ID: {selectedUser.userId}</S.ProfileLine>

                          {tab === TAB.RECENT && (
                            <>
                              {selectedUser.lastMessage && <S.ProfileLine>최근: {selectedUser.lastMessage}</S.ProfileLine>}
                              {selectedUser.lastMessageTime && <S.ProfileLine>시간: {String(selectedUser.lastMessageTime)}</S.ProfileLine>}
                            </>
                          )}

                          {tab === TAB.HEALTH && (
                            <>
                              {selectedUser.phone && <S.ProfileLine>전화: {selectedUser.phone}</S.ProfileLine>}
                              {selectedUser.email && <S.ProfileLine>메일: {selectedUser.email}</S.ProfileLine>}
                            </>
                          )}
                        </S.ProfileBody>

                        <S.ProfileActions>
                          <button onClick={handleOpenChat}>채팅하기</button>
                        </S.ProfileActions>
                      </>
                    ) : (
                      <S.EmptyState>왼쪽에서 항목을 선택해 주세요.</S.EmptyState>
                    )}
                  </S.ProfilePanel>
                </S.ContentArea>
              </>
            )}

            {view === VIEW.ROOM && (
              <ChatRoom
                roomId={activeRoomId}
                roomKey={roomKey}
                roomTitle={roomTitle}
                onBack={handleBackToList}
                otherUser={selectedUser}
                myEmpId={empId}
              />
            )}
          </S.ChatWindow>
        </S.Overlay>
      )}
    </>
  );
};

export default ChatList;