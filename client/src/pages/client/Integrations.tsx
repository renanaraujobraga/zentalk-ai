import { useState } from 'react'
import ClientLayout from '../../components/ClientLayout'
import { Smartphone, CheckCircle, XCircle, Plus, RefreshCw } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'

interface Integration {
  id: number
  name: string
  type: string
  status: 'connected' | 'disconnected'
  phone?: string
  lastSync?: string
}

export default function ClientIntegrations() {
  const { t } = useTranslation()
  const [integrations] = useState<Integration[]>([
    {
      id: 1,
      name: 'WhatsApp Business',
      type: 'whatsapp',
      status: 'disconnected',
    },
  ])

  return (
    <ClientLayout currentPage="integrations">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Integrações</h1>
            <p className="text-gray-600 mt-1">Conecte suas contas e serviços</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <Plus className="w-4 h-4" />
            Nova Integração
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* WhatsApp Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">WhatsApp Business</h3>
                  <p className="text-sm text-gray-500">Mensagens automáticas</p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-sm text-red-600">
                <XCircle className="w-4 h-4" />
                Desconectado
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Conecte seu WhatsApp Business para enviar e receber mensagens automaticamente através dos seus agentes de IA.
            </p>
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium">
              Conectar WhatsApp
            </button>
          </div>

          {/* API Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">API Zentalk</h3>
                  <p className="text-sm text-gray-500">Integração via API</p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                Ativo
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Use nossa API REST para integrar o Zentalk.AI com seus sistemas existentes.
            </p>
            <button className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition text-sm font-medium">
              Ver Documentação
            </button>
          </div>

          {/* Webhook Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 opacity-60">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Plus className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Webhooks</h3>
                  <p className="text-sm text-gray-500">Em breve</p>
                </div>
              </div>
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                Em breve
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Configure webhooks para receber notificações em tempo real sobre eventos do sistema.
            </p>
            <button disabled className="w-full px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed text-sm font-medium">
              Disponível em breve
            </button>
          </div>
        </div>
      </div>
    </ClientLayout>
  )
}
