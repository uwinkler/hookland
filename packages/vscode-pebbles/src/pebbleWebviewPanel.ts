import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'

interface PebbleItem {
  label: string
  filePath: string
  functionName: string
  lineNumber: number
}

export class PebbleWebviewPanel {
  public static currentPanel: PebbleWebviewPanel | undefined
  private readonly _panel: vscode.WebviewPanel
  private _disposables: vscode.Disposable[] = []
  private _pebbles: PebbleItem[] = []

  private constructor(panel: vscode.WebviewPanel) {
    this._panel = panel

    // Set the webview's initial html content
    this._panel.webview.html = this._getHtmlForWebview(this._panel.webview)

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programmatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables)

    // Handle messages from the webview
    this._panel.webview.onDidReceiveMessage(
      (message) => {
        switch (message.command) {
          case 'selectPebble':
            this._handlePebbleSelection(message.filePath, message.functionName)
            return
          case 'refreshPebbles':
            this._refreshPebbles()
            return
        }
      },
      null,
      this._disposables
    )
  }

  private async _handlePebbleSelection(filePath: string, functionName: string) {
    try {
      const document = await vscode.workspace.openTextDocument(filePath)
      this._panel.webview.postMessage({
        command: 'updatePreview',
        content: document.getText()
      })
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to load pebble: ${error}`)
    }
  }

  private async _refreshPebbles() {
    const files = await vscode.workspace.findFiles('**/*.pebble.tsx')
    const pebbleFunctions: PebbleItem[] = []

    for (const file of files) {
      try {
        const content = await fs.promises.readFile(file.fsPath, 'utf-8')
        const lines = content.split('\n')

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i]
          if (line.includes('@pebble')) {
            // Look for the function declaration in the next few lines
            for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
              const nextLine = lines[j]
              const functionMatch = nextLine.match(/export\s+function\s+(\w+)/)
              if (functionMatch) {
                pebbleFunctions.push({
                  label: `${path.basename(file.fsPath)} - ${functionMatch[1]}`,
                  filePath: file.fsPath,
                  functionName: functionMatch[1],
                  lineNumber: j + 1
                })
                break
              }
            }
          }
        }
      } catch (error) {
        console.error(`Error reading file ${file.fsPath}:`, error)
      }
    }

    this._pebbles = pebbleFunctions
    this._panel.webview.postMessage({
      command: 'updatePebbles',
      pebbles: this._pebbles
    })
  }

  public static createOrShow(filePath: string, pebbleName: string) {
    const column = vscode.ViewColumn.Two

    // If we already have a panel, show it
    if (PebbleWebviewPanel.currentPanel) {
      PebbleWebviewPanel.currentPanel._panel.reveal(column)
      return
    }

    // Otherwise, create a new panel
    const panel = vscode.window.createWebviewPanel(
      'pebbleWebview',
      'Pebble Webview',
      column,
      {
        enableScripts: true,
        retainContextWhenHidden: true
      }
    )

    PebbleWebviewPanel.currentPanel = new PebbleWebviewPanel(panel)
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Pebble Webview</title>
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        width: 100vw;
                        height: 100vh;
                        overflow: hidden;
                        color: var(--vscode-editor-foreground);
                        background-color: var(--vscode-editor-background);
                        font-family: var(--vscode-font-family);
                        display: flex;
                    }
                
                    .preview-container {
                        flex: 1;
                        height: 100vh;
                    }
                    iframe {
                        width: 100%;
                        height: 100%;
                        border: none;
                        margin: 0;
                        padding: 0;
                    }
                </style>
            </head>
            <body>
                <div class="preview-container">
                    <iframe src="http://localhost:5173"></iframe>
                </div>
                <script>
                    const vscode = acquireVsCodeApi();
                    let selectedPebble = null;

                    function createPebbleItem(pebble) {
                        const div = document.createElement('div');
                        div.className = 'pebble-item';
                        
                        const functionName = document.createElement('span');
                        functionName.className = 'function-name';
                        functionName.textContent = pebble.functionName;
                        
                        const fileName = document.createElement('span');
                        fileName.className = 'file-name';
                        fileName.textContent = pebble.label.split(' - ')[0];
                        
                        div.appendChild(functionName);
                        div.appendChild(fileName);
                        div.onclick = () => selectPebble(pebble);
                        return div;
                    }

                    function selectPebble(pebble) {
                        // Update selection UI
                        document.querySelectorAll('.pebble-item').forEach(item => {
                            item.classList.remove('selected');
                        });
                        event.target.closest('.pebble-item').classList.add('selected');
                        
                        // Update iframe URL with selected pebble
                        const iframe = document.querySelector('iframe');
                        const baseUrl = 'http://localhost:5173';
                        const url = new URL(baseUrl);
                        url.searchParams.set('pebble', pebble.filePath);
                        url.searchParams.set('function', pebble.functionName);
                        iframe.src = url.toString();
                        
                        // Send message to extension
                        vscode.postMessage({
                            command: 'selectPebble',
                            filePath: pebble.filePath,
                            functionName: pebble.functionName
                        });
                    }

                    // Listen for messages from the extension
                    window.addEventListener('message', event => {
                        const message = event.data;
                        switch (message.command) {
                            case 'updatePebbles':
                                const pebbleList = document.getElementById('pebble-list');
                                pebbleList.innerHTML = '';
                                message.pebbles.forEach(pebble => {
                                    pebbleList.appendChild(createPebbleItem(pebble));
                                });
                                break;
                            case 'updatePreview':
                                // Handle preview updates if needed
                                break;
                        }
                    });

                    // Request initial pebble list
                    vscode.postMessage({ command: 'refreshPebbles' });
                </script>
            </body>
            </html>
        `
  }

  public dispose() {
    PebbleWebviewPanel.currentPanel = undefined

    this._panel.dispose()

    while (this._disposables.length) {
      const disposable = this._disposables.pop()
      if (disposable) {
        disposable.dispose()
      }
    }
  }
}
