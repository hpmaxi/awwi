import React, { useState, useCallback } from 'react'
import { Address, WalletClient } from 'viem'
import { connectWallet } from '../utils/evmAccount'
import { Button, Heading, Input, Text } from '@chakra-ui/react'

type Error = 'ERROR_METAMASK' | 'ERROR_SIGNING'

interface Props {
  onSecretGenerated: (secret: string) => void
}

export const EVMSigner: React.FC<Props> = ({ onSecretGenerated }) => {
  const [evmAccount, setEvmAccount] = useState<Address | null>(null)
  const [evmWalletClient, setEvmWalletClient] = useState<WalletClient | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoadingConnect, setIsLoadingConnect] = useState(false)
  const [isLoadingSignMessage, setIsLoadingSignMessage] = useState(false)
  const [messageToSign, setMessageToSign] = useState('')

  const isDisabledSignMessage =
    !evmAccount || !evmWalletClient || isLoadingSignMessage || !messageToSign.trim()

  const isDisabledConnect = error !== null || isLoadingConnect

  const handleConnect = useCallback(async () => {
    setIsLoadingConnect(true)
    setError(null)
    try {
      const { walletClient, account } = await connectWallet()
      if (walletClient && account) {
        setEvmWalletClient(walletClient)
        setEvmAccount(account)
      }
    } catch (e) {
      console.error('Error connecting EVM account', e)
      setError('ERROR_METAMASK')
    } finally {
      setIsLoadingConnect(false)
    }
  }, [])

  const handleSignMessage = useCallback(async () => {
    if (!evmWalletClient || !evmAccount || !messageToSign.trim()) return
    setIsLoadingSignMessage(true)
    setError(null)

    try {
      const signed = await evmWalletClient.signMessage({
        account: evmAccount,
        message: messageToSign,
      })

      onSecretGenerated(signed)
    } catch (e) {
      console.error('Error signing message', e)
      setError('ERROR_SIGNING')
    } finally {
      setIsLoadingSignMessage(false)
    }
  }, [evmWalletClient, evmAccount, messageToSign, onSecretGenerated])

  return (
    <>
      {!evmWalletClient && (
        <>
          <Text fontSize="sm">
            Connecting to MetaMask is optional but allows you to sign messages for making a
            deterministic schnorr account based on your signed message.
          </Text>
          <Button colorScheme="teal" isDisabled={isDisabledConnect} onClick={handleConnect}>
            {isLoadingConnect ? 'Connecting...' : 'Connect MetaMask'}
          </Button>
        </>
      )}
      {evmWalletClient && (
        <>
          <Heading size="xs" as="h3">
            Connected to account {evmAccount}
          </Heading>
          <Text fontSize="sm">
            Enter a message to sign. Signing different messages produces unique secrets for
            differents accounts.
          </Text>
          <Input
            isDisabled={!evmAccount || !evmWalletClient}
            onChange={(e) => setMessageToSign(e.target.value)}
            placeholder="Enter message to sign"
            type="text"
            value={messageToSign}
          />
          <Button colorScheme="teal" isDisabled={isDisabledSignMessage} onClick={handleSignMessage}>
            {isLoadingSignMessage ? 'Signing...' : 'Sign Message'}
          </Button>
        </>
      )}
      {error && (
        <Text color="#990000">
          {error === 'ERROR_METAMASK'
            ? "Error connecting to MetaMask. Please make sure it's installed and unlocked."
            : 'Error signing message. Please try again.'}
        </Text>
      )}
    </>
  )
}
