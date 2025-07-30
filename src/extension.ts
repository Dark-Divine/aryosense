import * as vscode from 'vscode'

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

  const globalWordProvider = vscode.languages.registerCompletionItemProvider(['lua', 'luau'], {
    provideCompletionItems(document, position) {
      const wordRange = document.getWordRangeAtPosition(position)
      const word = wordRange ? document.getText(wordRange) : ''

      const keywords = [
        {
          label: 'local',
          kind: vscode.CompletionItemKind.Keyword,
          doc: 'This is a local variable defined with `local`.',
        },
        {
          label: 'math',
          kind: vscode.CompletionItemKind.Module,
          doc: 'This library is an interface to the standard C math library, providing all of its functions inside the math table.',
        },
        { label: 'script', kind: vscode.CompletionItemKind.Property, doc: 'Current script reference' },
        {
          label: 'workspace',
          kind: vscode.CompletionItemKind.Property,
          doc: 'A reference to the Workspace service, which contains all of the physical components of a Aryosense Studio world.',
        },
        { label: 'game', kind: vscode.CompletionItemKind.Property, doc: 'Top-level game object' },
        {
          label: 'time',
          kind: vscode.CompletionItemKind.Function,
          doc: 'Returns the amount of time, in seconds, that has elapsed since the current game instance started running. If the current game instance is not running, this will be 0.',
        },
        {
          label: 'for',
          kind: vscode.CompletionItemKind.Keyword,
          doc: 'Returns the amount of time, in seconds, that has elapsed since the current game instance started running. If the current game instance is not running, this will be 0.',
        },
        {
          label: 'in',
          kind: vscode.CompletionItemKind.Keyword,
          doc: 'Returns the amount of time, in seconds, that has elapsed since the current game instance started running. If the current game instance is not running, this will be 0.',
        },
        {
          label: 'in',
          kind: vscode.CompletionItemKind.Keyword,
          doc: 'Returns the amount of time, in seconds, that has elapsed since the current game instance started running. If the current game instance is not running, this will be 0.',
        },
      ]
      return keywords
        .filter((k) => k.label.startsWith(word))
        .map((k) => {
          const item = new vscode.CompletionItem(k.label, k.kind)
          item.documentation = new vscode.MarkdownString(k.doc)
          item.sortText = '0000'
          return item
        })
    },
  })

  const objectDotProvider = vscode.languages.registerCompletionItemProvider(
    ['lua', 'luau'],
    {
      provideCompletionItems(document, position) {
        const line = document.lineAt(position).text.substring(0, position.character)

        const match = line.match(/(\w+)(\.\w+)*\.$/)
        if (!match) return undefined

        const objectName = match[1] // مثلا "script" یا "workspace"

        const suggestions: Record<string, [string, string, string][]> = {
          script: [
            ['Parent', 'The parent object', 'Refers to the parent of the instance.'],
            ['Name', 'The name of the object', 'Returns or sets the Name property.'],
          ],
          workspace: [
            ['FindFirstChild', 'Find child by name', 'Returns the first child with the given name.'],
            ['GetChildren', 'Get child instances', 'Returns an array of direct children.'],
            ['GetDescendants', 'Get all nested instances', 'Returns all descendants recursively.'],
          ],
          player: [
            ['Kick', 'Kick player', 'Removes the player from the game.'],
            ['LoadCharacter', 'Load character', 'Reloads the player’s character.'],
          ],
        }

        const rawList = suggestions[objectName]
        if (!rawList) return undefined

        return rawList.map(([label, detail, doc]) => {
          const item = new vscode.CompletionItem(label, vscode.CompletionItemKind.Method)
          item.sortText = '0000'
          item.detail = detail
          item.documentation = new vscode.MarkdownString(doc)
          return item
        })
      },
    },
    '.'
  )

  const objectColonProvider = vscode.languages.registerCompletionItemProvider(
    ['lua', 'luau'],
    {
      provideCompletionItems(document, position) {
        const line = document.lineAt(position).text.substring(0, position.character)

        const match = line.match(/(\w+)(\.\w+)*:$/)
        if (!match) return undefined

        const objectName = match[1]

        const methodMap: Record<string, { label: string; detail: string; documentation: string }[]> = {
          script: [
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
          ],
          workspace: [
            {
              label: 'FindFirstChild',
              detail: 'Finds child by name',
              documentation: 'Returns first child matching the given name.',
            },
            {
              label: 'WaitForChild',
              detail: 'Waits for a child to appear',
              documentation: 'Useful for async loading of child instances.',
            },
            {
              label: 'IsAncestorOf',
              detail: 'Checks ancestor relationship',
              documentation: 'Returns true if this is an ancestor of the given descendant.',
            },
          ],
          player: [
            {
              label: 'Kick',
              detail: 'Kicks the player',
              documentation: 'Removes the player from the game.',
            },
            {
              label: 'LoadCharacter',
              detail: 'Loads player’s character',
              documentation: 'Reloads the character of the player.',
            },
          ],
        }

        const methods = methodMap[objectName]
        if (!methods) return undefined

        return methods.map((m) => {
          const item = new vscode.CompletionItem(m.label, vscode.CompletionItemKind.Method)
          item.sortText = '0000'
          item.detail = m.detail
          item.documentation = new vscode.MarkdownString(m.documentation)
          return item
        })
      },
    },
    ':'
  )

  context.subscriptions.push(globalWordProvider)
  context.subscriptions.push(objectColonProvider)
  context.subscriptions.push(rootScriptProvider, objectDotProvider)
}

export function deactivate() {}
