export const API_ENDPOINTS = {
  HANDYMAN_AUTH: {
    SEND_OTP: "/serviceman/send-otp",
    SEND_LOGIN_OTP: "/serviceman/send-login-otp",
    LOGIN: "/serviceman/login",
    REGISTER: "/serviceman/register",
    LOGOUT: "/serviceman/logout",
  },
  HANDYMAN_PROFILE: {
    GET: "/serviceman/profile",
    PUT: "/serviceman/profile",
  },
  CATEGORIES: {
    LIST: "/categories",
    LEVELS: (id: number) => `/categories/${id}/levels`,
  },
  DEVICE_TOKEN: {
    REGISTER: "/device-token/register",
    REMOVE: "/device-token/remove",
  },
  NOTIFICATIONS: {
    LIST: "/notifications",
    UNREAD_COUNT: "/notifications/unread-count",
    MARK_READ: (id: number) => `/notifications/${id}/read`,
    MARK_ALL: "/notifications/mark-all-read",
    DELETE: (id: number) => `/notifications/${id}`,
  },
};
