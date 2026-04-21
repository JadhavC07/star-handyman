import { useAuthStore } from "@/src/features/auth/auth.store";
import { ProfileService } from "@/src/features/profile/profile.service";
import type { UpdateProfilePayload } from "@/src/features/profile/profile.types";
import { PROFILE_KEYS } from "@/src/lib/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      ProfileService.updateProfile(payload),
    onSuccess: (data) => {
      // NOTE: pre-existing type mismatch — ProfileService.updateProfile returns
      // ProfileData (not { user }), so `data.user` may be undefined at runtime.
      // Tracked separately; keeping behavior identical here.
      setUser(data.user);
      queryClient.setQueryData(PROFILE_KEYS.all, data);
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.all });
    },
  });
};
