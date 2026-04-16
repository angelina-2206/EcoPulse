import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      businessData: null,
      theme: 'dark', // Always dark first as per request
      language: 'en',
      
      login: (data) => set({ isAuthenticated: true, businessData: data }),
      logout: () => set({ isAuthenticated: false, businessData: null }),
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      updateBusinessData: (updates) => set((state) => ({
        businessData: { ...state.businessData, ...updates }
      })),
    }),
    {
      name: 'ecopulse-storage', // unique name
    }
  )
)

export default useStore;
