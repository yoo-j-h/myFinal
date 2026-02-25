import React, { useState, useEffect } from 'react';
import { useTheme } from 'styled-components';
import useAuthStore from '../../store/authStore';
import api from '../../api/axios';
import * as S from './MyApplicationHistory.styled';

const MyApplicationHistory = () => {
    const [activeTab, setActiveTab] = useState('protest'); // 'protest' or 'leave'
    const [protestList, setProtestList] = useState([]);
    const [leaveList, setLeaveList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const getEmpId = useAuthStore((state) => state.getEmpId);
    const empId = getEmpId();

    // 근태 정정 신청 목록 조회
    const fetchProtestList = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/attendance/protest/my', {
                params: { empId }
            });
            setProtestList(response.data);
        } catch (error) {
            console.error('근태 정정 목록 조회 실패:', error);
            alert('근태 정정 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 휴가 신청 목록 조회
    const fetchLeaveList = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/leave/my-list', {
                params: { empId }
            });
            setLeaveList(response.data);
        } catch (error) {
            console.error('휴가 신청 목록 조회 실패:', error);
            alert('휴가 신청 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 상세 정보 조회
    const fetchDetail = async (id, type) => {
        try {
            const endpoint = type === 'protest'
                ? `/api/attendance/protest/${id}`
                : `/api/leave/${id}`;
            const response = await api.get(endpoint);
            setSelectedItem({ ...response.data, type });
            setShowDetailModal(true);
        } catch (error) {
            console.error('상세 정보 조회 실패:', error);
            alert('상세 정보를 불러오는데 실패했습니다.');
        }
    };

    // 탭 변경 시 데이터 로드
    useEffect(() => {
        if (activeTab === 'protest') {
            fetchProtestList();
        } else {
            fetchLeaveList();
        }
    }, [activeTab]);

    // 상태 배지 렌더링
    // Note: Colors are now handled by the Styled Component based on status, 
    // but if we need specific overrides, we should use theme constants from a hook or props.
    // For now, we will pass the status type to the styled component and let it handle colors, 
    // or pass theme variables if we have access to theme here. 
    // Since we don't have direct access to theme object here without a hook, 
    // let's rely on the styled component to map status to color, OR use a hook.
    // However, the styled component currently accepts a `color` prop.
    // Let's use the styled component's internal mapping if possible, or mapping strings.

    // Better approach: Let's pass the *status type* to the styled component and let it select the color from the theme.
    // But StatusBadge definition in styled.js was: background: ${props => props.color || ...}
    // Let's update it to accept $statusType and map it. 

    // ACTUALLY, I will update this function to return the status string, and the styled component to accept $status.
    // But wait, the previous styled definition I wrote was:
    // background: ${props => props.color || props.theme.text.secondary};

    // I should probably update the styled component to handle the mapping, 
    // OR I can keep passing colors but I need access to the theme.
    // I'll import useTheme from styled-components.

    const theme = useTheme();

    const renderStatusBadge = (status) => {
        const statusConfig = {
            PENDING: { label: '대기', color: theme.status.warning },
            APPROVED: { label: '승인', color: theme.status.success },
            REJECTED: { label: '반려', color: theme.status.error }
        };

        const config = statusConfig[status] || { label: status, color: theme.text.secondary };

        return (
            <S.StatusBadge color={config.color}>
                {config.label}
            </S.StatusBadge>
        );
    };

    // 날짜 포맷팅
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    // 시간 포맷팅
    const formatTime = (timeString) => {
        if (!timeString) return '-';
        return timeString.substring(0, 5); // HH:mm
    };

    // 근무 유형 한글 변환
    const formatAttendanceType = (type) => {
        const typeMap = {
            'NORMAL': '정상',
            'LATE': '지각',
            'EARLY_LEAVE': '조퇴',
            'ABSENT': '결근',
            'LEAVE': '휴가',
            'HALF_LEAVE': '반차'
        };
        return typeMap[type] || type;
    };

    // 휴가 종류 한글 변환
    const formatLeaveType = (type) => {
        const typeMap = {
            'ANNUAL': '연차',
            'SICK': '병가',
            'HALF_DAY': '반차',
            'UNPAID': '무급휴가'
        };
        return typeMap[type] || type;
    };

    // 모달 닫기
    const handleCloseModal = () => {
        setShowDetailModal(false);
        setSelectedItem(null);
    };

    return (
        <S.Container>
            <S.Header>
                <S.Title>내 신청 현황</S.Title>
            </S.Header>

            {/* 탭 메뉴 */}
            <S.TabContainer>
                <S.Tab
                    $active={activeTab === 'protest'}
                    onClick={() => setActiveTab('protest')}
                >
                    근태 정정 내역
                </S.Tab>
                <S.Tab
                    $active={activeTab === 'leave'}
                    onClick={() => setActiveTab('leave')}
                >
                    휴가 신청 내역
                </S.Tab>
            </S.TabContainer>

            {/* 로딩 상태 */}
            {loading && <S.LoadingText>데이터를 불러오는 중...</S.LoadingText>}

            {/* 근태 정정 테이블 */}
            {!loading && activeTab === 'protest' && (
                <S.TableContainer>
                    {protestList.length === 0 ? (
                        <S.EmptyMessage>근태 정정 신청 내역이 없습니다.</S.EmptyMessage>
                    ) : (
                        <S.Table>
                            <S.TableHead>
                                <S.TableRow>
                                    <S.TableHeader>신청일</S.TableHeader>
                                    <S.TableHeader>대상 날짜</S.TableHeader>
                                    <S.TableHeader>근무 유형</S.TableHeader>
                                    <S.TableHeader>정정 시간</S.TableHeader>
                                    <S.TableHeader>처리 상태</S.TableHeader>
                                </S.TableRow>
                            </S.TableHead>
                            <S.TableBody>
                                {protestList.map((item) => (
                                    <S.TableRow
                                        key={item.protestApplyId}
                                        onClick={() => fetchDetail(item.protestApplyId, 'protest')}
                                    >
                                        <S.TableCell>{formatDate(item.createdDate)}</S.TableCell>
                                        <S.TableCell>{formatDate(item.targetDate)}</S.TableCell>
                                        <S.TableCell>{formatAttendanceType(item.attendanceType)}</S.TableCell>
                                        <S.TableCell>
                                            {formatTime(item.protestRequestInTime)} ~ {formatTime(item.protestRequestOutTime)}
                                        </S.TableCell>
                                        <S.TableCell>{renderStatusBadge(item.status)}</S.TableCell>
                                    </S.TableRow>
                                ))}
                            </S.TableBody>
                        </S.Table>
                    )}
                </S.TableContainer>
            )}

            {/* 휴가 신청 테이블 */}
            {!loading && activeTab === 'leave' && (
                <S.TableContainer>
                    {leaveList.length === 0 ? (
                        <S.EmptyMessage>휴가 신청 내역이 없습니다.</S.EmptyMessage>
                    ) : (
                        <S.Table>
                            <S.TableHead>
                                <S.TableRow>
                                    <S.TableHeader>신청일</S.TableHeader>
                                    <S.TableHeader>휴가 기간</S.TableHeader>
                                    <S.TableHeader>휴가 종류</S.TableHeader>
                                    <S.TableHeader>사용 일수</S.TableHeader>
                                    <S.TableHeader>처리 상태</S.TableHeader>
                                </S.TableRow>
                            </S.TableHead>
                            <S.TableBody>
                                {leaveList.map((item) => (
                                    <S.TableRow
                                        key={item.leaveApplyId}
                                        onClick={() => fetchDetail(item.leaveApplyId, 'leave')}
                                    >
                                        <S.TableCell>{formatDate(item.createdDate)}</S.TableCell>
                                        <S.TableCell>
                                            {formatDate(item.startDate)} ~ {formatDate(item.endDate)}
                                        </S.TableCell>
                                        <S.TableCell>{formatLeaveType(item.leaveType)}</S.TableCell>
                                        <S.TableCell>{item.leaveDays || 0}일</S.TableCell>
                                        <S.TableCell>{renderStatusBadge(item.status)}</S.TableCell>
                                    </S.TableRow>
                                ))}
                            </S.TableBody>
                        </S.Table>
                    )}
                </S.TableContainer>
            )}

            {/* 상세 모달 */}
            {showDetailModal && selectedItem && (
                <S.ModalOverlay onClick={handleCloseModal}>
                    <S.ModalContent onClick={(e) => e.stopPropagation()}>
                        <S.ModalHeader>
                            <S.ModalTitle>
                                {selectedItem.type === 'protest' ? '근태 정정 상세' : '휴가 신청 상세'}
                            </S.ModalTitle>
                            <S.CloseButton onClick={handleCloseModal}>✕</S.CloseButton>
                        </S.ModalHeader>

                        <S.ModalBody>
                            {selectedItem.type === 'protest' ? (
                                <>
                                    <S.DetailRow>
                                        <S.DetailLabel>신청일</S.DetailLabel>
                                        <S.DetailValue>{formatDate(selectedItem.createdDate)}</S.DetailValue>
                                    </S.DetailRow>
                                    <S.DetailRow>
                                        <S.DetailLabel>대상 날짜</S.DetailLabel>
                                        <S.DetailValue>{formatDate(selectedItem.targetDate)}</S.DetailValue>
                                    </S.DetailRow>
                                    <S.DetailRow>
                                        <S.DetailLabel>근무 유형</S.DetailLabel>
                                        <S.DetailValue>{formatAttendanceType(selectedItem.attendanceType)}</S.DetailValue>
                                    </S.DetailRow>
                                    <S.DetailRow>
                                        <S.DetailLabel>현재 출근 시간</S.DetailLabel>
                                        <S.DetailValue>{formatTime(selectedItem.currentInTime)}</S.DetailValue>
                                    </S.DetailRow>
                                    <S.DetailRow>
                                        <S.DetailLabel>현재 퇴근 시간</S.DetailLabel>
                                        <S.DetailValue>{formatTime(selectedItem.currentOutTime)}</S.DetailValue>
                                    </S.DetailRow>
                                    <S.DetailRow>
                                        <S.DetailLabel>정정 요청 출근 시간</S.DetailLabel>
                                        <S.DetailValue>{formatTime(selectedItem.protestRequestInTime)}</S.DetailValue>
                                    </S.DetailRow>
                                    <S.DetailRow>
                                        <S.DetailLabel>정정 요청 퇴근 시간</S.DetailLabel>
                                        <S.DetailValue>{formatTime(selectedItem.protestRequestOutTime)}</S.DetailValue>
                                    </S.DetailRow>
                                    <S.DetailRow>
                                        <S.DetailLabel>정정 사유</S.DetailLabel>
                                        <S.DetailValue>{selectedItem.protestReason || '-'}</S.DetailValue>
                                    </S.DetailRow>
                                    <S.DetailRow>
                                        <S.DetailLabel>처리 상태</S.DetailLabel>
                                        <S.DetailValue>{renderStatusBadge(selectedItem.status)}</S.DetailValue>
                                    </S.DetailRow>
                                    {selectedItem.approverName && (
                                        <S.DetailRow>
                                            <S.DetailLabel>승인자</S.DetailLabel>
                                            <S.DetailValue>{selectedItem.approverName}</S.DetailValue>
                                        </S.DetailRow>
                                    )}
                                </>
                            ) : (
                                <>
                                    <S.DetailRow>
                                        <S.DetailLabel>신청일</S.DetailLabel>
                                        <S.DetailValue>{formatDate(selectedItem.createdDate)}</S.DetailValue>
                                    </S.DetailRow>
                                    <S.DetailRow>
                                        <S.DetailLabel>휴가 기간</S.DetailLabel>
                                        <S.DetailValue>
                                            {formatDate(selectedItem.startDate)} ~ {formatDate(selectedItem.endDate)}
                                        </S.DetailValue>
                                    </S.DetailRow>
                                    <S.DetailRow>
                                        <S.DetailLabel>휴가 종류</S.DetailLabel>
                                        <S.DetailValue>{formatLeaveType(selectedItem.leaveType)}</S.DetailValue>
                                    </S.DetailRow>
                                    <S.DetailRow>
                                        <S.DetailLabel>사용 일수</S.DetailLabel>
                                        <S.DetailValue>{selectedItem.leaveDays || 0}일</S.DetailValue>
                                    </S.DetailRow>
                                    <S.DetailRow>
                                        <S.DetailLabel>신청 사유</S.DetailLabel>
                                        <S.DetailValue>{selectedItem.reason || '-'}</S.DetailValue>
                                    </S.DetailRow>
                                    <S.DetailRow>
                                        <S.DetailLabel>처리 상태</S.DetailLabel>
                                        <S.DetailValue>{renderStatusBadge(selectedItem.status)}</S.DetailValue>
                                    </S.DetailRow>
                                    {selectedItem.approverName && (
                                        <S.DetailRow>
                                            <S.DetailLabel>승인자</S.DetailLabel>
                                            <S.DetailValue>{selectedItem.approverName}</S.DetailValue>
                                        </S.DetailRow>
                                    )}
                                </>
                            )}

                            {/* 반려 사유 (반려된 경우만 표시) */}
                            {selectedItem.status === 'REJECTED' && selectedItem.cancelReason && (
                                <S.RejectReasonBox>
                                    <S.RejectReasonTitle>❌ 반려 사유</S.RejectReasonTitle>
                                    <S.RejectReasonText>{selectedItem.cancelReason}</S.RejectReasonText>
                                </S.RejectReasonBox>
                            )}
                        </S.ModalBody>

                        <S.ModalFooter>
                            <S.CloseModalButton onClick={handleCloseModal}>닫기</S.CloseModalButton>
                        </S.ModalFooter>
                    </S.ModalContent>
                </S.ModalOverlay>
            )}
        </S.Container>
    );
};

export default MyApplicationHistory;
