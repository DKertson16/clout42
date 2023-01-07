import React, { useEffect } from 'react'
import NavBar from '../NavBar.jsx'
import { useBearStore } from '../../../store/store.js'
import { Navigate, redirect, useLocation } from 'react-router-dom'
import { useQuery } from 'react-query'
import {
  fetchStandardOdds,
  getStandardOddsData,
} from '../../../store/helpers.js'
import LoadingPage from '../../LoadingPage/LoadingPage.jsx'
import {
  Box,
  Card,
  CardBody,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
} from '@chakra-ui/react'
import OddsCard from '../components/OddsCard.jsx'

function Odds() {
  const selectedSports = useBearStore((state) => state.selectedSports)
  if (!selectedSports.length) return <Navigate to="/" />
  const {
    data: standardOdds,
    isLoading,
    isError,
  } = useQuery('standard-odds', () => fetchStandardOdds(selectedSports))

  if (isLoading) return <LoadingPage />

  return (
    <>
      <NavBar />
      {standardOdds.map((sportsOddsArr) => (
        <>
          <Heading size="lg">{sportsOddsArr[0].sport_title}</Heading>
          {sportsOddsArr.map((gameOdds) => {
            const oddsData = getStandardOddsData(gameOdds)
            const { home_team, away_team } = gameOdds
            return (
              <Box m={2} key={oddsData.id}>
                <Card backgroundColor="gray.50">
                  <CardBody>
                    <Grid templateColumns="repeat(4, 1fr)" gap="6">
                      <GridItem my="auto">{home_team}</GridItem>
                      <GridItem>
                        <OddsCard
                          point={oddsData[home_team].spreads?.point}
                          price={oddsData[home_team].spreads?.price}
                        />
                      </GridItem>
                      <GridItem>
                        <OddsCard
                          point={oddsData[home_team].totals?.point}
                          price={oddsData[home_team].totals?.price}
                          totalOutcomeName="Over"
                        />
                      </GridItem>
                      <GridItem>
                        <OddsCard
                          point={oddsData[home_team].h2h?.point}
                          price={oddsData[home_team].h2h?.price}
                        />
                      </GridItem>
                      <GridItem my="auto">{away_team}</GridItem>
                      <GridItem>
                        <OddsCard
                          point={oddsData[away_team].spreads?.point}
                          price={oddsData[away_team].spreads?.price}
                        />
                      </GridItem>
                      <GridItem>
                        <OddsCard
                          point={oddsData[away_team].totals?.point}
                          price={oddsData[away_team].totals?.price}
                          totalOutcomeName="Under"
                        />
                      </GridItem>
                      <GridItem>
                        <OddsCard
                          point={oddsData[away_team].h2h?.point}
                          price={oddsData[away_team].h2h?.price}
                        />
                      </GridItem>
                    </Grid>
                  </CardBody>
                </Card>
              </Box>
            )
          })}
        </>
      ))}
    </>
  )
}

export default Odds
