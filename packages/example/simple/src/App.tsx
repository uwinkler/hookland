import { Layout } from './Layout'
import { Login } from './Login/Login'
import { RandomGame } from './RandomGame/RandomGame'
import { useAppState } from './useAppState'

function App() {
  const { appState } = useAppState()
  const showLogin = appState.state !== 'success'
  const showRandomGame = appState.state === 'success'

  return <Layout>
    {showLogin && <Login />}
    {showRandomGame && <RandomGame />}
  </Layout>
}

export default App
