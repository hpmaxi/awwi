import React, { useState, useCallback } from 'react'
import { Address, WalletClient } from 'viem'
import { connectWallet } from '../utils/evmAccount'

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
    <div className="p-4 bg-gray-100 rounded-lg">
      {!evmWalletClient && (
        <>
          <p className="mb-4">
            Connecting to MetaMask is optional but allows you to sign messages for making a
            deterministic schnorr account based on your signed message.
          </p>
          <button
            disabled={isDisabledConnect}
            onClick={handleConnect}
            className={`btn ${isDisabledConnect ? 'btnDisabled' : 'btnEnabled'} mb-4`}
          >
            {isLoadingConnect ? 'Connecting...' : 'Connect MetaMask'}
          </button>
        </>
      )}
      {evmWalletClient && (
        <>
          <h2 className="text-lg font-semibold mb-2">{`Connected to account ${evmAccount}`}</h2>
          <p className="mb-4">
            Enter a message to sign. Signing different messages produces unique secrets for
            differents accounts.
          </p>
          <input
            type="text"
            value={messageToSign}
            onChange={(e) => setMessageToSign(e.target.value)}
            placeholder="Enter message to sign"
            className="w-full p-2 mb-4 border rounded"
          />
          <button
            disabled={isDisabledSignMessage}
            onClick={handleSignMessage}
            className={`btnBase ${isDisabledSignMessage ? 'btnDisabled' : 'btnEnabled'}`}
          >
            {isLoadingSignMessage ? 'Signing...' : 'Sign Message'}
          </button>
        </>
      )}
      {error && (
        <p className="text-red-500 mt-4">
          {error === 'ERROR_METAMASK'
            ? "Error connecting to MetaMask. Please make sure it's installed and unlocked."
            : 'Error signing message. Please try again.'}
        </p>
      )}
    </div>
  )
}
