import { AuthService } from '@/src/features/auth/auth.service'
import { useMutation } from '@tanstack/react-query'

export const useSendOtp = () =>
  useMutation({
    mutationFn: (email: string) => AuthService.sendOtp({ email }),
  })