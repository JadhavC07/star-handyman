import client from '@/src/lib/axios'
import { API_ENDPOINTS } from '@/src/lib/endpoints'
import type { ProfileData, UpdateProfilePayload } from './profile.types'

interface ProfileResponse {
  status: string
  data:   ProfileData
}

export const ProfileService = {
  getProfile: () =>
    client.get<ProfileResponse>(API_ENDPOINTS.PROFILE.GET).then(r => r.data.data),

  updateProfile: (payload: UpdateProfilePayload) =>
    client.put<ProfileResponse>(API_ENDPOINTS.PROFILE.UPDATE, payload).then(r => r.data.data),
}