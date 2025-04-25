import {
  disableInjectableHooksDuringBuild,
  HookProvider
} from '@hookland/inject'
import { CssBaseline } from '@mui/material'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.tsx'
import './index.css'
import { balanceMock200 } from './RandomGame/__tests__/useBalanceMock.tsx'
import { useRandomNumbersMock } from './RandomGame/__tests__/useRandomNumbersMock.tsx'
import { useRandomNumbers } from './RandomGame/useRandomNumbers.tsx'

disableInjectableHooksDuringBuild(import.meta.env.MODE !== 'development')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HookProvider
      hooks={[
        {
          for: useRandomNumbers,
          use: useRandomNumbersMock
        },
        balanceMock200
      ]}
    >
      <BrowserRouter>
        <CssBaseline />
        <App />
      </BrowserRouter>
    </HookProvider>
  </StrictMode >
)


