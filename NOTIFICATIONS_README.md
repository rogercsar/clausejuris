# Sistema de Notificações - Clause

## Visão Geral

O sistema de notificações do Clause permite que os usuários sejam alertados sobre eventos importantes relacionados a contratos e processos, como vencimentos, prazos processuais e outras situações críticas.

## Funcionalidades Implementadas

### 1. Tipos de Notificação

- **Contratos Expirando**: Alertas antes do vencimento de contratos
- **Contratos Expirados**: Notificações quando contratos já expiraram
- **Prazos Processuais**: Alertas sobre prazos de processos
- **Processos Urgentes**: Notificações para processos com prazos vencidos
- **Pagamentos Devidos**: Lembretes de pagamentos
- **Documentos Necessários**: Alertas sobre documentos pendentes
- **Audiências**: Lembretes de audiências marcadas
- **Notificações Personalizadas**: Sistema flexível para regras customizadas

### 2. Configurações de Notificação

#### Configurações Gerais
- **Notificações por Email**: Ativar/desativar notificações por email
- **Notificações do Navegador**: Ativar/desativar notificações do navegador
- **Teste de Notificação**: Botão para testar o sistema

#### Configurações de Tempo
- **Dias antes do vencimento de contratos**: Configurável (ex: 30, 15, 7, 1 dias)
- **Dias antes de prazos processuais**: Configurável (ex: 30, 15, 7, 1 dias)
- **Dias antes de pagamentos**: Configurável (ex: 7, 3, 1 dias)
- **Dias antes de audiências**: Configurável (ex: 7, 3, 1 dias)

#### Horário Silencioso
- **Ativar horário silencioso**: Não receber notificações em horários específicos
- **Horário de início e fim**: Configurável (ex: 22:00 às 08:00)

#### Tipos de Notificação
- Controle individual para cada tipo de notificação
- Ativar/desativar tipos específicos conforme necessário

### 3. Interface do Usuário

#### Badge de Notificações
- Localizado no header da aplicação
- Mostra contador de notificações não lidas
- Acesso rápido ao painel de notificações

#### Painel de Notificações
- Lista todas as notificações
- Filtros: "Todas" e "Não lidas"
- Ações: marcar como lida, excluir
- Informações detalhadas: prioridade, tipo, data, entidade relacionada

#### Configurações de Notificações
- Modal dedicado para configurações
- Interface intuitiva com toggles e campos de configuração
- Teste de notificação integrado

### 4. Integração com o Sistema

#### Contratos
- Verificação automática de vencimentos
- Notificações baseadas em configurações do usuário
- Integração com a lista de contratos

#### Processos
- Verificação automática de prazos processuais
- Notificações para processos em andamento
- Integração com a lista de processos

#### Página de Perfil
- Seção dedicada para configurações de notificações
- Acesso fácil às configurações
- Lista de recursos inclusos atualizada

## Arquitetura Técnica

### Estrutura de Arquivos

```
src/
├── components/notifications/
│   ├── NotificationBadge.tsx          # Badge no header
│   ├── NotificationPanel.tsx          # Painel de notificações
│   └── NotificationSettings.tsx        # Modal de configurações
├── hooks/
│   └── useNotifications.ts             # Hook para gerenciar notificações
├── services/
│   └── notificationService.ts          # Serviço principal de notificações
└── types/
    └── index.ts                        # Tipos TypeScript para notificações
```

### Componentes Principais

#### NotificationService
- Classe singleton para gerenciar notificações
- Armazenamento local (localStorage)
- Verificação periódica de vencimentos
- Geração automática de notificações
- Suporte a notificações do navegador

#### useNotifications Hook
- Interface React para o serviço de notificações
- Estado reativo para notificações
- Funções para gerenciar notificações
- Integração com componentes React

#### Componentes de UI
- **NotificationBadge**: Badge com contador no header
- **NotificationPanel**: Modal com lista de notificações
- **NotificationSettings**: Modal de configurações

### Tipos TypeScript

```typescript
interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  entityId: string
  entityType: 'contract' | 'process'
  entityName: string
  priority: NotificationPriority
  isRead: boolean
  createdAt: string
  scheduledFor?: string
  metadata?: NotificationMetadata
}

interface NotificationSettings {
  id: string
  userId: string
  emailNotifications: boolean
  browserNotifications: boolean
  contractExpiryDays: number[]
  processDeadlineDays: number[]
  paymentReminderDays: number[]
  courtHearingReminderDays: number[]
  quietHours: {
    enabled: boolean
    start: string
    end: string
  }
  notificationTypes: {
    [K in NotificationType]: boolean
  }
  createdAt: string
  updatedAt: string
}
```

## Como Usar

### 1. Configurar Notificações

1. Acesse a página de Perfil
2. Clique em "Configurar Notificações"
3. Configure suas preferências:
   - Ative/desative tipos de notificação
   - Configure dias de antecedência
   - Defina horário silencioso
   - Teste o sistema

### 2. Visualizar Notificações

1. Clique no ícone de sino no header
2. Visualize todas as notificações ou apenas não lidas
3. Marque como lida ou exclua notificações
4. Veja detalhes sobre cada notificação

### 3. Notificações Automáticas

- O sistema verifica automaticamente contratos e processos
- Notificações são geradas baseadas nas configurações
- Verificação periódica a cada hora
- Notificações do navegador (com permissão)

## Recursos Futuros

### Melhorias Planejadas

1. **Notificações por Email**
   - Integração com serviço de email
   - Templates personalizáveis
   - Agendamento de envios

2. **Regras Avançadas**
   - Sistema de regras customizáveis
   - Condições complexas
   - Ações múltiplas

3. **Integração com Calendário**
   - Sincronização com Google Calendar
   - Lembretes de audiências
   - Prazos processuais

4. **Relatórios**
   - Estatísticas de notificações
   - Análise de vencimentos
   - Dashboard de alertas

5. **Notificações Push**
   - Notificações mesmo com o navegador fechado
   - Integração com PWA
   - Notificações móveis

## Considerações Técnicas

### Armazenamento
- Dados armazenados no localStorage
- Persistência entre sessões
- Limpeza automática de notificações antigas (30 dias)

### Performance
- Verificação periódica otimizada
- Debounce em atualizações
- Lazy loading de componentes

### Segurança
- Validação de dados de entrada
- Sanitização de conteúdo
- Controle de permissões do navegador

### Acessibilidade
- Suporte a leitores de tela
- Navegação por teclado
- Contraste adequado

## Conclusão

O sistema de notificações do Clause oferece uma solução completa para alertas sobre contratos e processos, com interface intuitiva e configurações flexíveis. A arquitetura modular permite fácil expansão e manutenção, enquanto a integração com o sistema existente garante uma experiência consistente para o usuário.
