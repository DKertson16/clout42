import { pb } from './pocketbase.js'

export const login = async (username, password) => {
  return await pb.collection('users').authWithPassword(username, password)
}

export const formatPrice = (price) => {
  if (Math.sign(price) === 1) {
    return `+${price}`
  }
  return price
}

export const getBetTypeText = (gameOdds) => {
  if (gameOdds.bet_type === 'h2h') {
    return 'MONEYLINE'
  }
  if (gameOdds.bet_type === 'spreads') {
    return formatPrice(gameOdds.odds.point)
  }
  if (gameOdds.bet_type === 'totals') {
    return `${gameOdds.odds.name} ${gameOdds.odds.point}`
  }
  return null
}
