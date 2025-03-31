import * as parser from '@babel/parser'
import _traverse from '@babel/traverse'
import * as t from '@babel/types'
import { readFileSync, readdirSync, statSync, watch } from 'fs'
import { resolve } from 'path'
import type { Plugin } from 'vite'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const traverse = (_traverse as any).default as typeof _traverse

const DEBUG = true // Set to true to enable console logging

function log(...args: unknown[]) {
  if (DEBUG) console.log(...args)
}

function error(...args: unknown[]) {
  if (DEBUG) console.error(...args)
}

interface PebbleFunction {
  comment: string
  name: string
  filePath: string
  line: number
}

// Store all pebble functions
const pebbleFunctions = new Set<PebbleFunction>()

function processFile(filePath: string) {
  log(`[Pebble Plugin] Processing file: ${filePath}`)
  try {
    const code = readFileSync(filePath, 'utf-8')
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
      attachComment: true
    })

    // First, collect all comments
    const comments = new Map<number, string>()
    log('ast.comments', ast.comments)
    if (ast.comments) {
      ast.comments.forEach((comment) => {
        if (comment.type === 'CommentBlock') {
          comments.set(comment.loc?.end.line || 0, comment.value.trim())
        }
      })
    }

    // Then look for functions and variables with @pebble comments
    traverse(ast, {
      FunctionDeclaration(path) {
        const node = path.node
        const line = node.loc?.start.line || 0
        const comment = comments.get(line - 1) // Check the line before the function
        if (comment?.includes('@pebble')) {
          const functionName = node.id?.name
          if (functionName) {
            log(
              `[Pebble Plugin] Found pebble function: ${functionName} in ${filePath}`
            )
            pebbleFunctions.add({
              comment: comment.replace('@pebble', '').trim(),
              name: functionName,
              filePath,
              line
            })
          }
        }
      },
      VariableDeclarator(path) {
        if (t.isIdentifier(path.node.id)) {
          const node = path.node
          const line = node.loc?.start.line || 0
          const comment = comments.get(line - 1) // Check the line before the variable
          if (comment?.includes('@pebble')) {
            log(
              `[Pebble Plugin] Found pebble variable: ${path.node.id.name} in ${filePath}`
            )
            pebbleFunctions.add({
              comment: comment.replace('@pebble', '').trim(),
              name: path.node.id.name,
              filePath,
              line
            })
          }
        }
      }
    })
  } catch (e) {
    error(`[Pebble Plugin] Error processing ${filePath}:`, error)
  }
}

function scanDirectory(dir: string) {
  const files = readdirSync(dir)

  files.forEach((file: string) => {
    const filePath = resolve(dir, file)
    const stat = statSync(filePath)

    if (stat.isDirectory()) {
      scanDirectory(filePath)
    } else if (file.endsWith('.pebble.tsx') || file.endsWith('.tsx')) {
      processFile(filePath)
    }
  })
}

export default function pebblePlugin(): Plugin {
  return {
    name: 'vite-plugin-pebble',

    configureServer(server) {
      const projectRoot = process.cwd()
      log('[Pebble Plugin] Initial scan of project directory:', projectRoot)
      scanDirectory(projectRoot)

      // Watch for file changes
      const watcher = watch(
        projectRoot,
        { recursive: true },
        (eventType, filename) => {
          if (!filename) return

          const filePath = resolve(projectRoot, filename)
          if (filename.endsWith('.pebble.tsx') || filename.endsWith('.tsx')) {
            log(`[Pebble Plugin] File ${eventType}: ${filename}`)
            processFile(filePath)
          }
        }
      )

      server.httpServer?.once('close', () => {
        watcher.close()
      })
    },

    transform(code, id) {
      if (!id.endsWith('.tsx')) return null
      processFile(id)
      return null
    },

    resolveId(id) {
      if (id === 'virtual:pebble-list') {
        log('[Pebble Plugin] Resolving virtual module:', id)
        return '\0virtual:pebble-list'
      }
    },

    load(id) {
      if (id === '\0virtual:pebble-list') {
        log(
          '[Pebble Plugin] Loading virtual module with pebble functions:',
          Array.from(pebbleFunctions)
        )
        return `
          export const pebbleFunctions = ${JSON.stringify(
            Array.from(pebbleFunctions),
            null,
            2
          )}
        `
      }
      return null
    }
  }
}
