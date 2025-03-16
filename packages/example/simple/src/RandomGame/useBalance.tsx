import { createInjectableHook } from '@hookland/inject'
import React from 'react'
import { useAuthState } from '../useAuthState'

export const useBalance = createInjectableHook(() => {
  const [balance, setBalance] = React.useState<number>(0)
  const { authState } = useAuthState()
  const user = authState.user

  React.useEffect(() => {
    if (user) {
      fetchBalance(user).then(setBalance)
    } else {
      setBalance(0)
    }
  }, [setBalance, user])

  const withdraw = React.useCallback(
    (amount: number) => {
      if (user) {
        const nextBalance = balance - amount
        postBalance(user, nextBalance)
        setBalance(nextBalance)
      }
    },
    [balance, setBalance, user]
  )

  const deposit = React.useCallback(
    (amount: number) => {
      if (user) {
        const nextBalance = balance + amount
        postBalance(user, nextBalance)
        setBalance(nextBalance)
      }
    },
    [balance, user]
  )

  return { balance, deposit, withdraw }
})

async function fetchBalance(currentUser: string) {
  return Number(window.sessionStorage.getItem(currentUser) || 100)
}

async function postBalance(currentUser: string, balance: number) {
  window.sessionStorage.setItem(currentUser, String(balance))
  return balance
}
