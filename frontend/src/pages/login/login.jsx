import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAirlineTheme } from '../../context/AirlineThemeContext';
import useAuthStore from '../../store/authStore';
import * as S from './Login.styled';

const Login = () => {
  const navigate = useNavigate();
  const { theme } = useAirlineTheme();

  const { loginFlow, getRole } = useAuthStore();

  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    rememberMe: false,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedId = localStorage.getItem('savedId');
    if (savedId) {
      setFormData((prev) => ({
        ...prev,
        userId: savedId,
        rememberMe: true,
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const empId = formData.userId.trim();
    const empPwd = formData.password;

    if (!empId || !empPwd) {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    if (formData.rememberMe) localStorage.setItem('savedId', empId);
    else localStorage.removeItem('savedId');

    setLoading(true);

    try {
      console.log('[LOGIN] try', { empId });

      await loginFlow({ empId, empPwd });

      const role = getRole?.() ?? null;

      // 분기 로직(현재는 이동 경로 고정이라 해도 남겨둠)
      let dashboardPath = '/dashboard';
      if (role === 'SUPER_ADMIN') dashboardPath = '/super-admin-dashboard';
      else if (role === 'ADMIN') dashboardPath = '/admin-dashboard';

      // ✅ 요구사항: 실제 이동은 항상 /dashboard
      navigate('/dashboard', { replace: true });
    } catch (err) {
      // axios 에러면 err.response도 있을 수 있고
      // 우리가 throw new Error로 던진 것도 있을 수 있음
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        '로그인에 실패했습니다.';

      console.log('[LOGIN] error', err);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    '간편한 근태 관리 및 일정 조회',
    '효율적 급여 관리 프로그램',
    '실시간 통지 승인 시스템',
    '스트레스 없는 쉬운 리포트',
  ];

  return (
    <S.Container>
      <S.ContentWrapper>
        <S.BrandSection>
          <S.BrandHeader>
            <S.ServiceTitle>
              <S.LogoIcon />
              Control Tower
            </S.ServiceTitle>
          </S.BrandHeader>

          <S.ServiceInfo>

            <S.ServiceSubtitle>통합 HR 시스템</S.ServiceSubtitle>
            <S.ServiceDescription>
              {theme.name} 임직원을 위한 통합 HR 관리 시스템 입니다. 근태 관리, 전자 결재,
              휴가 신청 등 모든 HR 서비스를 한 곳에서 관리하세요.
            </S.ServiceDescription>
          </S.ServiceInfo>

          <S.FeatureList>
            {features.map((feature, index) => (
              <S.FeatureItem key={index}>
                <S.FeatureCheckIcon />
                <S.FeatureText>{feature}</S.FeatureText>
              </S.FeatureItem>
            ))}
          </S.FeatureList>
        </S.BrandSection>

        <S.LoginSection>
          <S.LoginCard>
            <S.LoginHeader>
              <S.LoginTitle>로그인</S.LoginTitle>
              <S.LoginSubtitle>아이디와 비밀번호를 입력하여 로그인해주세요</S.LoginSubtitle>
            </S.LoginHeader>

            <S.LoginForm onSubmit={handleSubmit}>
              <S.InputGroup>
                <S.InputLabel>
                  <S.UserIcon />
                  아이디
                </S.InputLabel>
                <S.Input
                  type="text"
                  name="userId"
                  placeholder="아이디를 입력하세요"
                  value={formData.userId}
                  onChange={handleInputChange}
                  autoComplete="username"
                  required
                  disabled={loading}
                />
              </S.InputGroup>

              <S.InputGroup>
                <S.InputLabel>
                  <S.LockIcon />
                  비밀번호
                </S.InputLabel>
                <S.Input
                  type="password"
                  name="password"
                  placeholder="비밀번호를 입력하세요"
                  value={formData.password}
                  onChange={handleInputChange}
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />
              </S.InputGroup>

              <S.RememberMeRow>
                <S.CheckboxWrapper>
                  <S.Checkbox
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                  <S.CheckboxLabel htmlFor="rememberMe">아이디 저장</S.CheckboxLabel>
                </S.CheckboxWrapper>
              </S.RememberMeRow>

              <S.SubmitButton type="submit" disabled={loading}>
                {loading ? '로그인 중...' : '로그인'}
                <S.ArrowIcon />
              </S.SubmitButton>
            </S.LoginForm>

            <S.FooterLinks>
              <S.FooterLink onClick={() => navigate('/register')}>
                <S.HelpIcon />
                회원가입
              </S.FooterLink>
              <S.FooterDivider />
              <S.FooterLink onClick={() => navigate('/find-employee-id')}>
                <S.InfoIcon />
                아이디 찾기
              </S.FooterLink>
              <S.FooterDivider />
              <S.FooterLink onClick={() => navigate('/find-password')}>
                <S.InfoIcon />
                비밀번호 찾기
              </S.FooterLink>
            </S.FooterLinks>
          </S.LoginCard>
        </S.LoginSection>
      </S.ContentWrapper>
    </S.Container>
  );
};

export default Login;
