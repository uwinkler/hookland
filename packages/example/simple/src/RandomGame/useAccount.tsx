import React from 'react'
import { useAppState } from '../useAppState'

export function useAccount() {
  const { appState, setAppState } = useAppState()

  const setBalance = React.useCallback(
    (nextBalance: number) => setAppState({ ...appState, balance: nextBalance }),
    [appState, setAppState]
  )

  const withdraw = React.useCallback(
    (amount: number = 1) => {
      setAppState({ ...appState, balance: appState.balance - amount })
    },
    [setAppState, appState]
  )

  const deposit = React.useCallback(
    (amount: number = 1) => {
      setBalance(appState.balance - amount)
    },
    [appState, setBalance]
  )

  return { balance: appState.balance, deposit, withdraw }
}
