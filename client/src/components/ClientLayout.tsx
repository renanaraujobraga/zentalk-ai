import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, LogOut, User, Settings, LayoutDashboard, Bot, Plug, Share2, ChevronDown } from 'lucide-react'
import { useAuthStore } from '../store/auth'
import { LanguageSwitcher } from './LanguageSwitcher'

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems = [
    { id: 'profile', label: 'Meu Perfil', icon: User, path: '/client/profile' },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/client' },
    { id: 'agents', label: 'Meus Agentes', icon: Bot, path: '/client/agents' },
    { id: 'integrations', label: 'Integrações', icon: Plug, path: '/client/integrations' },
    { id: 'referral', label: 'Indicações', icon: Share2, path: '/client/referral' },
    { id: 'settings', label: 'Configurações', icon: Settings, path: '/client/settings' },
  ]

  const currentItem = menuItems.find(item => {
    if (item.path === '/client') return location.pathname === '/client'
    return location.pathname.startsWith(item.path)
  })

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
                onClick={() => navigate(item.path)}
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

        {/* User Section at bottom */}
        {sidebarOpen && (
          <div className="p-4 border-t border-gray-800">
            <div className="text-sm">
              <p className="font-medium text-white truncate">{user?.name || 'Usuário'}</p>
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
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.name || 'Usuário'}</span>
                <ChevronDown size={16} className="text-gray-500" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => { navigate('/client/profile'); setUserMenuOpen(false) }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition text-sm"
                  >
                    <User size={16} />
                    Meu Perfil
                  </button>
                  <button
                    onClick={() => { navigate('/client/settings'); setUserMenuOpen(false) }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition text-sm"
                  >
                    <Settings size={16} />
                    Configurações
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
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
