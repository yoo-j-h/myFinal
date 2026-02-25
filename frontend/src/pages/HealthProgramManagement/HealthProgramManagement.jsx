import React, { useState, useEffect } from 'react';
import healthService from '../../api/Health/healthService';
import { empService } from '../../api/emp/empService';
import {
  MainContainer,
  ContentWrapper,
  PageHeader,
  HeaderBadge,
  PageTitle,
  PageSubtitle,
  ActionBar,
  ActionButton,
  FilterButton,
  SortButton,
  SearchBar,
  SearchIcon,
  SearchInput,
  ProgramList,
  ProgramCard,
  ProgramHeader,
  ParticipantAvatar,
  ParticipantInfo,
  ParticipantName,
  ParticipantId,
  ParticipantDepartment,
  StatusBadge,
  ProgramContent,
  SectionLabel,
  ProgramDescription,
  StatsGrid,
  StatItem,
  StatValue,
  StatLabel,
  CardFooter,
  FooterDate,
  CardActions,
  RejectButton,
  ApproveButton,
  EmptyState,
  EmptyIcon,
  EmptyText,
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ModalSection,
  ModalLabel,
  ModalValue,
  InputTextarea,
  SelectBox,
  ModalFooter,
  ModalActionButton,
  ActionGroup,
  FilterGroup,
  FilterSelect,
  HeaderContent,
  ParticipantDetail,
  ProgramTitleText,
  ProgramDateText
} from './HealthProgramManagement.styled';

const HealthProgramManagement = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filters
  const [statusFilter, setStatusFilter] = useState(''); // 'PENDING', 'APPROVED', 'REJECTED'
  const [programFilter, setProgramFilter] = useState('');

  // Modal State
  const [selectedApply, setSelectedApply] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('detail'); // detail, approve, reject

  // Action State
  const [managerId, setManagerId] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  // Filters
  const [managers, setManagers] = useState([]);



  // NOTE: 상단 import axios from '../../api/axios' 가 없어서 추가해야 함.
  // 하지만 view_file 결과 최상단을 보면 `import healthService`만 있음.
  // 그러므로 `api/Health/healthService.js`에 `getManagerCandidates`를 추가하거나,
  // `api/emp/empService.js`를 import해야함.
  // `api/emp/empService.js`를 import하는게 좋음.
  // 이번 tool call에서는 `managers` state 초기화만 변경하고, 다음 tool call에서 import 추가 및 로직 구현.

  // Mock Managers 제거하고 State로 변경
  /* 원래 코드
  const managers = [
    { id: 'EMP-001', name: '김관리 (인사팀)' },
     ...
  ];
  */

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      // API call with params
      const params = {};
      if (statusFilter && statusFilter !== 'ALL') params.status = statusFilter;
      if (programFilter && programFilter !== 'ALL') params.programName = programFilter; // 부분 일치 검색용

      const res = await healthService.getAdminApplyList(params);
      // 데이터 가공 (필요시)
      // res.data -> List<ApplyDetailResponse>
      // Snake_case to CamelCase mapping
      const mappedData = res.data.map(item => ({
        programApplyId: item.program_apply_id,
        empName: item.emp_name,
        empNo: item.emp_no,
        departmentName: item.department_name,
        programName: item.program_name,
        applyReason: item.apply_reason,
        applyDate: item.apply_date,
        status: item.status,
        startDate: item.start_date,
        endDate: item.end_date,
        managerName: item.manager_name,
        rejectReason: item.reject_reason
      }));
      setPrograms(mappedData);
    } catch (error) {
      console.error("목록 조회 실패:", error);
      alert("데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
    fetchManagers();
  }, [statusFilter, programFilter]); // 필터 변경 시 자동 재조회, Manager은 1회 조회로 충분하지만 여기서 같이 호출해도 무방

  // ... (다른 함수들)

  const fetchManagers = async () => {
    try {
      const res = await empService.getManagerCandidates();
      if (res.data && res.data.success) {
        // API returns list of EmpDto
        // Map to { id, name } format expected by UI
        const mappedManagers = res.data.data.map(emp => ({
          id: emp.empId,
          name: `${emp.empName} (${emp.departmentName || '소속미정'})`
        }));
        setManagers(mappedManagers);
      }
    } catch (error) {
      console.error("담당자 목록 조회 실패:", error);
    }
  };

  const handleCardClick = (program) => {
    setSelectedApply(program);
    setModalMode('detail');
    setManagerId('');
    setRejectReason('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedApply(null);
  };

  const handleApproveClick = () => {
    setModalMode('approve');
    // 기본 담당자 선택 (첫번째)
    if (managers.length > 0) setManagerId(managers[0].id);
  };

  const handleRejectClick = () => {
    setModalMode('reject');
  };

  const submitApprove = async () => {
    if (!managerId) return alert("담당자를 선택해주세요.");
    try {
      await healthService.approveApply({
        programApplyId: selectedApply.programApplyId,
        managerId: managerId
      });
      alert("승인 처리되었습니다.");
      closeModal();
      fetchPrograms(); // 목록 갱신
    } catch (error) {
      console.error("승인 실패:", error);
      alert("승인 처리에 실패했습니다.");
    }
  };

  const submitReject = async () => {
    if (!rejectReason.trim()) return alert("반려 사유를 입력해주세요.");
    try {
      await healthService.rejectApply({
        programApplyId: selectedApply.programApplyId,
        reason: rejectReason
      });
      alert("반려 처리되었습니다.");
      closeModal();
      fetchPrograms(); // 목록 갱신
    } catch (error) {
      console.error("반려 실패:", error);
      alert("반려 처리에 실패했습니다.");
    }
  };

  // 필터링
  const filteredPrograms = programs.filter(program =>
    (program.empName && program.empName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (program.empNo && program.empNo.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'default'; // 회색
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING': return '승인 대기';
      case 'APPROVED': return '승인 완료';
      case 'REJECTED': return '반려됨';
      default: return status;
    }
  };

  return (
    <MainContainer>
      <ContentWrapper>
        <PageHeader>
          <div>
            <HeaderBadge>✈️ 관리자 모드</HeaderBadge>
            <PageTitle>건강 프로그램 관리</PageTitle>
            <PageSubtitle>직원들의 건강 프로그램 신청을 관리하고 승인 처리합니다</PageSubtitle>
          </div>
        </PageHeader>

        <ActionBar>
          <ActionGroup>
            <ActionButton $active>📋 전체 내역</ActionButton>

            {/* 필터 영역 */}
            <FilterGroup>
              <FilterSelect
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ width: '120px' }}
              >
                <option value="">전체 상태</option>
                <option value="PENDING">승인 대기</option>
                <option value="APPROVED">승인 완료</option>
                <option value="REJECTED">반려됨</option>
              </FilterSelect>

              <FilterSelect
                value={programFilter}
                onChange={(e) => setProgramFilter(e.target.value)}
                style={{ width: '150px' }}
              >
                <option value="">전체 프로그램</option>
                <option value="심리">심리 상담</option>
                <option value="운동">체력 증진 운동</option>
                <option value="휴식">집중 휴식</option>
              </FilterSelect>
            </FilterGroup>
          </ActionGroup>
          <SearchBar>
            <SearchIcon>🔍</SearchIcon>
            <SearchInput
              type="text"
              placeholder="이름, 사번 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBar>
          <SortButton onClick={fetchPrograms}>🔄 새로고침</SortButton>
        </ActionBar>

        {loading ? (
          <EmptyState><EmptyText>로딩 중...</EmptyText></EmptyState>
        ) : filteredPrograms.length > 0 ? (
          <ProgramList>
            {filteredPrograms.map((program) => (
              <ProgramCard key={program.programApplyId} onClick={() => handleCardClick(program)}>
                <ProgramHeader>
                  <HeaderContent>
                    <ParticipantAvatar>{program.empName ? program.empName[0] : '?'}</ParticipantAvatar>
                    <ParticipantInfo>
                      <ParticipantDetail>
                        <ParticipantName>{program.empName}</ParticipantName>
                        <ParticipantId>({program.empNo})</ParticipantId>
                      </ParticipantDetail>
                      <ParticipantDepartment>{program.departmentName}</ParticipantDepartment>
                    </ParticipantInfo>
                  </HeaderContent>
                  <StatusBadge $statusType={getStatusColor(program.status)}>
                    {getStatusText(program.status)}
                  </StatusBadge>
                </ProgramHeader>

                <ProgramContent>
                  <SectionLabel>신청 프로그램</SectionLabel>
                  <ProgramDescription>
                    <strong>[{program.programName}]</strong> {program.applyReason}
                  </ProgramDescription>
                </ProgramContent>

                <CardFooter>
                  <FooterDate>📅 신청일: {new Date(program.applyDate).toLocaleDateString()}</FooterDate>
                  {/* 카드 내부 버튼은 제거하고 클릭 시 상세 모달에서 처리하도록 유도 */}
                </CardFooter>
              </ProgramCard>
            ))}
          </ProgramList>
        ) : (
          <EmptyState>
            <EmptyIcon>🔍</EmptyIcon>
            <EmptyText>검색 결과가 없습니다.</EmptyText>
          </EmptyState>
        )}

        {/* Modal */}
        {isModalOpen && selectedApply && (
          <ModalOverlay onClick={closeModal}>
            <ModalContainer onClick={e => e.stopPropagation()}>
              <ModalHeader>
                <ModalTitle>
                  {modalMode === 'detail' && '신청 상세 정보'}
                  {modalMode === 'approve' && '담당자 배정 및 승인'}
                  {modalMode === 'reject' && '반려 사유 입력'}
                </ModalTitle>
                <ModalCloseButton onClick={closeModal}>&times;</ModalCloseButton>
              </ModalHeader>

              <ModalBody>
                {/* 공통 정보 (항상 표시하거나 Detail 모드일 때만?) -> 항상 표시하면 좋음 */}
                <ModalSection>
                  <ModalLabel>신청자 정보</ModalLabel>
                  <ModalValue $grid>
                    <span>이름: {selectedApply.empName}</span>
                    <span>사번: {selectedApply.empNo}</span>
                    <span>부서: {selectedApply.departmentName}</span>
                    <span>신청일: {new Date(selectedApply.applyDate).toLocaleDateString()}</span>
                  </ModalValue>
                </ModalSection>

                <ModalSection>
                  <ModalLabel>신청 내용</ModalLabel>
                  <ModalValue $isBox>
                    <ProgramTitleText>[{selectedApply.programName}]</ProgramTitleText>
                    {selectedApply.applyReason}
                    {selectedApply.startDate && (
                      <ProgramDateText>
                        희망 기간: {new Date(selectedApply.startDate).toLocaleDateString()} ~ {new Date(selectedApply.endDate).toLocaleDateString()}
                      </ProgramDateText>
                    )}
                  </ModalValue>
                </ModalSection>

                {/* Approve Mode UI */}
                {modalMode === 'approve' && (
                  <ModalSection>
                    <ModalLabel>담당자 선택</ModalLabel>
                    <SelectBox value={managerId} onChange={(e) => setManagerId(e.target.value)}>
                      {managers.map(mgr => (
                        <option key={mgr.id} value={mgr.id}>{mgr.name}</option>
                      ))}
                    </SelectBox>
                  </ModalSection>
                )}

                {/* Reject Mode UI */}
                {modalMode === 'reject' && (
                  <ModalSection>
                    <ModalLabel>반려 사유</ModalLabel>
                    <InputTextarea
                      placeholder="반려 사유를 상세히 입력해주세요."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                  </ModalSection>
                )}

                {/* 결과 표시 (이미 처리된 건) */}
                {selectedApply.status === 'APPROVED' && modalMode === 'detail' && (
                  <ModalSection>
                    <ModalLabel>승인 정보</ModalLabel>
                    <ModalValue $isBox>
                      담당자: {selectedApply.managerName || '배정되지 않음'}
                    </ModalValue>
                  </ModalSection>
                )}
                {selectedApply.status === 'REJECTED' && modalMode === 'detail' && (
                  <ModalSection>
                    <ModalLabel>반려 사유</ModalLabel>
                    <ModalValue $isBox $isError>
                      {selectedApply.rejectReason}
                    </ModalValue>
                  </ModalSection>
                )}

              </ModalBody>

              <ModalFooter>
                {modalMode === 'detail' ? (
                  <>
                    {/* 대기 상태일 때만 승인/반려 버튼 표시 */}
                    {selectedApply.status === 'PENDING' && (
                      <>
                        <ModalActionButton $variant="danger" onClick={handleRejectClick}>반려</ModalActionButton>
                        <ModalActionButton $variant="primary" onClick={handleApproveClick}>승인</ModalActionButton>
                      </>
                    )}
                    <ModalActionButton $variant="secondary" onClick={closeModal}>닫기</ModalActionButton>
                  </>
                ) : (
                  <>
                    {/* Action Mode */}
                    <ModalActionButton $variant="secondary" onClick={() => setModalMode('detail')}>취소</ModalActionButton>
                    {modalMode === 'approve' && (
                      <ModalActionButton $variant="primary" onClick={submitApprove}>승인 확정</ModalActionButton>
                    )}
                    {modalMode === 'reject' && (
                      <ModalActionButton $variant="danger" onClick={submitReject}>반려 확정</ModalActionButton>
                    )}
                  </>
                )}
              </ModalFooter>
            </ModalContainer>
          </ModalOverlay>
        )}
      </ContentWrapper>
    </MainContainer>
  );
};

export default HealthProgramManagement;