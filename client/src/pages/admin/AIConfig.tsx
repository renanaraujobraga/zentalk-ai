import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { Bot, Key, Save, Eye, EyeOff, CheckCircle, AlertCircle, ExternalLink, RefreshCw, ToggleLeft, ToggleRight } from 'lucide-react'

interface AIConfig {
  provider: string
  model: string
  baseUrl: string
  systemPrompt: string
  enabled: boolean
  hasApiKey: boolean
}

const PROVIDERS = [
  {
    id: 'openai',
    name: 'OpenAI',
    logo: '🟢',
    description: 'GPT-4o, GPT-4o-mini, GPT-4-turbo',
    defaultModel: 'gpt-4o-mini',
    defaultUrl: 'https://api.openai.com/v1',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    docsUrl: 'https://platform.openai.com/api-keys',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    logo: '🔵',
    description: 'Gemini 2.0 Flash, Gemini 1.5 Pro',
    defaultModel: 'gemini-2.0-flash',
    defaultUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    models: ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'],
    docsUrl: 'https://aistudio.google.com/app/apikey',
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    logo: '🟠',
    description: 'Claude 3.5 Sonnet, Claude 3 Haiku',
    defaultModel: 'claude-3-haiku-20240307',
    defaultUrl: 'https://api.anthropic.com/v1',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307', 'claude-3-opus-20240229'],
    docsUrl: 'https://console.anthropic.com/settings/keys',
  },
  {
    id: 'manus',
    name: 'Manus AI',
    logo: '🤖',
    description: 'gpt-4.1-mini, gpt-4.1-nano, gemini-2.5-flash',
    defaultModel: 'gpt-4.1-mini',
    defaultUrl: 'https://api.manus.im/api/llm-proxy/v1',
    models: ['gpt-4.1-mini', 'gpt-4.1-nano', 'gemini-2.5-flash'],
    docsUrl: 'https://manus.im',
  },
  {
    id: 'custom',
    name: 'Personalizado',
    logo: '⚙️',
    description: 'Qualquer API compatível com OpenAI',
    defaultModel: 'gpt-4o-mini',
    defaultUrl: '',
    models: [],
    docsUrl: '',
  },
]

export default function AdminAIConfig() {
  const [config, setConfig] = useState<AIConfig>({
    provider: 'openai',
    model: 'gpt-4o-mini',
    baseUrl: '',
    systemPrompt: '',
    enabled: true,
    hasApiKey: false,
  })
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error' | 'testing'>('idle')
  const [testMessage, setTestMessage] = useState('')

  const selectedProvider = PROVIDERS.find(p => p.id === config.provider) || PROVIDERS[0]

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/chat/config')
        const data = await res.json()
        setConfig(data)
      } catch {
        // use defaults
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleProviderChange = (providerId: string) => {
    const p = PROVIDERS.find(pr => pr.id === providerId)!
    setConfig(prev => ({
      ...prev,
      provider: providerId,
      model: p.defaultModel,
      baseUrl: p.defaultUrl,
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveStatus('idle')
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/chat/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          provider: config.provider,
          apiKey: apiKey || undefined,
          model: config.model,
          baseUrl: config.baseUrl,
          systemPrompt: config.systemPrompt,
          enabled: config.enabled,
        }),
      })
      if (res.ok) {
        setSaveStatus('success')
        if (apiKey) {
          setConfig(prev => ({ ...prev, hasApiKey: true }))
          setApiKey('')
        }
        setTimeout(() => setSaveStatus('idle'), 3000)
      } else {
        setSaveStatus('error')
      }
    } catch {
      setSaveStatus('error')
    } finally {
      setSaving(false)
    }
  }

  const handleTest = async () => {
    setTesting(true)
    setTestStatus('testing')
    setTestMessage('')
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: 'Olá! Faça um teste rápido respondendo em uma frase o que é a Zentalk.AI.' }] }),
      })
      const data = await res.json()
      if (data.reply && !data.reply.includes('dificuldades técnicas') && !data.reply.includes('não foi configurado')) {
        setTestStatus('success')
        setTestMessage(data.reply)
      } else {
        setTestStatus('error')
        setTestMessage(data.reply || 'Erro desconhecido')
      }
    } catch {
      setTestStatus('error')
      setTestMessage('Erro de conexão com o servidor')
    } finally {
      setTesting(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout currentPage="ai-config">
        <div className="p-6 flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout currentPage="ai-config">
      <div className="p-6 bg-gray-50 min-h-full">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configuração do Chat IA</h1>
            <p className="text-gray-500 mt-1">Configure o provedor de IA para o chat de atendimento da landing page</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleTest}
              disabled={testing || !config.hasApiKey}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition disabled:opacity-40"
            >
              <RefreshCw className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
              Testar Conexão
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Salvando...' : 'Salvar Configurações'}
            </button>
          </div>
        </div>

        {/* Save status banners */}
        {saveStatus === 'success' && (
          <div className="mb-4 flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            Configurações salvas com sucesso!
          </div>
        )}
        {saveStatus === 'error' && (
          <div className="mb-4 flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            Erro ao salvar. Verifique sua conexão e tente novamente.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Enable/Disable toggle */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Bot className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Chat de Atendimento</p>
                    <p className="text-sm text-gray-500">Ativar ou desativar o widget de chat na landing page</p>
                  </div>
                </div>
                <button
                  onClick={() => setConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                    config.enabled
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {config.enabled ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  {config.enabled ? 'Ativado' : 'Desativado'}
                </button>
              </div>
            </div>

            {/* Provider Selection */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Provedor de IA</h2>
              <div className="grid grid-cols-2 gap-3">
                {PROVIDERS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleProviderChange(p.id)}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition ${
                      config.provider === p.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-2xl flex-shrink-0">{p.logo}</span>
                    <div className="min-w-0">
                      <p className={`font-semibold text-sm ${config.provider === p.id ? 'text-blue-700' : 'text-gray-900'}`}>{p.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{p.description}</p>
                    </div>
                  </button>
                ))}
              </div>
              {selectedProvider.docsUrl && (
                <a
                  href={selectedProvider.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {selectedProvider.id === 'manus'
                    ? 'Saiba mais sobre o Manus AI'
                    : `Obter chave de API — ${selectedProvider.name}`}
                </a>
              )}
            </div>

            {/* API Key */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-1">Chave de API</h2>
              <p className="text-sm text-gray-500 mb-4">
                {config.hasApiKey
                  ? 'Uma chave já está configurada. Preencha abaixo apenas para substituí-la.'
                  : 'Insira a chave de API do provedor selecionado.'}
              </p>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Key className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder={config.hasApiKey ? '••••••••••••••••••••••••••••••••' : 'Cole sua chave de API aqui...'}
                  className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {config.hasApiKey && !apiKey && (
                <p className="mt-2 text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Chave configurada e ativa
                </p>
              )}
            </div>

            {/* Model + Base URL */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Modelo e Endpoint</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Modelo</label>
                  {selectedProvider.models.length > 0 ? (
                    <select
                      value={config.model || selectedProvider.defaultModel}
                      onChange={e => setConfig(prev => ({ ...prev, model: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {selectedProvider.models.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={config.model || ''}
                      onChange={e => setConfig(prev => ({ ...prev, model: e.target.value }))}
                      placeholder="ex: gpt-4o-mini"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Base URL
                    <span className="ml-1 text-xs text-gray-400 font-normal">(deixe em branco para usar o padrão do provedor)</span>
                  </label>
                  <input
                    type="text"
                    value={config.baseUrl || ''}
                    onChange={e => setConfig(prev => ({ ...prev, baseUrl: e.target.value }))}
                    placeholder={selectedProvider.defaultUrl || 'https://api.exemplo.com/v1'}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Test Result */}
            {testStatus !== 'idle' && (
              <div className={`rounded-xl p-4 border ${
                testStatus === 'success' ? 'bg-green-50 border-green-200' :
                testStatus === 'error' ? 'bg-red-50 border-red-200' :
                'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {testStatus === 'testing' && <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />}
                  {testStatus === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
                  {testStatus === 'error' && <AlertCircle className="w-4 h-4 text-red-600" />}
                  <span className={`text-sm font-semibold ${
                    testStatus === 'success' ? 'text-green-700' :
                    testStatus === 'error' ? 'text-red-700' : 'text-blue-700'
                  }`}>
                    {testStatus === 'testing' ? 'Testando...' : testStatus === 'success' ? 'Conexão OK!' : 'Falha na conexão'}
                  </span>
                </div>
                {testMessage && (
                  <p className="text-xs text-gray-600 leading-relaxed">{testMessage}</p>
                )}
              </div>
            )}

            {/* System Prompt */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-1">System Prompt</h2>
              <p className="text-xs text-gray-500 mb-3">Instruções de comportamento para o assistente. Deixe em branco para usar o prompt padrão da Zentalk.AI.</p>
              <textarea
                value={config.systemPrompt || ''}
                onChange={e => setConfig(prev => ({ ...prev, systemPrompt: e.target.value }))}
                placeholder="Deixe em branco para usar o prompt padrão da Zentalk.AI..."
                rows={14}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed"
              />
              <button
                onClick={() => setConfig(prev => ({ ...prev, systemPrompt: '' }))}
                className="mt-2 text-xs text-gray-400 hover:text-gray-600 transition"
              >
                Restaurar prompt padrão
              </button>
            </div>

            {/* Info card */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-xs font-semibold text-blue-800 mb-2">Como funciona</p>
              <ul className="text-xs text-blue-700 space-y-1.5">
                <li>• As configurações são salvas no banco de dados</li>
                <li>• O chat da landing page usa automaticamente o provedor configurado</li>
                <li>• A chave de API é armazenada de forma segura e nunca exposta ao frontend</li>
                <li>• Use "Testar Conexão" para verificar se a integração está funcionando</li>
                <li>• O sistema é compatível com qualquer API no formato OpenAI</li>
              </ul>
            </div>

            {/* Manus info card */}
            {config.provider === 'manus' && (
              <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                <p className="text-xs font-semibold text-purple-800 mb-2">🤖 Sobre o Manus AI</p>
                <ul className="text-xs text-purple-700 space-y-1.5">
                  <li>• Endpoint: <span className="font-mono">api.manus.im/api/llm-proxy/v1</span></li>
                  <li>• Modelos disponíveis: gpt-4.1-mini, gpt-4.1-nano, gemini-2.5-flash</li>
                  <li>• API compatível com o formato OpenAI</li>
                  <li>• Insira sua chave de acesso Manus no campo "Chave de API"</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
