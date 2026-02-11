import AdminLayout from '../../components/AdminLayout'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

interface AuditLog {
  id: number
  action: string
  user: string
  timestamp: string
  details: string
  status: 'success' | 'failed'
}

export default function AdminSecurity() {
  const [showApiKey, setShowApiKey] = useState(false)

  const auditLogs: AuditLog[] = [
    {
      id: 1,
      action: 'User Login',
      user: 'admin@zentalk.ai',
      timestamp: '2024-02-10 14:32:00',
      details: 'Successful login from 192.168.1.1',
      status: 'success',
    },
    {
      id: 2,
      action: 'Plan Updated',
      user: 'admin@zentalk.ai',
      timestamp: '2024-02-10 13:15:00',
      details: 'Professional plan pricing updated',
      status: 'success',
    },
    {
      id: 3,
      action: 'Failed Login',
      user: 'unknown@example.com',
      timestamp: '2024-02-10 12:45:00',
      details: 'Invalid credentials from 203.0.113.45',
      status: 'failed',
    },
    {
      id: 4,
      action: 'API Key Generated',
      user: 'admin@zentalk.ai',
      timestamp: '2024-02-10 11:20:00',
      details: 'New API key created for integration',
      status: 'success',
    },
  ]

  return (
    <AdminLayout currentPage="security">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Security</h1>
          <p className="text-gray-600 mt-2">Manage security settings and audit logs.</p>
        </div>

        {/* API Keys */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Lock size={20} />
            API Keys
          </h3>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-gray-900">Production API Key</p>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  Active
                </span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <code className={`flex-1 px-3 py-2 bg-gray-100 rounded-lg font-mono text-sm ${
                  showApiKey ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {showApiKey ? 'sk_prod_abc123def456ghi789jkl012' : '••••••••••••••••••••••••••••'}
                </code>
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-gray-600 mb-3">Created: 2024-01-15</p>
              <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 text-sm">
                Regenerate Key
              </button>
            </div>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">2FA Status</p>
                <p className="text-sm text-gray-600">Protect your account with two-factor authentication</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Enabled
              </span>
            </div>
          </div>
        </div>

        {/* Audit Log */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Log</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">User</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Timestamp</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Details</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{log.action}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{log.user}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{log.timestamp}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{log.details}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        log.status === 'success'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
