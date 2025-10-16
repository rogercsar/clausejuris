import { useState, useEffect } from 'react'
import { Search, BookOpen, FileText, Copy, Check, Plus, Upload, Download, Trash2, Scale } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog'
import { searchLaws, searchArticles, lawsDatabase, type Law, type LawArticle } from '@/data/laws'
import { JurisprudenceTimelineModal } from '@/components/jurisprudence/JurisprudenceTimeline'
import type { Process, Contract } from '@/types'

interface EnhancedLawsModalProps {
  isOpen: boolean
  onClose: () => void
  onInsertLaw: (content: string) => void
  context?: Process | Contract | null
}

interface CustomLaw {
  id: string
  name: string
  shortName: string
  category: string
  year: string
  description: string
  sourceUrl?: string
  articles: LawArticle[]
  isCustom: boolean
}

export function EnhancedLawsModal({ isOpen, onClose, onInsertLaw, context }: EnhancedLawsModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedType, setSelectedType] = useState<string>('')
  const [laws, setLaws] = useState<Law[]>([])
  const [customLaws, setCustomLaws] = useState<CustomLaw[]>([])
  const [articles, setArticles] = useState<LawArticle[]>([])
  const [selectedLaw, setSelectedLaw] = useState<Law | CustomLaw | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'library' | 'custom' | 'context' | 'jurisprudence'>('library')
  const [showAddLawForm, setShowAddLawForm] = useState(false)
  const [showJurisprudenceModal, setShowJurisprudenceModal] = useState(false)
  const [newLaw, setNewLaw] = useState({
    name: '',
    shortName: '',
    category: '',
    year: new Date().getFullYear().toString(),
    description: '',
    sourceUrl: ''
  })
  const [previewArticleId, setPreviewArticleId] = useState<string | null>(null)

  const categories = [
    { value: '', label: 'Todas as categorias' },
    { value: 'civil', label: 'Civil' },
    { value: 'criminal', label: 'Criminal' },
    { value: 'labor', label: 'Trabalhista' },
    { value: 'administrative', label: 'Administrativo' },
    { value: 'constitutional', label: 'Constitucional' },
    { value: 'commercial', label: 'Comercial' },
    { value: 'family', label: 'Família' },
    { value: 'tax', label: 'Tributário' }
  ]

  const types = [
    { value: '', label: 'Todos os tipos' },
    { value: 'federal', label: 'Federal' },
    { value: 'estadual', label: 'Estadual' },
    { value: 'municipal', label: 'Municipal' },
    { value: 'constitutional', label: 'Constitucional' }
  ]

  // Load custom laws from localStorage
  useEffect(() => {
    const savedCustomLaws = localStorage.getItem('customLaws')
    if (savedCustomLaws) {
      setCustomLaws(JSON.parse(savedCustomLaws))
    }
  }, [])

  // Save custom laws to localStorage
  useEffect(() => {
    if (customLaws.length > 0) {
      localStorage.setItem('customLaws', JSON.stringify(customLaws))
    }
  }, [customLaws])

  useEffect(() => {
    if (isOpen) {
      const results = searchLaws(searchQuery, selectedCategory, selectedType)
      setLaws(results)
    }
  }, [isOpen, searchQuery, selectedCategory, selectedType])

  useEffect(() => {
    if (selectedLaw) {
      const results = searchArticles(searchQuery, selectedLaw.id)
      setArticles(results)
    } else {
      const results = searchArticles(searchQuery)
      setArticles(results)
    }
  }, [selectedLaw, searchQuery])

  useEffect(() => {
    if (articles.length === 0) {
      setPreviewArticleId(null)
      return
    }
    if (!previewArticleId || !articles.some(a => a.id === previewArticleId)) {
      setPreviewArticleId(articles[0].id)
    }
  }, [articles])

  // Get context-related laws
  const getContextLaws = () => {
    if (!context) return []
    
    const contextKeywords: string[] = []
    if ('status' in context) {
      // Process context
      contextKeywords.push('processo', 'ação', 'procedimento')
      if ((context as Process).status === 'in_progress') contextKeywords.push('urgente', 'medida cautelar')
    } else {
      // Contract context
      contextKeywords.push('contrato', 'obrigação', 'responsabilidade')
    }
    
    // Filter laws based on context keywords
    return [...laws, ...customLaws].filter(law => 
      contextKeywords.some(keyword => 
        law.name.toLowerCase().includes(keyword) ||
        law.description.toLowerCase().includes(keyword) ||
        law.category.toLowerCase().includes(keyword)
      )
    )
  }

  const handleLawSelect = (law: Law | CustomLaw) => {
    setSelectedLaw(law)
    setPreviewArticleId(null)
  }

  const handleArticleInsert = (article: LawArticle) => {
    onInsertLaw(article.content)
    onClose()
  }

  const handleCopy = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Erro ao copiar:', err)
    }
  }

  const handleAddCustomLaw = () => {
    if (newLaw.name && newLaw.shortName && newLaw.category) {
      const customLaw: CustomLaw = {
        id: `custom-${Date.now()}`,
        name: newLaw.name,
        shortName: newLaw.shortName,
        category: newLaw.category,
        year: newLaw.year,
        description: newLaw.description,
        sourceUrl: newLaw.sourceUrl?.trim() ? newLaw.sourceUrl.trim() : undefined,
        articles: [],
        isCustom: true
      }
      
      setCustomLaws(prev => [...prev, customLaw])
      setNewLaw({
        name: '',
        shortName: '',
        category: '',
        year: new Date().getFullYear().toString(),
        description: '',
        sourceUrl: ''
      })
      setShowAddLawForm(false)
    }
  }

  const handleDeleteCustomLaw = (lawId: string) => {
    setCustomLaws(prev => prev.filter(law => law.id !== lawId))
    if (selectedLaw?.id === lawId) {
      setSelectedLaw(null)
    }
  }

  const handleImportLaws = () => {
    // Create file input for import
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const importedLaws = JSON.parse(e.target?.result as string)
            setCustomLaws(prev => [...prev, ...importedLaws])
          } catch (err) {
            console.error('Erro ao importar leis:', err)
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const handleExportLaws = () => {
    const dataStr = JSON.stringify(customLaws, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = 'custom-laws.json'
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      civil: 'bg-blue-100 text-blue-800',
      criminal: 'bg-red-100 text-red-800',
      labor: 'bg-green-100 text-green-800',
      administrative: 'bg-yellow-100 text-yellow-800',
      constitutional: 'bg-purple-100 text-purple-800',
      commercial: 'bg-orange-100 text-orange-800',
      family: 'bg-pink-100 text-pink-800',
      tax: 'bg-gray-100 text-gray-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getCurrentLaws = () => {
    switch (activeTab) {
      case 'library':
        return laws
      case 'custom':
        return customLaws
      case 'context':
        return getContextLaws()
      case 'jurisprudence':
        return [] // Jurisprudências são exibidas em modal separado
      default:
        return laws
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto overflow-x-hidden p-6 sm:p-8 rounded-xl">
        <DialogHeader>
          <DialogTitle>
            <BookOpen className="w-5 h-5" />
            Biblioteca de Leis
            {context && (
              <Badge variant="outline" className="ml-2">
                {context.clientName}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Pesquise, gerencie e insira artigos de lei em seu documento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tabs */}
          <div className="flex gap-3 border-b border-secondary-200 pb-1">
            <button
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'library' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-secondary-600 hover:text-secondary-900'
              }`}
              onClick={() => setActiveTab('library')}
            >
              Biblioteca
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'custom' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-secondary-600 hover:text-secondary-900'
              }`}
              onClick={() => setActiveTab('custom')}
            >
              Minhas Leis
            </button>
            {context && (
              <button
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'context' 
                    ? 'border-primary-500 text-primary-600' 
                    : 'border-transparent text-secondary-600 hover:text-secondary-900'
                }`}
                onClick={() => setActiveTab('context')}
              >
                Relacionadas ao Contexto
              </button>
            )}
            <button
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'jurisprudence' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-secondary-600 hover:text-secondary-900'
              }`}
              onClick={() => setActiveTab('jurisprudence')}
            >
              <Scale className="w-4 h-4 mr-1" />
              Jurisprudências
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
              <Input
                placeholder="Pesquisar leis e artigos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-secondary-300 rounded-md text-sm"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-secondary-300 rounded-md text-sm"
            >
              {types.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Laws Actions */}
          {activeTab === 'custom' && (
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setShowAddLawForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Lei
              </Button>
              <Button size="sm" variant="outline" onClick={handleImportLaws}>
                <Upload className="w-4 h-4 mr-2" />
                Importar
              </Button>
              <Button size="sm" variant="outline" onClick={handleExportLaws}>
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          )}

          {/* Add Law Form */}
          {showAddLawForm && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Adicionar Nova Lei</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <Input
                    placeholder="Nome da lei"
                    value={newLaw.name}
                    onChange={(e) => setNewLaw(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Input
                    placeholder="Nome abreviado"
                    value={newLaw.shortName}
                    onChange={(e) => setNewLaw(prev => ({ ...prev, shortName: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <select
                    value={newLaw.category}
                    onChange={(e) => setNewLaw(prev => ({ ...prev, category: e.target.value }))}
                    className="px-3 py-2 border border-secondary-300 rounded-md text-sm"
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.slice(1).map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  <Input
                    placeholder="Ano"
                    value={newLaw.year}
                    onChange={(e) => setNewLaw(prev => ({ ...prev, year: e.target.value }))}
                  />
                </div>
                <Input
                  placeholder="Descrição"
                  value={newLaw.description}
                  onChange={(e) => setNewLaw(prev => ({ ...prev, description: e.target.value }))}
                />
                <Input
                  placeholder="Fonte oficial (URL)"
                  type="url"
                  value={newLaw.sourceUrl}
                  onChange={(e) => setNewLaw(prev => ({ ...prev, sourceUrl: e.target.value }))}
                />
                <div className="flex gap-3">
                  <Button onClick={handleAddCustomLaw}>
                    Adicionar
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddLawForm(false)}>
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Laws List */}
            <div className="space-y-3">
              <h3 className="font-medium text-secondary-900">
                {activeTab === 'library' && 'Leis da Biblioteca'}
                {activeTab === 'custom' && 'Minhas Leis'}
                {activeTab === 'context' && 'Leis Relacionadas'}
                {activeTab === 'jurisprudence' && 'Jurisprudências'}
              </h3>
              {activeTab === 'jurisprudence' ? (
                <Card className="p-6 text-center">
                  <Scale className="w-12 h-12 mx-auto mb-4 text-primary-600" />
                  <h4 className="font-medium mb-2">Timeline de Jurisprudências</h4>
                  <p className="text-sm text-secondary-600 mb-4">
                    Explore decisões judiciais e sua evolução ao longo do tempo
                  </p>
                  <Button onClick={() => setShowJurisprudenceModal(true)}>
                    <Scale className="w-4 h-4 mr-2" />
                    Abrir Timeline
                  </Button>
                </Card>
              ) : (
                getCurrentLaws().map((law) => (
                <Card 
                  key={law.id} 
                  className={`cursor-pointer transition-colors ${
                    selectedLaw?.id === law.id ? 'ring-2 ring-primary-500' : 'hover:bg-secondary-50'
                  }`}
                  onClick={() => handleLawSelect(law)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-sm">{law.shortName}</h4>
                        <p className="text-xs text-secondary-600">{law.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${getCategoryColor(law.category)}`}>
                          {law.category}
                        </Badge>
                        {('isCustom' in law && law.isCustom) && (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteCustomLaw(law.id)
                              }}
                            >
                              <Trash2 className="w-3 h-3 text-red-500" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-secondary-500">{law.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-secondary-400">{law.year}</span>
                      <span className="text-xs text-secondary-400">•</span>
                      <span className="text-xs text-secondary-400">{law.articles.length} artigos</span>
                    </div>
                  </CardContent>
                </Card>
                ))
              )}
            </div>

            {/* Articles List */}
            <div className="space-y-3">
              <h3 className="font-medium text-secondary-900">Artigos</h3>
              {articles.map((article) => (
                <Card key={article.id} className={`transition-colors cursor-pointer ${previewArticleId === article.id ? 'ring-2 ring-primary-500' : 'hover:bg-secondary-50'}`} onClick={() => setPreviewArticleId(article.id)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{article.number}</h4>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy(article.content, article.id)}
                        >
                          {copiedId === article.id ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleArticleInsert(article)}
                        >
                          <FileText className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-secondary-900 mb-1">{article.title}</p>
                    <p className="text-xs text-secondary-600 line-clamp-2">
                      {article.content.substring(0, 100)}...
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {article.keywords.slice(0, 3).map((keyword) => (
                        <Badge key={keyword} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Article Preview */}
            <div className="space-y-3">
              <h3 className="font-medium text-secondary-900">Visualização</h3>
              {articles.length > 0 && previewArticleId ? (
                <Card>
                  <CardContent className="p-6">
                    {(() => {
                      const current = articles.find(a => a.id === previewArticleId) as LawArticle | undefined
                      if (!current) return null
                      return (
                        <>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">{current.number}</h4>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCopy(current.content, current.id)}
                            >
                              {copiedId === current.id ? (
                                <Check className="w-3 h-3 text-green-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleArticleInsert(current)}
                            >
                              Inserir
                            </Button>
                          </div>
                        </div>
                        <h5 className="font-medium text-sm mb-2">{current.title}</h5>
                        <div className="text-sm text-secondary-700 whitespace-pre-wrap">
                          {current.content}
                        </div>
                        {current.relatedArticles && current.relatedArticles.length > 0 && (
                          <div className="mt-4">
                            <div className="text-xs text-secondary-500 mb-2">Artigos relacionados</div>
                            <div className="flex flex-wrap gap-2">
                              {current.relatedArticles.map((relId) => {
                                const targetLaw = lawsDatabase.find(l => l.articles.some(a => a.id === relId))
                                const targetArticle = targetLaw?.articles.find(a => a.id === relId)
                                if (!targetLaw || !targetArticle) return null
                                return (
                                  <Badge
                                    key={relId}
                                    variant="outline"
                                    className="cursor-pointer hover:bg-secondary-100"
                                    onClick={() => {
                                      setSelectedLaw(targetLaw)
                                      setSearchQuery('')
                                      setTimeout(() => setPreviewArticleId(relId), 0)
                                    }}
                                  >
                                    {targetLaw.shortName} {targetArticle.number}
                                  </Badge>
                                )
                              })}
                            </div>
                          </div>
                        )}
                        </>
                      )
                    })()}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-4 text-center text-secondary-500">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 text-secondary-300" />
                    <p className="text-sm">Selecione uma lei para ver os artigos</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Jurisprudence Timeline Modal */}
      <JurisprudenceTimelineModal
        isOpen={showJurisprudenceModal}
        onClose={() => setShowJurisprudenceModal(false)}
        selectedLawId={selectedLaw?.id}
      />
    </Dialog>
  )
}
