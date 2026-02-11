import { Router, Request, Response } from 'express'
import { verifyToken } from '../auth'
import { db } from '../db'
import { whatsappMessages, whatsappConversations, agents } from '../../drizzle/schema'
import { eq, gte, lte, and } from 'drizzle-orm'

const router = Router()

/**
 * GET /api/analytics
 * Obter dados de analytics
 */
router.get('/', (req: Request, res: Response, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  const decoded = verifyToken(token)
  if (!decoded) return res.status(401).json({ error: 'Unauthorized' })
  (req as any).userId = decoded.userId
  next()
}, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId

    // Dados simulados (em produção, viria do banco)
    const now = new Date()
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now)
      date.setDate(date.getDate() - (6 - i))
      return {
        date: date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
        count: Math.floor(Math.random() * 100) + 20,
      }
    })

    const agentPerformance = [
      {
        agent: 'Agent 1',
        responseTime: 45,
        satisfaction: 92,
      },
      {
        agent: 'Agent 2',
        responseTime: 38,
        satisfaction: 95,
      },
      {
        agent: 'Agent 3',
        responseTime: 52,
        satisfaction: 88,
      },
      {
        agent: 'Agent 4',
        responseTime: 41,
        satisfaction: 91,
      },
    ]

    const conversationStatus = [
      { status: 'Ativa', count: 45 },
      { status: 'Encerrada', count: 120 },
      { status: 'Aguardando', count: 18 },
      { status: 'Pausada', count: 7 },
    ]

    const topAgents = [
      { name: 'Agent 2', messages: 234 },
      { name: 'Agent 1', messages: 198 },
      { name: 'Agent 4', messages: 176 },
      { name: 'Agent 3', messages: 142 },
    ]

    const metrics = {
      totalMessages: 750,
      avgResponseTime: 44,
      avgSatisfaction: 91.5,
      activeConversations: 45,
    }

    res.json({
      messagesTrend: last7Days,
      agentPerformance,
      conversationStatus,
      topAgents,
      metrics,
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * GET /api/analytics/agent/:agentId
 * Obter analytics de um agente específico
 */
router.get('/agent/:agentId', (req: Request, res: Response, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  const decoded = verifyToken(token)
  if (!decoded) return res.status(401).json({ error: 'Unauthorized' })
  (req as any).userId = decoded.userId
  next()
}, async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params

    // Dados simulados
    const agentStats = {
      agentId: parseInt(agentId),
      totalMessages: 234,
      totalConversations: 45,
      avgResponseTime: 38,
      avgSatisfaction: 95,
      messagesPerDay: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
        count: Math.floor(Math.random() * 50) + 10,
      })),
      satisfactionTrend: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
        satisfaction: Math.floor(Math.random() * 20) + 85,
      })),
    }

    res.json(agentStats)
  } catch (error) {
    console.error('Error fetching agent analytics:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * GET /api/analytics/conversation/:conversationId
 * Obter analytics de uma conversa
 */
router.get('/conversation/:conversationId', (req: Request, res: Response, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  const decoded = verifyToken(token)
  if (!decoded) return res.status(401).json({ error: 'Unauthorized' })
  (req as any).userId = decoded.userId
  next()
}, async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params

    // Dados simulados
    const conversationStats = {
      conversationId: parseInt(conversationId),
      totalMessages: 42,
      duration: 3600, // segundos
      avgResponseTime: 45,
      satisfaction: 92,
      messages: [
        {
          id: 1,
          sender: 'user',
          content: 'Olá, preciso de ajuda',
          timestamp: new Date(),
        },
        {
          id: 2,
          sender: 'agent',
          content: 'Olá! Como posso ajudá-lo?',
          timestamp: new Date(),
        },
      ],
    }

    res.json(conversationStats)
  } catch (error) {
    console.error('Error fetching conversation analytics:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
