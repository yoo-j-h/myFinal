import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAirlineTheme } from '../../context/AirlineThemeContext';
import * as S from './Register.styled';

// ✅ service 분리 방식
import { empService } from '../../api/emp/empService';
import { fileService } from '../../api/emp/fileService';

// ✅ 이메일 인증 백엔드 연결 서비스
import { passwordCodeService } from '../../api/emp/passwordCodeService';

const Register = () => {
  const navigate = useNavigate();
  const { currentAirline, theme } = useAirlineTheme();

  // 현재 단계 (1: 이메일인증, 2: 아이디확인, 3: 정보입력)
  const [step, setStep] = useState(1);

  // 폼 데이터
  const [formData, setFormData] = useState({
    email: '',
    emailCode: '',
    userId: '', // 아이디
    empNo: '', // ✅ 사번
    password: '',
    confirmPassword: '',
    name: '',
    age: '',
    phone: '',

    // ✅ 주소(카카오 주소검색 적용)
    roadAddress: '', // 도로명/지번(검색으로 채움)
    detailAddress: '', // 상세주소(직접 입력)
    address: '', // ✅ 최종 저장용(road + detail 조합)

    department: '',
    position: '',

    profileImage: null, // 미리보기용(선택)
    profileImageId: null, // ✅ 업로드 결과 fileId
  });

  // 프로필 이미지 미리보기 URL
  const [profilePreview, setProfilePreview] = useState(null);

  // ✅ 명함 OCR 로딩 상태
  const [isOcrLoading, setIsOcrLoading] = useState(false);

  // ✅ 명함 OCR 숨김 input ref
  const ocrInputRef = useRef(null);

  // ✅ OCR로 추출된 주소 (카카오 팝업 defaultQuery에 사용)
  const [ocrAddress, setOcrAddress] = useState('');

  // ✅ Toast 알림
  const [toasts, setToasts] = useState([]);
  const showToast = useCallback((msg, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  // 각 단계별 인증 완료 여부 (실제 구현 시 활용)
  const [verified, setVerified] = useState({
    email: false,
    userId: false,
  });

  /* ==========================
   * ✅ 이메일 인증번호 타이머 (5분)
   * ========================== */
  const EMAIL_EXPIRE_SECONDS = 300; // 5분
  const [emailSecondsLeft, setEmailSecondsLeft] = useState(0);
  const [emailTimerRunning, setEmailTimerRunning] = useState(false);

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  useEffect(() => {
    if (!emailTimerRunning) return;

    if (emailSecondsLeft <= 0) {
      setEmailTimerRunning(false);
      return;
    }

    const id = setInterval(() => {
      setEmailSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          setEmailTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [emailTimerRunning, emailSecondsLeft]);

  /* ==========================
   * ✅ 주소 합치기: 구분자 포함(핵심)
   * - road + detail을 "도로명주소 | 상세주소"로 저장
   * - 상세주소 없으면 "도로명주소"만 저장(구분자 X)
   * ========================== */
  const buildAddress = (road, detail) => {
    const r = (road || '').trim();
    const d = (detail || '').trim();

    if (!r) return '';
    if (!d) return r;

    return `${r} | ${d}`; // ✅ 구분자
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // ✅ 전화번호만 자동 포맷
    if (name === 'phone') {
      const formatted = formatPhone(value);
      setFormData((prev) => ({ ...prev, phone: formatted }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatPhone = (raw) => {
    const digits = raw.replace(/\D/g, ''); // 숫자만 남김

    // 010-XXXX-XXXX (최대 11자리만)
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  };

  /* ==========================
   * ✅ 업로드 파일 삭제(회원가입 실패/이전 단계 등)
   * ========================== */
  const deleteUploadedFileIfExists = async () => {
    const fileId = formData.profileImageId;
    if (!fileId) return;

    try {
      await fileService.remove(fileId);
      console.log('🧹 업로드 파일 삭제 완료:', fileId);
    } catch (e) {
      // 최소구현: 삭제 실패해도 UX 깨지지 않게 조용히 넘김
      console.warn('⚠️ 업로드 파일 삭제 실패(무시 가능):', fileId, e);
    } finally {
      setFormData((prev) => ({
        ...prev,
        profileImageId: null,
        profileImage: null,
      }));
      setProfilePreview(null);
    }
  };

  /* ==========================
   * ✅ 프로필 이미지 업로드(선택 시 즉시 업로드 → fileId 저장)
   * ========================== */
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1) 프론트 미리보기
    setFormData((prev) => ({ ...prev, profileImage: file }));

    const reader = new FileReader();
    reader.onloadend = () => setProfilePreview(reader.result);
    reader.readAsDataURL(file);

    // 2) 이미 업로드된 파일이 있으면(교체) 먼저 삭제 시도(선택)
    if (formData.profileImageId) {
      await deleteUploadedFileIfExists();
    }

    // 3) 백엔드 업로드
    try {
      const uploadRes = await fileService.upload(file);
      const fileId = uploadRes.data.fileId;

      setFormData((prev) => ({
        ...prev,
        profileImageId: fileId,
      }));

      console.log('✅ 업로드 성공 fileId=', fileId);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || '이미지 업로드에 실패했습니다.');
      setFormData((prev) => ({ ...prev, profileImageId: null }));
    }
  };

  /* ==========================
   * ✅ 명함 OCR: 이미지 업로드 → 폼 자동완성
   * ========================== */
  const handleOcrUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // input 초기화 (같은 파일 재선택 허용)
    e.target.value = '';

    setIsOcrLoading(true);
    try {
      const formDataOcr = new FormData();
      formDataOcr.append('file', file);

      const res = await fetch('/api/auth/ocr-business-card', {
        method: 'POST',
        body: formDataOcr,
      });

      if (!res.ok) throw new Error(`서버 오류 (${res.status})`);

      const data = await res.json();

      // OCR 결과를 폼에 자동 매핑
      setFormData((prev) => ({
        ...prev,
        name: data.empName ?? prev.name,
        phone: data.phone ? formatPhone(data.phone) : prev.phone,
        position: data.job ?? prev.position,
      }));

      // address는 폼에 직접 넣지 않고 State에 보관 → 카카오 팝업 defaultQuery로 사용
      if (data.address) {
        setOcrAddress(data.address);
      }

      alert('명함 정보가 자동으로 입력되었습니다. 내용을 확인 후 필요하면 수정해 주세요.');
    } catch (err) {
      console.error('명함 OCR 실패:', err);
      alert('명함 인식에 실패했습니다. 직접 입력해 주세요.');
    } finally {
      setIsOcrLoading(false);
    }
  };

  /* ==========================
   * ✅ 카카오 주소검색 (우편번호 제외)
   * - index.html에 스크립트 필요:
   *   <script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
   * ========================== */
  const openKakaoAddressSearch = () => {
    if (!window.daum?.Postcode) {
      showToast('카카오 주소 스크립트가 로드되지 않았습니다.', 'error');
      return;
    }

    const postcode = new window.daum.Postcode({
      // ✅ defaultQuery로 초기값 설정 (공식 옵션)
      defaultQuery: ocrAddress || '',
      oncomplete: (data) => {
        const road = data.roadAddress || '';
        const jibun = data.jibunAddress || '';

        let extra = '';
        if (data.bname && /[동|로|가]$/g.test(data.bname)) extra += data.bname;
        if (data.buildingName && data.apartment === 'Y') {
          extra += (extra ? ', ' : '') + data.buildingName;
        }
        if (extra) extra = ` (${extra})`;

        const baseAddress = road ? `${road}${extra}` : jibun;

        setFormData((prev) => {
          const nextRoad = baseAddress;
          return {
            ...prev,
            roadAddress: nextRoad,
            address: buildAddress(nextRoad, prev.detailAddress),
          };
        });
      },
    });

    postcode.open();

    // ✅ defaultQuery가 동작하지 않는 환경 방어:
    // 팝업 iframe이 마운트된 뒤 검색창 input에 직접 값 주입
    if (ocrAddress) {
      setTimeout(() => {
        try {
          // 카카오 팝업은 layer div 안의 iframe으로 렌더링됨
          const iframes = document.querySelectorAll('iframe');
          for (const iframe of iframes) {
            try {
              const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
              if (!iframeDoc) continue;
              const searchInput = iframeDoc.querySelector('input[id*="search"]') ||
                iframeDoc.querySelector('input[type="text"]');
              if (searchInput) {
                // 현재 값이 이미 채워져 있으면 중복 주입 안 함
                if (!searchInput.value) {
                  searchInput.value = ocrAddress;
                  searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
                break;
              }
            } catch (_) {
              // cross-origin iframe 접근 불가는 무시
            }
          }
        } catch (_) { /* 무시 */ }
      }, 400);
    }
  };

  const handleDetailAddressChange = (e) => {
    const detail = e.target.value;

    // ✅ 상세주소 변경 시: address도 "road | detail" 규칙으로 업데이트
    setFormData((prev) => ({
      ...prev,
      detailAddress: detail,
      address: buildAddress(prev.roadAddress, detail),
    }));
  };

  /* ==========================
   * ✅ [Step 1] 이메일 인증 로직(백엔드 연결)
   * ========================== */
  const handleSendEmailCode = async () => {
    if (!formData.email) return showToast('이메일을 입력해주세요.', 'warn');

    try {
      await passwordCodeService.send(formData.email);
      showToast('인증번호가 발송되었습니다.', 'success');
      setEmailSecondsLeft(EMAIL_EXPIRE_SECONDS);
      setEmailTimerRunning(true);
      setFormData((prev) => ({ ...prev, emailCode: '' }));
      setVerified((prev) => ({ ...prev, email: false }));
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || '인증번호 발송에 실패했습니다.', 'error');
    }
  };

  const handleEmailVerify = async () => {
    if (!formData.email) return showToast('이메일을 입력해주세요.', 'warn');
    if (emailSecondsLeft <= 0) return showToast('인증번호가 만료되었습니다. 다시 전송해주세요.', 'warn');
    if (!formData.emailCode) return showToast('인증번호를 입력해주세요.', 'warn');

    try {
      await passwordCodeService.verify({
        email: formData.email,
        code: formData.emailCode,
      });
      showToast('인증이 완료되었습니다.', 'success');
      setVerified((prev) => ({ ...prev, email: true }));
      setStep(2);
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || '인증번호가 올바르지 않습니다.', 'error');
    }
  };

  /* ==========================
   * [Step 2] 아이디 중복 체크 + 사번 preview
   * ========================== */
  const handleUserIdCheck = async () => {
    if (!formData.userId) return showToast('아이디를 입력해주세요.', 'warn');

    try {
      const idRes = await empService.checkId(formData.userId);
      if (!idRes.data.available) {
        return showToast('이미 사용 중인 아이디입니다.', 'error');
      }

      const noRes = await empService.previewEmpNo();
      const empNo = noRes.data.emp_no;

      setFormData((prev) => ({
        ...prev,
        empNo,
      }));

      setVerified((prev) => ({ ...prev, userId: true }));
      showToast('사용 가능한 아이디입니다.', 'success');
      setStep(3);
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || '아이디 확인 중 오류가 발생했습니다.', 'error');
    }
  };

  /* ==========================
   * [Step 3] 최종 회원가입
   * ========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return showToast('비밀번호가 일치하지 않습니다.', 'error');
    }

    if (!formData.roadAddress) {
      return showToast('주소 검색을 통해 주소를 선택해주세요.', 'warn');
    }

    const finalAddress = buildAddress(formData.roadAddress, formData.detailAddress);

    const payload = {
      emp_id: formData.userId,
      emp_no: formData.empNo,
      emp_name: formData.name,
      age: Number(formData.age),
      emp_pwd: formData.password,
      email: formData.email,
      phone: formData.phone,
      address: finalAddress,
      job: formData.position || '',
      profile_image_id: formData.profileImageId,
    };

    try {
      await empService.register(payload);
      showToast('회원가입이 완료되었습니다!', 'success');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;

      if (status === 409 && data?.errors?.new_emp_no) {
        setFormData((prev) => ({
          ...prev,
          empNo: data.errors.new_emp_no,
        }));
        showToast('사번이 갱신되었습니다. 다시 가입을 시도해주세요.', 'warn');
        return;
      }

      await deleteUploadedFileIfExists();
      showToast(data?.message || '회원가입에 실패했습니다.', 'error');
    }
  };

  // ✅ Step3에서 "이전 단계"로 돌아갈 때도 파일 정리(선택)
  const handlePrevToStep2 = async () => {
    await deleteUploadedFileIfExists();
    setStep(2);
  };

  return (
    <S.Container>
      {/* ✅ Toast 알림 */}
      <S.ToastWrapper>
        {toasts.map(t => {
          const icon = t.type === 'error' ? '❌' : t.type === 'success' ? '✅' : t.type === 'warn' ? '⚠️' : 'ℹ️';
          return <S.Toast key={t.id} $type={t.type}>{icon} {t.msg}</S.Toast>;
        })}
      </S.ToastWrapper>

      <S.ContentWrapper>
        {/* 왼쪽: 브랜드 섹션 */}
        <S.BrandSection>
          <S.BrandHeader>
            <S.LogoIcon />
            <S.BrandName>Control Tower</S.BrandName>
          </S.BrandHeader>

          <S.ServiceInfo>
            <S.ServiceTitle>Register</S.ServiceTitle>
            <S.ServiceDescription>
              {step === 1 && '먼저 이메일 인증을 진행해주세요.'}
              {step === 2 && '아이디를 확인하여 본인 인증을 진행합니다.'}
              {step === 3 && '마지막으로 개인정보를 입력하고 항공사를 선택하세요.'}
            </S.ServiceDescription>
          </S.ServiceInfo>

          {/* 단계 표시기 */}
          <S.Stepper>
            <S.Step $active={step >= 1}>1. 이메일</S.Step>
            <S.StepLine />
            <S.Step $active={step >= 2}>2. 아이디</S.Step>
            <S.StepLine />
            <S.Step $active={step >= 3}>3. 정보</S.Step>
          </S.Stepper>
        </S.BrandSection>

        {/* 오른쪽: 입력 폼 */}
        <S.RegisterSection>
          <S.RegisterCard>
            <S.RegisterHeader>
              <S.RegisterTitle>
                {step === 1 ? '이메일 확인' : step === 2 ? '아이디 중복 확인' : '정보 입력'}
              </S.RegisterTitle>
            </S.RegisterHeader>

            {/* --- Step 1: 이메일 인증 --- */}
            {step === 1 && (
              <S.RegisterForm>
                <S.InputGroup>
                  <S.InputLabel>이메일</S.InputLabel>
                  <S.InputRow>
                    <S.Input
                      name="email"
                      type="email"
                      placeholder="example@airline.com"
                      onChange={handleInputChange}
                      value={formData.email}
                    />
                    <S.SmallButton type="button" onClick={handleSendEmailCode}>
                      전송
                    </S.SmallButton>
                  </S.InputRow>
                </S.InputGroup>

                <S.InputGroup>
                  <S.InputLabel>인증번호</S.InputLabel>
                  <S.InputRow>
                    <S.Input
                      name="emailCode"
                      placeholder="인증번호 6자리"
                      onChange={handleInputChange}
                      value={formData.emailCode}
                      disabled={emailSecondsLeft === 0}
                    />

                    <S.TimerBadge $expired={emailSecondsLeft === 0}>
                      {emailSecondsLeft > 0 ? formatTime(emailSecondsLeft) : '만료'}
                    </S.TimerBadge>
                  </S.InputRow>
                </S.InputGroup>

                <S.SubmitButton
                  type="button"
                  onClick={handleEmailVerify}
                  disabled={emailSecondsLeft <= 0}
                >
                  인증 확인 후 다음
                </S.SubmitButton>
              </S.RegisterForm>
            )}

            {/* --- Step 2: 아이디 확인 --- */}
            {step === 2 && (
              <S.RegisterForm>
                <S.InputGroup>
                  <S.InputLabel>아이디 입력</S.InputLabel>
                  <S.Input
                    name="userId"
                    placeholder="아이디를 입력하세요"
                    onChange={handleInputChange}
                    value={formData.userId}
                  />
                </S.InputGroup>

                <S.SubmitButton type="button" onClick={handleUserIdCheck}>
                  아이디 중복 확인
                </S.SubmitButton>

                <S.PrevButton type="button" onClick={() => setStep(1)}>
                  이전 단계
                </S.PrevButton>
              </S.RegisterForm>
            )}

            {/* --- Step 3: 정보 입력 --- */}
            {step === 3 && (
              <S.RegisterForm onSubmit={handleSubmit}>

                {/* ✅ 명함 OCR 자동 입력 버튼 */}
                <S.OcrSection>
                  <S.OcrButton
                    type="button"
                    onClick={() => ocrInputRef.current?.click()}
                    disabled={isOcrLoading}
                  >
                    {isOcrLoading ? (
                      <>
                        <S.Spinner />
                        명함 분석 중입니다...
                      </>
                    ) : (
                      <>
                        📷 명함으로 간편 자동 입력
                      </>
                    )}
                  </S.OcrButton>

                  <input
                    ref={ocrInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleOcrUpload}
                    style={{ display: 'none' }}
                  />
                  <S.OcrHelperText>명함 사진을 업로드하면 이름, 전화번호 등이 자동으로 입력됩니다.</S.OcrHelperText>
                </S.OcrSection>

                <S.Divider><span>또는 직접 입력</span></S.Divider>
                <S.InputGroup>
                  <S.InputLabel>이메일</S.InputLabel>
                  <S.Input
                    name="email"
                    value={formData.email}
                    readOnly
                    placeholder="이메일"
                    style={{ background: theme?.background?.input || '#f3f4f6', cursor: 'not-allowed' }}
                  />
                </S.InputGroup>

                <S.RowGroup>
                  <S.InputGroup>
                    <S.InputLabel>아이디</S.InputLabel>
                    <S.Input
                      name="userId"
                      value={formData.userId}
                      readOnly
                      placeholder="아이디"
                      style={{ background: theme?.background?.input || '#f3f4f6', cursor: 'not-allowed' }}
                    />
                  </S.InputGroup>

                  <S.InputGroup>
                    <S.InputLabel>사번</S.InputLabel>
                    <S.Input
                      name="empNo"
                      value={formData.empNo || '사번 생성 대기'}
                      readOnly
                      placeholder="사번"
                      style={{ background: theme?.background?.input || '#f3f4f6', cursor: 'not-allowed' }}
                    />
                  </S.InputGroup>
                </S.RowGroup>

                {/* 프로필 이미지 업로드 */}
                <S.InputGroup>
                  <S.InputLabel>프로필 이미지 (선택)</S.InputLabel>
                  <S.ProfileImageSection>
                    <S.ProfileImagePreview>
                      {profilePreview ? (
                        <img src={profilePreview} alt="프로필 미리보기" />
                      ) : (
                        <S.ProfilePlaceholder>👤</S.ProfilePlaceholder>
                      )}
                    </S.ProfileImagePreview>

                    <S.ImageUploadButton
                      type="button"
                      onClick={() => document.getElementById('profileImageInput').click()}
                    >
                      이미지 선택
                    </S.ImageUploadButton>

                    <input
                      id="profileImageInput"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                  </S.ProfileImageSection>

                  <S.HelperText>
                    JPG, PNG 형식 (최대 5MB), 생략 가능
                    {formData.profileImageId ? ` (업로드 완료: fileId=${formData.profileImageId})` : ''}
                  </S.HelperText>
                </S.InputGroup>

                <S.RowGroup>
                  <S.InputGroup>
                    <S.InputLabel>이름</S.InputLabel>
                    <S.Input
                      name="name"
                      onChange={handleInputChange}
                      value={formData.name}
                      placeholder="실명 입력"
                      required
                    />
                  </S.InputGroup>

                  <S.InputGroup>
                    <S.InputLabel>나이</S.InputLabel>
                    <S.Input
                      name="age"
                      type="number"
                      onChange={handleInputChange}
                      value={formData.age}
                      placeholder="나이"
                      required
                    />
                  </S.InputGroup>
                </S.RowGroup>

                <S.InputGroup>
                  <S.InputLabel>전화번호</S.InputLabel>
                  <S.Input
                    name="phone"
                    type="tel"
                    onChange={handleInputChange}
                    value={formData.phone}
                    placeholder="010-1234-5678"
                    required
                  />
                </S.InputGroup>

                {/* ✅ 주소(카카오 주소검색 적용) */}
                <S.InputGroup>
                  <S.InputLabel>주소</S.InputLabel>

                  {/* 도로명/지번 주소(검색) + 버튼 */}
                  <S.InputRow>
                    <S.Input
                      name="roadAddress"
                      value={formData.roadAddress}
                      placeholder="주소검색 버튼을 눌러 선택하세요"
                      readOnly
                      required
                      style={{ background: theme?.background?.input || '#f3f4f6', cursor: 'not-allowed' }}
                    />
                    <S.SmallButton type="button" onClick={openKakaoAddressSearch}>
                      주소검색
                    </S.SmallButton>
                  </S.InputRow>

                  {/* ✅ OCR 추출 주소가 있을 때 힌트 표시 */}
                  {ocrAddress && (
                    <S.OcrHelperText style={{ marginTop: '6px' }}>
                      📍 명함에서 추출된 주소: <strong>{ocrAddress}</strong>
                      <br />위 [주소검색] 버튼을 누르면 검색창에 자동으로 입력됩니다.
                    </S.OcrHelperText>
                  )}

                  {/* 상세주소 */}
                  <S.Input
                    name="detailAddress"
                    value={formData.detailAddress}
                    onChange={handleDetailAddressChange}
                    placeholder="상세주소 (예: 101동 1001호)"
                  />

                  {/* 최종 저장되는 address 표시(선택) */}
                  <S.HelperText>
                    저장 주소: {buildAddress(formData.roadAddress, formData.detailAddress) || '(아직 선택되지 않음)'}
                  </S.HelperText>
                </S.InputGroup>

                <S.InputGroup>
                  <S.InputLabel>비밀번호</S.InputLabel>
                  <S.Input
                    type="password"
                    name="password"
                    onChange={handleInputChange}
                    value={formData.password}
                    placeholder="비밀번호"
                    required
                  />
                </S.InputGroup>

                <S.InputGroup>
                  <S.InputLabel>비밀번호 확인</S.InputLabel>
                  <S.Input
                    type="password"
                    name="confirmPassword"
                    onChange={handleInputChange}
                    value={formData.confirmPassword}
                    placeholder="비밀번호 확인"
                    required
                  />
                </S.InputGroup>

                <S.SubmitButton type="submit">가입 요청하기</S.SubmitButton>

                <S.PrevButton type="button" onClick={handlePrevToStep2}>
                  이전 단계
                </S.PrevButton>
              </S.RegisterForm>
            )}

            <S.LoginLink onClick={() => navigate('/login')}>로그인 화면으로 돌아가기</S.LoginLink>
          </S.RegisterCard>
        </S.RegisterSection>
      </S.ContentWrapper>
    </S.Container>
  );
};

export default Register;
