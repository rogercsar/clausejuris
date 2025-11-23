import { useState } from 'react'
import { FileText, Copy, Check, Search } from 'lucide-react'
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

interface Template {
  id: string
  name: string
  category: string
  description: string
  content: string
  keywords: string[]
  isPro: boolean
}

interface TemplatesModalProps {
  isOpen: boolean
  onClose: () => void
  onTemplateSelect: (content: string) => void
  context?: any
}

const templates: Template[] = [
  {
    id: '1',
    name: 'Petição Inicial - Ação de Cobrança',
    category: 'Civil',
    description: 'Modelo para ação de cobrança de valores',
    content: `EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA [VARA CÍVEL] DA COMARCA DE [CIDADE/ESTADO]

AÇÃO DE COBRANÇA

[CLIENTE], [nacionalidade], [estado civil], [profissão], portador do RG nº [NÚMERO] e CPF nº [NÚMERO], residente e domiciliado na [ENDEREÇO], vem respeitosamente à presença de Vossa Excelência, por intermédio de seu advogado infra-assinado, propor em face de [RÉU] a presente

AÇÃO DE COBRANÇA

em face dos fatos e fundamentos a seguir expostos:

DOS FATOS

1. O autor e o réu celebraram contrato de [TIPO DE CONTRATO] em [DATA], pelo qual o réu se obrigou a [OBRIGAÇÃO].

2. O contrato estabelecia o pagamento de [VALOR] em [FORMA DE PAGAMENTO].

3. O réu não cumpriu com suas obrigações contratuais, deixando de efetuar o pagamento no prazo estipulado.

4. O autor, por diversas vezes, tentou cobrar o valor em atraso, sem sucesso.

5. O valor em aberto, acrescido de juros e correção monetária, totaliza [VALOR TOTAL].

DO DIREITO

6. O inadimplemento contratual gera o dever de indenizar, conforme preceitua o art. 389 do Código Civil.

7. A mora do devedor gera juros de mora e correção monetária, nos termos do art. 404 do Código Civil.

8. O autor tem direito à cobrança do valor principal, juros e correção monetária.

DO PEDIDO

Diante do exposto, requer a Vossa Excelência:

a) Seja o réu condenado ao pagamento da quantia de [VALOR TOTAL];

b) Seja o réu condenado ao pagamento de juros de mora de 1% ao mês, a partir do vencimento;

c) Seja o réu condenado ao pagamento de correção monetária;

d) Seja o réu condenado ao pagamento de honorários advocatícios de 10% sobre o valor da condenação;

e) Seja o réu condenado ao pagamento das custas processuais.

Protesta pela produção de todas as provas em direito admitidas, especialmente a documental e testemunhal.

Pede deferimento.

[CIDADE], [DATA]

[ASSINATURA DO ADVOGADO]
OAB/[ESTADO] Nº [NÚMERO]`,
    keywords: ['petição', 'cobrança', 'civil', 'contrato', 'inadimplemento'],
    isPro: true
  },
  {
    id: '2',
    name: 'Contrato de Prestação de Serviços',
    category: 'Contratos',
    description: 'Modelo para contrato de prestação de serviços',
    content: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS

Pelo presente instrumento particular, de um lado [CONTRATANTE], [nacionalidade], [estado civil], [profissão], portador do RG nº [NÚMERO] e CPF nº [NÚMERO], residente e domiciliado na [ENDEREÇO], e de outro lado [CONTRATADO], [nacionalidade], [estado civil], [profissão], portador do RG nº [NÚMERO] e CPF nº [NÚMERO], residente e domiciliado na [ENDEREÇO], têm entre si justo e acordado o seguinte:

CLÁUSULA PRIMEIRA - DO OBJETO
O CONTRATADO se compromete a prestar os seguintes serviços: [DESCRIÇÃO DOS SERVIÇOS].

CLÁUSULA SEGUNDA - DO PRAZO
O presente contrato terá vigência de [PRAZO], iniciando-se em [DATA INICIAL] e terminando em [DATA FINAL].

CLÁUSULA TERCEIRA - DO VALOR
O valor total dos serviços será de R$ [VALOR] ([VALOR POR EXTENSO]), a ser pago da seguinte forma: [FORMA DE PAGAMENTO].

CLÁUSULA QUARTA - DAS OBRIGAÇÕES DO CONTRATANTE
São obrigações do CONTRATANTE:
a) Efetuar o pagamento nas datas acordadas;
b) Fornecer as informações necessárias para a execução dos serviços;
c) [OUTRAS OBRIGAÇÕES].

CLÁUSULA QUINTA - DAS OBRIGAÇÕES DO CONTRATADO
São obrigações do CONTRATADO:
a) Executar os serviços com qualidade e dentro do prazo;
b) Manter sigilo sobre informações confidenciais;
c) [OUTRAS OBRIGAÇÕES].

CLÁUSULA SEXTA - DA RESCISÃO
O presente contrato poderá ser rescindido por qualquer das partes mediante aviso prévio de [PRAZO] dias.

CLÁUSULA SÉTIMA - DAS DISPOSIÇÕES GERAIS
Fica eleito o foro da comarca de [CIDADE] para dirimir quaisquer questões oriundas do presente contrato.

E por estarem assim justos e contratados, firmam o presente instrumento em [NÚMERO] vias de igual teor e forma.

[CIDADE], [DATA]

[ASSINATURA DO CONTRATANTE]          [ASSINATURA DO CONTRATADO]

[CONTRATANTE]                         [CONTRATADO]
CPF: [NÚMERO]                         CPF: [NÚMERO]`,
    keywords: ['contrato', 'serviços', 'prestação', 'obrigações', 'prazo'],
    isPro: true
  },
  {
    id: '3',
    name: 'Reclamação Trabalhista',
    category: 'Trabalhista',
    description: 'Modelo para reclamação trabalhista',
    content: `VARA DO TRABALHO DE [CIDADE/ESTADO]

RECLAMAÇÃO TRABALHISTA

RECLAMANTE: [NOME DO EMPREGADO]
RECLAMADO: [NOME DA EMPRESA]

Aos [DIA] dias do mês de [MÊS] de [ANO], perante esta Vara do Trabalho, vem o RECLAMANTE, por intermédio de seu advogado infra-assinado, propor em face do RECLAMADO a presente

RECLAMAÇÃO TRABALHISTA

em face dos fatos e fundamentos a seguir expostos:

DOS FATOS

1. O reclamante trabalhou para o reclamado no período de [DATA INICIAL] a [DATA FINAL], exercendo a função de [FUNÇÃO].

2. O reclamante tinha salário de R$ [VALOR] ([VALOR POR EXTENSO]).

3. O reclamante trabalhava [HORAS] horas por dia, [DIAS] dias por semana.

4. O reclamado não efetuou o pagamento das verbas trabalhistas devidas.

5. O reclamante tem direito ao recebimento das seguintes verbas:
   - Salários atrasados;
   - Horas extras;
   - Adicional noturno;
   - 13º salário;
   - Férias + 1/3;
   - FGTS;
   - Multa do art. 477 da CLT;
   - Aviso prévio;
   - [OUTRAS VERBAS].

DO DIREITO

6. A relação de emprego gera direitos trabalhistas, conforme preceitua a CLT.

7. O não pagamento das verbas trabalhistas gera o dever de indenizar.

8. O reclamante tem direito ao recebimento de todas as verbas devidas.

DO PEDIDO

Diante do exposto, requer a Vossa Excelência:

a) Seja o reclamado condenado ao pagamento das verbas trabalhistas em aberto;

b) Seja o reclamado condenado ao pagamento de juros de mora de 1% ao mês;

c) Seja o reclamado condenado ao pagamento de correção monetária;

d) Seja o reclamado condenado ao pagamento de honorários advocatícios de 10% sobre o valor da condenação;

e) Seja o reclamado condenado ao pagamento das custas processuais.

Protesta pela produção de todas as provas em direito admitidas.

Pede deferimento.

[CIDADE], [DATA]

[ASSINATURA DO ADVOGADO]
OAB/[ESTADO] Nº [NÚMERO]`,
    keywords: ['reclamação', 'trabalhista', 'CLT', 'verbas', 'salário'],
    isPro: true
  },
  {
    id: '4',
    name: 'Contrato de Locação',
    category: 'Contratos',
    description: 'Modelo para contrato de locação residencial',
    content: `CONTRATO DE LOCAÇÃO RESIDENCIAL

Pelo presente instrumento particular, de um lado [LOCADOR], [nacionalidade], [estado civil], [profissão], portador do RG nº [NÚMERO] e CPF nº [NÚMERO], residente e domiciliado na [ENDEREÇO], e de outro lado [LOCATÁRIO], [nacionalidade], [estado civil], [profissão], portador do RG nº [NÚMERO] e CPF nº [NÚMERO], residente e domiciliado na [ENDEREÇO], têm entre si justo e acordado o seguinte:

CLÁUSULA PRIMEIRA - DO OBJETO
O LOCADOR loca ao LOCATÁRIO o imóvel situado na [ENDEREÇO COMPLETO], com as seguintes características: [CARACTERÍSTICAS DO IMÓVEL].

CLÁUSULA SEGUNDA - DO PRAZO
O presente contrato terá vigência de [PRAZO], iniciando-se em [DATA INICIAL] e terminando em [DATA FINAL].

CLÁUSULA TERCEIRA - DO VALOR
O valor do aluguel será de R$ [VALOR] ([VALOR POR EXTENSO]), a ser pago até o dia [DIA] de cada mês.

CLÁUSULA QUARTA - DAS OBRIGAÇÕES DO LOCATÁRIO
São obrigações do LOCATÁRIO:
a) Efetuar o pagamento do aluguel em dia;
b) Manter o imóvel em bom estado de conservação;
c) Não sublocar ou ceder o imóvel sem autorização;
d) [OUTRAS OBRIGAÇÕES].

CLÁUSULA QUINTA - DAS OBRIGAÇÕES DO LOCADOR
São obrigações do LOCADOR:
a) Entregar o imóvel em condições de uso;
b) Efetuar reparos de responsabilidade do locador;
c) [OUTRAS OBRIGAÇÕES].

CLÁUSULA SEXTA - DA RESCISÃO
O presente contrato poderá ser rescindido por qualquer das partes mediante aviso prévio de [PRAZO] dias.

CLÁUSULA SÉTIMA - DAS DISPOSIÇÕES GERAIS
Fica eleito o foro da comarca de [CIDADE] para dirimir quaisquer questões oriundas do presente contrato.

E por estarem assim justos e contratados, firmam o presente instrumento em [NÚMERO] vias de igual teor e forma.

[CIDADE], [DATA]

[ASSINATURA DO LOCADOR]              [ASSINATURA DO LOCATÁRIO]

[LOCADOR]                             [LOCATÁRIO]
CPF: [NÚMERO]                         CPF: [NÚMERO]`,
    keywords: ['contrato', 'locação', 'residencial', 'aluguel', 'imóvel'],
    isPro: false
  }
  ,{
    id: '5',
    name: 'Ação de Alimentos',
    category: 'Família',
    description: 'Modelo com pedidos de alimentos provisórios e definitivos',
    content: `AÇÃO DE ALIMENTOS\n\nDos Fatos: ...\nDo Direito: ...\nPedidos: alimentos provisórios, definitivos, custas...`,
    keywords: ['família', 'alimentos', 'provisório', 'definitivo'],
    isPro: true
  }
  ,{
    id: '6',
    name: 'Divórcio Consensual',
    category: 'Família',
    description: 'Modelo com partilha, guarda e pensão',
    content: `DIVÓRCIO CONSENSUAL\n\nPartilha: ...\nGuarda: ...\nPensão: ...\nForo: ...`,
    keywords: ['família', 'divórcio', 'consensual', 'guarda'],
    isPro: false
  }
  ,{
    id: '7',
    name: 'Contestação (Civil)',
    category: 'Civil',
    description: 'Estrutura de defesa com preliminares e mérito',
    content: `CONTESTAÇÃO\n\nPreliminares: ...\nMérito: ...\nProvas: ...\nPedidos: ...`,
    keywords: ['contestação', 'defesa', 'civil'],
    isPro: false
  }
  ,{
    id: '8',
    name: 'Mandado de Segurança',
    category: 'Civil',
    description: 'Fundamento constitucional e prova pré-constituída',
    content: `MANDADO DE SEGURANÇA\n\nAutoridade coatora: ...\nDireito líquido e certo: ...\nPedidos: liminar, notificação, informações...`,
    keywords: ['mandado', 'segurança', 'liminar'],
    isPro: true
  }
  ,{
    id: '9',
    name: 'NDA - Acordo de Confidencialidade',
    category: 'Contratos',
    description: 'Sigilo, penalidades e prazo',
    content: `NDA\n\nDefinições: ...\nObrigações: ...\nPenalidades: ...\nPrazo: ...\nForo: ...`,
    keywords: ['nda', 'sigilo', 'confidencialidade'],
    isPro: false
  }
  ,{
    id: '10',
    name: 'Procuração',
    category: 'Civil',
    description: 'Poderes específicos e prazo de validade',
    content: `PROCURAÇÃO\n\nOutorgante: ...\nOutorgado: ...\nPoderes: ...\nPrazo: ...`,
    keywords: ['procuração', 'poderes', 'outorga'],
    isPro: false
  }
]

export function TemplatesModal({ isOpen, onClose, onTemplateSelect }: TemplatesModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const categories = [
    { value: '', label: 'Todas as categorias' },
    { value: 'Civil', label: 'Civil' },
    { value: 'Contratos', label: 'Contratos' },
    { value: 'Trabalhista', label: 'Trabalhista' },
    { value: 'Criminal', label: 'Criminal' },
    { value: 'Família', label: 'Família' }
  ]

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = !selectedCategory || template.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const handleTemplateSelect = (template: Template) => {
    onTemplateSelect(template.content)
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
      'Civil': 'bg-blue-100 text-blue-800',
      'Contratos': 'bg-green-100 text-green-800',
      'Trabalhista': 'bg-orange-100 text-orange-800',
      'Criminal': 'bg-red-100 text-red-800',
      'Família': 'bg-pink-100 text-pink-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[85vh] overflow-y-auto overflow-x-hidden p-6 sm:p-8 rounded-xl">
        <DialogHeader>
          <DialogTitle>
            <FileText className="w-5 h-5" />
            Modelos Jurídicos
          </DialogTitle>
          <DialogDescription>
            Selecione um modelo para inserir em seu documento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
              <Input
                placeholder="Pesquisar modelos..."
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

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="hover:bg-secondary-50 transition-colors">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={`text-xs ${getCategoryColor(template.category)}`}>
                        {template.category}
                      </Badge>
                      {template.isPro && (
                        <Badge variant="outline" className="text-xs text-primary-600">
                          PRO
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {template.keywords.slice(0, 3).map((keyword) => (
                      <Badge key={keyword} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(template.content, template.id)}
                    >
                      {copiedId === template.id ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <FileText className="w-4 h-4 mr-2" />
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

