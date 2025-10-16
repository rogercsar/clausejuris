import { useRef } from 'react'
import { Editor } from '@monaco-editor/react'
import type { EditorSuggestion } from '@/types'

interface MonacoEditorProps {
  value: string
  onChange: (value: string) => void
  isPro: boolean
  suggestions?: EditorSuggestion[]
  onSuggestionAccept?: (suggestion: EditorSuggestion) => void
}

export function MonacoEditor({ 
  value, 
  onChange, 
  isPro, 
  suggestions = []
}: MonacoEditorProps) {
  const editorRef = useRef<any>(null)

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor
    // Expor editor globalmente para formatação
    ;(window as any).monacoEditor = editor

    // Configurações específicas para texto jurídico
    editor.updateOptions({
      wordWrap: 'on',
      lineNumbers: 'on',
      minimap: { enabled: false },
      fontSize: 14,
      fontFamily: 'Consolas, "Courier New", monospace',
      lineHeight: 1.5,
      padding: { top: 16, bottom: 16 },
    })

    // Configurar tema personalizado
    monaco.editor.defineTheme('legal-theme', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955' },
        { token: 'keyword', foreground: '0000FF' },
        { token: 'string', foreground: 'A31515' },
        { token: 'number', foreground: '098658' },
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#000000',
        'editorLineNumber.foreground': '#999999',
        'editorLineNumber.activeForeground': '#000000',
      },
    })

    monaco.editor.setTheme('legal-theme')

    // Configurar sugestões para usuários Pro
    if (isPro) {
      monaco.languages.registerCompletionItemProvider('plaintext', {
        provideCompletionItems: (model: any, position: any) => {
          const word = model.getWordUntilPosition(position)
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          }

          const completionItems = suggestions.map((suggestion) => ({
            label: suggestion.text,
            kind: suggestion.type === 'autocomplete' ? monaco.languages.CompletionItemKind.Snippet : monaco.languages.CompletionItemKind.Text,
            insertText: suggestion.replacement || suggestion.text,
            range: range,
            detail: suggestion.description,
            documentation: suggestion.description,
            sortText: suggestion.confidence.toString(),
          }))

          return { suggestions: completionItems }
        },
      })
    }

    // Adicionar atalhos de teclado
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Salvar documento
      console.log('Salvando documento...')
    })

    if (isPro) {
      // Atalho para sugestões (Ctrl+Space)
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space, () => {
        editor.trigger('editor', 'editor.action.triggerSuggest', {})
      })
    }
  }

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value)
    }
  }

  return (
    <div className="h-full">
      <Editor
        height="60vh"
        defaultLanguage="plaintext"
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: false,
          cursorStyle: 'line',
          automaticLayout: true,
          scrollBeyondLastLine: false,
          renderWhitespace: 'selection',
          renderControlCharacters: true,
          showFoldingControls: 'always',
          folding: true,
          foldingStrategy: 'indentation',
          showUnused: true,
          wordBasedSuggestions: 'matchingDocuments',
          quickSuggestions: isPro,
          suggestOnTriggerCharacters: isPro,
          acceptSuggestionOnEnter: 'on',
          tabCompletion: isPro ? 'on' : 'off',
          wordWrap: 'on',
          wrappingIndent: 'indent',
          lineNumbers: 'on',
          glyphMargin: true,
          contextmenu: true,
          mouseWheelZoom: true,
          multiCursorModifier: 'ctrlCmd',
          formatOnPaste: true,
          formatOnType: true,
          padding: { top: 16, bottom: 16 },
        }}
      />
    </div>
  )
}

