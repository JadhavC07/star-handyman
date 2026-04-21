import { AuthService } from "@/src/features/auth/auth.service";
import type { LoginWithOtpPayload } from "@/src/features/auth/auth.types";
import { useMutation } from "@tanstack/react-query";

export const useLoginWithOtp = () => {
  return useMutation({
    mutationFn: (payload: LoginWithOtpPayload) =>
      AuthService.loginWithOtp(payload),
  });
};
