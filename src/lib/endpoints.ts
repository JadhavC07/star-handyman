export const API_ENDPOINTS = {
  AUTH: {
    LOGIN:    "/customer/login",
    REGISTER: "/customer/register",
    SEND_OTP: "/customer/send-login-otp",
    LOGOUT:   "/customer/logout",
  },
  HANDYMAN_AUTH: {
    SEND_OTP: "/serviceman/send-otp",
    LOGIN:    "/serviceman/login",
    REGISTER: "/serviceman/register",
    LOGOUT:   "/serviceman/logout",
  },
  PROFILE: {
    GET:    "/customer/profile",
    UPDATE: "/customer/profile",
  },
  HANDYMAN_PROFILE: {
    GET:    "/serviceman/profile",
    PUT: "/serviceman/profile",
  },
  CATEGORIES: {
    LIST:     "/categories",
    SERVICES: (slug: string) => `/categories/${slug}/services`,
  },
  SERVICES: {
    LIST:   "/services",
    DETAIL: (id: number) => `/services/${id}`,
  },
  CAROUSELS: { LIST: "/carousels" },
};