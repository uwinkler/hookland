/* eslint-disable @typescript-eslint/no-unsafe-function-type */
export function mergeMap(
  map1: Map<Function, Function>,
  map2: Map<Function, Function>
) {
  const result = new Map(map1)
  map2.forEach((value, key) => {
    result.set(key, value)
  })
  return result
}
