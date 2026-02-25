/**
 * Mock 항공사 데이터
 * 실제 환경에서는 백엔드 API에서 사용자의 항공사 정보를 가져옵니다.
 */

export const mockAirlineData = {
  // 대한항공 사용자
  'user-ke-001': {
    userId: 'user-ke-001',
    userName: '김대한',
    airlineCode: 'KE',
    airlineName: 'Korean Air',
    brandColor: '#0066CC',
    approvalStatus: 'approved',
    role: 'EMPLOYEE'
  },
  
  // 진에어 사용자
  'user-lj-001': {
    userId: 'user-lj-001',
    userName: '박진에',
    airlineCode: 'LJ',
    airlineName: 'Jin Air',
    brandColor: '#9ACD32',
    approvalStatus: 'approved',
    role: 'EMPLOYEE'
  },
  
  // Control Tower (승인 대기 또는 관리자)
  'user-ct-001': {
    userId: 'user-ct-001',
    userName: '관리자',
    airlineCode: 'CONTROL_TOWER',
    airlineName: 'Control Tower',
    brandColor: '#4A5568',
    approvalStatus: 'pending',
    role: 'ADMIN'
  }
};

/**
 * 현재 로그인한 사용자의 항공사 정보를 가져옵니다.
 * @param {string} userId - 사용자 ID
 * @returns {Object} 항공사 정보
 */
export const getMockAirlineByUser = (userId) => {
  // 실제로는 API 호출: GET /api/users/{userId}/airline
  return mockAirlineData[userId] || mockAirlineData['user-ct-001'];
};

/**
 * 로그인 시뮬레이션
 * @param {string} userId - 로그인할 사용자 ID
 * @returns {Object} 사용자 정보
 */
export const mockLogin = (userId) => {
  const userInfo = getMockAirlineByUser(userId);
  
  // LocalStorage에 저장 (실제로는 JWT 토큰 등을 사용)
  localStorage.setItem('currentUserId', userId);
  localStorage.setItem('userInfo', JSON.stringify(userInfo));
  
  return userInfo;
};

/**
 * 현재 로그인한 사용자 정보 가져오기
 * @returns {Object|null} 사용자 정보
 */
export const getCurrentUser = () => {
  const userInfoStr = localStorage.getItem('userInfo');
  if (userInfoStr) {
    try {
      return JSON.parse(userInfoStr);
    } catch (e) {
      return null;
    }
  }
  return null;
};

/**
 * 로그아웃
 */
export const mockLogout = () => {
  localStorage.removeItem('currentUserId');
  localStorage.removeItem('userInfo');
};

export default {
  mockAirlineData,
  getMockAirlineByUser,
  mockLogin,
  getCurrentUser,
  mockLogout
};
