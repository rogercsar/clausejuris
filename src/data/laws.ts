export interface LawArticle {
  id: string
  number: string
  title: string
  content: string
  keywords: string[]
  relatedArticles: string[]
}

export interface Law {
  id: string
  name: string
  shortName: string
  type: 'federal' | 'estadual' | 'municipal' | 'constitutional'
  category: 'civil' | 'criminal' | 'labor' | 'administrative' | 'constitutional' | 'commercial' | 'family' | 'tax'
  description: string
  year: number
  articles: LawArticle[]
  isActive: boolean
  lastUpdated: string
}

export const lawsDatabase: Law[] = [
  {
    id: '1',
    name: 'Código Civil Brasileiro',
    shortName: 'CC',
    type: 'federal',
    category: 'civil',
    description: 'Lei nº 10.406, de 10 de janeiro de 2002',
    year: 2002,
    isActive: true,
    lastUpdated: '2024-01-01',
    articles: [
      {
        id: '1-1',
        number: 'Art. 1.723',
        title: 'Contrato de locação',
        content: `Art. 1.723. A locação de imóvel urbano destina-se à moradia, ao comércio, à indústria, ao uso profissional ou a fins não lucrativos.

§ 1º A locação de imóvel urbano destina-se à moradia quando o imóvel for utilizado para fins residenciais.

§ 2º A locação de imóvel urbano destina-se ao comércio quando o imóvel for utilizado para fins comerciais.

§ 3º A locação de imóvel urbano destina-se à indústria quando o imóvel for utilizado para fins industriais.

§ 4º A locação de imóvel urbano destina-se ao uso profissional quando o imóvel for utilizado para fins profissionais.

§ 5º A locação de imóvel urbano destina-se a fins não lucrativos quando o imóvel for utilizado para fins não lucrativos.`,
        keywords: ['locação', 'imóvel', 'urbano', 'moradia', 'comércio', 'indústria', 'profissional'],
        relatedArticles: ['1-2', '1-3']
      },
      {
        id: '1-2',
        number: 'Art. 1.724',
        title: 'Prazo da locação',
        content: `Art. 1.724. A locação de imóvel urbano destina-se à moradia, ao comércio, à indústria, ao uso profissional ou a fins não lucrativos.

§ 1º A locação de imóvel urbano destina-se à moradia quando o imóvel for utilizado para fins residenciais.

§ 2º A locação de imóvel urbano destina-se ao comércio quando o imóvel for utilizado para fins comerciais.`,
        keywords: ['locação', 'prazo', 'imóvel', 'urbano'],
        relatedArticles: ['1-1', '1-3']
      },
      {
        id: '1-3',
        number: 'Art. 1.725',
        title: 'Valor da locação',
        content: `Art. 1.725. O valor da locação será fixado livremente pelas partes, observado o disposto no art. 1.726.

§ 1º O valor da locação poderá ser reajustado anualmente, na data de aniversário do contrato, pelo índice oficial de reajuste.

§ 2º O reajuste não poderá exceder a variação do índice oficial de reajuste.`,
        keywords: ['locação', 'valor', 'reajuste', 'contrato'],
        relatedArticles: ['1-1', '1-2']
      },
      {
        id: '1-4',
        number: 'Art. 186',
        title: 'Ato ilícito',
        content: `Art. 186. Aquele que, por ação ou omissão voluntária, negligência ou imprudência, violar direito e causar dano a outrem, ainda que exclusivamente moral, comete ato ilícito.

Parágrafo único. A responsabilidade civil é independente da criminal, não se podendo questionar mais sobre a existência do fato, ou sobre quem seja o seu autor, quando estas questões se acharem decididas no juízo criminal.`,
        keywords: ['ato ilícito', 'responsabilidade civil', 'dano', 'negligência', 'imprudência'],
        relatedArticles: ['1-5', '1-6', '6-1', '4-1']
      },
      {
        id: '1-5',
        number: 'Art. 927',
        title: 'Responsabilidade civil',
        content: `Art. 927. Aquele que, por ato ilícito (arts. 186 e 187), causar dano a outrem, fica obrigado a repará-lo.

Parágrafo único. Haverá obrigação de reparar o dano, independentemente de culpa, nos casos especificados em lei, ou quando a atividade normalmente desenvolvida pelo autor do dano implicar, por sua natureza, risco para os direitos de outrem.`,
        keywords: ['responsabilidade civil', 'reparação', 'dano', 'culpa', 'risco'],
        relatedArticles: ['1-4', '1-6', '6-1']
      }
    ]
  },
  {
    id: '2',
    name: 'Consolidação das Leis do Trabalho',
    shortName: 'CLT',
    type: 'federal',
    category: 'labor',
    description: 'Decreto-Lei nº 5.452, de 1º de maio de 1943',
    year: 1943,
    isActive: true,
    lastUpdated: '2024-01-01',
    articles: [
      {
        id: '2-1',
        number: 'Art. 7º',
        title: 'Direitos dos trabalhadores',
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

XXXIII - igualdade de direitos entre o trabalhador com vínculo empregatício permanente e o trabalhador avulso.`,
        keywords: ['direitos', 'trabalhadores', 'salário', 'jornada', 'férias', 'licença', 'aposentadoria'],
        relatedArticles: ['2-2', '2-3']
      },
      {
        id: '2-2',
        number: 'Art. 8º',
        title: 'Liberdade sindical',
        content: `Art. 8º É livre a associação profissional ou sindical, observado o seguinte:

I - a lei não poderá exigir autorização do Estado para a fundação de sindicato, ressalvado o registro no órgão competente, vedadas ao Poder Público a interferência e a intervenção na organização sindical;

II - é vedada a criação de mais de uma organização sindical, em qualquer grau, representativa de categoria profissional ou econômica, na mesma base territorial, que será definida pelos trabalhadores ou empregadores interessados, não podendo ser inferior à área de um Município;

III - ao sindicato cabe a defesa dos direitos e interesses coletivos ou individuais da categoria, inclusive em questões judiciais ou administrativas;

IV - a assembléia geral fixará a contribuição que, em se tratando de categoria profissional, será descontada em folha, para custeio do sistema confederativo da representação sindical respectiva, independentemente da contribuição prevista em lei;

V - ninguém será obrigado a filiar-se ou a manter-se filiado a sindicato;

VI - é obrigatória a participação dos sindicatos nas negociações coletivas de trabalho;

VII - o aposentado filiado tem direito a votar e ser votado nas organizações sindicais;

VIII - é vedada a dispensa do empregado sindicalizado a partir do registro da candidatura a cargo de direção ou representação sindical e, se eleito, ainda que suplente, até um ano após o final do mandato, salvo se cometer falta grave nos termos da lei.`,
        keywords: ['sindicato', 'associação', 'profissional', 'liberdade', 'categoria'],
        relatedArticles: ['2-1', '2-3']
      }
    ]
  },
  {
    id: '3',
    name: 'Código de Processo Civil',
    shortName: 'CPC',
    type: 'federal',
    category: 'civil',
    description: 'Lei nº 13.105, de 16 de março de 2015',
    year: 2015,
    isActive: true,
    lastUpdated: '2024-01-01',
    articles: [
      {
        id: '3-1',
        number: 'Art. 319',
        title: 'Petição inicial',
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

§ 4º A petição inicial indicará, quando for o caso, a existência de processo em curso ou de outro já julgado entre as mesmas partes, versando sobre a mesma causa de pedir.`,
        keywords: ['petição inicial', 'juízo', 'autor', 'réu', 'pedido', 'provas', 'citação'],
        relatedArticles: ['3-2', '3-3']
      },
      {
        id: '3-2',
        number: 'Art. 320',
        title: 'Citação do réu',
        content: `Art. 320. A citação do réu far-se-á:

I - por mandado, quando se tratar de pessoa física ou jurídica domiciliada no território nacional;

II - por edital, quando se tratar de pessoa física ou jurídica domiciliada no exterior ou quando não for encontrada a pessoa física ou jurídica domiciliada no território nacional;

III - por carta rogatória, quando se tratar de pessoa física ou jurídica domiciliada no exterior e houver convenção internacional ou tratado que preveja a citação por carta rogatória;

IV - por carta precatória, quando se tratar de pessoa física ou jurídica domiciliada em outro Estado da Federação ou no Distrito Federal;

V - por meio eletrônico, quando se tratar de pessoa física ou jurídica que tenha cadastro no sistema de processo judicial eletrônico.`,
        keywords: ['citação', 'réu', 'mandado', 'edital', 'carta rogatória', 'carta precatória', 'eletrônico'],
        relatedArticles: ['3-1', '3-3']
      }
    ]
  },
  {
    id: '4',
    name: 'Constituição Federal',
    shortName: 'CF',
    type: 'federal',
    category: 'constitutional',
    description: 'Constituição da República Federativa do Brasil de 1988',
    year: 1988,
    isActive: true,
    lastUpdated: '2024-01-01',
    articles: [
      {
        id: '4-1',
        number: 'Art. 5º',
        title: 'Direitos e garantias fundamentais',
        content: `Art. 5º Todos são iguais perante a lei, sem distinção de qualquer natureza, garantindo-se aos brasileiros e aos estrangeiros residentes no País a inviolabilidade do direito à vida, à liberdade, à igualdade, à segurança e à propriedade, nos termos seguintes:

I - homens e mulheres são iguais em direitos e obrigações, nos termos desta Constituição;

II - ninguém será obrigado a fazer ou deixar de fazer alguma coisa senão em virtude de lei;

III - ninguém será submetido a tortura nem a tratamento desumano ou degradante;

IV - é livre a manifestação do pensamento, sendo vedado o anonimato;

V - é assegurado o direito de resposta, proporcional ao agravo, além da indenização por dano material, moral ou à imagem;

VI - é inviolável a liberdade de consciência e de crença, sendo assegurado o livre exercício dos cultos religiosos e garantida, na forma da lei, a proteção aos locais de culto e a suas liturgias;

VII - é assegurado, nos termos da lei, o direito de resposta, proporcional ao agravo, além da indenização por dano material, moral ou à imagem;

VIII - ninguém será privado de direitos por motivo de crença religiosa ou de convicção filosófica ou política, salvo se as invocar para eximir-se de obrigação legal a todos imposta e recusar-se a cumprir prestação alternativa, fixada em lei;

IX - é livre a expressão da atividade intelectual, artística, científica e de comunicação, independentemente de censura ou licença;

X - são invioláveis a intimidade, a vida privada, a honra e a imagem das pessoas, assegurado o direito a indenização pelo dano material ou moral decorrente de sua violação;

XI - a casa é asilo inviolável do indivíduo, ninguém nela podendo penetrar sem consentimento do morador, salvo em caso de flagrante delito ou desastre, ou para prestar socorro, ou, durante o dia, por determinação judicial;

XII - é inviolável o sigilo da correspondência e das comunicações telegráficas, de dados e das comunicações telefônicas, salvo, no último caso, por ordem judicial, nas hipóteses e na forma que a lei estabelecer para fins de investigação criminal ou instrução processual penal;

XIII - é livre o exercício de qualquer trabalho, ofício ou profissão, atendidas as qualificações profissionais que a lei estabelecer;

XIV - é assegurado a todos o acesso à informação e resguardado o sigilo da fonte, quando necessário ao exercício profissional;

XV - é livre a locomoção no território nacional em tempo de paz, podendo qualquer pessoa, nos termos da lei, nele entrar, permanecer ou dele sair com seus bens;

XVI - todos podem reunir-se pacificamente, sem armas, em locais abertos ao público, independentemente de autorização, sendo apenas exigido prévio aviso à autoridade competente;

XVII - é plena a liberdade de associação para fins lícitos, vedada a de caráter paramilitar;

XVIII - a criação de associações e, na forma da lei, a de cooperativas independem de autorização, sendo vedada a interferência estatal em seu funcionamento;

XIX - as associações só poderão ser compulsoriamente dissolvidas ou ter suas atividades suspensas por decisão judicial, exigindo-se, no primeiro caso, o trânsito em julgado;

XX - ninguém poderá ser compelido a associar-se ou a permanecer associado;

XXI - as entidades associativas, quando expressamente autorizadas, têm legitimidade para representar seus filiados judicial ou extrajudicialmente;

XXII - é garantido o direito de propriedade;

XXIII - a propriedade atenderá a sua função social;

XXIV - a lei estabelecerá o procedimento para desapropriação por necessidade ou utilidade pública, ou por interesse social, mediante justa e prévia indenização em dinheiro, ressalvados os casos previstos nesta Constituição;

XXV - no caso de iminente perigo público, a autoridade competente poderá usar de propriedade particular, assegurada ao proprietário indenização ulterior, se houver dano;

XXVI - a pequena propriedade rural, assim definida em lei, desde que trabalhada pela família, não será objeto de penhora para pagamento de débitos decorrentes de sua atividade produtiva, dispondo a lei sobre os meios de financiamento do desenvolvimento do setor;

XXVII - aos autores pertence o direito exclusivo de utilização, publicação ou reprodução de suas obras, transmissível aos herdeiros pelo tempo que a lei fixar;

XXVIII - são assegurados, nos termos da lei:

a) a proteção às participações individuais em obras coletivas e à reprodução da imagem e voz humanas, inclusive nas atividades desportivas;

b) o direito de fiscalização do aproveitamento econômico das obras que participem;

XXIX - a lei assegurará aos autores de inventos industriais privilégio temporário para sua utilização, bem como proteção às criações industriais, à propriedade das marcas, aos nomes de empresas e a outros signos distintivos, tendo em vista o interesse social e o desenvolvimento tecnológico e econômico do País;

XXX - é garantido o direito de herança;

XXXI - a sucessão de bens de estrangeiros será regulada pela lei brasileira em benefício do cônjuge ou dos filhos brasileiros, sempre que não lhes seja mais favorável a lei pessoal do de cujus;

XXXII - o Estado promoverá, na forma da lei, a defesa do consumidor;

XXXIII - todos têm direito a receber dos órgãos públicos informações de seu interesse particular, ou de interesse coletivo ou geral, que serão prestadas no prazo da lei, sob pena de responsabilidade, ressalvadas aquelas cujo sigilo seja imprescindível à segurança da sociedade e do Estado;

XXXIV - são a todos assegurados, independentemente do pagamento de taxas:

a) o direito de petição aos Poderes Públicos em defesa de direitos ou contra ilegalidade ou abuso de poder;

b) a obtenção de certidões em repartições públicas, para defesa de direitos e esclarecimento de situações de interesse pessoal;

XXXV - a lei não excluirá da apreciação do Poder Judiciário lesão ou ameaça a direito;

XXXVI - a lei não prejudicará o direito adquirido, o ato jurídico perfeito e a coisa julgada;

XXXVII - não haverá juízo ou tribunal de exceção;

XXXVIII - é reconhecida a instituição do júri, com a organização que lhe der a lei, assegurados:

a) a plenitude de defesa;

b) o sigilo das votações;

c) a soberania dos veredictos;

d) a competência para o julgamento dos crimes dolosos contra a vida;

XXXIX - não há crime sem lei anterior que o defina, nem pena sem prévia cominação legal;

XL - a lei penal não retroagirá, salvo para beneficiar o réu;

XLI - a lei punirá qualquer discriminação atentatória dos direitos e liberdades fundamentais;

XLII - a prática do racismo constitui crime inafiançável e imprescritível, sujeito à pena de reclusão, nos termos da lei;

XLIII - a lei considerará crimes inafiançáveis e insuscetíveis de graça ou anistia a prática da tortura, o tráfico ilícito de entorpecentes e drogas afins, o terrorismo e os definidos como crimes hediondos, por eles respondendo os mandantes, os executores e os que, podendo evitá-los, se omitirem;

XLIV - constitui crime inafiançável e imprescritível a ação de grupos armados, civis ou militares, contra a ordem constitucional e o Estado Democrático;

XLV - nenhuma pena passará da pessoa do condenado, podendo a obrigação de reparar o dano e a decretação do perdimento de bens ser, nos termos da lei, estendidas aos sucessores e contra eles executadas, até o limite do valor do patrimônio transferido;

XLVI - a lei regulará a individualização da pena e adotará, entre outras, as seguintes:

a) privação ou restrição da liberdade;

b) perda de bens;

c) multa;

d) prestação social alternativa;

e) suspensão ou interdição de direitos;

XLVII - não haverá penas:

a) de morte, salvo em caso de guerra declarada, nos termos do art. 84, XIX;

b) de caráter perpétuo;

c) de trabalhos forçados;

d) de banimento;

e) cruéis;

XLVIII - a pena será cumprida em estabelecimentos distintos, de acordo com a natureza do delito, a idade e o sexo do apenado;

XLIX - é assegurado aos presos o respeito à integridade física e moral;

L - às presidiárias serão asseguradas condições para que possam permanecer com seus filhos durante o período de amamentação;

LI - nenhum brasileiro será extraditado, salvo o naturalizado, em caso de crime comum, praticado antes da naturalização, ou de comprovado envolvimento em tráfico ilícito de entorpecentes e drogas afins, na forma da lei;

LII - não será concedida extradição de estrangeiro por crime político ou de opinião;

LIII - ninguém será processado nem sentenciado senão pela autoridade competente;

LIV - ninguém será privado da liberdade ou de seus bens sem o devido processo legal;

LV - aos litigantes, em processo judicial ou administrativo, e aos acusados em geral são assegurados o contraditório e ampla defesa, com os meios e recursos a ela inerentes;

LVI - são inadmissíveis, no processo, as provas obtidas por meios ilícitos;

LVII - ninguém será considerado culpado até o trânsito em julgado de sentença penal condenatória;

LVIII - o civilmente identificado não será submetido a identificação criminal, salvo nas hipóteses previstas em lei;

LIX - será admitida ação privada nos crimes de ação pública, se esta não for intentada no prazo legal;

LX - a lei só poderá restringir a publicidade dos atos processuais quando a defesa da intimidade ou o interesse social o exigirem;

LXI - ninguém será preso senão em flagrante delito ou por ordem escrita e fundamentada de autoridade judiciária competente, salvo nos casos de transgressão militar ou crime propriamente militar, definidos em lei;

LXII - a prisão de qualquer pessoa e o local onde se encontre serão comunicados imediatamente ao juiz competente e à família do preso ou à pessoa por ele indicada;

LXIII - o preso será informado de seus direitos, entre os quais o de permanecer calado, sendo-lhe assegurada a assistência da família e de advogado;

LXIV - o preso tem direito à identificação dos responsáveis por sua prisão ou por seu interrogatório policial;

LXV - a prisão ilegal será imediatamente relaxada pela autoridade judiciária;

LXVI - ninguém será levado à prisão ou nela mantido, quando a lei admitir a liberdade provisória, com ou sem fiança;

LXVII - não haverá prisão civil por dívida, salvo a do responsável pelo inadimplemento voluntário e inescusável de obrigação alimentícia e a do depositário infiel;

LXVIII - conceder-se-á habeas corpus sempre que alguém sofrer ou se achar ameaçado de sofrer violência ou coação em sua liberdade de locomoção, por ilegalidade ou abuso de poder;

LXIX - conceder-se-á mandado de segurança para proteger direito líquido e certo, não amparado por habeas corpus ou habeas data, quando o responsável pela ilegalidade ou abuso de poder for autoridade pública ou agente de pessoa jurídica no exercício de atribuições do Poder Público;

LXX - o mandado de segurança coletivo pode ser impetrado por:

a) partido político com representação no Congresso Nacional;

b) organização sindical, entidade de classe ou associação legalmente constituída e em funcionamento há pelo menos um ano, em defesa dos interesses de seus membros ou associados;

LXXI - conceder-se-á mandado de injunção sempre que a falta de norma regulamentadora torne inviável o exercício dos direitos e liberdades constitucionais e das prerrogativas inerentes à nacionalidade, à soberania e à cidadania;

LXXII - conceder-se-á habeas data:

a) para assegurar o conhecimento de informações relativas à pessoa do impetrante, constantes de registros ou bancos de dados de entidades governamentais ou de caráter público;

b) para a retificação de dados, quando não se prefira fazê-lo por processo sigiloso, judicial ou administrativo;

LXXIII - qualquer cidadão é parte legítima para propor ação popular que vise a anular ato lesivo ao patrimônio público ou de entidade de que o Estado participe, à moralidade administrativa, ao meio ambiente e ao patrimônio histórico e cultural, ficando o autor, salvo comprovada má-fé, isento de custas judiciais e do ônus da sucumbência;

LXXIV - o Estado prestará assistência jurídica integral e gratuita aos que comprovarem insuficiência de recursos;

LXXV - o Estado indenizará o condenado por erro judiciário, assim como o que ficar preso além do tempo fixado na sentença;

LXXVI - são gratuitos para os reconhecidamente pobres, na forma da lei:

a) o registro civil de nascimento;

b) a certidão de óbito;

LXXVII - são gratuitas as ações de habeas corpus e habeas data, e, na forma da lei, os atos necessários ao exercício da cidadania;

LXXVIII - a todos, no âmbito judicial e administrativo, são assegurados a razoável duração do processo e os meios que garantam a celeridade de sua tramitação;

LXXIX - é assegurado, nos termos da lei, o direito à assistência jurídica e à assistência judiciária gratuita;

LXXX - o Estado criará mecanismos e estimulará, por meio de lei, a conciliação e a mediação de conflitos.`,
        keywords: ['direitos', 'garantias', 'fundamentais', 'igualdade', 'liberdade', 'vida', 'propriedade', 'constituição'],
        relatedArticles: ['4-2', '4-3']
      }
    ]
  },
  {
    id: '5',
    name: 'Código Penal',
    shortName: 'CP',
    type: 'federal',
    category: 'criminal',
    description: 'Decreto-Lei nº 2.848, de 7 de dezembro de 1940',
    year: 1940,
    isActive: true,
    lastUpdated: '2024-01-01',
    articles: [
      {
        id: '5-1',
        number: 'Art. 121',
        title: 'Homicídio',
        content: `Art. 121. Matar alguém:

Pena - reclusão, de seis a vinte anos.

§ 1º Se o agente comete o crime impelido por motivo de relevante valor social ou moral, ou sob o domínio de violenta emoção, logo em seguida a injusta provocação da vítima, o juiz pode reduzir a pena de um sexto a um terço.

§ 2º Se o homicídio é cometido:

I - mediante paga ou promessa de recompensa, ou por outro motivo torpe;

II - por motivo fútil;

III - com emprego de veneno, fogo, explosivo, asfixia, tortura ou outro meio insidioso ou cruel, ou de que possa resultar perigo comum;

IV - à traição, de emboscada, ou mediante dissimulação ou outro recurso que dificulte ou torne impossível a defesa do ofendido;

V - para assegurar a execução, a ocultação, a impunidade ou vantagem de outro crime:

Pena - reclusão, de doze a trinta anos.

§ 3º Se o homicídio é culposo:

Pena - detenção, de um a três anos.

§ 4º No homicídio culposo, a pena é aumentada de um terço, se o crime resulta de inobservância de regra técnica de profissão, arte ou ofício, ou se o agente deixa de prestar imediato socorro à vítima.`,
        keywords: ['homicídio', 'matar', 'crime', 'pena', 'reclusão', 'culposo', 'doloso'],
        relatedArticles: ['5-2', '5-3']
      },
      {
        id: '5-2',
        number: 'Art. 155',
        title: 'Furto',
        content: `Art. 155. Subtrair, para si ou para outrem, coisa alheia móvel:

Pena - reclusão, de um a quatro anos, e multa.

§ 1º Se o crime é cometido durante o repouso noturno:

Pena - reclusão, de dois a cinco anos, e multa.

§ 2º Se o crime é cometido:

I - com destruição ou rompimento de obstáculo à subtração da coisa;

II - com abuso de confiança, ou mediante fraude, escalada ou destreza;

III - com emprego de chave falsa;

IV - mediante concurso de duas ou mais pessoas:

Pena - reclusão, de dois a oito anos, e multa.

§ 3º Se a subtração for de veículo automotor que venha a ser transportado para outro Estado ou para o exterior:

Pena - reclusão, de três a oito anos, e multa.

§ 4º Se o crime é culposo:

Pena - detenção, de seis meses a dois anos, e multa.`,
        keywords: ['furto', 'subtrair', 'coisa alheia', 'móvel', 'pena', 'reclusão'],
        relatedArticles: ['5-1', '5-3']
      }
    ]
  },
  {
    id: '6',
    name: 'Código de Defesa do Consumidor',
    shortName: 'CDC',
    type: 'federal',
    category: 'commercial',
    description: 'Lei nº 8.078, de 11 de setembro de 1990',
    year: 1990,
    isActive: true,
    lastUpdated: '2024-01-01',
    articles: [
      {
        id: '6-1',
        number: 'Art. 6º',
        title: 'Direitos básicos do consumidor',
        content: `Art. 6º São direitos básicos do consumidor:

I - a proteção da vida, saúde e segurança contra os riscos provocados por práticas no fornecimento de produtos e serviços considerados perigosos ou nocivos;

II - a educação e divulgação sobre o consumo adequado dos produtos e serviços, asseguradas a liberdade de escolha e a igualdade nas contratações;

III - a informação adequada e clara sobre os diferentes produtos e serviços, com especificação correta de quantidade, características, composição, qualidade, tributos incidentes e preço, bem como sobre os riscos que apresentem;

IV - a proteção contra a publicidade enganosa e abusiva, métodos comerciais coercitivos ou desleais, bem como contra práticas e cláusulas abusivas ou impostas no fornecimento de produtos e serviços;

V - a modificação das cláusulas contratuais que estabeleçam prestações desproporcionais ou sua revisão em razão de fatos supervenientes que as tornem excessivamente onerosas;

VI - a efetiva prevenção e reparação de danos patrimoniais e morais, individuais, coletivos e difusos;

VII - o acesso aos órgãos judiciários e administrativos com vistas à prevenção ou reparação de danos patrimoniais e morais, individuais, coletivos ou difusos, assegurada a proteção jurídica, administrativa e técnica aos necessitados;

VIII - a facilitação da defesa de seus direitos, inclusive com a inversão do ônus da prova, a seu favor, no processo civil, quando, a critério do juiz, for verossímil a alegação ou quando for ele hipossuficiente, segundo as regras ordinárias de experiências;

IX - a adequada e eficaz prestação dos serviços públicos em geral.`,
        keywords: ['consumidor', 'direitos', 'proteção', 'informação', 'contrato', 'danos'],
        relatedArticles: ['6-2', '6-3', '1-4', '1-5']
      },
      {
        id: '6-2',
        number: 'Art. 25',
        title: 'Responsabilidade pelo fato do produto',
        content: `Art. 25. É responsável pelo dano causado ao consumidor o fabricante, o produtor, o construtor, o importador, o comerciante, o prestador de serviços, o fornecedor de produtos ou serviços, bem como o responsável pela colocação do produto no mercado de consumo.

§ 1º O fabricante, o produtor, o construtor, o importador, o comerciante, o prestador de serviços, o fornecedor de produtos ou serviços, bem como o responsável pela colocação do produto no mercado de consumo, não poderão eximir-se da responsabilidade, salvo se provarem:

I - que não colocaram o produto no mercado;

II - que, embora hajam colocado o produto no mercado, o defeito inexiste;

III - que o defeito é posterior à colocação do produto no mercado;

IV - que o defeito é anterior à colocação do produto no mercado;

V - que o defeito é posterior à colocação do produto no mercado e é causado por terceiro.

§ 2º A responsabilidade de que trata este artigo é objetiva, independentemente de culpa.`,
        keywords: ['responsabilidade', 'produto', 'serviço', 'dano', 'fabricante', 'objetiva'],
        relatedArticles: ['6-1', '6-3']
      }
    ]
  },
  {
    id: '7',
    name: 'Lei de Execução Penal',
    shortName: 'LEP',
    type: 'federal',
    category: 'criminal',
    description: 'Lei nº 7.210, de 11 de julho de 1984',
    year: 1984,
    isActive: true,
    lastUpdated: '2024-01-01',
    articles: [
      {
        id: '7-1',
        number: 'Art. 33',
        title: 'Cumprimento da pena',
        content: `Art. 33. A pena de reclusão deve ser cumprida em regime fechado, semi-aberto ou aberto.

§ 1º A pena de reclusão será cumprida em regime fechado, semi-aberto ou aberto, conforme a sentença condenatória.

§ 2º A pena de detenção será cumprida em regime semi-aberto ou aberto.

§ 3º A pena de multa será cumprida em regime aberto.

§ 4º A pena de prisão simples será cumprida em regime semi-aberto ou aberto.

§ 5º A pena de reclusão será cumprida em regime fechado, semi-aberto ou aberto, conforme a sentença condenatória.

§ 6º A pena de detenção será cumprida em regime semi-aberto ou aberto.

§ 7º A pena de multa será cumprida em regime aberto.

§ 8º A pena de prisão simples será cumprida em regime semi-aberto ou aberto.`,
        keywords: ['execução penal', 'pena', 'reclusão', 'detenção', 'regime', 'cumprimento'],
        relatedArticles: ['7-2', '7-3']
      }
    ]
  },
  {
    id: '8',
    name: 'Lei Maria da Penha',
    shortName: 'LMP',
    type: 'federal',
    category: 'criminal',
    description: 'Lei nº 11.340, de 7 de agosto de 2006',
    year: 2006,
    isActive: true,
    lastUpdated: '2024-01-01',
    articles: [
      {
        id: '8-1',
        number: 'Art. 5º',
        title: 'Configuração da violência doméstica',
        content: `Art. 5º Para os efeitos desta Lei, configura violência doméstica e familiar contra a mulher qualquer ação ou omissão baseada no gênero que lhe cause morte, lesão, sofrimento físico, sexual ou psicológico e dano moral ou patrimonial:

I - no âmbito da unidade doméstica, compreendida como o espaço de convívio permanente de pessoas, com ou sem vínculo familiar, inclusive as esporadicamente agregadas;

II - no âmbito da família, compreendida como a comunidade formada por indivíduos que são ou se consideram aparentados, unidos por laços naturais, por afinidade ou por vontade expressa;

III - em qualquer relação íntima de afeto, na qual o agressor conviva ou tenha convivido com a ofendida, independentemente de coabitação.

Parágrafo único. As relações pessoais enunciadas neste artigo independem de orientação sexual.`,
        keywords: ['violência doméstica', 'mulher', 'gênero', 'família', 'unidade doméstica', 'relação íntima'],
        relatedArticles: ['8-2', '8-3']
      }
    ]
  },
  {
    id: '9',
    name: 'Lei Geral de Proteção de Dados',
    shortName: 'LGPD',
    type: 'federal',
    category: 'administrative',
    description: 'Lei nº 13.709, de 14 de agosto de 2018',
    year: 2018,
    isActive: true,
    lastUpdated: '2024-01-01',
    articles: [
      {
        id: '9-1',
        number: 'Art. 5º',
        title: 'Definições',
        content: `Art. 5º Para os fins desta Lei, considera-se:

I - dado pessoal: informação relacionada a pessoa natural identificada ou identificável;

II - dado pessoal sensível: dado pessoal sobre origem racial ou étnica, convicções religiosas ou filosóficas, opiniões políticas, filiação a sindicato ou a organização de caráter religioso, filosófico ou político, dado referente à saúde ou à vida sexual, dado biométrico ou genético, quando vinculado a uma pessoa natural;

III - dado anonimizado: dado relativo a titular que não possa ser identificado, considerando a utilização de técnicas razoáveis e disponíveis na ocasião de seu tratamento;

IV - banco de dados: conjunto estruturado de dados pessoais, estabelecido em um ou em vários locais, em suporte eletrônico ou físico;

V - titular: pessoa natural a quem se referem os dados pessoais que são objeto de tratamento;

VI - controlador: pessoa natural ou jurídica, de direito público ou privado, a quem competem as decisões referentes ao tratamento de dados pessoais;

VII - operador: pessoa natural ou jurídica, de direito público ou privado, que realiza o tratamento de dados pessoais em nome do controlador;

VIII - encarregado: pessoa indicada pelo controlador e operador para atuar como canal de comunicação entre o controlador, os titulares dos dados e a Autoridade Nacional de Proteção de Dados (ANPD);

IX - tratamento: toda operação realizada com dados pessoais, como as que se referem a coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle da informação, modificação, comunicação, transferência, difusão ou extração;

X - anonimização: utilização de técnicas razoáveis e disponíveis no momento do tratamento, por meio das quais um dado perde a possibilidade de associação, direta ou indireta, a um indivíduo;

XI - consentimento: manifestação livre, informada e inequívoca pela qual o titular concorda com o tratamento de seus dados pessoais para uma finalidade determinada;

XII - bloqueio: suspensão temporária de qualquer operação de tratamento mediante retenção dos dados pessoais ou do banco de dados;

XIII - eliminação: exclusão de dados ou conjunto de dados armazenados em banco de dados, independentemente do procedimento empregado;

XIV - transferência internacional de dados: transferência de dados pessoais para país estrangeiro ou organismo internacional do qual o país seja membro;

XV - uso compartilhado de dados: comunicação, difusão, transferência internacional, interconexão de dados pessoais ou tratamento compartilhado de bancos de dados pessoais por órgãos e entidades públicos no cumprimento de suas competências legais, ou entre esses e entes privados, reciprocamente, com autorização específica, para uma ou mais modalidades de tratamento permitidas por esses entes públicos, ou entre entes privados;

XVI - relatório de impacto à proteção de dados pessoais: documentação do controlador que contém a descrição dos processos de tratamento de dados pessoais que podem gerar riscos às liberdades civis e aos direitos fundamentais, bem como medidas, salvaguardas e mecanismos de mitigação de risco.`,
        keywords: ['dados pessoais', 'privacidade', 'proteção', 'tratamento', 'consentimento', 'controlador', 'titular'],
        relatedArticles: ['9-2', '9-3', '4-1']
      }
    ]
  },
  {
    id: '10',
    name: 'Estatuto da Criança e do Adolescente',
    shortName: 'ECA',
    type: 'federal',
    category: 'family',
    description: 'Lei nº 8.069, de 13 de julho de 1990',
    year: 1990,
    isActive: true,
    lastUpdated: '2024-01-01',
    articles: [
      {
        id: '10-1',
        number: 'Art. 2º',
        title: 'Conceito de criança e adolescente',
        content: `Art. 2º Considera-se criança, para os efeitos desta Lei, a pessoa até doze anos de idade incompletos, e adolescente aquela entre doze e dezoito anos de idade.

Parágrafo único. Nos casos expressos em lei, aplica-se excepcionalmente este Estatuto às pessoas entre dezoito e vinte e um anos de idade.`,
        keywords: ['criança', 'adolescente', 'idade', 'estatuto', 'proteção'],
        relatedArticles: ['10-2', '10-3']
      },
      {
        id: '10-2',
        number: 'Art. 4º',
        title: 'Dever da família, da sociedade e do Estado',
        content: `Art. 4º É dever da família, da comunidade, da sociedade em geral e do Poder Público assegurar, com absoluta prioridade, a efetivação dos direitos referentes à vida, à saúde, à alimentação, à educação, ao esporte, ao lazer, à profissionalização, à cultura, à dignidade, ao respeito, à liberdade e à convivência familiar e comunitária.

Parágrafo único. A garantia de prioridade compreende:

I - primazia de receber proteção e socorro em quaisquer circunstâncias;

II - precedência do atendimento nos serviços públicos ou de relevância pública;

III - preferência na formulação e na execução das políticas sociais públicas;

IV - destinação privilegiada de recursos públicos nas áreas relacionadas com a proteção à infância e à juventude.`,
        keywords: ['dever', 'família', 'sociedade', 'Estado', 'prioridade', 'direitos', 'proteção'],
        relatedArticles: ['10-1', '10-3']
      }
    ]
  }
  ,
  {
    id: '11',
    name: 'Lei de Improbidade Administrativa',
    shortName: 'LIA',
    type: 'federal',
    category: 'administrative',
    description: 'Lei nº 8.429, de 2 de junho de 1992',
    year: 1992,
    isActive: true,
    lastUpdated: '2024-01-01',
    articles: [
      {
        id: '11-1',
        number: 'Art. 9º',
        title: 'Atos que importam enriquecimento ilícito',
        content: `Constituem atos de improbidade administrativa importando enriquecimento ilícito obter qualquer tipo de vantagem patrimonial indevida em razão do exercício de cargo, mandato, função, emprego ou atividade nas entidades mencionadas no art. 1º desta Lei.`,
        keywords: ['improbidade', 'enriquecimento ilícito', 'administração pública'],
        relatedArticles: []
      },
      {
        id: '11-2',
        number: 'Art. 10',
        title: 'Atos que causam prejuízo ao erário',
        content: `Constituem atos de improbidade administrativa que causam prejuízo ao erário qualquer ação ou omissão, dolosa ou culposa, que enseje perda patrimonial, desvio, apropriação, malbaratamento ou dilapidação dos bens ou haveres das entidades.`,
        keywords: ['prejuízo ao erário', 'improbidade', 'dolo', 'culpa'],
        relatedArticles: ['11-1']
      },
      {
        id: '11-3',
        number: 'Art. 11',
        title: 'Atos que atentam contra os princípios',
        content: `Constituem atos de improbidade administrativa que atentam contra os princípios da administração pública qualquer ação ou omissão que viole os deveres de honestidade, imparcialidade, legalidade, e lealdade às instituições.`,
        keywords: ['princípios', 'honestidade', 'legalidade', 'administração pública'],
        relatedArticles: ['11-1', '11-2']
      }
    ]
  },
  {
    id: '12',
    name: 'Lei de Licitações e Contratos Administrativos',
    shortName: 'Lei 14.133/21',
    type: 'federal',
    category: 'administrative',
    description: 'Lei nº 14.133, de 1º de abril de 2021',
    year: 2021,
    isActive: true,
    lastUpdated: '2024-01-01',
    articles: [
      {
        id: '12-1',
        number: 'Art. 6º',
        title: 'Definições',
        content: `Para os fins desta Lei, consideram-se: contratação, planejamento da contratação, matriz de riscos, entre outras definições aplicáveis aos procedimentos licitatórios e aos contratos administrativos.`,
        keywords: ['licitações', 'contratos', 'administração pública', 'definições'],
        relatedArticles: []
      },
      {
        id: '12-2',
        number: 'Art. 18',
        title: 'Planejamento da contratação',
        content: `As contratações deverão estar precedidas de planejamento que evidencie a necessidade, a estimativa de preços, a adequada definição do objeto e a previsão orçamentária.`,
        keywords: ['planejamento', 'estimativa de preços', 'objeto', 'orçamento'],
        relatedArticles: ['12-1']
      },
      {
        id: '12-3',
        number: 'Art. 92',
        title: 'Matriz de riscos',
        content: `A matriz de riscos definirá, de forma clara, os riscos a serem assumidos pelas partes e as consequências econômica-financeiras de sua ocorrência, quando cabível.`,
        keywords: ['matriz de riscos', 'contratos administrativos', 'riscos'],
        relatedArticles: ['12-1', '12-2']
      }
    ]
  },
  {
    id: '13',
    name: 'Lei de Recuperação Judicial e Falências',
    shortName: 'LRF',
    type: 'federal',
    category: 'commercial',
    description: 'Lei nº 11.101, de 9 de fevereiro de 2005',
    year: 2005,
    isActive: true,
    lastUpdated: '2024-01-01',
    articles: [
      {
        id: '13-1',
        number: 'Art. 47',
        title: 'Princípio da preservação da empresa',
        content: `A recuperação judicial tem por objetivo viabilizar a superação da situação de crise econômico-financeira do devedor a fim de permitir a manutenção da fonte produtora, do emprego dos trabalhadores e dos interesses dos credores.`,
        keywords: ['recuperação judicial', 'falência', 'preservação da empresa'],
        relatedArticles: []
      },
      {
        id: '13-2',
        number: 'Art. 49',
        title: 'Sujeição dos créditos',
        content: `Estão sujeitos à recuperação judicial todos os créditos existentes na data do pedido, ainda que não vencidos.`,
        keywords: ['créditos', 'recuperação judicial', 'sujeição'],
        relatedArticles: ['13-1']
      },
      {
        id: '13-3',
        number: 'Art. 73',
        title: 'Convolação em falência',
        content: `A falência será decretada quando o devedor descumprir obrigação assumida no plano de recuperação judicial, entre outras hipóteses legais.`,
        keywords: ['falência', 'plano', 'descumprimento'],
        relatedArticles: ['13-1', '13-2']
      }
    ]
  },
  {
    id: '14',
    name: 'Lei de Arbitragem',
    shortName: 'Lei 9.307/96',
    type: 'federal',
    category: 'commercial',
    description: 'Lei nº 9.307, de 23 de setembro de 1996',
    year: 1996,
    isActive: true,
    lastUpdated: '2024-01-01',
    articles: [
      {
        id: '14-1',
        number: 'Art. 1º',
        title: 'Arbitragem e direitos patrimoniais disponíveis',
        content: `As pessoas capazes de contratar poderão valer-se da arbitragem para dirimir litígios relativos a direitos patrimoniais disponíveis.`,
        keywords: ['arbitragem', 'direitos patrimoniais', 'conflitos'],
        relatedArticles: []
      },
      {
        id: '14-2',
        number: 'Art. 3º',
        title: 'Compromisso arbitral',
        content: `A cláusula compromissória e o compromisso arbitral obrigam as partes a submeterem-se à arbitragem, na forma da Lei.`,
        keywords: ['cláusula compromissória', 'compromisso arbitral', 'arbitragem'],
        relatedArticles: ['14-1']
      },
      {
        id: '14-3',
        number: 'Art. 18',
        title: 'Coisa julgada arbitral',
        content: `A sentença arbitral produz entre as partes e seus sucessores os mesmos efeitos da sentença proferida pelos órgãos do Poder Judiciário e, sendo condenatória, constitui título executivo.`,
        keywords: ['sentença arbitral', 'coisa julgada', 'título executivo'],
        relatedArticles: ['14-1', '14-2', '3-1']
      }
    ]
  },
  {
    id: '15',
    name: 'Lei de Introdução às Normas do Direito Brasileiro',
    shortName: 'LINDB',
    type: 'federal',
    category: 'civil',
    description: 'Decreto-Lei nº 4.657, de 4 de setembro de 1942',
    year: 1942,
    isActive: true,
    lastUpdated: '2024-01-01',
    articles: [
      {
        id: '15-1',
        number: 'Art. 6º',
        title: 'Irretroatividade da lei',
        content: `A lei em vigor terá efeito imediato e geral, respeitados o ato jurídico perfeito, o direito adquirido e a coisa julgada.`,
        keywords: ['irretroatividade', 'ato jurídico perfeito', 'direito adquirido', 'coisa julgada'],
        relatedArticles: []
      },
      {
        id: '15-2',
        number: 'Art. 8º',
        title: 'Interpretação e consequências práticas',
        content: `Na aplicação do direito, o julgador atenderá aos fins sociais e às exigências do bem comum, considerando as consequências práticas da decisão.`,
        keywords: ['interpretação', 'consequências práticas', 'fins sociais'],
        relatedArticles: ['15-1']
      }
    ]
  },
  {
    id: '16',
    name: 'Lei do Inquilinato',
    shortName: 'Lei 8.245/91',
    type: 'federal',
    category: 'civil',
    description: 'Lei nº 8.245, de 18 de outubro de 1991',
    year: 1991,
    isActive: true,
    lastUpdated: '2024-01-01',
    articles: [
      {
        id: '16-1',
        number: 'Art. 4º',
        title: 'Rescisão antecipada pelo locatário',
        content: `Durante o prazo estipulado para a duração do contrato de locação, não poderá o locador reaver o imóvel alugado. O locatário, todavia, poderá devolvê-lo, pagando a multa pactuada proporcional ao tempo de cumprimento do contrato.`,
        keywords: ['locação', 'rescisão', 'multa', 'inquilinato'],
        relatedArticles: []
      },
      {
        id: '16-2',
        number: 'Art. 23',
        title: 'Obrigações do locatário',
        content: `O locatário é obrigado a: pagar pontualmente o aluguel e os encargos, zelar pela conservação do imóvel e devolvê-lo no estado em que recebeu, salvo deteriorações naturais do uso normal.`,
        keywords: ['locatário', 'obrigações', 'aluguel', 'conservação'],
        relatedArticles: ['16-1']
      },
      {
        id: '16-3',
        number: 'Art. 22',
        title: 'Obrigações do locador',
        content: `O locador é obrigado a: entregar o imóvel em estado de servir ao uso a que se destina, manter, durante a locação, a forma e o destino do imóvel, e responder pelos vícios ou defeitos anteriores à locação.`,
        keywords: ['locador', 'obrigações', 'imóvel', 'vícios'],
        relatedArticles: ['16-1', '16-2']
      }
    ]
  },
  {
    id: '17',
    name: 'Lei de Alienação Fiduciária de Bens Móveis',
    shortName: 'Lei 4.728/65 c/c Dec.-Lei 911/69',
    type: 'federal',
    category: 'commercial',
    description: 'Disciplina o mercado de capitais e a alienação fiduciária em garantia',
    year: 1965,
    isActive: true,
    lastUpdated: '2024-01-01',
    articles: [
      {
        id: '17-1',
        number: 'Art. 2º (DL 911/69)',
        title: 'Busca e apreensão',
        content: `No caso de mora ou inadimplemento, decretar-se-á liminarmente a busca e apreensão do bem alienado fiduciariamente, consolidando-se a propriedade no credor após o prazo legal se não purgada a mora.`,
        keywords: ['alienação fiduciária', 'busca e apreensão', 'inadimplemento'],
        relatedArticles: []
      },
      {
        id: '17-2',
        number: 'Art. 3º (DL 911/69)',
        title: 'Purga da mora',
        content: `O devedor fiduciante poderá, no prazo legal contado da execução da liminar, pagar a integralidade da dívida pendente para reaver o bem apreendido.`,
        keywords: ['purga da mora', 'devedor fiduciante', 'apreensão'],
        relatedArticles: ['17-1']
      }
    ]
  },
  {
    id: '18',
    name: 'Lei do Mandado de Segurança',
    shortName: 'Lei 12.016/09',
    type: 'federal',
    category: 'constitutional',
    description: 'Disciplina o mandado de segurança individual e coletivo',
    year: 2009,
    isActive: true,
    lastUpdated: '2024-01-01',
    articles: [
      {
        id: '18-1',
        number: 'Art. 1º',
        title: 'Cabimento do mandado de segurança',
        content: `Conceder-se-á mandado de segurança para proteger direito líquido e certo, não amparado por habeas corpus ou habeas data, quando o responsável for autoridade pública ou agente de pessoa jurídica no exercício de atribuições do Poder Público.`,
        keywords: ['mandado de segurança', 'direito líquido e certo', 'autoridade pública'],
        relatedArticles: []
      },
      {
        id: '18-2',
        number: 'Art. 7º',
        title: 'Medidas liminares',
        content: `Ao despachar a inicial, o juiz ordenará que se suspenda o ato que deu motivo ao pedido, quando presentes os requisitos legais para a concessão de medida liminar.`,
        keywords: ['liminar', 'suspensão do ato', 'MS'],
        relatedArticles: ['18-1']
      }
    ]
  },
  {
    id: '19',
    name: 'Lei de Locações Comerciais (Trespasse e Ponto)',
    shortName: 'Lei 8.245/91 (arts. 51-57)',
    type: 'federal',
    category: 'commercial',
    description: 'Regras de renovação e proteção do ponto comercial',
    year: 1991,
    isActive: true,
    lastUpdated: '2024-01-01',
    articles: [
      {
        id: '19-1',
        number: 'Art. 51',
        title: 'Ação renovatória',
        content: `Ao locatário é assegurado o direito à renovação do contrato de locação comercial, por igual prazo, desde que preenchidos os requisitos legais, preservando-se o ponto empresarial.`,
        keywords: ['ação renovatória', 'ponto comercial', 'locação comercial'],
        relatedArticles: []
      },
      {
        id: '19-2',
        number: 'Art. 52',
        title: 'Requisitos da renovatória',
        content: `A ação renovatória deverá ser proposta no prazo legal e demonstrar o cumprimento das condições contratuais, o prazo mínimo de exploração e a intenção de renovação pelo locatário.`,
        keywords: ['requisitos', 'renovação', 'prazo'],
        relatedArticles: ['19-1']
      }
    ]
  },
  {
    id: '20',
    name: 'Lei do Juizado Especial Cível',
    shortName: 'Lei 9.099/95',
    type: 'federal',
    category: 'civil',
    description: 'Estabelece os Juizados Especiais Cíveis e Criminais',
    year: 1995,
    isActive: true,
    lastUpdated: '2024-01-01',
    articles: [
      {
        id: '20-1',
        number: 'Art. 3º',
        title: 'Competência do JEC',
        content: `O Juizado Especial Cível tem competência para conciliação, processo e julgamento das causas cíveis de menor complexidade, até o limite de alçada legal, com procedimentos simplificados.`,
        keywords: ['juizado especial', 'competência', 'menor complexidade'],
        relatedArticles: []
      },
      {
        id: '20-2',
        number: 'Art. 4º',
        title: 'Princípios orientadores',
        content: `Os Juizados Especiais serão orientados pelos critérios da oralidade, simplicidade, informalidade, economia processual e celeridade, buscando sempre a conciliação.`,
        keywords: ['oralidade', 'simplicidade', 'celeridade', 'conciliação'],
        relatedArticles: ['20-1']
      }
    ]
  }
]

// Função para buscar leis
export const searchLaws = (query: string, category?: string, type?: string): Law[] => {
  let results = lawsDatabase.filter(law => law.isActive)

  if (category) {
    results = results.filter(law => law.category === category)
  }

  if (type) {
    results = results.filter(law => law.type === type)
  }

  if (query) {
    const searchTerm = query.toLowerCase()
    results = results.filter(law => 
      law.name.toLowerCase().includes(searchTerm) ||
      law.shortName.toLowerCase().includes(searchTerm) ||
      law.description.toLowerCase().includes(searchTerm) ||
      law.articles.some(article => 
        article.title.toLowerCase().includes(searchTerm) ||
        article.content.toLowerCase().includes(searchTerm) ||
        article.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
      )
    )
  }

  return results
}

// Função para buscar artigos específicos
export const searchArticles = (query: string, lawId?: string): LawArticle[] => {
  let articles: LawArticle[] = []

  if (lawId) {
    const law = lawsDatabase.find(l => l.id === lawId)
    if (law) {
      articles = law.articles
    }
  } else {
    lawsDatabase.forEach(law => {
      articles = articles.concat(law.articles)
    })
  }

  if (query) {
    const searchTerm = query.toLowerCase()
    articles = articles.filter(article =>
      article.title.toLowerCase().includes(searchTerm) ||
      article.content.toLowerCase().includes(searchTerm) ||
      article.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
    )
  }

  return articles
}

