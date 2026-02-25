import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.2s ease-out;
  backdrop-filter: blur(4px);
`;

export const ModalContainer = styled.div`
  background: ${({ theme }) => theme.background.paper};
  width: 100%;
  max-width: 500px;
  border-radius: 20px;
  padding: 40px;
  box-shadow: ${({ theme }) => theme.shadowLg || theme.shadow};
  position: relative;
  animation: ${slideUp} 0.3s ease-out;
  max-height: 90vh;
  overflow-y: auto;

  @media (max-width: 600px) {
    width: 90%;
    padding: 24px;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  color: ${({ theme }) => theme.text.secondary};
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.background.hover};
    color: ${({ theme }) => theme.text.primary};
  }
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

export const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin: 0 0 8px 0;
`;

export const SubTitle = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.text.secondary};
  margin: 0;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.secondary};
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.2s;
  outline: none;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.background.input};
  color: ${({ theme }) => theme.text.primary};

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.2s;
  outline: none;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.background.input};
  color: ${({ theme }) => theme.text.primary};

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.2s;
  outline: none;
  background-color: ${({ theme }) => theme.background.input};
  color: ${({ theme }) => theme.text.primary};
  cursor: pointer;
  box-sizing: border-box;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 14px;
  background-color: ${props => props.theme.colors.primary};
  color: ${({ theme }) => theme.text.inverse};
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  margin-top: 12px;

  &:hover {
    background-color: ${props => props.theme.colors.secondary};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;
