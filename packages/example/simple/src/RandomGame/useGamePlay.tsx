import { isWin } from './isWin'
import { useBalance } from './useBalance'
import { useRandomNumbers } from './useRandomNumbers'

export function useGamePlay() {
  const { luckyNumber, nextLuckyNumber } = useRandomNumbers()
  const { deposit, withdraw, balance } = useBalance()

  function roll() {
    const nextNumber = nextLuckyNumber()
    if (isWin(nextNumber)) {
      deposit(100)
    } else {
      withdraw(1)
    }
  }

  return { luckyNumber, roll, balance }
}


