import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { 
  Zap, 
  BookOpen, 
  Lightbulb, 
  CheckCircle, 
  FileText,
  Clock
} from 'lucide-react'
import type { EditorSuggestion, Process, Contract } from '@/types'

interface ProFeaturesProps {
  suggestions: EditorSuggestion[]
  onSuggestionAccept: (suggestion: EditorSuggestion) => void
  onTemplateSelect?: (template: string) => void
  onLawSelect?: (law: string) => void
  context?: Process | Contract | null
}

export function ProFeatures({ suggestions, onSuggestionAccept, onTemplateSelect, onLawSelect, context }: ProFeaturesProps) {
  
  // Função para gerar modelos baseados no contexto
  const getContextualTemplates = () => {
    const baseTemplates = [
      { 
        name: 'Contrato de Locação', 
        description: 'Modelo padrão para contratos de locação',
        content: `CONTRATO DE LOCAÇÃO

LOCADOR: [Nome completo], [nacionalidade], [estado civil], [profissão], portador do RG nº [número] e CPF nº [número], residente e domiciliado na [endereço completo].

LOCATÁRIO: [Nome completo], [nacionalidade], [estado civil], [profissão], portador do RG nº [número] e CPF nº [número], residente e domiciliado na [endereço completo].

OBJETO: O presente contrato tem por objeto a locação do imóvel situado na [endereço completo], constituído de [descrição do imóvel].

PRAZO: O presente contrato terá vigência de [período], iniciando-se em [data] e findando-se em [data].

VALOR: O valor da locação é de R$ [valor] ([valor por extenso]), a ser pago até o dia [dia] de cada mês.

CONDIÇÕES GERAIS:
1. O locatário se compromete a pagar pontualmente o aluguel;
2. O locatário não poderá sublocar ou ceder o imóvel;
3. O locatário deverá manter o imóvel em bom estado de conservação.

[Local e data]

_________________        _________________
LOCADOR                   LOCATÁRIO`
      },
      { 
        name: 'Petição Inicial', 
        description: 'Modelo para petições iniciais',
        content: `EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA [VARA] DA COMARCA DE [CIDADE]

AUTOR: [Nome completo], [nacionalidade], [estado civil], [profissão], portador do RG nº [número] e CPF nº [número], residente e domiciliado na [endereço completo].

RÉU: [Nome completo], [nacionalidade], [estado civil], [profissão], portador do RG nº [número] e CPF nº [número], residente e domiciliado na [endereço completo].

AÇÃO DE [TIPO DA AÇÃO]

Vem respeitosamente à presença de Vossa Excelência, por intermédio de seu advogado que esta subscreve, propor em face de [nome do réu], a presente

AÇÃO DE [TIPO DA AÇÃO]

I - DOS FATOS

[Descrever os fatos que deram origem à ação]

II - DO DIREITO

[Fundamentação jurídica]

III - DO PEDIDO

Diante do exposto, requer a Vossa Excelência:

a) Seja o réu condenado a [pedido principal];
b) Seja condenado ao pagamento de honorários advocatícios;
c) Seja condenado ao pagamento das custas processuais.

Protesta pela produção de todas as provas em direito admitidas, especialmente a documental, testemunhal e pericial.

[Local e data]

_________________
[Nome do Advogado]
OAB [número]`
      },
      { 
        name: 'Contrato de Prestação de Serviços', 
        description: 'Modelo para contratos de serviços',
        content: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS

CONTRATANTE: [Nome completo], [nacionalidade], [estado civil], [profissão], portador do RG nº [número] e CPF nº [número], residente e domiciliado na [endereço completo].

CONTRATADO: [Nome completo], [nacionalidade], [estado civil], [profissão], portador do RG nº [número] e CPF nº [número], residente e domiciliado na [endereço completo].

OBJETO: O presente contrato tem por objeto a prestação de serviços de [descrição dos serviços] pelo CONTRATADO ao CONTRATANTE.

PRAZO: O presente contrato terá vigência de [período], iniciando-se em [data] e findando-se em [data].

VALOR: O valor dos serviços é de R$ [valor] ([valor por extenso]), a ser pago [forma de pagamento].

OBRIGAÇÕES DO CONTRATADO:
1. Executar os serviços com diligência e competência;
2. Observar os prazos estabelecidos;
3. Manter sigilo sobre informações confidenciais.

OBRIGAÇÕES DO CONTRATANTE:
1. Fornecer as informações necessárias;
2. Efetuar o pagamento nos prazos acordados;
3. Colaborar para a execução dos serviços.

[Local e data]

_________________        _________________
CONTRATANTE               CONTRATADO`
      },
      { 
        name: 'Termo de Acordo', 
        description: 'Modelo para termos de acordo',
        content: `TERMO DE ACORDO

PARTE 1: [Nome completo], [nacionalidade], [estado civil], [profissão], portador do RG nº [número] e CPF nº [número], residente e domiciliado na [endereço completo].

PARTE 2: [Nome completo], [nacionalidade], [estado civil], [profissão], portador do RG nº [número] e CPF nº [número], residente e domiciliado na [endereço completo].

OBJETO: As partes acima identificadas, por livre e espontânea vontade, resolvem celebrar o presente TERMO DE ACORDO, com o objetivo de [objetivo do acordo].

CLÁUSULA PRIMEIRA - DO OBJETO
[Descrever o objeto do acordo]

CLÁUSULA SEGUNDA - DAS OBRIGAÇÕES
[Descrever as obrigações de cada parte]

CLÁUSULA TERCEIRA - DO PRAZO
O presente acordo terá vigência de [período], iniciando-se em [data].

CLÁUSULA QUARTA - DAS PENALIDADES
[Descrever as penalidades em caso de descumprimento]

CLÁUSULA QUINTA - DA RESCISÃO
[Descrever as condições para rescisão]

[Local e data]

_________________        _________________
PARTE 1                   PARTE 2`
      },
    ]

    if (!context) return baseTemplates

    // Personalizar modelos baseados no contexto
    const contextualTemplates = baseTemplates.map(template => {
      let personalizedContent = template.content

      if ('status' in context) {
        // É um processo
        const process = context as Process
        
        // Personalizar petição inicial
        if (template.name === 'Petição Inicial') {
          personalizedContent = personalizedContent
            .replace(/\[Nome completo\]/g, process.clientName)
            .replace(/\[nome do réu\]/g, process.againstWho || '[Nome do réu]')
            .replace(/\[VARA\]/g, process.court || '[VARA]')
            .replace(/\[TIPO DA AÇÃO\]/g, process.type.toUpperCase())
            .replace(/\[Nome do Advogado\]/g, process.lawyer || '[Nome do Advogado]')
            .replace(/\[número\]/g, process.caseNumber || '[número]')
        }
      } else {
        // É um contrato
        const contract = context as Contract
        
        // Personalizar contratos
        if (template.name.includes('Contrato')) {
          personalizedContent = personalizedContent
            .replace(/\[Nome completo\]/g, contract.clientName)
            .replace(/\[valor\]/g, contract.value.toLocaleString('pt-BR'))
            .replace(/\[valor por extenso\]/g, `R$ ${contract.value.toLocaleString('pt-BR')}`)
            .replace(/\[data\]/g, contract.startDate)
        }
      }

      return {
        ...template,
        content: personalizedContent,
        description: context ? `${template.description} - Personalizado para ${context.clientName}` : template.description
      }
    })

    return contextualTemplates
  }

  // Função para gerar leis baseadas no contexto
  const getContextualLaws = () => {
    const baseLaws = [
      { 
        name: 'Código Civil - Art. 1.723', 
        description: 'Contrato de locação',
        content: `Art. 1.723. A locação de imóvel urbano destina-se à moradia, ao comércio, à indústria, ao uso profissional ou a fins não lucrativos.

§ 1º A locação de imóvel urbano destina-se à moradia quando o imóvel for utilizado para fins residenciais.

§ 2º A locação de imóvel urbano destina-se ao comércio quando o imóvel for utilizado para fins comerciais.

§ 3º A locação de imóvel urbano destina-se à indústria quando o imóvel for utilizado para fins industriais.

§ 4º A locação de imóvel urbano destina-se ao uso profissional quando o imóvel for utilizado para fins profissionais.

§ 5º A locação de imóvel urbano destina-se a fins não lucrativos quando o imóvel for utilizado para fins não lucrativos.`
      },
      { 
        name: 'CLT - Art. 7º', 
        description: 'Direitos dos trabalhadores',
        content: `Art. 7º São direitos dos trabalhadores urbanos e rurais, além de outros que visem à melhoria de sua condição social:

I - relação de emprego protegida contra despedida arbitrária ou sem justa causa, nos termos de lei complementar, que preverá indenização compensatória, dentre outros direitos;

II - seguro-desemprego, em caso de desemprego involuntário;

III - fundo de garantia do tempo de serviço;

IV - salário mínimo, fixado em lei, nacionalmente unificado, capaz de atender às suas necessidades vitais básicas e às de sua família com moradia, alimentação, educação, saúde, lazer, vestuário, higiene, transporte e previdência social, com reajustes periódicos que lhe preservem o poder aquisitivo, sendo vedada sua vinculação para qualquer fim;

V - piso salarial proporcional à extensão e à complexidade do trabalho;

VI - irredutibilidade do salário, salvo o disposto em convenção ou acordo coletivo;

VII - garantia de salário, nunca inferior ao mínimo, para os que percebem remuneração variável;

VIII - décimo terceiro salário com base na remuneração integral ou no valor da aposentadoria;

IX - remuneração do trabalho noturno superior à do diurno;

X - proteção do salário na forma da lei, constituindo crime sua retenção dolosa;

XI - participação nos lucros, ou resultados, desvinculada da remuneração, e, excepcionalmente, participação na gestão da empresa, conforme definido em lei;

XII - salário-família pago em razão do dependente do trabalhador de baixa renda nos termos da lei;

XIII - duração do trabalho normal não superior a oito horas diárias e quarenta e quatro semanais, facultada a compensação de horários e a redução da jornada, mediante acordo ou convenção coletiva de trabalho;

XIV - jornada de seis horas para o trabalho realizado em turnos ininterruptos de revezamento, salvo negociação coletiva;

XV - repouso semanal remunerado, preferencialmente aos domingos;

XVI - remuneração do serviço extraordinário superior, no mínimo, em cinquenta por cento à do normal;

XVII - gozo de férias anuais remuneradas com, pelo menos, um terço a mais do que o salário normal;

XVIII - licença à gestante, sem prejuízo do emprego e do salário, com a duração de cento e vinte dias;

XIX - licença-paternidade, nos termos fixados em lei;

XX - proteção do mercado de trabalho da mulher, mediante incentivos específicos, nos termos da lei;

XXI - aviso prévio proporcional ao tempo de serviço, sendo no mínimo de trinta dias, nos termos da lei;

XXII - redução dos riscos inerentes ao trabalho, por meio de normas de saúde, higiene e segurança;

XXIII - adicional de remuneração para as atividades penosas, insalubres ou perigosas, na forma da lei;

XXIV - aposentadoria;

XXV - assistência gratuita aos filhos e dependentes desde o nascimento até cinco anos de idade em creches e pré-escolas;

XXVI - reconhecimento das convenções e acordos coletivos de trabalho;

XXVII - proteção em face da automação, na forma da lei;

XXVIII - seguro contra acidentes de trabalho, a cargo do empregador, sem excluir a indenização a que este está obrigado, quando incorrer em dolo ou culpa;

XXIX - ação, quanto aos créditos resultantes das relações de trabalho, com prazo prescricional de cinco anos para os trabalhadores urbanos e rurais, até o limite de dois anos após a extinção do contrato de trabalho;

XXX - proibição de diferença de salários, de exercício de funções e de critério de admissão por motivo de sexo, idade, cor ou estado civil;

XXXI - proibição de qualquer discriminação no tocante a salário e critérios de admissão do trabalhador portador de deficiência;

XXXII - proibição de trabalho noturno, perigoso ou insalubre a menores de dezoito e de qualquer trabalho a menores de dezesseis anos, salvo na condição de aprendiz, a partir de quatorze anos;

XXXIII - igualdade de direitos entre o trabalhador com vínculo empregatício permanente e o trabalhador avulso.`
      },
      { 
        name: 'CPC - Art. 319', 
        description: 'Petição inicial',
        content: `Art. 319. A petição inicial indicará:

I - o juízo para o qual é dirigida;

II - os nomes, os prenomes, o estado civil, a existência de união estável, a profissão, o número de inscrição no Cadastro de Pessoas Físicas (CPF) ou no Cadastro Nacional da Pessoa Jurídica (CNPJ), o endereço eletrônico, o domicílio e a residência do autor e do réu;

III - os fatos e os fundamentos jurídicos do pedido;

IV - o pedido com suas especificações;

V - o valor da causa;

VI - as provas com que o autor pretende demonstrar a verdade dos fatos alegados;

VII - a opção do autor pela realização ou não de audiência de conciliação ou de mediação;

VIII - o requerimento para a citação do réu.

§ 1º A petição inicial será instruída com os documentos indispensáveis à propositura da ação.

§ 2º A petição inicial indicará, quando for o caso, a existência de processo em curso ou de outro já julgado entre as mesmas partes, versando sobre a mesma causa de pedir.

§ 3º A petição inicial indicará, quando for o caso, a existência de processo em curso ou de outro já julgado entre as mesmas partes, versando sobre a mesma causa de pedir.

§ 4º A petição inicial indicará, quando for o caso, a existência de processo em curso ou de outro já julgado entre as mesmas partes, versando sobre a mesma causa de pedir.`
      },
    ]

    if (!context) return baseLaws

    // Filtrar e personalizar leis baseadas no contexto
    let contextualLaws = baseLaws

    if ('status' in context) {
      // É um processo - mostrar leis relevantes para o tipo de processo
      const process = context as Process
      
      if (process.type === 'labor') {
        // Processo trabalhista - priorizar CLT
        contextualLaws = baseLaws.filter(law => law.name.includes('CLT'))
      } else if (process.type === 'civil') {
        // Processo civil - priorizar Código Civil e CPC
        contextualLaws = baseLaws.filter(law => 
          law.name.includes('Código Civil') || law.name.includes('CPC')
        )
      }
    } else {
      // É um contrato - mostrar leis relevantes para contratos
      const contract = context as Contract
      
      if (contract.type === 'rental') {
        // Contrato de locação - priorizar Código Civil
        contextualLaws = baseLaws.filter(law => law.name.includes('Código Civil'))
      } else if (contract.type === 'service') {
        // Contrato de serviços - mostrar leis gerais de contratos
        contextualLaws = baseLaws.filter(law => 
          law.name.includes('Código Civil') || law.name.includes('CPC')
        )
      }
    }

    return contextualLaws
  }

  const legalTemplates = getContextualTemplates()
  const recentLaws = getContextualLaws()

  return (
    <div className="space-y-4">
      {/* AI Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="w-5 h-5 text-blue-600" />
            Sugestões da IA
            {context && (
              <Badge variant="outline" className="text-xs">
                Contextual
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Sugestões inteligentes baseadas no contexto
          </CardDescription>
        </CardHeader>
        <CardContent>
          {suggestions.length === 0 ? (
            <div className="text-center py-4 text-secondary-500">
              <Lightbulb className="w-8 h-8 mx-auto mb-2 text-secondary-300" />
              <p className="text-sm">Digite para receber sugestões</p>
            </div>
          ) : (
            <div className="space-y-2">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="p-3 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge 
                          variant={suggestion.type === 'autocomplete' ? 'success' : 'warning'}
                          className="text-xs"
                        >
                          {suggestion.type === 'autocomplete' ? 'Sugestão' : 'Correção'}
                        </Badge>
                        <span className="text-xs text-secondary-500">
                          {Math.round(suggestion.confidence * 100)}% confiança
                        </span>
                      </div>
                      <p className="text-sm font-medium text-secondary-900">
                        {suggestion.text}
                      </p>
                      {suggestion.replacement && (
                        <p className="text-sm text-secondary-600 mt-1">
                          → {suggestion.replacement}
                        </p>
                      )}
                      {suggestion.description && (
                        <p className="text-xs text-secondary-500 mt-1">
                          {suggestion.description}
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSuggestionAccept(suggestion)}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legal Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5 text-green-600" />
            Modelos Jurídicos
            {context && (
              <Badge variant="outline" className="text-xs">
                Personalizados
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {context 
              ? `Templates personalizados para ${context.clientName}`
              : 'Templates prontos para documentos jurídicos'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {legalTemplates.map((template, index) => (
              <div
                key={index}
                className="p-3 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-900">
                      {template.name}
                    </p>
                    <p className="text-xs text-secondary-600">
                      {template.description}
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => onTemplateSelect?.(template.content)}
                  >
                    Usar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Laws */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="w-5 h-5 text-purple-600" />
            Leis Recentes
            {context && (
              <Badge variant="outline" className="text-xs">
                Relevantes
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {context 
              ? `Leis relevantes para ${('status' in context) ? 'processo' : 'contrato'} ${('status' in context) ? 'processo' : 'contrato'}`
              : 'Artigos de lei mais utilizados'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentLaws.map((law, index) => (
              <div
                key={index}
                className="p-3 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-900">
                      {law.name}
                    </p>
                    <p className="text-xs text-secondary-600">
                      {law.description}
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => onLawSelect?.(law.content)}
                  >
                    Inserir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Writing Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5 text-orange-600" />
            Estatísticas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary-600">0</p>
              <p className="text-xs text-secondary-600">Palavras</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-600">0</p>
              <p className="text-xs text-secondary-600">Caracteres</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
