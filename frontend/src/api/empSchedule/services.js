import api from '../axios';

/**
 * 직원 일정 관련 API 서비스
 */
export const empScheduleService = {
  /**
   * 직원 일정 조회 (권한별 분기)
   * - 관리자: 항공사별, 역할별 조회 가능
   * - 직원: 자신의 일정만 조회
   * @param {Object} params - { empId, role }
   */
  getEmpSchedules: (params = {}) => {
    return api.get('/api/emp-schedules', { params });
  },

  /**
   * 월별 일정 조회 (캘린더용)
   * - 직원: 자신의 일정만 조회
   * @param {string} yearMonth - "YYYY-MM" 형식
   */
  getEmpSchedulesByMonth: (yearMonth) => {
    return api.get('/api/emp-schedules/calendar', {
      params: { yearMonth }
    });
  },

  /**
   * 일정 수정 (관리자만 가능)
   * @param {number} empScheduleId - 일정 ID
   * @param {Object} data - { startDate, endDate, scheduleCode }
   */
  updateEmpSchedule: (empScheduleId, data) => {
    return api.patch(`/api/emp-schedules/${empScheduleId}`, data);
  },

  /**
   * 월별 스케줄 자동 생성 (관리자만 가능)
   * @param {string} yearMonth - "YYYY-MM" 형식
   * @param {number} airlineId - 항공사 ID (선택적)
   */
  generateMonthlySchedules: (yearMonth, airlineId = null) => {
    const params = { yearMonth };
    if (airlineId) {
      params.airlineId = airlineId;
    }
    // ✅ 일정 배정은 시간이 오래 걸릴 수 있으므로 타임아웃을 5분(300초)으로 설정
    return api.post('/api/schedule-generation/generate', null, { 
      params,
      timeout: 300000  // 5분 (300초)
    });
  },

  /**
   * 월별 항공편 수 조회 (통계용)
   * @param {string} yearMonth - "YYYY-MM" 형식
   */
  getFlightCount: (yearMonth) => {
    return api.get('/api/emp-schedules/flight-count', {
      params: { yearMonth }
    });
  }
};

export default empScheduleService;
