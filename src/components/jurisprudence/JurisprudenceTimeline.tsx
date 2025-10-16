import { useState } from 'react'
import { Calendar, Scale, FileText, Clock, TrendingUp } from 'lucide-react'
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
import { 
  searchJurisprudence, 
  getTimelineByJurisprudenceId, 
  getJurisprudenceStats
} from '@/data/jurisprudence'
import type { Jurisprudence, JurisprudenceCategory, JurisprudenceImportance } from '@/types'

interface JurisprudenceTimelineProps {
  isOpen: boolean
  onClose: () => void
  selectedLawId?: string
}

export function JurisprudenceTimelineModal({ isOpen, onClose }: JurisprudenceTimelineProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<JurisprudenceCategory | ''>('')
  const [selectedCourt, setSelectedCourt] = useState('')
  const [selectedImportance, setSelectedImportance] = useState<JurisprudenceImportance | ''>('')
  const [selectedJurisprudence, setSelectedJurisprudence] = useState<Jurisprudence | null>(null)
  const [activeTab, setActiveTab] = useState<'list' | 'timeline'>('list')

  const jurisprudence = searchJurisprudence(searchQuery, selectedCategory || undefined, selectedCourt || undefined)
  const filteredJurisprudence = selectedImportance 
    ? jurisprudence.filter(j => j.importance === selectedImportance)
    : jurisprudence

  const timeline = selectedJurisprudence ? getTimelineByJurisprudenceId(selectedJurisprudence.id) : []
  const stats = getJurisprudenceStats()

  const categories = [
    { value: '', label: 'Todas as categorias' },
    { value: 'civil', label: 'Civil' },
    { value: 'criminal', label: 'Criminal' },
    { value: 'labor', label: 'Trabalhista' },
    { value: 'family', label: 'Família' },
    { value: 'administrative', label: 'Administrativo' },
    { value: 'constitutional', label: 'Constitucional' },
    { value: 'commercial', label: 'Comercial' },
    { value: 'tax', label: 'Tributário' },
    { value: 'consumer', label: 'Consumidor' },
    { value: 'environmental', label: 'Ambiental' }
  ]

  const courts = [
    { value: '', label: 'Todos os tribunais' },
    { value: 'STF', label: 'Supremo Tribunal Federal' },
    { value: 'STJ', label: 'Superior Tribunal de Justiça' },
    { value: 'TST', label: 'Tribunal Superior do Trabalho' },
    { value: 'STF', label: 'Supremo Tribunal Federal' }
  ]

  const importanceLevels = [
    { value: '', label: 'Todas as importâncias' },
    { value: 'low', label: 'Baixa' },
    { value: 'medium', label: 'Média' },
    { value: 'high', label: 'Alta' },
    { value: 'landmark', label: 'Marco' }
  ]

  const getImportanceColor = (importance: JurisprudenceImportance) => {
    switch (importance) {
      case 'landmark': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPrecedentialValueColor = (value: string) => {
    switch (value) {
      case 'binding': return 'bg-green-100 text-green-800 border-green-200'
      case 'persuasive': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'informative': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case 'decision': return <Scale className="w-4 h-4 text-blue-600" />
      case 'appeal': return <TrendingUp className="w-4 h-4 text-orange-600" />
      case 'precedent_set': return <FileText className="w-4 h-4 text-green-600" />
      case 'law_change': return <Calendar className="w-4 h-4 text-purple-600" />
      default: return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const handleJurisprudenceSelect = (jurisprudence: Jurisprudence) => {
    setSelectedJurisprudence(jurisprudence)
    setActiveTab('timeline')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scale className="w-5 h-5" />
            Timeline de Jurisprudências
          </DialogTitle>
          <DialogDescription>
            Explore decisões judiciais e sua evolução ao longo do tempo
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Tabs */}
          <div className="flex gap-2 border-b border-secondary-200">
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'list' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-secondary-600 hover:text-secondary-900'
              }`}
              onClick={() => setActiveTab('list')}
            >
              Lista de Jurisprudências
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'timeline' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-secondary-600 hover:text-secondary-900'
              }`}
              onClick={() => setActiveTab('timeline')}
              disabled={!selectedJurisprudence}
            >
              Timeline
            </button>
          </div>

          {activeTab === 'list' && (
            <>
              {/* Search and Filters */}
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Pesquisar jurisprudências..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as JurisprudenceCategory)}
                  className="px-3 py-2 border border-secondary-300 rounded-md text-sm"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedCourt}
                  onChange={(e) => setSelectedCourt(e.target.value)}
                  className="px-3 py-2 border border-secondary-300 rounded-md text-sm"
                >
                  {courts.map(court => (
                    <option key={court.value} value={court.value}>
                      {court.label}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedImportance}
                  onChange={(e) => setSelectedImportance(e.target.value as JurisprudenceImportance)}
                  className="px-3 py-2 border border-secondary-300 rounded-md text-sm"
                >
                  {importanceLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary-600">{stats.total}</div>
                    <div className="text-sm text-secondary-600">Total</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.recent}</div>
                    <div className="text-sm text-secondary-600">Recentes</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.byImportance.high || 0}</div>
                    <div className="text-sm text-secondary-600">Alta Importância</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{stats.byImportance.landmark || 0}</div>
                    <div className="text-sm text-secondary-600">Marcos</div>
                  </CardContent>
                </Card>
              </div>

              {/* Jurisprudence List */}
              <div className="space-y-3 max-h-[50vh] overflow-y-auto">
                {filteredJurisprudence.map((jurisprudence) => (
                  <Card 
                    key={jurisprudence.id} 
                    className="cursor-pointer hover:bg-secondary-50 transition-colors"
                    onClick={() => handleJurisprudenceSelect(jurisprudence)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-lg mb-2">{jurisprudence.title}</h4>
                          <p className="text-sm text-secondary-600 mb-3">{jurisprudence.summary}</p>
                          <div className="flex items-center gap-2 text-xs text-secondary-500">
                            <span>{jurisprudence.court}</span>
                            <span>•</span>
                            <span>{jurisprudence.caseNumber}</span>
                            <span>•</span>
                            <span>{formatDate(jurisprudence.date)}</span>
                            {jurisprudence.judge && (
                              <>
                                <span>•</span>
                                <span>{jurisprudence.judge}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge className={getImportanceColor(jurisprudence.importance)}>
                            {jurisprudence.importance}
                          </Badge>
                          <Badge className={getPrecedentialValueColor(jurisprudence.precedentialValue)}>
                            {jurisprudence.precedentialValue}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {jurisprudence.keywords.slice(0, 4).map((keyword) => (
                          <Badge key={keyword} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {activeTab === 'timeline' && selectedJurisprudence && (
            <div className="space-y-4">
              {/* Selected Jurisprudence Header */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{selectedJurisprudence.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-secondary-600 mb-3">
                    <span>{selectedJurisprudence.court}</span>
                    <span>•</span>
                    <span>{selectedJurisprudence.caseNumber}</span>
                    <span>•</span>
                    <span>{formatDate(selectedJurisprudence.date)}</span>
                  </div>
                  <p className="text-sm">{selectedJurisprudence.summary}</p>
                </CardContent>
              </Card>

              {/* Timeline */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Timeline de Eventos</h3>
                <div className="space-y-3">
                  {timeline.map((event) => (
                    <div key={event.id} className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {getEventTypeIcon(event.eventType)}
                      </div>
                      <div className="flex-1">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium">{event.title}</h4>
                              <span className="text-xs text-secondary-500">
                                {formatDate(event.date)}
                              </span>
                            </div>
                            <p className="text-sm text-secondary-600 mb-2">{event.description}</p>
                            <div className="flex items-center gap-2 text-xs text-secondary-500">
                              <span>{event.court}</span>
                              <Badge variant="outline" className="text-xs">
                                {event.eventType}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
