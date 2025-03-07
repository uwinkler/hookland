import { disableInjectableHooksDuringBuild, isDisabled } from '@hookland/inject'
import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { HooklandScenarioProvider } from './HooklandScenarioProvider.tsx'
import './index.css'

disableInjectableHooksDuringBuild(import.meta.env.MODE !== 'development')

const HooklandProvider = createHooklandProvider(import.meta.env.MODE !== 'development')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HooklandProvider>
      <App />
    </HooklandProvider>
  </StrictMode>
)

function DisabledHooklandProvider({ children }: React.PropsWithChildren<unknown>) {
  return children
}

function createHooklandProvider(disable = false) {
  const disabled = isDisabled()
  if (disable) {
    return DisabledHooklandProvider
  }

  return HooklandScenarioProvider
}


