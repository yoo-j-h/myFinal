import axios from 'axios';
import { API_CONFIG } from './config';
import useAuthStore from '../store/authStore';

/**
 * ============================================================
 * Axios Instances
 * - api: 일반 API 요청
 * - uploadApi: 업로드 전용(기본 Content-Type을 강제하지 않음)
 *
 * Refresh Token 전략(현재 백엔드 구현 기준)
 * - refreshToken: HttpOnly Cookie
 * - accessToken: Zustand store(token)에 저장하여 Authorization 헤더로 전송
 * - access 만료(401) 시: /api/auth/refresh 호출(쿠키 자동 전송) → 새 accessToken 저장 → 원요청 재시도
 * - refresh 실패(재사용 탐지 포함) 시: 토큰 제거 + (선택) 로그인 페이지 이동
 * ============================================================
 */

export const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
  withCredentials: true, // ✅ 매우 중요: refreshToken 쿠키 전송
});

// 개발 환경에서 baseURL 확인
if (import.meta.env.DEV) {
  console.log('[AXIOS] Base URL:', API_CONFIG.BASE_URL || '(프록시 사용)');
  console.log('[AXIOS] Timeout:', API_CONFIG.TIMEOUT);
}

// ✅ 업로드 전용: Content-Type을 기본으로 박지 않음
export const uploadApi = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true, // ✅ 업로드 요청도 쿠키/세션이 필요할 수 있어 통일 권장
});

/**
 * ============================================================
 * 공개 엔드포인트(Authorization 토큰 첨부 스킵)
 * - refresh는 "쿠키 기반"이므로 Authorization을 굳이 붙이지 않는 편이 깔끔
 * ============================================================
 */
const AUTH_EXCLUDE = [
  { method: 'post', path: '/api/auth/login' },
  { method: 'post', path: '/api/auth/refresh' }, // ✅ refresh 도입 시 필수
  { method: 'post', path: '/api/auth/logout' },  // ✅ 로그아웃도 쿠키 기반이면 스킵 추천

  // 회원가입/사전검증(공개)
  { method: 'post', path: '/api/emps' },
  { method: 'post', path: '/api//api/passwordCode' },
  { method: 'get', path: '/api/emps/checkId' },
  { method: 'get', path: '/api/emps/empNo/preview' },

  // 파일 업로드/삭제(회원가입 전 사용 가능하게 하려면 공개로 둠)
  { method: 'post', path: '/api/file/upload' },
  { method: 'delete', path: '/api/file/' },

  { method: 'post', path: '/api/airline-applications' }, // 가입 신청 (공개)
  { method: 'get', path: '/api/account-activation' },    // 계정 활성화 정보 조회 (공개)
  { method: 'post', path: '/api/account-activation' },   // 계정 활성화 완료 (공개)
];

function shouldSkipAuth(config) {
  const method = (config.method || 'get').toLowerCase();
  const url = config.url || '';

  // axios config.url은 보통 "/api/auth/login" 같은 상대경로가 많지만
  // 혹시 전체 URL이 들어오는 케이스도 있어서 includes로 안전하게 처리
  return AUTH_EXCLUDE.some((rule) => method === rule.method && url.includes(rule.path));
}

/**
 * ============================================================
 * Refresh 동시성 제어
 * - 여러 요청이 동시에 401을 받으면 refresh가 여러 번 나가면서
 *   "회전 토큰"이 꼬이고 → 재사용 탐지까지 터질 수 있음
 * - 따라서 refresh는 "한 번만" 수행하고 나머지는 그 결과를 기다렸다가 재시도
 * ============================================================
 */
let isRefreshing = false;
let refreshPromise = null;

/**
 * refresh 호출(쿠키 기반)
 * - Authorization 헤더는 방어적으로 제거
 */
async function requestRefresh(instance) {
  return instance.post('/api/auth/refresh', null, {
    withCredentials: true,
    headers: {
      Authorization: undefined, // ✅ refresh는 쿠키로만 처리(방어)
    },
  });
}

/**
 * authStore에 setToken이 있을 수도/없을 수도 있으니 안전 처리
 */
function setStoreToken(token) {
  const state = useAuthStore.getState();

  if (typeof state.setToken === 'function') {
    state.setToken(token);
    return;
  }

  // 프로젝트마다 함수명이 다를 수 있어 확장 포인트를 남김
  if (typeof state.setAuthToken === 'function') {
    state.setAuthToken(token);
    return;
  }

  console.error(
    '[AUTH][STORE] 토큰 갱신 함수가 없습니다. authStore에 setToken(token) 같은 setter를 추가해야 자동 refresh가 동작합니다.'
  );
}

function clearStoreAuth() {
  const state = useAuthStore.getState();

  // 토큰 제거
  if (typeof state.setToken === 'function') state.setToken(null);
  else if (typeof state.setAuthToken === 'function') state.setAuthToken(null);

  // 유저/권한 등 추가 상태가 있으면 여기서 함께 정리(프로젝트 스토어 구조에 맞게)
  if (typeof state.clear === 'function') state.clear();
  if (typeof state.logout === 'function') state.logout();
}

const applyInterceptors = (instance) => {
  /**
   * ============================================================
   * Request 인터셉터 - 토큰 자동 첨부(단, 공개 엔드포인트는 스킵)
   * ============================================================
   */
  instance.interceptors.request.use(
    (config) => {
      try {
        // 1) 공개 엔드포인트면 토큰 첨부 금지
        if (shouldSkipAuth(config)) {
          console.log('🔓 공개 요청(토큰 미첨부):', config.method?.toUpperCase(), config.url);

          // 혹시 이전에 헤더가 남아있을 가능성 제거(방어적)
          if (config.headers?.Authorization) delete config.headers.Authorization;
          return config;
        }

        // 2) 그 외에는 토큰 첨부
        const token = useAuthStore.getState().token;

        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;

          console.log(
            '🔐 토큰 첨부:',
            config.method?.toUpperCase(),
            config.url,
            token.substring(0, 20) + '...'
          );
        } else {
          console.log('⚠️ 토큰 없음:', config.method?.toUpperCase(), config.url);
        }
      } catch (error) {
        console.error('❌ Auth store error:', error);
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  /**
   * ============================================================
   * Response 인터셉터
   * - 401이면 refresh(쿠키) → 새 accessToken 저장 → 원요청 재시도
   * - refresh 실패(재사용 탐지 포함) 시 강제 로그아웃 처리
   * ============================================================
   */
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      // 네트워크 에러(요청은 갔는데 응답 없음) 등
      if (!error.response) {
        if (error.request) {
          console.error('네트워크 에러(요청은 갔는데 응답 없음):', error.request);
          console.error('백엔드 서버가 실행 중인지 확인하세요. (포트: 8001)');
          console.error('요청 URL:', error.config?.url);
          console.error('Base URL:', error.config?.baseURL);
        } else {
          console.error('요청 설정 에러:', error.message);
        }
        return Promise.reject(error);
      }

      const { status, data } = error.response;
      const originalConfig = error.config;

      console.log('[AXIOS][RES][ERROR]', status, originalConfig?.url, data);

      const url = originalConfig?.url || '';
      const isAuthEndpoint =
        url.includes('/api/auth/login') ||
        url.includes('/api/auth/refresh') ||
        url.includes('/api/auth/logout');

      /**
       * ✅ 401 처리: access 만료 → refresh → 재시도
       * - auth endpoint 자체에서 401이면 refresh 재시도하면 루프/혼선 가능 → 바로 실패 처리
       * - _retry로 무한 루프 방지
       */
      if (status === 401 && !isAuthEndpoint && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          // refresh는 한 번만 실행하고 나머지는 그 결과를 기다림
          if (!isRefreshing) {
            isRefreshing = true;

            refreshPromise = requestRefresh(instance)
              .then((res) => {
                const newAccessToken = res.data?.accessToken;
                if (!newAccessToken) {
                  throw new Error('Refresh 응답에 accessToken이 없습니다.');
                }

                // ✅ store 토큰 갱신
                setStoreToken(newAccessToken);

                return newAccessToken;
              })
              .finally(() => {
                isRefreshing = false;
                refreshPromise = null;
              });
          }

          const newToken = await refreshPromise;

          // ✅ 원요청 Authorization 갱신 후 재시도
          originalConfig.headers = originalConfig.headers || {};
          originalConfig.headers.Authorization = `Bearer ${newToken}`;

          return instance(originalConfig);
        } catch (refreshErr) {
          // ✅ refresh 실패: 재사용 탐지/만료/폐기 → 강제 로그아웃
          console.error('❌ Refresh 실패로 세션 종료:', refreshErr);

          // 백엔드가 reuse detected 메시지를 주는 경우 사용자 안내용 분기 가능
          // 예: refreshErr.response?.data?.message
          // "Refresh token reuse detected. Please login again."

          clearStoreAuth();

          // (선택) 로그인 페이지 이동
          // React Router를 쓰면 여기서 window.location 대신 navigate로 처리하는게 더 깔끔
          // window.location.href = '/login';

          return Promise.reject(refreshErr);
        }
      }

      // 그 외 상태코드 처리(기존 로그 유지)
      if (status === 401) {
        console.error('401: 인증이 필요합니다.');
      } else if (status === 403) {
        console.error('403: 접근 권한이 없습니다.');
      } else if (status === 404) {
        console.error('404: 요청한 리소스를 찾을 수 없습니다.');
      } else if (status === 500) {
        console.error('500: 서버 에러 발생');
      } else {
        console.error('API 에러:', data);
      }

      return Promise.reject(error);
    }
  );
};

applyInterceptors(api);
applyInterceptors(uploadApi);

export default api;