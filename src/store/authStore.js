import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Dipanggil setelah response login dari backend
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),

      logout: () => set({ user: null, token: null, isAuthenticated: false }),

      updateUser: (updatedUser) => set((state) => ({
        user: { ...state.user, ...updatedUser },
      })),
    }),
    {
      name: 'anaksehat-auth',
      // Mitigasi XSS: gunakan sessionStorage agar token tidak tersimpan permanen
      // di browser. Token hilang saat tab/browser ditutup — user perlu login ulang.
      // Migrasi ideal jangka panjang: gunakan httpOnly cookie dari backend.
      storage: createJSONStorage(() => sessionStorage),
      // Hanya persist data identitas user dan status autentikasi.
      // Token sengaja tidak di-persist agar tidak tersimpan di storage permanen.
      // Interceptor di api.js membaca token dari state in-memory Zustand (getState())
      // yang tetap tersedia selama sesi tab aktif tanpa perlu di-persist.
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        // token TIDAK di-persist — hanya hidup di memori selama sesi tab berlangsung
      }),
    }
  )
)