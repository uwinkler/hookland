import babel from '@babel/parser'
import _traverse from '@babel/traverse'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const traverse = (_traverse as any).default as typeof _traverse
import fs from 'fs'
import { glob } from 'glob'
import { resolve } from 'path'
import { Plugin } from 'vite'

export function fixtures(): Plugin {
  return {
    name: 'vite-plugin-inject-fixtures',
    transformIndexHtml(html) {
      try {
        // Use glob to find all *.fixture.tsx files in the src directory
        const fixturesPath = glob.sync(
          resolve(__dirname, '../src/**/*.blocks.tsx')
        )

        const script = `<script>window.__FIXTURES__ = ${JSON.stringify({
          fixtures: fixturesPath.map(extractFixtureInformation).filter(Boolean)
        })};</script>`
        return html.replace('</body>', `${script}</body>`)
      } catch (error) {
        console.error('Error in vite-plugin-inject-fixtures:', error)
        return html
      }
    }
  }

  function extractFixtureInformation(filePath: string) {
    const code = fs.readFileSync(filePath, 'utf-8')

    const ast = babel.parse(code, {
      sourceType: 'module',
      attachComment: true,
      plugins: ['jsx', 'typescript'] // Enable JSX parsing
    })

    let result = {}

    traverse(ast, {
      FunctionDeclaration(path) {
        const { leadingComments } = path.node

        let jsDoc = null

        if (leadingComments && leadingComments.length > 0) {
          jsDoc = leadingComments[0].value.trim()
        }
        // Extract function name
        const functionName = path?.node?.id?.name
        const isExported = path?.parent?.type === 'ExportNamedDeclaration'

        if (!functionName || !isExported) {
          return null
        }

        result = {
          functionName,
          filePath,
          jsDoc
        }
      }
    })

    return result
  }
}
