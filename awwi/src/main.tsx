import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from './styles'

const domNode = document.getElementById('app')!
const root = createRoot(domNode)
root.render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>,
)
