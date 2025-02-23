/* eslint-disable @typescript-eslint/no-explicit-any */
import { RandomGame } from './RandomGame/RandomGame'

import {
  disableInjectableHooksDuringBuild,
  HookProvider
} from '@hookland/inject'
import { Layout } from './Layout'
import { Login } from './Login/Login'
import { randomNumbersMock } from './__mocks__/useRandomNumbersMock'
import { useAppState } from './useAppState'
import React from 'react'

const isDev = import.meta.env.MODE === 'development'
disableInjectableHooksDuringBuild(isDev)

const hooks = isDev ? [randomNumbersMock] : []

function App() {
  const { appState } = useAppState()
  const showLogin = appState.state !== 'success'
  const showRandomGame = appState.state === 'success'

  return (
    <HookProvider hooks={[]}>
      <Layout>
        {showLogin && <Login />}
        {showRandomGame && <RandomGame />}
      </Layout>
    </HookProvider>
  )
}
