# Clause - Plataforma de Gestão Jurídica

Frontend MVP da plataforma Clause, uma solução completa para gestão jurídica com editor inteligente e diferenciação por planos.

## 🚀 Tecnologias

- **React 18** + **TypeScript** + **Vite**
- **TailwindCSS** para estilização
- **Zustand** para gerenciamento de estado
- **React Query** para cache e sincronização de dados
- **Monaco Editor** para editor jurídico avançado
- **MSW** para mocks de API
- **Vitest** + **React Testing Library** para testes
- **Lucide React** para ícones

## 📋 Funcionalidades

### ✅ Implementadas

- **Autenticação completa** (login/cadastro com planos)
- **Dashboard diferenciado** por tipo de usuário
- **Gestão de contratos** (CRUD completo)
- **Gestão de processos** (CRUD completo)
- **Editor jurídico** diferenciado por plano:
  - **Plano Comum (R$30/mês)**: Editor básico
  - **Plano Pró (R$80/mês)**: Editor com IA, autocomplete, correção automática
- **Perfil do usuário** com atualização de dados
- **Sistema de planos** com upgrade
- **Design responsivo** e moderno
- **Mocks completos** para desenvolvimento

### 🔄 Próximas Implementações

- Cruzamento de informações entre contratos/processos
- Upload de documentos
- Histórico de versões do editor
- Notificações em tempo real
- Relatórios e dashboards avançados

## 🛠️ Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar testes
npm run test

# Linting
npm run lint
```

## 🔌 Integração com Backend

### Endpoints Mockados

O sistema está configurado com MSW para simular todas as APIs. Para integrar com o backend real, substitua as chamadas mockadas pelos endpoints reais:

#### Autenticação
```typescript
// src/lib/api.ts
POST /api/auth/login
POST /api/auth/register
GET /api/me
PUT /api/me
```

#### Contratos
```typescript
GET /api/contracts
POST /api/contracts
PATCH /api/contracts/:id
```

#### Processos
```typescript
GET /api/processes
POST /api/processes
PATCH /api/processes/:id
```

#### Clientes
```typescript
GET /api/clients
POST /api/clients
PATCH /api/clients/:id
```

#### Editor Jurídico (Plano Pró)
```typescript
POST /api/editor/suggest
GET /api/laws
```

#### Cruzamento de Informações
```typescript
GET /api/cross-reference/:entityType/:entityId
```

### Configuração da API

1. **Atualize a URL base** em `src/lib/api.ts`:
```typescript
const API_BASE_URL = process.env.VITE_API_URL || '/api'
```

2. **Configure as variáveis de ambiente**:
```env
VITE_API_URL=https://api.clause.com
VITE_USE_MSW=false
```

3. **Implemente a autenticação**:
   - Configure o token JWT no header Authorization
   - Implemente refresh token se necessário

4. **Habilitar/Desabilitar Mocks (MSW)**:
   - `VITE_USE_MSW=true` para usar API mockada (recomendado para desenvolvimento rápido)
   - `VITE_USE_MSW=false` para usar backend real
   - O app carrega o MSW dinamicamente baseado nesta flag

### Estrutura de Dados

Os tipos TypeScript estão definidos em `src/types/index.ts` e devem ser mantidos sincronizados com o backend:

```typescript
interface User {
  id: string
  email: string
  name: string
  fullName: string
  oab?: string
  phone?: string
  plan: 'common' | 'pro'
  // ...
}
```

## 🎨 Design System

### Cores
- **Primary**: Azul (#3B82F6)
- **Secondary**: Cinza (#64748B)
- **Success**: Verde (#10B981)
- **Warning**: Amarelo (#F59E0B)
- **Error**: Vermelho (#EF4444)

### Componentes
Todos os componentes estão em `src/components/ui/` e seguem o padrão de design system:
- Button
- Input
- Card
- Badge
- Modal (a implementar)

## 📱 Responsividade

O sistema é totalmente responsivo com breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🧪 Testes

```bash
# Executar todos os testes
npm run test

# Executar com UI
npm run test:ui

# Coverage
npm run test:coverage
```

## 📦 Build e Deploy

```bash
# Build de produção
npm run build

# Preview do build
npm run preview
```

## 🔧 Configurações

### ESLint + Prettier
Configurado com regras para React + TypeScript

### TailwindCSS
Configurado com tema personalizado e utilitários customizados

### Vite
Configurado com alias `@` para imports absolutos

## 📝 Notas de Desenvolvimento

### Estado Global
- **Zustand** para estado global (auth, contracts, processes)
- **React Query** para cache de dados da API

### Roteamento
- **React Router v6** com rotas protegidas
- Lazy loading implementado

### Editor Jurídico
- **Monaco Editor** com configurações específicas para texto jurídico
- Diferenciação clara entre planos Comum e Pró
- Sugestões de IA mockadas (integrar com backend real)

### Mocks
- **MSW** configurado para desenvolvimento
- Dados realistas para demonstração
- Fácil substituição por APIs reais

## 🚀 Deploy

O projeto está pronto para deploy em qualquer plataforma que suporte aplicações React:

- **Vercel** (recomendado)
- **Netlify**
- **AWS S3 + CloudFront**
- **Docker**

## 📞 Suporte

Para dúvidas sobre integração ou implementação, consulte:
- Documentação dos componentes em `src/components/`
- Tipos TypeScript em `src/types/`
- Hooks customizados em `src/hooks/`

---

**Clause** - Transformando a gestão jurídica com tecnologia inteligente.

