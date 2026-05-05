export interface AppNotification {
  id: number;
  user_id: number;
  title: string;
  body: string;
  data: Record<string, string> | null;
  type: string | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationListResponse {
  success: boolean;
  data: AppNotification[];
  unread_count: number;
  pagination: {
    current_page: number;
    last_page: number;
    total: number;
  };
}

export interface UnreadCountResponse {
  success: boolean;
  count: number;
}

export interface RegisterTokenPayload {
  fcm_token: string;
  platform: 'android' | 'ios' | 'web';
}