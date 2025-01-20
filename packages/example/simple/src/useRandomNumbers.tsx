import { createInjectableHook } from '@hookland/inject'
import { useState } from 'react'

export const useRandomNumbers = createInjectableHook(() => {
  const [n1, setN1] = useState(randomNumberBetween1And9())
  const [n2, setN2] = useState(randomNumberBetween1And9())
  const [n3, setN3] = useState(randomNumberBetween1And9())

  function roll() {
    setN1(randomNumberBetween1And9())
    setN2(randomNumberBetween1And9())
    setN3(randomNumberBetween1And9())
  }

  return { n1, n2, n3, roll }
})

function randomNumberBetween1And9() {
  return Math.floor(Math.random() * 9) + 1
}
