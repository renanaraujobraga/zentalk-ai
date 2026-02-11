import { useState } from 'react'
import ClientLayout from '../../components/ClientLayout'
import { Plus, Edit, MoreVertical, Power } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'

interface Agent {
  id: number
  name: string
  type: string
  status: 'online' | 'offline'
  conversations: number
  lastActive: string
}

export default function ClientAgents() {
  const { t } = useTranslation()
  const [agents] = useState<Agent[]>([
    {
      id: 1,
      name: 'Sales Agent',
      type: 'GPT-4',
      status: 'online',
      conversations: 234,
      lastActive: 'Now',
    },
    {
      id: 2,
      name: 'Support Agent',
      type: 'Claude 3',
      status: 'online',
      conversations: 567,
      lastActive: 'Now',
    },
    {
      id: 3,
      name: 'Lead Qualifier',
      type: 'GPT-4',
      status: 'offline',
      conversations: 123,
      lastActive: '2 hours ago',
    },
  ])

  return (
    <ClientLayout currentPage="agents">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('agents.title')}</h1>
            <p className="text-gray-600 mt-2">{t('agents.addAgent')}</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-5 h-5" />
            {t('actions.add')}
          </button>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div key={agent.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{agent.name}</h3>
                  <p className="text-sm text-gray-600">{agent.type}</p>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('dashboard.activeConversations')}</span>
                  <span className="font-bold text-gray-900">{agent.conversations}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        agent.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    ></div>
                    <span className="text-sm font-medium text-gray-900">
                      {agent.status === 'online' ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Edit className="w-4 h-4" />
                  {t('actions.edit')}
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Power className="w-4 h-4" />
                  {agent.status === 'online' ? 'Desativar' : 'Ativar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ClientLayout>
  )
}
