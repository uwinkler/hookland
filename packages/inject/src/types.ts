type FunctionType<A, B> = (...args: A[]) => B

export type HookMockMapping<
  T extends FunctionType<unknown, unknown> = (...args: unknown[]) => unknown
> = {
  for: T
  use: T
}
