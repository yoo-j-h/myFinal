import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { leaveApi } from '../../api/leaveApi';
import SuccessModal from '../../components/SuccessModal';
import {
  MainContentArea,
  PageHeader,
  PageTitle,
  PageDescription,
  ContentGrid,
  LeftColumn,
  RightColumn,
  SectionCard,
  SectionTitle,
  LeaveTypeSelector,
  LeaveTypeButton,
  LeaveTypeIcon,
  LeaveTypeName,
  LeaveTypeCount,
  DateRangeSection,
  DateInputGroup,
  DateLabel,
  DateInput,
  ReasonSection,
  ReasonLabel,
  ReasonTextarea,
  InfoBox,
  InfoTitle,
  InfoList,
  InfoItem,
  ActionButtons,
  CancelButton,
  SubmitButton,
  RemainingLeaveCard,
  RemainingStat,
  RemainingLabel,
  RemainingValue,
  RemainingUnit,
  RemainingSubtext,
  UsageProgressBar,
  ProgressLabel,
  ProgressBarContainer,
  ProgressBarFill,
  ProgressPercentage,
  HistoryCard,
  HistoryItem,
  HistoryType,
  HistoryDate,
  HistoryDuration,
  HistoryStatus,
} from './LeaveApply.styled';

const LeaveApply = () => {
  const navigate = useNavigate();
  const getEmpId = useAuthStore((state) => state.getEmpId);
  const empId = getEmpId();

  const [selectedLeaveType, setSelectedLeaveType] = useState('ANNUAL');
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [remainingLeave, setRemainingLeave] = useState(null);
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // 휴가 종류 목록
  const leaveTypes = [
    { id: 'ANNUAL', name: '연차', icon: '☀️' },
    { id: 'HALF_DAY', name: '반차', icon: '🕐' },
    { id: 'SICK', name: '병가', icon: '🏥' },
    { id: 'UNPAID', name: '무급휴가', icon: '💼' },
  ];

  // 최소 신청 가능 날짜 계산 (오늘 + 3일)
  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 3);
    return today.toISOString().split('T')[0];
  };

  // 데이터 로드 (페이지 진입 시마다 최신 데이터 로드)
  useEffect(() => {
    loadLeaveData();
  }, []); // empId가 변경되어도 다시 로드

  const loadLeaveData = async () => {
    try {
      const [remaining, list] = await Promise.all([
        leaveApi.getRemainingLeave(empId),
        leaveApi.getMyLeaveList(empId)
      ]);

      setRemainingLeave(remaining);
      setRecentLeaves(list.slice(0, 5));
    } catch (error) {
      console.error('데이터 로드 실패:', error);
      alert('데이터를 불러오는데 실패했습니다');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!formData.startDate || !formData.endDate) {
      alert('휴가 기간을 선택하세요');
      return;
    }

    if (!formData.reason.trim()) {
      alert('휴가 사유를 입력하세요');
      return;
    }

    // 3일 전 신청 규칙 확인
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + 3);
    const startDate = new Date(formData.startDate);

    if (startDate < minDate) {
      alert('휴가는 최소 3일 전에 신청 가능합니다.');
      return;
    }

    setLoading(true);

    try {
      const requestData = {
        leaveType: selectedLeaveType,
        startDate: formData.startDate + 'T00:00:00',
        endDate: formData.endDate + 'T23:59:59',
        reason: formData.reason
      };

      await leaveApi.applyLeave(empId, requestData);

      // 성공 모달 표시
      setShowSuccessModal(true);

      // 폼 초기화
      handleCancel();

      // 데이터 새로고침
      loadLeaveData();
    } catch (error) {
      console.error('휴가 신청 실패:', error);

      // 서버 에러 메시지 파싱
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        '휴가 신청에 실패했습니다';

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      startDate: '',
      endDate: '',
      reason: '',
    });
    setSelectedLeaveType('ANNUAL');
  };

  // 성공 모달 확인 버튼 클릭 시 근태 현황 페이지로 이동
  const handleModalConfirm = () => {
    setShowSuccessModal(false);
    navigate('/my-attendance');
  };

  // 상태 텍스트 변환
  const getStatusText = (status) => {
    const statusMap = {
      'PENDING': '대기중',
      'APPROVED': '승인',
      'REJECTED': '반려'
    };
    return statusMap[status] || status;
  };

  // 휴가 종류 텍스트 변환
  const getLeaveTypeText = (type) => {
    const typeMap = {
      'ANNUAL': '연차',
      'HALF_DAY': '반차',
      'SICK': '병가',
      'UNPAID': '무급'
    };
    return typeMap[type] || type;
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <MainContentArea>
      <PageHeader>
        <div>
          <PageTitle>휴가 신청</PageTitle>
          <PageDescription>
            원하는 휴가 유형을 선택한 후 신청을 제출하세요
          </PageDescription>
        </div>
      </PageHeader>

      <ContentGrid>
        {/* 왼쪽: 신청 폼 */}
        <LeftColumn>
          <SectionCard>
            <SectionTitle>휴가 유형 선택</SectionTitle>
            <LeaveTypeSelector>
              {leaveTypes.map((type) => (
                <LeaveTypeButton
                  key={type.id}
                  $active={selectedLeaveType === type.id}
                  onClick={() => setSelectedLeaveType(type.id)}
                >
                  <LeaveTypeIcon>{type.icon}</LeaveTypeIcon>
                  <div>
                    <LeaveTypeName>{type.name}</LeaveTypeName>
                    <LeaveTypeCount>
                      {remainingLeave ?
                        `잔여 ${remainingLeave.remainingLeave}일` :
                        '로딩 중...'}
                    </LeaveTypeCount>
                  </div>
                </LeaveTypeButton>
              ))}
            </LeaveTypeSelector>
          </SectionCard>

          <SectionCard>
            <SectionTitle>신청 일정</SectionTitle>
            <DateRangeSection>
              <DateInputGroup>
                <DateLabel>시작일 *</DateLabel>
                <DateInput
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  min={getMinDate()}
                  required
                />
              </DateInputGroup>
              <DateInputGroup>
                <DateLabel>종료일 *</DateLabel>
                <DateInput
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  min={formData.startDate || getMinDate()}
                  required
                />
              </DateInputGroup>
            </DateRangeSection>
          </SectionCard>

          <SectionCard>
            <ReasonSection>
              <ReasonLabel>휴가 사유 *</ReasonLabel>
              <ReasonTextarea
                name="reason"
                placeholder="휴가 사유를 상세히 입력하세요"
                value={formData.reason}
                onChange={handleInputChange}
                rows={5}
                required
              />
            </ReasonSection>

            <InfoBox>
              <InfoTitle>ℹ️ 휴가 신청 시 유의사항</InfoTitle>
              <InfoList>
                <InfoItem>• 휴가는 최소 3일 전에 신청해 주세요</InfoItem>
                <InfoItem>• 대체 수행자가 없는 업무 시작일을 반드시 입력해주세요</InfoItem>
                <InfoItem>• 연차는 근로기준법에 따라 자동으로 계산됩니다</InfoItem>
              </InfoList>
            </InfoBox>

            <ActionButtons>
              <CancelButton type="button" onClick={handleCancel}>
                취소
              </CancelButton>
              <SubmitButton
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? '신청 중...' : '✈️ 휴가 신청하기'}
              </SubmitButton>
            </ActionButtons>
          </SectionCard>
        </LeftColumn>

        {/* 오른쪽: 잔여 현황 */}
        <RightColumn>
          <RemainingLeaveCard>
            <RemainingStat>
              <RemainingLabel>잔여 휴가</RemainingLabel>
              <div>
                <RemainingValue>
                  {remainingLeave ? remainingLeave.remainingLeave : '-'}
                </RemainingValue>
                <RemainingUnit>일</RemainingUnit>
              </div>
              <RemainingSubtext>2026년 기준</RemainingSubtext>
            </RemainingStat>

            {remainingLeave && (
              <UsageProgressBar>
                <ProgressLabel>
                  <span>사용 {remainingLeave.usedLeave}일</span>
                  <span>미사용 {remainingLeave.remainingLeave}일</span>
                </ProgressLabel>
                <ProgressBarContainer>
                  <ProgressBarFill $percentage={remainingLeave.usagePercentage} />
                </ProgressBarContainer>
                <ProgressPercentage>{remainingLeave.usagePercentage}%</ProgressPercentage>
              </UsageProgressBar>
            )}
          </RemainingLeaveCard>

          <HistoryCard>
            <SectionTitle>최근 신청 내역</SectionTitle>
            {recentLeaves.length > 0 ? (
              recentLeaves.map((item) => (
                <HistoryItem key={item.leaveApplyId}>
                  <div>
                    <HistoryType $type={item.leaveType}>
                      {getLeaveTypeText(item.leaveType)}
                    </HistoryType>
                    <HistoryDate>
                      {formatDate(item.startDate)} ~ {formatDate(item.endDate)}
                    </HistoryDate>
                    <HistoryDuration>{item.leaveDays}일</HistoryDuration>
                  </div>
                  <HistoryStatus $status={item.status.toLowerCase()}>
                    {item.status === 'APPROVED' && '✓ '}
                    {item.status === 'REJECTED' && '✗ '}
                    {getStatusText(item.status)}
                  </HistoryStatus>
                </HistoryItem>
              ))
            ) : (
              <InfoItem>신청 내역이 없습니다</InfoItem>
            )}
          </HistoryCard>
        </RightColumn>
      </ContentGrid>

      {/* 성공 모달 */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onConfirm={handleModalConfirm}
        title="휴가 신청 완료"
        message="휴가 신청이 성공적으로 완료되었습니다. 근태 현황 페이지에서 신청 내역을 확인하실 수 있습니다."
      />
    </MainContentArea>
  );
};

export default LeaveApply;