import { UPCOMING_ODDS } from './FakeAPI.js'
import { useBearStore } from './store.js'

export const fetchUpcomingSports = () => {}

export const fetchUpcomingOdds = () => {
  const setUpcomingOdds = useBearStore.getState().setUpcomingOdds
  const upcomingOdds = UPCOMING_ODDS.filter(
    ({ bookmakers }) => bookmakers.length,
  )
  setUpcomingOdds(upcomingOdds)
}
