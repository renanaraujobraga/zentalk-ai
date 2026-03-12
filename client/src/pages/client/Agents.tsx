import { useState } from 'react'
import ClientLayout from '../../components/ClientLayout'
import { Plus, Edit2, Power, Bot, MessageSquare, Clock, MoreVertical, Zap } from 'lucide-react'

interface Agent {
  id: number
  name: string
  type: string
  status: 'online' | 'offline'
  conversations: number
  lastActive: string
  responseTime: string
}

export default function ClientAgents() {
  const [agents, setAgents] = useState<Agent[]>([
    { id: 1, name: 'Agente de Vendas', type: 'GPT-4', status: 'online', conversations: 234, lastActive: 'Agora', responseTime: '3s' },
    { id: 2, name: 'Agente de Suporte', type: 'Claude 3', status: 'online', conversations: 567, lastActive: 'Agora', responseTime: '5s' },
    { id: 3, name: 'Qualificador de Leads', type: 'GPT-4', status: 'offline', conversations: 123, lastActive: 'Há 2 horas', responseTime: '-' },
  ])

  const toggleStatus = (id: number) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'online' ? 'offline' : 'online' } : a))
  }

  const onlineCount = agents.filter(a => a.status === 'online').length
  const totalConversations = agents.reduce((sum, a) => sum + a.conversations, 0)

  return (
    <ClientLayout currentPage="agents">
      <div className="p-6 bg-gray-50 min-h-full">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meus Agentes</h1>
            <p className="text-gray-500 mt-1">Gerencie e monitore seus agentes de IA</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium shadow-sm">
            <Plus className="w-4 h-4" />
            Novo Agente
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{agents.length}</p>
              <p className="text-sm text-gray-500">Total de Agentes</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{onlineCount}</p>
              <p className="text-sm text-gray-500">Agentes Online</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalConversations.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Conversas Totais</p>
            </div>
          </div>
        </div>

        {/* Agents List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Lista de Agentes</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {agents.map((agent) => (
              <div key={agent.id} className="px-6 py-4 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  {/* Left: icon + info */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${agent.status === 'online' ? 'bg-green-500' : 'bg-gray-300'}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{agent.name}</p>
                      <p className="text-xs text-gray-500">{agent.type}</p>
                    </div>
                  </div>

                  {/* Middle: stats */}
                  <div className="hidden md:flex items-center gap-8 text-sm">
                    <div className="text-center">
                      <p className="font-semibold text-gray-900">{agent.conversations}</p>
                      <p className="text-xs text-gray-400">Conversas</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 justify-center">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <p className="font-semibold text-gray-900">{agent.responseTime}</p>
                      </div>
                      <p className="text-xs text-gray-400">Resposta</p>
                    </div>
                    <div className="text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${agent.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${agent.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`} />
                        {agent.status === 'online' ? 'Online' : 'Offline'}
                      </span>
                      <p className="text-xs text-gray-400 mt-0.5">{agent.lastActive}</p>
                    </div>
                  </div>

                  {/* Right: actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-600">
                      <Edit2 className="w-3.5 h-3.5" />
                      Editar
                    </button>
                    <button
                      onClick={() => toggleStatus(agent.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition ${agent.status === 'online' ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-100'}`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      {agent.status === 'online' ? 'Desativar' : 'Ativar'}
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ClientLayout>
  )
}
