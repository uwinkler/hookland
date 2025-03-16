import { createInjectableHook } from '@hookland/inject'
import { useState } from 'react'

export const useRandomNumbers = createInjectableHook(() => {
  const [luckyNumber, setLuckyNumber] = useState(randomNumberBetween100And999())

  function nextLuckyNumber() {
    const nextLuckyNumber = randomNumberBetween100And999()
    setLuckyNumber(nextLuckyNumber)
    return nextLuckyNumber
  }

  return { luckyNumber, nextLuckyNumber }
})

function randomNumberBetween100And999() {
  return Math.floor(Math.random() * 900) + 100
}
