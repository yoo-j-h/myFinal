import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../api/auth/services';

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      emp: null,
      isAuthenticated: false,

      setToken: (token) => {
        set({
          token: token || null,
          isAuthenticated: !!token,
        });
      },

      setEmp: (emp) => set({ emp }),

      clearAuth: () => {
        set({
          token: null,
          emp: null,
          isAuthenticated: false,
        });
        // persist를 쓰고 있으니 name과 동일하게 삭제
        localStorage.removeItem('auth-storage');
      },

      logout: async () => {
        // (선택) 백엔드에 logout 호출해서 refresh revoke + 쿠키 삭제
        // 실패해도 로컬 정리는 해야 하므로 try/catch
        try {
          await authService.logout?.();
        } catch (e) {
          // 무시 가능
        }
        get().clearAuth();
      },

      /**
       * ✅ 로그인 플로우: login -> setToken -> me
       * - refreshToken은 HttpOnly 쿠키로 내려옴(서버에서 Set-Cookie)
       * - accessToken은 body로 내려옴(accessToken)
       */
      loginFlow: async ({ empId, empPwd }) => {
        const loginRes = await authService.login({ empId, empPwd });

        // ✅ 백엔드 응답 구조 커버:
        // 1) 최신: { accessToken, accessTokenExpiresIn }
        // 2) 구형: { token }
        // 3) axios wrapper: res.data에 payload가 있는 경우
        const token =
          loginRes?.data?.accessToken ??
          loginRes?.accessToken ??
          loginRes?.data?.token ??
          loginRes?.token;

        if (!token) {
          throw new Error('토큰이 응답에 없습니다. (login 응답 구조 확인 필요)');
        }

        // ✅ 토큰 저장(인터셉터가 여기 token을 읽어 Authorization을 첨부)
        get().setToken(token);

        // ✅ 토큰 저장 직후 me 호출
        const meRes = await authService.me();
        const emp = meRes?.data ?? meRes;

        get().setEmp(emp);
        return { token, emp };
      },

      /**
       * ✅ 앱 시작/새로고침 시 인증 상태 복구
       * - B안(현재 구조): token이 남아있으면 me로 재수화
       * - (선택) token이 없으면 refresh로 accessToken 복구 후 me 호출 가능
       */
      hydrate: async () => {
        // 1) localStorage에 token이 남아있으면 me로 재수화
        const token = get().token;

        // (선택) A안 성격: token이 없더라도 refresh 쿠키로 복구해보기
        // - 실무적으로는 이쪽이 더 정석(Access는 메모리로만 관리)
        if (!token) {
          try {
            if (authService.refresh) {
              const refreshRes = await authService.refresh();
              const newToken =
                refreshRes?.data?.accessToken ??
                refreshRes?.accessToken ??
                refreshRes?.data?.token ??
                refreshRes?.token;

              if (newToken) {
                get().setToken(newToken);
              } else {
                return null;
              }
            } else {
              // refresh 서비스가 아직 없으면 복구 불가
              return null;
            }
          } catch (e) {
            // refresh 실패(재사용 탐지/만료/폐기) → 인증 해제
            get().clearAuth();
            return null;
          }
        }

        // 2) me로 유저 재수화
        try {
          const meRes = await authService.me();
          const emp = meRes?.data ?? meRes;
          get().setEmp(emp);
          return emp;
        } catch (e) {
          get().clearAuth();
          return null;
        }
      },

      // role helpers
      hasRole: (roles) => {
        const role = get().emp?.role;
        if (!role) return false;
        return Array.isArray(roles) ? roles.includes(role) : role === roles;
      },

      // emp helpers
      getEmpId: () => get().emp?.empId ?? null,
      getEmpName: () => get().emp?.empName ?? null,
      getRole: () => get().emp?.role ?? null,

      // Dev helper for updating role
      updateRole: (newRole) => {
        set((state) => ({
          emp: {
            ...state.emp,
            role: newRole
          }
        }));
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        // ✅ B안: 그대로 유지(편의)
        token: state.token,
        emp: state.emp,
        isAuthenticated: state.isAuthenticated,

        // ✅ A안으로 가고 싶으면 token은 persist에서 빼는 게 정석:
        // emp, isAuthenticated만 남기고 token 제거
      }),
    }
  )
);

export default useAuthStore;