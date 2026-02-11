const API_BASE_URL = '/api'

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: number
    email: string
    name: string
    role: string
  }
}

export interface User {
  userId: number
  email: string
  role: string
}

// Helper function to make API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token')
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }
  
  return response.json()
}

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  register: async (
    email: string,
    password: string,
    name: string
  ): Promise<LoginResponse> => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    })
  },

  me: async (): Promise<{ user: User }> => {
    return apiCall('/auth/me')
  },
}

// Admin API
export const adminApi = {
  getDashboard: async (): Promise<any> => {
    return apiCall('/admin/dashboard')
  },

  getUsers: async (): Promise<any> => {
    return apiCall('/admin/users')
  },

  getInfluencers: async (): Promise<any> => {
    return apiCall('/admin/influencers')
  },
}

// Client API
export const clientApi = {
  getDashboard: async (): Promise<any> => {
    return apiCall('/client/dashboard')
  },

  getProfile: async (): Promise<any> => {
    return apiCall('/client/profile')
  },
}

// Clients API
export const clientsApi = {
  getAll: async (): Promise<any> => {
    return apiCall('/clients')
  },

  getById: async (id: number): Promise<any> => {
    return apiCall(`/clients/${id}`)
  },

  create: async (data: any): Promise<any> => {
    return apiCall('/clients', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update: async (id: number, data: any): Promise<any> => {
    return apiCall(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  delete: async (id: number): Promise<any> => {
    return apiCall(`/clients/${id}`, {
      method: 'DELETE',
    })
  },
}

// Agents API
export const agentsApi = {
  getAll: async (): Promise<any> => {
    return apiCall('/agents')
  },

  getById: async (id: number): Promise<any> => {
    return apiCall(`/agents/${id}`)
  },

  create: async (data: any): Promise<any> => {
    return apiCall('/agents', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update: async (id: number, data: any): Promise<any> => {
    return apiCall(`/agents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  delete: async (id: number): Promise<any> => {
    return apiCall(`/agents/${id}`, {
      method: 'DELETE',
    })
  },
}

// Vouchers API
export const vouchersApi = {
  getAll: async (): Promise<any> => {
    return apiCall('/vouchers')
  },

  getById: async (id: number): Promise<any> => {
    return apiCall(`/vouchers/${id}`)
  },

  create: async (data: any): Promise<any> => {
    return apiCall('/vouchers', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update: async (id: number, data: any): Promise<any> => {
    return apiCall(`/vouchers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  delete: async (id: number): Promise<any> => {
    return apiCall(`/vouchers/${id}`, {
      method: 'DELETE',
    })
  },

  use: async (id: number): Promise<any> => {
    return apiCall(`/vouchers/${id}/use`, {
      method: 'POST',
    })
  },
}


// WhatsApp API
export const whatsappApi = {
  getAccounts: async (clientId: number): Promise<any> => {
    return apiCall(`/whatsapp/accounts?clientId=${clientId}`)
  },

  createAccount: async (clientId: number, data: any): Promise<any> => {
    return apiCall('/whatsapp/accounts', {
      method: 'POST',
      body: JSON.stringify({ clientId, ...data }),
    })
  },

  getConversations: async (accountId: number): Promise<any> => {
    return apiCall(`/whatsapp/conversations/${accountId}`)
  },

  getMessages: async (conversationId: number): Promise<any> => {
    return apiCall(`/whatsapp/messages/${conversationId}`)
  },

  sendMessage: async (conversationId: number, content: string): Promise<any> => {
    return apiCall(`/whatsapp/messages/${conversationId}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    })
  },
}
