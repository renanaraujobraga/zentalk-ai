import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth'
import { useTranslation } from '../hooks/useTranslation'
import { Globe, Zap, MessageSquare, TrendingUp, Shield, Star, Check, ChevronRight, Bot, Users, BarChart3, Headphones } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Home() {
  const { user, token } = useAuthStore()
  const navigate = useNavigate()
  const { language, setLanguage, getAvailableLanguages } = useTranslation()
  const languages = getAvailableLanguages()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (token) {
    if (user?.role === 'admin') {
      navigate('/admin')
    } else {
      navigate('/client')
    }
    return null
  }

  const plans = [
    {
      name: language === 'pt' ? 'Starter' : language === 'es' ? 'Inicial' : 'Starter',
      price: '$19',
      period: language === 'pt' ? '/mês' : language === 'es' ? '/mes' : '/month',
      description: language === 'pt' ? 'Perfeito para pequenos negócios' : language === 'es' ? 'Perfecto para pequeños negocios' : 'Perfect for small businesses',
      features: language === 'pt'
        ? ['5 Agentes de IA', '1.000 conversas/mês', 'Integração WhatsApp', 'Suporte por email', 'Analytics básico']
        : language === 'es'
        ? ['5 Agentes de IA', '1.000 conversaciones/mes', 'Integración WhatsApp', 'Soporte por email', 'Análisis básico']
        : ['5 AI Agents', '1,000 conversations/month', 'WhatsApp Integration', 'Email support', 'Basic analytics'],
      color: 'from-blue-400 to-blue-500',
      popular: false,
    },
    {
      name: language === 'pt' ? 'Professional' : language === 'es' ? 'Profesional' : 'Professional',
      price: '$49',
      period: language === 'pt' ? '/mês' : language === 'es' ? '/mes' : '/month',
      description: language === 'pt' ? 'Para negócios em crescimento' : language === 'es' ? 'Para negocios en crecimiento' : 'For growing businesses',
      features: language === 'pt'
        ? ['20 Agentes de IA', '10.000 conversas/mês', 'Integração WhatsApp + API', 'Suporte prioritário', 'Analytics avançado', 'Vouchers e indicações']
        : language === 'es'
        ? ['20 Agentes de IA', '10.000 conversaciones/mes', 'Integración WhatsApp + API', 'Soporte prioritario', 'Análisis avanzado', 'Cupones y referencias']
        : ['20 AI Agents', '10,000 conversations/month', 'WhatsApp + API Integration', 'Priority support', 'Advanced analytics', 'Vouchers & referrals'],
      color: 'from-blue-500 to-blue-700',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: language === 'pt' ? '/mês' : language === 'es' ? '/mes' : '/month',
      description: language === 'pt' ? 'Para grandes empresas' : language === 'es' ? 'Para grandes empresas' : 'For large enterprises',
      features: language === 'pt'
        ? ['Agentes ilimitados', 'Conversas ilimitadas', 'API completa + Webhooks', 'Suporte 24/7 dedicado', 'Analytics enterprise', 'SLA garantido', 'Onboarding personalizado']
        : language === 'es'
        ? ['Agentes ilimitados', 'Conversaciones ilimitadas', 'API completa + Webhooks', 'Soporte 24/7 dedicado', 'Análisis enterprise', 'SLA garantizado', 'Incorporación personalizada']
        : ['Unlimited agents', 'Unlimited conversations', 'Full API + Webhooks', 'Dedicated 24/7 support', 'Enterprise analytics', 'Guaranteed SLA', 'Custom onboarding'],
      color: 'from-blue-700 to-blue-900',
      popular: false,
    },
  ]

  const testimonials = [
    {
      name: 'Carlos Mendes',
      role: language === 'pt' ? 'CEO, TechStore Brasil' : language === 'es' ? 'CEO, TechStore Brasil' : 'CEO, TechStore Brazil',
      text: language === 'pt'
        ? 'O Zentalk.AI transformou nosso atendimento. Aumentamos as vendas em 40% no primeiro mês!'
        : language === 'es'
        ? '¡Zentalk.AI transformó nuestra atención al cliente. ¡Aumentamos las ventas en un 40% en el primer mes!'
        : 'Zentalk.AI transformed our customer service. We increased sales by 40% in the first month!',
      stars: 5,
    },
    {
      name: 'Ana Rodrigues',
      role: language === 'pt' ? 'Diretora, Moda Elegante' : language === 'es' ? 'Directora, Moda Elegante' : 'Director, Moda Elegante',
      text: language === 'pt'
        ? 'Nossos clientes adoram a rapidez das respostas. O bot funciona 24/7 sem falhas!'
        : language === 'es'
        ? '¡A nuestros clientes les encanta la rapidez de las respuestas. ¡El bot funciona 24/7 sin fallas!'
        : 'Our customers love the speed of responses. The bot works 24/7 without failures!',
      stars: 5,
    },
    {
      name: 'Pedro Alves',
      role: language === 'pt' ? 'Fundador, Delivery Express' : language === 'es' ? 'Fundador, Delivery Express' : 'Founder, Delivery Express',
      text: language === 'pt'
        ? 'Economizamos 60% nos custos de atendimento. Melhor investimento que fizemos!'
        : language === 'es'
        ? '¡Ahorramos un 60% en costos de atención al cliente. ¡La mejor inversión que hemos hecho!'
        : 'We saved 60% on customer service costs. Best investment we ever made!',
      stars: 5,
    },
  ]

  const features = [
    {
      icon: <Bot className="w-8 h-8" />,
      title: language === 'pt' ? 'IA Avançada' : language === 'es' ? 'IA Avanzada' : 'Advanced AI',
      desc: language === 'pt' ? 'Agentes inteligentes que entendem e respondem naturalmente' : language === 'es' ? 'Agentes inteligentes que entienden y responden naturalmente' : 'Intelligent agents that understand and respond naturally',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: language === 'pt' ? 'Resposta Instantânea' : language === 'es' ? 'Respuesta Instantánea' : 'Instant Response',
      desc: language === 'pt' ? 'Atendimento 24/7 sem tempo de espera para seus clientes' : language === 'es' ? 'Atención 24/7 sin tiempo de espera para sus clientes' : '24/7 service with no wait time for your customers',
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: language === 'pt' ? 'WhatsApp Nativo' : language === 'es' ? 'WhatsApp Nativo' : 'Native WhatsApp',
      desc: language === 'pt' ? 'Integração direta com WhatsApp Business API' : language === 'es' ? 'Integración directa con WhatsApp Business API' : 'Direct integration with WhatsApp Business API',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: language === 'pt' ? 'Analytics em Tempo Real' : language === 'es' ? 'Análisis en Tiempo Real' : 'Real-Time Analytics',
      desc: language === 'pt' ? 'Métricas detalhadas de performance e conversão' : language === 'es' ? 'Métricas detalladas de rendimiento y conversión' : 'Detailed performance and conversion metrics',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: language === 'pt' ? 'Multi-Agentes' : language === 'es' ? 'Multi-Agentes' : 'Multi-Agents',
      desc: language === 'pt' ? 'Gerencie múltiplos agentes para diferentes produtos' : language === 'es' ? 'Gestione múltiples agentes para diferentes productos' : 'Manage multiple agents for different products',
      color: 'bg-orange-100 text-orange-600',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: language === 'pt' ? 'Segurança Enterprise' : language === 'es' ? 'Seguridad Enterprise' : 'Enterprise Security',
      desc: language === 'pt' ? 'Dados criptografados e conformidade com LGPD' : language === 'es' ? 'Datos cifrados y cumplimiento de normativas' : 'Encrypted data and regulatory compliance',
      color: 'bg-red-100 text-red-600',
    },
  ]

  const stats = [
    { value: '10.000+', label: language === 'pt' ? 'Clientes Ativos' : language === 'es' ? 'Clientes Activos' : 'Active Clients' },
    { value: '50M+', label: language === 'pt' ? 'Mensagens/mês' : language === 'es' ? 'Mensajes/mes' : 'Messages/month' },
    { value: '99.9%', label: language === 'pt' ? 'Uptime Garantido' : language === 'es' ? 'Uptime Garantizado' : 'Guaranteed Uptime' },
    { value: '40%', label: language === 'pt' ? 'Aumento em Vendas' : language === 'es' ? 'Aumento en Ventas' : 'Sales Increase' },
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className={`text-2xl font-bold ${scrolled ? 'text-blue-600' : 'text-white'}`}>Zentalk<span className="text-blue-400">.AI</span></span>
          </div>

          {/* Menu Links (desktop) */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className={`text-sm font-medium hover:text-blue-400 transition ${scrolled ? 'text-gray-700' : 'text-white'}`}>
              {language === 'pt' ? 'Funcionalidades' : language === 'es' ? 'Funcionalidades' : 'Features'}
            </a>
            <a href="#plans" className={`text-sm font-medium hover:text-blue-400 transition ${scrolled ? 'text-gray-700' : 'text-white'}`}>
              {language === 'pt' ? 'Planos' : language === 'es' ? 'Planes' : 'Plans'}
            </a>
            <a href="#testimonials" className={`text-sm font-medium hover:text-blue-400 transition ${scrolled ? 'text-gray-700' : 'text-white'}`}>
              {language === 'pt' ? 'Depoimentos' : language === 'es' ? 'Testimonios' : 'Testimonials'}
            </a>
          </div>

          {/* Right side: Language + Login + Panels */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center gap-1">
              <Globe className={`w-4 h-4 ${scrolled ? 'text-gray-500' : 'text-white'}`} />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className={`text-sm font-medium bg-transparent border-none outline-none cursor-pointer ${scrolled ? 'text-gray-700' : 'text-white'}`}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="text-gray-900 bg-white">
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Login Button */}
            <button
              onClick={() => navigate('/login')}
              className={`hidden md:block px-4 py-2 text-sm font-medium rounded-lg border transition ${
                scrolled
                  ? 'border-blue-500 text-blue-600 hover:bg-blue-50'
                  : 'border-white text-white hover:bg-white hover:text-blue-600'
              }`}
            >
              {language === 'pt' ? 'Entrar' : language === 'es' ? 'Iniciar Sesión' : 'Login'}
            </button>

            {/* Admin Panel Button */}
            <button
              onClick={() => navigate('/login')}
              className="hidden md:flex items-center gap-1 px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow-md"
            >
              <BarChart3 className="w-4 h-4" />
              {language === 'pt' ? 'Painel Admin' : language === 'es' ? 'Panel Admin' : 'Admin Panel'}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className={`md:hidden p-2 rounded-lg ${scrolled ? 'text-gray-700' : 'text-white'}`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div className="w-5 h-0.5 bg-current mb-1"></div>
              <div className="w-5 h-0.5 bg-current mb-1"></div>
              <div className="w-5 h-0.5 bg-current"></div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t shadow-lg px-6 py-4 flex flex-col gap-4">
            <a href="#features" className="text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>
              {language === 'pt' ? 'Funcionalidades' : language === 'es' ? 'Funcionalidades' : 'Features'}
            </a>
            <a href="#plans" className="text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>
              {language === 'pt' ? 'Planos' : language === 'es' ? 'Planes' : 'Plans'}
            </a>
            <a href="#testimonials" className="text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>
              {language === 'pt' ? 'Depoimentos' : language === 'es' ? 'Testimonios' : 'Testimonials'}
            </a>
            <button onClick={() => navigate('/login')} className="w-full px-4 py-2 border border-blue-500 text-blue-600 rounded-lg font-medium">
              {language === 'pt' ? 'Entrar' : language === 'es' ? 'Iniciar Sesión' : 'Login'}
            </button>
            <button onClick={() => navigate('/login')} className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg font-medium">
              {language === 'pt' ? 'Painel Admin' : language === 'es' ? 'Panel Admin' : 'Admin Panel'}
            </button>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-blue-700 flex items-center overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-white opacity-5 rounded-full"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white opacity-5 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white opacity-3 rounded-full"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-20 text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-8 border border-white border-opacity-30">
            <Zap className="w-4 h-4 text-yellow-300" />
            {language === 'pt' ? '🚀 Novo: Integração com GPT-4o' : language === 'es' ? '🚀 Nuevo: Integración con GPT-4o' : '🚀 New: GPT-4o Integration'}
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            {language === 'pt' ? (
              <>Agentes Inteligentes,<br /><span className="text-yellow-300">Escala Infinita</span></>
            ) : language === 'es' ? (
              <>Agentes Inteligentes,<br /><span className="text-yellow-300">Escala Infinita</span></>
            ) : (
              <>Intelligent Agents,<br /><span className="text-yellow-300">Infinite Scale</span></>
            )}
          </h1>

          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto">
            {language === 'pt'
              ? 'Atendimento ao cliente com IA 24/7 que fecha vendas enquanto você dorme'
              : language === 'es'
              ? 'Atención al cliente con IA 24/7 que cierra ventas mientras duermes'
              : '24/7 AI customer service that closes sales while you sleep'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition shadow-xl text-lg flex items-center justify-center gap-2"
            >
              {language === 'pt' ? 'Comece Gratuitamente' : language === 'es' ? 'Comience Gratis' : 'Start for Free'}
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => { const el = document.getElementById('plans'); el?.scrollIntoView({ behavior: 'smooth' }) }}
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-blue-600 transition text-lg"
            >
              {language === 'pt' ? 'Ver Planos' : language === 'es' ? 'Ver Planes' : 'View Plans'}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white bg-opacity-15 backdrop-blur-sm rounded-2xl p-4 border border-white border-opacity-20">
                <div className="text-3xl font-extrabold text-white">{stat.value}</div>
                <div className="text-blue-100 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              {language === 'pt' ? 'Tudo que você precisa' : language === 'es' ? 'Todo lo que necesitas' : 'Everything you need'}
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              {language === 'pt'
                ? 'Uma plataforma completa para automatizar seu atendimento e aumentar suas vendas'
                : language === 'es'
                ? 'Una plataforma completa para automatizar su atención y aumentar sus ventas'
                : 'A complete platform to automate your service and increase your sales'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition border border-gray-100">
                <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              {language === 'pt' ? 'Como funciona' : language === 'es' ? 'Cómo funciona' : 'How it works'}
            </h2>
            <p className="text-xl text-gray-500">
              {language === 'pt' ? 'Configure seu agente em 3 passos simples' : language === 'es' ? 'Configure su agente en 3 pasos simples' : 'Set up your agent in 3 simple steps'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: language === 'pt' ? 'Crie sua conta' : language === 'es' ? 'Cree su cuenta' : 'Create your account',
                desc: language === 'pt' ? 'Cadastre-se gratuitamente e configure seu perfil em minutos' : language === 'es' ? 'Regístrese gratis y configure su perfil en minutos' : 'Sign up for free and set up your profile in minutes',
                icon: <Users className="w-8 h-8 text-blue-500" />,
              },
              {
                step: '02',
                title: language === 'pt' ? 'Configure seu agente' : language === 'es' ? 'Configure su agente' : 'Configure your agent',
                desc: language === 'pt' ? 'Personalize o comportamento, tom e respostas do seu agente de IA' : language === 'es' ? 'Personalice el comportamiento, tono y respuestas de su agente de IA' : 'Customize the behavior, tone, and responses of your AI agent',
                icon: <Bot className="w-8 h-8 text-blue-500" />,
              },
              {
                step: '03',
                title: language === 'pt' ? 'Conecte ao WhatsApp' : language === 'es' ? 'Conecte a WhatsApp' : 'Connect to WhatsApp',
                desc: language === 'pt' ? 'Integre com o WhatsApp Business e comece a atender automaticamente' : language === 'es' ? 'Integre con WhatsApp Business y comience a atender automáticamente' : 'Integrate with WhatsApp Business and start serving automatically',
                icon: <MessageSquare className="w-8 h-8 text-blue-500" />,
              },
            ].map((item, i) => (
              <div key={i} className="relative text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-6">
                  {item.icon}
                </div>
                <div className="absolute top-0 right-8 text-6xl font-extrabold text-blue-50 select-none">{item.step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANS SECTION */}
      <section id="plans" className="py-24 bg-gradient-to-br from-sky-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              {language === 'pt' ? 'Planos e Preços' : language === 'es' ? 'Planes y Precios' : 'Plans & Pricing'}
            </h2>
            <p className="text-xl text-gray-500">
              {language === 'pt' ? '7 dias grátis, sem cartão de crédito' : language === 'es' ? '7 días gratis, sin tarjeta de crédito' : '7 days free, no credit card required'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative rounded-3xl overflow-hidden shadow-lg ${plan.popular ? 'ring-4 ring-blue-500 scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white text-center text-sm font-bold py-2">
                    {language === 'pt' ? '⭐ Mais Popular' : language === 'es' ? '⭐ Más Popular' : '⭐ Most Popular'}
                  </div>
                )}
                <div className={`bg-gradient-to-br ${plan.color} p-8 text-white ${plan.popular ? 'pt-12' : ''}`}>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-blue-100 text-sm mb-4">{plan.description}</p>
                  <div className="flex items-end gap-1">
                    <span className="text-5xl font-extrabold">{plan.price}</span>
                    <span className="text-blue-200 mb-2">{plan.period}</span>
                  </div>
                </div>
                <div className="bg-white p-8">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-3 text-gray-700">
                        <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => navigate('/register')}
                    className={`w-full py-3 rounded-xl font-bold transition ${
                      plan.popular
                        ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg'
                        : 'border-2 border-blue-500 text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {language === 'pt' ? 'Começar Agora' : language === 'es' ? 'Comenzar Ahora' : 'Get Started'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              {language === 'pt' ? 'O que nossos clientes dizem' : language === 'es' ? 'Lo que dicen nuestros clientes' : 'What our customers say'}
            </h2>
            <p className="text-xl text-gray-500">
              {language === 'pt' ? 'Mais de 10.000 empresas confiam no Zentalk.AI' : language === 'es' ? 'Más de 10.000 empresas confían en Zentalk.AI' : 'Over 10,000 companies trust Zentalk.AI'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.stars }).map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 bg-gradient-to-br from-sky-400 via-blue-500 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Headphones className="w-16 h-16 mx-auto mb-6 text-blue-200" />
          <h2 className="text-4xl font-extrabold mb-4">
            {language === 'pt' ? 'Pronto para transformar seu atendimento?' : language === 'es' ? '¿Listo para transformar su atención?' : 'Ready to transform your service?'}
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            {language === 'pt' ? 'Comece gratuitamente hoje. Sem cartão de crédito.' : language === 'es' ? 'Comience gratis hoy. Sin tarjeta de crédito.' : 'Start for free today. No credit card required.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="px-10 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition shadow-xl text-lg"
            >
              {language === 'pt' ? 'Criar Conta Grátis' : language === 'es' ? 'Crear Cuenta Gratis' : 'Create Free Account'}
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-10 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-blue-600 transition text-lg"
            >
              {language === 'pt' ? 'Já tenho conta' : language === 'es' ? 'Ya tengo cuenta' : 'I already have an account'}
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-xl">Zentalk<span className="text-blue-400">.AI</span></span>
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#features" className="hover:text-white transition">
                {language === 'pt' ? 'Funcionalidades' : language === 'es' ? 'Funcionalidades' : 'Features'}
              </a>
              <a href="#plans" className="hover:text-white transition">
                {language === 'pt' ? 'Planos' : language === 'es' ? 'Planes' : 'Plans'}
              </a>
              <button onClick={() => navigate('/login')} className="hover:text-white transition">
                {language === 'pt' ? 'Entrar' : language === 'es' ? 'Iniciar Sesión' : 'Login'}
              </button>
              <button onClick={() => navigate('/register')} className="hover:text-white transition">
                {language === 'pt' ? 'Cadastrar' : language === 'es' ? 'Registrarse' : 'Sign Up'}
              </button>
            </div>
            <p className="text-sm">&copy; 2026 Zentalk.AI. {language === 'pt' ? 'Todos os direitos reservados.' : language === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
