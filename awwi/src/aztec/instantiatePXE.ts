import { waitForPXE, createPXEClient } from '@aztec/aztec.js'
import { PXE_URL } from '../constants'

export const setupSandbox = async () => {
  const pxe = createPXEClient(PXE_URL)
  await waitForPXE(pxe)
  return pxe
}

export default setupSandbox
