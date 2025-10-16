# Deploy na Netlify - Clause

## 🚀 Deploy Automático via Git

### 1. Preparação do Repositório

1. **Commit e push** de todos os arquivos:
```bash
git add .
git commit -m "feat: prepare for netlify deployment"
git push origin main
```

### 2. Deploy na Netlify

1. **Acesse** [netlify.com](https://netlify.com)
2. **Faça login** com sua conta
3. **Clique** em "New site from Git"
4. **Conecte** seu repositório GitHub/GitLab
5. **Configure** as seguintes opções:

#### Build Settings:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: `18`

#### Environment Variables (opcional):
```
VITE_API_URL=https://api.clause.com
VITE_APP_NAME=Clause
VITE_APP_VERSION=1.0.0
```

### 3. Deploy Manual

Se preferir fazer deploy manual:

```bash
# Build do projeto
npm run build

# O build será criado na pasta 'dist'
# Faça upload da pasta 'dist' para a Netlify
```

## 🔧 Configurações Específicas

### Arquivos de Configuração

- **`netlify.toml`**: Configuração principal do Netlify
- **`_redirects`**: Redirecionamentos para SPA
- **`vite.config.prod.ts`**: Configuração otimizada para produção

### Otimizações Incluídas

- **Code splitting** automático
- **Minificação** com Terser
- **Chunking** inteligente por funcionalidade
- **Source maps** desabilitados em produção
- **MSW desabilitado** em produção

## 📱 Funcionalidades em Produção

### ✅ Funcionará:
- Interface completa
- Navegação entre páginas
- Formulários e validações
- Design responsivo
- Componentes interativos

### ⚠️ Requer Backend:
- Autenticação real
- CRUD de dados
- Editor jurídico com IA
- Upload de arquivos
- Notificações

## 🔌 Integração com Backend

### Para conectar com API real:

1. **Configure** a variável `VITE_API_URL` na Netlify
2. **Atualize** `src/lib/api.ts` com a URL real
3. **Substitua** os mocks pelos endpoints reais
4. **Configure** CORS no backend

### Exemplo de configuração:

```typescript
// src/lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'
```

## 🚀 Deploy Rápido

### Opção 1: Drag & Drop
1. Execute `npm run build`
2. Acesse [netlify.com/drop](https://netlify.com/drop)
3. Arraste a pasta `dist` para a área de drop

### Opção 2: Netlify CLI
```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

## 📊 Monitoramento

### Netlify Analytics
- Acesse o dashboard da Netlify
- Monitore performance e erros
- Configure alertas

### Logs
- Acesse "Functions" > "Logs" no dashboard
- Monitore erros de build e runtime

## 🔄 Atualizações

### Deploy Automático
- Push para `main` = deploy automático
- Pull requests = preview deployments

### Deploy Manual
```bash
git push origin main
# Aguarde o deploy automático
```

## 🛠️ Troubleshooting

### Erro de Build
1. Verifique os logs na Netlify
2. Teste localmente: `npm run build`
3. Verifique dependências

### Erro 404
1. Verifique se `_redirects` está na raiz
2. Configure redirects no `netlify.toml`

### Erro de CORS
1. Configure CORS no backend
2. Use proxy no `netlify.toml` se necessário

## 📈 Performance

### Otimizações Aplicadas
- **Lazy loading** de rotas
- **Code splitting** por funcionalidade
- **Minificação** de código
- **Compressão** de assets
- **Cache** de assets estáticos

### Métricas Esperadas
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

---

**Clause** - Deploy otimizado para produção na Netlify! 🚀
