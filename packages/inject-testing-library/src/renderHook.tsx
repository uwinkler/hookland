/* eslint-disable @typescript-eslint/no-explicit-any */
import { HookMockMapping, HookProvider } from '@hookland/inject'
import {
  Queries,
  render,
  RenderHookOptions,
  RenderHookResult
} from '@testing-library/react'
import * as React from 'react'
import { Container } from 'react-dom/client'

export function renderHook<Props, Result>(
  renderCallback: (props?: Props) => Result,
  options: RenderHookOptions<Props, Queries, Container, Container> & {
    hooks?: HookMockMapping[]
  } = {}
): RenderHookResult<Result, Props> {
  const { initialProps, ...renderOptions } = options
  const { hooks = [] } = renderOptions

  const result = React.createRef<Result>()

  function TestComponent({
    renderCallbackProps
  }: {
    renderCallbackProps: Props | undefined
  }) {
    const pendingResult = renderCallback(renderCallbackProps)

    React.useEffect(() => {
      result.current = pendingResult
    })

    return null
  }

  function TestComponentWrapper({
    hooks,
    renderCallbackProps
  }: {
    hooks: HookMockMapping[]
    renderCallbackProps: Props | undefined
  }) {
    return (
      <HookProvider hooks={hooks}>
        <TestComponent renderCallbackProps={renderCallbackProps} />
      </HookProvider>
    )
  }

  const { rerender: baseRerender, unmount } = render(
    <TestComponentWrapper hooks={hooks} renderCallbackProps={initialProps} />,
    renderOptions
  )

  function rerender(rerenderCallbackProps: Props | undefined) {
    return baseRerender(
      <TestComponentWrapper
        hooks={hooks}
        renderCallbackProps={rerenderCallbackProps}
      />
    )
  }
  const res = result as { current: Result }

  return { result: res, rerender, unmount }
}
