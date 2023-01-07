import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

const store = (set) => ({
  sports: {},
  setSports: (sports) => set(() => ({ sports })),

  upcomingOdds: null,
  setUpcomingOdds: (upcomingOdds) => set(() => ({ upcomingOdds })),

  selectedSports: [],
  addSelectedSport: (selectedSport) =>
    set((state) => ({
      selectedSports: [...state.selectedSports, selectedSport],
    })),
  deleteSelectedSport: (selectedSport) =>
    set((state) => ({
      selectedSports: state.selectedSports.filter(
        (sport) => sport !== selectedSport,
      ),
    })),
  clearSelectedSports: () => set((state) => ({ selectedSports: [] })),
})

const persistedStore = (set) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),
})

export const useBearStore = create(devtools(store))
export const usePersistedStore = create(devtools(persist(persistedStore)))
