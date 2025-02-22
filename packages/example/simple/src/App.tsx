import { RandomGame } from './RandomGame/RandomGame'

import {
  disableInjectableHooksDuringBuild,
  HookProvider
} from '@hookland/inject'
import { Paper } from '@mui/material'
import { renderToReadableStream } from 'react-dom/server'
import { ClientComp } from './ClientComp'
import { Layout } from './Layout'
import { Login } from './Login/Login'
import { randomNumbersMock } from './__mocks__/useRandomNumbersMock'
import { useAppState } from './useAppState'

const isDev = import.meta.env.MODE === 'development'
disableInjectableHooksDuringBuild(isDev)

const hooks = isDev ? [randomNumbersMock] : []

function App() {
  const { appState } = useAppState()
  const showLogin = appState.state !== 'success'
  const showRandomGame = appState.state === 'success'

  const ret = (
    <HookProvider hooks={[]}>
      <Layout>
        {showLogin && <Login />}
        {showRandomGame && <RandomGame />}
      </Layout>
    </HookProvider>
  )

  console.log(ret)

  return ret
}

export default App
