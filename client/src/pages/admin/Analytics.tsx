import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card } from '@/components/ui/card'
import { api } from '@/lib/api'

interface AnalyticsData {
  messagesTrend: Array<{ date: string; count: number }>
  agentPerformance: Array<{ agent: string; responseTime: number; satisfaction: number }>
  conversationStatus: Array<{ status: string; count: number }>
  topAgents: Array<{ name: string; messages: number }>
  metrics: {
    totalMessages: number
    avgResponseTime: number
    avgSatisfaction: number
    activeConversations: number
  }
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/analytics')
      setData(response.data)
      setError(null)
    } catch (err) {
      setError('Erro ao carregar analytics')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Carregando analytics...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error || 'Erro ao carregar dados'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Analytics</h1>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <p className="text-gray-600 text-sm">Total de Mensagens</p>
          <p className="text-3xl font-bold mt-2">{data.metrics.totalMessages}</p>
        </Card>
        <Card className="p-6">
          <p className="text-gray-600 text-sm">Tempo Médio de Resposta</p>
          <p className="text-3xl font-bold mt-2">{Math.round(data.metrics.avgResponseTime)}s</p>
        </Card>
        <Card className="p-6">
          <p className="text-gray-600 text-sm">Satisfação Média</p>
          <p className="text-3xl font-bold mt-2">{Math.round(data.metrics.avgSatisfaction)}%</p>
        </Card>
        <Card className="p-6">
          <p className="text-gray-600 text-sm">Conversas Ativas</p>
          <p className="text-3xl font-bold mt-2">{data.metrics.activeConversations}</p>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Tendência de Mensagens */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Tendência de Mensagens</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.messagesTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" name="Mensagens" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Status de Conversas */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Status das Conversas</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.conversationStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status, count }) => `${status}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {data.conversationStatus.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Performance dos Agentes */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Performance dos Agentes</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.agentPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="agent" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="responseTime" fill="#ef4444" name="Tempo de Resposta (s)" />
              <Bar dataKey="satisfaction" fill="#10b981" name="Satisfação (%)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Agentes */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Top Agentes</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.topAgents} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="messages" fill="#3b82f6" name="Mensagens" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Tabela de Detalhes */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Detalhes de Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Agente</th>
                <th className="text-left py-3 px-4">Mensagens</th>
                <th className="text-left py-3 px-4">Tempo de Resposta</th>
                <th className="text-left py-3 px-4">Satisfação</th>
              </tr>
            </thead>
            <tbody>
              {data.agentPerformance.map((agent, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{agent.agent}</td>
                  <td className="py-3 px-4">-</td>
                  <td className="py-3 px-4">{Math.round(agent.responseTime)}s</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${agent.satisfaction}%` }}
                        ></div>
                      </div>
                      <span className="ml-2">{Math.round(agent.satisfaction)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
