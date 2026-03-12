import { useState, useEffect } from 'react'
import ClientLayout from '../../components/ClientLayout'
import { MessageSquare, TrendingUp, Zap, Bot, ArrowUpRight, Clock, CheckCircle } from 'lucide-react'
import { clientApi } from '../../lib/api'
import { useAuthStore } from '../../store/auth'

export default function ClientDashboard() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics'>('dashboard')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        await clientApi.getDashboard()
      } catch {
        // Use default values
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  const stats = [
    {
      label: 'Agentes Ativos',
      value: '3',
      icon: Bot,
      color: 'bg-blue-500',
      trend: '+1',
      trendUp: true,
    },
    {
      label: 'Conversas Hoje',
      value: '1.234',
      icon: MessageSquare,
      color: 'bg-green-500',
      trend: '+18%',
      trendUp: true,
    },
    {
      label: 'Taxa de Conversão',
      value: '23.5%',
      icon: TrendingUp,
      color: 'bg-purple-500',
      trend: '+2.1%',
      trendUp: true,
    },
    {
      label: 'Leads Qualificados',
      value: '89',
      icon: Zap,
      color: 'bg-orange-500',
      trend: '+5',
      trendUp: true,
    },
  ]

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Carregando...</p>
          </div>
        </div>
      </ClientLayout>
    )
  }

  return (
    <ClientLayout>
      <div className="p-6 bg-gray-50 min-h-full">
        {/* Welcome */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Olá, {user?.name?.split(' ')[0] || 'Usuário'}! 👋</h1>
          <p className="text-gray-500 mt-1">Aqui está o resumo das suas atividades.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div key={idx} className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-3">
                  <div className={`${stat.color} p-2.5 rounded-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`flex items-center gap-0.5 text-xs font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-500'}`}>
                    <ArrowUpRight size={14} />
                    {stat.trend}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-gray-500 text-sm mt-0.5">{stat.label}</p>
              </div>
            )
          })}
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-1 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-2 px-4 text-sm font-medium transition ${
                activeTab === 'dashboard'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2 px-4 text-sm font-medium transition ${
                activeTab === 'analytics'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Analytics
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Atividade Recente</h2>
              <div className="space-y-4">
                {[
                  { title: 'Nova conversa iniciada', desc: 'Cliente: Maria Santos', time: '2 horas atrás', icon: MessageSquare, color: 'text-blue-500' },
                  { title: 'Agente respondeu automaticamente', desc: 'Tempo de resposta: 3s', time: '1 hora atrás', icon: Bot, color: 'text-green-500' },
                  { title: 'Lead qualificado', desc: 'Interesse em plano Professional', time: '30 min atrás', icon: CheckCircle, color: 'text-purple-500' },
                  { title: 'Conversa encerrada', desc: 'Satisfação: ⭐⭐⭐⭐⭐', time: '15 min atrás', icon: Clock, color: 'text-orange-500' },
                ].map((item, i) => {
                  const Icon = item.icon
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <Icon size={18} className={`${item.color} flex-shrink-0 mt-0.5`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0">{item.time}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Métricas de Performance</h2>
              <div className="space-y-5">
                {[
                  { label: 'Tempo de Resposta', value: '45s', percent: 60, color: 'bg-blue-500' },
                  { label: 'Satisfação do Cliente', value: '92%', percent: 92, color: 'bg-green-500' },
                  { label: 'Taxa de Resolução', value: '87%', percent: 87, color: 'bg-purple-500' },
                  { label: 'Conversas Resolvidas', value: '78%', percent: 78, color: 'bg-orange-500' },
                ].map((metric, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                      <span className="text-sm font-bold text-gray-900">{metric.value}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={`${metric.color} h-2 rounded-full`}
                        style={{ width: `${metric.percent}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Analytics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Total de Mensagens', value: '12.456', color: 'bg-blue-50 text-blue-700' },
                { label: 'Conversas Únicas', value: '3.891', color: 'bg-green-50 text-green-700' },
                { label: 'Média por Dia', value: '415', color: 'bg-purple-50 text-purple-700' },
              ].map((item, i) => (
                <div key={i} className={`${item.color} rounded-lg p-4`}>
                  <p className="text-2xl font-bold">{item.value}</p>
                  <p className="text-sm mt-1">{item.label}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-sm">Gráficos detalhados disponíveis em breve.</p>
          </div>
        )}
      </div>
    </ClientLayout>
  )
}
