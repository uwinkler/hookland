import babel from '@babel/parser'
import _traverse from '@babel/traverse'
import fs from 'fs'
import { glob } from 'glob'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const traverse = (_traverse as any).default as typeof _traverse

const pebbleFiles = glob.sync(
  resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/**/*.{jsx,tsx}')
)

const extractFixtureInformation =
  (annotation: string) => (filePath: string) => {
    const code = fs.readFileSync(filePath, 'utf-8')

    const ast = babel.parse(code, {
      sourceType: 'module',
      attachComment: true,
      tokens: true,
      ranges: true,
      plugins: ['jsx', 'typescript'] // Enable JSX parsing
    })

    let result: { functionName: string; filePath: string; doc: string } | null =
      null

    traverse(ast, {
      FunctionDeclaration(path) {
        const doc = (() => {
          const funcStart = path.node.loc?.start.line ?? Number.MIN_SAFE_INTEGER
          const previousComments = ast.comments?.filter((comment) => {
            if (comment.type !== 'CommentBlock') {
              return false
            }
            const commentEnd = comment.loc?.end.line ?? Number.MAX_SAFE_INTEGER
            return commentEnd + 1 === funcStart
          })

          if (previousComments && previousComments.length > 0) {
            return previousComments[0].value.trim()
          }

          return ''
        })()

        // Extract function name
        const functionName = path?.node?.id?.name || ''
        const isExported = path?.parent?.type === 'ExportNamedDeclaration'

        if (!functionName || !isExported || !doc.includes(annotation)) {
          result = null
          return
        }

        result = {
          functionName,
          filePath,
          doc
        }
      }
    })

    return result
  }

const pebbles = pebbleFiles
  .map(extractFixtureInformation('@pebble'))
  .filter(Boolean)

console.log(`export const pebbles = ${JSON.stringify(pebbles, null, 2)} `)
