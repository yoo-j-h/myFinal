package com.kh.ct.domain.chat.service;

import com.kh.ct.domain.chat.dto.ChatMessageDto;
import com.kh.ct.domain.chat.dto.ChatRoomDto;
import com.kh.ct.domain.chat.entity.ChatMessage;
import com.kh.ct.domain.chat.entity.ChatRoom;
import com.kh.ct.domain.chat.repository.ChatMessageRepository;
import com.kh.ct.domain.chat.repository.ChatRoomRepository;
import com.kh.ct.domain.emp.entity.Department;
import com.kh.ct.domain.emp.entity.Emp;
import com.kh.ct.domain.emp.repository.DepartmentRepository;
import com.kh.ct.domain.emp.repository.EmpRepository;
import com.kh.ct.global.common.CommonEnums;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChatRoomServiceImpl implements ChatRoomService {

    private final EmpRepository empRepository;
    private final DepartmentRepository departmentRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;

    @Override
    public List<ChatRoomDto.ChatFriendDto> getFriendsByDepartment(String departmentName) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null || auth.getName().isBlank()) {
            throw new IllegalStateException("인증 정보가 없습니다.");
        }

        // 1) 로그인한 사용자 empId 확보
        String myEmpId = auth.getName();

        // 2) 내 Emp 조회 → 내 airlineId 얻기
        Emp me = empRepository.findById(myEmpId)
                .orElseThrow(() -> new IllegalArgumentException("로그인 사용자 정보를 찾을 수 없습니다: " + myEmpId));

        if (me.getAirlineId() == null) {
            throw new IllegalStateException("항공사 정보가 없는 사용자입니다: " + myEmpId);
        }

        Long airlineId = me.getAirlineId().getAirlineId(); // Airline 엔티티 PK getter에 맞게 수정

        // 3) 부서명으로 부서 조회 (활성 부서만)
        Department dept = departmentRepository
                .findByDepartmentNameAndDepartmentStatus(departmentName, CommonEnums.CommonStatus.Y)
                .orElseThrow(() -> new IllegalArgumentException("부서를 찾을 수 없습니다: " + departmentName));

        Long deptId = dept.getDepartmentId();
        System.out.println("?"+deptId);
        // 4) 같은 항공사 + 같은 부서 + 활성 직원만 조회 (내 자신 제외)
        List<Emp> emps = empRepository
                .findByAirlineId_AirlineIdAndDepartmentId_DepartmentIdAndEmpStatusAndEmpIdNot(
                        airlineId,
                        deptId,
                        CommonEnums.EmpStatus.Y,
                        myEmpId
                );
        System.out.println("TEST"+emps);
        // 5) DTO 변환 (민감정보 제외)
        return emps.stream()
                .map(e -> ChatRoomDto.ChatFriendDto.builder()
                        .empId(e.getEmpId())
                        .empName(e.getEmpName())
                        .job(e.getJob())
                        .phone(e.getPhone())
                        .email(e.getEmail())
                        .build()
                )
                .toList();

    }

    @Transactional
    @Override
    public ChatRoomDto.RoomRes getOrCreateByRoomKey(String roomKey, String myEmpId) {

        // 1) roomKey 유효성 체크 + low/high 파싱
        ParsedRoomKey parsed = parseRoomKey(roomKey);

        // 2) 보안 체크: 내가 해당 방의 참여자인지
        if (!myEmpId.equals(parsed.low) && !myEmpId.equals(parsed.high)) {
            throw new IllegalArgumentException("본인이 참여자가 아닌 채팅방입니다.");
        }

        // 3) 있으면 반환
        return chatRoomRepository.findByRoomKey(roomKey)
                .map(ChatRoomDto.RoomRes::from)
                .orElseGet(() -> createRoomWithConcurrencyHandling(roomKey, parsed));

    }

    @Transactional
    @Override
    public ChatMessageDto.MessageResponse sendMessage(String roomKey, String senderEmpId, String content) {
        ChatRoom room = chatRoomRepository.findByRoomKey(roomKey)
                .orElseThrow(() -> new IllegalArgumentException("채팅방이 존재하지 않습니다. roomKey=" + roomKey));

        if (!room.isParticipant(senderEmpId)) {
            throw new IllegalArgumentException("본인이 참여자가 아닌 채팅방입니다.");
        }

        String msg = content == null ? "" : content.trim();
        if (msg.isBlank()) throw new IllegalArgumentException("메시지 내용이 비어있습니다.");
        if (msg.length() > 2000) throw new IllegalArgumentException("메시지 길이가 너무 깁니다(최대 2000자).");

        ChatMessage saved = chatMessageRepository.save(
                ChatMessage.builder()
                        .chatRoom(room)
                        .senderId(senderEmpId)
                        .content(msg)
                        .createDate(LocalDateTime.now())
                        .build()
        );

        // ✅ setter 없이 도메인 메서드
        room.updateLastMessage(saved.getContent(), saved.getCreateDate());

        return ChatMessageDto.MessageResponse.from(saved);
    }


    public List<ChatMessageDto.MessageResponse> getRecent(String roomKey, String myEmpId) {
        ChatRoom room = chatRoomRepository.findByRoomKey(roomKey)
                .orElseThrow(() -> new IllegalArgumentException("채팅방이 존재하지 않습니다. roomKey=" + roomKey));

        if (!room.isParticipant(myEmpId)) {
            throw new IllegalArgumentException("본인이 참여자가 아닌 채팅방입니다.");
        }

        List<ChatMessage> list =
                chatMessageRepository.findTop50ByChatRoom_RoomKeyOrderByCreateDateDesc(roomKey);

        java.util.Collections.reverse(list);

        return list.stream()
                .map(ChatMessageDto.MessageResponse::from)
                .toList();
    }



    public List<ChatRoomDto.RecentConversationRes> getRecentConversations(String myEmpId, int limit) {
        int size = (limit <= 0 || limit > 100) ? 30 : limit;

        Page<ChatRoom> page = chatRoomRepository
                .findByLowUserIdOrHighUserIdOrderByLastMessageTimeDesc(
                        myEmpId, myEmpId, PageRequest.of(0, size)
                );

        // ✅ 최근 대화 탭이면 lastMessageTime 있는 방만 보여주는 게 일반적
        List<ChatRoom> rooms = page.getContent().stream()
                .filter(r -> r.getLastMessageTime() != null)
                .toList();

        // 1) 상대방 ID 추출
        List<String> otherIds = rooms.stream()
                .map(r -> myEmpId.equals(r.getLowUserId()) ? r.getHighUserId() : r.getLowUserId())
                .distinct()
                .toList();

        // 2) Emp를 한 번에 조회해서 Map으로
        Map<String, Emp> empMap = empRepository.findAllById(otherIds).stream()
                .collect(Collectors.toMap(Emp::getEmpId, Function.identity()));

        // 3) DTO로 변환
        return rooms.stream()
                .map(r -> {
                    String otherId = myEmpId.equals(r.getLowUserId()) ? r.getHighUserId() : r.getLowUserId();
                    Emp other = empMap.get(otherId);

                    return ChatRoomDto.RecentConversationRes.builder()
                            .chatRoomId(r.getChatRoomId())
                            .roomKey(r.getRoomKey())
                            .otherEmpId(otherId)
                            .otherEmpName(other != null ? other.getEmpName() : otherId)
                            .job(other != null ? other.getJob() : null)
                            .lastMessage(r.getLastMessage())
                            .lastMessageTime(r.getLastMessageTime())
                            .build();
                })
                .toList();
    }

    private ChatRoomDto.RoomRes createRoomWithConcurrencyHandling(String roomKey, ParsedRoomKey parsed) {
        ChatRoom newRoom = ChatRoom.builder()
                .roomKey(roomKey)
                .lowUserId(parsed.low)
                .highUserId(parsed.high)
                .lastMessage(null)
                .lastMessageTime(null)
                .build();

        try {
            ChatRoom saved = chatRoomRepository.save(newRoom);
            return ChatRoomDto.RoomRes.from(saved);
        } catch (DataIntegrityViolationException e) {
            // UNIQUE(room_key) 충돌: 누가 동시에 만들어 둠 → 재조회 후 반환
            ChatRoom existed = chatRoomRepository.findByRoomKey(roomKey)
                    .orElseThrow(() -> e);
            return ChatRoomDto.RoomRes.from(existed);
        }
    }






    /**
     * roomKey 형식: low#high
     * - low/high는 빈 문자열 불가
     * - '#' 정확히 1개
     */
    private ParsedRoomKey parseRoomKey(String roomKey) {
        if (roomKey == null || roomKey.isBlank()) {
            throw new IllegalArgumentException("roomKey가 비어있습니다.");
        }

        int idx = roomKey.indexOf('#');
        if (idx <= 0 || idx != roomKey.lastIndexOf('#') || idx == roomKey.length() - 1) {
            throw new IllegalArgumentException("roomKey 형식이 올바르지 않습니다. 예: low#high");
        }

        String low = roomKey.substring(0, idx).trim();
        String high = roomKey.substring(idx + 1).trim();

        if (low.isEmpty() || high.isEmpty()) {
            throw new IllegalArgumentException("roomKey 형식이 올바르지 않습니다. 예: low#high");
        }

        // (선택) low/high 정렬 규칙 검증까지 하고 싶다면:
        // if (low.compareTo(high) > 0) throw new IllegalArgumentException("roomKey 정렬 규칙이 올바르지 않습니다.");

        return new ParsedRoomKey(low, high);
    }

    private record ParsedRoomKey(String low, String high) {}
}
