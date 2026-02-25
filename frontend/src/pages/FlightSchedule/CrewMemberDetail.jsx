import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as S from "./CrewMemberDetail.styled";
import { empService } from "../../api/emp/services";

const CrewMemberDetail = () => {
  const { crewId } = useParams();
  const navigate = useNavigate();
  const [empDetail, setEmpDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("정보");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRole, setEditRole] = useState('');
  const [editJob, setEditJob] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (crewId) {
      loadEmpDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crewId]);

  const loadEmpDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await empService.getEmpDetail(crewId);
      const data = response.data?.data || response.data;
      setEmpDetail(data);
    } catch (error) {
      console.error('직원 상세 조회 실패:', error);
      setError('직원 정보를 불러오는데 실패했습니다.');
      alert('직원 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditModal = () => {
    if (empDetail) {
      setEditRole(empDetail.role || '');
      setEditJob(empDetail.job || '');
      setShowEditModal(true);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditRole('');
    setEditJob('');
  };

  const handleUpdateRoleAndJob = async () => {
    if (!editRole || !editJob) {
      alert('직급과 직책을 모두 입력해주세요.');
      return;
    }

    try {
      setIsUpdating(true);
      await empService.updateEmpRoleAndJob(crewId, editRole, editJob);
      alert('직급/직책이 성공적으로 수정되었습니다.');
      handleCloseEditModal();
      loadEmpDetail(); // 데이터 다시 로드
    } catch (error) {
      console.error('직급/직책 수정 실패:', error);
      const errorMessage = error.response?.data?.message || '직급/직책 수정에 실패했습니다.';
      alert(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  // 역할별 색상 및 아바타
  const getRoleStyle = (role) => {
    const styleMap = {
      'PILOT': { avatar: '👨‍✈️', bgColor: '#8b5cf6' },
      'CABIN_CREW': { avatar: '👩‍✈️', bgColor: '#10b981' },
      'MAINTENANCE': { avatar: '🔧', bgColor: '#3b82f6' },
      'GROUND_STAFF': { avatar: '👷', bgColor: '#f59e0b' }
    };
    return styleMap[role] || { avatar: '👤', bgColor: '#6b7280' };
  };

  // 역할 한글 변환
  const getRoleName = (role) => {
    const roleMap = {
      'PILOT': '조종사',
      'CABIN_CREW': '객실승무원',
      'MAINTENANCE': '정비사',
      'GROUND_STAFF': '지상직',
      'AIRLINE_ADMIN': '항공사 관리자',
      'ADMIN': '관리자',
      'SUPER_ADMIN': '최상위 관리자'
    };
    return roleMap[role] || role;
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 나이 계산 (생년월일이 없으므로 age 필드 사용)
  const getBirthDate = (age) => {
    if (!age) return '-';
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - age;
    return `${birthYear}-01-01`;
  };

  if (loading) {
    return (
      <S.PageContainer>
        <S.EmptyState>
          로딩 중...
        </S.EmptyState>
      </S.PageContainer>
    );
  }

  if (error || !empDetail) {
    return (
      <S.PageContainer>
        <S.ErrorState>
          {error || '직원 정보를 찾을 수 없습니다.'}
        </S.ErrorState>
      </S.PageContainer>
    );
  }

  const roleStyle = getRoleStyle(empDetail.role);
  const crewMember = {
    name: empDetail.empName || '-',
    avatar: empDetail.empName ? empDetail.empName.charAt(0) : '?',
    bgColor: roleStyle.bgColor,
    employeeId: empDetail.empNo || '-',
    birthDate: getBirthDate(empDetail.age),
    position: getRoleName(empDetail.role) || '-',
    rank: empDetail.job || '-',
    phoneNumber: empDetail.phone || '-',
    email: empDetail.email || '-',
    address: empDetail.address || '-',
    status: empDetail.empStatus === 'ACTIVE' ? '근무 가능' : '근무 불가',
    startDate: formatDate(empDetail.startDate),
  };

  const leaveHistory = [
    {
      id: 1,
      type: "연차",
      status: "신청 승인됨",
      startDate: "2026-01-10",
      duration: "3일",
      reason: "비행 후 휴식을 위해요! 휴가가 아주 만족스러워요!",
      date: "2025-01-10",
    },
    {
      id: 2,
      type: "연차",
      status: "신청 승인됨",
      startDate: "2026-01-10",
      duration: "3일",
      reason: "비행 후 휴식을 위해요! 휴가가 만족스러워요!",
      date: "2025-01-10",
    },
  ];

  return (
    <S.PageContainer>
      {/* ✅ 컨텐츠 헤더만 (탑바/사이드바는 MainLayout이 담당) */}
      <S.PageHeader>
        <S.HeaderLeft>
          <S.BackButton type="button" onClick={() => navigate(-1)}>←</S.BackButton>

          <div>
            <S.PageTitle>직원 상세 정보</S.PageTitle>
            <S.PageSubtitle>직원 정보 관리</S.PageSubtitle>
          </div>
        </S.HeaderLeft>
      </S.PageHeader>

      {/* Employee Profile Card */}
      <S.ProfileCard>
        <S.ProfileHeader>
          <S.ProfileLeft>
            {/* ✅ bgColor -> $bgColor (DOM prop 새는거 방지) */}
            <S.ProfileAvatar $bgColor={crewMember.bgColor}>
              {crewMember.avatar}
            </S.ProfileAvatar>

            <S.ProfileInfo>
              <S.ProfileName>{crewMember.name}</S.ProfileName>
              <S.ProfileMetadata>
                <S.MetadataItem>
                  <S.MetadataLabel>직급</S.MetadataLabel>
                  <S.MetadataValue>{crewMember.position}</S.MetadataValue>
                </S.MetadataItem>
                <S.MetadataDivider>|</S.MetadataDivider>
                <S.MetadataItem>
                  <S.MetadataLabel>직책</S.MetadataLabel>
                  <S.MetadataValue>{crewMember.rank}</S.MetadataValue>
                </S.MetadataItem>
              </S.ProfileMetadata>
            </S.ProfileInfo>
          </S.ProfileLeft>

          <S.ProfileRight>
            <S.EditButton type="button" onClick={handleOpenEditModal}>✏️ 정보 수정</S.EditButton>
          </S.ProfileRight>
        </S.ProfileHeader>

        <S.ProfileDetails>
          <S.DetailRow>
            <S.DetailItem>
              <S.DetailLabel>사원번호</S.DetailLabel>
              <S.DetailValue>{crewMember.employeeId}</S.DetailValue>
            </S.DetailItem>

            <S.DetailItem>
              <S.DetailLabel>입사일</S.DetailLabel>
              <S.DetailValue>{crewMember.startDate}</S.DetailValue>
            </S.DetailItem>

            <S.DetailItem>
              <S.DetailLabel>상태</S.DetailLabel>
              {/* ✅ status -> $status */}
              <S.StatusBadge $status={crewMember.status}>
                {crewMember.status}
              </S.StatusBadge>
            </S.DetailItem>
          </S.DetailRow>

          <S.DetailRow>
            <S.DetailItem>
              <S.DetailLabel>이메일</S.DetailLabel>
              <S.DetailValue>{crewMember.email}</S.DetailValue>
            </S.DetailItem>

            <S.DetailItem>
              <S.DetailLabel>연락처</S.DetailLabel>
              <S.DetailValue>{crewMember.phoneNumber}</S.DetailValue>
            </S.DetailItem>

            <S.DetailItem>
              <S.DetailLabel>주소</S.DetailLabel>
              <S.DetailValue>{crewMember.address}</S.DetailValue>
            </S.DetailItem>
          </S.DetailRow>
        </S.ProfileDetails>
      </S.ProfileCard>

      {/* Tabs Navigation */}
      <S.TabsContainer>
        {/* ✅ active -> $active */}
        <S.TabButton
          type="button"
          $active={activeTab === "정보"}
          onClick={() => setActiveTab("정보")}
        >
          정보
        </S.TabButton>
      </S.TabsContainer>

      {/* Leave History Section */}
      <S.HistorySection>
        {leaveHistory.map((leave) => (
          <S.LeaveCard key={leave.id}>
            <S.LeaveHeader>
              <S.LeaveIcon>📋</S.LeaveIcon>
              <S.LeaveTitle>{leave.type}</S.LeaveTitle>
              <S.LeaveDate>{leave.date}</S.LeaveDate>
            </S.LeaveHeader>

            <S.LeaveDetails>
              <S.LeaveDetailRow>
                <S.LeaveDetailItem>
                  <S.LeaveDetailLabel>유형</S.LeaveDetailLabel>
                  <S.LeaveDetailValue>{leave.type}</S.LeaveDetailValue>
                </S.LeaveDetailItem>

                <S.LeaveDetailItem>
                  <S.LeaveDetailLabel>상태</S.LeaveDetailLabel>
                  <S.LeaveStatusBadge>{leave.status}</S.LeaveStatusBadge>
                </S.LeaveDetailItem>

                <S.LeaveDetailItem>
                  <S.LeaveDetailLabel>일시</S.LeaveDetailLabel>
                  <S.LeaveDetailValue>{leave.startDate}</S.LeaveDetailValue>
                </S.LeaveDetailItem>

                <S.LeaveDetailItem>
                  <S.LeaveDetailLabel>근무일</S.LeaveDetailLabel>
                  <S.LeaveDurationBadge>{leave.duration}</S.LeaveDurationBadge>
                </S.LeaveDetailItem>
              </S.LeaveDetailRow>

              <S.LeaveReason>
                <S.LeaveReasonLabel>비고</S.LeaveReasonLabel>
                <S.LeaveReasonText>{leave.reason}</S.LeaveReasonText>
              </S.LeaveReason>
            </S.LeaveDetails>
          </S.LeaveCard>
        ))}
      </S.HistorySection>

      {/* 정보 수정 모달 */}
      {showEditModal && (
        <S.ModalOverlay onClick={handleCloseEditModal}>
          <S.ModalContainer onClick={(e) => e.stopPropagation()}>
            <S.ModalHeader>
              <S.ModalTitle>직급/직책 수정</S.ModalTitle>
              <S.CloseButton onClick={handleCloseEditModal}>×</S.CloseButton>
            </S.ModalHeader>
            <S.ModalContent>
              <S.FormGroup>
                <S.FormLabel>직급 *</S.FormLabel>
                <S.FormSelect
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                >
                  <option value="">직급을 선택하세요</option>
                  <option value="PILOT">조종사</option>
                  <option value="CABIN_CREW">객실승무원</option>
                  <option value="MAINTENANCE">정비사</option>
                  <option value="GROUND_STAFF">지상직</option>
                  <option value="AIRLINE_ADMIN">항공사 관리자</option>
                  <option value="ADMIN">관리자</option>
                  <option value="SUPER_ADMIN">최상위 관리자</option>
                </S.FormSelect>
              </S.FormGroup>
              <S.FormGroup>
                <S.FormLabel>직책 *</S.FormLabel>
                <S.FormInput
                  type="text"
                  value={editJob}
                  onChange={(e) => setEditJob(e.target.value)}
                  placeholder="직책을 입력하세요"
                  maxLength={50}
                />
              </S.FormGroup>
            </S.ModalContent>
            <S.FormActions>
              <S.CancelButton onClick={handleCloseEditModal} disabled={isUpdating}>
                취소
              </S.CancelButton>
              <S.SubmitButton onClick={handleUpdateRoleAndJob} disabled={isUpdating || !editRole || !editJob}>
                {isUpdating ? '수정 중...' : '수정'}
              </S.SubmitButton>
            </S.FormActions>
          </S.ModalContainer>
        </S.ModalOverlay>
      )}
    </S.PageContainer>
  );
};

export default CrewMemberDetail;
