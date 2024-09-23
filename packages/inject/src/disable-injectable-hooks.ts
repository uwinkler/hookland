/***
 * To disable injectable hooks, call this function with `true` as the argument.
 *
 * This is useful in production to prevent the hooks from being accidentally  mocked.
 * If disabled, the hooks will use the original implementation instead of the mocked one in all cases.
 *
 * @example
 * ```tsx
 * import { disableInjectableHooks } from '@hookland/inject'
 *
 * // vite will replace `import.meta.env.PROD` with `true` or `false` during build
 * // but check the build output to make sure it's working as expected
 * disableInjectableHooks(import.meta.env.PROD)
 *
 *
 * // webpack will replace `process.env.NODE_ENV === 'production` with `true` or `false` during build
 * // but check the build output to make sure it's working as expected
 * disableInjectableHooks(process.env.NODE_ENV === 'production')
 *
 */
export function disableInjectableHooks(disabled = true): void {
  window.__HOOKLAND_INJECT_DISABLED__ = disabled
}
