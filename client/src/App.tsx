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

// Admin Pages extras
import AdminPlans from './pages/admin/Plans'
import AdminInfluencers from './pages/admin/Influencers'

// Client Pages
import ClientDashboard from './pages/client/Dashboard'
import ClientAgents from './pages/client/Agents'
import ClientProfile from './pages/client/Profile'
import ClientIntegrations from './pages/client/Integrations'
import ClientSettings from './pages/client/Settings'
import ClientReferral from './pages/client/Referral'

function ProtectedRoute({ children, isAuthenticated }: { children: React.ReactNode; isAuthenticated: boolean }) {
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function PublicRoute({ children, isAuthenticated, user }: { children: React.ReactNode; isAuthenticated: boolean; user: any }) {
  if (!isAuthenticated) return <>{children}</>
  if (user?.role === 'admin') return <Navigate to="/admin" replace />
  return <Navigate to="/client" replace />
}

export default function App() {
  const { user, token, logout } = useAuthStore()
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
          // Token is invalid - clear everything
          logout()
          localStorage.removeItem('token')
          localStorage.removeItem('auth-store')
        } else {
          const data = await response.json()
          useAuthStore.setState({ user: data.user, token: savedToken })
          localStorage.setItem('token', savedToken)
        }
      } catch (error) {
        // Network error or server down - clear token
        logout()
        localStorage.removeItem('token')
      } finally {
        setLoading(false)
      }
    }

    validateToken()
  }, [])

  const isAuthenticated = !!token && !!user

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#1e3a5f',
        color: 'white',
        fontSize: '18px'
      }}>
        Carregando...
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute isAuthenticated={isAuthenticated} user={user}><Home /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute isAuthenticated={isAuthenticated} user={user}><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute isAuthenticated={isAuthenticated} user={user}><Register /></PublicRoute>} />
        <Route path="/plans" element={<Plans />} />

        {/* Admin Routes */}
        {user?.role === 'admin' && (
          <>
            <Route path="/admin" element={<ProtectedRoute isAuthenticated={isAuthenticated}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/clients" element={<ProtectedRoute isAuthenticated={isAuthenticated}><AdminClients /></ProtectedRoute>} />
            <Route path="/admin/plans" element={<ProtectedRoute isAuthenticated={isAuthenticated}><AdminPlans /></ProtectedRoute>} />
            <Route path="/admin/billing" element={<ProtectedRoute isAuthenticated={isAuthenticated}><AdminBilling /></ProtectedRoute>} />
            <Route path="/admin/ia-costs" element={<ProtectedRoute isAuthenticated={isAuthenticated}><AdminIACosts /></ProtectedRoute>} />
            <Route path="/admin/influencers" element={<ProtectedRoute isAuthenticated={isAuthenticated}><AdminInfluencers /></ProtectedRoute>} />
            <Route path="/admin/vouchers" element={<ProtectedRoute isAuthenticated={isAuthenticated}><AdminVouchers /></ProtectedRoute>} />
            <Route path="/admin/monitoring" element={<ProtectedRoute isAuthenticated={isAuthenticated}><AdminMonitoring /></ProtectedRoute>} />
            <Route path="/admin/security" element={<ProtectedRoute isAuthenticated={isAuthenticated}><AdminSecurity /></ProtectedRoute>} />
            <Route path="/admin/whatsapp" element={<ProtectedRoute isAuthenticated={isAuthenticated}><AdminWhatsApp /></ProtectedRoute>} />
            <Route path="/admin/profile" element={<ProtectedRoute isAuthenticated={isAuthenticated}><AdminProfile /></ProtectedRoute>} />
            <Route path="/admin/analytics" element={<ProtectedRoute isAuthenticated={isAuthenticated}><AdminAnalytics /></ProtectedRoute>} />
          </>
        )}

        {/* Client Routes */}
        <Route path="/client" element={<ProtectedRoute isAuthenticated={isAuthenticated}><ClientDashboard /></ProtectedRoute>} />
        <Route path="/client/agents" element={<ProtectedRoute isAuthenticated={isAuthenticated}><ClientAgents /></ProtectedRoute>} />
        <Route path="/client/integrations" element={<ProtectedRoute isAuthenticated={isAuthenticated}><ClientIntegrations /></ProtectedRoute>} />
        <Route path="/client/settings" element={<ProtectedRoute isAuthenticated={isAuthenticated}><ClientSettings /></ProtectedRoute>} />
        <Route path="/client/referral" element={<ProtectedRoute isAuthenticated={isAuthenticated}><ClientReferral /></ProtectedRoute>} />
        <Route path="/client/profile" element={<ProtectedRoute isAuthenticated={isAuthenticated}><ClientProfile /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}
