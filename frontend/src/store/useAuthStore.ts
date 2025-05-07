import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      setIsLoggedIn: (value) => set({ isLoggedIn: value }),
      logout: () => set({ isLoggedIn: false }),
    }),
    {
      name: 'auth-storage', // localStorage 키 이름
    }
  )
);
