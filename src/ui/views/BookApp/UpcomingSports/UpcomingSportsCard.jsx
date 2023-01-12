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
import { ChevronDownIcon } from '@chakra-ui/icons'

function UpcomingSportsCard({ sport, leagues }) {
  const { isOpen, onToggle } = useDisclosure()
  const addSelectedSport = useBearStore((state) => state.addSelectedSport)
  const deleteSelectedSport = useBearStore((state) => state.deleteSelectedSport)
  const [chevronArrowRotation, setChevronArrowRotation] = useState('')

  const expandOptions = () => {
    onToggle()
    setChevronArrowRotation((state) => {
      if (state) return ''
      else return 'rotate(180deg)'
    })
  }

  const toggleCheckbox = (isChecked, key) => {
    if (isChecked) {
      addSelectedSport(key)
    } else {
      deleteSelectedSport(key)
    }
  }

  return (
    <Box my={2}>
      <Flex
        justifyContent="space-between"
        onClick={expandOptions}
        cursor="pointer"
      >
        <Text fontSize="xl" ml={3}>
          {sport}
        </Text>
        <ChevronDownIcon
          transition="all .3s ease"
          transform={chevronArrowRotation}
          my="auto"
          mr="5"
          boxSize={6}
        />
      </Flex>
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
