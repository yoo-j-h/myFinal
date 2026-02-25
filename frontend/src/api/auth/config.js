const { VITE_API_URL, VITE_API_TIMEOUT = 5000, VITE_API_VERSION = 'v1' } = import.meta.env;

export const API_CONFIG = {
  // 개발 환경: 빈 문자열 (Vite 프록시 사용)
  // 프로덕션 환경: VITE_API_URL 환경변수에 백엔드 URL 설정 (예: http://localhost:8001)
  // 개발 환경에서는 항상 프록시를 사용하도록 빈 문자열 강제 설정
  BASE_URL: import.meta.env.DEV ? '' : (VITE_API_URL || ''),
  TIMEOUT: VITE_API_TIMEOUT,
  HEADERS: {
    'Content-Type': 'application/json', //내가 서버로 보내는 데이터는 json이야
    Accept: 'application/json', //json으로 응답해줘.
  },
};

export const API_ENDPOINTS = {
  AUTH:{
    LOGIN: `/api/auth/login`,
    ME:`/api/auth/me`,

    PASSWORD: {
      RESET_LINK: '/api/auth/password/reset-link',
      VALIDATE: '/api/auth/password/validate',
      RESET: '/api/auth/password/reset',
    },
  }
};
