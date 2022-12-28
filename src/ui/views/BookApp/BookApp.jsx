import React, { useEffect } from 'react'
import NavBar from './NavBar/NavBar.jsx'
import { Box } from '@chakra-ui/react'
import { fetchUpcomingOdds } from '../../store/helpers.js'

function BookApp() {
  useEffect(() => {
    fetchUpcomingOdds()
  }, [])

  return (
    <>
      <NavBar />
      <Box>main content</Box>
    </>
  )
}

export default BookApp
