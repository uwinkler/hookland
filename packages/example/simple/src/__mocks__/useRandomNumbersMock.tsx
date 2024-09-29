import { HookMockMapping } from '@hookland/inject/dist/types'
import { useState } from 'react'
import { useRandomNumbers } from '../RandomGame'

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
const useRandomNumbersMock = () => {
  const [count, setCount] = useState(0)
  const luckyNumbers = [
    [3, 8, 2],
    [1, 5, 9],
    [0, 0, 7],
    [9, 9, 9]
  ]

  function roll() {
    setCount((count + 1) % luckyNumbers.length)
  }

  return {
    n1: luckyNumbers[count][0],
    n2: luckyNumbers[count][1],
    n3: luckyNumbers[count][2],
    roll
  }
}

export const randomNumbersMock: HookMockMapping = {
  for: useRandomNumbers,
  use: useRandomNumbersMock
}
