import babel from '@babel/parser'
import _traverse from '@babel/traverse'
import fs from 'fs'
import { glob } from 'glob'
import { resolve } from 'path'
import { Plugin } from 'vite'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const traverse = (_traverse as any).default as typeof _traverse

export function fixtures(
  { fixtureGlob, pebbleGlob } = {
    fixtureGlob: './src/**/*.fixtures.tsx',
    pebbleGlob: './src/**/*.tsx'
  }
): Plugin {
  return {
    name: 'vite-plugin-inject-fixtures',
    transformIndexHtml(html) {
      try {
        const fixturePaths = glob.sync(resolve(__dirname, fixtureGlob))
        const pebblePaths = glob.sync(resolve(__dirname, pebbleGlob))

        // console.log('fixturePaths', fixturePaths)
        // console.log('pebblePaths', pebblePaths)

        const script = `<script>
          window.__FIXTURES__ = ${JSON.stringify({
            fixtures: fixturePaths
              .map((path) => extractFixtureInformation(path, '@fixture'))
              .filter(Boolean),
            pebbles: pebblePaths
              .map((path) => extractFixtureInformation(path, '@pebble'))
              .filter(Boolean)
          })};
          </script>`
        return html.replace('</body>', `${script}</body>`)
      } catch (error) {
        console.error('Error in vite-plugin-inject-fixtures:', error)
        return html
      }
    }
  }

  function extractFixtureInformation(filePath: string, annotation: string) {
    const code = fs.readFileSync(filePath, 'utf-8')

    const ast = babel.parse(code, {
      sourceType: 'module',
      attachComment: true,
      tokens: true,
      plugins: ['jsx', 'typescript'] // Enable JSX parsing
    })

    let result = {}

    traverse(ast, {
      FunctionDeclaration(path) {
        const { leadingComments } = path.node
        console.log(leadingComments)

        let jsDoc = ''

        if (leadingComments && leadingComments.length > 0) {
          jsDoc = leadingComments[0].value.trim()
        }

        const functionName = path?.node?.id?.name
        const isExported = path?.parent?.type === 'ExportNamedDeclaration'

        if (!functionName || !isExported || !jsDoc.includes(annotation)) {
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
