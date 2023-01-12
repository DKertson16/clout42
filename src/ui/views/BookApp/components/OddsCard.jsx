import React from 'react'
import { Box, Card, Center, Flex, Text } from '@chakra-ui/react'
import { formatPrice } from '../../../helpers.js'

function OddsCard({
  point = null,
  price = null,
  totalOutcomeName = null,
  onClick = () => {},
}) {
  if (!point && !price) {
    return (
      <Card opacity="50%" h="55px" border="1px" borderColor="gray.300">
        <Center my="auto">Unavailable</Center>
      </Card>
    )
  }

  if (totalOutcomeName) {
    point = `${totalOutcomeName.charAt(0)} ${point}`
  } else if (Math.sign(point) === 1) {
    point = `+${point}`
  }
  const formattedPrice = formatPrice(price)

  return (
    <Card
      onClick={onClick}
      h="55px"
      border="1px"
      borderColor="gray.300"
      cursor="pointer"
    >
      <Flex flexDirection="column" my="auto">
        <Center>{point !== 0 && <Text>{point}</Text>}</Center>
        <Center>
          <Text fontWeight="bold" color="green.600">
            {formattedPrice}
          </Text>
        </Center>
      </Flex>
    </Card>
  )
}

export default OddsCard
