/* eslint-disable @typescript-eslint/no-explicit-any */
import { render } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import { createInjectableHook } from '../create-injectable-hook'
import { HookProvider } from '../hook-provider'

const useCounter = createInjectableHook(() => {
  const count = 12
  return { count }
})

const useHello = createInjectableHook(() => {
  const { count } = useCounter()
  return 'Hello World. Count is ' + count
})

function Counter() {
  const { count } = useCounter()
  return <>Count is {count}</>
}

function Hello() {
  const message = useHello()
  return <>{message}</>
}

function useMockedCounter() {
  return { count: 0 }
}

test('it should work with an empty HookProvider ', () => {
  const Component = (
    <HookProvider>
      <Counter />
      <Hello />
    </HookProvider>
  )

  const { container } = render(Component)

  expect(container).toMatchInlineSnapshot(`
    <div>
      Count is 
      12
      Hello World. Count is 12
    </div>
  `)
})

test('it should work without a HookProvider', () => {
  const Component = (
    <>
      <Counter />
      <Hello />
    </>
  )

  const { container } = render(Component)

  expect(container).toMatchInlineSnapshot(`
    <div>
      Count is 
      12
      Hello World. Count is 12
    </div>
  `)
})

test('it should work with a mock', () => {
  const Component = (
    <HookProvider
      hooks={[
        {
          for: useCounter,
          use: useMockedCounter
        }
      ]}
    >
      <Counter />
      <Hello />
    </HookProvider>
  )

  const { container } = render(Component)

  expect(container).toMatchInlineSnapshot(`
    <div>
      Count is 
      0
      Hello World. Count is 0
    </div>
  `)
})

test('it should work with scope', () => {
  const Component = (
    <>
      <HookProvider
        hooks={[
          {
            for: useCounter,
            use: useMockedCounter
          }
        ]}
      >
        <Counter />
      </HookProvider>
      {/* Note <Hello> is outside the provider */}
      <Hello />
    </>
  )

  const { container } = render(Component)

  expect(container).toMatchInlineSnapshot(`
    <div>
      Count is 
      0
      Hello World. Count is 12
    </div>
  `)
})

test('it should work nested provider', () => {
  const Component = (
    <HookProvider>
      <HookProvider
        hooks={[
          {
            for: useCounter,
            use: useMockedCounter
          }
        ]}
      >
        <Counter />
        <Hello />
      </HookProvider>
    </HookProvider>
  )

  const { container } = render(Component)

  expect(container).toMatchInlineSnapshot(`
    <div>
      Count is 
      0
      Hello World. Count is 0
    </div>
  `)
})

test('it should work with nested provider', () => {
  const Component = (
    <HookProvider
      hooks={[
        {
          for: useCounter,
          use: useMockedCounter
        }
      ]}
    >
      <HookProvider>
        <Counter />
        <Hello />
      </HookProvider>
    </HookProvider>
  )

  const { container } = render(Component)

  expect(container).toMatchInlineSnapshot(`
    <div>
      Count is 
      0
      Hello World. Count is 0
    </div>
  `)
})

test('it should work nested provider and reset the hook to null', () => {
  const Component = (
    <HookProvider
      hooks={[
        {
          for: useCounter,
          use: useMockedCounter
        }
      ]}
    >
      <HookProvider
        hooks={[
          {
            for: useCounter,
            use: null as any
          }
        ]}
      >
        <Counter />
        <Hello />
      </HookProvider>
    </HookProvider>
  )

  const { container } = render(Component)

  expect(container).toMatchInlineSnapshot(`
    <div>
      Count is 
      12
      Hello World. Count is 12
    </div>
  `)
})

test('it should work nested provider', () => {
  const Component = (
    <HookProvider
      hooks={[
        {
          for: useCounter,
          use: useMockedCounter
        }
      ]}
    >
      <HookProvider
        hooks={[
          {
            for: useHello,
            use: () => 'Servus'
          }
        ]}
      >
        <Counter />
        <Hello />
      </HookProvider>
    </HookProvider>
  )

  const { container } = render(Component)

  expect(container).toMatchInlineSnapshot(`
    <div>
      Count is 
      0
      Servus
    </div>
  `)
})

test('It should return the original hook if window.__HOOKLAND_INJECT_DISABLED__ is set to true ', () => {
  vi.stubGlobal('window', { __HOOKLAND_INJECT_DISABLED__: true })

  function useSomeHook() {
    return 'Hello'
  }
  const useMockDummyHook = createInjectableHook(useSomeHook)

  expect(useMockDummyHook).toBe(useSomeHook)

  vi.unstubAllGlobals()
})
