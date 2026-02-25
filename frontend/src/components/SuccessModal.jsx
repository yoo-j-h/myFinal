import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const IconWrapper = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1a202c;
  text-align: center;
  margin-bottom: 12px;
`;

const Message = styled.p`
  font-size: 16px;
  color: #4a5568;
  text-align: center;
  line-height: 1.6;
  margin-bottom: 24px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button`
  flex: 1;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  ${props => props.$primary ? `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
  ` : `
    background: #f7fafc;
    color: #4a5568;
    border: 1px solid #e2e8f0;

    &:hover {
      background: #edf2f7;
    }
  `}

  &:active {
    transform: translateY(0);
  }
`;

const SuccessModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
                <IconWrapper>✓</IconWrapper>
                <Title>{title || '신청 완료'}</Title>
                <Message>{message || '휴가 신청이 완료되었습니다.'}</Message>
                <ButtonGroup>
                    {onConfirm && (
                        <Button onClick={onConfirm} $primary>
                            확인
                        </Button>
                    )}
                </ButtonGroup>
            </ModalContainer>
        </ModalOverlay>
    );
};

export default SuccessModal;
