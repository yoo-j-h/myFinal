import styled from 'styled-components';

export const S = {
  Container: styled.main`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
   
    background: ${({ theme }) =>
      theme.mode === 'dark'
        ? `linear-gradient(180deg, ${theme.background.main} 0%, #0f172a 100%)`
        : `linear-gradient(180deg, #FFFFFF 0%, #f1f5f9 100%)`
    };
    position: relative;
    padding: 40px 20px;
    color: ${({ theme }) => theme.text.primary};
  `,

  LoginWrapper: styled.div`
    width: 100%;
   
    max-width: 520px;
    display: flex;
    justify-content: center;

    @media (max-width: 1024px) {
      max-width: 440px;
    }
  `,

  LoginCard: styled.article`
    background: ${({ theme }) => theme.background.paper};
    border-radius: 20px;
    box-shadow: ${({ theme }) => theme.shadow || '0 12px 48px rgba(0, 0, 0, 0.15)'};
    padding: 56px 48px;
    width: 100%;

    @media (max-width: 1024px) {
      padding: 48px 40px;
      border-radius: 16px;
    }
  `,

  CardHeader: styled.header`
    margin-bottom: 40px;
    text-align: left;

    @media (max-width: 1024px) {
      margin-bottom: 32px;
    }
  `,

  Title: styled.h1`
    font-size: 28px;
    font-weight: 700;
    color: ${({ theme }) => theme.text.primary};
    margin: 0 0 12px 0;
    letter-spacing: -0.03em;
    line-height: 1.3;

    @media (max-width: 1024px) {
      font-size: 24px;
      margin-bottom: 8px;
    }
  `,

  Subtitle: styled.p`
    font-size: 15px;
    font-weight: 400;
    color: ${({ theme }) => theme.text.secondary};
    margin: 0;
    line-height: 1.6;

    @media (max-width: 1024px) {
      font-size: 14px;
    }
  `,

  LoginForm: styled.form`
    display: flex;
    flex-direction: column;
    gap: 28px;

    @media (max-width: 1024px) {
      gap: 24px;
    }
  `,

  InputGroup: styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
  `,

  InputLabel: styled.label`
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 15px;
    font-weight: 600;
    color: ${({ theme }) => theme.text.primary};

    @media (max-width: 1024px) {
      font-size: 14px;
      gap: 8px;
    }
  `,

  UserIdIcon: styled.span`
    width: 18px;
    height: 18px;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 3px;
    display: inline-block;
    flex-shrink: 0;

    @media (max-width: 1024px) {
      width: 16px;
      height: 16px;
      border-radius: 2px;
    }
  `,

  PasswordIcon: styled.span`
    width: 18px;
    height: 18px;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 3px;
    display: inline-block;
    position: relative;
    flex-shrink: 0;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 9px;
      height: 9px;
      background: ${({ theme }) => theme.text.inverse};
      border-radius: 1.5px;
    }

    @media (max-width: 1024px) {
      width: 16px;
      height: 16px;
      border-radius: 2px;

      &::before {
        width: 8px;
        height: 8px;
        border-radius: 1px;
      }
    }
  `,

  Input: styled.input`
    width: 100%;
    padding: 16px 18px;
    border: 1.5px solid ${({ theme }) => theme.border};
    border-radius: 10px;
    font-size: 15px;
    color: ${({ theme }) => theme.text.primary};
    background-color: ${({ theme }) => theme.background.input};
    transition: all 0.2s ease;
    box-sizing: border-box;

    &::placeholder {
      color: ${({ theme }) => theme.text.tertiary};
    }

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 4px ${({ theme }) => `${theme.colors.primary}20`};
    }

    &:hover:not(:focus) {
      border-color: ${({ theme }) => theme.text.secondary};
    }

    @media (max-width: 1024px) {
      padding: 14px 16px;
      border-radius: 8px;
      font-size: 14px;
      border-width: 1px;
    }
  `,

  SubmitButton: styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 16px 20px;
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.text.inverse};
    font-size: 17px;
    font-weight: 600;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-top: 12px;

    &:hover {
      background: ${({ theme }) => theme.colors.secondary};
      transform: translateY(-2px);
      box-shadow: 0 6px 20px ${({ theme }) => `${theme.colors.primary}50`};
    }

    &:active {
      transform: translateY(0);
    }

    &:disabled {
      background: #CCCCCC;
      cursor: not-allowed;
      transform: none;
    }

    @media (max-width: 1024px) {
      padding: 14px;
      font-size: 16px;
      border-radius: 8px;
      margin-top: 8px;
      gap: 8px;
    }
  `,

  ArrowIcon: styled.span`
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;

    &::after {
      content: '→';
      font-size: 22px;
      line-height: 1;
    }

    @media (max-width: 1024px) {
      width: 20px;
      height: 20px;

      &::after {
        font-size: 20px;
      }
    }
  `
};
