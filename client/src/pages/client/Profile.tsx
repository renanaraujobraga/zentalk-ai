import { useState } from 'react'
import ClientLayout from '../../components/ClientLayout'
import { useAuthStore } from '../../store/auth'
import { useTranslation } from '../../hooks/useTranslation'
import { Lock, Bell, LogOut } from 'lucide-react'

export default function ClientProfile() {
  const { user } = useAuthStore()
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })

  const handleSave = () => {
    console.log('Salvando:', formData)
  }

  return (
    <ClientLayout currentPage="profile">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('nav.profile')}</h1>
              <p className="text-gray-600 mt-2">{t('forms.description')}</p>
            </div>

            {/* Profile Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('forms.name')}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('forms.name')}</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('forms.email')}</label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
              </div>
              <button
                onClick={handleSave}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {t('actions.save')}
              </button>
            </div>

            {/* Security */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-5 h-5 text-gray-700" />
                <h2 className="text-xl font-semibold text-gray-900">Segurança</h2>
              </div>
              <div className="space-y-4">
                <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-left font-medium">
                  Alterar Senha
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-left font-medium">
                  Autenticação de Dois Fatores
                </button>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-gray-700" />
                <h2 className="text-xl font-semibold text-gray-900">Notificações</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Notificações de Email</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Notificações de SMS</span>
                  <input type="checkbox" className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Notificações de Push</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-red-900 mb-4">Zona de Perigo</h2>
              <p className="text-red-800 mb-4">Estas ações são irreversíveis. Por favor, tenha cuidado.</p>
              <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                <LogOut className="w-4 h-4" />
                {t('nav.logout')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  )
}
