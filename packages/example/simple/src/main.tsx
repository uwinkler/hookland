import { MessageClientScenarios, Scenario } from '@hookland/dev-tools-commons'
import { HookMockMapping, HookProvider } from '@hookland/inject'
import { StrictMode, useCallback, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { randomNumbersMock } from './__mocks__/useRandomNumbersMock.tsx'
import App from './App.tsx'
import './index.css'
import { useRandomNumbers } from './RandomGame/useRandomNumbers.tsx'
import { useAppState } from './useAppState.tsx'

const withoutAnyHooks: HooklandScenario = {
  id: 'DM-123',
  name: 'Without any hooks',
  group: 'Random',
  description: 'The app without any hooks.',
  hooks: []
}

const threeRoundWinHook: HooklandScenario = {
  id: 'DM-254',
  name: 'Hook that wins after three rounds',
  group: 'Random',
  description:
    'This scenario demonstrates the app with a hook that wins after three rounds.',
  hooks: [randomNumbersMock]
}

const scenarioStartWithWin: HooklandScenario = {
  id: 'DM-203',
  name: 'Hook that wins after first round',
  group: 'Random',
  description:
    'The app with a hook that wins after first round. No other rolls are possible.',
  hooks: [
    {
      for: useRandomNumbers,
      use: () => ({
        n1: 1,
        n2: 2,
        n3: 3,
        roll: () => {
          alert('Roll is disable!')
        }
      })
    }
  ]
}

const scenarioShowLoginProgress: HooklandScenario = {
  id: '[Login / Progress]',
  name: 'Shows login progress screen',
  group: 'Login',
  description: 'Shows the login progress screen only',
  hooks: [
    {
      for: useAppState,
      use: () => ({
        appState: {
          state: 'loading',
          user: null,
          balance: -1
        }
      })
    }
  ]
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ScenarioProvider
      scenarios={[
        threeRoundWinHook,
        scenarioStartWithWin,
        withoutAnyHooks,
        scenarioShowLoginProgress
      ]}
    >
      <App />
    </ScenarioProvider>
  </StrictMode>
)

type HooklandScenario = Omit<Scenario, 'active'> & { hooks: HookMockMapping[] }

function ScenarioProvider(
  props: React.PropsWithChildren<{ scenarios: HooklandScenario[] }>
) {
  const { scenarios, children } = props

  const [activeScenario, setActiveScenario] = useState(
    scenarios[0].id || 'none'
  )

  const hooksWithActiveState = scenarios.map((scenario) => {
    return {
      ...scenario,
      active: scenario.id === activeScenario
    }
  })

  const hudListenerActiveId = useCallback(
    (event: MessageEvent) => {
      if (event.data.source === 'HOOKLAND_HUD_EXTENSION') {
        console.log('Received from HUD:', event.data)
        setActiveScenario(event.data.payload.id)
      }
    },
    [setActiveScenario]
  )

  useEffect(() => {
    window.addEventListener('message', hudListenerActiveId)
    return () => {
      window.removeEventListener('message', hudListenerActiveId)
    }
  }, [setActiveScenario, hudListenerActiveId])

  useEffect(() => {
    setTimeout(() => {
      const hooksWithActiveState = scenarios.map((scenario) => {
        return {
          ...scenario,
          active: scenario.id === activeScenario
        }
      })

      const hudScenarios: Scenario[] = hooksWithActiveState.map((scenario) => {
        // Remove hook
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { hooks, ...rest } = scenario
        return rest
      })

      const msg: MessageClientScenarios = {
        source: 'HOOKLAND_HUD_ClIENT',
        type: 'SCENARIOS',
        payload: {
          scenarios: hudScenarios
        }
      }

      window.postMessage(msg, '*')
    }, 100) // TODO listen for the content script to be ready and to accept messages
  }, [activeScenario, scenarios])

  return (
    <HookProvider
      key={activeScenario}
      hooks={hooksWithActiveState
        .filter((s) => s.active)
        .flatMap((scenario) => scenario.hooks)}
    >
      {children}
    </HookProvider>
  )
}
