import { Search, FileText, Calendar } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { useProcesses } from '@/hooks/useProcesses'
import type { Process } from '@/types'
import { useMemo, useState } from 'react'

interface ProcessSelectModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (process: Process) => void
}

export function ProcessSelectModal({ isOpen, onClose, onSelect }: ProcessSelectModalProps) {
  const { data: processes = [] } = useProcesses()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search) return processes
    const s = search.toLowerCase()
    return processes.filter(p =>
      p.clientName.toLowerCase().includes(s) ||
      (p.description?.toLowerCase().includes(s) ?? false) ||
      (p.caseNumber?.toLowerCase().includes(s) ?? false)
    )
  }, [processes, search])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[85vh] overflow-y-auto overflow-x-hidden p-6 sm:p-8 rounded-xl">
        <DialogHeader>
          <DialogTitle>
            <FileText className="w-5 h-5" />
            Selecionar Processo
          </DialogTitle>
          <DialogDescription>
            Escolha um processo para usar como contexto do documento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
              <Input
                placeholder="Buscar processos por cliente, nº ou descrição..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(process => (
              <Card key={process.id} className="hover:bg-secondary-50 transition-colors cursor-pointer" onClick={() => onSelect(process)}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-base">
                    <span>{process.clientName}</span>
                    <Badge variant="outline" className="text-xs">{process.status}</Badge>
                  </CardTitle>
                  {process.caseNumber && (
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" /> Processo: {process.caseNumber}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="text-sm text-secondary-700">
                  {process.description || 'Sem descrição'}
                </CardContent>
              </Card>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center text-secondary-500 text-sm py-8">Nenhum processo encontrado</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


