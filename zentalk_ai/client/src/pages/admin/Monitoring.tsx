import { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { AlertCircle, CheckCircle } from 'lucide-react'

export default function AdminMonitoring() {
  const [activeTab, setActiveTab] = useState<'monitoring' | 'quality'>('monitoring')

  const systemStatus = [
    {
      service: 'API Server',
      status: 'operational',
      uptime: '99.98%',
      latency: '45ms',
    },
    {
      service: 'Database',
      status: 'operational',
      uptime: '99.99%',
      latency: '12ms',
    },
    {
      service: 'Cache',
      status: 'operational',
      uptime: '99.95%',
      latency: '5ms',
    },
    {
      service: 'Message Queue',
      status: 'operational',
      uptime: '99.97%',
      latency: '8ms',
    },
  ]

  const qualityMetrics = [
    {
      metric: 'Error Rate',
      value: '0.12%',
      threshold: '< 1%',
      status: 'good',
    },
    {
      metric: 'Response Time (p95)',
      value: '234ms',
      threshold: '< 500ms',
      status: 'good',
    },
    {
      metric: 'Success Rate',
      value: '99.88%',
      threshold: '> 99%',
      status: 'good',
    },
    {
      metric: 'Availability',
      value: '99.97%',
      threshold: '> 99.5%',
      status: 'good',
    },
  ]

  const alerts = [
    {
      id: 1,
      severity: 'warning',
      title: 'High Memory Usage',
      description: 'API server memory usage at 85%',
      time: '5 minutes ago',
    },
    {
      id: 2,
      severity: 'info',
      title: 'Scheduled Maintenance',
      description: 'Database backup completed successfully',
      time: '2 hours ago',
    },
    {
      id: 3,
      severity: 'info',
      title: 'New Deployment',
      description: 'Version 2.1.0 deployed to production',
      time: '4 hours ago',
    },
  ]

  const getStatusColor = (status: string) => {
    return status === 'operational' ? 'text-green-600' : 'text-red-600'
  }

  return (
    <AdminLayout currentPage="monitoring">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Monitoring & Quality</h1>
          <p className="text-gray-600 mt-2">System health and performance metrics.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'monitoring'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            System Monitoring
          </button>
          <button
            onClick={() => setActiveTab('quality')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'quality'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Quality & SLA
          </button>
        </div>

        {/* Monitoring Tab */}
        {activeTab === 'monitoring' && (
          <div className="space-y-6">
            {/* System Status */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
              <div className="space-y-4">
                {systemStatus.map((item) => (
                  <div key={item.service} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle size={20} className={getStatusColor(item.status)} />
                      <div>
                        <p className="font-semibold text-gray-900">{item.service}</p>
                        <p className="text-sm text-gray-600">Uptime: {item.uptime}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{item.latency}</p>
                      <p className="text-sm text-gray-600">latency</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                    <AlertCircle size={20} className={alert.severity === 'warning' ? 'text-yellow-600' : 'text-blue-600'} />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{alert.title}</p>
                      <p className="text-sm text-gray-600">{alert.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quality Tab */}
        {activeTab === 'quality' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {qualityMetrics.map((metric) => (
                <div key={metric.metric} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{metric.metric}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      metric.status === 'good' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {metric.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-sm text-gray-600">Threshold: {metric.threshold}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* SLA Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SLA Compliance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Starter Plan</p>
                    <p className="text-sm text-gray-600">99.5% uptime SLA</p>
                  </div>
                  <p className="text-2xl font-bold text-green-600">99.98%</p>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Professional Plan</p>
                    <p className="text-sm text-gray-600">99.9% uptime SLA</p>
                  </div>
                  <p className="text-2xl font-bold text-green-600">99.98%</p>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Enterprise Plan</p>
                    <p className="text-sm text-gray-600">99.99% uptime SLA</p>
                  </div>
                  <p className="text-2xl font-bold text-green-600">99.98%</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
