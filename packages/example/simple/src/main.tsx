import {
  disableInjectableHooksDuringBuild,
  HookProvider
} from '@hookland/inject'
import { CssBaseline } from '@mui/material'
import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.tsx'
import './index.css'

disableInjectableHooksDuringBuild(import.meta.env.MODE !== 'development')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HookProvider
      hooks={[
        // { for: useRandomNumbers, use: useRandomNumbersMock },
        // balanceMock0
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


