import React, { useState } from "react";
import { S } from "./SelectPwd.styled";
import { useNavigate } from "react-router-dom";
import {passwordResetService} from "../../api/auth/passwordResetService";

const FindPassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    employeeId: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [mailSent, setMailSent] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendResetLink = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setMailSent(false);

    try {
      // ✅ 백엔드 DTO는 empId를 받음 → employeeId를 empId로 매핑
      await passwordResetService.sendResetLink({
        empId: formData.employeeId,
        email: formData.email,
      });

      // ✅ 백엔드가 “계정 없으면 그냥 return” 처리(보안) 하니까
      // 프론트는 항상 동일 문구로 안내하는 게 맞음
      setMailSent(true);
      setMessage("요청이 접수되었습니다. 이메일을 확인해 비밀번호 재설정 링크로 이동해주세요.");
    } catch (err) {
      console.error(err);
      setMessage("요청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (path) => navigate(path);

  return (
    <S.Container>
      <S.FindCard>
        <S.CardHeader>
          <S.Title>비밀번호 찾기</S.Title>
          <S.Subtitle>가입 시 입력한 정보를 입력하세요</S.Subtitle>
        </S.CardHeader>

        <S.FindForm onSubmit={handleSendResetLink}>
          <S.InputGroup>
            <S.Label>아이디</S.Label>
            <S.Input
              type="text"
              name="employeeId"
              placeholder="아이디를 입력하세요"
              value={formData.employeeId}
              onChange={handleInputChange}
              disabled={loading || mailSent}
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
              disabled={loading || mailSent}
              required
            />
          </S.InputGroup>

          <S.SubmitButton type="submit" disabled={loading}>
            {loading ? "처리 중..." : "재설정 링크 보내기"}
          </S.SubmitButton>
        </S.FindForm>

        {(mailSent || message) && <S.InfoMessage>{message}</S.InfoMessage>}

        <S.FooterLinks>
          <S.FooterLink onClick={() => handleNavigation("/login")}>로그인</S.FooterLink>
          <S.Divider>|</S.Divider>
          <S.FooterLink onClick={() => handleNavigation("/find-employee-id")}>
            아이디 찾기
          </S.FooterLink>
          <S.Divider>|</S.Divider>
          <S.FooterLink onClick={() => handleNavigation("/register")}>회원가입</S.FooterLink>
        </S.FooterLinks>
      </S.FindCard>
    </S.Container>
  );
};

export default FindPassword;
