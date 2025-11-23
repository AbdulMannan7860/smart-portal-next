import { create } from "zustand";

export const useAuthStore = create((set) => ({
  tempToken: null,

  setTempToken: (token) => set({ tempToken: token }),

  clearTempToken: () => set({ tempToken: null }),
}));