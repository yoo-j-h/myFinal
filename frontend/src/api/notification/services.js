import api from '../axios';

export const notificationService = {
  getNotifications: async (page = 0, size = 20) => {
    const response = await api.get('/api/notifications', {
      params: { page, size },
    });
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get('/api/notifications/unread-count');
    return response.data;
  },

  markAsRead: async (alarmId) => {
    const response = await api.put(`/api/notifications/${alarmId}/read`);
    return response.data;
  },

  deleteNotification: async (alarmId) => {
    const response = await api.delete(`/api/notifications/${alarmId}`);
    return response.data;
  },
};

export default notificationService;

