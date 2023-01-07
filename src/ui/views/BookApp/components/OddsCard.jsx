import React from 'react'
import { Box, Card, Center, Flex, Text } from '@chakra-ui/react'

function OddsCard({ point = null, price = null, totalOutcomeName = null }) {
  if (!point && !price) {
    return (
      <Card opacity="50%" h="55px" border="1px" borderColor="gray.300">
        <Center my="auto">Unavailable</Center>
      </Card>
    )
  }

  if (totalOutcomeName) {
    point = `${totalOutcomeName.charAt(0)}${point}`
  } else if (Math.sign(point) === 1) {
    point = `+${point}`
  }
  if (Math.sign(price) === 1) {
    price = `+${price}`
  }

  return (
    <Card h="55px" border="1px" borderColor="gray.300">
      <Flex flexDirection="column" my="auto">
        <Center>{point !== 0 && <Text>{point}</Text>}</Center>
        <Center>
          <Text fontWeight="bold" color="green.600">
            {price}
          </Text>
        </Center>
      </Flex>
    </Card>
  )
}

export default OddsCard
