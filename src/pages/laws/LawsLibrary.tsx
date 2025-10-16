import { useState, useEffect } from 'react'
import { Search, BookOpen, FileText, Calendar, Filter, Download, Plus, Upload, X, ExternalLink, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { searchLaws, searchArticles, type Law, type LawArticle } from '@/data/laws'

export function LawsLibrary() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedType, setSelectedType] = useState<string>('')
  const [laws, setLaws] = useState<Law[]>([])
  const [selectedLaw, setSelectedLaw] = useState<Law | null>(null)
  const [articles, setArticles] = useState<LawArticle[]>([])
  const [selectedArticle, setSelectedArticle] = useState<LawArticle | null>(null)
  const [showAddLawModal, setShowAddLawModal] = useState(false)
  const [showAddArticleModal, setShowAddArticleModal] = useState(false)
  const [newLaw, setNewLaw] = useState({
    name: '',
    shortName: '',
    category: '',
    type: 'federal',
    year: new Date().getFullYear(),
    description: ''
  })
  const [newArticle, setNewArticle] = useState({
    number: '',
    title: '',
    content: '',
    keywords: ''
  })
  const [copiedArticleId, setCopiedArticleId] = useState<string | null>(null)

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

  useEffect(() => {
    const results = searchLaws(searchQuery, selectedCategory, selectedType)
    setLaws(results)
  }, [searchQuery, selectedCategory, selectedType])

  useEffect(() => {
    if (selectedLaw) {
      const results = searchArticles(searchQuery, selectedLaw.id)
      setArticles(results)
    } else {
      const results = searchArticles(searchQuery)
      setArticles(results)
    }
  }, [selectedLaw, searchQuery])

  const handleLawSelect = (law: Law) => {
    setSelectedLaw(law)
    setSelectedArticle(null)
  }

  const handleArticleSelect = (article: LawArticle) => {
    setSelectedArticle(article)
  }

  const handleAddLaw = () => {
    if (newLaw.name && newLaw.shortName && newLaw.category) {
      const customLaw: Law = {
        id: `custom-${Date.now()}`,
        name: newLaw.name,
        shortName: newLaw.shortName,
        type: newLaw.type as any,
        category: newLaw.category as any,
        description: newLaw.description,
        year: newLaw.year,
        articles: [],
        isActive: true,
        lastUpdated: new Date().toISOString().split('T')[0]
      }
      
      // Salvar no localStorage
      const savedLaws = localStorage.getItem('customLaws')
      const customLaws = savedLaws ? JSON.parse(savedLaws) : []
      customLaws.push(customLaw)
      localStorage.setItem('customLaws', JSON.stringify(customLaws))
      
      // Resetar formulário
      setNewLaw({
        name: '',
        shortName: '',
        category: '',
        type: 'federal',
        year: new Date().getFullYear(),
        description: ''
      })
      setShowAddLawModal(false)
      
      // Recarregar leis
      const results = searchLaws(searchQuery, selectedCategory, selectedType)
      setLaws(results)
    }
  }

  const handleImportLaws = () => {
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
            const savedLaws = localStorage.getItem('customLaws')
            const customLaws = savedLaws ? JSON.parse(savedLaws) : []
            const updatedLaws = [...customLaws, ...importedLaws]
            localStorage.setItem('customLaws', JSON.stringify(updatedLaws))
            
            // Recarregar leis
            const results = searchLaws(searchQuery, selectedCategory, selectedType)
            setLaws(results)
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
    const savedLaws = localStorage.getItem('customLaws')
    if (savedLaws) {
      const dataStr = JSON.stringify(JSON.parse(savedLaws), null, 2)
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
      
      const exportFileDefaultName = 'custom-laws.json'
      
      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()
    }
  }

  const handleAddArticle = () => {
    if (newArticle.number && newArticle.title && newArticle.content && selectedLaw) {
      const article: LawArticle = {
        id: `${selectedLaw.id}-${Date.now()}`,
        number: newArticle.number,
        title: newArticle.title,
        content: newArticle.content,
        keywords: newArticle.keywords.split(',').map(k => k.trim()).filter(k => k.length > 0),
        relatedArticles: []
      }

      // Atualizar a lei selecionada com o novo artigo
      const updatedLaw = {
        ...selectedLaw,
        articles: [...selectedLaw.articles, article]
      }

      // Salvar no localStorage
      const savedLaws = localStorage.getItem('customLaws')
      const customLaws = savedLaws ? JSON.parse(savedLaws) : []
      const lawIndex = customLaws.findIndex((law: Law) => law.id === selectedLaw.id)
      
      if (lawIndex !== -1) {
        customLaws[lawIndex] = updatedLaw
        localStorage.setItem('customLaws', JSON.stringify(customLaws))
      }

      // Atualizar a lei selecionada
      setSelectedLaw(updatedLaw)
      
      // Resetar formulário
      setNewArticle({
        number: '',
        title: '',
        content: '',
        keywords: ''
      })
      setShowAddArticleModal(false)
      
      // Recarregar artigos
      const results = searchArticles(searchQuery, selectedLaw.id)
      setArticles(results)
    }
  }

  const handleCopyArticle = async (article: LawArticle) => {
    try {
      const articleText = `${article.number} - ${article.title}\n\n${article.content}`
      await navigator.clipboard.writeText(articleText)
      setCopiedArticleId(article.id)
      setTimeout(() => setCopiedArticleId(null), 2000)
    } catch (err) {
      console.error('Erro ao copiar artigo:', err)
      // Fallback para navegadores que não suportam clipboard API
      const textArea = document.createElement('textarea')
      textArea.value = `${article.number} - ${article.title}\n\n${article.content}`
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopiedArticleId(article.id)
      setTimeout(() => setCopiedArticleId(null), 2000)
    }
  }

  const handleInsertArticle = (article: LawArticle) => {
    // Verificar se estamos no contexto do editor
    const editor = (window as any).monacoEditor
    if (editor) {
      const articleText = `${article.number} - ${article.title}\n\n${article.content}`
      const position = editor.getPosition()
      
      if (position) {
        editor.executeEdits('insert-article', [{
          range: {
            startLineNumber: position.lineNumber,
            startColumn: position.column,
            endLineNumber: position.lineNumber,
            endColumn: position.column
          },
          text: articleText,
          forceMoveMarkers: true
        }])
        editor.focus()
      }
    } else {
      // Se não estiver no editor, copiar para a área de transferência
      handleCopyArticle(article)
    }
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

  const getTypeColor = (type: string) => {
    const colors = {
      federal: 'bg-blue-100 text-blue-800',
      estadual: 'bg-green-100 text-green-800',
      municipal: 'bg-orange-100 text-orange-800',
      constitutional: 'bg-purple-100 text-purple-800'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Biblioteca de Leis</h1>
          <p className="text-secondary-600">
            Vademecum jurídico integrado com busca inteligente
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportLaws}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" onClick={handleImportLaws}>
            <Upload className="w-4 h-4 mr-2" />
            Importar Leis
          </Button>
          <Button onClick={() => setShowAddLawModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Lei
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Pesquisa Avançada
          </CardTitle>
          <CardDescription>
            Encontre leis e artigos específicos usando filtros inteligentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
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
              className="px-3 py-2 border border-secondary-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
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
              className="px-3 py-2 border border-secondary-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {types.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <Button variant="outline" onClick={() => {
              setSearchQuery('')
              setSelectedCategory('')
              setSelectedType('')
              setSelectedLaw(null)
              setSelectedArticle(null)
            }}>
              <Filter className="w-4 h-4 mr-2" />
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Total de Leis</p>
                <p className="text-2xl font-bold text-secondary-900">{laws.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Artigos</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {laws.reduce((acc, law) => acc + law.articles.length, 0)}
                </p>
              </div>
              <FileText className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Categorias</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {new Set(laws.map(law => law.category)).size}
                </p>
              </div>
              <Filter className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Atualizado</p>
                <p className="text-2xl font-bold text-secondary-900">2024</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Laws List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-secondary-900">Leis</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {laws.map((law) => (
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
                      <h3 className="font-medium text-sm">{law.shortName}</h3>
                      <p className="text-xs text-secondary-600">{law.name}</p>
                    </div>
                    <div className="flex gap-1">
                      <Badge className={`text-xs ${getCategoryColor(law.category)}`}>
                        {law.category}
                      </Badge>
                      <Badge className={`text-xs ${getTypeColor(law.type)}`}>
                        {law.type}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-secondary-500 mb-2">{law.description}</p>
                  <div className="flex items-center gap-4 text-xs text-secondary-400">
                    <span>{law.year}</span>
                    <span>•</span>
                    <span>{law.articles.length} artigos</span>
                    <span>•</span>
                    <span>Atualizado em {new Date(law.lastUpdated).toLocaleDateString('pt-BR')}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Articles List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-secondary-900">Artigos</h2>
            {selectedLaw && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setShowAddArticleModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Artigo
              </Button>
            )}
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {selectedLaw ? (
              articles.map((article) => (
                <Card 
                  key={article.id} 
                  className={`cursor-pointer transition-colors ${
                    selectedArticle?.id === article.id ? 'ring-2 ring-primary-500' : 'hover:bg-secondary-50'
                  }`}
                  onClick={() => handleArticleSelect(article)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{article.number}</h4>
                      <div className="flex flex-wrap gap-1">
                        {article.keywords.slice(0, 2).map((keyword) => (
                          <Badge key={keyword} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <h5 className="text-sm font-medium text-secondary-900 mb-2">{article.title}</h5>
                    <p className="text-xs text-secondary-600 line-clamp-3">
                      {article.content.substring(0, 150)}...
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-sm">Selecione uma lei para ver seus artigos</p>
                <p className="text-xs mt-1">ou adicionar novos artigos</p>
              </div>
            )}
          </div>
        </div>

        {/* Article Preview */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-secondary-900">Visualização</h2>
          {selectedArticle ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{selectedArticle.number}</CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleCopyArticle(selectedArticle)}
                    >
                      {copiedArticleId === selectedArticle.id ? (
                        <>
                          <Check className="w-4 h-4 mr-2 text-green-600" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4 mr-2" />
                          Copiar
                        </>
                      )}
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleInsertArticle(selectedArticle)}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Inserir
                    </Button>
                  </div>
                </div>
                <CardDescription>{selectedArticle.title}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-secondary-700 whitespace-pre-wrap leading-relaxed">
                  {selectedArticle.content}
                </div>
                <div className="flex flex-wrap gap-1 mt-4">
                  {selectedArticle.keywords.map((keyword) => (
                    <Badge key={keyword} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-secondary-500">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-secondary-300" />
                <h3 className="text-lg font-medium mb-2">
                  {selectedLaw ? 'Selecione um artigo' : 'Selecione uma lei'}
                </h3>
                <p className="text-sm">
                  {selectedLaw 
                    ? 'Escolha um artigo da lista para visualizar o conteúdo completo'
                    : 'Escolha uma lei da lista para ver seus artigos e adicionar novos'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modal para Adicionar Lei */}
      {showAddLawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Adicionar Nova Lei</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddLawModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Lei
                </label>
                <Input
                  value={newLaw.name}
                  onChange={(e) => setNewLaw(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Lei de Proteção de Dados"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Abreviado
                </label>
                <Input
                  value={newLaw.shortName}
                  onChange={(e) => setNewLaw(prev => ({ ...prev, shortName: e.target.value }))}
                  placeholder="Ex: LGPD"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria
                  </label>
                  <select
                    value={newLaw.category}
                    onChange={(e) => setNewLaw(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Selecione</option>
                    {categories.slice(1).map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo
                  </label>
                  <select
                    value={newLaw.type}
                    onChange={(e) => setNewLaw(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    {types.slice(1).map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ano
                </label>
                <Input
                  type="number"
                  value={newLaw.year}
                  onChange={(e) => setNewLaw(prev => ({ ...prev, year: parseInt(e.target.value) || new Date().getFullYear() }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={newLaw.description}
                  onChange={(e) => setNewLaw(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Breve descrição da lei..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-20 resize-none"
                />
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button onClick={handleAddLaw} className="flex-1">
                Adicionar Lei
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAddLawModal(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Adicionar Artigo */}
      {showAddArticleModal && selectedLaw && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Adicionar Artigo - {selectedLaw.shortName}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddArticleModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número do Artigo
                  </label>
                  <Input
                    value={newArticle.number}
                    onChange={(e) => setNewArticle(prev => ({ ...prev, number: e.target.value }))}
                    placeholder="Ex: Art. 1º"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título
                  </label>
                  <Input
                    value={newArticle.title}
                    onChange={(e) => setNewArticle(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ex: Conceitos e definições"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Conteúdo do Artigo
                </label>
                <textarea
                  value={newArticle.content}
                  onChange={(e) => setNewArticle(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Digite o conteúdo completo do artigo..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-40 resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Palavras-chave (separadas por vírgula)
                </label>
                <Input
                  value={newArticle.keywords}
                  onChange={(e) => setNewArticle(prev => ({ ...prev, keywords: e.target.value }))}
                  placeholder="Ex: contrato, obrigação, responsabilidade"
                />
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button onClick={handleAddArticle} className="flex-1">
                Adicionar Artigo
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAddArticleModal(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

