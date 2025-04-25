import type { Plugin } from 'vite'
import * as parser from '@babel/parser'
import _generate from '@babel/generator'
import * as t from '@babel/types'

import _traverse from '@babel/traverse'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const traverse = (_traverse as any).default as typeof _traverse
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const generate = (_generate as any).default as typeof _generate

interface InjectableConfig {
  for: string
  use: string
}

const DEBUG = false // Set to true to enable console logging

function log(...args: unknown[]) {
  if (DEBUG) console.log('[Inject Plugin]', ...args)
}

// function error(...args: unknown[]) {
//   if (DEBUG) console.error(...args)
// }

// Global map to store configurations from all files
const globalConfigs = new Map<string, InjectableConfig>()
// Map to store imported identifiers and their sources
const importedIdentifiers = new Map<string, string>()
// Set to track processed files
const processedFiles = new Set<string>()
// Set to track if createInjectableHook is imported
const hasInjectableHookImport = new Set<string>()

function findInjectableConfigs(code: string): InjectableConfig[] {
  const configs: InjectableConfig[] = []
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript']
  })

  traverse(ast, {
    ObjectExpression(path) {
      const properties = path.node.properties
      if (properties.length === 2) {
        const forProp = properties.find(
          (p) =>
            t.isObjectProperty(p) &&
            t.isIdentifier(p.key) &&
            p.key.name === 'for'
        )
        const useProp = properties.find(
          (p) =>
            t.isObjectProperty(p) &&
            t.isIdentifier(p.key) &&
            p.key.name === 'use'
        )

        if (
          forProp &&
          useProp &&
          t.isObjectProperty(forProp) &&
          t.isObjectProperty(useProp) &&
          t.isIdentifier(forProp.value) &&
          t.isIdentifier(useProp.value)
        ) {
          const config = {
            for: forProp.value.name,
            use: useProp.value.name
          }
          log('Found injectable config:', config)
          configs.push(config)
        }
      }
    }
  })

  return configs
}

function collectImports(code: string): void {
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript']
  })

  traverse(ast, {
    ImportDeclaration(path) {
      const source = path.node.source.value
      path.node.specifiers.forEach((specifier) => {
        if (t.isImportSpecifier(specifier)) {
          log('Found named import:', specifier.local.name, 'from', source)
          importedIdentifiers.set(specifier.local.name, source)
        } else if (t.isImportDefaultSpecifier(specifier)) {
          log('Found default import:', specifier.local.name, 'from', source)
          importedIdentifiers.set(specifier.local.name, source)
        }
      })
    }
  })
}

function checkForInjectableHookImport(code: string): boolean {
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript']
  })

  let hasImport = false
  traverse(ast, {
    ImportDeclaration(path) {
      if (path.node.source.value === '@hookland/inject') {
        path.node.specifiers.forEach((specifier) => {
          if (
            t.isImportSpecifier(specifier) &&
            t.isIdentifier(specifier.imported) &&
            specifier.imported.name === 'createInjectableHook'
          ) {
            hasImport = true
          }
        })
      }
    }
  })
  return hasImport
}

function addInjectableHookImport(ast: t.File): void {
  const importDeclaration = t.importDeclaration(
    [
      t.importSpecifier(
        t.identifier('createInjectableHook'),
        t.identifier('createInjectableHook')
      )
    ],
    t.stringLiteral('@hookland/inject')
  )
  ast.program.body.unshift(importDeclaration)
}

function transformInjectableFunctions(
  code: string,
  configs: InjectableConfig[],
  fileId: string
): string {
  log('Transforming functions with configs:', Array.from(configs))
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript']
  })

  let needsImport = false

  traverse(ast, {
    // Handle function declarations (function useSomeHook() { ... })
    FunctionDeclaration(path) {
      if (t.isIdentifier(path.node.id)) {
        const functionName = path.node.id.name
        const config = configs.find((c) => c.for === functionName)

        if (config) {
          // Skip if already wrapped
          const parent = path.parent
          if (
            t.isVariableDeclaration(parent) &&
            t.isCallExpression(parent.declarations[0].init) &&
            t.isIdentifier(parent.declarations[0].init.callee) &&
            parent.declarations[0].init.callee.name === 'createInjectableHook'
          ) {
            log('Skipping already wrapped function declaration:', functionName)
            return
          }

          log('Found function declaration to wrap:', functionName)
          needsImport = true
          // Create a function expression from the declaration
          const functionExpr = t.functionExpression(
            path.node.id,
            path.node.params,
            path.node.body
          )

          // Create the wrapped function
          const wrappedFunction = t.callExpression(
            t.identifier('createInjectableHook'),
            [functionExpr]
          )

          // Replace the declaration with a variable declaration
          path.replaceWith(
            t.variableDeclaration('const', [
              t.variableDeclarator(path.node.id, wrappedFunction)
            ])
          )
          log('Wrapped function declaration:', functionName)
        }
      }
    },

    // Handle arrow functions and function expressions (const useSomeHook = () => { ... })
    VariableDeclarator(path) {
      if (t.isIdentifier(path.node.id)) {
        const functionName = path.node.id.name
        const config = configs.find((c) => c.for === functionName)

        if (config) {
          // Skip if already wrapped
          if (
            t.isCallExpression(path.node.init) &&
            t.isIdentifier(path.node.init.callee) &&
            path.node.init.callee.name === 'createInjectableHook'
          ) {
            log('Skipping already wrapped variable declaration:', functionName)
            return
          }

          log('Found variable declaration to wrap:', functionName)
          needsImport = true
          let functionToWrap = path.node.init

          // If it's an arrow function, convert it to a regular function expression
          if (t.isArrowFunctionExpression(functionToWrap)) {
            log('Converting arrow function to regular function:', functionName)
            const body = t.isBlockStatement(functionToWrap.body)
              ? functionToWrap.body
              : t.blockStatement([t.returnStatement(functionToWrap.body)])

            functionToWrap = t.functionExpression(
              null,
              functionToWrap.params,
              body
            )
          }

          if (functionToWrap) {
            // Create the wrapped function
            const wrappedFunction = t.callExpression(
              t.identifier('createInjectableHook'),
              [functionToWrap]
            )

            // Replace the original function with the wrapped one
            path.node.init = wrappedFunction
            log('Wrapped variable declaration:', functionName)
          }
        }
      }
    }
  })

  // Add import if needed and not already present
  if (needsImport && !hasInjectableHookImport.has(fileId)) {
    if (!checkForInjectableHookImport(code)) {
      addInjectableHookImport(ast)
      hasInjectableHookImport.add(fileId)
      log('Added createInjectableHook import')
    }
  }

  return generate(ast).code
}

export default function injectablePlugin(): Plugin {
  return {
    name: 'vite-plugin-injectable',
    transform(code, id) {
      if (!id.endsWith('.tsx')) return null

      // Skip if we've already processed this file
      if (processedFiles.has(id)) {
        log('Skipping already processed file:', id)
        return null
      }

      log('\nProcessing file:', id)
      log('----------------------------------------')

      // First pass: collect configurations and imports
      const configs = findInjectableConfigs(code)
      collectImports(code)

      configs.forEach((config) => {
        globalConfigs.set(config.for, config)
      })

      log('Current global configs:', Array.from(globalConfigs.entries()))
      log(
        'Current imported identifiers:',
        Array.from(importedIdentifiers.entries())
      )

      // Second pass: transform functions using all collected configs
      const transformedCode = transformInjectableFunctions(
        code,
        Array.from(globalConfigs.values()),
        id
      )

      // Mark this file as processed
      processedFiles.add(id)

      log('----------------------------------------\n')
      return {
        code: transformedCode,
        map: null
      }
    }
  }
}
