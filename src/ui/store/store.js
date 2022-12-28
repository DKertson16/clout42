import create from 'zustand'
import { mountStoreDevtool } from 'simple-zustand-devtools'

export const useBearStore = create((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),
  sports: null,
  setSports: (sports) => set(() => ({ sports })),
  upcomingOdds: null,
  setUpcomingOdds: (upcomingOdds) => set(() => ({ upcomingOdds })),
}))

mountStoreDevtool('Store', useBearStore)
