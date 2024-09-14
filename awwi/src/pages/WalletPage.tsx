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
  Avatar,
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
  StackDivider,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react'
import { AddIcon, ViewIcon } from '@chakra-ui/icons'

export const WalletPage: React.FC = () => {
  const [isCreatingWallet, setIsCreatingWallet] = useState(false)
  const [secret, setSecret] = useState<string | null>(null)
  const [account, setAccount] = useState<AccountManager | null>(null)
  const [selectedAccount, setSelectedAccount] = useState<CompleteAddress | undefined>(undefined)
  const [viewDetails, setViewDetails] = useState(false)
  const [addAccount, setAddAccount] = useState(false)
  const [selectedToken, setSelectedToken] = useState<
    { symbol: string; value: string; balance: string } | undefined
  >(undefined)

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

  const privateTokens = [
    {
      balance: '51.01',
      symbol: 'USDC',
      value: '50.97',
    },
    {
      balance: '1000.23',
      symbol: 'DAI',
      value: '999.96',
    },
    {
      balance: '100.00',
      symbol: 'USDT',
      value: '99.98',
    },
  ]

  const publicTokens = [
    {
      balance: '1.201',
      symbol: 'MATIC',
      value: '0.62',
    },
    {
      balance: '1.0306',
      symbol: 'WETH',
      value: '2360.34',
    },
  ]

  const txs = [
    {
      action: 'Sent',
      address: '0xa7cBf4b2e7e4f2c7d3f3f4b2e7e4f2c7d3f3f4b2',
      amount: '156.35',
      date: '2w ago',
      status: 'Completed',
    },
    {
      action: 'Received',
      address: '0x89cBf4b2e7e4f2c7d3f3f4b2e7e4f2c7d3f3f4b2',
      amount: '1000.23',
      date: '1m ago',
      status: 'Error',
    },
    {
      action: 'Sent',
      address: '0x7acdf4b2e7e4f2c7d3f3f4b2e7e4f2c7d387834',
      amount: '8855.58',
      date: '1y ago',
      status: 'Completed',
    },
    {
      action: 'Received',
      address: '0x76897f4b2e7e4f2c7d3f3f4b2e7e4f2c7d3f3f4b',
      amount: '1.201',
      date: '1d ago',
      status: 'Completed',
    },
  ]

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
                  <TabPanel p={0}>
                    {publicTokens.map((token) => (
                      <Flex
                        alignItems="center"
                        borderBottomColor="#ccc"
                        borderBottomWidth="1px"
                        columnGap={2}
                        cursor="pointer"
                        onClick={() => setSelectedToken(token)}
                        p={2}
                      >
                        <Avatar size="sm" name={token.symbol} />
                        <Text fontSize="18px" fontWeight="500">
                          {token.symbol}
                        </Text>
                        <Flex direction="column" align="flex-end" marginLeft="auto">
                          <Text fontSize="16px">{token.balance}</Text>
                          <Text fontSize="13px">${token.value}</Text>
                        </Flex>
                      </Flex>
                    ))}
                  </TabPanel>
                  <TabPanel p={0}>
                    {privateTokens.map((token) => (
                      <Flex
                        alignItems="center"
                        borderBottomColor="#ccc"
                        borderBottomWidth="1px"
                        columnGap={2}
                        cursor="pointer"
                        onClick={() => setSelectedToken(token)}
                        p={2}
                      >
                        <Avatar size="sm" name={token.symbol} />
                        <Text fontSize="18px" fontWeight="500">
                          {token.symbol}
                        </Text>
                        <Flex direction="column" align="flex-end" marginLeft="auto">
                          <Text fontSize="16px">{token.balance}</Text>
                          <Text fontSize="13px">${token.value}</Text>
                        </Flex>
                      </Flex>
                    ))}
                  </TabPanel>
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
      {/* Token details */}
      <Modal
        isCentered
        isOpen={selectedToken !== undefined}
        onClose={() => {
          setSelectedToken(undefined)
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalBody p={4} rowGap={4} display="flex" flexDirection="column">
            {selectedToken !== undefined && (
              <>
                <Flex
                  alignItems="center"
                  borderBottomColor="#ccc"
                  borderBottomWidth="1px"
                  flexDirection="column"
                  columnGap={2}
                  cursor="pointer"
                  p={2}
                >
                  <Text fontSize="18px">{selectedToken?.symbol}</Text>
                  <Text fontSize="42px" fontWeight="500">
                    {selectedToken.balance}
                  </Text>
                  <Text fontSize="18px">${selectedToken.value}</Text>
                </Flex>
                <Heading size="xs" as="h3" mb={1}>
                  Transactions
                </Heading>
                <VStack
                  align={'flex-start'}
                  maxHeight="300px"
                  overflowX="hidden"
                  overflowY="auto"
                  spacing={2}
                >
                  {txs.map((tx) => (
                    <Flex
                      backgroundColor="rgba(0,0,0,0.05)"
                      flexDirection="column"
                      p={3}
                      rowGap={1}
                      width="100%"
                      borderRadius={4}
                    >
                      <Flex alignItems="center" justifyContent="space-between">
                        <Text fontSize="13px" fontWeight="500">
                          {tx.status}
                        </Text>
                        <Text fontSize="13px">{tx.date}</Text>
                      </Flex>
                      <Text fontSize="16px" fontWeight="500">
                        {tx.action} {tx.amount} {selectedToken.symbol}
                      </Text>
                      <Text fontSize="12px">
                        <b>Address:</b> {tx.address}
                      </Text>
                    </Flex>
                  ))}
                </VStack>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default WalletPage
