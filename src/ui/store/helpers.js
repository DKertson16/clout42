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
  let response = await pb.send(`/api/clout/standard-odds?sports=${queryString}`)
  response = response.filter((arr) => arr.length)
  response = response.map((arr) =>
    arr.sort((a, b) => new Date(a.commence_time) - new Date(b.commence_time)),
  )
  response = response.map((sportOdds) => {
    return sportOdds.map((gameOdds) => {
      const h2hMarket =
        gameOdds.bookmakers?.[0]?.markets.find((el) => el.key === 'h2h') || null
      const spreadsMarket =
        gameOdds.bookmakers?.[0]?.markets.find((el) => el.key === 'spreads') ||
        null
      const totalsMarket =
        gameOdds.bookmakers?.[0]?.markets.find((el) => el.key === 'totals') ||
        null
      return {
        id: gameOdds.id,
        commence_time: gameOdds.commence_time,
        sport_key: gameOdds.sport_key,
        sport_title: gameOdds.sport_title,
        home_team: {
          team_name: gameOdds.home_team,
          h2h: h2hMarket?.outcomes.find((el) => el.name === gameOdds.home_team),
          spreads: spreadsMarket?.outcomes.find(
            (el) => el.name === gameOdds.home_team,
          ),
          totals: totalsMarket?.outcomes.find((el) => el.name === 'Over'),
        },
        away_team: {
          team_name: gameOdds.away_team,
          h2h: h2hMarket?.outcomes.find((el) => el.name === gameOdds.away_team),
          spreads: spreadsMarket?.outcomes.find(
            (el) => el.name === gameOdds.away_team,
          ),
          totals: totalsMarket?.outcomes.find((el) => el.name === 'Under'),
        },
      }
    })
  })
  return response
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
    commence_time: gameOdds.commence_time,
    sport_key: gameOdds.sport_key,
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

export const placeStandardBet = async (betAmt, gameOdds) => {
  betAmt = parseInt(betAmt)
  const authData = await pb.collection('users').authRefresh()
  const balance = authData.record.balance
  if (betAmt > balance) {
    return new Error('you do not have enough balance')
  }
  console.log({ ...gameOdds, bet_amount: betAmt })
  const queryString = JSON.stringify({ ...gameOdds, bet_amount: betAmt })
  const res = await pb.send(`/api/clout/place-bet?bet=${queryString}`, {
    method: 'POST',
  })
  console.log(res)
}
