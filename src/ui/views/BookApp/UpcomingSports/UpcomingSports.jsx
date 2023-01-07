import React, { Fragment, useEffect } from 'react'
import { fetchUpcomingSports } from '../../../store/helpers.js'
import UpcomingSportsCard from './UpcomingSportsCard.jsx'
import { Divider, Flex } from '@chakra-ui/react'
import { useQuery } from 'react-query'
import LoadingPage from '../../LoadingPage/LoadingPage.jsx'
import { useBearStore } from '../../../store/store.js'

function UpcomingSports() {
  const {
    data: upcomingSports,
    isLoading,
    isError,
  } = useQuery('upcoming-sports', fetchUpcomingSports)
  const clearSelectedSports = useBearStore((state) => state.clearSelectedSports)

  useEffect(() => {
    clearSelectedSports()
  }, [])

  if (isLoading) return <LoadingPage />

  if (isError) return 'Error'

  return (
    <Flex flexDirection="column">
      {Object.keys(upcomingSports).map((sport) => (
        <Fragment key={sport}>
          <UpcomingSportsCard sport={sport} leagues={upcomingSports[sport]} />
          <Divider />
        </Fragment>
      ))}
    </Flex>
  )
}

export default UpcomingSports
