import { Router, Request, Response } from 'express'
import { verifyToken } from '../auth'
import {
  validateWebhookToken,
  processIncomingMessage,
  sendWhatsAppMessage,
  getConversations,
  getMessages,
  getWhatsAppAccount,
  createWhatsAppAccount,
  type WhatsAppWebhookPayload,
} from '../services/whatsapp'

const router = Router()

/**
 * GET /api/whatsapp/webhook
 * Verificar webhook do WhatsApp (challenge)
 */
router.get('/webhook', async (req: Request, res: Response) => {
  const mode = req.query['hub.mode']
  const token = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']

  // Validar token
  if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_TOKEN) {
    console.log('Webhook verified')
    res.status(200).send(challenge)
  } else {
    console.error('Webhook verification failed')
    res.status(403).send('Forbidden')
  }
})

/**
 * POST /api/whatsapp/webhook
 * Receber mensagens do WhatsApp
 */
router.post('/webhook', async (req: Request, res: Response) => {
  const payload = req.body as WhatsAppWebhookPayload

  try {
    // Validar payload
    if (!payload.entry || !Array.isArray(payload.entry)) {
      return res.status(400).json({ error: 'Invalid payload' })
    }

    // Processar webhook (usar account ID 1 por enquanto)
    // Em produção, você precisaria extrair o account ID do payload
    const accountId = 1
    await processIncomingMessage(payload, accountId)

    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * GET /api/whatsapp/accounts
 * Listar contas WhatsApp do cliente autenticado
 */
router.get('/accounts', (req: Request, res: Response, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  const decoded = verifyToken(token)
  if (!decoded) return res.status(401).json({ error: 'Unauthorized' })
  (req as any).userId = decoded.userId
  next()
}, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const clientId = req.query.clientId as string

    if (!clientId) {
      return res.status(400).json({ error: 'clientId is required' })
    }

    // Verificar se o usuário tem acesso ao cliente
    const { db } = await import('../db')
    const { clients } = await import('../../drizzle/schema')
    const { eq } = await import('drizzle-orm')

    const client = await db
      .select()
      .from(clients)
      .where(eq(clients.id, parseInt(clientId)))
      .limit(1)

    if (!client.length || client[0].userId !== userId) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    // Obter contas WhatsApp
    const { whatsappAccounts } = await import('../../drizzle/schema')
    const accounts = await db
      .select()
      .from(whatsappAccounts)
      .where(eq(whatsappAccounts.clientId, parseInt(clientId)))

    res.json({ accounts })
  } catch (error) {
    console.error('Error fetching accounts:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * POST /api/whatsapp/accounts
 * Criar nova conta WhatsApp
 */
router.post('/accounts', (req: Request, res: Response, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  const decoded = verifyToken(token)
  if (!decoded) return res.status(401).json({ error: 'Unauthorized' })
  (req as any).userId = decoded.userId
  next()
}, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { clientId, phoneNumber, businessAccountId, accessToken } = req.body

    if (!clientId || !phoneNumber || !businessAccountId || !accessToken) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Verificar se o usuário tem acesso ao cliente
    const { db } = await import('../db')
    const { clients } = await import('../../drizzle/schema')
    const { eq } = await import('drizzle-orm')

    const client = await db
      .select()
      .from(clients)
      .where(eq(clients.id, parseInt(clientId)))
      .limit(1)

    if (!client.length || client[0].userId !== userId) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    // Gerar webhook token
    const webhookToken = Math.random().toString(36).substring(2, 15)

    // Criar conta
    const account = await createWhatsAppAccount(
      parseInt(clientId),
      phoneNumber,
      businessAccountId,
      accessToken,
      webhookToken
    )

    res.json({ account, webhookToken })
  } catch (error) {
    console.error('Error creating account:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * GET /api/whatsapp/conversations/:accountId
 * Listar conversas de uma conta WhatsApp
 */
router.get('/conversations/:accountId', (req: Request, res: Response, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  const decoded = verifyToken(token)
  if (!decoded) return res.status(401).json({ error: 'Unauthorized' })
  (req as any).userId = decoded.userId
  next()
}, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const accountId = parseInt(req.params.accountId)

    // Verificar acesso
    const account = await getWhatsAppAccount(accountId)
    if (!account.length) {
      return res.status(404).json({ error: 'Account not found' })
    }

    const { db } = await import('../db')
    const { clients } = await import('../../drizzle/schema')
    const { eq } = await import('drizzle-orm')

    const client = await db
      .select()
      .from(clients)
      .where(eq(clients.id, account[0].clientId))
      .limit(1)

    if (!client.length || client[0].userId !== userId) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    const conversations = await getConversations(accountId)
    res.json({ conversations })
  } catch (error) {
    console.error('Error fetching conversations:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * GET /api/whatsapp/messages/:conversationId
 * Obter mensagens de uma conversa
 */
router.get('/messages/:conversationId', (req: Request, res: Response, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  const decoded = verifyToken(token)
  if (!decoded) return res.status(401).json({ error: 'Unauthorized' })
  (req as any).userId = decoded.userId
  next()
}, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const conversationId = parseInt(req.params.conversationId)

    // Verificar acesso
    const { db } = await import('../db')
    const { whatsappConversations, clients } = await import('../../drizzle/schema')
    const { eq } = await import('drizzle-orm')

    const conversation = await db
      .select()
      .from(whatsappConversations)
      .where(eq(whatsappConversations.id, conversationId))
      .limit(1)

    if (!conversation.length) {
      return res.status(404).json({ error: 'Conversation not found' })
    }

    // Verificar acesso via account
    const account = await getWhatsAppAccount(conversation[0].whatsappAccountId)
    if (!account.length) {
      return res.status(404).json({ error: 'Account not found' })
    }

    const client = await db
      .select()
      .from(clients)
      .where(eq(clients.id, account[0].clientId))
      .limit(1)

    if (!client.length || client[0].userId !== userId) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    const messages = await getMessages(conversationId)
    res.json({ messages })
  } catch (error) {
    console.error('Error fetching messages:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * POST /api/whatsapp/messages/:conversationId
 * Enviar mensagem em uma conversa
 */
router.post('/messages/:conversationId', (req: Request, res: Response, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  const decoded = verifyToken(token)
  if (!decoded) return res.status(401).json({ error: 'Unauthorized' })
  (req as any).userId = decoded.userId
  next()
}, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const conversationId = parseInt(req.params.conversationId)
    const { content } = req.body

    if (!content) {
      return res.status(400).json({ error: 'content is required' })
    }

    // Verificar acesso
    const { db } = await import('../db')
    const { whatsappConversations, clients, whatsappAccounts } = await import('../../drizzle/schema')
    const { eq } = await import('drizzle-orm')

    const conversation = await db
      .select()
      .from(whatsappConversations)
      .where(eq(whatsappConversations.id, conversationId))
      .limit(1)

    if (!conversation.length) {
      return res.status(404).json({ error: 'Conversation not found' })
    }

    // Verificar acesso via account
    const account = await db
      .select()
      .from(whatsappAccounts)
      .where(eq(whatsappAccounts.id, conversation[0].whatsappAccountId))
      .limit(1)

    if (!account.length) {
      return res.status(404).json({ error: 'Account not found' })
    }

    const client = await db
      .select()
      .from(clients)
      .where(eq(clients.id, account[0].clientId))
      .limit(1)

    if (!client.length || client[0].userId !== userId) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    // Enviar mensagem
    const messageId = await sendWhatsAppMessage(
      conversationId,
      content,
      account[0].accessToken,
      account[0].businessAccountId
    )

    if (!messageId) {
      return res.status(500).json({ error: 'Failed to send message' })
    }

    res.json({ messageId, status: 'sent' })
  } catch (error) {
    console.error('Error sending message:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
