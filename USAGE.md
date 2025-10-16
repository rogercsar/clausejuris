# Guia de Uso - Clause

## 🚀 Como Executar o Projeto

### 1. Instalação
```bash
npm install
```

### 2. Executar em Desenvolvimento
```bash
npm run dev
```

O projeto estará disponível em: `http://localhost:5173`

### 3. Build para Produção
```bash
npm run build
```

### 4. Preview do Build
```bash
npm run preview
```

## 🔐 Credenciais de Teste

Para testar o sistema, use as seguintes credenciais:

**Login:**
- Email: `admin@clause.com`
- Senha: `123456`

**Plano:** Pró (acesso completo a todos os recursos)

## 📱 Funcionalidades Disponíveis

### ✅ Autenticação
- **Login/Cadastro** com seleção de planos
- **Plano Comum (R$30/mês)**: Recursos básicos
- **Plano Pró (R$80/mês)**: Recursos avançados com IA

### ✅ Dashboard
- Visão geral de contratos e processos
- Estatísticas em tempo real
- Ações rápidas para criar novos registros

### ✅ Gestão de Contratos
- **Listar contratos** com filtros por status e tipo
- **Criar/Editar contratos** com formulário completo
- **Visualizar detalhes** com cruzamento de informações
- **Tipos suportados**: Locação, Prestação de Serviços, Compra/Venda, etc.

### ✅ Gestão de Processos
- **Listar processos** com filtros por status e tipo
- **Criar/Editar processos** com campos jurídicos
- **Visualizar detalhes** com cruzamento de informações
- **Tipos suportados**: Civil, Trabalhista, Criminal, Família, etc.

### ✅ Editor Jurídico
- **Plano Comum**: Editor básico com formatação
- **Plano Pró**: Editor avançado com:
  - Sugestões de IA em tempo real
  - Autocomplete de artigos de lei
  - Correção automática contextual
  - Modelos jurídicos prontos
  - Snippets personalizáveis

### ✅ Perfil do Usuário
- Atualização de dados pessoais
- Informações profissionais (OAB)
- Gerenciamento do plano atual
- Upgrade de plano

### ✅ Cruzamento de Informações
- **Relacionamentos automáticos** entre contratos e processos
- **Identificação de riscos** baseada em histórico
- **Alertas de alto risco** para casos problemáticos
- **Histórico completo** de interações

## 🎨 Interface e Design

### Design System
- **Cores**: Azul primário (#3B82F6) com tons de cinza
- **Tipografia**: Sistema de fontes responsivo
- **Componentes**: Biblioteca completa de UI components
- **Responsividade**: Mobile-first design

### Navegação
- **Header** com menu principal e perfil do usuário
- **Sidebar** com ações rápidas (Plano Pró)
- **Breadcrumbs** para navegação contextual
- **Mobile menu** para dispositivos móveis

## 🔧 Configurações Técnicas

### Estado Global
- **Zustand** para gerenciamento de estado
- **React Query** para cache de dados
- **Persistência** automática do estado de autenticação

### Roteamento
- **React Router v6** com rotas protegidas
- **Lazy loading** para otimização
- **Redirecionamentos** automáticos

### Mocks e Desenvolvimento
- **MSW** para simulação de APIs
- **Dados realistas** para demonstração
- **Fácil substituição** por APIs reais

## 📊 Dados de Demonstração

O sistema inclui dados mockados para demonstração:

### Contratos
- 2 contratos de exemplo (Locação e Prestação de Serviços)
- Diferentes status e valores
- Clientes associados

### Processos
- 2 processos de exemplo (Civil e Trabalhista)
- Diferentes status e tipos
- Números de processo e tribunais

### Clientes
- 3 clientes de exemplo
- Dados completos (nome, email, telefone, OAB)
- Tipos pessoa física e jurídica

## 🚀 Próximos Passos

### Para Integração com Backend Real:

1. **Configure a URL da API** em `src/lib/api.ts`
2. **Substitua os mocks** pelos endpoints reais
3. **Implemente autenticação JWT** real
4. **Configure variáveis de ambiente**

### Para Deploy:

1. **Configure o build** para produção
2. **Configure variáveis de ambiente**
3. **Deploy em plataforma** (Vercel, Netlify, etc.)

## 🐛 Solução de Problemas

### Erro de Dependências
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro de Build
```bash
npm run lint
npm run build
```

### Erro de Desenvolvimento
```bash
npm run dev
```

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do console
2. Consulte a documentação técnica
3. Verifique as configurações de ambiente

---

**Clause** - Transformando a gestão jurídica com tecnologia inteligente.

