import { useMemo, useState } from 'react'
import { Book, Edit, Eye, Plus, ToggleLeft, ToggleRight, Trash } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { lawsDatabase, type Law } from '@/data/laws'

function withActiveFlag(law: Law): Law & { isActive: boolean } {
  return { ...law, isActive: (law as any).isActive ?? true }
}

export function AdminLawsPage() {
  const [lawSearch, setLawSearch] = useState('')
  const [laws, setLaws] = useState(() => lawsDatabase.map(withActiveFlag))

  const filteredLaws = useMemo(() => {
    return laws.filter(law =>
      law.name.toLowerCase().includes(lawSearch.toLowerCase()) ||
      law.shortName.toLowerCase().includes(lawSearch.toLowerCase()) ||
      law.category.toLowerCase().includes(lawSearch.toLowerCase())
    )
  }, [laws, lawSearch])

  const toggleLaw = (lawId: string) => {
    setLaws(prev => prev.map(law => (law.id === lawId ? { ...law, isActive: !law.isActive } : law)))
  }

  const deleteLaw = (lawId: string) => {
    if (window.confirm('Remover esta lei da base local?')) {
      setLaws(prev => prev.filter(law => law.id !== lawId))
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-secondary-900">Base de Leis</h1>
          <p className="text-secondary-600">Controle quais leis estão disponíveis no editor jurídico.</p>
        </div>
        <Button size="sm" onClick={() => alert('Cadastro de novas leis será implementado em breve!')}>
          <Plus className="w-4 h-4 mr-2" />
          Nova lei
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Leis cadastradas</CardTitle>
            <p className="text-sm text-secondary-500">Total: {laws.length}</p>
          </div>
          <Input
            placeholder="Buscar por nome, sigla ou categoria"
            value={lawSearch}
            onChange={e => setLawSearch(e.target.value)}
            className="md:w-72"
          />
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredLaws.length === 0 && (
            <p className="text-secondary-500 text-sm">Nenhuma lei encontrada com o filtro aplicado.</p>
          )}
          {filteredLaws.map(law => (
            <div key={law.id} className="border border-secondary-200 rounded-lg p-4">
              <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Book className="w-4 h-4 text-primary-500" />
                    <p className="font-medium text-secondary-900">{law.name}</p>
                  </div>
                  <p className="text-sm text-secondary-500">{law.shortName} • {law.category}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant={law.isActive ? 'success' : 'secondary'}>
                      {law.isActive ? 'Disponível' : 'Desativada'}
                    </Badge>
                    <Badge variant="secondary">{law.type}</Badge>
                    <Badge variant="secondary">{law.year}</Badge>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="ghost" size="sm" onClick={() => toggleLaw(law.id)}>
                    {law.isActive ? (
                      <ToggleRight className="w-4 h-4 mr-1 text-green-600" />
                    ) : (
                      <ToggleLeft className="w-4 h-4 mr-1 text-secondary-500" />
                    )}
                    {law.isActive ? 'Desativar' : 'Ativar'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => alert('Edição será implementada em breve!')}>
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => alert('Visualização em tela dedicada em breve!')}>
                    <Eye className="w-4 h-4 mr-1" />
                    Visualizar
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteLaw(law.id)}>
                    <Trash className="w-4 h-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminLawsPage

