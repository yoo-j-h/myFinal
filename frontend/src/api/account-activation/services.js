import api from '../axios';

export const accountActivationService = {
  // 활성화 정보 조회
  getActivationInfo: (token) => {
    return api.get(`/api/account-activation/${token}`);
  },

  // 계정 활성화 완료
  activateAccount: (token, password, passwordConfirm) => {
    return api.post(`/api/account-activation/${token}`, {
      password,
      passwordConfirm,
    });
  },

  // 초기 설정 완료
  completeInitialSetup: (token, formData, logoFile) => {
    const submitFormData = new FormData();
    
    // JSON 데이터 추가
    const data = {
      airlineName: formData.airlineName,
      airlineAddress: formData.airlineAddress,
      representativeName: formData.representativeName,
      representativePhone: formData.representativePhone,
      representativeEmail: formData.representativeEmail,
      airlineDesc: formData.airlineDesc || '',
      theme: formData.theme
    };
    submitFormData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    
    // 로고 파일 추가 (선택사항)
    if (logoFile) {
      submitFormData.append('logoFile', logoFile);
    }
    
    return api.post(`/api/account-activation/initial-setup/${token}`, submitFormData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

export default { accountActivationService };

