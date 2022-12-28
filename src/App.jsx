import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import Index from './ui/views/Index/Index.jsx'

function App() {
  return (
    <ChakraProvider>
      <Index />
    </ChakraProvider>
  )
}

export default App
