import { UPCOMING_ODDS } from './FakeAPI.js'
import { useBearStore } from './store.js'
import { groupBy } from 'lodash'
import { pb } from '../pocketbase.js'

export const fetchUpcomingSports = async () => {
  const response = await pb.send('/api/clout/upcoming-sports')
  const upcomingSports = groupBy(response, 'group')
  return upcomingSports
}

export const fetchStandardOdds = async (selectedSports) => {
  const queryString = selectedSports.join(',')
  const response = await pb.send(
    `/api/clout/standard-odds?sports=${queryString}`,
  )
  return response.filter((arr) => arr.length)
}

export const fetchUpcomingOdds = () => {
  const setUpcomingOdds = useBearStore.getState().setUpcomingOdds
  const upcomingOdds = UPCOMING_ODDS.filter(
    ({ bookmakers }) => bookmakers.length,
  )
  setUpcomingOdds(upcomingOdds)
}

export const fetchHelloWorld = async () => {
  return await pb.send('/api/clout/hello')
}

export const getStandardOddsData = (gameOdds) => {
  const h2hMarket = gameOdds.bookmakers[0].markets.find(
    (el) => el.key === 'h2h',
  )
  const spreadsMarket = gameOdds.bookmakers[0].markets.find(
    (el) => el.key === 'spreads',
  )
  const totalsMarket = gameOdds.bookmakers[0].markets.find(
    (el) => el.key === 'totals',
  )

  const homeTeamH2hOutcome = h2hMarket?.outcomes.find(
    (el) => el.name === gameOdds.home_team,
  )
  const homeTeamSpreadOutcome = spreadsMarket?.outcomes.find(
    (el) => el.name === gameOdds.home_team,
  )
  const totalsOutcomeOver = totalsMarket?.outcomes.find(
    (el) => el.name === 'Over',
  )

  const awayTeamH2hOutcome = h2hMarket?.outcomes.find(
    (el) => el.name === gameOdds.away_team,
  )
  const awayTeamSpreadOutcome = spreadsMarket?.outcomes.find(
    (el) => el.name === gameOdds.away_team,
  )
  const totalsOutcomeUnder = totalsMarket?.outcomes.find(
    (el) => el.name === 'Under',
  )

  return {
    id: gameOdds.id,
    [gameOdds.home_team]: {
      h2h: homeTeamH2hOutcome,
      spreads: homeTeamSpreadOutcome,
      totals: totalsOutcomeOver,
    },
    [gameOdds.away_team]: {
      h2h: awayTeamH2hOutcome,
      spreads: awayTeamSpreadOutcome,
      totals: totalsOutcomeUnder,
    },
  }
}
