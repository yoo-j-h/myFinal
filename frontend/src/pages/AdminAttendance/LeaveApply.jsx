import React, { useState } from 'react';
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
  QuotaCard,
  QuotaBadge,
  QuotaType,
  QuotaValue,
  QuotaDetail,
  HistoryCard,
  HistoryItem,
  HistoryType,
  HistoryDate,
  HistoryDuration,
  HistoryStatus,
} from './LeaveApply.styled';

const LeaveApply = () => {
  // TODO: Zustand state mapping
  // const { submitLeaveRequest, leaveStats } = useLeaveStore();
  
  const [selectedLeaveType, setSelectedLeaveType] = useState('annual');
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
  });

  // Mock data
  const leaveTypes = [
    { id: 'annual', name: '연차', icon: '☀️', count: '잔여 15일' },
    { id: 'half', name: '반차', icon: '🕐', count: '잔여 5회' },
  ];

  const remainingLeave = {
    total: 15,
    unit: '일',
    subtext: '2025년 기준',
    used: 5,
    unused: 10,
    usagePercentage: 33,
  };

  const quotas = [
    { type: '연차', value: '2명', detail: '7/20 - 7/21', badge: '승인' },
    { type: '반차', value: '2명', detail: '2025.11.15 오전 5시 18분', badge: '승인' },
    { type: '병가/외출', value: '1명', detail: '2025.10.02 - 2025.10.14 *근태 반영', badge: '승인' },
    { type: '무급', value: '1명', detail: '2025.12.26 - 2025.04.05 *근태 반영', badge: '승인' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.startDate || !formData.endDate) {
      alert('휴가 기간을 선택하세요');
      return;
    }

    if (!formData.reason.trim()) {
      alert('휴가 사유를 입력하세요');
      return;
    }

    // TODO: Implement with Zustand
    console.log('휴가 신청:', {
      type: selectedLeaveType,
      ...formData
    });
  };

  const handleCancel = () => {
    setFormData({
      startDate: '',
      endDate: '',
      reason: '',
    });
    setSelectedLeaveType('annual');
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
                      <LeaveTypeCount>{type.count}</LeaveTypeCount>
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
                <SubmitButton type="submit" onClick={handleSubmit}>
                  ✈️ 휴가 신청하기
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
                  <RemainingValue>{remainingLeave.total}</RemainingValue>
                  <RemainingUnit>{remainingLeave.unit}</RemainingUnit>
                </div>
                <RemainingSubtext>{remainingLeave.subtext}</RemainingSubtext>
              </RemainingStat>

              <UsageProgressBar>
                <ProgressLabel>
                  <span>사용 {remainingLeave.used}일</span>
                  <span>미사용 {remainingLeave.unused}일</span>
                </ProgressLabel>
                <ProgressBarContainer>
                  <ProgressBarFill $percentage={remainingLeave.usagePercentage} />
                </ProgressBarContainer>
                <ProgressPercentage>{remainingLeave.usagePercentage}%</ProgressPercentage>
              </UsageProgressBar>
            </RemainingLeaveCard>

            <HistoryCard>
            <SectionTitle>최근 신청 내역</SectionTitle>
            {quotas.slice(0, 2).map((item, index) => (
              <HistoryItem key={index}>
                <div>
                  <HistoryType $type={item.type}>
                    {item.type}
                  </HistoryType>
                  <HistoryDate>{item.detail}</HistoryDate>
                  <HistoryDuration>{item.value}</HistoryDuration>
                </div>
                <HistoryStatus $status="approved">
                  ✓ {item.badge}
                </HistoryStatus>
              </HistoryItem>
            ))}
          </HistoryCard>
        </RightColumn>
      </ContentGrid>
    </MainContentArea>
  );
};

export default LeaveApply;