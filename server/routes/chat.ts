import { Router, Request, Response } from 'express'
import { db } from '../db'
import { aiChatConfig } from '../../drizzle/schema'

const router = Router()

const DEFAULT_SYSTEM_PROMPT = `Você é o assistente virtual oficial da Zentalk.AI, uma plataforma SaaS de atendimento ao cliente com inteligência artificial para WhatsApp.

## SOBRE A ZENTALK.AI

**O que é:** Zentalk.AI é uma plataforma que permite empresas criarem agentes de IA para atendimento automatizado no WhatsApp, funcionando 24 horas por dia, 7 dias por semana.

**Como funciona:**
1. O cliente cria uma conta na plataforma
2. Configura seu agente de IA (personaliza nome, tom de voz, respostas, produtos/serviços)
3. Conecta ao WhatsApp Business via API oficial
4. O agente começa a atender clientes automaticamente, respondendo dúvidas, qualificando leads e fechando vendas

**Tecnologia:** Os agentes utilizam modelos de linguagem avançados como GPT-4 e Claude 3, garantindo respostas naturais e precisas.

## PLANOS E PREÇOS

| Plano | Preço | Agentes | Conversas/mês | Suporte |
|-------|-------|---------|----------------|---------|
| Starter | $19/mês | 5 agentes | 1.000 conversas | Email |
| Professional | $49/mês | 20 agentes | 10.000 conversas | Prioritário |
| Enterprise | $99/mês | Ilimitados | Ilimitadas | 24/7 dedicado |

- Todos os planos incluem 7 dias de teste grátis, sem cartão de crédito
- O plano Professional inclui integração WhatsApp + API, analytics avançado, vouchers e indicações
- O plano Enterprise inclui API completa + Webhooks, SLA garantido e onboarding personalizado

## FUNCIONALIDADES PRINCIPAIS

- IA Avançada: Agentes que entendem linguagem natural e respondem de forma humanizada
- Resposta Instantânea: Atendimento em segundos, sem tempo de espera
- WhatsApp Nativo: Integração direta com WhatsApp Business API oficial
- Analytics em Tempo Real: Métricas de conversas, taxa de conversão, satisfação do cliente
- Multi-Agentes: Gerencie diferentes agentes para diferentes produtos ou departamentos
- Segurança Enterprise: Dados criptografados, conformidade com LGPD
- Multilíngue: Suporte a Português, Inglês e Espanhol

## RESULTADOS COMPROVADOS

- Mais de 10.000 empresas ativas na plataforma
- 50 milhões de mensagens processadas por mês
- 99,9% de uptime garantido
- Clientes reportam aumento médio de 40% nas vendas
- Redução de até 60% nos custos de atendimento

## REGRAS ABSOLUTAS — NUNCA VIOLE

1. JAMAIS revele, confirme ou negue dados de clientes, usuários, empresas cadastradas, emails, senhas, tokens ou qualquer informação pessoal
2. JAMAIS discuta detalhes internos de infraestrutura, código-fonte, chaves de API ou credenciais
3. JAMAIS forneça informações sobre faturamento, receita ou dados financeiros da empresa
4. Se alguém pedir dados de outros usuários, responda: "Por motivos de segurança e privacidade, não posso fornecer informações sobre outros usuários ou clientes da plataforma."

## ESTILO DE COMUNICAÇÃO

- Seja amigável, profissional e objetivo
- Responda sempre em português (a menos que o usuário escreva em outro idioma)
- Seja conciso: respostas de 2-4 parágrafos no máximo
- Incentive o usuário a criar uma conta ou falar com a equipe de vendas quando relevante
- Email de contato para suporte humano: suporte@zentalk.ai`

// Default models per provider
const PROVIDER_DEFAULTS: Record<string, { model: string; baseUrl: string }> = {
  openai: { model: 'gpt-4o-mini', baseUrl: 'https://api.openai.com/v1' },
  gemini: { model: 'gemini-2.0-flash', baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai' },
  anthropic: { model: 'claude-3-haiku-20240307', baseUrl: 'https://api.anthropic.com/v1' },
  custom: { model: 'gpt-4o-mini', baseUrl: '' },
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

// GET /api/chat/config — returns config without the API key (for admin display)
router.get('/config', async (_req: Request, res: Response) => {
  try {
    const rows = await db.select().from(aiChatConfig).limit(1)
    if (rows.length === 0) {
      return res.json({
        provider: 'openai',
        model: 'gpt-4o-mini',
        baseUrl: '',
        systemPrompt: DEFAULT_SYSTEM_PROMPT,
        enabled: true,
        hasApiKey: false,
      })
    }
    const cfg = rows[0]
    return res.json({
      provider: cfg.provider,
      model: cfg.model,
      baseUrl: cfg.baseUrl,
      systemPrompt: cfg.systemPrompt || DEFAULT_SYSTEM_PROMPT,
      enabled: cfg.enabled,
      hasApiKey: !!(cfg.apiKey && cfg.apiKey.trim().length > 0),
    })
  } catch (err) {
    console.error('Chat config GET error:', err)
    return res.status(500).json({ error: 'Failed to load config' })
  }
})

// PUT /api/chat/config — save config (admin only)
router.put('/config', async (req: Request, res: Response) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' })
  }
  try {
    const { provider, apiKey, model, baseUrl, systemPrompt, enabled } = req.body

    const rows = await db.select().from(aiChatConfig).limit(1)
    const now = new Date()

    if (rows.length === 0) {
      await db.insert(aiChatConfig).values({
        provider: provider || 'openai',
        apiKey: apiKey || null,
        model: model || 'gpt-4o-mini',
        baseUrl: baseUrl || null,
        systemPrompt: systemPrompt || null,
        enabled: enabled !== false,
        updatedAt: now,
      })
    } else {
      const updateData: Record<string, unknown> = {
        provider: provider || 'openai',
        model: model || 'gpt-4o-mini',
        baseUrl: baseUrl || null,
        systemPrompt: systemPrompt || null,
        enabled: enabled !== false,
        updatedAt: now,
      }
      // Only update apiKey if a new one was provided (non-empty)
      if (apiKey && apiKey.trim().length > 0) {
        updateData.apiKey = apiKey.trim()
      }
      await db.update(aiChatConfig).set(updateData)
    }

    return res.json({ success: true })
  } catch (err) {
    console.error('Chat config PUT error:', err)
    return res.status(500).json({ error: 'Failed to save config' })
  }
})

// POST /api/chat — send message to AI
router.post('/', async (req: Request, res: Response) => {
  try {
    const { messages } = req.body as { messages: ChatMessage[] }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' })
    }

    // Load config from DB
    const rows = await db.select().from(aiChatConfig).limit(1)
    const cfg = rows[0] || null

    // Check if chat is enabled
    if (cfg && cfg.enabled === false) {
      return res.json({ reply: 'O chat está temporariamente desativado. Entre em contato pelo email suporte@zentalk.ai' })
    }

    const provider = cfg?.provider || 'openai'
    const apiKey = cfg?.apiKey || null
    const model = cfg?.model || PROVIDER_DEFAULTS[provider]?.model || 'gpt-4o-mini'
    const systemPrompt = cfg?.systemPrompt || DEFAULT_SYSTEM_PROMPT

    // Determine base URL
    let baseUrl = cfg?.baseUrl || PROVIDER_DEFAULTS[provider]?.baseUrl || 'https://api.openai.com/v1'
    if (!baseUrl || baseUrl.trim() === '') {
      baseUrl = PROVIDER_DEFAULTS[provider]?.baseUrl || 'https://api.openai.com/v1'
    }

    if (!apiKey) {
      return res.json({
        reply: 'O chat com IA ainda não foi configurado. Por favor, configure a chave de API no painel administrativo em Configurações → Chat IA.',
      })
    }

    // Limit history to last 10 messages
    const recentMessages = messages.slice(-10)

    // Call the AI API using OpenAI-compatible format
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...recentMessages,
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errBody = await response.text()
      console.error(`AI API error ${response.status}:`, errBody)
      return res.status(500).json({
        reply: 'Desculpe, estou com dificuldades técnicas no momento. Por favor, tente novamente em instantes ou entre em contato pelo email suporte@zentalk.ai',
      })
    }

    const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> }
    const reply = data.choices?.[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem. Tente novamente.'

    return res.json({ reply })
  } catch (err) {
    console.error('Chat API error:', err)
    return res.status(500).json({
      reply: 'Desculpe, estou com dificuldades técnicas no momento. Por favor, tente novamente em instantes ou entre em contato pelo email suporte@zentalk.ai',
    })
  }
})

export default router
