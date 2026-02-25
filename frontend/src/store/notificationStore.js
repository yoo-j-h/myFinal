import { create } from 'zustand';
import { notificationService } from '../api/notification/services';

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  lastEventId: null,

  setNotifications: (notifications) => set({ notifications }),
  setUnreadCount: (count) => set({ unreadCount: count }),
  setLastEventId: (id) => set({ lastEventId: id }),
  setLoading: (loading) => set({ isLoading: loading }),

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  markAsRead: async (alarmId) => {
    try {
      await notificationService.markAsRead(alarmId);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.alarmId === alarmId ? { ...n, alarmStatus: 'Y' } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
      throw error;
    }
  },

  deleteNotification: async (alarmId) => {
    try {
      await notificationService.deleteNotification(alarmId);
      set((state) => {
        const notification = state.notifications.find((n) => n.alarmId === alarmId);
        const wasUnread = notification?.alarmStatus === 'N';
        return {
          notifications: state.notifications.filter((n) => n.alarmId !== alarmId),
          unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
        };
      });
    } catch (error) {
      console.error('알림 삭제 실패:', error);
      throw error;
    }
  },

  fetchNotifications: async (page = 0, size = 20) => {
    set({ isLoading: true });
    try {
      const response = await notificationService.getNotifications(page, size);
      set({
        notifications: response.content || response,
        isLoading: false,
      });
    } catch (error) {
      console.error('알림 목록 조회 실패:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  fetchUnreadCount: async () => {
    try {
      const response = await notificationService.getUnreadCount();
      set({ unreadCount: response.unreadCount || 0 });
    } catch (error) {
      console.error('안읽음 알림 개수 조회 실패:', error);
    }
  },

  clearNotifications: () => {
    set({
      notifications: [],
      unreadCount: 0,
      lastEventId: null,
    });
  },
}));

export default useNotificationStore;

