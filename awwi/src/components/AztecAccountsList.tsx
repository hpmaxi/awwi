import React, { useState } from 'react'
import { CompleteAddress } from '@aztec/circuits.js'
import { Button, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { ChevronDownIcon } from '@chakra-ui/icons'

interface Props {
  accounts: CompleteAddress[]
  onSelect: (a: CompleteAddress) => void
  selected: CompleteAddress | undefined
}

export const AztecAccountsList: React.FC<Props> = ({ accounts, onSelect, selected }) => {
  const [activeAccount, setActiveAccount] = useState<number | undefined>(
    selected
      ? accounts.findIndex((a) => a.address.toString() === selected.address.toString())
      : undefined,
  )

  return accounts.length === 0 ? (
    <Text fontSize="sm">No Aztec accounts found.</Text>
  ) : (
    <>
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} width="100%" textAlign={'left'}>
          {activeAccount !== undefined ? `Account ${activeAccount + 1}` : 'Select Account'}
        </MenuButton>
        <MenuList>
          {accounts.map((account, index) => {
            return (
              <MenuItem
                bg={activeAccount === index ? 'gray.100' : 'transparent'}
                columnGap={3}
                key={account.address.toString()}
                onClick={() => {
                  onSelect(account)
                  setActiveAccount(index)
                }}
              >
                <Jazzicon diameter={30} seed={jsNumberForAddress(account.address.toString())} />
                <Text fontSize="sm">{account.address.toString()}</Text>
              </MenuItem>
            )
          })}
        </MenuList>
      </Menu>
    </>
  )
}
