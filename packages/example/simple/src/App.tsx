import {
  disableInjectableHooksDuringBuild,
  HookProvider
} from '@hookland/inject'
import { RandomGame } from './RandomGame'

import { randomNumbersMock } from './__mocks__/useRandomNumbersMock'
import { Layout } from './Layout'

const isDev = import.meta.env.MODE === 'development'

disableInjectableHooksDuringBuild(!isDev)

const hooksUsedInDevelopment = isDev ? [randomNumbersMock] : []

function App() {
  return (
    <HookProvider hooks={hooksUsedInDevelopment}>
      <Layout>
        <RandomGame />
      </Layout>
    </HookProvider>
  )
}

export default App
