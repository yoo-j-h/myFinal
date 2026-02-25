import api, { uploadApi } from '../axios';

export const airlineApplyService = {
  // 가입 신청 생성
  createApplication: (formData) => {
    return uploadApi.post('/api/airline-applications', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 목록 조회
  getApplications: (keyword) => {
    const params = keyword ? { keyword } : {};
    return api.get('/api/super-admin/airline-applications', { params });
  },

  // 상세 조회
  getApplicationDetail: (id) => {
    return api.get(`/api/super-admin/airline-applications/${id}`);
  },

  // 승인
  approveApplication: (id, adminId) => {
    return api.post(`/api/super-admin/airline-applications/${id}/approve`, { adminId });
  },

  // 승인 (활성화 링크 포함)
  approveApplicationWithLink: (id, adminId) => {
    return api.post(`/api/super-admin/airline-applications/${id}/approve-with-link`, { adminId });
  },

  // 반려
  rejectApplication: (id, reason) => {
    return api.post(`/api/super-admin/airline-applications/${id}/reject`, { reason });
  }
};

export default { airlineApplyService };

