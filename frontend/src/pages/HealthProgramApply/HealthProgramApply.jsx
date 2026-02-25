import React, { useEffect, useMemo, useState } from 'react';
import useAuthStore from '../../store/authStore';
import healthService from '../../api/Health/healthService';
import {
  PageLayout,
  MainContentArea,
  PageHeader,
  PageTitle,
  PageDescription,
  ContentGrid,
  LeftColumn,
  RightColumn,
  SectionCard,
  SectionTitle,
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
  HistoryCard,
  HistoryItem,
  HistoryType,
  HistoryDate,
  HistoryDuration,
  HistoryStatus,
  SelectGroup,
  SelectLabel,
  SelectBox,
  SelectHint,
  EmptyHistory,
} from './HealthProgramApply.styled';

const HealthProgramApply = () => {
  const { getEmpId } = useAuthStore();
  const empId = getEmpId();

  const [selectedProgramType, setSelectedProgramType] = useState('counseling');
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
  });

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const programTypes = useMemo(
    () => [
      { id: 'counseling', name: '상담', icon: '🧑‍⚕️', desc: '스트레스 · 심리 · 수면 상담' },
      { id: 'exercise', name: '운동', icon: '🏃‍♀️', desc: '체력 회복 및 운동 관리' },
      { id: 'rest', name: '휴식', icon: '🛌', desc: '컨디션 회복 및 휴식' },
    ],
    []
  );

  const placeholderMap = useMemo(
    () => ({
      counseling: '상담받고 싶은 내용(업무/스트레스/수면 등)을 적어주세요.',
      exercise: '운동 목표(체력/근력/유산소)와 현재 컨디션을 적어주세요.',
      rest: '휴식이 필요한 사유와 희망 일정(회복 목적)을 적어주세요.',
    }),
    []
  );

  // 신청 내역 조회
  const fetchHistory = async () => {
    if (!empId) return;
    try {
      const res = await healthService.getMyResult(empId);
      setHistory(res.data);
    } catch (error) {
      console.error('내역 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [empId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!empId) return alert('로그인 정보가 없습니다.');
    if (!selectedProgramType) return alert('프로그램 유형을 선택하세요');
    if (!formData.startDate || !formData.endDate) return alert('프로그램 기간을 선택하세요');

    // [VALIDATION] 3일 전 예약 필수 체크
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 시간 초기화

    const targetDate = new Date(formData.startDate);
    targetDate.setHours(0, 0, 0, 0);

    // 차이 일수 계산 (밀리초 -> 일)
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 3) {
      return alert('프로그램은 시작일 기준 최소 3일 전에만 신청 가능합니다.\n(오늘 + 3일 이후 날짜를 선택해주세요)');
    }

    if (!formData.reason.trim()) return alert('신청 사유를 입력하세요');

    try {
      setLoading(true);
      // DTO format matches: "2026-02-10T00:00:00"
      const payload = {
        programCode: selectedProgramType,
        startDate: `${formData.startDate}T00:00:00`,
        endDate: `${formData.endDate}T23:59:59`, // End of day for logic correctness
        reason: formData.reason,
      };

      await healthService.applyProgram(empId, payload);
      alert('신청이 완료되었습니다.');

      // 초기화 및 목록 갱신
      handleCancel();
      fetchHistory();

    } catch (error) {
      console.error('신청 실패:', error);
      alert('신청 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ startDate: '', endDate: '', reason: '' });
    setSelectedProgramType('counseling');
  };

  // 날짜 포맷팅 (YYYY.MM.DD)
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return dateStr.split('T')[0].replaceAll('-', '.');
  };

  return (
    <PageLayout>
      <MainContentArea>
        <PageHeader>
          <div>
            <PageTitle>건강관리 프로그램 신청</PageTitle>
            <PageDescription>원하는 프로그램 유형을 선택한 후 신청을 제출하세요</PageDescription>
          </div>
        </PageHeader>

        <ContentGrid>
          {/* 왼쪽: 신청 폼 */}
          <LeftColumn>
            <SectionCard>
              <SectionTitle>프로그램 유형 선택</SectionTitle>

              <SelectGroup>
                <SelectLabel htmlFor="programType">프로그램 유형 *</SelectLabel>

                <SelectBox
                  id="programType"
                  value={selectedProgramType}
                  onChange={(e) => setSelectedProgramType(e.target.value)}
                >
                  {programTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.icon} {type.name} · {type.desc}
                    </option>
                  ))}
                </SelectBox>

                <SelectHint>상담 / 운동 / 휴식 중 하나를 선택하세요</SelectHint>
              </SelectGroup>
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
                <ReasonLabel>신청 사유 *</ReasonLabel>
                <ReasonTextarea
                  name="reason"
                  placeholder={
                    placeholderMap[selectedProgramType] ||
                    '프로그램 신청 사유를 상세히 입력하세요'
                  }
                  value={formData.reason}
                  onChange={handleInputChange}
                  rows={5}
                  required
                />
              </ReasonSection>

              <InfoBox>
                <InfoTitle>ℹ️ 신청 시 유의사항</InfoTitle>
                <InfoList>
                  <InfoItem>• 프로그램은 최소 3일 전에 신청해 주세요</InfoItem>
                  <InfoItem>• 일정 확정 후 변경이 제한될 수 있어요</InfoItem>
                  <InfoItem>• 승인 완료 시 알림으로 안내됩니다</InfoItem>
                </InfoList>
              </InfoBox>

              <ActionButtons>
                <CancelButton type="button" onClick={handleCancel}>
                  취소
                </CancelButton>
                <SubmitButton type="submit" onClick={handleSubmit} disabled={loading}>
                  {loading ? '신청 중...' : '💙 프로그램 신청하기'}
                </SubmitButton>
              </ActionButtons>
            </SectionCard>
          </LeftColumn>

          {/* 오른쪽: 최근 신청 내역 */}
          <RightColumn>
            <HistoryCard>
              <SectionTitle>최근 신청 내역</SectionTitle>

              {history.length === 0 ? (
                <EmptyHistory>
                  신청 내역이 없습니다.
                </EmptyHistory>
              ) : (
                history.map((item) => (
                  <HistoryItem key={item.program_apply_id}>
                    <div>
                      <HistoryType $type={item.program_code || 'counseling'}>
                        {item.category || item.program_name || '프로그램'}
                      </HistoryType>
                      <HistoryDate>{formatDate(item.apply_date)} 신청</HistoryDate>
                      <HistoryDuration>
                        {formatDate(item.start_date)} ~ {formatDate(item.end_date)}
                      </HistoryDuration>
                    </div>
                    <HistoryStatus $status={item.status?.toLowerCase() || 'pending'}>
                      {item.status === 'APPROVED' ? '✓ 승인' :
                        item.status === 'REJECTED' ? '✕ 반려' : '- 대기'}
                    </HistoryStatus>
                  </HistoryItem>
                ))
              )}
            </HistoryCard>
          </RightColumn>
        </ContentGrid>
      </MainContentArea>
    </PageLayout>
  );
};

export default HealthProgramApply;
