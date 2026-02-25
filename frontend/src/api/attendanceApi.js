import api from './axios';

/**
 * 근태 관련 API 서비스
 */
const attendanceApi = {
    /**
     * 월별 근태 통계 조회
     * @param {string} empId - 직원 ID
     * @param {number} year - 년도
     * @param {number} month - 월
     * @returns {Promise} 월별 통계 데이터
     */
    getMonthlyStats: async (empId, year, month) => {
        const response = await api.get('/api/attendance/monthly-stats', {
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
        const response = await api.get('/api/attendance/calendar', {
            params: { empId, year, month }
        });
        return response.data;
    },

    /**
     * 이미지에서 텍스트 추출 (OCR)
     * @param {File} file - 이미지 파일
     * @returns {Promise} 추출된 텍스트 데이터
     */
    extractTextFromImage: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        // OCR 처리는 시간이 오래 걸릴 수 있으므로 타임아웃을 30초로 설정
        const response = await api.post('/api/attendance/protest/ocr', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 30000, // 30초
        });
        return response.data;
    }
};

export default attendanceApi;
