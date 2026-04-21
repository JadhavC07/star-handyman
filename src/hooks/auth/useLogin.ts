import { AuthService } from "@/src/features/auth/auth.service";
import type { LoginWithPasswordPayload } from "@/src/features/auth/auth.types";
import { useMutation } from "@tanstack/react-query";

export const useLoginWithPassword = () => {
  return useMutation({
    mutationFn: (payload: LoginWithPasswordPayload) =>
      AuthService.loginWithPassword(payload),
  });
};
