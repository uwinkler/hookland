/***
 * To disable injectable hooks at build time, call this function with `true` as the argument.
 *
 * This is useful in production to prevent the hooks from being accidentally mocked in production builds.
 * If disabled, the hooks will use the original implementation instead of the one
 * created with `createInjectableHook` in all cases.
 *
 * If you want to dynamically enable or disable injectable hooks, you can provide different hook mappings
 * to the `HookProvider`, e.g. `<HookProvider hooks={isDisabled() ? [] : mocks}>`.
 *
 * @example
 * ```tsx
 * import { disableInjectableHooksDuringBuild } from '@hookland/inject'
 *
 * // vite will replace `import.meta.env.PROD` with `true` or `false` during build
 * // but check the build output to make sure it's working as expected
 * disableInjectableHooksDuringBuild(import.meta.env.PROD)
 *
 *
 * // webpack will replace `process.env.NODE_ENV === 'production` with `true` or `false` during build
 * // but check the build output to make sure it's working as expected
 * disableInjectableHooksDuringBuild(process.env.NODE_ENV === 'production')
 *
 */
let HOOKLAND_INJECT_DISABLED = false

export function disableInjectableHooksDuringBuild(disabled = true): void {
  HOOKLAND_INJECT_DISABLED = disabled
}

export function isDisabled() {
  return HOOKLAND_INJECT_DISABLED
}
