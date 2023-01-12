import React, { useState } from 'react'
import {
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react'
import { formatPrice, getBetTypeText } from '../../../helpers.js'
import { placeStandardBet } from '../../../store/helpers.js'
import { pb } from '../../../pocketbase.js'

function BetModal({ isOpen, onClose, gameOdds }) {
  const formattedPrice = formatPrice(gameOdds.odds.price)

  const [betAmt, setBetAmt] = useState('')

  const handleBetAmtChange = (e) => setBetAmt(e.target.value)

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Bet Slip</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex justifyContent="space-between">
            <Box my="auto" mr={2} width="70%">
              <Text>{gameOdds.odds.name}</Text>
              <Text>{getBetTypeText(gameOdds)}</Text>
              <Text
                noOfLines={1}
                as="i"
              >{`${gameOdds.away_team_name} @ ${gameOdds.home_team_name}`}</Text>
            </Box>
            <Box my="auto">
              <Text mr={1} fontWeight="bold" textAlign="right">
                {formattedPrice}
              </Text>
              <FormControl isRequired>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.500"
                    children="$"
                  />
                  <Input type={'number'} onChange={handleBetAmtChange} />
                </InputGroup>
              </FormControl>
            </Box>
          </Flex>
        </ModalBody>

        <ModalFooter justifyContent="space-between">
          <Button>Add to Parlay</Button>
          <Button
            colorScheme="blue"
            onClick={() => placeStandardBet(betAmt, gameOdds)}
          >
            Place Bet
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default BetModal
