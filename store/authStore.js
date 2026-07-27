'use client';
import { create }   from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      token:    null,
      user:     null,
      hydrated: false,

      setAuth: (token, user) => set({ token, user }),

      updateUser: (updates) =>
        set((s) => ({ user: { ...s.user, ...updates } })),

      logout: () => set({ token: null, user: null }),

      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name:    'ksu-auth',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
