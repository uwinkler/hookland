import { HookProvider } from '@hookland/inject'
import { RandomGame } from '../RandomGame'
import { randomNumbersMock } from './useRandomNumbersMock'

/**
 * This is a block that tests the RandomGame component with three random tosses.
 * 
 * @pebble
 */
export function RandomGameThreeRolePebble() {
  return (
    <HookProvider hooks={[randomNumbersMock]}>
      <RandomGame />
    </HookProvider>
  )
}

/**
 * @pebble
 */
export function RandomGameSomeOtherPebble() {
  return (
    <HookProvider hooks={[randomNumbersMock]}>
      <RandomGame />
    </HookProvider>
  )
}