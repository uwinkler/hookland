import { createInjectableHook } from '@hookland/inject'
import { createTinyState } from '@hookland/tiny-state'
import React from 'react'

type State = {
  state: 'login' | 'loading' | 'error' | 'success'
  user: string | null
  balance: number
}

const useAppStateInternal = createTinyState<State>({
  state: 'login',
  user: null,
  balance: -1
})

export const useAppState = createInjectableHook(() => {
  const [appState, setAppState] = useAppStateInternal()

  const logout = React.useCallback(() => {
    setAppState({
      state: 'login',
      user: null,
      balance: -1
    })
  }, [setAppState])

  const login = React.useCallback(
    async (props: { userName: string; password: string }) => {
      const { userName, password } = props
      setAppState({
        ...appState,
        state: 'loading'
      })

      const res = await fetchUser(userName, password)

      if (res.status == 'ok') {
        setAppState({
          user: userName,
          balance: res.balance,
          state: 'success'
        })
      } else {
        setAppState({
          user: null,
          balance: -1,
          state: 'error'
        })
      }
    },
    [appState, setAppState]
  )

  return { appState, setAppState, logout, login }
})

// This is a mock function that simulates a login request to a server.
// In a real application, you would replace this with a real login request.
// However, for the purpose of this example, we will use a simple mock function.
// Note: that function is not mocked with `createInjectableHook` because it's not a hook.
function fetchUser(
  userName: string,
  password: string
): Promise<{ status: 'ok'; balance: number } | { status: 'error' }> {
  if (userName === 'Klaus' && password === '1234') {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            status: 'ok',
            balance: 100
          }),
        300
      )
    )
  } else {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            status: 'error'
          }),
        300
      )
    )
  }
}
