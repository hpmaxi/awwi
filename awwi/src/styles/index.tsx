import { defineStyleConfig, defineStyle } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'

const spinnerDefaultStyle = defineStyle({
  borderWidth: '6px',
  color: 'var(--color-primary)',
  height: '40px',
  speed: '1s',
  width: '40px',
})

const Spinner = defineStyleConfig({
  variants: { spinnerDefaultStyle },
  defaultProps: {
    variant: 'spinnerDefaultStyle',
  },
})

export const theme = extendTheme({
  styles: {
    global: {
      ':root': {
        '--color-primary': '#8c7eff',
      },
      a: {
        color: 'var(--color-primary)',
      },
    },
  },
  components: {
    Spinner,
  },
})
