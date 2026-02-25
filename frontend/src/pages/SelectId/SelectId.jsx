import React, { useState } from 'react';
import { S } from './SelectId.styled';
import { useNavigate } from 'react-router-dom';
import { empService } from '../../api/emp/empService'; 

const FindEmployeeId = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const [foundEmployeeId, setFoundEmployeeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 초기화
    setErrorMsg('');
    setFoundEmployeeId(null);

    // 서버 DTO 규격에 맞춰 변환 (핵심)
    const payload = {
      emp_name: formData.name,
      email: formData.email,
    };

    try {
      setLoading(true);

      const res = await empService.findEmpId(payload);

      // ApiResponse.success 래핑 해제
      const { success, message, data } = res.data;

      if (!success) {
        // 서버가 success=false를 쓰는 구조라면
        setErrorMsg(message || '아이디 찾기에 실패했습니다.');
        return;
      }

      // data: { found, emp_id, message }
      if (data?.found && data?.emp_id) {
        setFoundEmployeeId(data.emp_id);
      } else {
        setErrorMsg(data?.message || '일치하는 정보가 없습니다.');
      }
    } catch (err) {
      // axios 에러 형태 대응
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        '서버 요청 중 오류가 발생했습니다.';
      setErrorMsg(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <S.Container>
      <S.FindCard>
        <S.CardHeader>
          <S.Title>아이디 찾기</S.Title>
          <S.Subtitle>가입 시 입력한 정보를 입력하세요</S.Subtitle>
        </S.CardHeader>

        <S.FindForm onSubmit={handleSubmit}>
          <S.InputGroup>
            <S.Label>이름</S.Label>
            <S.Input
              type="text"
              name="name"
              placeholder="이름을 입력하세요"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </S.InputGroup>

          <S.InputGroup>
            <S.Label>이메일</S.Label>
            <S.Input
              type="email"
              name="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </S.InputGroup>

          <S.SubmitButton type="submit" disabled={loading}>
            {loading ? '조회 중...' : '아이디 찾기'}
          </S.SubmitButton>
        </S.FindForm>

        {/* 에러 메시지 */}
        {errorMsg && (
          <S.ResultSection>
            <S.ResultLabel>안내</S.ResultLabel>
            <S.ResultValue>{errorMsg}</S.ResultValue>
          </S.ResultSection>
        )}

        {/* 성공 결과 */}
        {foundEmployeeId && (
          <S.ResultSection>
            <S.ResultLabel>찾은 아이디</S.ResultLabel>
            <S.ResultValue>{foundEmployeeId}</S.ResultValue>
          </S.ResultSection>
        )}

        <S.FooterLinks>
          <S.FooterLink onClick={() => handleNavigation('/login')}>
            로그인
          </S.FooterLink>
          <S.Divider>|</S.Divider>
          <S.FooterLink onClick={() => handleNavigation('/find-password')}>
            비밀번호 찾기
          </S.FooterLink>
          <S.Divider>|</S.Divider>
          <S.FooterLink onClick={() => handleNavigation('/register')}>
            회원가입
          </S.FooterLink>
        </S.FooterLinks>
      </S.FindCard>
    </S.Container>
  );
};

export default FindEmployeeId;
