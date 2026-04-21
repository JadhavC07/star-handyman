import { useAuthStore } from "@/src/features/auth/auth.store";
import { ProfileService } from "@/src/features/profile/profile.service";
import { PROFILE_KEYS } from "@/src/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";

export const useProfile = () => {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  return useQuery({
    queryKey: PROFILE_KEYS.all,
    queryFn: ProfileService.getProfile,
    enabled: isLoggedIn,
    staleTime: 5 * 60 * 1000,
    select: (data) => {
      console.log("[PROFILE] query select fired, data:", JSON.stringify(data));
      return data;
    },
  });
};
