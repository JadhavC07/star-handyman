import { NotificationService } from '@/src/features/notifications/notification.service';
import { useAuthStore } from '@/src/features/auth/auth.store';
import { fcm } from '@/src/lib/fcm';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Platform } from 'react-native';

const NOTIF_KEYS = {
  all:    ['notifications'] as const,
  unread: ['notifications', 'unread'] as const,
};

// ─── Register FCM token after login ───────────────────────────────────────────
export const useRegisterFcmToken = () => {
  return useMutation({
    mutationFn: async () => {
      const token = await fcm.init();
      if (!token) return null;
      return NotificationService.registerToken({
        fcm_token: token,
        platform: fcm.platform(),
      });
    },
    meta: { silent: true }, // don't surface errors to user via toast
  });
};

// ─── Remove FCM token on logout ───────────────────────────────────────────────
export const useRemoveFcmToken = () => {
  return useMutation({
    mutationFn: async () => {
      const { default: messaging } = await import(
        '@react-native-firebase/messaging'
      );
      const token = await messaging().getToken();
      return NotificationService.removeToken(token);
    },
    meta: { silent: true },
  });
};

// ─── Notification list ────────────────────────────────────────────────────────
export const useNotifications = (page = 1) => {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  return useQuery({
    queryKey: [...NOTIF_KEYS.all, page],
    queryFn: () => NotificationService.list(page),
    enabled: isLoggedIn,
    staleTime: 30_000,
  });
};

// ─── Unread badge count ───────────────────────────────────────────────────────
export const useUnreadCount = () => {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  return useQuery({
    queryKey: NOTIF_KEYS.unread,
    queryFn: () => NotificationService.unreadCount(),
    enabled: isLoggedIn,
    staleTime: 30_000,
    refetchInterval: 60_000, // poll every 60s as a fallback
  });
};

// ─── Actions ─────────────────────────────────────────────────────────────────
export const useMarkRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => NotificationService.markRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: NOTIF_KEYS.all });
      qc.invalidateQueries({ queryKey: NOTIF_KEYS.unread });
    },
  });
};

export const useMarkAllRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => NotificationService.markAllRead(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: NOTIF_KEYS.all });
      qc.invalidateQueries({ queryKey: NOTIF_KEYS.unread });
    },
  });
};

export const useDeleteNotification = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => NotificationService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: NOTIF_KEYS.all });
      qc.invalidateQueries({ queryKey: NOTIF_KEYS.unread });
    },
  });
};