# Configuração de Variáveis de Ambiente no Render

## ⚠️ IMPORTANTE: Configure as Variáveis de Ambiente

O site está em branco porque as variáveis de ambiente não estão configuradas no Render. Siga estes passos:

## 📋 Passo a Passo

### 1. Acesse as Configurações do Serviço

1. Vá para https://dashboard.render.com/
2. Clique no serviço **zentalk-ai**
3. Clique em **"Environment"** no menu lateral esquerdo

### 2. Adicione as Variáveis de Ambiente

Clique em **"Add Environment Variable"** e adicione CADA UMA das seguintes variáveis:

| Key | Value | Descrição |
|-----|-------|-----------|
| `NODE_ENV` | `production` | Ambiente de produção |
| `PORT` | `3001` | Porta do servidor |
| `DATABASE_URL` | `file:./zentalk.db` | Caminho do banco SQLite |
| `JWT_SECRET` | *Clique em "Generate"* | Chave secreta para JWT (use o botão Generate) |
| `NODE_VERSION` | `22.13.0` | Versão do Node.js |

### 3. Salve e Faça Deploy

1. Após adicionar TODAS as variáveis, clique em **"Save Changes"**
2. O Render irá automaticamente fazer um novo deploy
3. Aguarde 3-5 minutos

### 4. Verifique o Site

Após o deploy completar, acesse:
**https://zentalk-ai.onrender.com/**

O site deve carregar corretamente agora!

## 🔍 Como Verificar se Funcionou

Nos logs do Render, você deve ver:

```
[dotenv@17.2.4] injecting env (5) from .env
```

O número entre parênteses deve ser **5** (ou mais), não **0**.

## ❓ Dúvidas?

Se ainda houver problemas, verifique:
- Todas as 5 variáveis foram adicionadas?
- O deploy completou sem erros?
- Os logs mostram algum erro em vermelho?
