# Guia Visual: Deploy do Zentalk.AI no Render.com

Olá! Como o processo de deploy requer autenticação na sua conta, preparei um guia visual detalhado para você mesmo fazer o deploy do Zentalk.AI no Render.com. É um processo rápido e você terá seu site permanente no ar em poucos minutos.

--- 

### **Passo 1: Acesse o Render e Faça Login com GitHub**

1.  Acesse o site: [https://dashboard.render.com/](https://dashboard.render.com/)
2.  Clique no botão **GitHub** para fazer login.

![Passo 1: Tela de Login do Render](https://i.imgur.com/9a3g2cK.png)

--- 

### **Passo 2: Autorize o Render no GitHub**

- O GitHub irá pedir sua autorização para que o Render possa acessar seus repositórios. Clique em **Authorize Render**.

![Passo 2: Autorização do GitHub](https://i.imgur.com/L3b2Y4d.png)

--- 

### **Passo 3: Crie um Novo Serviço Web**

- Após o login, você será redirecionado para o dashboard.
- Clique em **New +** e depois em **Web Service**.

![Passo 3: Novo Serviço Web](https://i.imgur.com/sX4f3gH.png)

--- 

### **Passo 4: Selecione o Repositório**

- O Render irá mostrar uma lista dos seus repositórios do GitHub.
- Encontre o repositório **`renanaraujobraga/zentalk-ai`** e clique em **Connect**.

![Passo 4: Conectar Repositório](https://i.imgur.com/r5t6Y7j.png)

--- 

### **Passo 5: Configure o Serviço**

Esta é a parte mais importante. Preencha os campos exatamente como descrito abaixo. Todas essas informações já estão no arquivo `render.yaml` que eu criei no seu repositório.

- **Name**: `zentalk-ai` (ou o nome que preferir)
- **Region**: `Oregon (US West)` (ou a mais próxima de você)
- **Branch**: `main`
- **Root Directory**: deixe em branco
- **Runtime**: `Node`
- **Build Command**: `pnpm install && pnpm drizzle-kit push && node seed-db.mjs && pnpm build`
- **Start Command**: `npx tsx server/index.ts`
- **Plan**: `Free`

![Passo 5: Configuração do Serviço](https://i.imgur.com/dF9j8kL.png)

--- 

### **Passo 6: Adicione as Variáveis de Ambiente**

- Role a página para baixo até a seção **Environment**.
- Clique em **Add Environment Variable** e adicione as seguintes variáveis, uma por uma:

| Key | Value |
|---|---|
| `NODE_VERSION` | `22.13.0` |
| `DATABASE_URL` | `file:./zentalk.db` |
| `JWT_SECRET` | *Clique no botão `Generate` ao lado do campo para criar um valor seguro* |
| `NODE_ENV` | `production` |
| `PORT` | `3001` |

![Passo 6: Variáveis de Ambiente](https://i.imgur.com/sV7gH8j.png)

--- 

### **Passo 7: Inicie o Deploy!**

- Role até o final da página.
- Clique no botão **Create Web Service**.

![Passo 7: Criar Serviço](https://i.imgur.com/O4k3j2M.png)

--- 

### **Passo 8: Aguarde a Conclusão**

- O Render irá começar o processo de build e deploy. Isso pode levar de 5 a 10 minutos.
- Você pode acompanhar o progresso na aba **Events**.
- Quando o status mudar para **`Live`**, seu site estará no ar!
- O link permanente será exibido no topo da página, algo como `https://zentalk-ai.onrender.com`.

![Passo 8: Deploy em Progresso](https://i.imgur.com/c9L2b1N.png)

--- 

## 📞 **Precisa de Ajuda?**

Se você tiver qualquer dúvida ou encontrar algum problema, me avise! Estou aqui para ajudar a garantir que seu site fique online.
