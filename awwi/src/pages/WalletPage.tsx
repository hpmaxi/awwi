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
    queryKey: ['pxe-accounts'],
    queryFn: () => pxe?.getRegisteredAccounts(),
    enabled: pxe !== undefined,
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <EVMSigner onSecretGenerated={handleSecretGenerated} />

      {secret === null && (
        <p className="text-gray-600 mt-4">Using random secret for Aztec account generation</p>
      )}

      <button
        disabled={isDisabledCreateAztecWallet}
        onClick={handleCreateWallet}
        className={`btn ${isDisabledCreateAztecWallet ? 'btnDisabled' : 'btnEnabled'} mt-4`}
      >
        {isCreatingWallet ? 'Creating Wallet...' : 'Create Aztec Wallet'}
      </button>

      {selectedAccount && (
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 mt-4">
          <h2 className="text-xl font-bold mb-4">Account Details</h2>
          <p className="text-gray-600 break-all">{selectedAccount.toString()}</p>
        </div>
      )}

      <AztecAccountsList
        accounts={registeredAccounts}
        onSelect={(selectedAccount) => {
          console.log('Account selected', selectedAccount.toString())
          setSelectedAccount(selectedAccount)
        }}
        selected={selectedAccount}
      />
    </div>
  )
}

export default WalletPage
