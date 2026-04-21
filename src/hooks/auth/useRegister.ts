import { AuthService } from '@/src/features/auth/auth.service'
import { useAuthStore } from '@/src/features/auth/auth.store'
import type { RegisterPayload } from '@/src/features/auth/auth.types'
import { PROFILE_KEYS } from '@/src/lib/queryKeys'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useRegister = () => {
  const qc = useQueryClient()
  const setAuth = useAuthStore((s) => s.setAuth)
  return useMutation({
    mutationFn: (payload: RegisterPayload) => AuthService.register(payload),
    onSuccess: async (data) => {
      await setAuth(data.user, data.token)
      qc.clear()
      qc.setQueryData(PROFILE_KEYS.all, data.user)
    },
  })
}
