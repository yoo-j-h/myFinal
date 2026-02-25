import styled from 'styled-components';

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 32px;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const DetailHeader = styled.div`
  margin-bottom: 32px;
  border-bottom: 2px solid ${({ theme }) => theme.border};
  padding-bottom: 24px;
`;

export const Title = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin: 16px 0;
`;

export const MetaSection = styled.div`
  display: flex;
  gap: 20px;
`;

export const QuestionBody = styled.div`
  font-size: 17px;
  line-height: 1.8;
  color: ${({ theme }) => theme.text.primary};
  min-height: 300px;
  white-space: pre-wrap; /* 줄바꿈 유지 */
  padding: 20px 0;
`;

export const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.border};
  margin: 40px 0;
`;

export const AnswerSection = styled.div`
  background: ${({ theme }) => theme.background.secondary};
  border-radius: 16px;
  padding: 32px;
  border-left: 6px solid ${({ theme }) => theme.colors.primary};
`;

export const AnswerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;

  h3 {
    margin: 0;
    font-size: 18px;
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 700;
  }

  .date {
    font-size: 14px;
    color: ${({ theme }) => theme.text.disabled || theme.text.tertiary};
    margin-left: auto;
  }
`;

export const AnswerContent = styled.div`
  font-size: 16px;
  line-height: 1.7;
  color: ${({ theme }) => theme.text.primary};
  white-space: pre-wrap;
`;

export const NoAnswerBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 60px;
  color: ${({ theme }) => theme.text.disabled || theme.text.tertiary};
  background: ${({ theme }) => theme.background.secondary};
  border-radius: 16px;
  text-align: center;
`;

export const CategoryBadge = styled.div`
  display: inline-flex;           /* 수평 정렬 */
  align-items: center;     /* 세로 중앙 정렬 */
  justify-content: center;
  background: ${props => props.$bgColor || `${props.theme.colors.primary}15`};
  color: ${props => props.$textColor || props.theme.colors.primary};
  padding: 6px 12px;       /* 아이콘이 들어갔으므로 여백 살짝 조정 */
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  min-width: 90px;         /* 아이콘 때문에 가로가 넓어지므로 살짝 조정 */
  text-align: center;
  gap: 4px;                /* 아이콘과 글자 사이 간격 */
`;

export const AdminReplyBox = styled.div`
  background: ${({ theme }) => theme.background.paper};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 24px;
  
  h3 { font-size: 18px; margin-bottom: 16px; color: ${({ theme }) => theme.text.primary}; }
  
  textarea {
    width: 100%;
    min-height: 150px;
    padding: 15px;
    border: 1px solid ${({ theme }) => theme.border};
    background: ${({ theme }) => theme.background.paper};
    color: ${({ theme }) => theme.text.primary};
    border-radius: 8px;
    resize: vertical;
    font-size: 15px;
    margin-bottom: 16px;
    &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary}; }
  }
`;

export const AdminReplyForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  textarea {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.border};
    background: ${({ theme }) => theme.background.paper};
    color: ${({ theme }) => theme.text.primary};
  }
  .btn-group {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    button {
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        border: 1px solid ${({ theme }) => theme.border};
        background: ${({ theme }) => theme.background.paper};
        color: ${({ theme }) => theme.text.primary};
    }
    .submit {
        background: ${({ theme }) => theme.colors.primary};
        color: ${({ theme }) => theme.text.inverse || 'white'};
        border: none;
    }
  }
`;

export const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.text.inverse || 'white'};
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  float: right;
  &:hover { background: ${({ theme }) => theme.colors.primaryHover || theme.colors.primary}; }
`;
