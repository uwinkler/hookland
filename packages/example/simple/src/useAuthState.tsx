import { createInjectableHook } from '@hookland/inject'
import { createTinyState } from '@hookland/tiny-state'
import React from 'react'
import { useNavigate } from 'react-router'

type State = {
  state: 'no-user' | 'loading' | 'error' | 'success'
  user: string | null
}

const useAuthStateInternal = createTinyState<State>({
  state: 'no-user',
  user: null,
})

export const useAuthState = createInjectableHook(() => {
  const navigate = useNavigate()
  const [authState, setAuthState] = useAuthStateInternal()

  const logout = React.useCallback(() => {
    setAuthState({
      state: 'no-user',
      user: null,
    })
    navigate('/login')
  }, [setAuthState, navigate])

  const login = React.useCallback(
    async (props: { userName: string; password: string }) => {
      const { userName, password } = props

      setAuthState({
        user: null,
        state: 'loading'
      })

      const res = await fetchUser(userName, password)

      if (res.status == 'ok') {
        setAuthState({
          state: 'success',
          user: userName,
        })
        navigate('/game')
      } else {
        setAuthState({
          state: 'error',
          user: null,
        })
      }
    },
    [navigate, setAuthState]
  )

  return { authState, setAuthState, logout, login }
})

// This is a mock function that simulates a login request to a server.
// In a real application, you would replace this with a real login request.
// However, for the purpose of this example, we will use a simple mock function.
// Note: that function is not mocked with `createInjectableHook` because it's not a hook.
function fetchUser(
  userName: string,
  password: string
): Promise<{ status: 'ok' | 'error' }> {
  if (userName === 'Klaus' && password === '1234') {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            status: 'ok',
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
