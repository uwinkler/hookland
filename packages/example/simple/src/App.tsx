import { disableInjectableHooks, HookProvider } from '@hookland/inject'
import { RandomGame } from './RandomGame'

import { randomNumbersHook } from './__mocks__/useRandomNumbersMock'
import { Layout } from './Layout'

const isDev = import.meta.env.MODE === 'development'

disableInjectableHooks(!isDev)

const hooks = isDev ? [randomNumbersHook] : []

function App() {
  return (
    <HookProvider hooks={hooks}>
      <Layout>
        <RandomGame />
      </Layout>
    </HookProvider>
  )
}

export default App
