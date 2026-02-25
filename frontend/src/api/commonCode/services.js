import api from '../axios';

export const commonCodeService = {
  // 공통코드 목록 조회
  getCodes: () => {
    return api.get('/api/common/codes');
  },

  // 공통코드 상세 조회
  getCodeDetails: (codeId) => {
    return api.get(`/api/common/codes/${codeId}/details`);
  },

  // 공통코드 등록
  createCode: (codeDto) => {
    return api.post('/api/common/codes', codeDto);
  },

  // 공통코드 디테일 등록
  createCodeDetail: (codeId, codeDetailDto) => {
    return api.post(`/api/common/codes/${codeId}/details`, codeDetailDto);
  },

  // 공통코드 삭제
  deleteCode: (codeId) => {
    return api.delete(`/api/common/codes/${codeId}`);
  },

  // 공통코드 디테일 수정
  updateCodeDetail: (codeId, codeDetailId, codeDetailDto) => {
    return api.put(`/api/common/codes/${codeId}/details/${codeDetailId}`, codeDetailDto);
  },

  // 공통코드 디테일 삭제
  deleteCodeDetail: (codeId, codeDetailId) => {
    return api.delete(`/api/common/codes/${codeId}/details/${codeDetailId}`);
  },
};

export default { commonCodeService };
