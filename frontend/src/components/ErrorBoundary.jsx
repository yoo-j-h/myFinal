import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.background.main};
  color: ${({ theme }) => theme.text.primary};
  text-align: center;
  padding: 20px;
`;

const ErrorIcon = styled.div`
  font-size: 48px;
  margin-bottom: 24px;
`;

const ErrorTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
`;

const ErrorMessage = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 32px;
  max-width: 600px;
  line-height: 1.6;
`;

const RetryButton = styled.button`
  padding: 12px 24px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryHover || theme.colors.primary};
  }
`;

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <ErrorContainer>
                    <ErrorIcon>⚠️</ErrorIcon>
                    <ErrorTitle>오류가 발생했습니다</ErrorTitle>
                    <ErrorMessage>
                        죄송합니다. 예상치 못한 오류가 발생하여 페이지를 표시할 수 없습니다.<br />
                        잠시 후 다시 시도하거나 관리자에게 문의해주세요.
                    </ErrorMessage>
                    {this.state.error && (
                        <details style={{ marginBottom: '20px', textAlign: 'left', color: '#666' }}>
                            <summary>상세 오류 정보</summary>
                            <pre style={{ fontSize: '12px', marginTop: '10px' }}>{this.state.error.toString()}</pre>
                        </details>
                    )}
                    <RetryButton onClick={this.handleRetry}>페이지 새로고침</RetryButton>
                </ErrorContainer>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
