import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth'
import { useTranslation } from '../hooks/useTranslation'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import { Check } from 'lucide-react'

interface Plan {
  id: string
  name: string
  price: number
  description: string
  features: string[]
  popular?: boolean
}

const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 19,
    description: 'Perfect for small businesses',
    features: [
      '5 AI Agents',
      '1,000 conversations/month',
      'Basic analytics',
      'Email support',
      'WhatsApp integration',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 49,
    description: 'For growing businesses',
    features: [
      '20 AI Agents',
      '10,000 conversations/month',
      'Advanced analytics',
      'Priority support',
      'WhatsApp + Telegram integration',
      'Custom branding',
      'API access',
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    description: 'For large organizations',
    features: [
      'Unlimited AI Agents',
      'Unlimited conversations',
      'Real-time analytics',
      '24/7 dedicated support',
      'All integrations',
      'Custom solutions',
      'SLA guarantee',
      'Dedicated account manager',
    ],
  },
]

export default function Plans() {
  const navigate = useNavigate()
  const { token } = useAuthStore()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)

  const handleSelectPlan = async (planId: string) => {
    if (!token) {
      navigate('/register')
      return
    }

    setLoading(true)
    try {
      // Criar sessão de checkout no Stripe
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan: planId }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { checkoutUrl } = await response.json()
      window.location.href = checkoutUrl
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Zentalk.AI</h1>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          {token && (
            <button
              onClick={() => navigate('/client/dashboard')}
              className="px-4 py-2 text-blue-600 hover:text-blue-700"
            >
              Dashboard
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600">
            Choose the perfect plan for your business. All plans include a 7-day free trial.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-lg shadow-lg overflow-hidden transition transform hover:scale-105 ${
                plan.popular ? 'ring-2 ring-blue-500 md:scale-105' : 'bg-white'
              }`}
            >
              {plan.popular && (
                <div className="bg-blue-500 text-white py-2 text-center font-semibold">
                  Most Popular
                </div>
              )}

              <div className={`p-8 ${plan.popular ? 'bg-blue-50' : 'bg-white'}`}>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>

                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={loading}
                  className={`w-full py-3 rounded-lg font-semibold transition mb-8 ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  } disabled:opacity-50`}
                >
                  {loading ? 'Processing...' : 'Get Started'}
                </button>

                <div className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trial Info */}
        <div className="mt-16 bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Start Your 7-Day Free Trial</h3>
          <p className="text-gray-700">
            No credit card required. Full access to all features. Cancel anytime.
          </p>
        </div>
      </section>
    </div>
  )
}
