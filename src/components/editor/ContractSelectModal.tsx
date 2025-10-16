import { Search, Scale, DollarSign } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { useContracts } from '@/hooks/useContracts'
import type { Contract } from '@/types'
import { useMemo, useState } from 'react'

interface ContractSelectModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (contract: Contract) => void
}

export function ContractSelectModal({ isOpen, onClose, onSelect }: ContractSelectModalProps) {
  const { data: contracts = [] } = useContracts()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search) return contracts
    const s = search.toLowerCase()
    return contracts.filter(c =>
      c.clientName.toLowerCase().includes(s) ||
      c.description?.toLowerCase().includes(s) ||
      c.type.toLowerCase().includes(s)
    )
  }, [contracts, search])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[85vh] overflow-y-auto overflow-x-hidden p-6 sm:p-8 rounded-xl">
        <DialogHeader>
          <DialogTitle>
            <Scale className="w-5 h-5" />
            Selecionar Contrato
          </DialogTitle>
          <DialogDescription>
            Escolha um contrato para usar como contexto do documento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
              <Input
                placeholder="Buscar contratos por cliente, tipo ou descrição..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(contract => (
              <Card key={contract.id} className="hover:bg-secondary-50 transition-colors cursor-pointer" onClick={() => onSelect(contract)}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-base">
                    <span>{contract.clientName}</span>
                    <Badge variant="outline" className="text-xs">{contract.status}</Badge>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    Tipo: {contract.type}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-secondary-700">
                  {contract.description || 'Sem descrição'}
                  <div className="text-xs text-secondary-500 mt-2 flex items-center gap-1">
                    <DollarSign className="w-3 h-3" /> Valor: R$ {contract.value.toLocaleString('pt-BR')}
                  </div>
                </CardContent>
              </Card>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center text-secondary-500 text-sm py-8">Nenhum contrato encontrado</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


