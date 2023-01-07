import React, { useState } from 'react'
import {
  Box,
  Checkbox,
  Collapse,
  Flex,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { useBearStore } from '../../../store/store.js'

function UpcomingSportsCard({ sport, leagues }) {
  const { isOpen, onToggle } = useDisclosure()
  const addSelectedSport = useBearStore((state) => state.addSelectedSport)
  const deleteSelectedSport = useBearStore((state) => state.deleteSelectedSport)

  const toggleCheckbox = (isChecked, key) => {
    if (isChecked) {
      addSelectedSport(key)
    } else {
      deleteSelectedSport(key)
    }
  }

  return (
    <Box my={2}>
      <Text onClick={onToggle} cursor="pointer" fontSize="xl" ml={3}>
        {sport}
      </Text>
      <Text>down</Text>
      <Collapse in={isOpen} animateOpacity>
        <Flex ml={5} my={2} flexDirection="column" rowGap={2}>
          {leagues.map((league) => (
            <Checkbox
              key={league.key}
              onChange={(e) => {
                toggleCheckbox(e.target.checked, league.key)
              }}
              fontSize="sm"
            >
              {league.title} - {league.description}
            </Checkbox>
          ))}
        </Flex>
      </Collapse>
    </Box>
  )
}

export default UpcomingSportsCard
