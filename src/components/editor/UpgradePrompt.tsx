import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Crown,
  Sparkles
} from 'lucide-react'
import { useUpgradePlan } from '@/hooks/useAuth'

export function UpgradePrompt() {
  const upgradeMutation = useUpgradePlan()

  const handleUpgrade = () => {
    upgradeMutation.mutate('pro')
  }

  const proFeatures = [
    'Editor com IA para sugestões inteligentes',
    'Autocomplete de artigos de lei',
    'Correção automática contextual',
    'Modelos jurídicos prontos',
    'Snippets personalizáveis',
    'Histórico de versões',
    'Suporte prioritário',
  ]

  return (
    <Card className="border-primary-200 bg-gradient-to-r from-primary-50 to-blue-50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Crown className="w-6 h-6 text-primary-600" />
          <CardTitle className="text-primary-900">
            Desbloqueie o Editor Jurídico Avançado
          </CardTitle>
        </div>
        <CardDescription className="text-primary-700">
          Upgrade para o Plano Pró e tenha acesso a recursos de IA e automação
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-900">R$ 80</p>
              <p className="text-sm text-primary-600">/mês</p>
            </div>
            <div className="flex-1">
              <Badge variant="success" className="mb-2">
                <Sparkles className="w-3 h-3 mr-1" />
                Mais Popular
              </Badge>
              <p className="text-sm text-primary-700">
                Economize tempo e melhore a qualidade dos seus documentos jurídicos
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-primary-900 mb-2">
                Recursos do Plano Pró:
              </h4>
              <ul className="space-y-1">
                {proFeatures.slice(0, 4).map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-primary-700">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-primary-900 mb-2">
                Benefícios:
              </h4>
              <ul className="space-y-1">
                {proFeatures.slice(4).map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-primary-700">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-primary-200">
            <div className="text-sm text-primary-600">
              <p>✓ Cancele a qualquer momento</p>
              <p>✓ Suporte 24/7</p>
            </div>
            <Button 
              onClick={handleUpgrade}
              isLoading={upgradeMutation.isPending}
              className="bg-primary-600 hover:bg-primary-700"
            >
              <Zap className="w-4 h-4 mr-2" />
              Fazer Upgrade
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

