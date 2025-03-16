import { HookMockMapping } from '@hookland/inject/dist/types'
import { useState } from 'react'
import { useRandomNumbers } from '../useRandomNumbers'

// This is a mock implementation of the useRandomNumbers hook
//
// It will always return the same lucky numbers in the same order
// and will cycle back to the first set of numbers after the last one.
// The last set of numbers is [9, 9, 9] and is a lucky number.
// So we eventually get to the lucky number after 3 rolls.
//
// This is useful for testing the Random
// component in a deterministic way
//
const LUCKY_NUMBERS =
  [
    382,
    159,
    123,
    999
  ]

export function useRandomNumbersMock() {
  const [count, setCount] = useState(0)

  function nextLuckyNumber() {
    const nextIdx = (count + 1) % LUCKY_NUMBERS.length
    setCount(nextIdx)
    return LUCKY_NUMBERS[nextIdx]
  }

  return {
    luckyNumber: LUCKY_NUMBERS[count],
    nextLuckyNumber,
  }
}

export const randomNumbersMock: HookMockMapping<typeof useRandomNumbers> = {
  for: useRandomNumbers,
  use: useRandomNumbersMock
}
