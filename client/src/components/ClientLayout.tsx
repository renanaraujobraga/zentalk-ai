import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, User, Settings } from 'lucide-react'
import { useAuthStore } from '../store/auth'
import { useTranslation } from '../hooks/useTranslation'
import { LanguageSwitcher } from './LanguageSwitcher'

interface ClientLayoutProps {
  children: React.ReactNode
  currentPage?: string
}

export default function ClientLayout({ children, currentPage }: ClientLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user, logout } = useAuthStore()
  const [, navigate] = useNavigate()
  const { t } = useTranslation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems = [
    { id: 'dashboard', label: t('nav.dashboard'), path: '/client/dashboard' },
    { id: 'agents', label: t('nav.agents'), path: '/client/agents' },
    { id: 'profile', label: t('nav.profile'), path: '/client/profile' },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            {sidebarOpen && <h1 className="text-xl font-bold">Zentalk.AI</h1>}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-800 rounded-lg"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <a
              key={item.id}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                currentPage === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800'
              }`}
            >
              {item.id === 'dashboard' && <span className="w-5 h-5">📊</span>}
              {item.id === 'agents' && <span className="w-5 h-5">🤖</span>}
              {item.id === 'profile' && <User className="w-5 h-5" />}
              {sidebarOpen && <span>{item.label}</span>}
            </a>
          ))}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-800">
          {sidebarOpen && (
            <div className="text-sm">
              <p className="font-medium">{user?.name || 'User'}</p>
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
            {menuItems.find((item) => item.id === currentPage)?.label || 'Dashboard'}
          </h2>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* User Menu */}
            <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">{t('nav.logout')}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
