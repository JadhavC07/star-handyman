import client from '@/src/lib/axios'
import { API_ENDPOINTS } from '@/src/lib/endpoints'
import type {
  AuthResponse,
  LoginWithPasswordPayload,
  LoginWithOtpPayload,
  SendOtpPayload,
  RegisterPayload,
} from './auth.types'

export const AuthService = {
  loginWithPassword: (payload: LoginWithPasswordPayload) =>
    client.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, payload).then(r => r.data),

  loginWithOtp: (payload: LoginWithOtpPayload) =>
    client.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, payload).then(r => r.data),

  sendOtp: (payload: SendOtpPayload) =>
    client.post(API_ENDPOINTS.AUTH.SEND_OTP, payload).then(r => r.data),

  register: (payload: RegisterPayload) =>
    client.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, payload).then(r => r.data),

  logout: () =>
    client.post(API_ENDPOINTS.AUTH.LOGOUT),
}