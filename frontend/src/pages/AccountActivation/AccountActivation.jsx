import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import * as S from './AccountActivation.styled';
import InitialSetup from './InitialSetup';
import { accountActivationService } from '../../api/account-activation/services';

const AccountActivation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState({
    service: false,
    privacy: false,
  });
  const [isActivationComplete, setIsActivationComplete] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('유효하지 않은 활성화 링크입니다.');
      setLoading(false);
      return;
    }

    const fetchActivationInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await accountActivationService.getActivationInfo(token);
        setUserInfo({
          email: response.data.email,
          country: response.data.country,
          role: response.data.airlineName,
          airlineAddress: response.data.airlineAddress,
          activationDate: new Date(response.data.activationDate).toLocaleString('ko-KR'),
        });
      } catch (err) {
        console.error('활성화 정보 로드 실패:', err);
        const errorMessage = err.response?.data?.message || '활성화 정보를 불러오는데 실패했습니다.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchActivationInfo();
  }, [token]);

  // 비밀번호 검증 함수들
  const passwordValidations = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*]/.test(password),
    passwordsMatch: passwordConfirm && password === passwordConfirm
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordConfirmChange = (e) => {
    setPasswordConfirm(e.target.value);
  };

  const handleTermsToggle = (type) => {
    setTermsAgreed(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const handleSubmit = async () => {
    if (!token) {
      alert('유효하지 않은 활성화 링크입니다.');
      return;
    }

    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await accountActivationService.activateAccount(token, password, passwordConfirm);
      alert('계정 활성화가 완료되었습니다.');
      setIsActivationComplete(true);
    } catch (err) {
      console.error('계정 활성화 실패:', err);
      const errorMessage = err.response?.data?.message || '계정 활성화에 실패했습니다.';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid = password && passwordConfirm && 
                      termsAgreed.service && termsAgreed.privacy;

  // 활성화 완료 시 초기 설정 페이지 렌더링
  if (isActivationComplete) {
    return <InitialSetup token={token} initialData={userInfo} />;
  }

  if (loading) {
    return (
      <S.MainContainer>
        <S.ContentWrapper>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>정보를 불러오는 중...</p>
          </div>
        </S.ContentWrapper>
      </S.MainContainer>
    );
  }

  if (error && !userInfo) {
    return (
      <S.MainContainer>
        <S.ContentWrapper>
          <div style={{ textAlign: 'center', padding: '50px', color: '#dc2626' }}>
            <p>{error}</p>
            <button onClick={() => navigate('/')} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}>
              홈으로 돌아가기
            </button>
          </div>
        </S.ContentWrapper>
      </S.MainContainer>
    );
  }

  return (
    <S.MainContainer>
      <S.ContentWrapper>
        <S.Header>
          <S.StepIndicator>
            <S.Step active>
              <S.StepNumber>1</S.StepNumber>
              <S.StepLabel>계정 활성화</S.StepLabel>
            </S.Step>
            <S.Step>
              <S.StepNumber>2</S.StepNumber>
              <S.StepLabel>추가 설정</S.StepLabel>
            </S.Step>
          </S.StepIndicator>
        </S.Header>

        <S.FormCard>
          <S.IconWrapper>
            <S.ShieldIcon>🛡️</S.ShieldIcon>
          </S.IconWrapper>

          <S.Title>계정 활성화</S.Title>
          <S.Subtitle>
            항공사 관리자 계정을 활성화하고 보안 설정을 완료하세요
          </S.Subtitle>

          {error && (
            <div style={{ color: '#dc2626', textAlign: 'center', marginBottom: '20px' }}>
              {error}
            </div>
          )}

          {/* Section 1: 본인 확인 정보 */}
          {userInfo && (
            <S.Section>
              <S.SectionHeader>
                <S.SectionNumber>1</S.SectionNumber>
                <S.SectionTitle>본인 확인 정보</S.SectionTitle>
              </S.SectionHeader>

              <S.InfoGrid>
                <S.InfoItem>
                  <S.InfoLabel>이메일</S.InfoLabel>
                  <S.InfoValue>{userInfo.email}</S.InfoValue>
                </S.InfoItem>
                <S.InfoItem>
                  <S.InfoLabel>항공사명</S.InfoLabel>
                  <S.InfoValue>{userInfo.role}</S.InfoValue>
                </S.InfoItem>
                <S.InfoItem>
                  <S.InfoLabel>국가</S.InfoLabel>
                  <S.InfoValue>{userInfo.country}</S.InfoValue>
                </S.InfoItem>
                <S.InfoItem>
                  <S.InfoLabel>승인 일시</S.InfoLabel>
                  <S.InfoValue>{userInfo.activationDate}</S.InfoValue>
                </S.InfoItem>
              </S.InfoGrid>
            </S.Section>
          )}

          {/* Section 2: 비밀번호 설정 */}
          <S.Section>
            <S.SectionHeader>
              <S.SectionNumber>2</S.SectionNumber>
              <S.SectionTitle>비밀번호 설정</S.SectionTitle>
            </S.SectionHeader>

            <S.PasswordField>
              <S.Label>비밀번호</S.Label>
              <S.InputWrapper>
                <S.Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                />
                <S.ToggleButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </S.ToggleButton>
              </S.InputWrapper>
            </S.PasswordField>

            <S.PasswordField>
              <S.Label>비밀번호 확인</S.Label>
              <S.InputWrapper>
                <S.Input
                  type={showPasswordConfirm ? 'text' : 'password'}
                  value={passwordConfirm}
                  onChange={handlePasswordConfirmChange}
                  placeholder="비밀번호를 다시 입력하세요"
                />
                <S.ToggleButton onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}>
                  {showPasswordConfirm ? '👁️' : '👁️‍🗨️'}
                </S.ToggleButton>
              </S.InputWrapper>
            </S.PasswordField>

            <S.PasswordHint>
              <S.HintList>
                <S.HintItem $valid={passwordValidations.minLength}>
                  {passwordValidations.minLength ? '✓' : '○'} 최소 8자 이상
                </S.HintItem>
                <S.HintItem $valid={passwordValidations.hasUpperCase && passwordValidations.hasLowerCase}>
                  {passwordValidations.hasUpperCase && passwordValidations.hasLowerCase ? '✓' : '○'} 영문 대문자, 소문자 포함
                </S.HintItem>
                <S.HintItem $valid={passwordValidations.hasNumber}>
                  {passwordValidations.hasNumber ? '✓' : '○'} 숫자 포함
                </S.HintItem>
                <S.HintItem $valid={passwordValidations.hasSpecialChar}>
                  {passwordValidations.hasSpecialChar ? '✓' : '○'} 특수문자 포함 (!@#$%^&*)
                </S.HintItem>
                <S.HintItem $valid={passwordValidations.passwordsMatch}>
                  {passwordValidations.passwordsMatch ? '✓' : '○'} 비밀번호 일치
                </S.HintItem>
              </S.HintList>
            </S.PasswordHint>
          </S.Section>

          {/* Section 3: 약관 동의 */}
          <S.Section>
            <S.SectionHeader>
              <S.SectionNumber>3</S.SectionNumber>
              <S.SectionTitle>약관 동의</S.SectionTitle>
            </S.SectionHeader>

            <S.TermsBox>
              <S.TermItem>
                <S.Checkbox
                  type="checkbox"
                  checked={termsAgreed.service}
                  onChange={() => handleTermsToggle('service')}
                />
                <S.TermLabel>
                  (필수) 서비스 이용약관에 동의합니다
                </S.TermLabel>
                <S.TermLink href="#">📄</S.TermLink>
              </S.TermItem>
              <S.TermDescription>
                항공사 관리자로서 권한과 책임에 대한 내용을 확인하세요
              </S.TermDescription>

              <S.TermItem>
                <S.Checkbox
                  type="checkbox"
                  checked={termsAgreed.privacy}
                  onChange={() => handleTermsToggle('privacy')}
                />
                <S.TermLabel>
                  (필수) 개인정보 처리방침에 동의합니다
                </S.TermLabel>
                <S.TermLink href="#">📄</S.TermLink>
              </S.TermItem>
              <S.TermDescription>
                개인정보 수집, 이용 및 보호에 대한 내용을 확인하세요
              </S.TermDescription>
            </S.TermsBox>
          </S.Section>

          <S.SubmitButton 
            disabled={!isFormValid || submitting}
            onClick={handleSubmit}
          >
            {submitting ? '처리 중...' : '계정 활성화 완료'}
          </S.SubmitButton>
        </S.FormCard>
      </S.ContentWrapper>
    </S.MainContainer>
  );
};

export default AccountActivation;