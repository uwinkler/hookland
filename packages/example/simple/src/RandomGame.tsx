import { createInjectableHook } from '@hookland/inject'
import { Button } from '@mui/material'
import { useState } from 'react'

export const useRandomNumbers = createInjectableHook(() => {
  const [n1, setN1] = useState(0)
  const [n2, setN2] = useState(0)
  const [n3, setN3] = useState(0)

  function roll() {
    setN1(Math.floor(Math.random() * 10))
    setN2(Math.floor(Math.random() * 10))
    setN3(Math.floor(Math.random() * 10))
  }

  return { n1, n2, n3, roll }
})

export function RandomGame() {
  const { n1, n2, n3, roll } = useRandomNumbers()

  return (
    <div>
      <h1>
        {n1} {n2} {n3}
      </h1>
      <Button variant="contained" onClick={roll}>
        Roll
      </Button>
    </div>
  )
}
