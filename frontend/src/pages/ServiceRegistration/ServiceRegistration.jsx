import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'styled-components';
import {
  MainContainer,
  ContentWrapper,
  PageHeader,
  HeaderIcon,
  PageTitle,
  PageDescription,
  FormSection,
  SectionHeader,
  SectionNumber,
  SectionTitle,
  FormGrid,
  FormGroup,
  Label,
  RequiredMark,
  Input,
  HelpText,
  FileUploadArea,
  UploadIcon,
  UploadText,
  UploadHint,
  InfoBox,
  InfoTitle,
  InfoList,
  InfoItem,
  SubmitButton,
  Footer,
  Copyright
} from './ServiceRegistration.styled';
import { airlineApplyService } from '../../api/airline-apply/services';

const ServiceRegistration = () => {
  const theme = useTheme(); // Get theme
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    airlineName: '',
    airlineAddress: '',
    managerName: '',
    managerPhone: '',
    managerEmail: '',
    businessLicense: null,
    employmentCert: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field, file) => {
    if (file) {
      // 파일 크기 검증 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('파일 크기는 10MB를 초과할 수 없습니다.');
        return;
      }
      // 파일 타입 검증
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        alert('PDF 또는 이미지 파일만 업로드 가능합니다.');
        return;
      }
      setFormData(prev => ({ ...prev, [field]: file }));
    }
  };

  const handleSubmit = async () => {
    // 필수 필드 검증
    if (!formData.airlineName || !formData.airlineAddress || !formData.managerName ||
      !formData.managerPhone || !formData.managerEmail || !formData.businessLicense ||
      !formData.employmentCert) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // FormData 생성
      const submitFormData = new FormData();

      // JSON 데이터 추가 (@RequestPart가 JSON을 파싱하려면 application/json Content-Type 필요)
      const data = {
        airlineName: formData.airlineName,
        airlineAddress: formData.airlineAddress,
        managerName: formData.managerName,
        managerPhone: formData.managerPhone,
        managerEmail: formData.managerEmail
      };
      submitFormData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));

      // 파일 추가
      if (formData.businessLicense) {
        submitFormData.append('businessLicense', formData.businessLicense);
      }
      if (formData.employmentCert) {
        submitFormData.append('employmentCert', formData.employmentCert);
      }

      const response = await airlineApplyService.createApplication(submitFormData);

      alert('가입 신청이 완료되었습니다. 검토 후 결과를 이메일로 안내드리겠습니다.');
      // 성공 시 홈으로 이동하거나 다른 페이지로 이동
      navigate('/');
    } catch (err) {
      console.error('가입 신청 실패:', err);
      const errorMessage = err.response?.data?.message || '가입 신청에 실패했습니다. 다시 시도해주세요.';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainContainer>
      <ContentWrapper>
        <PageHeader>
          <HeaderIcon>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="9 22 9 12 15 12 15 22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </HeaderIcon>
          <PageTitle>서비스 가입 신청</PageTitle>
          <PageDescription>항공사 인사관리를 위한 SkyHR 서비스에 가입하세요</PageDescription>
        </PageHeader>

        {/* Section 1: 항공사 기본 정보 */}
        <FormSection>
          <SectionHeader>
            <SectionNumber>1</SectionNumber>
            <SectionTitle>항공사 기본 정보</SectionTitle>
          </SectionHeader>

          <FormGrid>
            <FormGroup $fullWidth>
              <Label>
                항공사명 <RequiredMark>*</RequiredMark>
              </Label>
              <Input
                type="text"
                placeholder="예: 대한항공"
                value={formData.airlineName}
                onChange={(e) => handleInputChange('airlineName', e.target.value)}
              />
            </FormGroup>

            <FormGroup $fullWidth>
              <Label>
                항공사 주소 <RequiredMark>*</RequiredMark>
              </Label>
              <Input
                type="text"
                placeholder="예: 서울특별시 강서구 하늘길 112"
                value={formData.airlineAddress}
                onChange={(e) => handleInputChange('airlineAddress', e.target.value)}
              />
            </FormGroup>
          </FormGrid>
        </FormSection>

        {/* Section 2: 담당자 정보 */}
        <FormSection>
          <SectionHeader>
            <SectionNumber>2</SectionNumber>
            <SectionTitle>담당자 정보</SectionTitle>
          </SectionHeader>

          <FormGrid>
            <FormGroup>
              <Label>
                담당자 이름 <RequiredMark>*</RequiredMark>
              </Label>
              <Input
                type="text"
                placeholder="홍길동"
                value={formData.managerName}
                onChange={(e) => handleInputChange('managerName', e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>
                담당자 전화번호 <RequiredMark>*</RequiredMark>
              </Label>
              <Input
                type="tel"
                placeholder="010-1234-5678"
                value={formData.managerPhone}
                onChange={(e) => handleInputChange('managerPhone', e.target.value)}
              />
            </FormGroup>

            <FormGroup $fullWidth>
              <Label>
                담당자 이메일 <RequiredMark>*</RequiredMark>
              </Label>
              <Input
                type="email"
                placeholder="hr.manager@koreanair.com"
                value={formData.managerEmail}
                onChange={(e) => handleInputChange('managerEmail', e.target.value)}
              />
              <HelpText>실무 추가 문의시 필요한 연락처를 입력합니다</HelpText>
            </FormGroup>
          </FormGrid>
        </FormSection>

        {/* Section 3: 첨부 서류 */}
        <FormSection>
          <SectionHeader>
            <SectionNumber>3</SectionNumber>
            <SectionTitle>첨부 서류</SectionTitle>
          </SectionHeader>

          <FormGrid>
            <FormGroup $fullWidth>
              <Label>
                사업자등록증 <RequiredMark>*</RequiredMark>
              </Label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileUpload('businessLicense', e.target.files[0])}
                style={{ display: 'none' }}
                id="businessLicense-upload"
              />
              <FileUploadArea
                onClick={() => document.getElementById('businessLicense-upload').click()}
                style={{ cursor: 'pointer' }}
              >
                <UploadIcon>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M16 22V10M16 10L11 15M16 10L21 15" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M28 20V26C28 27.1046 27.1046 28 26 28H6C4.89543 28 4 27.1046 4 26V20" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </UploadIcon>
                <UploadText>
                  {formData.businessLicense ? formData.businessLicense.name : '파일 업로드'}
                </UploadText>
                <UploadHint>PDF, JPG, PNG (최대 10MB)</UploadHint>
              </FileUploadArea>
            </FormGroup>

            <FormGroup $fullWidth>
              <Label>
                재직증명서 <RequiredMark>*</RequiredMark>
              </Label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileUpload('employmentCert', e.target.files[0])}
                style={{ display: 'none' }}
                id="employmentCert-upload"
              />
              <FileUploadArea
                onClick={() => document.getElementById('employmentCert-upload').click()}
                style={{ cursor: 'pointer' }}
              >
                <UploadIcon>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M16 22V10M16 10L11 15M16 10L21 15" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M28 20V26C28 27.1046 27.1046 28 26 28H6C4.89543 28 4 27.1046 4 26V20" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </UploadIcon>
                <UploadText>
                  {formData.employmentCert ? formData.employmentCert.name : '파일 업로드'}
                </UploadText>
                <UploadHint>PDF, JPG, PNG (최대 10MB)</UploadHint>
              </FileUploadArea>
            </FormGroup>
          </FormGrid>
        </FormSection>

        {/* 신청 전 확인사항 */}
        <InfoBox>
          <InfoTitle>📋 신청 전 확인사항</InfoTitle>
          <InfoList>
            <InfoItem>• 제출하신 서류는 항공사 업종 확인용으로만 사용됩니다</InfoItem>
            <InfoItem>• 신청 완료는 1-2 영업일 소요되며, 결과는 이메일로 안내됩니다</InfoItem>
            <InfoItem>• 승인 후 계정 발급과 팀장과 팀 설정은 상세사항 안내와 함께 제공됩니다</InfoItem>
          </InfoList>
        </InfoBox>

        {error && (
          <div style={{ color: theme.status.error || '#dc2626', textAlign: 'center', marginBottom: '20px' }}>
            {error}
          </div>
        )}
        <SubmitButton onClick={handleSubmit} disabled={loading}>
          {loading ? '신청 중...' : '가입 신청하기'}
        </SubmitButton>

        <Footer>
          <Copyright>© 2025 SkyHR. All rights reserved.</Copyright>
          <Copyright>항공사 인사관리 통합 플랫폼</Copyright>
        </Footer>
      </ContentWrapper>
    </MainContainer>
  );
};

export default ServiceRegistration;