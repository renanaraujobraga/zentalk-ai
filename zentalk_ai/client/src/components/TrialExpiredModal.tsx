import { useNavigate } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'

interface TrialExpiredModalProps {
  daysRemaining: number
  isExpired: boolean
}

export function TrialExpiredModal({ daysRemaining, isExpired }: TrialExpiredModalProps) {
  const navigate = useNavigate()

  if (!isExpired && daysRemaining > 0) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md">
        <div className="flex items-center justify-center mb-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>

        <h2 className="text-2xl font-bold text-center mb-4">Trial Period Expired</h2>

        <p className="text-gray-600 text-center mb-6">
          Your 7-day free trial has ended. To continue using Zentalk.AI, please choose a plan below.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/plans')}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
          >
            View Plans
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition"
          >
            Back to Home
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          Questions? Contact our support team at support@zentalk.ai
        </p>
      </div>
    </div>
  )
}
