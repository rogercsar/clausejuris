import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
// import { useNavigate } from 'react-router-dom' // Removido pois não está sendo usado
import { useAuth } from '@/hooks/useAuth'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { 
  FileText, 
  Zap,
  TrendingUp,
  BarChart,
  FolderOpen
} from 'lucide-react'
import { MonacoEditor } from '@/components/editor/MonacoEditor'
import { ContextSelector } from '@/components/editor/ContextSelector'
import { ContextInfo } from '@/components/editor/ContextInfo'
import { EditorToolbar } from '@/components/editor/EditorToolbar'
import { EnhancedLawsModal } from '@/components/editor/EnhancedLawsModal'
import { TemplatesModal } from '@/components/editor/TemplatesModal'
import { RecentLawsModal } from '@/components/editor/RecentLawsModal'
import { StatisticsModal } from '@/components/editor/StatisticsModal'
import { useClient } from '@/hooks/useClients'
import type { Process, Contract } from '@/types'
import { ensureClientFolder, saveClientFile, listClientFolders, type StoredFolder } from '@/services/storageService'
import { uploadToPJE } from '@/services/pjeService'
import { TranscriptionModal } from '@/components/editor/TranscriptionModal'
import { FolderSelectModal } from '@/components/editor/FolderSelectModal'

export function LegalEditor() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const [content, setContent] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [selectedContext, setSelectedContext] = useState<Process | Contract | null>(null)
  const [showLawsModal, setShowLawsModal] = useState(false)
  const [showTemplatesModal, setShowTemplatesModal] = useState(false)
  const [showRecentLawsModal, setShowRecentLawsModal] = useState(false)
  const [showStatisticsModal, setShowStatisticsModal] = useState(false)
  const [showTranscriptionModal, setShowTranscriptionModal] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [characterCount, setCharacterCount] = useState(0)
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(undefined)
  const [availableFolders, setAvailableFolders] = useState<StoredFolder[]>([])
  const [showFolderSelect, setShowFolderSelect] = useState(false)
  const [isUploadingPJE, setIsUploadingPJE] = useState(false)

  const isPro = user?.plan === 'pro'
  
  // Buscar dados do cliente se um contexto estiver selecionado
  const { data: client } = useClient(selectedContext?.clientId || '')

  // Load folder from URL params
  useEffect(() => {
    const folderId = searchParams.get('folderId')
    if (folderId) {
      setSelectedFolderId(folderId)
    }
  }, [searchParams])

  // Load available folders when context changes
  useEffect(() => {
    if (selectedContext?.clientId) {
      const folders = listClientFolders(selectedContext.clientId)
      setAvailableFolders(folders)
    }
  }, [selectedContext?.clientId])

  const handleContentChange = (value: string) => {
    setContent(value)
    
    // Calcular estatísticas
    const words = value.trim().split(/\s+/).filter(word => word.length > 0).length
    const characters = value.length
    setWordCount(words)
    setCharacterCount(characters)
    
    // Simular sugestões para usuários Pro baseadas no contexto
    if (isPro && value.length > 10) {
      // Aqui seria feita a chamada real para a API de sugestões
      const mockSuggestions = generateContextualSuggestions(value, selectedContext)
      setSuggestions(mockSuggestions)
    }
  }

  const generateContextualSuggestions = (_text: string, context: Process | Contract | null) => {
    const baseSuggestions = [
      {
        id: '1',
        type: 'autocomplete',
        text: 'contrato de locação',
        replacement: 'contrato de locação conforme art. 1.723 do Código Civil',
        description: 'Sugestão de texto jurídico',
        confidence: 0.9,
      },
      {
        id: '2',
        type: 'correction',
        text: 'contrato',
        replacement: 'contrato',
        description: 'Correção ortográfica',
        confidence: 0.8,
      },
    ]

    if (context) {
      const contextualSuggestions = []
      
      if ('status' in context) {
        // É um processo
        const process = context as Process
        contextualSuggestions.push({
          id: '3',
          type: 'snippet',
          text: 'cliente',
          replacement: process.clientName,
          description: `Nome do cliente: ${process.clientName}`,
          confidence: 0.95,
        })

        if (process.againstWho) {
          contextualSuggestions.push({
            id: '4',
            type: 'snippet',
            text: 'réu',
            replacement: process.againstWho,
            description: `Contra quem: ${process.againstWho}`,
            confidence: 0.95,
          })
        }

        if (process.lawyer) {
          contextualSuggestions.push({
            id: '5',
            type: 'snippet',
            text: 'advogado',
            replacement: process.lawyer,
            description: `Advogado responsável: ${process.lawyer}`,
            confidence: 0.95,
          })
        }

        if (process.caseNumber) {
          contextualSuggestions.push({
            id: '6',
            type: 'snippet',
            text: 'processo',
            replacement: process.caseNumber,
            description: `Número do processo: ${process.caseNumber}`,
            confidence: 0.95,
          })
        }
      } else {
        // É um contrato
        const contract = context as Contract
        contextualSuggestions.push({
          id: '7',
          type: 'snippet',
          text: 'cliente',
          replacement: contract.clientName,
          description: `Nome do cliente: ${contract.clientName}`,
          confidence: 0.95,
        })

        contextualSuggestions.push({
          id: '8',
          type: 'snippet',
          text: 'valor',
          replacement: `R$ ${contract.value.toLocaleString('pt-BR')}`,
          description: `Valor do contrato: R$ ${contract.value.toLocaleString('pt-BR')}`,
          confidence: 0.95,
        })
      }

      return [...baseSuggestions, ...contextualSuggestions]
    }

    return baseSuggestions
  }

  const handleSave = () => {
    // Salvar na pasta do cliente (stub localStorage)
    const context = selectedContext
    if (!context) {
      console.warn('Nenhum contexto selecionado para salvar')
      return
    }
    const clientId = context.clientId
    const clientName = context.clientName
    ensureClientFolder(clientId, clientName)
    const defaultName = `Documento_${new Date().toISOString().slice(0,10)}.txt`
    
    try {
      const savedFile = saveClientFile(clientId, clientName, {
        name: defaultName,
        mimeType: 'text/plain',
        content: content
      }, selectedFolderId)
      console.log('Arquivo salvo com sucesso:', savedFile)
      // Mostrar feedback visual de sucesso
      alert(`Documento salvo na pasta do cliente ${clientName}`)
    } catch (error) {
      console.error('Erro ao salvar arquivo:', error)
      alert('Erro ao salvar o documento. Tente novamente.')
    }
  }

  const handleUploadPJE = async () => {
    if (isUploadingPJE) return
    const context = selectedContext
    if (!context) {
      alert('Selecione um processo ou contrato antes de enviar ao PJe.')
      return
    }
    if (!content || content.trim().length === 0) {
      alert('O documento está vazio. Escreva algo antes de enviar ao PJe.')
      return
    }
    setIsUploadingPJE(true)
    try {
      const fileName = `Documento_${new Date().toISOString().slice(0,10)}.txt`
      const res = await uploadToPJE(context, fileName, content)
      if (res.success) {
        alert(`Enviado ao PJe com sucesso!\nProtocolo: ${res.protocol}`)
      } else {
        alert(res.message || 'Falha ao enviar ao PJe.')
      }
    } catch (e) {
      console.error(e)
      alert('Erro inesperado ao enviar ao PJe.')
    } finally {
      setIsUploadingPJE(false)
    }
  }

  const handleSuggestionAccept = (suggestion: any) => {
    // Implementar lógica para aceitar sugestão
    console.log('Aceitar sugestão:', suggestion)
  }

  const handleTemplateSelect = (templateContent: string) => {
    setContent(prev => prev + '\n\n' + templateContent)
  }

  const handleLawSelect = (lawContent: string) => {
    setContent(prev => prev + '\n\n' + lawContent)
  }

  // Funções para a barra de ferramentas
  const handleNewDocument = () => {
    setContent('')
    setSelectedContext(null)
    setSuggestions([])
  }

  const handleOpenDocument = () => {
    // Implementar abertura de documento
    console.log('Abrir documento')
  }

  const handleExportPDF = () => {
    // Implementar exportação PDF
    console.log('Exportar PDF')
  }

  const handleSearchLaws = () => {
    setShowLawsModal(true)
  }

  const handleOpenLawsLibrary = () => {
    setShowLawsModal(true)
  }

  const handleUndo = () => {
    const editor = (window as any).monacoEditor
    if (editor) {
      editor.trigger('keyboard', 'undo', {})
    }
  }

  const handleRedo = () => {
    const editor = (window as any).monacoEditor
    if (editor) {
      editor.trigger('keyboard', 'redo', {})
    }
  }

  const handleFormat = (format: string) => {
    const editor = (window as any).monacoEditor
    if (!editor) {
      console.warn('Editor não encontrado')
      return
    }

    const selection = editor.getSelection()
    if (!selection) {
      console.warn('Nenhuma seleção encontrada')
      return
    }

    const model = editor.getModel()
    if (!model) {
      console.warn('Modelo do editor não encontrado')
      return
    }

    const selectedText = model.getValueInRange(selection)
    let formattedText = selectedText

    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`
        break
      case 'italic':
        formattedText = `*${selectedText}*`
        break
      case 'underline':
        formattedText = `<u>${selectedText}</u>`
        break
      case 'alignLeft':
        formattedText = `<div style="text-align: left;">${selectedText}</div>`
        break
      case 'alignCenter':
        formattedText = `<div style="text-align: center;">${selectedText}</div>`
        break
      case 'alignRight':
        formattedText = `<div style="text-align: right;">${selectedText}</div>`
        break
      case 'bulletList':
        formattedText = `• ${selectedText}`
        break
      case 'numberedList':
        formattedText = `1. ${selectedText}`
        break
      case 'quote':
        formattedText = `> ${selectedText}`
        break
      default:
        console.warn('Formato não reconhecido:', format)
        return
    }

    // Executar a edição
    editor.executeEdits('format', [{
      range: selection,
      text: formattedText,
      forceMoveMarkers: true
    }])

    // Atualizar a seleção para incluir o texto formatado
    const newRange = {
      startLineNumber: selection.startLineNumber,
      startColumn: selection.startColumn,
      endLineNumber: selection.endLineNumber,
      endColumn: selection.startColumn + formattedText.length
    }
    
    editor.setSelection(newRange)
    editor.focus()
  }


  const handleInsertLaw = (lawContent: string) => {
    setContent(prev => prev + '\n\n' + lawContent)
    setShowLawsModal(false)
  }

  const handleOpenTemplates = () => {
    setShowTemplatesModal(true)
  }

  const handleOpenRecentLaws = () => {
    setShowRecentLawsModal(true)
  }

  const handleOpenStatistics = () => {
    setShowStatisticsModal(true)
  }

  const handleOpenTranscription = () => {
    setShowTranscriptionModal(true)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Editor Area - Takes more space */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Context Selector - Compact */}
          <div className="bg-white border-b border-gray-200 px-4 py-3">
            <ContextSelector
              selectedContext={selectedContext}
              onContextSelect={setSelectedContext}
            />
            {/* Folder Selection */}
            {selectedContext && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Pasta de destino</span>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setShowFolderSelect(true)}>
                    Selecionar pasta
                  </Button>
                </div>
                {availableFolders.length > 0 && (
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedFolderId || ''}
                      onChange={(e) => setSelectedFolderId(e.target.value || undefined)}
                      className="w-full text-sm border border-blue-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">📁 Pasta Principal</option>
                      {availableFolders.map((folder) => (
                        <option key={folder.id} value={folder.id}>
                          📁 {folder.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <p className="text-xs text-blue-600 mt-1">
                  {selectedFolderId
                    ? `Salvando em: ${availableFolders.find(f => f.id === selectedFolderId)?.name || 'Pasta selecionada'}`
                    : 'Salvando na Pasta Principal'}
                </p>
              </div>
            )}
          </div>

          {/* Editor Container */}
          <div className="flex flex-col bg-white">
            {/* Document Header - Compact */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <h1 className="text-lg font-semibold text-gray-900">Documento Jurídico</h1>
                  {selectedContext && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {selectedContext.clientName}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{wordCount} palavras</span>
                  <span>{characterCount} caracteres</span>
                  {isPro && (
                    <div className="flex items-center gap-1 text-blue-600">
                      <Zap className="w-4 h-4" />
                      <span>IA Ativa</span>
                    </div>
                  )}
                </div>
              </div>
              {selectedContext && (
                <p className="text-sm text-blue-600 mt-1">
                  Sugestões personalizadas baseadas no contexto selecionado
                </p>
              )}
            </div>
            
            {/* Toolbar - Integrated */}
            <div className="px-6 py-3 border-b border-gray-200 bg-white">
              <EditorToolbar
                onSave={handleSave}
              onUploadPJE={handleUploadPJE}
              onOpenTranscription={handleOpenTranscription}
                onNewDocument={handleNewDocument}
                onOpenDocument={handleOpenDocument}
                onExportPDF={handleExportPDF}
                onSearchLaws={handleSearchLaws}
                onOpenLawsLibrary={handleOpenLawsLibrary}
                onOpenTemplates={handleOpenTemplates}
                onOpenRecentLaws={handleOpenRecentLaws}
                onOpenStatistics={handleOpenStatistics}
              onInsert={() => {}}
                onUndo={handleUndo}
                onRedo={handleRedo}
                onFormat={handleFormat}
                isPro={isPro}
                contextName={selectedContext?.clientName}
                wordCount={wordCount}
                characterCount={characterCount}
              />
            </div>

            {/* Editor */}
            <div className="p-6">
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                <MonacoEditor
                  value={content}
                  onChange={handleContentChange}
                  isPro={isPro}
                  suggestions={suggestions}
                  onSuggestionAccept={handleSuggestionAccept}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Responsive */}
        <div className="w-full lg:w-96 bg-white flex flex-col border-t lg:border-t-0 lg:border-l border-gray-200">
          <div>
            <div className="p-6 space-y-6">
              {/* Context Information */}
              <ContextInfo context={selectedContext} client={client || null} />

              {/* Pro Features - Only AI Suggestions */}
              {isPro && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">Sugestões de IA</h3>
                  </div>
                  <p className="text-sm text-blue-700 mb-4">
                    Sugestões inteligentes baseadas no contexto
                  </p>
                  {suggestions.length > 0 ? (
                    <div className="space-y-2">
                      {suggestions.slice(0, 3).map((suggestion) => (
                        <div
                          key={suggestion.id}
                          className="p-3 bg-white rounded-md cursor-pointer hover:bg-blue-50 transition-colors border border-blue-100"
                          onClick={() => handleSuggestionAccept(suggestion)}
                        >
                          <div className="text-sm font-medium text-gray-900">{suggestion.text}</div>
                          <div className="text-xs text-gray-600 mt-1">{suggestion.description}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-blue-600 text-center py-4 bg-white rounded-md border border-blue-100">
                      Digite para receber sugestões inteligentes
                    </div>
                  )}
                </div>
              )}

              {/* Quick Actions */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Ações Rápidas</h3>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start h-10 text-left"
                    onClick={handleOpenTemplates}
                  >
                    <FileText className="w-4 h-4 mr-3" />
                    Modelos Jurídicos
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start h-10 text-left"
                    onClick={handleOpenRecentLaws}
                  >
                    <TrendingUp className="w-4 h-4 mr-3" />
                    Leis Recentes
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start h-10 text-left"
                    onClick={handleOpenStatistics}
                  >
                    <BarChart className="w-4 h-4 mr-3" />
                    Estatísticas
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EnhancedLawsModal
        isOpen={showLawsModal}
        onClose={() => setShowLawsModal(false)}
        onInsertLaw={handleInsertLaw}
        context={selectedContext}
      />
      
      <TemplatesModal
        isOpen={showTemplatesModal}
        onClose={() => setShowTemplatesModal(false)}
        onTemplateSelect={handleTemplateSelect}
        context={selectedContext}
      />
      
      <RecentLawsModal
        isOpen={showRecentLawsModal}
        onClose={() => setShowRecentLawsModal(false)}
        onLawSelect={handleLawSelect}
        context={selectedContext}
      />
      
      <StatisticsModal
        isOpen={showStatisticsModal}
        onClose={() => setShowStatisticsModal(false)}
        wordCount={wordCount}
        characterCount={characterCount}
        context={selectedContext}
      />

      <TranscriptionModal
        isOpen={showTranscriptionModal}
        onClose={() => setShowTranscriptionModal(false)}
        onTranscribed={(text) => setContent(prev => prev + '\n\n' + text)}
      />

      {selectedContext && (
        <FolderSelectModal
          isOpen={showFolderSelect}
          onClose={() => setShowFolderSelect(false)}
          clientId={selectedContext.clientId}
          selectedFolderId={selectedFolderId}
          onSelect={(folderId) => setSelectedFolderId(folderId)}
        />
      )}
    </div>
  )
}
