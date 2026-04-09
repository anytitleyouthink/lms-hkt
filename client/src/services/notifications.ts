import { customFetch } from '@/lib/api';

export const notificationService = {
  getMyNotifications: async () => {
    return customFetch('/notifications', { method: 'GET' });
  },
  markAsRead: async (notification_id: string) => {
    return customFetch(`/notifications/${notification_id}/read`, { method: 'PUT' });
  }
};
