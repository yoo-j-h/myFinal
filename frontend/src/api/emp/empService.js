// src/api/services/empService.js
import { api } from '../axios';
import { API_ENDPOINTS } from './config';

export const empService = {
  // GET /api/emps/check-id?empId=EMP001
  checkId: (empId) =>
    api.get(API_ENDPOINTS.EMP.CHECK_ID, {
      params: { empId },
    }),

  // GET /api/emps/emp-no/preview
  previewEmpNo: () => api.get(API_ENDPOINTS.EMP.PREVIEW_EMP_NO),

  // POST /api/emps
  register: (payload) => api.post(API_ENDPOINTS.EMP.REGISTER, payload),

  // GET /api/emps/managers
  getManagerCandidates: () => api.get(API_ENDPOINTS.EMP.MANAGERS),

  // 내 프로필 조회
  getMyProfile: () => api.get(API_ENDPOINTS.EMP.ME),

  // 내 프로필 수정
  // payload는 DTO @JsonProperty 때문에 snake_case 권장:
  // { emp_name, age, email, phone, address, profile_image_id }
  updateMyProfile: (payload) => api.put(API_ENDPOINTS.EMP.ME, payload),

    // ✅ 비밀번호 변경 (추가)
  // payload:
  // { current_password, new_password }
  changeMyPassword: (payload) => api.put(API_ENDPOINTS.EMP.ME_PASSWORD, payload),

    findEmpId: (payload) => api.post(API_ENDPOINTS.EMP.FIND_ID, payload),
};
