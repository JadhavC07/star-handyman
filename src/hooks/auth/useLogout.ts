import { useAuthStore } from "@/src/features/auth/auth.store";
import { HandymanAuthService } from "@/src/features/auth/handyman-auth.service";
import { useRemoveFcmToken } from "@/src/hooks/notifications/useNotifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLogout = () => {
  const qc = useQueryClient();
  const logout = useAuthStore((s) => s.logout);

  const removeFcmToken = useRemoveFcmToken();
  return useMutation({
    // Logout error is expected when token is already expired; handled locally.
    meta: { silent: true },
    mutationFn: async () => {
      await removeFcmToken.mutateAsync().catch(() => {});
      return HandymanAuthService.logout();
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
