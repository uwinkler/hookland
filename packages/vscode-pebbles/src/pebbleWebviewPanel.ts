import * as vscode from 'vscode'

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

  private constructor(props: {
    panel: vscode.WebviewPanel
    filePath: string
    pebbleName: string
  }) {
    this._panel = props.panel

    // Set the webview's initial html content
    this._panel.webview.html = this._getHtmlForWebview(
      this._panel.webview,
      props.filePath,
      props.pebbleName
    )

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programmatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables)
  }

  public static createOrShow(filePath: string, pebbleName: string) {
    const column = vscode.ViewColumn.Two

    // If we already have a panel, dispose it
    if (PebbleWebviewPanel.currentPanel) {
      PebbleWebviewPanel.currentPanel.dispose()
    }

    const panel = vscode.window.createWebviewPanel(
      'pebbleWebview',
      pebbleName,
      column,
      {
        enableScripts: true,
        retainContextWhenHidden: false
      }
    )

    PebbleWebviewPanel.currentPanel = new PebbleWebviewPanel({
      panel,
      filePath,
      pebbleName
    })
  }

  private _getHtmlForWebview(
    webview: vscode.Webview,
    filePath: string,
    pebbleName: string
  ) {
    const encodedFilePath = encodeURIComponent(filePath)
    console.log('encodedFilePath', encodedFilePath)

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
                    <iframe src="http://localhost:5173?pebble=${pebbleName}"></iframe>
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
