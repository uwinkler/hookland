import {
  disableInjectableHooksDuringBuild,
  HookProvider,
  isDisabled
} from '@hookland/inject'
import { CssBaseline } from '@mui/material'
import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.tsx'
import { HooklandScenarioProvider } from './HooklandScenarioProvider.tsx'
import './index.css'
import { balanceMock200 } from './RandomGame/__tests__/useBalanceMock.tsx'

disableInjectableHooksDuringBuild(import.meta.env.MODE !== 'development')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HookProvider
      hooks={[
        // { for: useRandomNumbers, use: useRandomNumbersMock },
        balanceMock200
      ]}
    >
      <BrowserRouter>
        <CssBaseline />
        <App />
      </BrowserRouter>
    </HookProvider>
  </StrictMode>
)

function DisabledHooklandProvider({
  children
}: React.PropsWithChildren<unknown>) {
  return children
}

function createHooklandProvider(disable = isDisabled()) {
  if (disable) {
    return DisabledHooklandProvider
  }

  return HooklandScenarioProvider
}
