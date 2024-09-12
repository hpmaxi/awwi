import React from 'react'
import { Center, Spinner, Text, Heading } from '@chakra-ui/react'

export const LoadingSandbox = () => {
  return (
    <Center flexDirection="column" rowGap={4}>
      <Spinner label="Setting up your sandbox..." />
      <Heading size="md">Setting up your sandbox...</Heading>
      <Text fontSize="md">This may take a few moments. Please wait.</Text>
    </Center>
  )
}
