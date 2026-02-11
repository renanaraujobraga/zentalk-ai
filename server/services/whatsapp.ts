import { db } from '../db'
import { whatsappAccounts, whatsappConversations, whatsappMessages, whatsappWebhooks, agents } from '../../drizzle/schema'
import { eq, and } from 'drizzle-orm'
import { generateAutoReply } from './llm'

/**
 * WhatsApp Service - Gerencia contas, conversas e mensagens do WhatsApp
 */

// Tipos
export interface WhatsAppMessage {
  id: string
  from: string
  to: string
  text: string
  timestamp: number
  type?: 'text' | 'image' | 'document' | 'audio' | 'video'
  mediaUrl?: string
}

export interface WhatsAppWebhookPayload {
  object: string
  entry: Array<{
    id: string
    changes: Array<{
      value: {
        messaging_product: string
        metadata: {
          display_phone_number: string
          phone_number_id: string
        }
        messages?: Array<WhatsAppMessage>
        statuses?: Array<{
          id: string
          status: string
          timestamp: number
          recipient_id: string
        }>
      }
    }>
  }>
}

/**
 * Validar webhook token do WhatsApp
 */
export async function validateWebhookToken(
  accountId: number,
  token: string
): Promise<boolean> {
  const account = await db
    .select()
    .from(whatsappAccounts)
    .where(eq(whatsappAccounts.id, accountId))
    .limit(1)

  if (!account.length) return false
  return account[0].webhookToken === token
}

/**
 * Processar webhook de mensagem recebida
 */
export async function processIncomingMessage(
  payload: WhatsAppWebhookPayload,
  accountId: number
): Promise<void> {
  // Log webhook
  await db.insert(whatsappWebhooks).values({
    whatsappAccountId: accountId,
    eventType: 'message_received',
    payload: JSON.stringify(payload),
    status: 'pending',
    createdAt: new Date(),
  })

  // Processar mensagens
  for (const entry of payload.entry) {
    for (const change of entry.changes) {
      if (!change.value.messages) continue

      for (const message of change.value.messages) {
        await handleIncomingMessage(accountId, message, change.value.metadata.phone_number_id)
      }
    }
  }
}

/**
 * Processar uma mensagem recebida
 */
async function handleIncomingMessage(
  accountId: number,
  message: WhatsAppMessage,
  phoneNumberId: string
): Promise<void> {
  try {
    // Encontrar ou criar conversa
    let conversation = await db
      .select()
      .from(whatsappConversations)
      .where(
        and(
          eq(whatsappConversations.whatsappAccountId, accountId),
          eq(whatsappConversations.contactPhoneNumber, message.from)
        )
      )
      .limit(1)

    let conversationId: number

    if (!conversation.length) {
      // Criar nova conversa
      const agentList = await db
        .select()
        .from(agents)
        .limit(1)

      if (!agentList.length) {
        console.error('No agents available for conversation')
        return
      }

      const newConversation = await db
        .insert(whatsappConversations)
        .values({
          whatsappAccountId: accountId,
          agentId: agentList[0].id,
          contactPhoneNumber: message.from,
          contactName: message.from,
          status: 'active',
          messageCount: 1,
          lastMessageAt: new Date(message.timestamp * 1000),
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning()

      conversation = newConversation
      conversationId = newConversation[0].id
    } else {
      conversationId = conversation[0].id
      // Atualizar conversa
      await db
        .update(whatsappConversations)
        .set({
          messageCount: (conversation[0].messageCount || 0) + 1,
          lastMessageAt: new Date(message.timestamp * 1000),
          updatedAt: new Date(),
        })
        .where(eq(whatsappConversations.id, conversationId))
    }

    // Salvar mensagem
    await db.insert(whatsappMessages).values({
      conversationId,
      messageId: message.id,
      sender: 'user',
      content: message.text,
      messageType: (message.type || 'text') as any,
      status: 'delivered',
      createdAt: new Date(message.timestamp * 1000),
    })

    console.log(`Message received from ${message.from}: ${message.text}`)

    // Gerar resposta automática
    await generateAndSendAutoReply(conversationId, message.text, phoneNumberId, accountId)
  } catch (error) {
    console.error('Error handling incoming message:', error)
  }
}

/**
 * Gerar e enviar resposta automática
 */
async function generateAndSendAutoReply(
  conversationId: number,
  userMessage: string,
  phoneNumberId: string,
  accountId: number
): Promise<void> {
  try {
    // Obter informações da conversa e agente
    const conversation = await db
      .select()
      .from(whatsappConversations)
      .where(eq(whatsappConversations.id, conversationId))
      .limit(1)

    if (!conversation.length) return

    const agent = await db
      .select()
      .from(agents)
      .where(eq(agents.id, conversation[0].agentId))
      .limit(1)

    if (!agent.length) return

    // Obter histórico de mensagens
    const messageHistory = await db
      .select()
      .from(whatsappMessages)
      .where(eq(whatsappMessages.conversationId, conversationId))

    const conversationHistory = messageHistory.map((msg) => ({
      sender: msg.sender,
      content: msg.content,
    }))

    // Gerar resposta
    const autoReply = await generateAutoReply(
      userMessage,
      agent[0].name,
      conversationHistory
    )

    // Obter conta WhatsApp
    const account = await db
      .select()
      .from(whatsappAccounts)
      .where(eq(whatsappAccounts.id, accountId))
      .limit(1)

    if (!account.length) return

    // Enviar resposta
    await sendWhatsAppMessage(
      conversationId,
      autoReply,
      account[0].accessToken,
      account[0].businessAccountId
    )

    console.log(`Auto reply sent: ${autoReply}`)
  } catch (error) {
    console.error('Error generating auto reply:', error)
  }
}

/**
 * Enviar mensagem via WhatsApp
 */
export async function sendWhatsAppMessage(
  conversationId: number,
  content: string,
  accessToken: string,
  phoneNumberId: string
): Promise<string | null> {
  try {
    const conversation = await db
      .select()
      .from(whatsappConversations)
      .where(eq(whatsappConversations.id, conversationId))
      .limit(1)

    if (!conversation.length) {
      throw new Error('Conversation not found')
    }

    const contactPhone = conversation[0].contactPhoneNumber

    // Chamar API do WhatsApp
    const response = await fetch(
      `https://graph.instagram.com/v18.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: contactPhone,
          type: 'text',
          text: {
            preview_url: false,
            body: content,
          },
        }),
      }
    )

    const data = await response.json() as { messages?: Array<{ id: string }> }

    if (!response.ok) {
      throw new Error(`WhatsApp API error: ${JSON.stringify(data)}`)
    }

    const messageId = data.messages?.[0]?.id || 'unknown'

    // Salvar mensagem no banco
    await db.insert(whatsappMessages).values({
      conversationId,
      messageId,
      sender: 'agent',
      content,
      messageType: 'text',
      status: 'sent',
      createdAt: new Date(),
    })

    return messageId
  } catch (error) {
    console.error('Error sending WhatsApp message:', error)
    return null
  }
}

/**
 * Obter conversas de uma conta WhatsApp
 */
export async function getConversations(accountId: number) {
  return db
    .select()
    .from(whatsappConversations)
    .where(eq(whatsappConversations.whatsappAccountId, accountId))
}

/**
 * Obter mensagens de uma conversa
 */
export async function getMessages(conversationId: number) {
  return db
    .select()
    .from(whatsappMessages)
    .where(eq(whatsappMessages.conversationId, conversationId))
}

/**
 * Obter conta WhatsApp por ID
 */
export async function getWhatsAppAccount(accountId: number) {
  return db
    .select()
    .from(whatsappAccounts)
    .where(eq(whatsappAccounts.id, accountId))
    .limit(1)
}

/**
 * Criar nova conta WhatsApp
 */
export async function createWhatsAppAccount(
  clientId: number,
  phoneNumber: string,
  businessAccountId: string,
  accessToken: string,
  webhookToken: string
) {
  return db.insert(whatsappAccounts).values({
    clientId,
    phoneNumber,
    businessAccountId,
    accessToken,
    webhookToken,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  })
}
