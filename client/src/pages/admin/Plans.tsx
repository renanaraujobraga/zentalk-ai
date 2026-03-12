import { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { Edit, Trash2, Plus, Check } from 'lucide-react'

interface Plan {
  id: number
  name: string
  price: number
  agents: number | string
  conversations: number | string
  features: string[]
  active: boolean
  subscribers: number
}

export default function AdminPlans() {
  const [plans] = useState<Plan[]>([
    {
      id: 1,
      name: 'Starter',
      price: 19,
      agents: 5,
      conversations: 1000,
      features: ['5 Agentes de IA', '1.000 conversas/mês', 'Suporte por email', 'Dashboard básico'],
      active: true,
      subscribers: 48,
    },
    {
      id: 2,
      name: 'Professional',
      price: 49,
      agents: 20,
      conversations: 10000,
      features: ['20 Agentes de IA', '10.000 conversas/mês', 'Suporte prioritário', 'Analytics avançado', 'API access'],
      active: true,
      subscribers: 127,
    },
    {
      id: 3,
      name: 'Enterprise',
      price: 99,
      agents: 'Ilimitado',
      conversations: 'Ilimitado',
      features: ['Agentes ilimitados', 'Conversas ilimitadas', 'Suporte 24/7', 'Analytics completo', 'API access', 'SLA garantido'],
      active: true,
      subscribers: 34,
    },
  ])

  return (
    <AdminLayout currentPage="plans">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Planos de Assinatura</h1>
            <p className="text-gray-600 mt-1">Gerencie os planos disponíveis para os clientes</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <Plus className="w-4 h-4" />
            Novo Plano
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <p className="text-3xl font-bold text-gray-900">3</p>
            <p className="text-sm text-gray-600 mt-1">Planos Ativos</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <p className="text-3xl font-bold text-gray-900">209</p>
            <p className="text-sm text-gray-600 mt-1">Total de Assinantes</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <p className="text-3xl font-bold text-green-600">R$ 12.347</p>
            <p className="text-sm text-gray-600 mt-1">Receita Mensal</p>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className={`p-6 ${plan.name === 'Professional' ? 'bg-blue-600 text-white' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-xl font-bold ${plan.name === 'Professional' ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    plan.name === 'Professional' ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'
                  }`}>
                    {plan.subscribers} assinantes
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl font-bold ${plan.name === 'Professional' ? 'text-white' : 'text-gray-900'}`}>
                    ${plan.price}
                  </span>
                  <span className={`text-sm ${plan.name === 'Professional' ? 'text-blue-100' : 'text-gray-500'}`}>/mês</span>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition text-sm">
                    <Edit className="w-3 h-3" />
                    Editar
                  </button>
                  <button className="flex items-center justify-center gap-1 px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition text-sm">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
