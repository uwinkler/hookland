import { useContext, useMemo } from 'react'
import { HookContext } from './hook-context'
import { isDisabled } from './disable-injectable-hooks-during-build'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createInjectableHook<T extends (...args: any[]) => any>(
  hook: T
): (...funcArgs: Parameters<T>) => ReturnType<T> {
  if (isDisabled()) {
    return hook
  }

  return function useHook(...args: Parameters<T>): ReturnType<T> {
    const hooks = useContext(HookContext)

    const hookImplementationToUse = useMemo(() => {
      const hookInRegistry = hooks.get(useHook)

      if (hookInRegistry === useHook) {
        throw new Error('Cannot mock a hook with itself')
      }

      return hookInRegistry || hook
    }, [hooks])

    return hookImplementationToUse(...args)
  }
}
