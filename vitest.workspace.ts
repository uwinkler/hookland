import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  "./packages/dev-tools-commons/vitest.config.ts",
  "./packages/dev-tools-client/vitest.config.ts",
  "./packages/example/simple/vite.config.ts",
  "./packages/dev-tools-chrome/vite.config.ts",
  "./packages/inject/vitest.config.ts",
  "./packages/inject-testing-library/vitest.config.ts"
])
