import { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { Plus, Search, Users, DollarSign, TrendingUp, MoreVertical } from 'lucide-react'

interface Influencer {
  id: number
  name: string
  email: string
  referrals: number
  conversions: number
  commission: number
  status: 'active' | 'inactive'
  joinDate: string
}

export default function AdminInfluencers() {
  const [search, setSearch] = useState('')
  const [influencers] = useState<Influencer[]>([
    { id: 1, name: 'Carlos Mendes', email: 'carlos@influencer.com', referrals: 45, conversions: 18, commission: 882, status: 'active', joinDate: '01/10/2023' },
    { id: 2, name: 'Ana Lima', email: 'ana@influencer.com', referrals: 32, conversions: 12, commission: 588, status: 'active', joinDate: '15/10/2023' },
    { id: 3, name: 'Roberto Alves', email: 'roberto@influencer.com', referrals: 28, conversions: 9, commission: 441, status: 'active', joinDate: '01/11/2023' },
    { id: 4, name: 'Fernanda Costa', email: 'fernanda@influencer.com', referrals: 15, conversions: 4, commission: 196, status: 'inactive', joinDate: '20/11/2023' },
  ])

  const filtered = influencers.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.email.toLowerCase().includes(search.toLowerCase())
  )

  const totalCommission = influencers.reduce((sum, i) => sum + i.commission, 0)
  const totalConversions = influencers.reduce((sum, i) => sum + i.conversions, 0)
  const totalReferrals = influencers.reduce((sum, i) => sum + i.referrals, 0)

  return (
    <AdminLayout currentPage="influencers">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Influenciadores</h1>
            <p className="text-gray-600 mt-1">Gerencie o programa de afiliados e influenciadores</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <Plus className="w-4 h-4" />
            Novo Influenciador
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Influenciadores</p>
                <p className="text-xl font-bold text-gray-900">{influencers.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Indicações</p>
                <p className="text-xl font-bold text-gray-900">{totalReferrals}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Conversões</p>
                <p className="text-xl font-bold text-gray-900">{totalConversions}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Comissões Pagas</p>
                <p className="text-xl font-bold text-gray-900">R$ {totalCommission}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar influenciadores..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Influenciador</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Indicações</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Conversões</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Comissão</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((inf) => (
                <tr key={inf.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{inf.name}</p>
                      <p className="text-sm text-gray-500">{inf.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{inf.referrals}</td>
                  <td className="px-6 py-4 text-gray-700">{inf.conversions}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">R$ {inf.commission}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      inf.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {inf.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
