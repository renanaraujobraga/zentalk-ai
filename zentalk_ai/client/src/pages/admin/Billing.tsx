import AdminLayout from '../../components/AdminLayout'
import { Download } from 'lucide-react'

interface Invoice {
  id: string
  client: string
  amount: number
  date: string
  status: 'paid' | 'pending' | 'overdue'
  plan: string
}

export default function AdminBilling() {
  const invoices: Invoice[] = [
    {
      id: 'INV-001',
      client: 'John Silva',
      amount: 99,
      date: '2024-02-01',
      status: 'paid',
      plan: 'Professional',
    },
    {
      id: 'INV-002',
      client: 'Maria Santos',
      amount: 29,
      date: '2024-02-01',
      status: 'paid',
      plan: 'Starter',
    },
    {
      id: 'INV-003',
      client: 'Tech Corp',
      amount: 500,
      date: '2024-02-01',
      status: 'paid',
      plan: 'Enterprise',
    },
    {
      id: 'INV-004',
      client: 'Design Studio',
      amount: 99,
      date: '2024-02-10',
      status: 'pending',
      plan: 'Professional',
    },
  ]

  const stats = [
    {
      label: 'Total Revenue',
      value: '$45,678',
      change: '+12.5%',
    },
    {
      label: 'Pending Invoices',
      value: '$2,450',
      change: '-2.3%',
    },
    {
      label: 'Avg Invoice Value',
      value: '$234',
      change: '+5.2%',
    },
    {
      label: 'Collection Rate',
      value: '98.5%',
      change: '+0.8%',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <AdminLayout currentPage="billing">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing</h1>
          <p className="text-gray-600 mt-2">Manage invoices and revenue.</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
              <p className="text-sm text-green-600 mt-2">{stat.change} from last month</p>
            </div>
          ))}
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Invoices</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Invoice ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Client</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Plan</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{invoice.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{invoice.client}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{invoice.plan}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">${invoice.amount}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{invoice.date}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-gray-200 rounded-lg">
                          <Download size={18} className="text-gray-600" />
                        </button>
                      </div>
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
