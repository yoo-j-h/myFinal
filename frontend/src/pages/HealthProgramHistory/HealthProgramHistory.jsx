import React, { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import { empPhysicalTestService } from '../../api/Health/healthService';
import * as S from './HealthProgramHistory.styled';

/**
 * 건강 프로그램 신청 내역 조회 페이지
 * 사용자가 신청한 건강 프로그램의 내역을 테이블 형태로 표시
 */
const HealthProgramHistory = () => {
    const [historyList, setHistoryList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedApply, setSelectedApply] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 로그인한 사용자의 empNo (실제로는 Context나 Redux에서 가져와야 함)
    const { getEmpId } = useAuthStore();
    const currentEmpNo = getEmpId();

    /**
     * 신청 내역 데이터 로드
     */
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const response = await empPhysicalTestService.getProgramHistory(currentEmpNo);
                setHistoryList(response.data || []);
                setError(null);
            } catch (err) {
                console.error('프로그램 신청 내역 조회 실패:', err);
                setError('데이터를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [currentEmpNo]);

    /**
     * 상태별 Badge 텍스트 반환
     */
    const getStatusText = (status) => {
        switch (status) {
            case 'PENDING':
                return '신청';
            case 'APPROVED':
                return '승인';
            case 'REJECTED':
                return '반려';
            default:
                return status;
        }
    };

    /**
     * 상태별 아이콘 반환
     */
    const getStatusIcon = (status) => {
        switch (status) {
            case 'PENDING':
                return '⏳';
            case 'APPROVED':
                return '✓';
            case 'REJECTED':
                return '✗';
            default:
                return '';
        }
    };

    /**
     * 날짜 포맷팅
     */
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    /**
     * 신청 취소 핸들러
     */
    const handleCancel = async (programApplyId) => {
        if (!window.confirm('정말 신청을 취소하시겠습니까?')) {
            return;
        }

        try {
            // 취소 API 호출
            await empPhysicalTestService.cancelProgram(programApplyId);

            alert('신청이 취소되었습니다.');
            // 목록 새로고침
            const response = await empPhysicalTestService.getProgramHistory(currentEmpNo);
            setHistoryList(response.data || []);
        } catch (err) {
            console.error('신청 취소 실패:', err);
            alert('취소 처리 중 오류가 발생했습니다.');
        }
    };

    /**
     * 상세 모달 열기
     */
    const handleRowClick = (item) => {
        setSelectedApply(item);
        setIsModalOpen(true);
    };

    /**
     * 모달 닫기
     */
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedApply(null);
    };

    // ========== 로딩 상태 ==========
    if (loading) {
        return (
            <S.PageLayout>
                <S.MainContentArea>
                    <S.PageHeader>
                        <div>
                            <S.PageTitle>건강 프로그램 신청 내역</S.PageTitle>
                            <S.PageDescription>신청한 건강 프로그램의 내역을 확인하세요</S.PageDescription>
                        </div>
                    </S.PageHeader>

                    <S.TableCard>
                        <S.LoadingContainer>
                            <S.LoadingSpinner />
                            <S.LoadingText>데이터를 불러오는 중...</S.LoadingText>
                        </S.LoadingContainer>
                    </S.TableCard>
                </S.MainContentArea>
            </S.PageLayout>
        );
    }

    // ========== 에러 상태 ==========
    if (error) {
        return (
            <S.PageLayout>
                <S.MainContentArea>
                    <S.PageHeader>
                        <div>
                            <S.PageTitle>건강 프로그램 신청 내역</S.PageTitle>
                            <S.PageDescription>신청한 건강 프로그램의 내역을 확인하세요</S.PageDescription>
                        </div>
                    </S.PageHeader>

                    <S.TableCard>
                        <S.EmptyState>
                            <S.EmptyIcon>⚠️</S.EmptyIcon>
                            <S.EmptyText>{error}</S.EmptyText>
                            <S.EmptySubText>잠시 후 다시 시도해주세요.</S.EmptySubText>
                        </S.EmptyState>
                    </S.TableCard>
                </S.MainContentArea>
            </S.PageLayout>
        );
    }

    // ========== 메인 렌더링 ==========
    return (
        <S.PageLayout>
            <S.MainContentArea>
                <S.PageHeader>
                    <div>
                        <S.PageTitle>건강 프로그램 신청 내역</S.PageTitle>
                        <S.PageDescription>신청한 건강 프로그램의 내역을 확인하세요</S.PageDescription>
                    </div>
                </S.PageHeader>

                <S.TableCard>
                    <S.TableHeader>
                        <S.TableTitle>
                            신청 내역
                            <S.TableCount>({historyList.length}건)</S.TableCount>
                        </S.TableTitle>
                    </S.TableHeader>

                    {historyList.length === 0 ? (
                        <S.EmptyState>
                            <S.EmptyIcon>📋</S.EmptyIcon>
                            <S.EmptyText>신청 내역이 없습니다</S.EmptyText>
                            <S.EmptySubText>건강 프로그램을 신청해보세요!</S.EmptySubText>
                        </S.EmptyState>
                    ) : (
                        <S.Table>
                            <S.TableHead>
                                <S.TableRow>
                                    <S.TableHeaderCell>프로그램명</S.TableHeaderCell>
                                    <S.TableHeaderCell>카테고리</S.TableHeaderCell>
                                    <S.TableHeaderCell>신청일</S.TableHeaderCell>
                                    <S.TableHeaderCell>프로그램 일정</S.TableHeaderCell>
                                    <S.TableHeaderCell>상태</S.TableHeaderCell>
                                    <S.TableHeaderCell>신청 사유</S.TableHeaderCell>
                                    <S.TableHeaderCell>반려 사유</S.TableHeaderCell>
                                    <S.TableHeaderCell>취소</S.TableHeaderCell>
                                </S.TableRow>
                            </S.TableHead>
                            <tbody>
                                {historyList.map((item) => (
                                    <S.TableRow
                                        key={item.program_apply_id}
                                        onClick={() => handleRowClick(item)}
                                    >
                                        {/* 프로그램명 */}
                                        <S.TableCell>
                                            {item.program_name || '-'}
                                        </S.TableCell>

                                        {/* 카테고리 */}
                                        <S.TableCell>
                                            <S.CategoryBadge $category={item.category}>
                                                {item.category || item.program_code}
                                            </S.CategoryBadge>
                                        </S.TableCell>

                                        {/* 신청일 */}
                                        <S.TableCell>
                                            <S.DateText>{formatDate(item.apply_date)}</S.DateText>
                                        </S.TableCell>

                                        {/* 프로그램 일정 */}
                                        <S.TableCell>
                                            {item.start_date && item.end_date ? (
                                                <S.DateRange>
                                                    <div>
                                                        <S.DateLabel>시작: </S.DateLabel>
                                                        {formatDate(item.start_date)}
                                                    </div>
                                                    <div>
                                                        <S.DateLabel>종료: </S.DateLabel>
                                                        {formatDate(item.end_date)}
                                                    </div>
                                                </S.DateRange>
                                            ) : (
                                                '-'
                                            )}
                                        </S.TableCell>

                                        {/* 상태 */}
                                        <S.TableCell>
                                            <S.StatusBadge $status={item.status}>
                                                <S.StatusIcon>{getStatusIcon(item.status)}</S.StatusIcon>
                                                {getStatusText(item.status)}
                                            </S.StatusBadge>
                                        </S.TableCell>

                                        {/* 신청 사유 */}
                                        <S.TableCell>
                                            {item.apply_reason ? (
                                                <S.TruncatedText>
                                                    {item.apply_reason}
                                                </S.TruncatedText>
                                            ) : (
                                                '-'
                                            )}
                                        </S.TableCell>

                                        {/* 반려 사유 */}
                                        <S.TableCell>
                                            {item.cancel_reason || '-'}
                                        </S.TableCell>

                                        {/* 취소 버튼 (PENDING 상태일 때만 활성화) */}
                                        <S.TableCell>
                                            <S.CancelButton
                                                onClick={() => handleCancel(item.program_apply_id)}
                                                disabled={item.status !== 'PENDING'}
                                            >
                                                취소
                                            </S.CancelButton>
                                        </S.TableCell>
                                    </S.TableRow>
                                ))}
                            </tbody>
                        </S.Table>
                    )}

                </S.TableCard>

                {/* 상세 모달 */}
                {isModalOpen && selectedApply && (
                    <S.ModalOverlay onClick={closeModal}>
                        <S.ModalContainer onClick={(e) => e.stopPropagation()}>
                            <S.ModalHeader>
                                <S.ModalTitle>신청 상세 정보</S.ModalTitle>
                                <S.ModalCloseButton onClick={closeModal} title="닫기">
                                    &times;
                                </S.ModalCloseButton>
                            </S.ModalHeader>
                            <S.ModalBody>
                                <S.ModalSection>
                                    <S.ModalLabel>프로그램</S.ModalLabel>
                                    <S.ModalValue>{selectedApply.program_name}</S.ModalValue>
                                </S.ModalSection>

                                <S.ModalSection>
                                    <S.ModalLabel>일정</S.ModalLabel>
                                    <S.ModalValue>
                                        {selectedApply.start_date && selectedApply.end_date ? (
                                            <>
                                                {formatDate(selectedApply.start_date)} ~ {formatDate(selectedApply.end_date)}
                                            </>
                                        ) : '일정 미정'}
                                    </S.ModalValue>
                                </S.ModalSection>

                                <S.ModalSection>
                                    <S.ModalLabel>신청 사유</S.ModalLabel>
                                    <S.ModalValue $isBox>
                                        {selectedApply.apply_reason || '-'}
                                    </S.ModalValue>
                                </S.ModalSection>

                                {/* 승인 완료 시 담당자 표시 */}
                                {selectedApply.status === 'APPROVED' && (
                                    <S.ModalSection>
                                        <S.ModalLabel>배정된 담당자</S.ModalLabel>
                                        <S.ModalStatusValue $status="APPROVED">
                                            ✅ {selectedApply.manager_name || '담당자 배정됨'}
                                        </S.ModalStatusValue>
                                    </S.ModalSection>
                                )}

                                {/* 반려 시 반려 사유 표시 */}
                                {selectedApply.status === 'REJECTED' && (
                                    <S.ModalSection>
                                        <S.ModalLabel>반려 사유</S.ModalLabel>
                                        <S.ModalStatusValue $status="REJECTED">
                                            ⚠️ {selectedApply.cancel_reason || '사유 미기재'}
                                        </S.ModalStatusValue>
                                    </S.ModalSection>
                                )}

                                {/* 대기 중일 때 안내 */}
                                {selectedApply.status === 'PENDING' && (
                                    <S.ModalSection>
                                        <S.ModalStatusValue $status="PENDING">
                                            ℹ️ 현재 담당자 확인 및 승인 대기 중입니다.
                                        </S.ModalStatusValue>
                                    </S.ModalSection>
                                )}

                            </S.ModalBody>
                            <S.ModalFooter>
                                <S.ModalActionButton $variant="secondary" onClick={closeModal}>
                                    닫기
                                </S.ModalActionButton>
                            </S.ModalFooter>
                        </S.ModalContainer>
                    </S.ModalOverlay>
                )}
            </S.MainContentArea>
        </S.PageLayout>
    );
};

export default HealthProgramHistory;
