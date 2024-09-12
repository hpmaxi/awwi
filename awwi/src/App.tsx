import React, { Suspense, lazy } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Center as BaseCenter, chakra, Spinner, Text } from '@chakra-ui/react'

const Center = chakra(BaseCenter, {
  baseStyle: {
    minHeight: '100vh',
    width: '100vw',
  },
})

const WalletPageLazy = lazy(() => {
  return new Promise((resolve) => resolve(import('./pages/WalletPage') as any))
})

const client = new QueryClient()

export const App = () => {
  return (
    <QueryClientProvider client={client}>
      <Center bgColor="#fcfbfc">
        <Suspense
          fallback={
            <Center flexDirection="column" rowGap={4}>
              <Spinner label="Loading PXE Assets..." />
              <Text fontSize="md">Loading PXE Assets...</Text>
            </Center>
          }
        >
          <WalletPageLazy />
        </Suspense>
      </Center>
    </QueryClientProvider>
  )
}
