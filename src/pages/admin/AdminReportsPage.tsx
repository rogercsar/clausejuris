import { useMemo } from 'react'
import { BarChart3, FileWarning, Scale } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useAdminPlatformData } from '@/hooks/useAdmin'
import { formatDate } from '@/lib/utils'

export function AdminReportsPage() {
  const { data } = useAdminPlatformData()
  const processes = data?.processes ?? []

  const stats = useMemo(() => {
    const byStatus: Record<string, number> = {}
    const latest = [...processes]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10)
    processes.forEach(process => {
      byStatus[process.status] = (byStatus[process.status] || 0) + 1
    })
    return { byStatus, total: processes.length, latest }
  }, [processes])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-secondary-900">Relatórios</h1>
        <p className="text-secondary-600">Panorama dos processos e movimentações recentes.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm text-secondary-600">Total de processos</CardTitle>
            <Scale className="w-4 h-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-secondary-900">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm text-secondary-600">Em andamento</CardTitle>
            <BarChart3 className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-secondary-900">{stats.byStatus.in_progress || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm text-secondary-600">Pendentes</CardTitle>
            <FileWarning className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-secondary-900">{stats.byStatus.pending || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status dos processos</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(stats.byStatus).map(([status, count]) => (
            <div key={status} className="rounded-lg border border-secondary-200 p-3">
              <p className="text-xs uppercase text-secondary-500">{status}</p>
              <p className="text-xl font-semibold text-secondary-900">{count}</p>
            </div>
          ))}
          {stats.total === 0 && <p className="text-sm text-secondary-500">Nenhum processo registrado.</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Últimas atualizações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {stats.latest.length === 0 && (
            <p className="text-sm text-secondary-500">Sem movimentações recentes.</p>
          )}
          {stats.latest.map(process => (
            <div key={process.id} className="rounded-lg border border-secondary-200 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-900">{process.clientName}</p>
                  <p className="text-xs text-secondary-500">{process.description || process.caseNumber}</p>
                </div>
                <span className="text-xs text-secondary-500">
                  {formatDate(process.updatedAt)}
                </span>
              </div>
              <p className="mt-2 text-xs uppercase text-secondary-600">Status: {process.status}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminReportsPage

