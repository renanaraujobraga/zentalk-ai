import { useState, useEffect } from 'react'
import ClientLayout from '../../components/ClientLayout'
import { Users, MessageSquare, TrendingUp, Zap } from 'lucide-react'
import { clientApi } from '../../lib/api'
import { useTranslation } from '../../hooks/useTranslation'

export default function ClientDashboard() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics'>('dashboard')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true)
        await clientApi.getDashboard()
      } catch (err) {
        setError(err instanceof Error ? err.message : t('messages.error'))
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [t])

  const stats = [
    {
      label: t('dashboard.totalAgents'),
      value: '3',
      icon: Zap,
      color: 'bg-blue-500',
    },
    {
      label: t('dashboard.activeConversations'),
      value: '1,234',
      icon: MessageSquare,
      color: 'bg-green-500',
    },
    {
      label: 'Conversion Rate',
      value: '23.5%',
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
    {
      label: t('nav.profile'),
      value: '5',
      icon: Users,
      color: 'bg-orange-500',
    },
  ]

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>{t('messages.loading')}</p>
          </div>
        </div>
      </ClientLayout>
    )
  }

  if (error) {
    return (
      <ClientLayout>
        <div className="p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </ClientLayout>
    )
  }

  return (
    <ClientLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-8">{t('dashboard.title')}</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-4 border-b">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-2 px-4 font-medium ${
                activeTab === 'dashboard'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('dashboard.title')}
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2 px-4 font-medium ${
                activeTab === 'analytics'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('analytics.title')}
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">{t('dashboard.recentActivity')}</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <p className="font-medium">Nova conversa iniciada</p>
                  <p className="text-sm text-gray-600">Há 2 horas</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <p className="font-medium">Agente respondeu</p>
                  <p className="text-sm text-gray-600">Há 1 hora</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <p className="font-medium">Conversa encerrada</p>
                  <p className="text-sm text-gray-600">Há 30 minutos</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">{t('dashboard.performanceMetrics')}</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">{t('dashboard.responseTime')}</span>
                    <span className="text-sm font-bold">45s</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">{t('dashboard.satisfaction')}</span>
                    <span className="text-sm font-bold">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">{t('analytics.title')}</h2>
            <p className="text-gray-600">{t('messages.noData')}</p>
          </div>
        )}
      </div>
    </ClientLayout>
  )
}
