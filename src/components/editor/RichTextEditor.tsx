import { useEffect } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'

type RichTextEditorProps = {
  valueHTML: string
  onChange: (html: string) => void
  onReady?: (editor: any) => void
  height?: string
}

export function RichTextEditor({ valueHTML, onChange, onReady, height = '60vh' }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: true,
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: true,
      }),
    ],
    content: valueHTML || '<p></p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none p-4 focus:outline-none min-h-[12rem]'
      }
    },
    onUpdate({ editor }) {
      const html = editor.getHTML()
      onChange(html)
    },
  })

  useEffect(() => {
    if (editor && onReady) {
      onReady(editor)
    }
  }, [editor, onReady])

  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    if (valueHTML !== current) {
      editor.commands.setContent(valueHTML || '<p></p>', false)
    }
  }, [valueHTML, editor])

  return (
    <div style={{ height }} className="bg-white">
      <div className="border-t border-gray-100">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}