const { VITE_API_URL, VITE_API_TIMEOUT = 5000, VITE_API_VERSION = 'v1' } = import.meta.env;

export const API_CONFIG = {

  BASE_URL: import.meta.env.DEV ? '' : (VITE_API_URL || ''),
  TIMEOUT: VITE_API_TIMEOUT,
  HEADERS: {
    'Content-Type': 'application/json', //내가 서버로 보내는 데이터는 json이야
    Accept: 'application/json', //json으로 응답해줘.
  },
};

export const API_ENDPOINTS = {
  // ✅ EMP(회원)
  EMP: {
    CHECK_ID: `/api/emps/checkId`,        // GET ?empId=
    PREVIEW_EMP_NO: `/api/emps/empNo/preview`, // GET
    REGISTER: `/api/emps`,                 // POST
    MANAGERS: `/api/emps/managers`, 
    ME: `/api/emps/me`,     
    ME_PASSWORD: '/api/emps/me/password',
    FIND_ID: '/api/emps/findId',
  },

  // ✅ FILE(업로드/삭제)
  FILE: {
    UPLOAD: `/api/file/upload`,            // POST multipart/form-data
    DELETE: (fileId) => `/api/file/${fileId}`, // DELETE
  },
};