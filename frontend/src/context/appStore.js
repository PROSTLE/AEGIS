import create from 'zustand'

export const useAppStore = create((set) => ({
  selectedCity: null,
  selectedSector: null,
  currentUser: null,
  darkMode: false,

  setSelectedCity: (city) => set({ selectedCity: city }),
  setSelectedSector: (sector) => set({ selectedSector: sector }),
  setCurrentUser: (user) => set({ currentUser: user }),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
}))
