import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuthStore } from './store/auth'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Plans from './pages/Plans'
import NotFound from './pages/NotFound'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminClients from './pages/admin/Clients'
import AdminBilling from './pages/admin/Billing'
import AdminIACosts from './pages/admin/IACosts'
import AdminVouchers from './pages/admin/Vouchers'
import AdminMonitoring from './pages/admin/Monitoring'
import AdminSecurity from './pages/admin/Security'
import AdminProfile from './pages/admin/Profile'
import AdminWhatsApp from './pages/admin/WhatsApp'
import AdminAnalytics from './pages/admin/Analytics'
import AdminPlans from './pages/admin/Plans'
import AdminInfluencers from './pages/admin/Influencers'
import AdminAIConfig from './pages/admin/AIConfig'

// Client Pages
import ClientDashboard from './pages/client/Dashboard'
import ClientAgents from './pages/client/Agents'
import ClientProfile from './pages/client/Profile'
import ClientIntegrations from './pages/client/Integrations'
import ClientSettings from './pages/client/Settings'
import ClientReferral from './pages/client/Referral'

function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuthStore()
  if (!token || !user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/client" replace />
  return <>{children}</>
}

function ProtectedClientRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore()
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuthStore()
  if (!token || !user) return <>{children}</>
  if (user.role === 'admin') return <Navigate to="/admin" replace />
  return <Navigate to="/client" replace />
}

export default function App() {
  const { token, logout } = useAuthStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const validateToken = async () => {
      const savedToken = token || localStorage.getItem('token')

      if (!savedToken) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${savedToken}` }
        })

        if (!response.ok) {
          logout()
          localStorage.removeItem('token')
          localStorage.removeItem('auth-store')
        } else {
          const data = await response.json()
          useAuthStore.setState({ user: data.user, token: savedToken })
          localStorage.setItem('token', savedToken)
        }
      } catch {
        // Network error - keep token for now, will fail on API calls
      } finally {
        setLoading(false)
      }
    }

    validateToken()
  }, [])

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
        color: 'white',
        fontSize: '18px',
        fontFamily: 'sans-serif',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid rgba(255,255,255,0.3)',
          borderTop: '4px solid white',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <span>Carregando Zentalk.AI...</span>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/plans" element={<Plans />} />

        {/* Admin Routes - always registered, protection inside */}
        <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
        <Route path="/admin/clients" element={<ProtectedAdminRoute><AdminClients /></ProtectedAdminRoute>} />
        <Route path="/admin/plans" element={<ProtectedAdminRoute><AdminPlans /></ProtectedAdminRoute>} />
        <Route path="/admin/billing" element={<ProtectedAdminRoute><AdminBilling /></ProtectedAdminRoute>} />
        <Route path="/admin/ia-costs" element={<ProtectedAdminRoute><AdminIACosts /></ProtectedAdminRoute>} />
        <Route path="/admin/influencers" element={<ProtectedAdminRoute><AdminInfluencers /></ProtectedAdminRoute>} />
        <Route path="/admin/vouchers" element={<ProtectedAdminRoute><AdminVouchers /></ProtectedAdminRoute>} />
        <Route path="/admin/monitoring" element={<ProtectedAdminRoute><AdminMonitoring /></ProtectedAdminRoute>} />
        <Route path="/admin/security" element={<ProtectedAdminRoute><AdminSecurity /></ProtectedAdminRoute>} />
        <Route path="/admin/whatsapp" element={<ProtectedAdminRoute><AdminWhatsApp /></ProtectedAdminRoute>} />
        <Route path="/admin/profile" element={<ProtectedAdminRoute><AdminProfile /></ProtectedAdminRoute>} />
        <Route path="/admin/analytics" element={<ProtectedAdminRoute><AdminAnalytics /></ProtectedAdminRoute>} />
        <Route path="/admin/ai-config" element={<ProtectedAdminRoute><AdminAIConfig /></ProtectedAdminRoute>} />

        {/* Client Routes */}
        <Route path="/client" element={<ProtectedClientRoute><ClientDashboard /></ProtectedClientRoute>} />
        <Route path="/client/agents" element={<ProtectedClientRoute><ClientAgents /></ProtectedClientRoute>} />
        <Route path="/client/integrations" element={<ProtectedClientRoute><ClientIntegrations /></ProtectedClientRoute>} />
        <Route path="/client/settings" element={<ProtectedClientRoute><ClientSettings /></ProtectedClientRoute>} />
        <Route path="/client/referral" element={<ProtectedClientRoute><ClientReferral /></ProtectedClientRoute>} />
        <Route path="/client/profile" element={<ProtectedClientRoute><ClientProfile /></ProtectedClientRoute>} />

        {/* 404 */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}
