import React, { useRef, useState } from 'react';
import { S } from './WorkLogin.styled';
import api from '../../api/axios'; // 경로는 프로젝트에 맞게

const AttendanceLogin = () => {
  const [formData, setFormData] = useState({ userId: '', password: '' });
  const [loading, setLoading] = useState(false);
  const inFlightRef = useRef(false); // ✅ 중복 요청 방지 락

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ 로딩 중 Enter 연타 방지(선택)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (loading || inFlightRef.current)) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const doKioskAttendance = async () => {
    // ✅ 실제 네트워크 요청 로직만 분리
    // 1) 로그인
    const loginRes = await api.post('/api/auth/login', {
      empId: formData.userId,
      empPwd: formData.password,
    });

    const accessToken =
      loginRes?.data?.token ?? loginRes?.data?.accessToken ?? loginRes?.token;

    if (!accessToken) throw new Error('로그인 응답에 토큰이 없습니다.');

    const authHeaders = { headers: { Authorization: `Bearer ${accessToken}` } };

    // 2) 오늘 근태 조회
    const todayRes = await api.get('/api/attendance/today', authHeaders);
    const today = todayRes.data;

    // 3) 상태에 따라 출근/퇴근 처리
    if (!today?.inTime) {
      await api.post('/api/attendance/check-in', null, authHeaders);
      return { type: 'CHECK_IN' };
    }

    if (!today?.outTime) {
      await api.post('/api/attendance/check-out', null, authHeaders);
      return { type: 'CHECK_OUT' };
    }

    return { type: 'ALREADY_DONE' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ 이미 진행 중이면 즉시 차단
    if (inFlightRef.current) return;

    // ✅ 1) 먼저 확인창을 띄우고(요청 보내기 전)
    const ok = window.confirm('출근 또는 퇴근 하시겠습니까?');
    if (!ok) return; // ❌ 취소면 요청을 절대 보내지 않음

    // ✅ 2) 확인을 눌렀을 때만 잠금 + 로딩 시작
    inFlightRef.current = true;
    setLoading(true);

    try {
      const result = await doKioskAttendance();

      if (result.type === 'CHECK_IN') alert('출근 완료');
      else if (result.type === 'CHECK_OUT') alert('퇴근 완료');
      else alert('이미 출근/퇴근 처리가 완료되었습니다.');

      window.location.href = '/';
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        '처리 중 오류가 발생했습니다.';
      alert(msg);
    } finally {
      setLoading(false);
      inFlightRef.current = false;
    }
  };

  return (
    <S.Container>
      <S.LoginWrapper>
        <S.LoginCard>
          <S.CardHeader>
            <S.Title>출/퇴근 로그인</S.Title>
            <S.Subtitle>아이디와 비밀번호를 입력하여 로그인해주세요</S.Subtitle>
          </S.CardHeader>

          <S.LoginForm onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
            <S.InputGroup>
              <S.InputLabel>
                아이디
              </S.InputLabel>
              <S.Input
                type="text"
                name="userId"
                placeholder="아이디를 입력하세요"
                value={formData.userId}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </S.InputGroup>

            <S.InputGroup>
              <S.InputLabel>
                비밀번호
              </S.InputLabel>
              <S.Input
                type="password"
                name="password"
                placeholder="비밀번호를 입력하세요"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </S.InputGroup>

            <S.SubmitButton type="submit" disabled={loading}>
              {loading ? '처리중...' : '로그인'}
              <S.ArrowIcon />
            </S.SubmitButton>
          </S.LoginForm>
        </S.LoginCard>
      </S.LoginWrapper>
    </S.Container>
  );
};

export default AttendanceLogin;