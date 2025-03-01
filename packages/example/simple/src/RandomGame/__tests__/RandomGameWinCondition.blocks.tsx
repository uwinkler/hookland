import { HookMockMapping, HookProvider } from '@hookland/inject'
import { RandomGame } from '../RandomGame'
import { useRandomNumbers } from '../useRandomNumbers'

const randomNumbersAlwaysWin: HookMockMapping = {
  for: useRandomNumbers,
  use: () => ({
    n1: 1,
    n2: 1,
    n3: 1,
    roll: () => {}
  })
}

/**
 * This is a test
 */
export function RandomGameAlwaysWinFixture() {
  return (
    <HookProvider hooks={[randomNumbersAlwaysWin]}>
      <RandomGame />
    </HookProvider>
  )
}
