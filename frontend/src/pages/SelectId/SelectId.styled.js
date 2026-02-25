import styled from "styled-components";

/** ✅ 단일 그레이 토큰: 테마(primary/secondary)에 의존하지 않음 */
const TOKENS = {
  pageBg: "linear-gradient(117deg, rgba(17,24,39,0.08) 0%, #FFFFFF 100%)",
  cardBg: "#FFFFFF",
  textPrimary: "#1D2838",
  textSecondary: "#495565",
  textTertiary: "#717182",
  inputBg: "#F3F3F5",
  inputHoverBg: "#EBEBED",
  border: "rgba(17,24,39,0.12)",
  shadow: "0px 8px 10px -6px rgba(0, 0, 0, 0.1), 0px 20px 25px -5px rgba(0, 0, 0, 0.1)",

  // ✅ 버튼/포인트 색 (진회색)
  accent: "#111827",
  accentHover: "#0B1220",     // hover 시 살짝 더 진하게
  accentSoft: "rgba(17,24,39,0.06)",
  accentSoftBorder: "rgba(17,24,39,0.18)",
};

export const S = {
  Container: styled.main`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    background: ${({ theme }) => theme.background.main || '#f3f4f6'};
    /* background: ${TOKENS.pageBg}; */
    padding: 0;
    margin: 0;
    overflow: hidden;
  `,

  FindCard: styled.article`
    background: ${({ theme }) => theme.background.paper || '#FFFFFF'};
    border-radius: 16px;
    box-shadow: ${({ theme }) => theme.shadow || '0 20px 40px rgba(0,0,0,0.08)'};
    padding: 48px 56px 56px;
    width: 100%;
    max-width: 520px;
    display: flex;
    flex-direction: column;
    gap: 32px;
    border: 1px solid ${({ theme }) => theme.border};

    @media (max-width: 1024px) {
      max-width: 448px;
      padding: 32px;
    }
  `,

  CardHeader: styled.header`
    display: flex;
    flex-direction: column;
    gap: 10px;
    text-align: center;
  `,

  Title: styled.h1`
    font-size: 32px;
    font-weight: 700;
    color: ${({ theme }) => theme.text.primary};
    margin: 0;
    letter-spacing: -0.02em;
    line-height: 1.2;

    @media (max-width: 1024px) {
      font-size: 30px;
    }
  `,

  Subtitle: styled.p`
    font-size: 17px;
    font-weight: 400;
    color: ${({ theme }) => theme.text.secondary};
    margin: 0;
    line-height: 1.5;

    @media (max-width: 1024px) {
      font-size: 16px;
    }
  `,

  FindForm: styled.form`
    display: flex;
    flex-direction: column;
    gap: 24px;
  `,

  InputGroup: styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
  `,

  Label: styled.label`
    font-size: 15px;
    font-weight: 400;
    color: ${({ theme }) => theme.text.primary};
    line-height: 1;

    @media (max-width: 1024px) {
      font-size: 14px;
    }
  `,

  Input: styled.input`
    width: 100%;
    padding: 12px 16px;
    background: ${({ theme }) => theme.background.input || '#F3F3F5'};
    border: 1px solid ${({ theme }) => theme.border || 'transparent'};
    border-radius: 8px;
    font-size: 15px;
    color: ${({ theme }) => theme.text.primary};
    transition: all 0.2s ease;
    box-sizing: border-box;

    &::placeholder {
      color: ${({ theme }) => theme.text.tertiary || '#717182'};
    }

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
      background: ${({ theme }) => theme.background.paper || '#FFFFFF'};
      box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}20`};
    }

    &:hover:not(:focus) {
      background: ${({ theme }) => theme.background.hover || '#EBEBED'};
    }

    @media (max-width: 1024px) {
      font-size: 14px;
    }
  `,

  SubmitButton: styled.button`
    width: 100%;
    padding: 12px 20px;
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.text.inverse || '#FFFFFF'};
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-top: 8px;

    &:hover {
      background: ${({ theme }) => theme.colors.primaryHover || theme.colors.primary};
      transform: translateY(-1px);
      box-shadow: 0 4px 16px ${({ theme }) => `${theme.colors.primary}50`};
    }

    &:active {
      transform: translateY(0);
    }

    &:disabled {
      background: ${({ theme }) => theme.text.disabled || '#CCCCCC'};
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    @media (max-width: 1024px) {
      font-size: 14px;
    }
  `,

  ResultSection: styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 20px;
    background: ${({ theme }) => theme.background.secondary || '#f9fafb'};
    border: 1px solid ${({ theme }) => theme.colors.primary};
    border-radius: 8px;
    text-align: center;
  `,

  ResultLabel: styled.span`
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.text.secondary};
  `,

  ResultValue: styled.span`
    font-size: 20px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary};
    letter-spacing: 0.05em;
  `,

  FooterLinks: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-top: 8px;
  `,

  FooterLink: styled.button`
    background: none;
    border: none;
    color: ${({ theme }) => theme.text.secondary};
    font-size: 16px;
    font-weight: 400;
    cursor: pointer;
    padding: 0;
    transition: all 0.2s ease;
    white-space: nowrap;

    &:hover {
      color: ${({ theme }) => theme.text.primary};
      text-decoration: underline;
    }

    @media (max-width: 1024px) {
      font-size: 15px;
    }
  `,

  Divider: styled.span`
    color: ${({ theme }) => theme.text.tertiary || '#99A1AE'};
    font-size: 14px;
    font-weight: 400;
    user-select: none;
  `,
};
