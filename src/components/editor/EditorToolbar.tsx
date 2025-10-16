import { useState } from 'react'
import { 
  Save, 
  FileText, 
  BookOpen, 
  Search, 
  Download, 
  Upload, 
  Undo, 
  Redo, 
  Bold, 
  Italic, 
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Link,
  Image,
  Table,
  Heading1,
  Heading2,
  Heading3,
  Eraser,
  MoreHorizontal,
  Settings,
  HelpCircle,
  TrendingUp,
  BarChart,
  Mic
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'

interface EditorToolbarProps {
  onSave: () => void
  onUploadPJE?: () => void
  onOpenTranscription?: () => void
  onNewDocument: () => void
  onOpenDocument: () => void
  onExportPDF: () => void
  onSearchLaws: () => void
  onOpenLawsLibrary: () => void
  onOpenTemplates: () => void
  onOpenRecentLaws: () => void
  onOpenStatistics: () => void
  onUndo: () => void
  onRedo: () => void
  onFormat: (format: string) => void
  onInsert: (type: string) => void
  isPro: boolean
  contextName?: string
  wordCount: number
  characterCount: number
}

export function EditorToolbar({
  onSave,
  onUploadPJE,
  onOpenTranscription,
  onNewDocument,
  onOpenDocument,
  onExportPDF,
  onSearchLaws,
  onOpenTemplates,
  onOpenRecentLaws,
  onOpenStatistics,
  onUndo,
  onRedo,
  onFormat,
  onInsert,
  isPro,
  contextName,
}: EditorToolbarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      onSearchLaws()
    }
  }

  return (
    <div className="px-0 py-0">
      {/* First Row - File Operations and Search */}
      <div className="flex flex-wrap items-center gap-2 justify-between mb-2">
        {/* Left Section - File Operations */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Arquivo
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={onNewDocument}>
                <FileText className="w-4 h-4 mr-2" />
                Novo Documento
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onOpenDocument}>
                <Upload className="w-4 h-4 mr-2" />
                Abrir Documento
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onSave}>
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExportPDF}>
                <Download className="w-4 h-4 mr-2" />
                Exportar PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Edit Operations */}
          <div className="flex items-center gap-1 border-l border-secondary-200 pl-2">
            <Button variant="ghost" size="sm" onClick={onUndo}>
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onRedo}>
              <Redo className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="order-last w-full md:order-none md:flex-1 md:max-w-md mx-0 md:mx-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
            <Input
              placeholder="Pesquisar leis e artigos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
            />
          </form>
        </div>

        {/* Right Section - Tools and Info */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Primary Actions */}
          <Button variant="default" size="sm" onClick={onSave} title="Salvar">
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
          <Button variant="outline" size="sm" onClick={onExportPDF} title="Exportar PDF">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>

          {/* Laws Library - Now opens modal instead of navigating */}
          <Button variant="outline" size="sm" onClick={onSearchLaws}>
            <BookOpen className="w-4 h-4 mr-2" />
            Leis
          </Button>

          {/* Search Laws */}
          <Button variant="outline" size="sm" onClick={onSearchLaws}>
            <Search className="w-4 h-4 mr-2" />
            Buscar
          </Button>

          {/* Templates */}
          {isPro && (
            <Button variant="outline" size="sm" onClick={onOpenTemplates}>
              <FileText className="w-4 h-4 mr-2" />
              Modelos
            </Button>
          )}

          {/* Upload to PJe */}
          {onUploadPJE && (
            <Button variant="outline" size="sm" onClick={onUploadPJE}>
              <Upload className="w-4 h-4 mr-2" />
              Enviar PJe
            </Button>
          )}

          {/* Transcription */}
          {onOpenTranscription && (
            <Button variant="outline" size="sm" onClick={onOpenTranscription}>
              <Mic className="w-4 h-4 mr-2" />
              Transcrever
            </Button>
          )}

          {/* Recent Laws */}
          {isPro && (
            <Button variant="outline" size="sm" onClick={onOpenRecentLaws}>
              <TrendingUp className="w-4 h-4 mr-2" />
              Leis Recentes
            </Button>
          )}

          {/* Context Info */}
          {contextName && (
            <Badge variant="outline" className="text-xs">
              {contextName}
            </Badge>
          )}

          {/* More Options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="w-4 h-4 mr-2" />
                Ajuda
              </DropdownMenuItem>
              {!isPro && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Badge variant="outline" className="mr-2">PRO</Badge>
                    Fazer Upgrade
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Second Row - Formatting Tools */}
      <div className="flex items-center flex-wrap gap-2 overflow-x-auto md:overflow-visible py-1 -mx-2 px-2">
        {/* Formatting Tools */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => onFormat('bold')} title="Negrito">
            <Bold className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onFormat('italic')} title="Itálico">
            <Italic className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onFormat('underline')} title="Sublinhado">
            <Underline className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onFormat('clearFormatting')} title="Limpar formatação">
            <Eraser className="w-4 h-4" />
          </Button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 border-l border-secondary-200 pl-2">
          <Button variant="ghost" size="sm" onClick={() => onFormat('heading1')} title="Título 1">
            <Heading1 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onFormat('heading2')} title="Título 2">
            <Heading2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onFormat('heading3')} title="Título 3">
            <Heading3 className="w-4 h-4" />
          </Button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 border-l border-secondary-200 pl-2">
          <Button variant="ghost" size="sm" onClick={() => onFormat('alignLeft')} title="Alinhar à esquerda">
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onFormat('alignCenter')} title="Centralizar">
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onFormat('alignRight')} title="Alinhar à direita">
            <AlignRight className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onFormat('alignJustify')} title="Justificar">
            <AlignJustify className="w-4 h-4" />
          </Button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 border-l border-secondary-200 pl-2">
          <Button variant="ghost" size="sm" onClick={() => onFormat('bulletList')} title="Lista com marcadores">
            <List className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onFormat('numberedList')} title="Lista numerada">
            <ListOrdered className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onFormat('quote')} title="Citação">
            <Quote className="w-4 h-4" />
          </Button>
        </div>

        {/* Insert Tools */}
        <div className="flex items-center gap-1 border-l border-secondary-200 pl-2">
          <Button variant="ghost" size="sm" onClick={() => onInsert('link')} title="Inserir link">
            <Link className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onInsert('image')} title="Inserir imagem">
            <Image className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onInsert('table')} title="Inserir tabela">
            <Table className="w-4 h-4" />
          </Button>
        </div>

        {/* Statistics */}
        <div className="flex items-center gap-1 border-l border-secondary-200 pl-2">
          <Button variant="outline" size="sm" onClick={onOpenStatistics} title="Estatísticas">
            <BarChart className="w-4 h-4 mr-2" />
            Estatísticas
          </Button>
        </div>
      </div>
    </div>
  )
}
