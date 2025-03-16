import { Button, Card, CardContent, Stack, Typography } from '@mui/material'
import { Link } from 'react-router'
import { RandomGameAppBar } from '../AppBar/RandomGameAppBar'
import { Layout } from '../Layout'
import { isWin } from './isWin'
import { useGamePlay } from './useGamePlay'

export function RandomGame() {
  const { luckyNumber, roll, balance } = useGamePlay()
  const win = isWin(luckyNumber)
  const isDisabled = balance <= 0

  return (
    <>
      <RandomGameAppBar />
      <Layout>
        <Stack spacing={3} alignItems={'center'}>
          {!isDisabled && (
            <Typography variant="h4">
              {win ? 'You win 100,- EUR! 🥳🎉' : `${balance},00 €`}
            </Typography>
          )}
          {isDisabled && (
            <Typography variant="h3">You are out of money!</Typography>
          )}
          <Card
            sx={{
              minWidth: 400,
              minHeight: 400,
              display: 'grid',
              placeContent: 'center'
            }}
          >
            <CardContent>
              <Stack spacing={3} alignItems={'center'}>
                {!isDisabled && (
                  <>
                    <Typography variant="h1">{luckyNumber}</Typography>
                    <Button variant={'contained'} onClick={roll}>
                      Roll
                    </Button>
                  </>
                )}
                {isDisabled && (
                  <>
                    <Typography variant="h1">😢</Typography>
                    <Button variant={'contained'} to="/top-up" component={Link}>
                      Top up some money!
                    </Button>
                  </>
                )}
              </Stack>
            </CardContent>
          </Card>

          <p>
            Click the button to roll the dice. If all three numbers are the
            same, you win!
          </p>
        </Stack>
      </Layout>
    </>
  )
}
