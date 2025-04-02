import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'

class PebbleFunctionItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly pebbleName: string,
    public readonly filePath: string,
    public readonly lineNumber: number
  ) {
    super(label, vscode.TreeItemCollapsibleState.None)
    this.tooltip = `${pebbleName} (line ${lineNumber})`
    this.iconPath = new vscode.ThemeIcon('symbol-function')
    this.command = {
      command: 'vscode-pebbles.openFileAtLine',
      title: 'Open File and Show Preview',
      arguments: [filePath, pebbleName, lineNumber]
    }
    this.tooltip = `${pebbleName} (line ${lineNumber})`
  }
}

class PebbleFileItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly filePath: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState)
    this.tooltip = filePath
    this.iconPath = new vscode.ThemeIcon('symbol-property')
    // this.command = {
    //   command: 'vscode-pebbles.openFileAtLine',
    //   title: 'Open File and Show Preview',
    //   arguments: [filePath, 1]
    // }
  }
}

export class TreeDataProvider
  implements vscode.TreeDataProvider<PebbleFileItem | PebbleFunctionItem>
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    PebbleFileItem | PebbleFunctionItem | undefined | null | void
  > = new vscode.EventEmitter<
    PebbleFileItem | PebbleFunctionItem | undefined | null | void
  >()
  readonly onDidChangeTreeData: vscode.Event<
    PebbleFileItem | PebbleFunctionItem | undefined | null | void
  > = this._onDidChangeTreeData.event

  private expandedFiles = new Set<string>()

  refresh(): void {
    this._onDidChangeTreeData.fire()
  }

  toggleFile(filePath: string): void {
    if (this.expandedFiles.has(filePath)) {
      this.expandedFiles.delete(filePath)
    } else {
      this.expandedFiles.add(filePath)
    }
    this._onDidChangeTreeData.fire()
  }

  getTreeItem(element: PebbleFileItem | PebbleFunctionItem): vscode.TreeItem {
    return element
  }

  async getChildren(
    element?: PebbleFileItem | PebbleFunctionItem
  ): Promise<(PebbleFileItem | PebbleFunctionItem)[]> {
    if (!element) {
      // Root level - find all .pebble.tsx files
      const files = await vscode.workspace.findFiles('**/*.pebble.tsx')
      return files.map((file) => {
        const fileName = path.basename(file.fsPath)
        return new PebbleFileItem(
          fileName,
          file.fsPath,
          this.expandedFiles.has(file.fsPath)
            ? vscode.TreeItemCollapsibleState.Expanded
            : vscode.TreeItemCollapsibleState.Collapsed
        )
      })
    } else if (element instanceof PebbleFileItem) {
      // Get pebble functions from the file
      const content = fs.readFileSync(element.filePath, 'utf-8')
      const lines = content.split('\n')
      const pebbleFunctions: PebbleFunctionItem[] = []

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (line.includes('@pebble')) {
          // Look for the function declaration in the next few lines
          for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
            const nextLine = lines[j]
            const functionMatch = nextLine.match(/export\s+function\s+(\w+)/)
            if (functionMatch) {
              pebbleFunctions.push(
                new PebbleFunctionItem(
                  functionMatch[1],
                  functionMatch[1],
                  element.filePath,
                  j + 1
                )
              )
              break
            }
          }
        }
      }

      return pebbleFunctions
    }
    return []
  }
}
