import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { 
  FileText, 
  Scale, 
  AlertTriangle, 
  ExternalLink,
  Users,
  Calendar
} from 'lucide-react'
import { useCrossReference } from '@/hooks/useCrossReference'
import { formatDate } from '@/lib/utils'

interface CrossReferencePanelProps {
  entityType: 'contract' | 'process'
  entityId: string
  entityName: string
}

export function CrossReferencePanel({ entityType, entityId, entityName }: CrossReferencePanelProps) {
  const { data: references = [], isLoading } = useCrossReference(entityType, entityId)

  const getRiskColor = (riskLevel?: string) => {
    switch (riskLevel) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRiskLabel = (riskLevel?: string) => {
    switch (riskLevel) {
      case 'high':
        return 'Alto Risco'
      case 'medium':
        return 'Médio Risco'
      case 'low':
        return 'Baixo Risco'
      default:
        return 'Sem Risco'
    }
  }

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'contract':
        return <FileText className="w-4 h-4" />
      case 'process':
        return <Scale className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getRelationLabel = (relationType: string) => {
    switch (relationType) {
      case 'same_client':
        return 'Mesmo Cliente'
      case 'related_process':
        return 'Processo Relacionado'
      case 'related_contract':
        return 'Contrato Relacionado'
      default:
        return 'Relacionado'
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Relacionamentos
          </CardTitle>
          <CardDescription>
            Carregando informações relacionadas...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-secondary-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-secondary-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (references.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Relacionamentos
          </CardTitle>
          <CardDescription>
            Nenhum relacionamento encontrado para {entityName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-secondary-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-secondary-300" />
            <p className="text-sm">Nenhuma informação relacionada encontrada</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Relacionamentos
        </CardTitle>
        <CardDescription>
          {references.length} relacionamento(s) encontrado(s) para {entityName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {references.map((reference) => (
            <div
              key={reference.entityId}
              className="p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getEntityIcon(reference.entityType)}
                  <h4 className="font-medium text-secondary-900">
                    {reference.entityName}
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {getRelationLabel(reference.relationType)}
                  </Badge>
                  {reference.riskLevel && (
                    <Badge className={`text-xs ${getRiskColor(reference.riskLevel)}`}>
                      {getRiskLabel(reference.riskLevel)}
                    </Badge>
                  )}
                </div>
              </div>

              <p className="text-sm text-secondary-600 mb-3">
                {reference.details}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-secondary-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(new Date().toISOString())}
                  </span>
                </div>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Ver Detalhes
                </Button>
              </div>

              {reference.riskLevel === 'high' && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <p className="text-sm text-red-800 font-medium">
                      Atenção: Alto risco identificado
                    </p>
                  </div>
                  <p className="text-xs text-red-700 mt-1">
                    Este relacionamento pode apresentar riscos jurídicos. 
                    Recomenda-se análise detalhada.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {references.some(r => r.riskLevel === 'high') && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <p className="text-sm text-yellow-800 font-medium">
                Resumo de Riscos
              </p>
            </div>
            <p className="text-xs text-yellow-700 mt-1">
              {references.filter(r => r.riskLevel === 'high').length} relacionamento(s) 
              de alto risco identificado(s). Considere revisar os detalhes antes de prosseguir.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

