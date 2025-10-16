import { useState } from 'react'
import { BarChart, TrendingUp, FileText, BookOpen, Target, Award, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog'

interface StatisticsModalProps {
  isOpen: boolean
  onClose: () => void
  wordCount: number
  characterCount: number
  context?: any
}

export function StatisticsModal({ isOpen, onClose, wordCount, characterCount, context }: StatisticsModalProps) {
  const [stats] = useState({
    totalDocuments: 12,
    totalWords: 45678,
    totalCharacters: 234567,
    averageWordsPerDocument: 3806,
    documentsThisMonth: 3,
    timeSpent: 24.5,
    templatesUsed: 8,
    lawsReferenced: 15,
    productivityScore: 85,
    streak: 7
  })

  // Função removida pois não estava sendo utilizada

  const getProductivityBadge = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800'
    if (score >= 60) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const formatTime = (hours: number) => {
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24
    if (days > 0) {
      return `${days}d ${remainingHours.toFixed(1)}h`
    }
    return `${hours.toFixed(1)}h`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[85vh] overflow-y-auto overflow-x-hidden p-6 sm:p-8 rounded-xl">
        <DialogHeader>
          <DialogTitle>
            <BarChart className="w-5 h-5" />
            Estatísticas do Editor
          </DialogTitle>
          <DialogDescription>
            Acompanhe sua produtividade e uso do editor jurídico
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Document Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Documento Atual</CardTitle>
              <CardDescription>Estatísticas do documento em edição</CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{wordCount}</div>
                  <div className="text-sm text-secondary-600">Palavras</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{characterCount}</div>
                  <div className="text-sm text-secondary-600">Caracteres</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">
                    {Math.round(wordCount / 250)}
                  </div>
                  <div className="text-sm text-secondary-600">Páginas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">
                    {Math.round(wordCount / 60)}
                  </div>
                  <div className="text-sm text-secondary-600">Min. Leitura</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Overall Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Documentos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-secondary-600">Total de Documentos</span>
                  <span className="font-semibold">{stats.totalDocuments}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-secondary-600">Este Mês</span>
                  <span className="font-semibold">{stats.documentsThisMonth}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-secondary-600">Média por Documento</span>
                  <span className="font-semibold">{stats.averageWordsPerDocument.toLocaleString()} palavras</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Produtividade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-secondary-600">Pontuação</span>
                  <Badge className={getProductivityBadge(stats.productivityScore)}>
                    {stats.productivityScore}/100
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-secondary-600">Sequência Ativa</span>
                  <span className="font-semibold">{stats.streak} dias</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-secondary-600">Tempo Total</span>
                  <span className="font-semibold">{formatTime(stats.timeSpent)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Usage Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Recursos Utilizados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-secondary-600">Modelos Usados</span>
                  <span className="font-semibold">{stats.templatesUsed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-secondary-600">Leis Referenciadas</span>
                  <span className="font-semibold">{stats.lawsReferenced}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-secondary-600">Sugestões Aceitas</span>
                  <span className="font-semibold">23</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Metas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pb-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Documentos/Mês</span>
                    <span>3/5</span>
                  </div>
                  <div className="w-full bg-secondary-200 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Palavras/Mês</span>
                    <span>15.2k/20k</span>
                  </div>
                  <div className="w-full bg-secondary-200 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: '76%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Conquistas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pb-6">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">🏆</Badge>
                  <span className="text-sm">Primeiro Documento</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">📚</Badge>
                  <span className="text-sm">10 Modelos Usados</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">⚡</Badge>
                  <span className="text-sm">7 Dias Consecutivos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">🎯</Badge>
                  <span className="text-sm">Meta Mensal</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Context Information */}
          {context && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Contexto Atual
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-secondary-600">Cliente</div>
                    <div className="font-semibold">{context.clientName || 'Nenhum'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-secondary-600">Tipo</div>
                    <div className="font-semibold">
                      {context.status ? 'Processo' : 'Contrato'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
