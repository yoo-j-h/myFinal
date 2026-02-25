import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  MainContainer,
  ContentWrapper,
  PageHeader,
  BackButton,
  PageHeaderContent,
  PageTitle,
  PageSubtitle,
  HeaderActions,
  ActionButton,
  PrimaryButton,
  EmployeeProfileCard,
  ProfileSection,
  AvatarLarge,
  ProfileInfo,
  ProfileLabel,
  ProfileValue,
  InfoGrid,
  InfoItem,
  InfoLabel,
  InfoValue,
  HealthStatusBadge,
  AlertSection,
  AlertBox,
  AlertIcon,
  AlertContent,
  AlertTitle,
  AlertDate,
  SuccessBox,
  SuccessIcon,
  SuccessContent,
  SuccessTitle,
  SuccessDate,
  TabContainer,
  TabList,
  Tab,
  TabContent,
  CheckupCard,
  CheckupHeader,
  CheckupIcon,
  CheckupTitle,
  CheckupDate,
  CheckupDetails,
  DetailRow,
  DetailLabel,
  DetailValue,
  DetailBadge,
  DoctorNote,
  NoteLabel,
  NoteText,
  VitalSignsCard,
  VitalSignsTitle,
  VitalGrid,
  VitalItem,
  VitalIcon,
  VitalLabel,
  VitalValue,
  VitalUnit,
  VitalStatus
} from './EmployeeHealthDetail.styled';
import { empPhysicalTestService } from '../../api/Health/healthService';

const EmployeeHealthDetail = () => {
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const { empId } = useParams();
  
  {/* TODO: Zustand state mapping */}

    useEffect(() => {
    const fetchDetail = async () => {
      try {
        //const res = await empPhysicalTestService.detail(empId, physicalTestId);
        const res = await empPhysicalTestService.detail(empId);
        setDetail(res.data);
      } catch (e) {
        console.error(e);
        alert("상세 조회 실패");
      }
    };
    
    if (empId) fetchDetail();
  }, [empId]);
  // const employeeData = {
  //   id: 'EMP-2024-0547',
  //   name: '김민수',
  //   avatar: '김',
  //   department: '객실 승무부',
  //   role: '신임 승무원',
  //   birthDate: '1985-05-12',
  //   joinDate: '2015-03-15',
  //   email: 'minsu.kim@koreanair.com',
  //   phone: '010-1234-5678',
  //   address: '서울특별시 강서구 하늘길 260',
  //   healthStatus: '정상'
  // };
  const employeeData = useMemo(() => {
    if (!detail) return null;
    console.log(detail);
    return {
      id: detail.emp_id,
      name: detail.emp_name,
      avatar: (detail.emp_name || "?").slice(0, 1),
      department_name: detail.department_name,
      job: detail.job,
      start_date: detail.start_date ? detail.start_date.slice(0, 10) : "-",
      email: detail.email,
      phone: detail.phone,
      address: detail.address,
      health_point: detail.health_point, // 없으면 임시 / 추후 로직
    };
  }, [detail]);

  const upcomingCheckup = {
    type: '대한항공 건강검진센터',
    status: '정상',
    date: '2026-01-10',
    daysUntil: 362
  };

  const recentCheckup = {
    date: '2024-10-15',
    status: '완료'
  };

    const vitalSigns = useMemo(() => {
    if (!detail) return [];
    const bp =
      detail.systolic_blood_pressure != null && detail.diastolic_blood_pressure != null
        ? `${detail.systolic_blood_pressure}/${detail.diastolic_blood_pressure}`
        : "-/-";

    return [
      { icon: "📏", label: "키", value: detail.height ?? "-", unit: "cm", status: "normal" },
      { icon: "⚖️", label: "체중", value: detail.weight ?? "-", unit: "kg", status: "normal" },
      { icon: "📊", label: "BMI", value: detail.bmi ?? "-", unit: "", status: "normal" },
      { icon: "❤️", label: "심박수", value: detail.heart_rate ?? "-", unit: "bpm", status: "normal" },
      { icon: "🩸", label: "혈압", value: bp, unit: "mmHg", status: "normal" },
      { icon: "💉", label: "체지방률", value: detail.body_fat ?? "-", unit: "%", status: "normal" },
      { icon: "🩺", label: "혈당", value: detail.blood_sugar ?? "-", unit: "mg/dL", status: "normal" },
      { icon: "💊", label: "콜레스테롤", value: detail.cholesterol ?? "-", unit: "mg/dL", status: "normal" },
    ];
  }, [detail]);

  // const vitalSigns = [
  //   { icon: '📏', label: '키', value: '175', unit: 'cm', status: 'normal' },
  //   { icon: '⚖️', label: '체중', value: '72', unit: 'kg', status: 'normal' },
  //   { icon: '📊', label: 'BMI', value: '23.5', unit: '', status: 'warning' },
  //   { icon: '❤️', label: '심박수', value: '72', unit: 'bpm', status: 'normal' },
  //   { icon: '🩸', label: '혈압', value: '120/80', unit: 'mmHg', status: 'normal' },
  //   { icon: '💉', label: '체지방률', value: '18.5', unit: '%', status: 'normal' },
  //   { icon: '🩺', label: '혈당', value: '95', unit: 'mg/dL', status: 'normal' },
  //   { icon: '💊', label: '콜레스테롤', value: '185', unit: 'mg/dL', status: 'normal' }
  // ];


  const handleBack = () => {
    navigate('/employeehealthmanagement');
  };

  return (
    <MainContainer>
      <ContentWrapper>
        <PageHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <BackButton onClick={handleBack}>
              ←
            </BackButton>
            <PageHeaderContent>
              <PageTitle>직원 건강 상세 정보</PageTitle>
              <PageSubtitle>직원의 건강 상태 및 검진 이력을 확인합니다</PageSubtitle>
            </PageHeaderContent>
          </div>
          <HeaderActions>
            <ActionButton>
              📥 건강 기록 다운
            </ActionButton>
          </HeaderActions>
        </PageHeader>

        <EmployeeProfileCard>
          <ProfileSection>
            <AvatarLarge >{employeeData?.avatar ?? "?"}</AvatarLarge>
            <ProfileInfo>
              <ProfileLabel>이름</ProfileLabel>
              <ProfileValue>{employeeData?.name ?? "-"}</ProfileValue>
            </ProfileInfo>
          </ProfileSection>

          <InfoGrid>
            <InfoItem>
              <InfoLabel>사번</InfoLabel>
              <InfoValue>{employeeData?.id ?? "-"}</InfoValue>
            </InfoItem>
            {/* <InfoItem>
              <InfoLabel>생년월일</InfoLabel>
              <InfoValue>{employeeData.birthDate}</InfoValue>
            </InfoItem> */}
            <InfoItem>
              <InfoLabel>건강 상태</InfoLabel>
              <HealthStatusBadge status="normal">
                {employeeData?.health_point ?? "-"}
              </HealthStatusBadge>
            </InfoItem>
          </InfoGrid>

          <InfoGrid>
            <InfoItem>
              <InfoLabel>부서</InfoLabel>
              <InfoValue>{employeeData?.department_name ?? "-"}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>직급</InfoLabel>
              <InfoValue>{employeeData?.job ?? "-"}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>입사일</InfoLabel>
              <InfoValue>{employeeData?.start_date ?? "-"}</InfoValue>
            </InfoItem>
          </InfoGrid>

          <InfoGrid>
            <InfoItem>
              <InfoLabel>📧 이메일</InfoLabel>
              <InfoValue>{employeeData?.email ?? "-"}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>📞 연락처</InfoLabel>
              <InfoValue>{employeeData?.phone ?? "-"}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>📍 주소</InfoLabel>
              <InfoValue>{employeeData?.address ?? "-"}</InfoValue>
            </InfoItem>
          </InfoGrid>
        </EmployeeProfileCard>


        <>
                <CheckupCard>
                  <CheckupHeader>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <CheckupIcon>🏥</CheckupIcon>
                      <CheckupTitle>최근 건강검진</CheckupTitle>
                    </div>
                    <CheckupDate>{upcomingCheckup.date}</CheckupDate>
                  </CheckupHeader>

                  <CheckupDetails>
                    <DetailRow>
                      <DetailLabel>검진 기관</DetailLabel>
                      <DetailValue>{upcomingCheckup.type}</DetailValue>
                    </DetailRow>
                    <DetailRow>
                      <DetailLabel>종합 소견</DetailLabel>
                      <DetailBadge status="normal">{upcomingCheckup.status}</DetailBadge>
                    </DetailRow>
                    <DetailRow>
                      <DetailLabel>다음 검진일</DetailLabel>
                      <DetailValue>{upcomingCheckup.date}</DetailValue>
                    </DetailRow>
                    <DetailRow>
                      <DetailLabel>D-Day</DetailLabel>
                      <DetailValue style={{ color: '#1E88E5', fontWeight: 600 }}>
                        {upcomingCheckup.daysUntil}일
                      </DetailValue>
                    </DetailRow>
                  </CheckupDetails>

                  <DoctorNote>
                    <NoteLabel>의사 소견</NoteLabel>
                    <NoteText>
                      모든 검사 항목에서 정상 소견. 정기 건강검진 계속 유지 권장.
                    </NoteText>
                  </DoctorNote>
                </CheckupCard>

                <VitalSignsCard>
                  <VitalSignsTitle>
                    <span style={{ fontSize: '20px' }}>📋</span>
                    신체 측정값
                  </VitalSignsTitle>

                  <VitalGrid>
                    {vitalSigns.map((vital, index) => (
                      <VitalItem key={index}>
                        <VitalIcon>{vital.icon}</VitalIcon>
                        <div style={{ flex: 1 }}>
                          <VitalLabel>{vital.label}</VitalLabel>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                            <VitalValue status={vital.status}>{vital.value}</VitalValue>
                            {vital.unit && <VitalUnit>{vital.unit}</VitalUnit>}
                          </div>
                        </div>
                        {vital.status === 'warning' && (
                          <VitalStatus status="warning">과체중</VitalStatus>
                        )}
                      </VitalItem>
                    ))}
                  </VitalGrid>
                </VitalSignsCard>
              </>
      </ContentWrapper>
    </MainContainer>
  );
};

export default EmployeeHealthDetail;