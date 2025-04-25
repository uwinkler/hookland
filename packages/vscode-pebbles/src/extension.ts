// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import { PebbleWebviewPanel } from './pebbleWebviewPanel'
import { TreeDataProvider } from './pepple-tree-view'

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "vscode-pebbles" is now active!')

  // Register the tree view
  const treeDataProvider = new TreeDataProvider()
  vscode.window.registerTreeDataProvider('pebbleTreeView', treeDataProvider)

  // Register command to open pebble webview
  const openPebbleWebview = vscode.commands.registerCommand(
    'vscode-pebbles.openPebbleWebview',
    (filePath: string, pebbleName: string, workspaceFolder: string) => {
      PebbleWebviewPanel.createOrShow(filePath, pebbleName, workspaceFolder)
    }
  )

  // Refresh views when files change
  const fileSystemWatcher =
    vscode.workspace.createFileSystemWatcher('**/*.pebble.tsx')
  fileSystemWatcher.onDidChange(() => {
    treeDataProvider.refresh()
  })
  fileSystemWatcher.onDidCreate(() => {
    treeDataProvider.refresh()
  })
  fileSystemWatcher.onDidDelete(() => {
    treeDataProvider.refresh()
  })

  // Register command to open file at specific line
  const openFileAtLine = vscode.commands.registerCommand(
    'vscode-pebbles.openFileAtLine',
    async (filePath: string, pebbleName, lineNumber: number) => {
      const document = await vscode.workspace.openTextDocument(filePath)
      const position = new vscode.Position(lineNumber - 1, 0)
      const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri)

      await vscode.commands.executeCommand(
        'vscode-pebbles.openPebbleWebview',
        filePath,
        pebbleName,
        workspaceFolder?.uri.fsPath || ''
      )

      await vscode.window.showTextDocument(document, {
        selection: new vscode.Range(position, position),
        viewColumn: vscode.ViewColumn.One
      })
    }
  )

  const openPebble = vscode.commands.registerCommand(
    'vscode-pebbles.openPebble',
    async (filePath: string) => {
      await vscode.workspace.openTextDocument(filePath)
    }
  )

  context.subscriptions.push(
    fileSystemWatcher,
    openFileAtLine,
    openPebbleWebview,
    openPebble
  )
}

// This method is called when your extension is deactivated
export function deactivate() {}
