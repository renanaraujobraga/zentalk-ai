import { useState } from 'react'
import ClientLayout from '../../components/ClientLayout'
import { Copy, Share2, Users, DollarSign, TrendingUp, CheckCircle } from 'lucide-react'
import { useAuthStore } from '../../store/auth'

export default function ClientReferral() {
  const { user } = useAuthStore()
  const [copied, setCopied] = useState(false)
  const referralCode = user?.email?.split('@')[0].toUpperCase() + '2024' || 'ZENTALK2024'
  const referralLink = `https://zentalk-ai.vercel.app/register?ref=${referralCode}`

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  const stats = [
    { label: 'Indicações Realizadas', value: '12', icon: Users, color: 'blue' },
    { label: 'Conversões', value: '5', icon: TrendingUp, color: 'green' },
    { label: 'Comissão Total', value: 'R$ 245,00', icon: DollarSign, color: 'purple' },
  ]

  const referrals = [
    { name: 'João Silva', email: 'joao@email.com', status: 'Ativo', plan: 'Professional', date: '10/01/2024', commission: 'R$ 49,00' },
    { name: 'Maria Santos', email: 'maria@email.com', status: 'Ativo', plan: 'Starter', date: '15/01/2024', commission: 'R$ 19,00' },
    { name: 'Pedro Costa', email: 'pedro@email.com', status: 'Trial', plan: 'Trial', date: '20/01/2024', commission: 'R$ 0,00' },
  ]

  return (
    <ClientLayout currentPage="referral">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Programa de Indicação</h1>
          <p className="text-gray-600 mt-1">Indique amigos e ganhe comissões recorrentes</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Referral Link */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white mb-8">
          <h2 className="text-xl font-bold mb-2">Seu Link de Indicação</h2>
          <p className="text-blue-100 mb-4">Compartilhe este link e ganhe 20% de comissão recorrente</p>
          <div className="flex gap-3">
            <div className="flex-1 bg-white/20 rounded-lg px-4 py-3 text-sm font-mono truncate">
              {referralLink}
            </div>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition ${
                copied ? 'bg-green-500 text-white' : 'bg-white text-blue-600 hover:bg-blue-50'
              }`}
            >
              {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
            <button className="flex items-center gap-2 px-4 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition">
              <Share2 className="w-4 h-4" />
              Compartilhar
            </button>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-blue-100 text-sm">Seu código:</span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">{referralCode}</span>
          </div>
        </div>

        {/* Referrals Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Suas Indicações</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Nome</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Plano</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Data</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Comissão</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {referrals.map((ref, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{ref.name}</p>
                        <p className="text-sm text-gray-500">{ref.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        ref.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {ref.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{ref.plan}</td>
                    <td className="px-6 py-4 text-gray-700">{ref.date}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{ref.commission}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ClientLayout>
  )
}
