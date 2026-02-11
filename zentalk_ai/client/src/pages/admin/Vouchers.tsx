import { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { useTranslation } from '../../hooks/useTranslation'
import { Plus, Edit, Trash2 } from 'lucide-react'

interface Voucher {
  id: number
  code: string
  discount: number
  expiryDate: string
  usageLimit: number
  timesUsed: number
}

export default function AdminVouchers() {
  const { t } = useTranslation()
  const [vouchers] = useState<Voucher[]>([
    { id: 1, code: 'SAVE10', discount: 10, expiryDate: '2026-12-31', usageLimit: 100, timesUsed: 45 },
    { id: 2, code: 'SAVE20', discount: 20, expiryDate: '2026-12-31', usageLimit: 50, timesUsed: 30 },
  ])

  return (
    <AdminLayout currentPage="vouchers">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">{t('vouchers.title')}</h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-5 h-5" />
            {t('actions.add')}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">{t('vouchers.code')}</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">{t('vouchers.discount')}</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">{t('vouchers.expiryDate')}</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">{t('vouchers.usageLimit')}</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">{t('vouchers.timesUsed')}</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">{t('actions.edit')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vouchers.map((voucher) => (
                <tr key={voucher.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{voucher.code}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{voucher.discount}%</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{voucher.expiryDate}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{voucher.usageLimit}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{voucher.timesUsed}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
