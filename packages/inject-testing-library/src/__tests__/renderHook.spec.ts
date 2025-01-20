import { createInjectableHook } from '@hookland/inject'
import { act } from '@testing-library/react'
import React from 'react'
import { expect, test } from 'vitest'
import { renderHook } from '../renderHook'

test('should work as the original renderHook function', () => {
  function useCounter() {
    const [count, setCount] = React.useState(0)
    return { count, increment: () => setCount(count + 1) }
  }
  const { result } = renderHook(useCounter)
  expect(result.current.count).toBe(0)

  act(() => {
    result.current.increment()
  })

  expect(result.current.count).toBe(1)
})

test('should use a mock implementation of a hook', () => {
  const useRandom = createInjectableHook(function useRandomImpl() {
    return Math.random
  })

  // Math.random is not deterministic, so we mock it
  function useRandomMock() {
    return () => 0.12345678
  }

  function useRandomBetween1And10() {
    const random = useRandom()
    return Math.floor(random() * 10) + 1
  }

  const { result } = renderHook(useRandomBetween1And10, {
    hooks: [{ for: useRandom, use: useRandomMock }]
  })

  expect(result.current).toBe(2)
})
