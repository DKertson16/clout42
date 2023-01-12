import React, { useState } from 'react'
import NavBar from '../NavBar.jsx'
import { useBearStore } from '../../../store/store.js'
import { Navigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { fetchStandardOdds } from '../../../store/helpers.js'
import LoadingPage from '../../LoadingPage/LoadingPage.jsx'
import {
  Box,
  Card,
  CardBody,
  Divider,
  Grid,
  GridItem,
  Heading,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import OddsCard from '../components/OddsCard.jsx'
import { format } from 'date-fns'
import BetModal from '../components/BetModal.jsx'

function Odds() {
  const selectedSports = useBearStore((state) => state.selectedSports)
  if (!selectedSports.length) return <Navigate to="/" />

  const {
    data: standardOdds,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery('standard-odds', () => fetchStandardOdds(selectedSports))
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedBetOdds, setSelectedBetOdds] = useState({})

  const onBetClick = async (gameOdds, team, betType) => {
    const betObj = {
      bet_type: betType,
      team,
      home_team_name: gameOdds.home_team.team_name,
      away_team_name: gameOdds.away_team.team_name,
      game_id: gameOdds.id,
      commence_time: gameOdds.commence_time,
      sport_title: gameOdds.sport_title,
      sport_key: gameOdds.sport_key,
      odds: { ...gameOdds[team][betType], team_name: gameOdds[team].team_name },
    }
    setSelectedBetOdds(betObj)
    onOpen()
  }

  if (isLoading || isRefetching)
    return (
      <>
        <NavBar />
        <LoadingPage />
      </>
    )

  return (
    <>
      <NavBar />
      {standardOdds.map((sportsOddsArr) => (
        <Box
          key={sportsOddsArr[0].sport_title}
          backgroundColor="blackAlpha.500"
        >
          <Heading color="blue.900" py={3} textAlign="center" size="xl">
            {sportsOddsArr[0].sport_title}
          </Heading>
          {sportsOddsArr.map((gameOdds) => {
            const teams = {
              home_team: gameOdds.home_team.team_name,
              away_team: gameOdds.away_team.team_name,
            }
            return (
              <Box p={1} key={gameOdds.id}>
                <Card backgroundColor="gray.50">
                  <CardBody>
                    <Text fontWeight="bold" as="i">{`${format(
                      new Date(gameOdds.commence_time),
                      'E p',
                    )}`}</Text>
                    <Text fontSize="lg">{`${teams.away_team} @ ${teams.home_team}`}</Text>
                    <Divider my={3} />
                    <Grid templateColumns="repeat(4, 1fr)" gap="6">
                      {['home_team', 'away_team'].map((team) => (
                        <React.Fragment key={team}>
                          <GridItem my="auto">{teams[team]}</GridItem>
                          <GridItem>
                            <OddsCard
                              point={gameOdds[team].spreads?.point}
                              price={gameOdds[team].spreads?.price}
                              onClick={() =>
                                onBetClick(gameOdds, team, 'spreads')
                              }
                            />
                          </GridItem>
                          <GridItem>
                            <OddsCard
                              point={gameOdds[team].totals?.point}
                              price={gameOdds[team].totals?.price}
                              totalOutcomeName={
                                team === 'home_team' ? 'Over' : 'Under'
                              }
                              onClick={() =>
                                onBetClick(gameOdds, team, 'totals')
                              }
                            />
                          </GridItem>
                          <GridItem>
                            <OddsCard
                              point={gameOdds[team].h2h?.point}
                              price={gameOdds[team].h2h?.price}
                              onClick={() => onBetClick(gameOdds, team, 'h2h')}
                            />
                          </GridItem>
                        </React.Fragment>
                      ))}
                    </Grid>
                  </CardBody>
                </Card>
              </Box>
            )
          })}
        </Box>
      ))}

      {isOpen && (
        <BetModal
          isOpen={isOpen}
          onClose={onClose}
          gameOdds={selectedBetOdds}
        />
      )}
    </>
  )
}

export default Odds
