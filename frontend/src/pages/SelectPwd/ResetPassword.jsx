import React, { useEffect, useMemo, useState } from "react";
import { S } from "./SelectPwd.styled";
import { useNavigate, useSearchParams } from "react-router-dom";
import { passwordResetService } from "../../api/auth/passwordResetService";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const token = useMemo(() => params.get("token") || "", [params]);

  const [checking, setChecking] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [message, setMessage] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (!token) {
        setChecking(false);
        setTokenValid(false);
        setMessage("토큰이 없습니다. 이메일의 링크를 다시 확인해주세요.");
        return;
      }

      setChecking(true);
      setMessage("");

      try {
        const res = await passwordResetService.validate(token);

        const data = res?.data;

        const ok =
          data?.valid === true ||
          data?.success === true ||
          data?.isValid === true;

        if (ok) {
          setTokenValid(true);
          setMessage("새 비밀번호를 입력해주세요.");
        } else {
          setTokenValid(false);
          setMessage(data?.message || "유효하지 않거나 만료된 링크입니다.");
        }
      } catch (err) {
        console.error(err);
        setTokenValid(false);
        setMessage("유효성 확인 중 오류가 발생했습니다.");
      } finally {
        setChecking(false);
      }
    };

    run();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tokenValid) return;


    if (newPassword !== confirm) {
      setMessage("비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      await passwordResetService.reset({ token, newPassword });
      setMessage("비밀번호가 변경되었습니다. 로그인 페이지로 이동합니다.");

      setTimeout(() => navigate("/login"), 700);
    } catch (err) {
      console.error(err);
      setMessage("비밀번호 변경에 실패했습니다. 링크 만료 여부를 확인해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <S.Container>
      <S.FindCard>
        <S.CardHeader>
          <S.Title>비밀번호 재설정</S.Title>
          <S.Subtitle>새 비밀번호를 설정하세요</S.Subtitle>
        </S.CardHeader>

        <S.FindForm onSubmit={handleSubmit}>
          <S.InputGroup>
            <S.Label>새 비밀번호</S.Label>
            <S.Input
              type="password"
              name="newPassword"
              placeholder="비밀번호 입력"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={checking || submitting || !tokenValid}
              required
            />
          </S.InputGroup>

          <S.InputGroup>
            <S.Label>비밀번호 확인</S.Label>
            <S.Input
              type="password"
              name="confirm"
              placeholder="비밀번호를 한 번 더 입력"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={checking || submitting || !tokenValid}
              required
            />
          </S.InputGroup>

          <S.SubmitButton
            type="submit"
            disabled={checking || submitting || !tokenValid}
          >
            {checking ? "링크 확인 중..." : submitting ? "변경 중..." : "비밀번호 변경"}
          </S.SubmitButton>
        </S.FindForm>

        {message && <S.InfoMessage>{message}</S.InfoMessage>}

        <S.FooterLinks>
          <S.FooterLink onClick={() => navigate("/login")}>로그인</S.FooterLink>
          <S.Divider>|</S.Divider>
          <S.FooterLink onClick={() => navigate("/find-password")}>
            비밀번호 찾기
          </S.FooterLink>
        </S.FooterLinks>
      </S.FindCard>
    </S.Container>
  );
};

export default ResetPassword;
