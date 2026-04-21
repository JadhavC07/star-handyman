export interface SavedLocation {
  name: string
  lat:  number
  lng:  number
}

export interface ProfileMeta {
  preferred_time?:        string
  notifications_enabled?: boolean
  favorite_service?:      string
  [key: string]:          unknown
}

export interface UserProfile {
  address:         string | null
  city:            string | null
  pincode:         string | null
  saved_locations: SavedLocation[]
  meta:            ProfileMeta | []
}

export interface ProfileData {
  user:    import('@/src/features/auth/auth.types').User
  profile: UserProfile
}

export interface UpdateProfilePayload {
  name?:            string
  phone?:           string
  address?:         string
  city?:            string
  pincode?:         string
  saved_locations?: SavedLocation[]
  meta?:            ProfileMeta
}