import api from '../axios';

export const passwordCodeService = {
  // 인증코드 발송
  send: (email) => {
    // 백엔드가 { email } 형태를 받는다고 가정
    return api.post('/api/passwordCode/send', { email });
  },

  // 인증코드 검증
  verify: ({ email, code }) => {
    // 백엔드가 { email, code } 형태를 받는다고 가정
    return api.post('/api/passwordCode/verify', { email, code });
  },
  reset: ({ email, code, newPassword }) => {
    return api.post("/api/passwordCode/reset", { email, code, newPassword });
  },
};