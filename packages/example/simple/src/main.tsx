import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { disableInjectableHooksDuringBuild, HookProvider } from '@hookland/inject'
import { randomNumbersMock } from './__mocks__/useRandomNumbersMock.tsx'

const isDev = import.meta.env.MODE === 'development'

disableInjectableHooksDuringBuild(!isDev)

const hooks = isDev ? [randomNumbersMock] : []


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HookProvider hooks={hooks}>
      <App />
    </HookProvider>
  </StrictMode>
)
