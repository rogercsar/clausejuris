import { useMemo, useState } from 'react'
import { CheckCircle2, Slash } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { UserPlan } from '@/types'
import { getPlanLimits } from '@/services/plans'

const featureDefinitions = [
  { key: 'ai', label: 'Recursos de IA' },
  { key: 'advancedEditor', label: 'Editor avançado' },
  { key: 'smartTemplates', label: 'Modelos inteligentes' },
  { key: 'teams', label: 'Gestão de equipes' },
  { key: 'permissions', label: 'Permissões avançadas' },
  { key: 'workflow', label: 'Automação de fluxo' },
  { key: 'sharedFolders', label: 'Pastas compartilhadas' },
] as const

type FeatureKey = (typeof featureDefinitions)[number]['key']
const plans: UserPlan[] = ['common', 'start', 'pro', 'office']
const planLabels: Record<UserPlan, string> = {
  common: 'Comum',
  start: 'Start',
  pro: 'Pró',
  office: 'Office',
}

export function AdminFeaturesPage() {
  const [featuresByPlan, setFeaturesByPlan] = useState<Record<UserPlan, Record<FeatureKey, boolean>>>(() => {
    return plans.reduce((acc, plan) => {
      acc[plan] = { ...getPlanLimits(plan).features }
      return acc
    }, {} as Record<UserPlan, Record<FeatureKey, boolean>>)
  })

  const summary = useMemo(() => {
    return plans.map(plan => {
      const enabled = Object.values(featuresByPlan[plan]).filter(Boolean).length
      return { plan, enabled }
    })
  }, [featuresByPlan])

  const toggleFeature = (plan: UserPlan, featureKey: FeatureKey) => {
    setFeaturesByPlan(prev => ({
      ...prev,
      [plan]: {
        ...prev[plan],
        [featureKey]: !prev[plan][featureKey],
      },
    }))
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-secondary-900">Funcionalidades por plano</h1>
        <p className="text-secondary-600">Configure quais recursos estão habilitados em cada oferta.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {summary.map(item => (
          <Card key={item.plan}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-secondary-600">Plano {planLabels[item.plan]}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-secondary-900">{item.enabled}</p>
              <p className="text-xs text-secondary-500">funcionalidades habilitadas</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Matriz de funcionalidades</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-secondary-500">
                    Funcionalidade
                  </th>
                  {plans.map(plan => (
                    <th
                      key={plan}
                      className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-secondary-500"
                    >
                      {planLabels[plan]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200 bg-white">
                {featureDefinitions.map(feature => (
                  <tr key={feature.key}>
                    <td className="px-4 py-3 text-sm font-medium text-secondary-700">{feature.label}</td>
                    {plans.map(plan => {
                      const enabled = featuresByPlan[plan][feature.key]
                      return (
                        <td key={plan} className="px-4 py-3 text-center">
                          <Button
                            variant={enabled ? 'secondary' : 'outline'}
                            size="sm"
                            className="w-full justify-center text-xs"
                            onClick={() => toggleFeature(plan, feature.key)}
                          >
                            {enabled ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 mr-1 text-green-600" />
                                Ativado
                              </>
                            ) : (
                              <>
                                <Slash className="w-4 h-4 mr-1 text-secondary-500" />
                                Desativado
                              </>
                            )}
                          </Button>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminFeaturesPage

