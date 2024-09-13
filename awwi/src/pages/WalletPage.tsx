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
  StackDivider,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react'
import { AddIcon, ViewIcon } from '@chakra-ui/icons'

export const WalletPage: React.FC = () => {
  const [isCreatingWallet, setIsCreatingWallet] = useState(false)
  const [secret, setSecret] = useState<string | null>(null)
  const [account, setAccount] = useState<AccountManager | null>(null)
  const [selectedAccount, setSelectedAccount] = useState<CompleteAddress | undefined>(undefined)
  const [viewDetails, setViewDetails] = useState(false)
  const [addAccount, setAddAccount] = useState(false)

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
  }, [])

  const handleCreateWallet = useCallback(async () => {
    if (!pxe) return

    setIsCreatingWallet(true)

    const randomness = secret ? Fr.fromString(keccak256(secret as Address)) : undefined

    try {
      const newAccount = await createAccount(pxe, randomness, undefined)
      setAccount(newAccount)

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
      setAddAccount(false)
    }
  }, [pxe, secret, checkAccountStatus])

  if (isLoadingSandbox) {
    return <LoadingSandbox />
  }

  return (
    <>
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
                isDisabled={isDisabledCreateAztecWallet || !selectedAccount}
                onClick={() => setViewDetails(true)}
                title="View account details"
              >
                <ViewIcon />
              </Button>
              <Button
                isDisabled={isDisabledCreateAztecWallet}
                onClick={() => setAddAccount(true)}
                title="Add account"
              >
                <AddIcon />
              </Button>
            </Flex>
            {selectedAccount && (
              <Tabs>
                <TabList>
                  <Tab>Public Tokens</Tab>
                  <Tab>Private Tokens</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>Public tokens list</TabPanel>
                  <TabPanel>Private tokens list</TabPanel>
                </TabPanels>
              </Tabs>
            )}
          </CardBody>
        </Card>
      </VStack>
      {/* Add account */}
      <Modal isCentered isOpen={addAccount} onClose={() => setAddAccount(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody p={8} rowGap={4} display="flex" flexDirection="column">
            {!isDisabledCreateAztecWallet ? (
              <VStack
                align={'flex-start'}
                divider={<StackDivider borderColor="gray.200" />}
                spacing={4}
              >
                <EVMSigner onSecretGenerated={handleSecretGenerated} />
                <Button
                  colorScheme="teal"
                  isDisabled={isDisabledCreateAztecWallet}
                  onClick={handleCreateWallet}
                  width="100%"
                >
                  Add account
                </Button>
              </VStack>
            ) : (
              <Center flexDirection="column" rowGap={4}>
                <Spinner label="Loading PXE Assets..." />
                <Text fontSize="md">
                  {secret === null
                    ? `Using random secret for Aztec account generation...`
                    : `Using unique secret based on connected account...`}
                </Text>
              </Center>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      {/* Account details */}
      <Modal
        isCentered
        isOpen={viewDetails}
        onClose={() => {
          setViewDetails(false)
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalBody p={8} rowGap={4} display="flex" flexDirection="column">
            {selectedAccount && (
              <>
                <Heading size="sm">Account Complete Details</Heading>
                <Code p={4} borderRadius={6} maxWidth="100%" whiteSpace="break-spaces">
                  {selectedAccount.toReadableString()}
                </Code>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default WalletPage
