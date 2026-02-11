import { useEffect, useRef, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from '../_core/hooks/useAuth'

interface NotificationPayload {
  type: 'message' | 'conversation' | 'agent_status' | 'analytics'
  title: string
  content: string
  data?: Record<string, unknown>
  timestamp: string
}

interface UseWebSocketOptions {
  onNotification?: (notification: NotificationPayload) => void
  onNewMessage?: (data: { conversationId: number; message: unknown }) => void
  onAgentStatusChange?: (data: { agentId: number; status: string }) => void
  onConversationUpdate?: (data: NotificationPayload) => void
  autoConnect?: boolean
}

/**
 * Hook para gerenciar conexão WebSocket
 */
export function useWebSocket(options: UseWebSocketOptions = {}) {
  const { autoConnect = true, onNotification, onNewMessage, onAgentStatusChange, onConversationUpdate } = options
  const socketRef = useRef<Socket | null>(null)
  const { user } = useAuth()

  // Conectar ao WebSocket
  useEffect(() => {
    if (!autoConnect || !user) return

    const socket = io(window.location.origin, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    })

    socket.on('connect', () => {
      console.log('[WebSocket] Conectado ao servidor')

      // Autenticar
      socket.emit('authenticate', {
        userId: user.id,
        token: localStorage.getItem('token') || '',
      })
    })

    socket.on('authenticated', () => {
      console.log('[WebSocket] Autenticado com sucesso')
    })

    socket.on('notification', (notification: NotificationPayload) => {
      console.log('[WebSocket] Notificação recebida:', notification)
      onNotification?.(notification)
    })

    socket.on('new_message', (data: { conversationId: number; message: unknown }) => {
      console.log('[WebSocket] Nova mensagem:', data)
      onNewMessage?.(data)
    })

    socket.on('agent_status_change', (data: { agentId: number; status: string }) => {
      console.log('[WebSocket] Status do agente alterado:', data)
      onAgentStatusChange?.(data)
    })

    socket.on('conversation_update', (data: NotificationPayload) => {
      console.log('[WebSocket] Conversa atualizada:', data)
      onConversationUpdate?.(data)
    })

    socket.on('disconnect', () => {
      console.log('[WebSocket] Desconectado do servidor')
    })

    socket.on('error', (error: unknown) => {
      console.error('[WebSocket] Erro:', error)
    })

    socketRef.current = socket

    return () => {
      socket.disconnect()
    }
  }, [user, autoConnect, onNotification, onNewMessage, onAgentStatusChange, onConversationUpdate])

  // Inscrever em conversa
  const subscribeToConversation = useCallback((conversationId: number) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('subscribe_conversation', { conversationId })
    }
  }, [])

  // Desinscrever de conversa
  const unsubscribeFromConversation = useCallback((conversationId: number) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('unsubscribe_conversation', { conversationId })
    }
  }, [])

  // Enviar ping (para manter conexão viva)
  const ping = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('ping')
    }
  }, [])

  return {
    socket: socketRef.current,
    isConnected: socketRef.current?.connected ?? false,
    subscribeToConversation,
    unsubscribeFromConversation,
    ping,
  }
}
