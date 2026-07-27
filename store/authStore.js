'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token:    null,
      user:     null,
      hydrated: false,

      setAuth: (token, user) => set({ token, user }),

      updateUser: (updates) =>
        set((s) => ({ user: { ...s.user, ...updates } })),

      logout: () => set({ token: null, user: null }),

      // Called automatically when localStorage is loaded
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name:    'ksu-auth',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // This runs after localStorage data is loaded into Zustand
        if (state) {
          state.setHydrated();
        }
      },
    }
  )
);
