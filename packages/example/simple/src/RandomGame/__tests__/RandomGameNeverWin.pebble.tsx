import { HookMockMapping, HookProvider } from '@hookland/inject'
import { RandomGame } from '../RandomGame'
import { useRandomNumbers } from '../useRandomNumbers'

const randomNumbersAlwaysWin: HookMockMapping<typeof useRandomNumbers> = {
  for: useRandomNumbers,
  use: () => ({
    luckyNumber: 999,
    balance: 100,
    nextLuckyNumber: () => 999
  })
}



/**
 * A fixture that always wins the game.
 *
 * This is useful for testing the RandomGame component in a deterministic way:
 * - The game will always show the winning screen.
 * - No other rolls are possible.
 * - The `roll` function is disabled.
 * 
 * @pebble
 */
export function RandomGameAlwaysWinPebble() {
  return (
    <HookProvider hooks={[randomNumbersAlwaysWin]}>
      <RandomGame />
    </HookProvider>
  )
}


