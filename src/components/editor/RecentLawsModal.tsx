import { useState } from 'react'
import { TrendingUp, Copy, Check, Search, Calendar, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog'

interface RecentLaw {
  id: string
  title: string
  description: string
  date: string
  category: string
  content: string
  keywords: string[]
  source: string
}

interface RecentLawsModalProps {
  isOpen: boolean
  onClose: () => void
  onLawSelect: (content: string) => void
  context?: any
}

const recentLaws: RecentLaw[] = [
  {
    id: '1',
    title: 'Lei 14.711/2023 - Marco Legal das Startups',
    description: 'Dispõe sobre o marco legal das startups e do empreendedorismo inovador',
    date: '2023-12-28',
    category: 'Empresarial',
    content: `LEI Nº 14.711, DE 28 DE DEZEMBRO DE 2023

Dispõe sobre o marco legal das startups e do empreendedorismo inovador, altera a Lei nº 6.404, de 15 de dezembro de 1976, e dá outras providências.

O PRESIDENTE DA REPÚBLICA Faço saber que o Congresso Nacional decreta e eu sanciono a seguinte Lei:

CAPÍTULO I
DISPOSIÇÕES GERAIS

Art. 1º Esta Lei institui o marco legal das startups e do empreendedorismo inovador, com o objetivo de:

I - estimular o desenvolvimento de soluções inovadoras de impacto social e econômico;

II - promover o crescimento econômico sustentável;

III - fomentar a criação de empregos de qualidade;

IV - aumentar a competitividade do País no cenário internacional.

Art. 2º Para os efeitos desta Lei, considera-se:

I - startup: pessoa jurídica de direito privado, constituída há no máximo 10 (dez) anos, com faturamento anual de até R$ 16.000.000,00 (dezesseis milhões de reais), que desenvolva produtos, serviços ou processos inovadores com potencial de escalabilidade;

II - empreendedorismo inovador: atividade econômica que visa à criação de valor por meio da inovação;

III - inovação: introdução de novidade ou aperfeiçoamento que resulte em novos produtos, serviços ou processos ou que implique melhorias significativas nos existentes.`,
    keywords: ['startup', 'empreendedorismo', 'inovação', 'marco legal', 'empresarial'],
    source: 'Diário Oficial da União'
  },
  {
    id: '2',
    title: 'Lei 14.701/2023 - Marco Civil da Inteligência Artificial',
    description: 'Estabelece princípios, direitos e deveres para o uso da inteligência artificial no Brasil',
    date: '2023-12-27',
    category: 'Tecnologia',
    content: `LEI Nº 14.701, DE 27 DE DEZEMBRO DE 2023

Estabelece princípios, direitos e deveres para o uso da inteligência artificial no Brasil e dá outras providências.

O PRESIDENTE DA REPÚBLICA Faço saber que o Congresso Nacional decreta e eu sanciono a seguinte Lei:

CAPÍTULO I
DISPOSIÇÕES GERAIS

Art. 1º Esta Lei estabelece princípios, direitos e deveres para o uso da inteligência artificial no Brasil, com o objetivo de:

I - promover o desenvolvimento tecnológico responsável;

II - proteger os direitos fundamentais das pessoas;

III - fomentar a inovação e a competitividade;

IV - garantir a transparência e a explicabilidade dos sistemas de IA.

Art. 2º Para os efeitos desta Lei, considera-se:

I - inteligência artificial: sistema computacional que, para um determinado conjunto de objetivos definidos pelo ser humano, pode gerar conteúdos, fazer predições, recomendar ou decidir ações que influenciam os ambientes com os quais interage;

II - sistema de IA: qualquer sistema de software que implementa inteligência artificial;

III - algoritmo: conjunto de regras ou instruções lógicas, matemáticas ou estatísticas que definem como um sistema de IA processa dados para gerar resultados.`,
    keywords: ['inteligência artificial', 'IA', 'algoritmo', 'tecnologia', 'transparência'],
    source: 'Diário Oficial da União'
  },
  {
    id: '3',
    title: 'Lei 14.690/2023 - Proteção de Dados Pessoais',
    description: 'Altera a Lei Geral de Proteção de Dados Pessoais para fortalecer a proteção da privacidade',
    date: '2023-12-20',
    category: 'Privacidade',
    content: `LEI Nº 14.690, DE 20 DE DEZEMBRO DE 2023

Altera a Lei nº 13.709, de 14 de agosto de 2018, para fortalecer a proteção de dados pessoais e dar outras providências.

O PRESIDENTE DA REPÚBLICA Faço saber que o Congresso Nacional decreta e eu sanciono a seguinte Lei:

Art. 1º A Lei nº 13.709, de 14 de agosto de 2018, passa a vigorar com as seguintes alterações:

"Art. 46-A. O tratamento de dados pessoais de crianças e de adolescentes deve ser realizado em seu melhor interesse, nos termos do art. 227 da Constituição Federal.

§ 1º O tratamento de dados pessoais de crianças e de adolescentes deve ser realizado com o consentimento específico e em destaque dado por pelo menos um dos pais ou pelo responsável legal.

§ 2º O controlador não pode condicionar a participação em jogos e aplicações de internet à coleta de dados pessoais além dos estritamente necessários à atividade.

§ 3º O controlador deve manter registro das operações de tratamento de dados pessoais de crianças e de adolescentes, incluindo as hipóteses legais e as finalidades do tratamento, os tipos de dados coletados, a forma de utilização e os procedimentos para garantir o exercício dos direitos dos titulares."`,
    keywords: ['dados pessoais', 'privacidade', 'crianças', 'adolescentes', 'LGPD'],
    source: 'Diário Oficial da União'
  },
  {
    id: '4',
    title: 'Lei 14.675/2023 - Trabalho Remoto',
    description: 'Regulamenta o trabalho remoto e estabelece direitos e deveres das partes',
    date: '2023-12-15',
    category: 'Trabalhista',
    content: `LEI Nº 14.675, DE 15 DE DEZEMBRO DE 2023

Regulamenta o trabalho remoto e estabelece direitos e deveres das partes na relação de emprego.

O PRESIDENTE DA REPÚBLICA Faço saber que o Congresso Nacional decreta e eu sanciono a seguinte Lei:

CAPÍTULO I
DISPOSIÇÕES GERAIS

Art. 1º Esta Lei regulamenta o trabalho remoto, definindo direitos e deveres das partes na relação de emprego.

Art. 2º Para os efeitos desta Lei, considera-se:

I - trabalho remoto: prestação de serviços realizada pelo empregado em local diverso da sede da empresa, com utilização de tecnologia da informação e comunicação;

II - teletrabalho: modalidade de trabalho remoto realizada com subordinação jurídica;

III - trabalho híbrido: modalidade que combina trabalho presencial e remoto.

Art. 3º O trabalho remoto deve ser regulamentado por acordo individual ou coletivo, que deve conter:

I - especificação das atividades que podem ser realizadas remotamente;

II - regime de compensação de horas, quando aplicável;

III - responsabilidades do empregador e do empregado;

IV - forma de controle da jornada de trabalho;

V - responsabilidade pelos custos com equipamentos e infraestrutura.`,
    keywords: ['trabalho remoto', 'teletrabalho', 'híbrido', 'jornada', 'acordo'],
    source: 'Diário Oficial da União'
  }
]

export function RecentLawsModal({ isOpen, onClose, onLawSelect }: RecentLawsModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const categories = [
    { value: '', label: 'Todas as categorias' },
    { value: 'Empresarial', label: 'Empresarial' },
    { value: 'Tecnologia', label: 'Tecnologia' },
    { value: 'Privacidade', label: 'Privacidade' },
    { value: 'Trabalhista', label: 'Trabalhista' },
    { value: 'Civil', label: 'Civil' }
  ]

  const filteredLaws = recentLaws.filter(law => {
    const matchesSearch = law.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         law.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         law.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = !selectedCategory || law.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const handleLawSelect = (law: RecentLaw) => {
    onLawSelect(law.content)
    onClose()
  }

  const handleCopy = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Erro ao copiar:', err)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'Empresarial': 'bg-blue-100 text-blue-800',
      'Tecnologia': 'bg-purple-100 text-purple-800',
      'Privacidade': 'bg-green-100 text-green-800',
      'Trabalhista': 'bg-orange-100 text-orange-800',
      'Civil': 'bg-red-100 text-red-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[85vh] overflow-y-auto overflow-x-hidden p-6 sm:p-8 rounded-xl">
        <DialogHeader>
          <DialogTitle>
            <TrendingUp className="w-5 h-5" />
            Leis Recentes
          </DialogTitle>
          <DialogDescription>
            Acompanhe as últimas leis e regulamentações publicadas
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
              <Input
                placeholder="Pesquisar leis recentes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-secondary-300 rounded-md text-sm"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Laws Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredLaws.map((law) => (
              <Card key={law.id} className="hover:bg-secondary-50 transition-colors">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{law.title}</CardTitle>
                      <CardDescription className="mt-1">{law.description}</CardDescription>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Badge className={`text-xs ${getCategoryColor(law.category)}`}>
                        {law.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-secondary-500">
                        <Calendar className="w-3 h-3" />
                        {formatDate(law.date)}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {law.keywords.slice(0, 3).map((keyword) => (
                      <Badge key={keyword} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-xs text-secondary-500 mb-4">
                    Fonte: {law.source}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(law.content, law.id)}
                    >
                      {copiedId === law.id ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleLawSelect(law)}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Inserir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

