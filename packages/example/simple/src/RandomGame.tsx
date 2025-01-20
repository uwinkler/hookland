import { Button, Card, CardContent, Stack } from '@mui/material'
import React from 'react'
import { useFireworks } from './useFireworks'
import { useRandomNumbers } from './useRandomNumbers'

function useCelebrateWin(n1: number, n2: number, n3: number) {
  const { start, stop } = useFireworks()
  React.useEffect(() => {
    if (n1 === n2 && n2 === n3) {
      start()
      setTimeout(() => {
        stop()
      }, 5 * 1000)
    }
  }, [n1, n2, n3, start, stop])
}

export function RandomGame() {
  const { n1, n2, n3, roll } = useRandomNumbers()

  useCelebrateWin(n1, n2, n3)

  return (
    <Stack spacing={3} alignItems={'center'}>
      <h1>Random Game</h1>

      <Card sx={{ minWidth: 200 }}>
        <CardContent sx={{ display: 'grid', placeContent: 'center' }}>
          <h2>
            {n1} - {n2} - {n3}
          </h2>
          <Button variant={'contained'} onClick={roll}>
            Roll
          </Button>
        </CardContent>
      </Card>

      <p>
        Click the button to roll the dice. If all three numbers are the same,
        you win!
      </p>
    </Stack>
  )
}
