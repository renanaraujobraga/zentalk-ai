/**
 * Sistema de Internacionalização (i18n)
 * Suporta: Português (PT), English (EN), Español (ES)
 */

export type Language = 'pt' | 'en' | 'es'

const translations = {
  pt: {
    // Navegação
    nav: {
      dashboard: 'Dashboard',
      clients: 'Clientes',
      agents: 'Agentes',
      vouchers: 'Vouchers',
      whatsapp: 'WhatsApp',
      analytics: 'Analytics',
      billing: 'Faturamento',
      monitoring: 'Monitoramento',
      security: 'Segurança',
      profile: 'Meu Perfil',
      logout: 'Sair',
    },

    // Ações
    actions: {
      add: 'Adicionar',
      edit: 'Editar',
      delete: 'Deletar',
      save: 'Salvar',
      cancel: 'Cancelar',
      search: 'Buscar',
      filter: 'Filtrar',
      export: 'Exportar',
      import: 'Importar',
      view: 'Visualizar',
      close: 'Fechar',
      confirm: 'Confirmar',
      back: 'Voltar',
    },

    // Mensagens
    messages: {
      success: 'Operação realizada com sucesso',
      error: 'Erro ao processar solicitação',
      loading: 'Carregando...',
      noData: 'Nenhum dado disponível',
      confirmDelete: 'Tem certeza que deseja deletar?',
      deleteSuccess: 'Item deletado com sucesso',
      updateSuccess: 'Item atualizado com sucesso',
      createSuccess: 'Item criado com sucesso',
    },

    // Formulários
    forms: {
      name: 'Nome',
      email: 'Email',
      phone: 'Telefone',
      status: 'Status',
      plan: 'Plano',
      description: 'Descrição',
      createdAt: 'Criado em',
      updatedAt: 'Atualizado em',
      active: 'Ativo',
      inactive: 'Inativo',
      suspended: 'Suspenso',
    },

    // Dashboard
    dashboard: {
      title: 'Dashboard',
      totalClients: 'Total de Clientes',
      totalAgents: 'Total de Agentes',
      totalMessages: 'Total de Mensagens',
      activeConversations: 'Conversas Ativas',
      recentActivity: 'Atividade Recente',
      performanceMetrics: 'Métricas de Performance',
      responseTime: 'Tempo de Resposta',
      satisfaction: 'Satisfação',
    },

    // Analytics
    analytics: {
      title: 'Analytics',
      messagesTrend: 'Tendência de Mensagens',
      agentPerformance: 'Performance dos Agentes',
      conversationStatus: 'Status das Conversas',
      topAgents: 'Top Agentes',
      avgResponseTime: 'Tempo Médio de Resposta',
      avgSatisfaction: 'Satisfação Média',
    },

    // WhatsApp
    whatsapp: {
      title: 'WhatsApp',
      accounts: 'Contas',
      conversations: 'Conversas',
      messages: 'Mensagens',
      addAccount: 'Adicionar Conta',
      phoneNumber: 'Número de Telefone',
      businessAccountId: 'Business Account ID',
      accessToken: 'Access Token',
      webhookToken: 'Webhook Token',
      generateToken: 'Gerar Token',
    },

    // Clientes
    clients: {
      title: 'Clientes',
      addClient: 'Adicionar Cliente',
      companyName: 'Nome da Empresa',
      contactEmail: 'Email de Contato',
      contactPhone: 'Telefone de Contato',
      plan: 'Plano',
      status: 'Status',
      createdAt: 'Data de Criação',
    },

    // Agentes
    agents: {
      title: 'Agentes',
      addAgent: 'Adicionar Agente',
      agentName: 'Nome do Agente',
      agentType: 'Tipo de Agente',
      model: 'Modelo',
      systemPrompt: 'System Prompt',
      temperature: 'Temperatura',
      maxTokens: 'Max Tokens',
    },

    // Vouchers
    vouchers: {
      title: 'Vouchers',
      addVoucher: 'Adicionar Voucher',
      code: 'Código',
      discount: 'Desconto',
      expiryDate: 'Data de Expiração',
      usageLimit: 'Limite de Uso',
      timesUsed: 'Vezes Usado',
    },
  },

  en: {
    // Navigation
    nav: {
      dashboard: 'Dashboard',
      clients: 'Clients',
      agents: 'Agents',
      vouchers: 'Vouchers',
      whatsapp: 'WhatsApp',
      analytics: 'Analytics',
      billing: 'Billing',
      monitoring: 'Monitoring',
      security: 'Security',
      profile: 'My Profile',
      logout: 'Logout',
    },

    // Actions
    actions: {
      add: 'Add',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      search: 'Search',
      filter: 'Filter',
      export: 'Export',
      import: 'Import',
      view: 'View',
      close: 'Close',
      confirm: 'Confirm',
      back: 'Back',
    },

    // Messages
    messages: {
      success: 'Operation completed successfully',
      error: 'Error processing request',
      loading: 'Loading...',
      noData: 'No data available',
      confirmDelete: 'Are you sure you want to delete?',
      deleteSuccess: 'Item deleted successfully',
      updateSuccess: 'Item updated successfully',
      createSuccess: 'Item created successfully',
    },

    // Forms
    forms: {
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      status: 'Status',
      plan: 'Plan',
      description: 'Description',
      createdAt: 'Created At',
      updatedAt: 'Updated At',
      active: 'Active',
      inactive: 'Inactive',
      suspended: 'Suspended',
    },

    // Dashboard
    dashboard: {
      title: 'Dashboard',
      totalClients: 'Total Clients',
      totalAgents: 'Total Agents',
      totalMessages: 'Total Messages',
      activeConversations: 'Active Conversations',
      recentActivity: 'Recent Activity',
      performanceMetrics: 'Performance Metrics',
      responseTime: 'Response Time',
      satisfaction: 'Satisfaction',
    },

    // Analytics
    analytics: {
      title: 'Analytics',
      messagesTrend: 'Messages Trend',
      agentPerformance: 'Agent Performance',
      conversationStatus: 'Conversation Status',
      topAgents: 'Top Agents',
      avgResponseTime: 'Average Response Time',
      avgSatisfaction: 'Average Satisfaction',
    },

    // WhatsApp
    whatsapp: {
      title: 'WhatsApp',
      accounts: 'Accounts',
      conversations: 'Conversations',
      messages: 'Messages',
      addAccount: 'Add Account',
      phoneNumber: 'Phone Number',
      businessAccountId: 'Business Account ID',
      accessToken: 'Access Token',
      webhookToken: 'Webhook Token',
      generateToken: 'Generate Token',
    },

    // Clients
    clients: {
      title: 'Clients',
      addClient: 'Add Client',
      companyName: 'Company Name',
      contactEmail: 'Contact Email',
      contactPhone: 'Contact Phone',
      plan: 'Plan',
      status: 'Status',
      createdAt: 'Creation Date',
    },

    // Agents
    agents: {
      title: 'Agents',
      addAgent: 'Add Agent',
      agentName: 'Agent Name',
      agentType: 'Agent Type',
      model: 'Model',
      systemPrompt: 'System Prompt',
      temperature: 'Temperature',
      maxTokens: 'Max Tokens',
    },

    // Vouchers
    vouchers: {
      title: 'Vouchers',
      addVoucher: 'Add Voucher',
      code: 'Code',
      discount: 'Discount',
      expiryDate: 'Expiry Date',
      usageLimit: 'Usage Limit',
      timesUsed: 'Times Used',
    },
  },

  es: {
    // Navegación
    nav: {
      dashboard: 'Panel de Control',
      clients: 'Clientes',
      agents: 'Agentes',
      vouchers: 'Cupones',
      whatsapp: 'WhatsApp',
      analytics: 'Análisis',
      billing: 'Facturación',
      monitoring: 'Monitoreo',
      security: 'Seguridad',
      profile: 'Mi Perfil',
      logout: 'Cerrar Sesión',
    },

    // Acciones
    actions: {
      add: 'Agregar',
      edit: 'Editar',
      delete: 'Eliminar',
      save: 'Guardar',
      cancel: 'Cancelar',
      search: 'Buscar',
      filter: 'Filtrar',
      export: 'Exportar',
      import: 'Importar',
      view: 'Ver',
      close: 'Cerrar',
      confirm: 'Confirmar',
      back: 'Atrás',
    },

    // Mensajes
    messages: {
      success: 'Operación completada exitosamente',
      error: 'Error al procesar la solicitud',
      loading: 'Cargando...',
      noData: 'Sin datos disponibles',
      confirmDelete: '¿Estás seguro de que deseas eliminar?',
      deleteSuccess: 'Elemento eliminado exitosamente',
      updateSuccess: 'Elemento actualizado exitosamente',
      createSuccess: 'Elemento creado exitosamente',
    },

    // Formularios
    forms: {
      name: 'Nombre',
      email: 'Correo Electrónico',
      phone: 'Teléfono',
      status: 'Estado',
      plan: 'Plan',
      description: 'Descripción',
      createdAt: 'Creado en',
      updatedAt: 'Actualizado en',
      active: 'Activo',
      inactive: 'Inactivo',
      suspended: 'Suspendido',
    },

    // Panel de Control
    dashboard: {
      title: 'Panel de Control',
      totalClients: 'Total de Clientes',
      totalAgents: 'Total de Agentes',
      totalMessages: 'Total de Mensajes',
      activeConversations: 'Conversaciones Activas',
      recentActivity: 'Actividad Reciente',
      performanceMetrics: 'Métricas de Rendimiento',
      responseTime: 'Tiempo de Respuesta',
      satisfaction: 'Satisfacción',
    },

    // Análisis
    analytics: {
      title: 'Análisis',
      messagesTrend: 'Tendencia de Mensajes',
      agentPerformance: 'Rendimiento del Agente',
      conversationStatus: 'Estado de la Conversación',
      topAgents: 'Mejores Agentes',
      avgResponseTime: 'Tiempo Promedio de Respuesta',
      avgSatisfaction: 'Satisfacción Promedio',
    },

    // WhatsApp
    whatsapp: {
      title: 'WhatsApp',
      accounts: 'Cuentas',
      conversations: 'Conversaciones',
      messages: 'Mensajes',
      addAccount: 'Agregar Cuenta',
      phoneNumber: 'Número de Teléfono',
      businessAccountId: 'ID de Cuenta Comercial',
      accessToken: 'Token de Acceso',
      webhookToken: 'Token de Webhook',
      generateToken: 'Generar Token',
    },

    // Clientes
    clients: {
      title: 'Clientes',
      addClient: 'Agregar Cliente',
      companyName: 'Nombre de la Empresa',
      contactEmail: 'Correo de Contacto',
      contactPhone: 'Teléfono de Contacto',
      plan: 'Plan',
      status: 'Estado',
      createdAt: 'Fecha de Creación',
    },

    // Agentes
    agents: {
      title: 'Agentes',
      addAgent: 'Agregar Agente',
      agentName: 'Nombre del Agente',
      agentType: 'Tipo de Agente',
      model: 'Modelo',
      systemPrompt: 'Indicación del Sistema',
      temperature: 'Temperatura',
      maxTokens: 'Máximo de Tokens',
    },

    // Cupones
    vouchers: {
      title: 'Cupones',
      addVoucher: 'Agregar Cupón',
      code: 'Código',
      discount: 'Descuento',
      expiryDate: 'Fecha de Vencimiento',
      usageLimit: 'Límite de Uso',
      timesUsed: 'Veces Utilizado',
    },
  },
}

class I18n {
  private currentLanguage: Language = 'pt'

  setLanguage(lang: Language): void {
    this.currentLanguage = lang
    localStorage.setItem('language', lang)
  }

  getLanguage(): Language {
    const saved = localStorage.getItem('language') as Language
    if (saved && ['pt', 'en', 'es'].includes(saved)) {
      this.currentLanguage = saved
    }
    return this.currentLanguage
  }

  t(key: string, defaultValue?: string): string {
    const keys = key.split('.')
    let value: unknown = translations[this.currentLanguage]

    for (const k of keys) {
      if (typeof value === 'object' && value !== null && k in value) {
        value = (value as Record<string, unknown>)[k]
      } else {
        return defaultValue || key
      }
    }

    return typeof value === 'string' ? value : key
  }

  getAvailableLanguages(): Array<{ code: Language; name: string }> {
    return [
      { code: 'pt', name: 'Português' },
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Español' },
    ]
  }
}

export const i18n = new I18n()
