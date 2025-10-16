import { useState, useEffect } from 'react'
import { Search, BookOpen, FileText, Copy, Check, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog'
import { type Law, type LawArticle } from '@/data/laws'
import { resolveLawProvider } from '@/services/lawProvider'

interface LawsSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onInsertLaw: (content: string) => void
}

export function LawsSearchModal({ isOpen, onClose, onInsertLaw }: LawsSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedType, setSelectedType] = useState<string>('')
  const [laws, setLaws] = useState<Law[]>([])
  const [articles, setArticles] = useState<LawArticle[]>([])
  const [selectedLaw, setSelectedLaw] = useState<Law | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

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
    if (isOpen) {
      const provider = resolveLawProvider()
      let active = true
      ;(async () => {
        const results = await provider.searchLaws(searchQuery, { category: selectedCategory, type: selectedType })
        if (active) setLaws(results)
      })()
      return () => { active = false }
    }
  }, [isOpen, searchQuery, selectedCategory, selectedType])

  useEffect(() => {
    const provider = resolveLawProvider()
    let active = true
    ;(async () => {
      const results = await provider.searchArticles(searchQuery, selectedLaw?.id)
      if (active) setArticles(results)
    })()
    return () => { active = false }
  }, [selectedLaw, searchQuery])

  const handleLawSelect = (law: Law) => {
    setSelectedLaw(law)
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            <BookOpen className="w-5 h-5" />
            Biblioteca de Leis
          </DialogTitle>
          <DialogDescription>
            Pesquise e insira artigos de lei em seu documento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex gap-4">
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

        {selectedLaw?.sourceUrl && (
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(selectedLaw.sourceUrl!, '_blank', 'noopener,noreferrer')}
            >
              <ExternalLink className="w-3 h-3 mr-2" />
              Abrir fonte oficial
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-96 overflow-hidden">
            {/* Laws List */}
            <div className="space-y-2 overflow-y-auto">
              <h3 className="font-medium text-secondary-900">Leis</h3>
              {laws.map((law) => (
                <Card 
                  key={law.id} 
                  className={`cursor-pointer transition-colors ${
                    selectedLaw?.id === law.id ? 'ring-2 ring-primary-500' : 'hover:bg-secondary-50'
                  }`}
                  onClick={() => handleLawSelect(law)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-sm">{law.shortName}</h4>
                        <p className="text-xs text-secondary-600">{law.name}</p>
                      </div>
                      <Badge className={`text-xs ${getCategoryColor(law.category)}`}>
                        {law.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-secondary-500">{law.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-secondary-400">{law.year}</span>
                      <span className="text-xs text-secondary-400">•</span>
                      <span className="text-xs text-secondary-400">{law.articles.length} artigos</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Articles List */}
            <div className="space-y-2 overflow-y-auto">
              <h3 className="font-medium text-secondary-900">Artigos</h3>
              {articles.map((article) => (
                <Card key={article.id} className="hover:bg-secondary-50 transition-colors">
                  <CardContent className="p-3">
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
            <div className="space-y-2 overflow-y-auto">
              <h3 className="font-medium text-secondary-900">Visualização</h3>
              {articles.length > 0 ? (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{articles[0].number}</h4>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopy(articles[0].content, articles[0].id)}
                        >
                          {copiedId === articles[0].id ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleArticleInsert(articles[0])}
                        >
                          Inserir
                        </Button>
                      </div>
                    </div>
                    <h5 className="font-medium text-sm mb-2">{articles[0].title}</h5>
                    <div className="text-sm text-secondary-700 whitespace-pre-wrap">
                      {articles[0].content}
                    </div>
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
    </Dialog>
  )
}

