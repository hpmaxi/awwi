import React, { useCallback, useState } from 'react'
import { AccountManager, CompleteAddress, Fr } from '@aztec/aztec.js'
import { Address, keccak256 } from 'viem'

import { setupSandbox } from '../aztec/instantiatePXE'
import { createAccount } from '../aztec/createAccount'
import { deployAccount } from '../aztec/deployAccount'
import { LoadingSandbox } from '../components/LoadingSandbox'
import { useQuery } from '@tanstack/react-query'
import { AztecAccountsList } from '../components/AztecAccountsList'
import { EVMSigner } from '../components/EVMSigner'
import {
  Button,
  Card,
  CardBody,
  Center,
  Code,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'

export const WalletPage: React.FC = () => {
  const [isCreatingWallet, setIsCreatingWallet] = useState(false)
  const [secret, setSecret] = useState<string | null>(null)
  const [account, setAccount] = useState<AccountManager | null>(null)
  const [selectedAccount, setSelectedAccount] = useState<CompleteAddress | undefined>(undefined)

  // useSuspenseQuery
  const { data: pxe, isLoading: isLoadingSandbox } = useQuery({
    queryKey: ['pxe'],
    queryFn: () => setupSandbox(),
  })

  const { data: registeredAccounts = [], refetch: updatePXEState } = useQuery({
    enabled: pxe !== undefined,
    queryFn: () => pxe?.getRegisteredAccounts(),
    queryKey: ['pxe-accounts'],
  })

  const isDisabledCreateAztecWallet = !pxe || isCreatingWallet

  const checkAccountStatus = useCallback(async () => {
    if (!pxe || !account) {
      return { isRegistered: false, isDeployed: false }
    }
    const accountAddress = await account.getAddress()
    const isRegistered = registeredAccounts.some(
      (e: CompleteAddress) => e.address.toString() === accountAddress.toString(),
    )
    const instance = await pxe.getContractInstance(accountAddress)

    return { isRegistered, isDeployed: !!instance?.deployer }
  }, [pxe, registeredAccounts, account])

  const handleSecretGenerated = useCallback((generatedSecret: string) => {
    setSecret(generatedSecret)
    console.log('Generated secret:', generatedSecret)
  }, [])

  const handleCreateWallet = useCallback(async () => {
    if (!pxe) return

    setIsCreatingWallet(true)

    const randomness = secret ? Fr.fromString(keccak256(secret as Address)) : undefined

    try {
      const newAccount = await createAccount(pxe, randomness, undefined)
      setAccount(newAccount)
      //console.log({ account: newAccount });

      const { isDeployed } = await checkAccountStatus()
      if (!isDeployed) {
        const txReceipt = await deployAccount(newAccount)
        console.log({ txReceipt })
      }
      setSelectedAccount(newAccount.getCompleteAddress())
    } catch (e) {
      console.error('Error creating or deploying account', e)
    } finally {
      setIsCreatingWallet(false)
      updatePXEState()
    }
  }, [pxe, secret, checkAccountStatus])

  if (isLoadingSandbox) {
    return <LoadingSandbox />
  }

  return (
    <>
      <Modal
        isCentered
        isOpen={isDisabledCreateAztecWallet}
        onClose={() => {
          return
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalBody p={8}>
            <Center flexDirection="column" rowGap={4}>
              <Spinner label="Loading PXE Assets..." />
              <Text fontSize="md">
                {secret === null
                  ? `Using random secret for Aztec account generation...`
                  : `Using unique secret based on connected account...`}
              </Text>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
      <VStack spacing={4} align={'flex-start'}>
        <Heading size="md">Aztec Wallet Wheez(i)</Heading>
        <Card maxWidth={'calc(100vw - 16px)'} width={'600px'}>
          <CardBody rowGap={'16px'} display="flex" flexDirection="column">
            <Flex columnGap={3}>
              <AztecAccountsList
                accounts={registeredAccounts}
                onSelect={(selectedAccount) => {
                  setSelectedAccount(selectedAccount)
                }}
                selected={selectedAccount}
              />
              <Button
                isDisabled={isDisabledCreateAztecWallet}
                onClick={handleCreateWallet}
                title="Add account"
              >
                <AddIcon />
              </Button>
            </Flex>
            {selectedAccount && (
              <>
                <Heading size="sm">Account Details</Heading>
                <Code p={4} borderRadius={6}>
                  {selectedAccount.toString()}
                </Code>
              </>
            )}
          </CardBody>
        </Card>
        <Card maxWidth={'calc(100vw - 16px)'} width={'600px'}>
          <CardBody rowGap={'16px'} display="flex" flexDirection="column">
            <EVMSigner onSecretGenerated={handleSecretGenerated} />
          </CardBody>
        </Card>
      </VStack>
    </>
  )
}

export default WalletPage
