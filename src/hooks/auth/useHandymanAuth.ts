import { useAuthStore } from "@/src/features/auth/auth.store";
import type {
  ServicemanLoginPayload,
  ServicemanRegisterPayload,
  ServicemanSendLoginOtpPayload,
  ServicemanSendOtpPayload,
  ServicemanUpdateProfilePayload,
} from "@/src/features/auth/auth.types";
import { HandymanAuthService } from "@/src/features/auth/handyman-auth.service";
import { useRegisterFcmToken } from "@/src/hooks/notifications/useNotifications";
import { PROFILE_KEYS } from "@/src/lib/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useHandymanSendOtp = () =>
  useMutation({
    mutationFn: (payload: ServicemanSendOtpPayload) =>
      HandymanAuthService.sendOtp(payload),
  });

export const useHandymanSendLoginOtp = () =>
  useMutation({
    mutationFn: (payload: ServicemanSendLoginOtpPayload) =>
      HandymanAuthService.sendLoginOtp(payload),
  });

export const useHandymanLogin = () => {
  const qc = useQueryClient();
  const setAuth = useAuthStore((s) => s.setAuth);
  const registerToken = useRegisterFcmToken();

  return useMutation({
    mutationFn: (payload: ServicemanLoginPayload) =>
      HandymanAuthService.login(payload),
    onSuccess: async (data) => {
      await setAuth(data.user, data.token);
      qc.clear();
      qc.setQueryData(PROFILE_KEYS.all, data.user);
      registerToken.mutate();
    },
  });
};

export const useHandymanRegister = () => {
  const qc = useQueryClient();
  const setAuth = useAuthStore((s) => s.setAuth);
  const registerToken =useRegisterFcmToken();
  return useMutation({
    mutationFn: (payload: ServicemanRegisterPayload) =>
      HandymanAuthService.register(payload),
    onSuccess: async (data) => {
      await setAuth(data.user, data.token);
      qc.clear();
      qc.setQueryData(PROFILE_KEYS.all, data.user);
      registerToken.mutate();
    },
  });
};

export const useHandymanUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ServicemanUpdateProfilePayload) =>
      HandymanAuthService.updateProfile(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PROFILE_KEYS.all });
    },
  });
};
