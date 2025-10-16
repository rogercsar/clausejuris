import { useState } from 'react'
import { FileText, Scale, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useProcesses } from '@/hooks/useProcesses'
import { useContracts } from '@/hooks/useContracts'
import type { Process, Contract } from '@/types'
import { ProcessSelectModal } from '@/components/editor/ProcessSelectModal'
import { ContractSelectModal } from '@/components/editor/ContractSelectModal'

interface ContextSelectorProps {
  selectedContext: Process | Contract | null
  onContextSelect: (context: Process | Contract | null) => void
}

export function ContextSelector({ selectedContext, onContextSelect }: ContextSelectorProps) {
  const [contextType, setContextType] = useState<'process' | 'contract'>('process')
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false)
  const [isContractModalOpen, setIsContractModalOpen] = useState(false)
  
  useProcesses()
  useContracts()

  const handleContextSelect = (context: Process | Contract) => {
    onContextSelect(context)
  }

  const clearSelection = () => {
    onContextSelect(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="w-5 h-5" />
          Contexto do Documento
        </CardTitle>
        <CardDescription>
          Selecione um processo ou contrato para carregar sugestões personalizadas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Context Type Selector */}
        <div className="flex gap-2">
          <Button
            variant={contextType === 'process' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => { setContextType('process'); setIsProcessModalOpen(true) }}
          >
            <FileText className="w-4 h-4 mr-2" />
            Processos
          </Button>
          <Button
            variant={contextType === 'contract' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => { setContextType('contract'); setIsContractModalOpen(true) }}
          >
            <Scale className="w-4 h-4 mr-2" />
            Contratos
          </Button>
        </div>

        {/* Search removed in favor of modal selection */}

        {/* Selected Context */}
        {selectedContext && (
          <div className="p-3 bg-primary-50 rounded-lg border border-primary-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline">
                    {('status' in selectedContext) ? 'Processo' : 'Contrato'}
                  </Badge>
                  <span className="text-sm font-medium text-secondary-900">
                    {selectedContext.clientName}
                  </span>
                </div>
                <p className="text-sm text-secondary-600">
                  {('status' in selectedContext) 
                    ? (selectedContext as Process).description || 'Sem descrição'
                    : (selectedContext as Contract).description || 'Sem descrição'
                  }
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Results removed; selection happens via modal */}
        <ProcessSelectModal
          isOpen={isProcessModalOpen}
          onClose={() => setIsProcessModalOpen(false)}
          onSelect={(p) => { handleContextSelect(p); setIsProcessModalOpen(false) }}
        />
        <ContractSelectModal
          isOpen={isContractModalOpen}
          onClose={() => setIsContractModalOpen(false)}
          onSelect={(c) => { handleContextSelect(c); setIsContractModalOpen(false) }}
        />
      </CardContent>
    </Card>
  )
}

