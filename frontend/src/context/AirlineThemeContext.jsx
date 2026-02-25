import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { createTheme } from '../styles/theme';
import { api } from '../api/axios';

const AirlineThemeContext = createContext();

export const useAirlineTheme = () => {
  const context = useContext(AirlineThemeContext);
  if (!context) {
    throw new Error('useAirlineTheme must be used within AirlineThemeProvider');
  }
  return context;
};

// Control Tower 테마를 사용해야 하는 경로 판별 함수
const shouldUseControlTowerTheme = (pathname) => {
  // Condition A: Control Tower 테마 적용 경로
  const controlTowerPaths = [
    '/super-admin',           // 슈퍼 관리자 모든 페이지
    '/service-registration',  // 서비스 가입 신청
    '/register',              // 회원가입
    '/login',                 // 로그인
    '/find-employee-id',      // 사번 찾기
    '/find-password',         // 비밀번호 찾기
    '/work-login',            // 출근 로그인
    '/',                      // 랜딩 페이지 (정확히 루트만)
    '/account-activation'     // 계정 활성화
  ];

  // 정확히 루트 경로인 경우
  if (pathname === '/') {
    return true;
  }

  // URL이 Control Tower 경로로 시작하는지 확인
  return controlTowerPaths.some(path => path !== '/' && pathname.startsWith(path));
};

export const AirlineThemeProvider = ({ children }) => {
  const location = useLocation();

  // [State 1] 현재 선택된 항공사 (기본: CONTROL_TOWER)
  const [savedAirlineCode, setSavedAirlineCode] = useState(() => {
    return localStorage.getItem('airlineCode') || 'CONTROL_TOWER';
  });

  // [State 2] 승인 상태 (pending | approved | rejected)
  const [approvalStatus, setApprovalStatus] = useState(() => {
    return localStorage.getItem('approvalStatus') || 'pending';
  });

  // [State 3] 다크 모드
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // 1. localStorage에 저장된 설정 확인
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return saved === 'true';
    }

    // 2. localStorage가 없으면 OS 시스템 설정 확인
    if (window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // 3. 기본값: 라이트 모드
    return false;
  });

  // [State 4] 항공사 동적 데이터 (DB에서 가져온 색상 정보)
  const [airlineData, setAirlineData] = useState(() => {
    // 초기화 시 로컬 스토리지 확인 (깜빡임 방지)
    const saved = localStorage.getItem('airlineThemeData');
    const parsed = saved ? JSON.parse(saved) : null;
    console.log('🔄 [AirlineThemeContext] 초기 airlineData 로드:', parsed);
    return parsed;
  });

  // 경로 기반으로 실제 사용할 항공사 코드 결정
  const getEffectiveAirlineCode = () => {
    if (shouldUseControlTowerTheme(location.pathname)) {
      return 'CONTROL_TOWER';
    }

    // Airline 테마 적용: LocalStorage에서 가져오기
    return savedAirlineCode;
  };

  // 현재 경로에 따라 결정된 항공사 코드
  const currentAirline = getEffectiveAirlineCode();

  console.log('🎯 [AirlineThemeContext] 테마 생성 파라미터:', {
    currentAirline,
    isDarkMode,
    airlineData,
    pathname: location.pathname
  });

  // 테마 객체 생성 (항공사 코드 + 다크모드 여부 + 동적 데이터 조합)
  const theme = createTheme(currentAirline, isDarkMode, airlineData);

  // --- Effects (LocalStorage 동기화) ---
  useEffect(() => {
    localStorage.setItem('airlineCode', savedAirlineCode);
  }, [savedAirlineCode]);

  useEffect(() => {
    localStorage.setItem('approvalStatus', approvalStatus);
  }, [approvalStatus]);

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode);

    // CSS Variables 업데이트
    updateCSSVariables(theme);
  }, [isDarkMode, theme]);

  // 경로 변경 시 CSS Variables 업데이트
  useEffect(() => {
    updateCSSVariables(theme);
  }, [location.pathname, theme]);

  // API 호출: 로그인한 사용자의 항공사 정보 가져오기
  useEffect(() => {
    const fetchAirlineData = async () => {
      try {
        // auth-storage에서 empId 가져오기 (Zustand 스토어 구조)
        let empId = null;

        // 1. 먼저 auth-storage 확인 (Zustand)
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          try {
            const authData = JSON.parse(authStorage);
            empId = authData?.state?.emp?.empId;
            console.log('👤 [AirlineThemeContext] auth-storage에서 empId 추출:', empId);
          } catch (e) {
            console.error('❌ [AirlineThemeContext] auth-storage 파싱 실패:', e);
          }
        }

        // 2. 없으면 기존 방식(empId 직접 저장) 확인 (하위 호환)
        if (!empId) {
          empId = localStorage.getItem('empId');
          console.log('👤 [AirlineThemeContext] localStorage에서 empId 확인:', empId);
        }

        if (!empId) {
          console.log('⚠️ [AirlineThemeContext] 로그인하지 않은 사용자 - 기본 테마 사용');
          return;
        }

        console.log('📡 [AirlineThemeContext] API 호출 시작: /api/emps/me/airline');

        // API 호출 (토큰 기반 인증, empId 불필요)
        const response = await api.get('/api/emps/me/airline');
        console.log('📡 [AirlineThemeContext] API 응답:', response.data);

        const data = response.data.data; // ApiResponse 구조: { success, message, data }

        const newData = {
          name: data.name,
          primaryColor: data.primaryColor,
          secondaryColor: data.secondaryColor,
          icon: data.icon,
          // 추가된 필드 매핑
          mainNumber: data.mainNumber || '',
          businessNumber: data.businessNumber || '',
          airlineAddress: data.address || '',
          email: data.email || ''
        };

        console.log('✅ [AirlineThemeContext] 항공사 데이터 파싱 완료:', newData);

        setAirlineData(newData);
        // localStorage에 캐싱 (깜빡임 방지)
        localStorage.setItem('airlineThemeData', JSON.stringify(newData));

        console.log('💾 [AirlineThemeContext] localStorage에 저장 완료');
      } catch (error) {
        console.error('❌ [AirlineThemeContext] 항공사 정보 조회 실패:', error);
        console.error('❌ [AirlineThemeContext] 에러 상세:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        // 폴백: 기본 테마 유지 (에러 발생 시에도 앱은 정상 동작)
        // localStorage의 캐시된 데이터가 있으면 그것을 사용
      }
    };

    fetchAirlineData();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  // CSS Variables 업데이트 함수
  const updateCSSVariables = (currentTheme) => {
    const root = document.documentElement;

    // 브랜드 컬러
    root.style.setProperty('--color-primary', currentTheme.colors.primary);
    root.style.setProperty('--color-secondary', currentTheme.colors.secondary);
    root.style.setProperty('--color-accent', currentTheme.colors.accent);
    root.style.setProperty('--color-hover', currentTheme.colors.hover);
    root.style.setProperty('--color-danger', currentTheme.colors.danger);

    // 배경 색상
    root.style.setProperty('--bg-main', currentTheme.background.main);
    root.style.setProperty('--bg-secondary', currentTheme.background.secondary);
    root.style.setProperty('--bg-tertiary', currentTheme.background.tertiary);
    root.style.setProperty('--bg-hover', currentTheme.background.hover);
    root.style.setProperty('--bg-modal', currentTheme.background.modal);
    root.style.setProperty('--bg-input', currentTheme.background.input);

    // 텍스트 색상
    root.style.setProperty('--text-primary', currentTheme.text.primary);
    root.style.setProperty('--text-secondary', currentTheme.text.secondary);
    root.style.setProperty('--text-tertiary', currentTheme.text.tertiary);
    root.style.setProperty('--text-disabled', currentTheme.text.disabled);
    root.style.setProperty('--text-inverse', currentTheme.text.inverse);

    // 기타
    root.style.setProperty('--border-color', currentTheme.border);
    root.style.setProperty('--shadow-color', currentTheme.shadow);
    root.style.setProperty('--overlay-color', currentTheme.overlay);
  };

  // --- Actions ---

  // 1. 항공사 변경 (승인 시뮬레이션 포함)
  const changeAirline = (airlineCode) => {
    setSavedAirlineCode(airlineCode);
    setApprovalStatus('approved'); // 항공사를 선택하면 승인된 것으로 간주 (시나리오상)
  };

  // 2. 승인 상태 변경
  const updateApprovalStatus = (status) => {
    setApprovalStatus(status);

    // 승인이 취소되거나 대기 상태가 되면 Control Tower로 복귀
    if (status !== 'approved') {
      setSavedAirlineCode('CONTROL_TOWER');
    }
  };

  // 3. 다크 모드 토글
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // 4. 레거시 호환용 (단순 토글) - 필요에 따라 유지
  const toggleAirline = (code) => {
    const nextCode = code || (savedAirlineCode === 'KE' ? 'LJ' : 'KE');
    changeAirline(nextCode);
  };

  const value = {
    theme,
    airlineData,
    currentAirline,
    approvalStatus,
    isDarkMode,
    changeAirline,
    updateApprovalStatus,
    toggleDarkMode,
    toggleAirline,

    // Helper Properties
    airlineName: theme.airline.name,
    isApproved: approvalStatus === 'approved',
    isControlTower: currentAirline === 'CONTROL_TOWER'
  };

  return (
    <AirlineThemeContext.Provider value={value}>
      {children}
    </AirlineThemeContext.Provider>
  );
};

export default AirlineThemeContext;
