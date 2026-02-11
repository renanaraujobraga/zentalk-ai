# Configuração de Webhook Real - WhatsApp Business API

## 📋 Pré-requisitos

1. **Conta WhatsApp Business**: https://www.whatsapp.com/business/
2. **Meta Business Account**: https://business.facebook.com/
3. **Manus Hosting Ativo**: Seu app deve estar publicado no Manus
4. **Access Token**: Gerado via Meta App Dashboard

## 🔧 Passo 1: Obter URL do Webhook

Seu webhook está disponível em:

```
https://[seu-dominio].manus.space/api/whatsapp/webhook
```

**Exemplo:**
```
https://zentalkai.manus.space/api/whatsapp/webhook
```

## 🔐 Passo 2: Gerar Webhook Token

No painel admin do Zentalk.AI, vá para **WhatsApp → Contas** e clique em "Gerar Token de Webhook".

Salve o token gerado:
```
WEBHOOK_TOKEN=seu_token_aqui
```

## 📱 Passo 3: Configurar no Meta Business Manager

1. Acesse: https://developers.facebook.com/
2. Vá para **Meus Aplicativos** → Selecione seu app
3. No menu esquerdo, clique em **Webhooks**
4. Clique em **Editar Inscrição**

### Configurar Webhook

- **URL de Callback**: `https://zentalkai.manus.space/api/whatsapp/webhook`
- **Token de Verificação**: Cole o token gerado no Passo 2
- **Campos de Inscrição**: Selecione:
  - `messages`
  - `message_status`
  - `message_template_status_update`

### Verificação de Webhook

O Meta enviará uma requisição GET para verificar seu webhook:

```
GET /api/whatsapp/webhook?hub.mode=subscribe&hub.challenge=CHALLENGE_TOKEN&hub.verify_token=YOUR_VERIFY_TOKEN
```

Seu servidor deve responder com:
```json
{
  "hub.challenge": "CHALLENGE_TOKEN"
}
```

**Status**: ✅ Já implementado no Zentalk.AI

## 🔑 Passo 4: Adicionar Conta WhatsApp

No painel admin:

1. Vá para **WhatsApp → Contas**
2. Clique em **+ Adicionar Conta**
3. Preencha:
   - **Número de Telefone**: Seu número WhatsApp Business (com código de país)
   - **Business Account ID**: Encontre em Meta Business Manager
   - **Access Token**: Seu token de acesso do Meta

4. Clique em **Salvar**

## ✅ Passo 5: Testar Webhook

### Teste Manual

```bash
# Enviar mensagem de teste
curl -X POST https://zentalkai.manus.space/api/whatsapp/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "object": "whatsapp_business_account",
    "entry": [{
      "id": "123456789",
      "changes": [{
        "value": {
          "messaging_product": "whatsapp",
          "metadata": {
            "display_phone_number": "1234567890",
            "phone_number_id": "123456789"
          },
          "messages": [{
            "from": "5511999999999",
            "id": "wamid.xxx",
            "timestamp": 1234567890,
            "type": "text",
            "text": "Olá, teste de webhook!"
          }]
        }
      }]
    }]
  }'
```

### Verificar Logs

No painel admin, vá para **WhatsApp → Webhooks** para ver:
- Eventos recebidos
- Status de processamento
- Erros (se houver)

## 🔄 Fluxo de Mensagens

### Receber Mensagem

```
Cliente WhatsApp → Meta API → Seu Webhook → Banco de Dados
                                         ↓
                                    LLM (IA)
                                         ↓
                              Resposta Automática
```

### Enviar Mensagem

```
Admin/Cliente → Seu App → Meta API → WhatsApp → Cliente
```

## 🚨 Troubleshooting

### Webhook não está recebendo mensagens

1. **Verificar URL**: Certifique-se de que a URL está correta e acessível
2. **Verificar Token**: Confirme que o token de verificação está correto
3. **Verificar Inscrição**: Vá para Meta App Dashboard e confirme que `messages` está selecionado
4. **Logs**: Verifique os logs do servidor em **WhatsApp → Webhooks**

### Erro 401 Unauthorized

- Verifique se o `Access Token` está correto
- Tokens expiram após 60 dias, renove se necessário
- Confirme que o token tem permissões `whatsapp_business_messaging`

### Erro 400 Bad Request

- Verifique se o JSON está bem formado
- Confirme que o `phone_number_id` está correto
- Verifique se o número de telefone está no formato correto (com código de país)

## 📊 Monitorar Webhook

No painel admin, você pode:

1. **Ver Eventos**: Todos os webhooks recebidos
2. **Ver Conversas**: Histórico de mensagens por cliente
3. **Ver Status**: Se a mensagem foi entregue, lida, etc.

## 🔐 Segurança

- ✅ Tokens de webhook são armazenados com hash
- ✅ Validação de assinatura de webhook (implementada)
- ✅ Rate limiting (implementado)
- ✅ Logs de auditoria (implementado)

## 📞 Suporte

Se tiver problemas:

1. Verifique os logs em **WhatsApp → Webhooks**
2. Consulte a documentação do Meta: https://developers.facebook.com/docs/whatsapp
3. Entre em contato com suporte

---

**Última atualização**: 2026-02-11
**Status**: ✅ Pronto para Produção
