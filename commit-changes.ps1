# Script para fazer commit das mudanças de migração para dados reais
# Execute este script no PowerShell: .\commit-changes.ps1

git add .

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

Write-Host "Commit realizado com sucesso!" -ForegroundColor Green
Write-Host "Execute 'git push' para enviar as mudanças ao repositório remoto." -ForegroundColor Yellow

