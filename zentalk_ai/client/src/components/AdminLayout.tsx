import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth'
import { useTranslation } from '../hooks/useTranslation'
import { LanguageSwitcher } from './LanguageSwitcher'
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  CreditCard,
  Zap,
  Gift,
  Activity,
  Lock,
  LogOut,
  Menu,
  X,
  ChevronDown,
  MessageCircle,
  BarChart3,
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
  currentPage: string
}

export default function AdminLayout({ children, currentPage }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const menuItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard, href: '/admin' },
    { id: 'clients', label: t('nav.clients'), icon: Users, href: '/admin/clients' },
    { id: 'agents', label: t('nav.agents'), icon: Zap, href: '/admin/agents' },
    { id: 'billing', label: t('nav.billing'), icon: CreditCard, href: '/admin/billing' },
    { id: 'analytics', label: t('nav.analytics'), icon: BarChart3, href: '/admin/analytics' },
    { id: 'vouchers', label: t('nav.vouchers'), icon: Gift, href: '/admin/vouchers' },
    { id: 'whatsapp', label: t('nav.whatsapp'), icon: MessageCircle, href: '/admin/whatsapp' },
    { id: 'monitoring', label: t('nav.monitoring'), icon: Activity, href: '/admin/monitoring' },
    { id: 'security', label: t('nav.security'), icon: Lock, href: '/admin/security' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
          {sidebarOpen && <h1 className="text-xl font-bold">Zentalk.AI</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.href)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-800">
          {sidebarOpen && (
            <div className="text-sm">
              <p className="font-medium text-white">{user?.name || 'Admin'}</p>
              <p className="text-gray-400 text-xs">{user?.email}</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {menuItems.find((item) => item.id === currentPage)?.label || t('nav.dashboard')}
          </h2>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition"
              >
                <span className="text-sm font-medium text-gray-700">{user?.name || 'Admin'}</span>
                <ChevronDown size={16} className="text-gray-600" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition text-sm"
                  >
                    <LogOut size={16} />
                    {t('nav.logout')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
