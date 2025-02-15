/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import React, { PropsWithChildren, useContext } from 'react'
import { HookContext } from './hook-context'
import { mergeMap } from './merge-map'
import { HookMockMapping } from './types'

/**
 * A hook provider is a component that allows you to override hooks in a subtree.
 *
 * This is useful for testing, where you want to mock out certain hooks. Or
 * for providing a mock implementation of a hook in a storybook story.
 *
 * In our case we use in our storybook app to mock out data loader hooks.
 */
export function HookProvider(
  props: PropsWithChildren<{ hooks?: Array<HookMockMapping> }>
) {
  const { hooks = [], children } = props
  const ctx = useContext(HookContext)
  const parentContext = React.useMemo(() => ctx || new Map(), [ctx])

  const hooksToUse = React.useMemo(() => {
    const hookMap = new Map()
    hooks.forEach((hook) => {
      hookMap.set(hook.for, hook.use)
    })
    return mergeMap(mergeMap(new Map(), hookMap), parentContext)
  }, [hooks, parentContext])

  return (
    <HookContext.Provider value={hooksToUse}>{children}</HookContext.Provider>
  )
}
