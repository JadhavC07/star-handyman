import { useAuthStore } from "@/src/features/auth/auth.store";
import type { ServicemanProfile, User } from "@/src/features/auth/auth.types";
import client from "@/src/lib/axios";
import { API_ENDPOINTS } from "@/src/lib/endpoints";
import { PROFILE_KEYS } from "@/src/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";

type HandymanUser = User & { profile: ServicemanProfile };

// API returns the user inside `data` (new contract). Older clients expected `user`.
// We accept either and normalize.
interface RawHandymanProfileResponse {
  success: boolean;
  data?: HandymanUser;
  user?: HandymanUser;
}

interface HandymanProfileResult {
  success: boolean;
  user: HandymanUser;
}

export const useHandymanProfile = () => {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  return useQuery<HandymanProfileResult>({
    queryKey: PROFILE_KEYS.all,
    queryFn: async () => {
      const res = await client.get<RawHandymanProfileResponse>(
        API_ENDPOINTS.HANDYMAN_PROFILE.GET,
      );
      const body = res.data;
      const user = (body.data ?? body.user) as HandymanUser;
      return { success: body.success, user };
    },
    enabled: isLoggedIn,
    staleTime: 5 * 60 * 1000,
  });
};
