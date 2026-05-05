import client from '@/src/lib/axios';
import { API_ENDPOINTS } from '@/src/lib/endpoints';
import type {
  NotificationListResponse,
  RegisterTokenPayload,
  UnreadCountResponse,
} from './notification.types';

export const NotificationService = {
  registerToken: (payload: RegisterTokenPayload) =>
    client
      .post(API_ENDPOINTS.DEVICE_TOKEN.REGISTER, payload)
      .then((r) => r.data),

  removeToken: (fcm_token: string) =>
    client
      .delete(API_ENDPOINTS.DEVICE_TOKEN.REMOVE, { data: { fcm_token } })
      .then((r) => r.data),

  list: (page = 1) =>
    client
      .get<NotificationListResponse>(API_ENDPOINTS.NOTIFICATIONS.LIST, {
        params: { page },
      })
      .then((r) => r.data),

  unreadCount: () =>
    client
      .get<UnreadCountResponse>(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT)
      .then((r) => r.data),

  markRead: (id: number) =>
    client
      .patch(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id))
      .then((r) => r.data),

  markAllRead: () =>
    client
      .patch(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL)
      .then((r) => r.data),

  delete: (id: number) =>
    client
      .delete(API_ENDPOINTS.NOTIFICATIONS.DELETE(id))
      .then((r) => r.data),
};