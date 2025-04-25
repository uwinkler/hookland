import * as vscode from 'vscode'

export class PebbleWebviewPanel {
  public static currentPanel: PebbleWebviewPanel | undefined
  private readonly _panel: vscode.WebviewPanel
  private _disposables: vscode.Disposable[] = []

  private constructor(props: {
    panel: vscode.WebviewPanel
    filePath: string
    pebbleName: string
    workspaceFolder: string
  }) {
    this._panel = props.panel

    // Set the webview's initial html content
    this._panel.webview.html = this._getHtmlForWebview({
      filePath: props.filePath,
      pebbleName: props.pebbleName,
      workspaceFolder: props.workspaceFolder
    })

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programmatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables)
  }

  public static createOrShow(
    filePath: string,
    pebbleName: string,
    workspaceFolder: string
  ) {
    const column = vscode.ViewColumn.Two

    // If we already have a panel, dispose it
    if (PebbleWebviewPanel.currentPanel) {
      PebbleWebviewPanel.currentPanel.dispose()
    }

    const panel = vscode.window.createWebviewPanel(
      'pebbleWebview',
      pebbleName,
      { viewColumn: column, preserveFocus: true },
      {
        enableScripts: true,
        retainContextWhenHidden: false
      }
    )

    PebbleWebviewPanel.currentPanel = new PebbleWebviewPanel({
      panel,
      filePath,
      pebbleName,
      workspaceFolder
    })
  }

  private _getHtmlForWebview(props: {
    pebbleName: string
    filePath: string
    workspaceFolder: string
  }) {
    const { pebbleName, filePath, workspaceFolder } = props
    console.log('filePath', filePath)
    console.log('workspaceFolder', workspaceFolder)
    const relativePath = filePath.replace(workspaceFolder, '')
    const encodedFilePath = encodeURIComponent(relativePath)
    console.log('encodedFilePath', encodedFilePath)

    const iframeSrc = `http://localhost:5173?pebbleFunction=${pebbleName}&pebbleFilePath=${encodedFilePath}`
    console.log('iframeSrc', iframeSrc)

    return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${pebbleName}</title>
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        width: 100vw;
                        height: 100vh;
                        overflow: hidden;
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
                    <iframe src="${iframeSrc}"></iframe>
                </div>
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
