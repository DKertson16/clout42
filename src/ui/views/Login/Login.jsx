import React, { useState } from 'react'
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Image,
  useColorModeValue,
  Spinner,
} from '@chakra-ui/react'
import { pb } from '../../pocketbase.js'
import { redirect, useNavigate } from 'react-router-dom'
import { useMutation } from 'react-query'
import { login } from '../../helpers.js'

function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  async function login(e) {
    e.preventDefault()
    setIsLoggingIn(true)
    try {
      await pb.collection('users').authWithPassword(username, password)
      navigate('/', { replace: true })
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Image src="src/assets/clout42logo.png" />
          <Heading as={'h4'} size={'lg'}>
            Login
          </Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
        >
          <Stack spacing={4}>
            <form onSubmit={login}>
              <FormControl isRequired id="email">
                <FormLabel>Username</FormLabel>
                <Input
                  type="username"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired id="password">
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <Stack spacing={10}>
                <Stack
                  direction={{ base: 'column', sm: 'row' }}
                  align={'start'}
                  justify={'space-between'}
                ></Stack>
                {isLoggingIn ? (
                  <Button bg={'blue.400'}>
                    <Spinner />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={!username || !password}
                    bg={'blue.400'}
                    color={'white'}
                    _hover={{
                      bg: 'blue.500',
                    }}
                  >
                    Sign in
                  </Button>
                )}
              </Stack>
            </form>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}

export default Login
