import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth'
import { useTranslation } from '../hooks/useTranslation'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import { Zap, MessageSquare, TrendingUp, Shield } from 'lucide-react'

export default function Home() {
  const { user, token } = useAuthStore()
  const navigate = useNavigate()
  const { t } = useTranslation()

  if (token) {
    if (user?.role === 'admin') {
      navigate('/admin')
    } else {
      navigate('/client/dashboard')
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 text-white">
      <header className="p-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Zentalk.AI</h1>
        <LanguageSwitcher />
      </header>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">Intelligent Agents, Infinite Scale</h2>
          <p className="text-xl text-blue-100 mb-8">24/7 AI customer service that closes sales while you sleep</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => navigate('/register')} className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition">
              Comece Gratuitamente
            </button>
            <button onClick={() => navigate('/plans')} className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-blue-600 transition">
              Ver Planos
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-20">
          <div className="bg-blue-800 bg-opacity-50 p-6 rounded-lg">
            <Zap className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
            <p className="text-blue-100">Your AI agent responds instantly to customer inquiries</p>
          </div>
          <div className="bg-blue-800 bg-opacity-50 p-6 rounded-lg">
            <MessageSquare className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-bold mb-2">Lead Qualification</h3>
            <p className="text-blue-100">Automatically qualify leads based on your criteria</p>
          </div>
          <div className="bg-blue-800 bg-opacity-50 p-6 rounded-lg">
            <TrendingUp className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-bold mb-2">Instant Setup</h3>
            <p className="text-blue-100">Get your AI agent running in minutes, not weeks</p>
          </div>
          <div className="bg-blue-800 bg-opacity-50 p-6 rounded-lg">
            <Shield className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-bold mb-2">Secure & Reliable</h3>
            <p className="text-blue-100">Enterprise-grade security and 99.9% uptime</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-blue-700 mt-20 py-8 text-center text-blue-200">
        <p>&copy; 2026 Zentalk.AI. All rights reserved.</p>
      </footer>
    </div>
  )
}
