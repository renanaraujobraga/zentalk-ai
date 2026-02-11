/**
 * LLM Service - Integração com serviço de IA para respostas automáticas
 */

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface LLMResponse {
  content: string
  tokens: number
}

/**
 * Gerar resposta automática usando LLM
 */
export async function generateAutoReply(
  userMessage: string,
  agentName: string,
  conversationHistory: Array<{ sender: string; content: string }> = []
): Promise<string> {
  try {
    // Construir histórico de conversa para contexto
    const messages: LLMMessage[] = [
      {
        role: 'system',
        content: `You are ${agentName}, a helpful customer service AI agent. 
        Respond in a friendly and professional manner. Keep responses concise and to the point.
        Always be helpful and try to solve customer issues.
        Respond in the same language as the customer message.`,
      },
    ]

    // Adicionar histórico de conversa
    for (const msg of conversationHistory.slice(-10)) {
      // Últimas 10 mensagens
      messages.push({
        role: msg.sender === 'agent' ? 'assistant' : 'user',
        content: msg.content,
      })
    }

    // Adicionar mensagem atual
    messages.push({
      role: 'user',
      content: userMessage,
    })

    // Chamar LLM (usando fetch para API genérica)
    const response = await callLLMAPI(messages)

    if (!response) {
      return getDefaultResponse(agentName)
    }

    return response
  } catch (error) {
    console.error('Error generating auto reply:', error)
    return getDefaultResponse(agentName)
  }
}

/**
 * Chamar API de LLM
 */
async function callLLMAPI(messages: LLMMessage[]): Promise<string | null> {
  try {
    // Verificar se há API configurada
    const apiUrl = process.env.LLM_API_URL || process.env.BUILT_IN_FORGE_API_URL
    const apiKey = process.env.LLM_API_KEY || process.env.BUILT_IN_FORGE_API_KEY

    if (!apiUrl || !apiKey) {
      console.warn('LLM API not configured, using default response')
      return null
    }

    // Tentar chamar API de LLM
    // Este é um exemplo genérico - ajuste conforme sua API específica
    const response = await fetch(`${apiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        model: 'gpt-4-turbo',
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      console.error('LLM API error:', response.status)
      return null
    }

    const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> }
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return null
    }

    return content
  } catch (error) {
    console.error('Error calling LLM API:', error)
    return null
  }
}

/**
 * Resposta padrão quando LLM não está disponível
 */
function getDefaultResponse(agentName: string): string {
  const responses = [
    `Hello! I'm ${agentName}. How can I help you today?`,
    `Thanks for reaching out! I'm ${agentName}. What can I do for you?`,
    `Hi there! I'm ${agentName}. How may I assist you?`,
    `Welcome! I'm ${agentName}. What's on your mind?`,
  ]

  return responses[Math.floor(Math.random() * responses.length)]
}

/**
 * Detectar intenção da mensagem
 */
export function detectIntent(message: string): string {
  const lowerMessage = message.toLowerCase()

  if (
    lowerMessage.includes('hello') ||
    lowerMessage.includes('hi') ||
    lowerMessage.includes('hey')
  ) {
    return 'greeting'
  }

  if (
    lowerMessage.includes('help') ||
    lowerMessage.includes('support') ||
    lowerMessage.includes('issue')
  ) {
    return 'support'
  }

  if (
    lowerMessage.includes('price') ||
    lowerMessage.includes('cost') ||
    lowerMessage.includes('how much')
  ) {
    return 'pricing'
  }

  if (
    lowerMessage.includes('thank') ||
    lowerMessage.includes('thanks') ||
    lowerMessage.includes('appreciate')
  ) {
    return 'gratitude'
  }

  if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
    return 'goodbye'
  }

  return 'general'
}

/**
 * Gerar resposta baseada em intenção
 */
export function generateIntentBasedResponse(
  intent: string,
  agentName: string
): string {
  const responses: Record<string, string[]> = {
    greeting: [
      `Hello! I'm ${agentName}. How can I help you?`,
      `Hi there! Welcome. I'm ${agentName}. What can I do for you?`,
    ],
    support: [
      `I'm here to help! Please describe your issue and I'll do my best to assist you.`,
      `I'd be happy to help! Can you tell me more about what you need?`,
    ],
    pricing: [
      `We have several pricing options available. Would you like to know more about our plans?`,
      `Let me help you find the right plan for your needs. What are you looking for?`,
    ],
    gratitude: [
      `You're welcome! Is there anything else I can help you with?`,
      `Happy to help! Feel free to reach out if you need anything else.`,
    ],
    goodbye: [
      `Thanks for chatting with me! Have a great day!`,
      `Goodbye! Feel free to reach out anytime you need help.`,
    ],
    general: [
      `That's interesting! Can you tell me more?`,
      `I understand. How can I assist you further?`,
    ],
  }

  const intentResponses = responses[intent] || responses.general
  return intentResponses[Math.floor(Math.random() * intentResponses.length)]
}
