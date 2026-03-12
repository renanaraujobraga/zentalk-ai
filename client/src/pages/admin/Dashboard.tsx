import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { Users, TrendingUp, CreditCard, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { adminApi } from '../../lib/api'

interface DashboardStats {
  totalUsers: number
  totalRevenue: number
  activeInfluencers: number
  pendingVouchers: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalRevenue: 0,
    activeInfluencers: 0,
    pendingVouchers: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await adminApi.getDashboard()
        setStats(data.stats)
      } catch {
        // Use default values
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  const statsList = [
    {
      label: 'Total de Clientes',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'bg-blue-500',
      trend: '+12%',
      trendUp: true,
    },
    {
      label: 'Receita Mensal',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: CreditCard,
      color: 'bg-green-500',
      trend: '+8%',
      trendUp: true,
    },
    {
      label: 'Influenciadores Ativos',
      value: stats.activeInfluencers.toLocaleString(),
      icon: Zap,
      color: 'bg-purple-500',
      trend: '+3%',
      trendUp: true,
    },
    {
      label: 'Vouchers Pendentes',
      value: stats.pendingVouchers.toLocaleString(),
      icon: TrendingUp,
      color: 'bg-orange-500',
      trend: '-5%',
      trendUp: false,
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bem-vindo de volta!</h1>
          <p className="text-gray-500 mt-1">Aqui está o resumo do seu negócio.</p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsList.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <Icon className="text-white" size={22} />
                    </div>
                    <span className={`flex items-center gap-1 text-sm font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-500'}`}>
                      {stat.trendUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                      {stat.trend}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
                </div>
              )
            })}
          </div>
        )}

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h2>
            <div className="space-y-4">
              {[
                { title: 'Novo cliente cadastrado', desc: 'João Silva se registrou', time: '2 horas atrás', color: 'bg-blue-500' },
                { title: 'Agente implantado', desc: 'Agente de Vendas v2.1 ativado', time: '4 horas atrás', color: 'bg-green-500' },
                { title: 'Pagamento recebido', desc: '$5.000 da Empresa ABC', time: '1 dia atrás', color: 'bg-purple-500' },
                { title: 'Voucher resgatado', desc: 'Código PROMO20 utilizado', time: '2 dias atrás', color: 'bg-orange-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${item.color}`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                    <p className="text-gray-500 text-xs">{item.desc}</p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Métricas de Performance</h2>
            <div className="space-y-5">
              {[
                { label: 'Taxa de Conversão', value: '23.5%', percent: 23.5, color: 'bg-blue-500' },
                { label: 'Satisfação do Cliente', value: '92%', percent: 92, color: 'bg-green-500' },
                { label: 'Tempo de Resposta', value: '45s', percent: 60, color: 'bg-purple-500' },
                { label: 'Uptime do Sistema', value: '99.9%', percent: 99.9, color: 'bg-orange-500' },
              ].map((metric, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                    <span className="text-sm font-bold text-gray-900">{metric.value}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`${metric.color} h-2 rounded-full transition-all`}
                      style={{ width: `${metric.percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
