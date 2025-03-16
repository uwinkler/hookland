import { HookMockMapping, HookProvider } from '@hookland/inject'
import { RandomGame } from '../RandomGame'
import { useRandomNumbers } from '../useRandomNumbers'

const randomNumbersAlwaysWin: HookMockMapping<typeof useRandomNumbers> = {
  for: useRandomNumbers,
  use: () => ({
    luckyNumber: 111,
    nextLuckyNumber: () => 111
  })
}

/**
 * This is a test
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
