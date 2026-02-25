import api from '../axios';
import { ATTENDANCE_ENDPOINTS } from './config';

/**
 * 근태 관련 API 서비스
 */
export const attendanceService = {
    /**
     * 월별 근태 통계 조회
     * @param {string} empId - 직원 ID
     * @param {number} year - 년도
     * @param {number} month - 월
     * @returns {Promise} 월별 통계 데이터
     */
    getMonthlyStats: async (empId, year, month) => {
        const response = await api.get(ATTENDANCE_ENDPOINTS.MONTHLY_STATS, {
            params: { empId, year, month }
        });
        return response.data;
    },

    /**
     * 월별 캘린더 데이터 조회
     * @param {string} empId - 직원 ID
     * @param {number} year - 년도
     * @param {number} month - 월
     * @returns {Promise} 캘린더 데이터
     */
    getCalendarData: async (empId, year, month) => {
        const response = await api.get(ATTENDANCE_ENDPOINTS.CALENDAR, {
            params: { empId, year, month }
        });
        return response.data;
    },

    /**
     * 관리자 대시보드 데이터 조회
     * - 오늘 기준 통계 (전체 직원, 출근, 지각, 결근)
     * - 어제 기준 상세 리스트
     */
    getAdminDashboard: async () => {
        const response = await api.get('/api/admin/attendance/dashboard');
        return response.data;
    },

    /**
     * 직원별 실시간 현황 조회 (Tab A)
     * - 오늘 날짜 기준 전체 직원의 근태 상태
     */
    getEmployeeStatus: async () => {
        const response = await api.get('/api/admin/attendance/employees');
        return response.data;
    },

    /**
     * 근태 특이사항 기록 조회 (Tab B)
     * - 날짜 범위 내 비정상 근태만 필터링 (PRESENT 제외)
     * @param {string} startDate - 시작 날짜 (YYYY-MM-DD, 선택사항)
     * @param {string} endDate - 종료 날짜 (YYYY-MM-DD, 선택사항)
     */
    getAbnormalAttendance: async (startDate, endDate) => {
        const response = await api.get('/api/admin/attendance/abnormal', {
            params: { startDate, endDate }
        });
        return response.data;
    }
};

export default attendanceService;
