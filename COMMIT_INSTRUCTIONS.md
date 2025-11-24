# Instruções para Commit

Devido a problemas de codificação de caracteres no caminho, execute os seguintes comandos manualmente no terminal:

## Opção 1: Usar o script PowerShell

```powershell
.\commit-changes.ps1
```

## Opção 2: Executar comandos manualmente

```bash
# Adicionar todos os arquivos modificados
git add .

# Fazer o commit
git commit -m "feat: migração para dados reais com Supabase

- Desabilita MSW automaticamente quando Supabase está configurado
- Adiciona tabelas tribunal_updates e tracked_process_numbers no schema
- Migra serviço de atualizações dos tribunais para usar Supabase
- Remove mensagem '(simulado)' do Dashboard
- Cria hook useTasks para gerenciar tarefas com Supabase
- Atualiza hooks para remover fallbacks mockados desnecessários
- Atualiza documentação (README.md e MIGRATION_TO_REAL_DATA.md)
- Atualiza env.example com VITE_USE_MSW=false por padrão

Tabelas Supabase adicionadas:
- tribunal_updates: armazena andamentos processuais
- tracked_process_numbers: armazena números de processos rastreados

Funcionalidades migradas:
- Autenticação (já estava implementado)
- Contratos (já estava implementado)
- Processos (já estava implementado)
- Clientes (já estava implementado)
- Tarefas (novo hook criado)
- Atualizações dos Tribunais (migrado agora)"

# Enviar para o repositório remoto (opcional)
git push
```

## Arquivos modificados

Os seguintes arquivos foram modificados e devem ser commitados:

- `src/mocks/config.ts` - MSW desabilitado quando Supabase configurado
- `src/hooks/useAuth.ts` - Removidos fallbacks mockados
- `src/hooks/useTasks.ts` - Novo hook criado
- `src/services/tribunalUpdatesService.ts` - Migrado para Supabase
- `src/pages/Dashboard.tsx` - Removida mensagem "(simulado)"
- `src/pages/processes/ProcessesList.tsx` - Atualizado para async
- `supabase/schema.sql` - Adicionadas tabelas tribunal_updates e tracked_process_numbers
- `env.example` - Atualizado VITE_USE_MSW=false
- `README.md` - Documentação atualizada
- `MIGRATION_TO_REAL_DATA.md` - Documentação de migração criada

