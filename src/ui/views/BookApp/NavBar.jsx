import React from 'react'
import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Link,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { pb } from '../../pocketbase.js'
import { useBearStore } from '../../store/store.js'
import { Link as RouterLink, useNavigate } from 'react-router-dom'

function NavBar({ showContinueButton = false }) {
  const navigate = useNavigate()
  const selectedSports = useBearStore((state) => state.selectedSports)
  const Links = ['Dashboard', 'Projects', 'Team', 'Chillin']
  const { isOpen, onOpen, onClose } = useDisclosure()

  const onContinue = () => {
    navigate('/odds')
  }
  const NavLink = ({ children }) => (
    <Link
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
      href={'#'}
    >
      {children}
    </Link>
  )

  function logout() {
    pb.authStore.clear()
    navigate('/login')
  }

  return (
    <>
      <Box
        position="sticky"
        top={0}
        zIndex={1}
        bg={useColorModeValue('gray.100', 'gray.900')}
        px={4}
      >
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            {showContinueButton ? (
              <Button
                onClick={onContinue}
                rightIcon={<ArrowForwardIcon />}
                colorScheme="teal"
                variant="outline"
              >
                Continue
              </Button>
            ) : (
              <RouterLink to="/">
                <Box>Clout42</Box>
              </RouterLink>
            )}
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}
            >
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <Menu autoSelect={false}>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}
              >
                <Avatar
                  size={'sm'}
                  src={
                    'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                  }
                />
              </MenuButton>
              <MenuList>
                <MenuItem>Link 1</MenuItem>
                <MenuItem>Link 2</MenuItem>
                <MenuDivider />
                <MenuItem onClick={logout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  )
}

export default NavBar
