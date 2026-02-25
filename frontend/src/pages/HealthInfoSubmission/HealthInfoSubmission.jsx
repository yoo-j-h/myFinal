import React, { useState, useRef, useEffect } from 'react';
import {
  MainContainer,
  ContentWrapper,
  PageHeader,
  PageTitle,
  PageSubtitle,
  InfoNotice,
  NoticeIcon,
  NoticeContent,
  NoticeTitle,
  NoticeList,
  NoticeItem,
  FormContainer,
  FormSection,
  SectionHeader,
  SectionTitle,
  UploadMethodSection,
  UploadOptions,
  UploadOption,
  UploadIcon,
  UploadOptionContent,
  UploadOptionTitle,
  UploadOptionDescription,
  FormGroup,
  FormLabel,
  FormInput,
  FormTextArea,
  CharacterCounter,
  FormActions,
  ResetButton,
  SubmitButton,
  GuideSection,
  GuideTitle,
  GuideList,
  GuideItem,
  GuideNumber,
  GuideContent,
  GuideItemTitle,
  GuideItemDescription,
  HiddenInput,
  ErrorMessage
} from './HealthInfoSubmission.styled';
import axios from 'axios';
import { empPhysicalTestService } from '../../api/Health/healthService';
import useAuthStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

const HealthInfoSubmission = () => {
  const [selectedMethod, setSelectedMethod] = useState('text');
  const [uploadedFile, setUploadedFile] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    classification: '',
    memo: ''
  });

  const [previewData, setPreviewData] = useState(null);
  const empId = useAuthStore((s) => s.getEmpId());
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    if (!empId) hydrate();
  }, [empId, hydrate]);

  const fileInputRef = useRef(null);
  const maxCharacters = 2000;

  const formatPreviewToMemo = (d) => {
    const line = (label, value) => `${label}: ${value ?? "-"}`;
    return [
      line("검사일", d?.test_date),
      line("키", d?.height),
      line("체중", d?.weight),
      line("혈당", d?.blood_sugar),
      line("수축기혈압", d?.systolic_blood_pressure),
      line("이완기혈압", d?.diastolic_blood_pressure),
      line("콜레스테롤", d?.cholesterol),
      line("심박수", d?.heart_rate),
      line("BMI", d?.bmi),
      line("체지방", d?.body_fat),
    ].join("\n");
  };

  {/* TODO: Zustand state mapping */ }
  const noticeItems = [
    '건강검진 결과서, 진료 기록 등을 PDF 형식or 업로드하거나 직접 입력해 주 있습니다',
    '제출된 정보는 관리자가 검토후 AI시스템에 반영됩니다',
    '개인정보는 암호화돼 보호되며 안심 관리 목적으로만 사용합니다',
    '파일 크기는 최대 10MB까지 업로드 가능합니다'
  ];

  const guideItems = [
    {
      title: '정보 유형을 선택하세요',
      description: '건강검진 결과, 진료 기록, 약물 정보 등 해당하는 유형을 선택합니다.'
    },
    {
      title: '제출 방식을 선택하세요',
      description: '텍스트로 직접 입력하거나 PDF/이미지 파일을 업로드 할 수 있습니다.'
    },
    {
      title: '상세 내용을 입력하세요',
      description: '검진일, 검진 기관, 주요 소견 등을 최대한 상세히 작성해주세요.'
    }
  ];

  const callPreview = async (file) => {
    const fd = new FormData();
    fd.append("file", file);

    const res = await axios.post("/preview", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setPreviewData(res.data);
  };

  const callSave = async () => {
    if (!empId) {
      alert("empId가 필요합니다.");
      return;
    }
    if (!uploadedFile) {
      alert("파일을 업로드해주세요.");
      return;
    }
    if (!previewData) {
      alert("미리보기 데이터가 없습니다. 먼저 파일을 업로드해주세요.");
      return;
    }

    // 백엔드 save는 @RequestPart("data") HealthDto.PhysicalTestRequest 를 받으므로
    // JSON을 application/json 파트로 넣어야 함
    const fd = new FormData();
    fd.append("empId", empId);
    fd.append("file", uploadedFile);
    fd.append(
      "data",
      new Blob([JSON.stringify(previewData)], { type: "application/json" })
    );

    const res = await axios.post("/save", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const savedId = res.data; // Long
    // 저장 후 리스트/상세로 이동
    // navigate(`/health/physical-tests/${savedId}`) 등
    alert(`저장 완료 (id: ${savedId})`);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert('파일 크기는 10MB를 초과할 수 없습니다.');
        return;
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        alert('PDF 또는 이미지 파일만 업로드 가능합니다.');
        return;
      }

      setUploadedFile(file);
      setSelectedMethod("file");
      {/* TODO: Upload file with Zustand */ }
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await empPhysicalTestService.preview(fd);
        const preview = res.data;
        console.log(res);
        setPreviewData(preview);
        setFormData((prev) => ({
          ...prev,
          classification: "건강검진",
          memo: formatPreviewToMemo(preview),
        }));
        setSelectedMethod("text");

      } catch (e) {
        console.error(e);
        alert("미리보기(파싱) 실패");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    {/* TODO: Update Zustand store */ }
  };

  const handleMemoChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxCharacters) {
      setFormData(prev => ({
        ...prev,
        memo: value
      }));
      {/* TODO: Update Zustand store */ }
    }
  };

  const handleReset = () => {
    if (window.confirm('작성 중인 내용을 초기화하시겠습니까?')) {
      setFormData({ classification: '', memo: '' });
      setUploadedFile(null);
      setSelectedMethod('text');
      {/* TODO: Reset Zustand store */ }
    }
  };

  const handleSubmit = async () => {
    if (!formData.classification.trim()) {
      alert('정보 유형을 입력해주세요.');
      return;
    }

    if (selectedMethod === 'text' && !formData.memo.trim()) {
      alert('건강 정보를 입력해주세요.');
      return;
    }

    if (selectedMethod === 'file' && !uploadedFile) {
      alert('파일을 업로드해주세요.');
      return;
    }


    try {
      console.log(previewData);
      await empPhysicalTestService.save(empId, uploadedFile, previewData);
    } catch (e) {
      console.error(e);
      alert("저장 실패");
    }

    {/* TODO: Submit with Zustand */ }
    console.log('Submitting:', { formData, uploadedFile, selectedMethod });
    alert('건강 정보가 제출되었습니다.');
    navigate("/healthsubmissionhistory")
  };

  return (
    <MainContainer>
      <ContentWrapper>
        <PageHeader>
          <PageTitle>건강 정보 제출</PageTitle>
          <PageSubtitle>건강검진 결과, 진료 기록 등의 건강 정보를 제출하세요</PageSubtitle>
        </PageHeader>

        <InfoNotice>
          <NoticeIcon>ℹ️</NoticeIcon>
          <NoticeContent>
            <NoticeTitle>건강 정보 제출 안내</NoticeTitle>
            <NoticeList>
              {noticeItems.map((item, index) => (
                <NoticeItem key={index}>{item}</NoticeItem>
              ))}
            </NoticeList>
          </NoticeContent>
        </InfoNotice>

        <FormContainer>
          <FormSection>
            <SectionHeader>
              <SectionTitle>제출 방식 선택</SectionTitle>
            </SectionHeader>

            <UploadMethodSection>
              <UploadOptions>
                <UploadOption
                  selected={selectedMethod === 'text'}
                  onClick={() => setSelectedMethod('text')}
                >
                  <UploadIcon>📄</UploadIcon>
                  <UploadOptionContent>
                    <UploadOptionTitle>텍스트 입력</UploadOptionTitle>
                    <UploadOptionDescription>직접 내용을 작성합니다</UploadOptionDescription>
                  </UploadOptionContent>
                </UploadOption>

                <UploadOption
                  selected={selectedMethod === 'file'}
                  onClick={() => {
                    setSelectedMethod('file');
                    fileInputRef.current?.click();
                  }}
                >
                  <UploadIcon>📤</UploadIcon>
                  <UploadOptionContent>
                    <UploadOptionTitle>파일 업로드</UploadOptionTitle>
                    <UploadOptionDescription>
                      {uploadedFile ? uploadedFile.name : 'PDF, 이미지 파일'}
                    </UploadOptionDescription>
                  </UploadOptionContent>
                </UploadOption>

                <HiddenInput
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleFileUpload}
                />
              </UploadOptions>
            </UploadMethodSection>
          </FormSection>

          <FormSection>
            <SectionHeader>
              <SectionTitle>정보 유형</SectionTitle>
            </SectionHeader>
            <FormGroup>
              <FormInput
                type="text"
                name="classification"
                value={formData.classification}
                onChange={handleInputChange}
                placeholder="예: 건강검진, 진료기록, 예방접종 등"
              />
            </FormGroup>
          </FormSection>

          <FormSection>
            <SectionHeader>
              <SectionTitle>건강 정보 입력</SectionTitle>
            </SectionHeader>
            <FormGroup>
              <FormTextArea
                name="memo"
                value={formData.memo}
                onChange={handleMemoChange}
                placeholder="건강 정보를 상세히 입력해주세요.

예시:
- 검진일: 2025년 1월 10일
- 검진 기관: 대한항공 건강관리센터
- 주요 소견: 모든 항목 정상
- 특이사항: 없음"
                rows={15}
                disabled={selectedMethod === 'file'}
              />
              <CharacterCounter>
                <span>{formData.memo.length} / {maxCharacters}자</span>
                {formData.memo.length > 0 && formData.memo.length < 50 && (
                  <ErrorMessage>
                    최소 50자 이상 입력해주세요
                  </ErrorMessage>
                )}
              </CharacterCounter>
            </FormGroup>
          </FormSection>

          <FormActions>
            <ResetButton type="button" onClick={handleReset}>
              초기화
            </ResetButton>
            <SubmitButton type="button" onClick={handleSubmit}>
              ✈️ 건강 정보 제출
            </SubmitButton>
          </FormActions>
        </FormContainer>

        <GuideSection>
          <GuideTitle>제출 가이드</GuideTitle>
          <GuideList>
            {guideItems.map((item, index) => (
              <GuideItem key={index}>
                <GuideNumber>{index + 1}</GuideNumber>
                <GuideContent>
                  <GuideItemTitle>{item.title}</GuideItemTitle>
                  <GuideItemDescription>{item.description}</GuideItemDescription>
                </GuideContent>
              </GuideItem>
            ))}
          </GuideList>
        </GuideSection>
      </ContentWrapper>
    </MainContainer >
  );
};

export default HealthInfoSubmission;