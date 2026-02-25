import React, { useState } from 'react';
import * as S from './InitialSetup.styled';
import SetupComplete from './SetupComplete'; // 완료 화면 import
import { accountActivationService } from '../../api/account-activation/services';

const InitialSetup = ({ token, initialData }) => {
  const [logoFile, setLogoFile] = useState(null);
  const [airlineName, setAirlineName] = useState(initialData?.role || '');
  const [airlineAddress, setAirlineAddress] = useState(initialData?.airlineAddress || '');
  const [representativeName, setRepresentativeName] = useState('');
  const [representativePhone, setRepresentativePhone] = useState('');
  const [representativeEmail, setRepresentativeEmail] = useState('');
  const [airlineDesc, setAirlineDesc] = useState('');
  const [theme, setTheme] = useState('#3b82f6'); // 기본 파란색 헥스코드
  const [employeeFile, setEmployeeFile] = useState(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false); // 설정 완료 상태
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [setupResponse, setSetupResponse] = useState(null); // 초기 설정 완료 응답 데이터

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      // TODO: 파일 미리보기 처리
    }
  };

  const handleEmployeeFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEmployeeFile(file);
      // TODO: 파일 유효성 검증
    }
  };

  const handleSubmit = async () => {
    if (!token) {
      alert('유효하지 않은 토큰입니다.');
      return;
    }

    // 필수 필드 검증
    if (!airlineName || !airlineAddress || !representativeName || 
        !representativePhone || !representativeEmail || !theme) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔵 [InitialSetup] API 호출 시작...');
      console.log('🔵 [InitialSetup] 현재 상태 - isSetupComplete:', isSetupComplete);
      
      const formData = {
        airlineName,
        airlineAddress,
        representativeName,
        representativePhone,
        representativeEmail,
        airlineDesc: airlineDesc || '',
        theme
      };
      
      const response = await accountActivationService.completeInitialSetup(token, formData, logoFile);
      
      console.log('🟢 [InitialSetup] API 호출 성공');
      console.log('🟢 [InitialSetup] 응답 전체:', response);
      console.log('🟢 [InitialSetup] response.data:', response.data);
      
      // 응답 데이터 검증
      if (!response || !response.data) {
        console.error('❌ [InitialSetup] 응답 데이터가 없습니다:', response);
        throw new Error('서버 응답이 올바르지 않습니다.');
      }
      
      // 응답 데이터 저장
      setSetupResponse(response.data);
      console.log('🟢 [InitialSetup] setupResponse 설정 완료:', response.data);
      
      // 상태 업데이트 전 로그
      console.log('🟡 [InitialSetup] 상태 업데이트 전 - isSetupComplete:', isSetupComplete);
      
      // alert를 setTimeout으로 지연 처리하여 상태 업데이트가 먼저 실행되도록 함
      setIsSetupComplete(true);
      
      console.log('🟢 [InitialSetup] setIsSetupComplete(true) 호출 완료');
      
      // 상태 업데이트 후 로그는 useEffect나 다음 렌더에서 확인 가능
      setTimeout(() => {
        console.log('🟢 [InitialSetup] 초기 설정이 완료되었습니다.');
      }, 100);
      
    } catch (err) {
      console.error('❌ [InitialSetup] 초기 설정 실패:', err);
      console.error('❌ [InitialSetup] 에러 상세:', {
        message: err.message,
        response: err.response,
        responseData: err.response?.data
      });
      
      let errorMessage = '초기 설정에 실패했습니다.';
      
      if (err.response) {
        // 서버 에러 응답이 있는 경우
        errorMessage = err.response?.data?.message || err.response?.data?.error || errorMessage;
        console.error('❌ [InitialSetup] 서버 에러 응답:', err.response.data);
      } else if (err.request) {
        // 요청은 보냈지만 응답을 받지 못한 경우
        errorMessage = '서버에 연결할 수 없습니다. 네트워크를 확인해주세요.';
        console.error('❌ [InitialSetup] 네트워크 에러:', err.request);
      } else {
        // 요청 설정 중 에러가 발생한 경우
        errorMessage = err.message || errorMessage;
        console.error('❌ [InitialSetup] 요청 설정 에러:', err.message);
      }
      
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
      console.log('🔵 [InitialSetup] 로딩 상태 해제');
    }
  };

  // 설정 완료 시 완료 페이지 렌더링
  if (isSetupComplete) {
    return <SetupComplete setupData={setupResponse} />;
  }

  return (
    <S.MainContainer>
      <S.ContentWrapper>
        <S.Header>
          <S.StepIndicator>
            <S.Step $completed>
              <S.StepNumber>✓</S.StepNumber>
              <S.StepLabel>계정 활성화</S.StepLabel>
            </S.Step>
            <S.Step $active>
              <S.StepNumber>2</S.StepNumber>
              <S.StepLabel>초기 설정</S.StepLabel>
            </S.Step>
          </S.StepIndicator>
        </S.Header>

        <S.FormCard>
          <S.IconWrapper>
            <S.Icon>💼</S.Icon>
          </S.IconWrapper>

          <S.Title>항공사 초기 설정</S.Title>
          <S.Subtitle>
            항공사의 기본 정보를 설정하세요
          </S.Subtitle>

          {/* Section 1: 기본 정보 입력 */}
          <S.Section>
            <S.SectionHeader>
              <S.SectionNumber>1</S.SectionNumber>
              <S.SectionTitle>기본 정보 입력</S.SectionTitle>
            </S.SectionHeader>

            <S.LogoUploadSection>
              <S.Label>항공사 로고</S.Label>
              <S.LogoUploadArea>
                <input
                  type="file"
                  id="logo-upload"
                  accept="image/png, image/jpeg, image/svg+xml"
                  onChange={handleLogoUpload}
                  style={{ display: 'none' }}
                />
                <label htmlFor="logo-upload">
                  <S.UploadBox>
                    <S.UploadIcon>⬆️</S.UploadIcon>
                    <S.UploadText>
                      {logoFile ? logoFile.name : '로고 이미지'}
                    </S.UploadText>
                  </S.UploadBox>
                </label>
                <S.UploadGuide>
                  <S.GuideTitle>📤 파일 선택</S.GuideTitle>
                  <S.GuideItem>• 권장 크기: 400x400px</S.GuideItem>
                  <S.GuideItem>• 지원 형식: PNG, JPG, SVG</S.GuideItem>
                  <S.GuideItem>• 최대 용량: 5MB</S.GuideItem>
                </S.UploadGuide>
              </S.LogoUploadArea>
            </S.LogoUploadSection>

            <S.InputField style={{ marginTop: '20px' }}>
              <S.Label>항공사명</S.Label>
              <S.Input
                type="text"
                value={airlineName}
                onChange={(e) => setAirlineName(e.target.value)}
                placeholder={initialData?.role || '항공사명을 입력하세요'}
              />
            </S.InputField>

            <S.InputField style={{ marginTop: '20px' }}>
              <S.Label>항공사 주소</S.Label>
              <S.Input
                type="text"
                value={airlineAddress}
                onChange={(e) => setAirlineAddress(e.target.value)}
                placeholder={initialData?.airlineAddress || '항공사 주소를 입력하세요'}
              />
            </S.InputField>
          </S.Section>

          {/* Section 2: 대표자 정보 및 항공사 정보 */}
          <S.Section>
            <S.SectionHeader>
              <S.SectionNumber>2</S.SectionNumber>
              <S.SectionTitle>대표자 정보 및 항공사 정보</S.SectionTitle>
            </S.SectionHeader>

            <S.InputField>
              <S.Label>대표자 이름</S.Label>
              <S.Input
                type="text"
                value={representativeName}
                onChange={(e) => setRepresentativeName(e.target.value)}
                placeholder="대표자 이름을 입력하세요"
              />
            </S.InputField>

            <S.InputField style={{ marginTop: '20px' }}>
              <S.Label>대표자 번호</S.Label>
              <S.Input
                type="tel"
                value={representativePhone}
                onChange={(e) => setRepresentativePhone(e.target.value)}
                placeholder="010-1234-5678"
              />
            </S.InputField>

            <S.InputField style={{ marginTop: '20px' }}>
              <S.Label>대표 이메일</S.Label>
              <S.Input
                type="email"
                value={representativeEmail}
                onChange={(e) => setRepresentativeEmail(e.target.value)}
                placeholder="representative@airline.com"
              />
            </S.InputField>

            <S.InputField style={{ marginTop: '20px' }}>
              <S.Label>항공사 설명</S.Label>
              <textarea
                value={airlineDesc}
                onChange={(e) => setAirlineDesc(e.target.value)}
                placeholder="항공사에 대한 설명을 입력하세요"
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </S.InputField>

            <S.InputField style={{ marginTop: '20px' }}>
              <S.Label>테마 색깔</S.Label>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '8px' }}>
                <input
                  type="color"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  style={{
                    width: '60px',
                    height: '60px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                />
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  padding: '8px 16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb'
                }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>선택된 색상:</span>
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: '600',
                    color: theme,
                    fontFamily: 'monospace'
                  }}>
                    {theme}
                  </span>
                </div>
              </div>
            </S.InputField>
          </S.Section>

          {/* Section 3: 직원 초대 / 등록 (기능 구현 보류) */}
          <S.Section>
            <S.SectionHeader>
              <S.SectionNumber>3</S.SectionNumber>
              <S.SectionTitle>직원 초대 / 등록</S.SectionTitle>
            </S.SectionHeader>

            <S.Description>
              엑셀 파일을 업로드하여 일괄적 정보를 일괄 등록할 수 있습니다.
            </S.Description>

            <S.BulkUploadInfo>
              <S.InfoIcon>👥</S.InfoIcon>
              <S.InfoTitle>엑셀 대량 등록 방식</S.InfoTitle>
              <S.InfoList>
                <S.InfoItem>• 항목 양식: 이름, 이메일, 부서, 직급</S.InfoItem>
                <S.InfoItem>• 선택 양식: 전화번호, 입사일</S.InfoItem>
              </S.InfoList>
              <S.TemplateButton>템플릿 다운로드</S.TemplateButton>
            </S.BulkUploadInfo>

            <S.FileUploadArea>
              <input
                type="file"
                id="employee-upload"
                accept=".xlsx, .xls, .csv"
                onChange={handleEmployeeFileUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="employee-upload">
                <S.UploadDropZone>
                  <S.UploadIcon>⬆️</S.UploadIcon>
                  <S.UploadMainText>
                    {employeeFile 
                      ? employeeFile.name 
                      : '엑셀 파일을 드래그하거나 클릭하여 업로드'}
                  </S.UploadMainText>
                  <S.UploadSubText>지원 형식 : .xlsx, .xls, .csv</S.UploadSubText>
                </S.UploadDropZone>
              </label>
            </S.FileUploadArea>

            {/* <S.WarningBox>
              <S.WarningIcon>⚠️</S.WarningIcon>
              <S.WarningTitle>주의사항</S.WarningTitle>
              <S.WarningList>
                <S.WarningItem>엑셀 파일의 첫 번째 행은 헤더로 인식됩니다</S.WarningItem>
                <S.WarningItem>이메일 주소는 중복될 수 없습니다</S.WarningItem>
                <S.WarningItem>업로드 후 직원들에게 초기 이메일이 자동 발송됩니다</S.WarningItem>
              </S.WarningList>
            </S.WarningBox> */}
          </S.Section>

          {error && (
            <div style={{ color: '#dc2626', textAlign: 'center', marginBottom: '20px' }}>
              {error}
            </div>
          )}

          <S.SubmitButton 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? '처리 중...' : '초기 설정 완료'}
          </S.SubmitButton>
        </S.FormCard>
      </S.ContentWrapper>
    </S.MainContainer>
  );
};

export default InitialSetup;