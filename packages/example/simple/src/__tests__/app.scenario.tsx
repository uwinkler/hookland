import { createScenario } from "../HooklandScenarioProvider"
import { randomNumbersMock } from "../RandomGame/__tests__/useRandomNumbersMock"
import { useRandomNumbers } from "../RandomGame/useRandomNumbers"
import { useAuthState } from "../useAuthState"

export const scenarioWithoutAnyHooks = createScenario({
  id: 'DM-123',
  name: 'Vanilla - without any hooks',
  group: 'Random',
  description: 'The app without any hooks.',
  hooks: []
})

export const ScenarioThreeRoundWinHook = createScenario({
  id: 'DM-254',
  name: 'Hook that wins after three rounds',
  group: 'Random',
  description:
    'This scenario demonstrates the app with a hook that wins after three rounds.',
  hooks: [randomNumbersMock]
})

export const scenarioStartWithWin = createScenario({
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
})



export const scenarioShowLoginProgress = createScenario({
  id: '[Login / Progress]',
  name: 'Shows login progress screen',
  group: 'Login',
  description: 'Shows the login progress screen only',
  hooks: [
    {
      for: useAuthState,
      use: () => ({
        appState: {
          state: 'loading',
          user: null,
          balance: -1
        }
      })
    }
  ]
})