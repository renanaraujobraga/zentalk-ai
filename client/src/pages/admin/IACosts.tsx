import AdminLayout from '../../components/AdminLayout'


interface CostBreakdown {
  service: string
  cost: number
  usage: string
  trend: number
}

export default function AdminIACosts() {
  const costBreakdown: CostBreakdown[] = [
    {
      service: 'GPT-4 API',
      cost: 12450,
      usage: '2.5M tokens',
      trend: 5.2,
    },
    {
      service: 'Claude API',
      cost: 8900,
      usage: '1.8M tokens',
      trend: -2.1,
    },
    {
      service: 'Embeddings',
      cost: 2340,
      usage: '450K embeddings',
      trend: 3.4,
    },
    {
      service: 'Speech-to-Text',
      cost: 1560,
      usage: '3.2K minutes',
      trend: 8.7,
    },
  ]

  const stats = [
    {
      label: 'Total Monthly Cost',
      value: '$25,250',
      change: '+4.2%',
    },
    {
      label: 'Cost per Conversation',
      value: '$0.42',
      change: '-1.3%',
    },
    {
      label: 'API Calls',
      value: '4.2M',
      change: '+12.5%',
    },
    {
      label: 'Avg Response Time',
      value: '1.2s',
      change: '-0.3s',
    },
  ]

  return (
    <AdminLayout currentPage="ia-costs">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">IA Costs</h1>
          <p className="text-gray-600 mt-2">Monitor API usage and costs.</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
              <p className="text-sm text-green-600 mt-2">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Cost Breakdown */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Cost Breakdown by Service</h3>
          <div className="space-y-4">
            {costBreakdown.map((item) => {
              const totalCost = costBreakdown.reduce((sum, i) => sum + i.cost, 0)
              const percentage = (item.cost / totalCost) * 100

              return (
                <div key={item.service} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">{item.service}</p>
                      <p className="text-sm text-gray-600">{item.usage}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">${item.cost.toLocaleString()}</p>
                      <p className={`text-sm ${item.trend > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {item.trend > 0 ? '+' : ''}{item.trend}%
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{percentage.toFixed(1)}% of total</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Usage Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Cost Trend</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Chart placeholder</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
