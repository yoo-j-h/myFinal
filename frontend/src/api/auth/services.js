import api from '../axios';
import { API_ENDPOINTS } from './config';

export const authService = {
  login: (credentials) => {
    return api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  },


  me: (token) => {
    return api.get(API_ENDPOINTS.AUTH.ME, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default { authService };
