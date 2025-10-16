import { User, Building, Phone, Mail, MapPin, Calendar, Scale, FileText } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { Process, Contract, Client } from '@/types'

interface ContextInfoProps {
  context: Process | Contract | null
  client: Client | null
}

export function ContextInfo({ context, client }: ContextInfoProps) {
  if (!context || !client) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informações do Contexto</CardTitle>
          <CardDescription>
            Selecione um processo ou contrato para ver as informações dos envolvidos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Scale className="w-12 h-12 mx-auto mb-4 text-secondary-300" />
            <p className="text-sm text-secondary-500">
              Nenhum contexto selecionado
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const isProcess = 'status' in context && 'caseNumber' in context

  return (
    <div className="space-y-6">
      {/* Client Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            {client.type === 'company' ? (
              <Building className="w-5 h-5" />
            ) : (
              <User className="w-5 h-5" />
            )}
            Cliente
          </CardTitle>
          <CardDescription>
            {client.type === 'company' ? 'Pessoa Jurídica' : 'Pessoa Física'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-sm font-medium text-secondary-600">Nome</label>
            <p className="text-secondary-900 font-medium">{client.name}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-secondary-600">
              {client.type === 'company' ? 'CNPJ' : 'CPF'}
            </label>
            <p className="text-secondary-900 font-mono text-sm">{client.document}</p>
          </div>
          
          {client.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-secondary-400" />
              <span className="text-sm text-secondary-900">{client.email}</span>
            </div>
          )}
          
          {client.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-secondary-400" />
              <span className="text-sm text-secondary-900">{client.phone}</span>
            </div>
          )}
          
          {client.address && (
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-secondary-400 mt-0.5" />
              <span className="text-sm text-secondary-900">{client.address}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Process/Contract Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            {isProcess ? (
              <FileText className="w-5 h-5" />
            ) : (
              <Scale className="w-5 h-5" />
            )}
            {isProcess ? 'Processo' : 'Contrato'}
          </CardTitle>
          <CardDescription>
            {isProcess ? 'Detalhes do processo' : 'Detalhes do contrato'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-sm font-medium text-secondary-600">Tipo</label>
            <Badge variant="outline" className="ml-2">
              {context.type}
            </Badge>
          </div>

          {isProcess && (
            <>
              <div>
                <label className="text-sm font-medium text-secondary-600">Status</label>
                <Badge 
                  variant={
                    (context as Process).status === 'won' ? 'success' :
                    (context as Process).status === 'lost' ? 'destructive' :
                    (context as Process).status === 'in_progress' ? 'warning' : 'secondary'
                  }
                  className="ml-2"
                >
                  {(context as Process).status}
                </Badge>
              </div>

              {(context as Process).caseNumber && (
                <div>
                  <label className="text-sm font-medium text-secondary-600">Número do Processo</label>
                  <p className="text-secondary-900 font-mono text-sm">
                    {(context as Process).caseNumber}
                  </p>
                </div>
              )}

              {(context as Process).court && (
                <div>
                  <label className="text-sm font-medium text-secondary-600">Tribunal/Vara</label>
                  <p className="text-secondary-900 text-sm">{(context as Process).court}</p>
                </div>
              )}

              {(context as Process).againstWho && (
                <div>
                  <label className="text-sm font-medium text-secondary-600">Contra quem</label>
                  <p className="text-secondary-900 text-sm">{(context as Process).againstWho}</p>
                </div>
              )}

              {(context as Process).involved && (
                <div>
                  <label className="text-sm font-medium text-secondary-600">Envolvido</label>
                  <p className="text-secondary-900 text-sm">{(context as Process).involved}</p>
                </div>
              )}

              {(context as Process).lawyer && (
                <div>
                  <label className="text-sm font-medium text-secondary-600">Advogado</label>
                  <p className="text-secondary-900 text-sm">{(context as Process).lawyer}</p>
                </div>
              )}
            </>
          )}

          {!isProcess && (
            <>
              <div>
                <label className="text-sm font-medium text-secondary-600">Status</label>
                <Badge 
                  variant={
                    (context as Contract).status === 'active' ? 'success' :
                    (context as Contract).status === 'ended' ? 'secondary' : 'destructive'
                  }
                  className="ml-2"
                >
                  {(context as Contract).status}
                </Badge>
              </div>

              <div>
                <label className="text-sm font-medium text-secondary-600">Valor</label>
                <p className="text-secondary-900 font-medium">
                  R$ {(context as Contract).value.toLocaleString('pt-BR')}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-secondary-600">Período</label>
                <p className="text-secondary-900 text-sm">
                  {(context as Contract).startDate} - {(context as Contract).endDate || 'Em andamento'}
                </p>
              </div>
            </>
          )}

          {context.description && (
            <div>
              <label className="text-sm font-medium text-secondary-600">Descrição</label>
              <p className="text-secondary-900 text-sm">{context.description}</p>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2 border-t border-secondary-200">
            <Calendar className="w-4 h-4 text-secondary-400" />
            <span className="text-xs text-secondary-500">
              Criado em {new Date(context.createdAt).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

