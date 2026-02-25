import styled from 'styled-components';

export const FooterContainer = styled.footer`
  width: 100%;
  padding: 40px;
  background-color: ${({ theme }) => theme.background.main};
  border-top: 1px solid ${({ theme }) => theme.border};
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  margin-top: auto;
`;

export const FooterContent = styled.div`
  width: 100%;
  max-width: 1600px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 32px;
  }
`;

export const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const CompanyName = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

export const InfoRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  font-size: 13px;
  color: ${({ theme }) => theme.text.tertiary};
  line-height: 1.5;
`;

export const InfoItem = styled.span`
  position: relative;
  
  /* 항목 사이 구분선 (|) */
  &:not(:last-child)::after {
    content: '|';
    display: inline-block;
    margin-left: 8px;
    color: ${({ theme }) => theme.border};
    font-size: 11px;
    vertical-align: 1px;
  }
`;

export const Copyright = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.text.disabled};
  margin: 12px 0 0 0;
  font-family: sans-serif;
`;

export const RightSection = styled.div`
  display: flex;
  gap: 24px;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 16px;
  }
`;

export const LinkItem = styled.a`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s;
  
  /* 중요한 링크는 굵게 표시 */
  font-weight: ${props => props.$bold ? '700' : '400'};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
  }
`;