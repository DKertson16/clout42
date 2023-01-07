import React from 'react'
import { Center, Spinner } from '@chakra-ui/react'
import NavBar from '../BookApp/NavBar.jsx'

function LoadingPage() {
  return (
    <>
      <Center h="90vh">
        <Spinner size="xl" />
      </Center>
    </>
  )
}

export default LoadingPage
