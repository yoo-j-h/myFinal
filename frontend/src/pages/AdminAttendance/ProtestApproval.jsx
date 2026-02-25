import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import useAuthStore from '../../store/authStore';
import * as S from './ProtestApproval.styled';

const ProtestApproval = () => {
    const { emp } = useAuthStore();
    const [activeFilter, setActiveFilter] = useState('all');
    const [protestList, setProtestList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // 모달 상태
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProtest, setSelectedProtest] = useState(null);
    const [protestDetail, setProtestDetail] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectInput, setShowRejectInput] = useState(false);

    // 파일 미리보기 상태
    const [previewFile, setPreviewFile] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    // 통계
    const [stats, setStats] = useState({
        pending: 0,
        approved: 0,
        rejected: 0,
    });

    const filterTabs = [
        { id: 'all', label: '전체' },
        { id: 'pending', label: '대기중' },
        { id: 'approved', label: '승인' },
        { id: 'rejected', label: '반려' },
    ];

    useEffect(() => {
        fetchProtestApplications();
    }, [activeFilter, page]);

    // 정정 신청 목록 조회
    const fetchProtestApplications = async () => {
        setLoading(true);
        setError(null);
        try {
            let response;
            if (activeFilter === 'all') {
                response = await api.get('/api/admin/attendance/protest/all', {
                    params: { page, size: 10 }
                });
            } else {
                response = await api.get(`/api/admin/attendance/protest/status/${activeFilter.toUpperCase()}`, {
                    params: { page, size: 10 }
                });
            }

            console.log('✅ API 응답:', response.data);

            // ApiResponse 구조 처리
            let data;
            if (response.data && response.data.data) {
                data = response.data.data;
            } else {
                data = response.data;
            }

            // Page 객체 처리
            if (data.content) {
                setProtestList(data.content);
                setTotalPages(data.totalPages);
                setTotalElements(data.totalElements);
                calculateStats(data.content);
            } else if (Array.isArray(data)) {
                setProtestList(data);
            } else {
                setProtestList([]);
            }

        } catch (err) {
            console.error('❌ API 호출 실패:', err);
            setError('데이터를 불러오는 데 실패했습니다.');
            setProtestList([]);
        } finally {
            setLoading(false);
        }
    };

    // 통계 계산
    const calculateStats = (data) => {
        if (!Array.isArray(data)) return;

        const pending = data.filter(item => item?.status === 'PENDING').length;
        const approved = data.filter(item => item?.status === 'APPROVED').length;
        const rejected = data.filter(item => item?.status === 'REJECTED').length;

        setStats({ pending, approved, rejected });
    };

    // 상세보기
    const handleViewDetail = async (protest) => {
        console.log('🔍 상세보기:', protest);
        setSelectedProtest(protest);

        try {
            const response = await api.get(`/api/admin/attendance/protest/${protest.protestApplyId}`);
            const detail = response.data.data || response.data;
            console.log('✅ 상세 정보:', detail);
            setProtestDetail(detail);
            setIsModalOpen(true);
            setShowRejectInput(false);
            setRejectReason('');
        } catch (err) {
            console.error('❌ 상세 조회 실패:', err);
            alert('상세 정보를 불러오지 못했습니다.');
        }
    };

    // 모달 닫기
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProtest(null);
        setProtestDetail(null);
        setShowRejectInput(false);
        setRejectReason('');
    };

    // 승인 처리
    const handleApprove = async () => {
        if (!selectedProtest || !emp?.empId) {
            alert('승인 처리에 필요한 정보가 없습니다.');
            return;
        }

        if (!window.confirm(' 정정 신청을 승인하시겠습니까? 승인 시 실제 근태 기록이 수정됩니다.')) {
            return;
        }

        try {
            await api.put(
                `/api/admin/attendance/protest/${selectedProtest.protestApplyId}/approve`,
                { approved: true, cancelReason: null },
                { params: { approverId: emp.empId } }
            );

            console.log('✅ 승인 완료');
            alert('정정 신청이 승인되었습니다.');
            handleCloseModal();
            fetchProtestApplications();
        } catch (err) {
            console.error('❌ 승인 실패:', err);
            alert(err.response?.data?.message || '승인 처리에 실패했습니다.');
        }
    };

    // 반려 사유 입력 표시
    const handleShowRejectInput = () => {
        setShowRejectInput(true);
    };

    // 반려 처리
    const handleReject = async () => {
        if (!selectedProtest || !emp?.empId) {
            alert('반려 처리에 필요한 정보가 없습니다.');
            return;
        }

        if (!rejectReason.trim()) {
            alert('반려 사유를 입력해주세요.');
            return;
        }

        if (!window.confirm('정정 신청을 반려하시겠습니까?')) {
            return;
        }

        try {
            await api.put(
                `/api/admin/attendance/protest/${selectedProtest.protestApplyId}/approve`,
                { approved: false, cancelReason: rejectReason },
                { params: { approverId: emp.empId } }
            );

            console.log('✅ 반려 완료');
            alert('정정 신청이 반려되었습니다.');
            handleCloseModal();
            fetchProtestApplications();
        } catch (err) {
            console.error('❌ 반려 실패:', err);
            alert(err.response?.data?.message || '반려 처리에 실패했습니다.');
        }
    };

    // 헬퍼 함수들
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        } catch (e) {
            console.error('날짜 포맷 오류:', e);
            return dateString;
        }
    };

    const formatTime = (time) => {
        if (!time) return '-';
        if (typeof time === 'string' && time.includes(':')) {
            const parts = time.split(':');
            return `${parts[0]}:${parts[1]}`;
        }
        return time;
    };

    const getAvatarColor = (name) => {
        const colors = ['#3b82f6', '#f59e0b', '#8b5cf6', '#10b981', '#06b6d4', '#ef4444', '#f97316', '#14b8a6'];
        if (!name) return colors[0];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.substring(0, 2);
    };

    const getStatusLabel = (status) => {
        const labels = {
            'PENDING': '대기중',
            'APPROVED': '승인',
            'REJECTED': '반려'
        };
        return labels[status] || status;
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    // 파일 다운로드
    const handleFileDownload = (file) => {
        const downloadUrl = `${api.defaults.baseURL}/api/file/download/${file.fileId}`;
        window.open(downloadUrl, '_blank');
    };

    // 파일 미리보기
    const handleFilePreview = (file) => {
        setPreviewFile(file);
        setShowPreview(true);
    };

    // 미리보기 닫기
    const handleClosePreview = () => {
        setShowPreview(false);
        setPreviewFile(null);
    };

    // 파일 타입 확인 (미리보기 가능 여부)
    const isPreviewable = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        return ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension);
    };

    // 파일 MIME 타입 판별
    const getFileType = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
            return 'image';
        }
        if (extension === 'pdf') {
            return 'pdf';
        }
        return 'other';
    };

    return (
        <S.MainContentArea>
            {/* 통계 카드 */}
            <S.StatsGrid>
                <S.StatCard $type="pending">
                    <S.StatIcon $type="pending">📋</S.StatIcon>
                    <S.StatInfo>
                        <S.StatLabel>대기 중</S.StatLabel>
                        <S.StatValue>{stats.pending}</S.StatValue>
                        <S.StatSubtext>처리 필요</S.StatSubtext>
                    </S.StatInfo>
                </S.StatCard>

                <S.StatCard $type="approved">
                    <S.StatIcon $type="approved">✓</S.StatIcon>
                    <S.StatInfo>
                        <S.StatLabel>승인</S.StatLabel>
                        <S.StatValue>{stats.approved}</S.StatValue>
                        <S.StatSubtext>승인 완료</S.StatSubtext>
                    </S.StatInfo>
                </S.StatCard>

                <S.StatCard $type="rejected">
                    <S.StatIcon $type="rejected">⚠</S.StatIcon>
                    <S.StatInfo>
                        <S.StatLabel>반려</S.StatLabel>
                        <S.StatValue>{stats.rejected}</S.StatValue>
                        <S.StatSubtext>반려 처리</S.StatSubtext>
                    </S.StatInfo>
                </S.StatCard>
            </S.StatsGrid>

            {/* 필터 섹션 */}
            <S.FilterSection>
                <S.FilterTabs>
                    {filterTabs.map((tab) => (
                        <S.FilterTab
                            key={tab.id}
                            $active={activeFilter === tab.id}
                            onClick={() => {
                                setActiveFilter(tab.id);
                                setPage(0);
                            }}
                        >
                            <S.TabLabel>{tab.label}</S.TabLabel>
                        </S.FilterTab>
                    ))}
                </S.FilterTabs>

                <S.SortDropdown>
                    <option value="date">최신순</option>
                    <option value="status">상태별</option>
                </S.SortDropdown>
            </S.FilterSection>

            {/* 신청 목록 */}
            <S.ApprovalListSection>
                <S.ListHeader>
                    <S.ListTitle>🕒 근태 정정 신청 목록</S.ListTitle>
                    <S.SortButton>총 {totalElements}건</S.SortButton>
                </S.ListHeader>

                {loading && (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                        로딩 중...
                    </div>
                )}

                {error && (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
                        {error}
                    </div>
                )}

                {!loading && !error && protestList.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                        정정 신청 내역이 없습니다.
                    </div>
                )}

                <S.ApprovalList>
                    {protestList.map((protest, index) => {
                        const applicantName = protest?.applicantName || '-';
                        const departmentName = protest?.departmentName || '부서 미지정';
                        const targetDate = protest?.targetDate;
                        const status = protest?.status || 'PENDING';

                        return (
                            <S.ApprovalItem key={protest?.protestApplyId || index}>
                                <S.ApprovalAvatar $color={getAvatarColor(applicantName)}>
                                    {getInitials(applicantName)}
                                </S.ApprovalAvatar>

                                <S.ApprovalInfo>
                                    <S.ApprovalName>{applicantName}</S.ApprovalName>
                                    <S.ApprovalDepartment>{departmentName}</S.ApprovalDepartment>
                                </S.ApprovalInfo>

                                <S.ApprovalDetails>
                                    <S.ApprovalDate>
                                        📅 {formatDate(targetDate)} 근태 정정
                                    </S.ApprovalDate>
                                    <S.ApprovalPeriod>
                                        {formatTime(protest.currentInTime)} → {formatTime(protest.protestRequestInTime)} |
                                        {formatTime(protest.currentOutTime)} → {formatTime(protest.protestRequestOutTime)}
                                    </S.ApprovalPeriod>
                                    <S.ApprovalPeriod>상태: {getStatusLabel(status)}</S.ApprovalPeriod>
                                </S.ApprovalDetails>

                                <S.ApprovalActions>
                                    <S.ViewButton onClick={() => handleViewDetail(protest)}>
                                        👁 상세
                                    </S.ViewButton>
                                </S.ApprovalActions>
                            </S.ApprovalItem>
                        );
                    })}
                </S.ApprovalList>
            </S.ApprovalListSection>

            {/* 상세 모달 */}
            {isModalOpen && protestDetail && (
                <S.ModalOverlay onClick={handleCloseModal}>
                    <S.ModalContent onClick={(e) => e.stopPropagation()}>
                        <S.ModalHeader>
                            <S.ModalTitle>근태 정정 신청 상세</S.ModalTitle>
                            <S.CloseButton onClick={handleCloseModal}>✕</S.CloseButton>
                        </S.ModalHeader>

                        <S.ModalBody>
                            {/* 신청자 정보 */}
                            <S.ApplicantInfo>
                                <S.ApprovalAvatar $color={getAvatarColor(protestDetail.applicantName)}>
                                    {getInitials(protestDetail.applicantName)}
                                </S.ApprovalAvatar>
                                <div>
                                    <S.ApprovalName>{protestDetail.applicantName}</S.ApprovalName>
                                    <S.ApprovalDepartment>{selectedProtest.departmentName}</S.ApprovalDepartment>
                                </div>
                            </S.ApplicantInfo>

                            {/* 정정 대상 날짜 */}
                            <S.DetailSection>
                                <S.DetailLabel>정정 대상 날짜</S.DetailLabel>
                                <S.DetailValue>📅 {formatDate(protestDetail.targetDate)}</S.DetailValue>
                            </S.DetailSection>

                            {/* 출근 시간 비교 */}
                            <S.DetailSection>
                                <S.DetailLabel>출근 시간 정정</S.DetailLabel>
                                <S.ComparisonBox>
                                    <S.ComparisonItem>
                                        <S.ComparisonLabel>기존 시간</S.ComparisonLabel>
                                        <S.ComparisonValue>{formatTime(protestDetail.currentInTime)}</S.ComparisonValue>
                                    </S.ComparisonItem>
                                    <S.ComparisonArrow>→</S.ComparisonArrow>
                                    <S.ComparisonItem $highlight={protestDetail.protestRequestInTime !== protestDetail.currentInTime}>
                                        <S.ComparisonLabel>요청 시간</S.ComparisonLabel>
                                        <S.ComparisonValue $highlight={protestDetail.protestRequestInTime !== protestDetail.currentInTime}>
                                            {formatTime(protestDetail.protestRequestInTime)}
                                        </S.ComparisonValue>
                                    </S.ComparisonItem>
                                </S.ComparisonBox>
                            </S.DetailSection>

                            {/* 퇴근 시간 비교 */}
                            <S.DetailSection>
                                <S.DetailLabel>퇴근 시간 정정</S.DetailLabel>
                                <S.ComparisonBox>
                                    <S.ComparisonItem>
                                        <S.ComparisonLabel>기존 시간</S.ComparisonLabel>
                                        <S.ComparisonValue>{formatTime(protestDetail.currentOutTime)}</S.ComparisonValue>
                                    </S.ComparisonItem>
                                    <S.ComparisonArrow>→</S.ComparisonArrow>
                                    <S.ComparisonItem $highlight={protestDetail.protestRequestOutTime !== protestDetail.currentOutTime}>
                                        <S.ComparisonLabel>요청 시간</S.ComparisonLabel>
                                        <S.ComparisonValue $highlight={protestDetail.protestRequestOutTime !== protestDetail.currentOutTime}>
                                            {formatTime(protestDetail.protestRequestOutTime)}
                                        </S.ComparisonValue>
                                    </S.ComparisonItem>
                                </S.ComparisonBox>
                            </S.DetailSection>

                            {/* 정정 사유 */}
                            <S.DetailSection>
                                <S.DetailLabel>정정 사유</S.DetailLabel>
                                <S.ReasonBox>{protestDetail.protestReason || '사유 없음'}</S.ReasonBox>
                            </S.DetailSection>

                            {/* 증빙 파일 */}
                            {protestDetail.files && protestDetail.files.length > 0 && (
                                <S.DetailSection>
                                    <S.DetailLabel>증빙 파일 ({protestDetail.files.length}개)</S.DetailLabel>
                                    <S.FileList>
                                        {protestDetail.files.map((file, index) => (
                                            <S.FileItem key={index}>
                                                <S.FileIcon>📄</S.FileIcon>
                                                <S.FileName>{file.fileOriName}</S.FileName>
                                                <S.FileSize>{formatFileSize(file.size)}</S.FileSize>
                                                <S.FileActions>
                                                    {isPreviewable(file.fileName) && (
                                                        <S.FileActionButton
                                                            $variant="preview"
                                                            onClick={() => handleFilePreview(file)}
                                                        >
                                                            👁 미리보기
                                                        </S.FileActionButton>
                                                    )}
                                                    <S.FileActionButton
                                                        onClick={() => handleFileDownload(file)}
                                                    >
                                                        ⬇ 다운로드
                                                    </S.FileActionButton>
                                                </S.FileActions>
                                            </S.FileItem>
                                        ))}
                                    </S.FileList>
                                </S.DetailSection>
                            )}

                            {/* 현재 상태 */}
                            <S.DetailSection>
                                <S.DetailLabel>현재 상태</S.DetailLabel>
                                <S.DetailValue>
                                    <S.StatusBadge $status={protestDetail.status}>
                                        {getStatusLabel(protestDetail.status)}
                                    </S.StatusBadge>
                                </S.DetailValue>
                            </S.DetailSection>

                            {/* 승인자/반려 사유 */}
                            {protestDetail.approverName && (
                                <S.DetailSection>
                                    <S.DetailLabel>처리자</S.DetailLabel>
                                    <S.DetailValue>{protestDetail.approverName}</S.DetailValue>
                                </S.DetailSection>
                            )}

                            {protestDetail.cancelReason && (
                                <S.DetailSection>
                                    <S.DetailLabel>반려 사유</S.DetailLabel>
                                    <S.ReasonBox>{protestDetail.cancelReason}</S.ReasonBox>
                                </S.DetailSection>
                            )}

                            {/* 반려 사유 입력 */}
                            {showRejectInput && (
                                <S.DetailSection>
                                    <S.DetailLabel>반려 사유</S.DetailLabel>
                                    <S.RejectReasonInput
                                        placeholder="반려 사유를 입력해주세요..."
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                        autoFocus
                                    />
                                </S.DetailSection>
                            )}
                        </S.ModalBody>

                        {/* 모달 하단 버튼 (PENDING 상태만) */}
                        {protestDetail.status === 'PENDING' && (
                            <S.ModalFooter>
                                <S.CancelButton onClick={handleCloseModal}>취소</S.CancelButton>
                                {showRejectInput ? (
                                    <S.RejectButton onClick={handleReject}>반려 확정</S.RejectButton>
                                ) : (
                                    <>
                                        <S.RejectButton onClick={handleShowRejectInput}>✕ 반려</S.RejectButton>
                                        <S.ApproveButton onClick={handleApprove}>✓ 승인</S.ApproveButton>
                                    </>
                                )}
                            </S.ModalFooter>
                        )}
                    </S.ModalContent>
                </S.ModalOverlay>
            )}

            {/* 파일 미리보기 모달 */}
            {showPreview && previewFile && (
                <S.PreviewModalOverlay onClick={handleClosePreview}>
                    <S.PreviewModalContent
                        onClick={(e) => e.stopPropagation()}
                        $fullWidth={getFileType(previewFile.fileName) === 'pdf'}
                        $fullHeight={getFileType(previewFile.fileName) === 'pdf'}
                    >
                        <S.PreviewHeader>
                            <S.PreviewTitle>{previewFile.fileOriName}</S.PreviewTitle>
                            <S.CloseButton onClick={handleClosePreview}>✕</S.CloseButton>
                        </S.PreviewHeader>
                        <S.PreviewBody>
                            {getFileType(previewFile.fileName) === 'image' && (
                                <S.PreviewImage
                                    src={`${api.defaults.baseURL}/api/file/preview/${previewFile.fileId}`}
                                    alt={previewFile.fileOriName}
                                />
                            )}
                            {getFileType(previewFile.fileName) === 'pdf' && (
                                <S.PreviewIframe
                                    src={`${api.defaults.baseURL}/api/file/preview/${previewFile.fileId}`}
                                    title={previewFile.fileOriName}
                                />
                            )}
                            {getFileType(previewFile.fileName) === 'other' && (
                                <S.PreviewMessage>
                                    이 파일 형식은 미리보기를 지원하지 않습니다.
                                </S.PreviewMessage>
                            )}
                        </S.PreviewBody>
                    </S.PreviewModalContent>
                </S.PreviewModalOverlay>
            )}
        </S.MainContentArea>
    );
};

export default ProtestApproval;
