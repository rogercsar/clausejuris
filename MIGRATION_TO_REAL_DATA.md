# Migração para Dados Reais

Este documento descreve as mudanças realizadas para remover dados simulados e implementar dados reais usando Supabase.

## Mudanças Realizadas

### 1. Configuração do MSW
- **Arquivo**: `src/mocks/config.ts`
- **Mudança**: MSW é automaticamente desabilitado quando Supabase está configurado
- **Comportamento**: O sistema detecta `hasSupabaseConfig` e desabilita mocks automaticamente

### 2. Hooks Atualizados
Todos os hooks principais já estavam preparados para usar Supabase quando disponível:

- ✅ `useAuth` - Autenticação com Supabase
- ✅ `useContracts` - Contratos com Supabase
- ✅ `useProcesses` - Processos com Supabase
- ✅ `useClients` - Clientes com Supabase
- ✅ `useTasks` - **NOVO** - Tarefas com Supabase (criado)

### 3. Remoção de Fallbacks Mockados
- Removidos fallbacks de dados mockados em `useAuth.ts`
- Mantidos apenas fallbacks quando Supabase não está configurado (para desenvolvimento)

### 4. Variáveis de Ambiente
- **Arquivo**: `env.example`
- **Mudança**: `VITE_USE_MSW=false` por padrão
- **Nota**: MSW é desabilitado automaticamente quando Supabase está configurado

### 5. Documentação
- **Arquivo**: `README.md`
- **Mudança**: Documentação atualizada para refletir uso de Supabase como padrão

### 6. Atualizações dos Tribunais
- **Arquivo**: `src/services/tribunalUpdatesService.ts`
- **Mudança**: Atualizações dos tribunais agora são salvas no Supabase
- **Tabelas criadas**: `tribunal_updates` e `tracked_process_numbers`
- **Funcionalidades**:
  - Andamentos processuais são salvos no banco de dados
  - Números de processos rastreados são persistidos
  - Dados são carregados do Supabase ao invés de apenas memória
- **UI**: Removida mensagem "(simulado)" do Dashboard

## Estrutura de Dados

### Tabelas Supabase Implementadas
- ✅ `profiles` - Perfis de usuários
- ✅ `clients` - Clientes
- ✅ `contracts` - Contratos
- ✅ `processes` - Processos
- ✅ `tasks` - Tarefas
- ✅ `notifications` - Notificações
- ✅ `notification_settings` - Configurações de notificações
- ✅ `comments` - Comentários
- ✅ `cross_references` - Referências cruzadas
- ✅ `tribunal_updates` - **NOVO** - Atualizações dos tribunais (andamentos processuais)
- ✅ `tracked_process_numbers` - **NOVO** - Números de processos rastreados

### Dados Estáticos Mantidos
- ✅ `lawsDatabase` - Leis brasileiras (dados estáticos de referência legal)
- ⚠️ `mockJurisprudence` - Jurisprudência (ainda mockado, precisa de tabela)
- ⚠️ `mockTeams` / `mockUsers` (colaboração) - Ainda mockado, precisa de tabelas

## Como Usar

### Com Supabase (Recomendado)
1. Configure as variáveis de ambiente:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

2. Execute o schema SQL em `supabase/schema.sql`

3. O sistema usará dados reais automaticamente

### Sem Supabase (Desenvolvimento)
1. Configure:
```env
VITE_USE_MSW=true
```

2. O sistema usará dados mockados para desenvolvimento rápido

## Próximos Passos

### Funcionalidades que Ainda Usam Dados Mockados
1. **Jurisprudência** (`src/data/jurisprudence.ts`)
   - Precisa de tabela `jurisprudence` no Supabase
   - Componente: `JurisprudenceTimeline`

2. **Colaboração** (`src/data/collaboration.ts`)
   - Precisa de tabelas `teams`, `team_members`, `collaboration_sessions`
   - Componentes: `TeamManager`, `CollaborationPanel`

### Recomendações
- As **leis** devem permanecer como dados estáticos (são referências legais reais)
- **Jurisprudência** e **Colaboração** podem ser migradas para Supabase quando necessário
- Todos os dados principais (contratos, processos, clientes, tarefas, atualizações de tribunais) já estão usando dados reais

## Verificação

Para verificar se está usando dados reais:
1. Abra o console do navegador
2. Procure por: "MSW disabled by configuration" ou "MSW started successfully"
3. Se MSW estiver desabilitado, você está usando dados reais do Supabase

