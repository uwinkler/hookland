import { HookProvider } from '@hookland/inject'
import { RandomGame } from '../RandomGame'
import { randomNumbersMock } from './useRandomNumbersMock'

/**
 * This is a block that tests the RandomGame component with three random numbers.
 * 
 */
export function RandomGameThreeRoleBlock() {
  return (
    <HookProvider hooks={[randomNumbersMock]}>
      <RandomGame />
    </HookProvider>
  )
}

