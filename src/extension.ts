// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const rootScriptProvider = vscode.languages.registerCompletionItemProvider(['lua', 'luau'], {
    provideCompletionItems(document, position) {
      const wordRange = document.getWordRangeAtPosition(position)
      const word = wordRange ? document.getText(wordRange) : ''

      if (word === 'script') {
        const item = new vscode.CompletionItem('script', vscode.CompletionItemKind.Variable)
        item.detail = 'Roblox script reference'
        item.documentation = new vscode.MarkdownString('Refer to the current script instance')
        return [item]
      }

      return undefined
    },
  })

  const scriptDotProvider = vscode.languages.registerCompletionItemProvider(
    ['lua', 'luau'],
    {
      provideCompletionItems(document, position) {
        const line = document.lineAt(position).text.substr(0, position.character)

        if (!/script(\.\w+)*\.$/.test(line)) {
          return undefined
        }

        const props = [
          {
            label: 'Parent',
            detail: 'The parent object',
            documentation: 'Refers to the parent of the instance.',
          },
          {
            label: 'Name',
            detail: 'The name of the object',
            documentation: 'Returns or sets the Name property.',
          },
        ]

        return props.map((p) => {
          const item = new vscode.CompletionItem(p.label, vscode.CompletionItemKind.Class)
          item.sortText = '0000'
          item.detail = p.detail
          item.documentation = new vscode.MarkdownString(p.documentation)
          return item
        })
      },
    },
    '.' // تریگر
  )

  const scriptColonProvider = vscode.languages.registerCompletionItemProvider(
    ['lua', 'luau'],
    {
      provideCompletionItems(document, position) {
        const line = document.lineAt(position).text.substring(0, position.character)

        // بررسی اینکه کاربر تایپ کرده چیزی مثل script:
        if (!/script(\.\w+)*:$/.test(line)) {
          return undefined
        }

        const methods = [
          {
            label: 'Destroy',
            detail: 'Destroys the object',
            documentation: 'Equivalent to object = nil + parent removal',
          },
          {
            label: 'Clone',
            detail: 'Clones the object',
            documentation: 'Returns a copy of the Instance',
          },
          {
            label: 'GetFullName',
            detail: 'Returns full hierarchy path',
            documentation: 'Useful for debugging paths',
          },
        ]

        return methods.map((m) => {
          const item = new vscode.CompletionItem(m.label, vscode.CompletionItemKind.Method)
          item.sortText = '0001'
          item.detail = m.detail
          item.documentation = new vscode.MarkdownString(m.documentation)
          return item
        })
      },
    },
    ':' // ← این تریگر اصلیه برای ":" بعد از object
  )

  const disposable = vscode.commands.registerCommand('aryosense.helloWorld', () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    vscode.window.showInformationMessage('Hello World from Aryosense!')
  })

  context.subscriptions.push(scriptColonProvider)
  context.subscriptions.push(rootScriptProvider, scriptDotProvider)
  context.subscriptions.push(disposable)
}

// This method is called when your extension is deactivated
export function deactivate() {}
