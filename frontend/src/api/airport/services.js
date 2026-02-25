import api from '../axios';

export const airportService = {
  // 공항 목록 조회
  getAirports: () => {
    return api.get('/api/airports');
  },
};

export default { airportService };
