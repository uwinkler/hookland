import babel from '@babel/parser'
import _traverse from '@babel/traverse'
import fs from 'fs'
import { glob } from 'glob'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const traverse = (_traverse as any).default as typeof _traverse
const fixturesPaths = glob.sync(
  resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../src/**/*.blocks.{jsx,tsx}'
  )
)

function extractFixtureInformation(filePath: string) {
  const code = fs.readFileSync(filePath, 'utf-8')

  const ast = babel.parse(code, {
    sourceType: 'module',
    attachComment: true,
    tokens: true,
    ranges: true,
    plugins: ['jsx', 'typescript'] // Enable JSX parsing
  })

  let result = {}

  traverse(ast, {
    FunctionDeclaration(path) {
      const doc = (() => {
        const funcStart = path.node.loc?.start.line ?? Number.MIN_SAFE_INTEGER
        const previousComments = ast.comments?.filter((comment) => {
          if (comment.type !== 'CommentBlock') {
            return false
          }
          const commentEnd = comment.loc?.end.line ?? Number.MAX_SAFE_INTEGER
          console.log(commentEnd, path.node.loc?.start.line)
          return commentEnd + 1 === funcStart
        })

        if (previousComments && previousComments.length > 0) {
          return previousComments[0].value.trim()
        }

        return ''
      })()

      // Extract function name
      const functionName = path?.node?.id?.name
      const isExported = path?.parent?.type === 'ExportNamedDeclaration'

      if (!functionName || !isExported) {
        return null
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

const fixtures = fixturesPaths.map(extractFixtureInformation).filter(Boolean)
console.log(fixtures)
