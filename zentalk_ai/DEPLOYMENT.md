# Guia de Deploy - Zentalk.AI

Este documento descreve como preparar e fazer deploy do Zentalk.AI em produção.

## 📋 Checklist Pré-Deploy

- [ ] Compilar frontend: `npm run build`
- [ ] Testar endpoints: `npm test`
- [ ] Revisar variáveis de ambiente
- [ ] Backup do banco de dados
- [ ] Verificar logs de erro
- [ ] Testar fluxos críticos

## 🔐 Variáveis de Ambiente Obrigatórias

```env
# Servidor
PORT=3001
NODE_ENV=production

# JWT
JWT_SECRET=seu_secret_super_seguro_com_minimo_32_caracteres

# Banco de dados
DATABASE_URL=sqlite:./zentalk.db  # ou postgresql://...

# CORS
CORS_ORIGIN=https://seu-dominio.com

# Opcional
LOG_LEVEL=info
```

## 🚀 Deploy em Manus Hosting

O projeto está totalmente pronto para deploy no Manus Hosting:

1. **Preparar para deploy**
   ```bash
   npm run build
   ```

2. **Criar checkpoint**
   - Ir para Management UI
   - Clicar em "Save Checkpoint"
   - Adicionar mensagem descritiva

3. **Publicar**
   - Clicar em "Publish" (aparece após checkpoint)
   - Aguardar deploy automático

## 🐳 Deploy com Docker

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Instalar dependências
COPY package*.json ./
RUN npm ci --only=production

# Copiar código
COPY . .

# Compilar frontend
RUN npm run build

# Expor porta
EXPOSE 3001

# Iniciar servidor
CMD ["npm", "run", "server:prod"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  zentalk:
    build: .
    ports:
      - "3001:3001"
    environment:
      NODE_ENV: production
      PORT: 3001
      JWT_SECRET: ${JWT_SECRET}
      DATABASE_URL: sqlite:./zentalk.db
    volumes:
      - ./zentalk.db:/app/zentalk.db
    restart: unless-stopped
```

### Executar com Docker

```bash
# Build
docker build -t zentalk-ai .

# Run
docker run -p 3001:3001 \
  -e JWT_SECRET=seu_secret \
  -e NODE_ENV=production \
  zentalk-ai
```

## ☁️ Deploy em Heroku

### 1. Preparar Heroku

```bash
# Instalar Heroku CLI
npm install -g heroku

# Login
heroku login

# Criar app
heroku create zentalk-ai
```

### 2. Configurar variáveis

```bash
heroku config:set JWT_SECRET=seu_secret_super_seguro
heroku config:set NODE_ENV=production
```

### 3. Deploy

```bash
# Adicionar remote
git remote add heroku https://git.heroku.com/zentalk-ai.git

# Deploy
git push heroku main

# Ver logs
heroku logs --tail
```

## ☁️ Deploy em Railway

### 1. Conectar repositório

- Ir para https://railway.app
- Clicar em "New Project"
- Selecionar "Deploy from GitHub"
- Autorizar e selecionar repositório

### 2. Configurar variáveis

No painel do Railway:
- Ir para "Variables"
- Adicionar:
  - `JWT_SECRET`: seu secret
  - `NODE_ENV`: production
  - `PORT`: 3001

### 3. Deploy automático

O Railway fará deploy automaticamente a cada push para `main`.

## ☁️ Deploy em AWS

### EC2 + PM2

```bash
# 1. Conectar via SSH
ssh -i key.pem ec2-user@seu-ip

# 2. Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Clonar repositório
git clone <repo-url>
cd zentalk_ai

# 4. Instalar dependências
npm install

# 5. Compilar
npm run build

# 6. Instalar PM2
npm install -g pm2

# 7. Iniciar com PM2
pm2 start "npm run server:prod" --name zentalk

# 8. Salvar configuração
pm2 save
pm2 startup
```

### RDS para Banco de Dados

```bash
# Atualizar DATABASE_URL
export DATABASE_URL=postgresql://user:pass@rds-endpoint:5432/zentalk

# Rodar migrações
npm run db:push
```

## 🔄 CI/CD com GitHub Actions

### .github/workflows/deploy.yml

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm ci
      - run: npm run build
      - run: npm test
      
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: zentalk-ai
          heroku_email: seu-email@example.com
```

## 📊 Monitoramento em Produção

### Logs

```bash
# Manus Hosting
# Visualizar em Management UI → Dashboard

# Heroku
heroku logs --tail

# Railway
# Visualizar em painel do Railway

# Docker
docker logs -f container-id
```

### Health Check

```bash
curl https://seu-dominio.com/api/health
```

Resposta esperada:
```json
{"status":"ok","timestamp":"2026-02-11T00:38:45.399Z"}
```

## 🔒 Segurança em Produção

### 1. HTTPS

- Usar certificado SSL/TLS
- Redirecionar HTTP → HTTPS
- Configurar HSTS headers

### 2. Senhas

```bash
# Gerar secret seguro
openssl rand -base64 32
```

### 3. Backup

```bash
# Backup diário do banco
0 2 * * * cp /app/zentalk.db /backups/zentalk-$(date +%Y%m%d).db
```

### 4. Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite de 100 requisições
});

app.use('/api/', limiter);
```

## 🚨 Troubleshooting

### Erro: "Port already in use"

```bash
# Encontrar processo
lsof -i :3001

# Matar processo
kill -9 <PID>
```

### Erro: "Database is locked"

```bash
# Reiniciar servidor
pm2 restart zentalk

# Ou com Docker
docker restart container-id
```

### Erro: "JWT token expired"

- Aumentar `JWT_EXPIRATION` em `.env`
- Ou implementar refresh tokens

### Performance lenta

```bash
# Verificar uso de CPU/memória
top

# Otimizar queries
npm run db:analyze

# Aumentar heap size
NODE_OPTIONS="--max-old-space-size=4096" npm run server:prod
```

## 📈 Escalabilidade

### Banco de dados

Para >100k registros, migrar para PostgreSQL:

```bash
# Atualizar DATABASE_URL
export DATABASE_URL=postgresql://...

# Rodar migrações
npm run db:push
```

### Load Balancing

Com múltiplas instâncias:

```bash
# Usar PM2 cluster mode
pm2 start "npm run server:prod" -i max --name zentalk
```

### Cache

Implementar Redis para cache:

```typescript
import redis from 'redis';

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});
```

## ✅ Checklist Pós-Deploy

- [ ] Testar login em produção
- [ ] Verificar endpoints de API
- [ ] Confirmar HTTPS funcionando
- [ ] Revisar logs de erro
- [ ] Testar fluxos críticos
- [ ] Monitorar performance
- [ ] Backup do banco de dados

## 📞 Suporte

Para problemas durante o deploy, consulte:
- Documentação do provedor de hosting
- Logs da aplicação
- GitHub Issues do projeto
