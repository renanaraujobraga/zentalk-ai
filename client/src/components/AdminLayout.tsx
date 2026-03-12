import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/auth'
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
  DollarSign,
  UserCheck,
  Bot,
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { id: 'clients', label: 'Clientes', icon: Users, href: '/admin/clients' },
    { id: 'billing', label: 'Faturamento', icon: CreditCard, href: '/admin/billing' },
    { id: 'plans', label: 'Planos', icon: DollarSign, href: '/admin/plans' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
    { id: 'vouchers', label: 'Vouchers', icon: Gift, href: '/admin/vouchers' },
    { id: 'influencers', label: 'Influenciadores', icon: UserCheck, href: '/admin/influencers' },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, href: '/admin/whatsapp' },
    { id: 'ia-costs', label: 'Custos IA', icon: Zap, href: '/admin/ia-costs' },
    { id: 'monitoring', label: 'Monitoramento', icon: Activity, href: '/admin/monitoring' },
    { id: 'security', label: 'Segurança', icon: Lock, href: '/admin/security' },
    { id: 'ai-config', label: 'Chat IA', icon: Bot, href: '/admin/ai-config' },
  ]

  const currentItem = menuItems.find(item => {
    if (item.href === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(item.href)
  })

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
        } bg-gray-900 text-white transition-all duration-300 flex flex-col flex-shrink-0`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
          {sidebarOpen && <h1 className="text-xl font-bold text-white">Zentalk.AI</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg transition"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentItem?.id === item.id

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.href)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* User Section */}
        {sidebarOpen && (
          <div className="p-4 border-t border-gray-800">
            <div className="text-sm">
              <p className="font-medium text-white truncate">{user?.name || 'Admin'}</p>
              <p className="text-gray-400 text-xs truncate">{user?.email}</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900">
            {currentItem?.label || 'Dashboard'}
          </h2>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.name || 'Admin'}</span>
                <ChevronDown size={16} className="text-gray-500" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">Admin</span>
                  </div>
                  <button
                    onClick={() => { navigate('/admin/profile'); setUserMenuOpen(false) }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition text-sm"
                  >
                    <TrendingUp size={16} />
                    Meu Perfil
                  </button>
                  <div className="border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-b-lg transition text-sm"
                    >
                      <LogOut size={16} />
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
