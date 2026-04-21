import { AuthService } from "@/src/features/auth/auth.service";
import { HandymanAuthService } from "@/src/features/auth/handyman-auth.service";
import { useAuthStore } from "@/src/features/auth/auth.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLogout = () => {
  const qc = useQueryClient();
  const logout = useAuthStore((s) => s.logout);

  return useMutation({
    // Logout error is expected when token is already expired; handled locally.
    meta: { silent: true },
    mutationFn: () => {
      const role = useAuthStore.getState().user?.role;
      return role === "specialist"
        ? HandymanAuthService.logout()
        : AuthService.logout();
    },
    onSuccess: async () => {
      await logout();
      qc.clear();
    },
    onError: async () => {
      // Clear local session even if API call fails (token may be expired)
      await logout();
      qc.clear();
    },
  });
};
