// 테마 색상 팔레트 정의
export const airlines = {
  // Control Tower (기본 중립 상태)
  CONTROL_TOWER: {
    id: 'CONTROL_TOWER',
    name: 'Control Tower',
    code: 'CT',
    colors: {
      primary: '#4A5568',      // 중립적인 회색 (Slate-600)
      secondary: '#2D3748',    // 어두운 회색 (Slate-800)
      accent: '#718096',       // 보조 회색 (Slate-500)
      hover: '#E2E8F0',        // 호버 배경색 (Slate-200) - 라이트모드 기준
      danger: '#E53E3E'        // 위험/오류 (Red-600)
    }
  },
};

// 라이트 모드 공통 색상
export const lightTheme = {
  mode: 'light',
  background: {
    main: '#FFFFFF',
    secondary: '#F1F5F9',      // Slate-100 (For Content Background)
    tertiary: '#EDF2F7',       // Slate-100
    hover: '#E2E8F0',          // Slate-200
    modal: '#FFFFFF',
    input: '#F7FAFC'
  },
  text: {
    primary: '#1A202C',        // Gray-900
    secondary: '#4A5568',      // Gray-600
    tertiary: '#718096',       // Gray-500
    disabled: '#A0AEC0',       // Gray-400
    inverse: '#FFFFFF'         // 반전 텍스트 (아이콘 등)
  },
  status: {
    success: '#10B981',        // Emerald-500
    warning: '#F59E0B',        // Amber-500
    error: '#EF4444',          // Red-500
    info: '#3B82F6'            // Blue-500
  },
  border: '#E2E8F0',           // Slate-200
  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)'
};

// 다크 모드 공통 색상
export const darkTheme = {
  mode: 'dark',
  background: {
    main: '#1A202C',           // Gray-900 (Sidebar/Header)
    secondary: '#11151C',      // Almost Black (Content Background)
    tertiary: '#2D3748',       // Gray-800
    hover: '#2D3748',          // Gray-800 (호버 시 밝게)
    modal: '#2D3748',
    input: '#1A202C'
  },
  text: {
    primary: '#F7FAFC',        // Gray-50 (완전한 흰색보다 부드러움)
    secondary: '#E2E8F0',      // Gray-200
    tertiary: '#CBD5E0',       // Gray-300
    disabled: '#718096',       // Gray-500
    inverse: '#1A202C'         // 반전 텍스트
  },
  status: {
    success: '#10B981',        // Emerald-500 (다크모드에서도 동일하게 유지하거나 필요시 조정)
    warning: '#F59E0B',        // Amber-500
    error: '#EF4444',          // Red-500
    info: '#3B82F6'            // Blue-500
  },
  border: '#4A5568',           // Gray-700
  shadow: 'rgba(0, 0, 0, 0.4)',
  overlay: 'rgba(0, 0, 0, 0.7)'
};

// 색상 유틸리티 함수 import
import { lightenColor, adjustBrightness } from '../utils/colorUtils';

// 테마 생성 함수
export const createTheme = (airlineCode, isDark = false, dynamicData = null) => {
  console.log('🎨 [createTheme] 호출됨:', {
    airlineCode,
    isDark,
    dynamicData,
    hasDynamicData: !!(dynamicData && dynamicData.primaryColor)
  });

  // 다크모드 여부에 따른 베이스 테마 선택
  const baseTheme = isDark ? darkTheme : lightTheme;

  // 1. 동적 데이터가 있으면 우선 사용 (DB에서 가져온 색상)
  if (dynamicData && dynamicData.primaryColor) {
    console.log('✅ [createTheme] 동적 데이터 사용:', dynamicData);

    // 다크 모드 시 색상 보정: 채도는 유지하되 밝기를 높여 시인성 향상
    const primaryColor = isDark
      ? adjustBrightness(dynamicData.primaryColor, 25)
      : dynamicData.primaryColor;

    const secondaryColor = isDark
      ? adjustBrightness(dynamicData.secondaryColor || dynamicData.primaryColor, 20)
      : (dynamicData.secondaryColor || dynamicData.primaryColor);

    console.log('🎨 [createTheme] 색상 보정 결과:', {
      원본Primary: dynamicData.primaryColor,
      보정Primary: primaryColor,
      원본Secondary: dynamicData.secondaryColor,
      보정Secondary: secondaryColor,
      isDark
    });

    const airline = {
      id: airlineCode || 'DYNAMIC',
      name: dynamicData.name || 'Unknown Airline',
      code: airlineCode || 'XX',
      colors: {
        primary: primaryColor,
        secondary: secondaryColor,
        accent: lightenColor(primaryColor, 15),
        hover: isDark ? baseTheme.background.hover : lightenColor(dynamicData.primaryColor, 40),
        danger: '#E53E3E'
      }
    };

    const finalTheme = {
      ...baseTheme,
      airline: {
        id: airline.id,
        name: airline.name,
        code: airline.code
      },
      colors: airline.colors
    };

    console.log('✅ [createTheme] 동적 테마 생성 완료:', finalTheme);
    return finalTheme;
  }

  // 2. 프리셋 폴백 (정적 데이터)
  console.log('⚠️ [createTheme] 프리셋 폴백 사용 (airlineCode:', airlineCode, ')');
  const airline = airlines[airlineCode] || airlines.CONTROL_TOWER;

  // 최종 테마 객체 반환
  const finalTheme = {
    ...baseTheme,
    airline: {
      id: airline.id,
      name: airline.name,
      code: airline.code
    },
    // 색상 우선순위: 항공사 브랜드 컬러를 메인으로 하되, 다크모드 시 조정 가능
    colors: {
      primary: airline.colors.primary,
      secondary: airline.colors.secondary,
      accent: airline.colors.accent,
      hover: isDark ? baseTheme.background.hover : airline.colors.hover, // 다크모드에선 배경색 기준 호버
      danger: airline.colors.danger
    }
  };

  console.log('⚠️ [createTheme] 프리셋 테마 생성 완료:', finalTheme);
  return finalTheme;
};

export default { airlines, lightTheme, darkTheme, createTheme };
