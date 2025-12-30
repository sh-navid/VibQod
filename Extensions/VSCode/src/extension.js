const vscode = require('vscode');
const path = require('path');

function activate(context) {
    console.log('VibQod extension active');

    /* -------- Add-to-VibQod command ------------------ */
    const addToVibQodDisposable = vscode.commands.registerCommand(
        'vibqod-vscode-addin.addToVibQod',
        async (uri) => {
            if (!uri) {
                return vscode.window.showErrorMessage('No file or folder selected.');
            }

            const filePath = uri.fsPath;
            vscode.window.showInformationMessage(`Adding ${filePath} to VibQod (simulated).`);
        }
    );
    context.subscriptions.push(addToVibQodDisposable);

    /* -------- Webview View provider ------------------ */
    const provider = new VibQodViewProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('vibqodView', provider)
    );

    /* Optional command to pop the view out into its own tab */
    const openViewDisposable = vscode.commands.registerCommand(
        'vibqod-vscode-addin.openVibqodView',
        () => provider.createOrShow()
    );
    context.subscriptions.push(openViewDisposable);
}

class VibQodViewProvider {
    constructor(extensionUri) {
        this._extensionUri = extensionUri;
        this._panel = undefined;
        this._view = undefined;
    }

    /* For the command – opens in a regular editor column */
    createOrShow() {
        if (this._panel) {
            return this._panel.reveal(vscode.ViewColumn.Beside);
        }

        this._panel = vscode.window.createWebviewPanel(
            'vibqodView',
            'VibQod',
            vscode.ViewColumn.Beside,
            {
                enableScripts: true,
                localResourceRoots: [vscode.Uri.joinPath(this._extensionUri, 'media')]
            }
        );

        this._panel.onDidDispose(() => (this._panel = undefined));
        this._panel.webview.html = this._getHtml(this._panel.webview);
    }

    /* Called by VS Code when the view is shown in the side bar */
    resolveWebviewView(webviewView) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.joinPath(this._extensionUri, 'media')]
        };
        webviewView.webview.html = this._getHtml(webviewView.webview);
    }

    /* -------- HTML generation ------------------ */
    _getHtml(webview) {
        const scriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'media', 'script.js')
        );
        const styleUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'media', 'style.css')
        );

        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link href="${styleUri}" rel="stylesheet" />
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        overflow: hidden; /* Hide scrollbars if the iframe content is larger */
                    }
                    iframe {
                        width: 100vw; /* Use viewport width */
                        height: 100vh; /* Use viewport height */
                        border: none; /* Remove iframe border */
                    }
                </style>
            </head>
            <body>
                <iframe src="http://localhost:9090"></iframe>
                <script src="${scriptUri}"></script>
            </body>
            </html>`;
    }
}

function deactivate() {}

module.exports = { activate, deactivate };
