import { Server as SocketIOServer, Socket } from 'socket.io'
import { Server as HTTPServer } from 'http'

/**
 * WebSocket Service - Gerencia conexões em tempo real
 */

interface UserConnection {
  userId: number
  socketId: string
  connectedAt: Date
}

interface NotificationPayload {
  type: 'message' | 'conversation' | 'agent_status' | 'analytics'
  title: string
  content: string
  data?: Record<string, unknown>
  timestamp: Date
}

class WebSocketService {
  private io: SocketIOServer | null = null
  private userConnections: Map<number, UserConnection[]> = new Map()
  private conversationSubscriptions: Map<number, Set<number>> = new Map()

  /**
   * Inicializar WebSocket Server
   */
  initialize(httpServer: HTTPServer): SocketIOServer {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
      transports: ['websocket', 'polling'],
    })

    this.setupEventHandlers()
    console.log('✅ WebSocket Server initialized')
    return this.io
  }

  /**
   * Configurar handlers de eventos
   */
  private setupEventHandlers(): void {
    if (!this.io) return

    this.io.on('connection', (socket: Socket) => {
      console.log(`[WebSocket] Cliente conectado: ${socket.id}`)

      // Autenticação
      socket.on('authenticate', (data: { userId: number; token: string }) => {
        this.handleAuthentication(socket, data)
      })

      // Inscrever em conversa
      socket.on('subscribe_conversation', (data: { conversationId: number }) => {
        this.handleSubscribeConversation(socket, data)
      })

      // Desinscrever de conversa
      socket.on('unsubscribe_conversation', (data: { conversationId: number }) => {
        this.handleUnsubscribeConversation(socket, data)
      })

      // Desconexão
      socket.on('disconnect', () => {
        this.handleDisconnect(socket)
      })

      // Heartbeat
      socket.on('ping', () => {
        socket.emit('pong')
      })
    })
  }

  /**
   * Autenticar usuário
   */
  private handleAuthentication(socket: Socket, data: { userId: number; token: string }): void {
    const { userId } = data

    // Adicionar conexão do usuário
    if (!this.userConnections.has(userId)) {
      this.userConnections.set(userId, [])
    }

    const connections = this.userConnections.get(userId)!
    connections.push({
      userId,
      socketId: socket.id,
      connectedAt: new Date(),
    })

    // Associar userId ao socket
    socket.data.userId = userId

    console.log(`[WebSocket] Usuário ${userId} autenticado (${socket.id})`)
    socket.emit('authenticated', { success: true })
  }

  /**
   * Inscrever em conversa
   */
  private handleSubscribeConversation(
    socket: Socket,
    data: { conversationId: number }
  ): void {
    const { conversationId } = data
    const userId = socket.data.userId

    if (!userId) {
      socket.emit('error', { message: 'Not authenticated' })
      return
    }

    // Adicionar inscrição
    if (!this.conversationSubscriptions.has(conversationId)) {
      this.conversationSubscriptions.set(conversationId, new Set())
    }

    this.conversationSubscriptions.get(conversationId)!.add(userId)
    socket.join(`conversation:${conversationId}`)

    console.log(`[WebSocket] Usuário ${userId} inscrito em conversa ${conversationId}`)
    socket.emit('subscribed', { conversationId })
  }

  /**
   * Desinscrever de conversa
   */
  private handleUnsubscribeConversation(
    socket: Socket,
    data: { conversationId: number }
  ): void {
    const { conversationId } = data
    const userId = socket.data.userId

    if (!userId) return

    // Remover inscrição
    this.conversationSubscriptions.get(conversationId)?.delete(userId)
    socket.leave(`conversation:${conversationId}`)

    console.log(`[WebSocket] Usuário ${userId} desinscrito de conversa ${conversationId}`)
  }

  /**
   * Desconectar usuário
   */
  private handleDisconnect(socket: Socket): void {
    const userId = socket.data.userId

    if (userId) {
      const connections = this.userConnections.get(userId)
      if (connections) {
        const index = connections.findIndex((c) => c.socketId === socket.id)
        if (index > -1) {
          connections.splice(index, 1)
        }

        if (connections.length === 0) {
          this.userConnections.delete(userId)
        }
      }

      console.log(`[WebSocket] Usuário ${userId} desconectado (${socket.id})`)
    }
  }

  /**
   * Enviar notificação para usuário específico
   */
  notifyUser(userId: number, notification: NotificationPayload): void {
    if (!this.io) return

    const connections = this.userConnections.get(userId)
    if (!connections) return

    for (const connection of connections) {
      this.io.to(connection.socketId).emit('notification', notification)
    }

    console.log(`[WebSocket] Notificação enviada para usuário ${userId}`)
  }

  /**
   * Enviar notificação para conversa
   */
  notifyConversation(conversationId: number, notification: NotificationPayload): void {
    if (!this.io) return

    this.io.to(`conversation:${conversationId}`).emit('conversation_update', notification)

    console.log(`[WebSocket] Notificação enviada para conversa ${conversationId}`)
  }

  /**
   * Enviar notificação para múltiplos usuários
   */
  notifyUsers(userIds: number[], notification: NotificationPayload): void {
    for (const userId of userIds) {
      this.notifyUser(userId, notification)
    }
  }

  /**
   * Enviar notificação para todos os usuários (broadcast)
   */
  broadcastNotification(notification: NotificationPayload): void {
    if (!this.io) return

    this.io.emit('broadcast', notification)
    console.log('[WebSocket] Notificação broadcast enviada')
  }

  /**
   * Enviar atualização de status de agente
   */
  notifyAgentStatusChange(agentId: number, status: 'online' | 'offline' | 'busy'): void {
    if (!this.io) return

    this.io.emit('agent_status_change', {
      agentId,
      status,
      timestamp: new Date(),
    })

    console.log(`[WebSocket] Status do agente ${agentId} alterado para ${status}`)
  }

  /**
   * Enviar nova mensagem em tempo real
   */
  notifyNewMessage(
    conversationId: number,
    message: {
      id: number
      sender: string
      content: string
      timestamp: Date
    }
  ): void {
    if (!this.io) return

    this.io.to(`conversation:${conversationId}`).emit('new_message', {
      conversationId,
      message,
    })

    console.log(`[WebSocket] Nova mensagem em conversa ${conversationId}`)
  }

  /**
   * Enviar atualização de analytics
   */
  notifyAnalyticsUpdate(
    userId: number,
    analytics: {
      totalMessages: number
      responseTime: number
      satisfactionRate: number
      timestamp: Date
    }
  ): void {
    this.notifyUser(userId, {
      type: 'analytics',
      title: 'Analytics Atualizado',
      content: 'Seus dados de performance foram atualizados',
      data: analytics,
      timestamp: new Date(),
    })
  }

  /**
   * Obter número de usuários conectados
   */
  getConnectedUsersCount(): number {
    return this.userConnections.size
  }

  /**
   * Obter informações de conexão
   */
  getConnectionInfo(): {
    totalUsers: number
    totalConnections: number
    subscriptions: number
  } {
    let totalConnections = 0
    for (const connections of this.userConnections.values()) {
      totalConnections += connections.length
    }

    return {
      totalUsers: this.userConnections.size,
      totalConnections,
      subscriptions: this.conversationSubscriptions.size,
    }
  }
}

// Exportar instância singleton
export const websocketService = new WebSocketService()
