import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { storage } from '@/src/lib/mmkv'
import { secureStorage } from '@/src/lib/secureStorage'
import type { User } from './auth.types'

interface AuthState {
  user:       User | null
  isLoggedIn: boolean
  setAuth:    (user: User, token: string) => Promise<void> 
  setUser:    (user: User) => void
  logout:     () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:       null,
      isLoggedIn: false,

      setAuth: async (user, token) => {
        await secureStorage.setAccessToken(token)
        storage.set('isLoggedIn', true)
        set({ user, isLoggedIn: true })
      },

      setUser: (user) => set({ user }),

      logout: async () => {
        await secureStorage.clearAll()
        storage.delete('isLoggedIn')
        set({ user: null, isLoggedIn: false })
      },
    }),
    {
      name:    'auth-store',
      storage: createJSONStorage(() => ({
        setItem:    (k, v) => storage.set(k, v),
        getItem:    (k)    => storage.getString(k) ?? null,
        removeItem: (k)    => storage.delete(k),
      })),
      partialize: (s) => ({ user: s.user, isLoggedIn: s.isLoggedIn }),
    }
  )
)