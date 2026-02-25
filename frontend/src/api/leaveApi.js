import api from './axios';

/**
 * 휴가 신청 관련 API 서비스
 */
export const leaveApi = {
    /**
     * 휴가 신청
     * @param {string} empId - 직원 ID
     * @param {Object} data - 휴가 신청 데이터
     * @returns {Promise} 휴가 신청 결과
     */
    applyLeave: async (empId, data) => {
        const response = await api.post('/api/leave/apply', data, {
            params: { empId }
        });
        return response.data;
    },

    /**
     * 내 휴가 신청 내역 조회
     * @param {string} empId - 직원 ID
     * @returns {Promise} 휴가 신청 내역 리스트
     */
    getMyLeaveList: async (empId) => {
        const response = await api.get('/api/leave/my-list', {
            params: { empId }
        });
        return response.data;
    },

    /**
     * 잔여 휴가 조회
     * @param {string} empId - 직원 ID
     * @returns {Promise} 잔여 휴가 정보
     */
    getRemainingLeave: async (empId) => {
        const response = await api.get('/api/leave/remaining', {
            params: { empId }
        });
        return response.data;
    },

    /**
     * 휴가 승인/반려 (관리자용)
     * @param {number} leaveApplyId - 휴가 신청 ID
     * @param {string} approverId - 승인자 ID
     * @param {Object} data - 승인/반려 데이터
     * @returns {Promise} 승인/반려 결과
     */
    approveLeave: async (leaveApplyId, approverId, data) => {
        const response = await api.put(`/api/leave/${leaveApplyId}/approve`, data, {
            params: { approverId }
        });
        return response.data;
    }
};

export default leaveApi;
