# Guia de Deploy do Zentalk.AI no Render.com

Este guia detalha o processo para fazer o deploy do **Zentalk.AI** na plataforma **Render.com**, garantindo uma hospedagem **gratuita e permanente** com domínio público e HTTPS.

## 🚀 Vantagens do Render.com

- **Plano Gratuito:** Ideal para projetos pessoais e de pequena escala.
- **Deploy Contínuo:** Integração com GitHub para deploys automáticos a cada `git push`.
- **Domínio Público:** URL permanente no formato `seunome.onrender.com`.
- **HTTPS Automático:** Certificados SSL/TLS gratuitos e gerenciados.
- **Banco de Dados:** Oferece instâncias de PostgreSQL gratuitas.

## 📋 Pré-requisitos

1.  **Conta no GitHub:** Com o repositório `renanaraujobraga/zentalk-ai` atualizado.
2.  **Conta no Render.com:** Crie uma conta gratuita em [render.com](https://render.com).

## ⚙️ Passo a Passo do Deploy

### 1. Crie um Novo Serviço Web

- No seu dashboard do Render, clique em **New +** e selecione **Web Service**.
- Conecte sua conta do GitHub e autorize o acesso.
- Selecione o repositório `renanaraujobraga/zentalk-ai`.

### 2. Configure o Serviço

Preencha os campos da seguinte forma:

- **Name:** `zentalk-ai` (ou um nome de sua preferência)
- **Region:** `Oregon (US West)` (ou a região mais próxima de você)
- **Branch:** `main`
- **Root Directory:** `/`
- **Runtime:** `Node`
- **Build Command:** `pnpm install && pnpm drizzle-kit push && node seed-db.mjs && pnpm build`
- **Start Command:** `npx tsx server/index.ts`
- **Plan:** `Free`

### 3. Adicione as Variáveis de Ambiente

Na seção **Environment**, adicione as seguintes variáveis:

| Key | Value |
|---|---|
| `NODE_VERSION` | `22.13.0` |
| `DATABASE_URL` | `file:./zentalk.db` |
| `JWT_SECRET` | *Clique em `Generate` para criar um valor seguro* |
| `NODE_ENV` | `production` |
| `PORT` | `3001` |

### 4. Crie o Serviço

- Clique em **Create Web Service**.
- O Render irá iniciar o processo de build e deploy. Você pode acompanhar o progresso nos logs.

### 5. Acesse seu Site

- Após o deploy ser concluído com sucesso, o Render irá disponibilizar um link público no formato `https://zentalk-ai.onrender.com`.
- Acesse o link para ver seu site no ar!

## 📝 Observações Importantes

- **Primeiro Deploy:** O primeiro build pode levar alguns minutos, pois o Render precisa instalar todas as dependências.
- **Banco de Dados:** O SQLite é utilizado neste guia para simplificar. Para um ambiente de produção mais robusto, considere utilizar o serviço de **PostgreSQL** gratuito do Render e atualizar a `DATABASE_URL`.
- **Atualizações:** Qualquer `git push` para a branch `main` do seu repositório no GitHub irá acionar um novo deploy automaticamente.

## 📞 Suporte

Se encontrar qualquer problema durante o processo, consulte a [documentação do Render](https://render.com/docs) ou me informe para obter ajuda.
