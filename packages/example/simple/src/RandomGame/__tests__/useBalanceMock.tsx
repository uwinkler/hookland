import { HookMockMapping } from '@hookland/inject'
import React from 'react'
import { useBalance } from '../useBalance'



export function createBalanceMock(startValue: number) {
  return function useBalanceMock() {
    const [balance, setBalance] = React.useState<number>(startValue)

    function deposit(amount: number) {
      setBalance(balance + amount)
    }

    function withdraw(amount: number) {
      setBalance(balance - amount)
    }

    return { balance, deposit, withdraw }
  }
}

export const balanceMock200: HookMockMapping<typeof useBalance> = {
  for: useBalance,
  use: createBalanceMock(200)
}

export const balanceMock0: HookMockMapping<typeof useBalance> = {
  for: useBalance,
  use: createBalanceMock(0)
}