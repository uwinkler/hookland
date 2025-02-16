# Tiny State

_Tiny State_ is a simple, convenient, atom like, and vey tiny state management library for React.

Usage:

```jsx
// Create a state hook with a default value of 'hello'
const useMyState = createTinyState('hello')

function MyComponent() {
  // Use the state hook
  const [state, setState] = useMyState()

  return (
    <div>
      <OtherComponent />
      <button onClick={() => setState('world')}>Change</button>
    </div>
  )
}

function OtherComponent() {
  // Use the state hook
  const [state] = useMyState()

  return (
    <div>
      <p>Current Value:{state}</p>
    </div>
  )
}
```

## Installation

```bash
npm install @hookland/tiny-state
```

## Tiny Store

You can create your own tiny store by using the `createTinyStore` function.

```jsx
import { createTinyStore } from '@hookland/tiny-state'

const [createMyComponentState, MyComponentStateProvider] =
  createTinyStore('MyComponentStor')
```

You can then use the `createMyComponentStore` function to create a state hook:

```jsx
const useMyComponentState = createMyComponentStore('hello')
const useMyOtherComponentState = createMyComponentStore('world')

const MyComponent = () => {
  return (
    <MyComponentStateProvider>
      <MyComponentContent />
    </MyComponentStateProvider>
  )
}

function MyComponentContent() {
  const [state, setState] = useMyComponentState()
  const [otherState, setOtherState] = useMyOtherComponentState()

  return (
    <div>
      <p>Current Value: {state}</p>
      <button onClick={() => setState('world')}>Change</button>
    </div>
  )
}
```

## Provider

Tiny State uses a provider to manage the state. If want to isolate the state to a specific part of your application - for example to isolate the state to specific component, you can use the `TinyStateProvider` component.

```jsx
import { DefaultTinyStateProvider } from '@hookland/tiny-state'

function App() {
  return (
    <DefaultTinyStateProvider>
      <MyComponent />
    </DefaultTinyStateProvider>
  )
}
```

## LICENSE

MIT
