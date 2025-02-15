import { Button, Card, CardContent, Stack } from '@mui/material'
import { useRandomNumbers } from './useRandomNumbers'

export function RandomGame() {
  const { n1, n2, n3, roll } = useRandomNumbers()
  const allEqual = n1 === n2 && n2 === n3

  return (
    <Stack spacing={3} alignItems={'center'}>
      <h1>{allEqual ? 'You win!' : 'Random Game'}</h1>

      <Card sx={{ minWidth: 200 }}>
        <CardContent sx={{ display: 'grid', placeContent: 'center' }}>
          <h2>
            {n1} - {n2} - {n3}
          </h2>
          <Button variant={'contained'} onClick={roll}>
            Roll the dice
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
