import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, Minimize2, AlertCircle } from 'lucide-react'

interface Message {
  id: number
  from: 'bot' | 'user'
  text: string
  time: string
}

interface ApiMessage {
  role: 'user' | 'assistant'
  content: string
}

const now = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

const QUICK_QUESTIONS = [
  'Como funciona a Zentalk.AI?',
  'Quais são os planos e preços?',
  'Como integrar com WhatsApp?',
  'Tem teste grátis?',
]

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [error, setError] = useState(false)
  const [history, setHistory] = useState<ApiMessage[]>([])
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      from: 'bot',
      text: 'Olá! 👋 Sou o assistente virtual da Zentalk.AI. Posso te ajudar com informações sobre nossa plataforma, planos, integrações e muito mais. Como posso te ajudar hoje?',
      time: now(),
    },
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && !minimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [messages, open, minimized])

  const sendMessage = async (text: string) => {
    if (!text.trim() || typing) return

    const userMsg: Message = { id: Date.now(), from: 'user', text: text.trim(), time: now() }
    const newHistory: ApiMessage[] = [...history, { role: 'user', content: text.trim() }]

    setMessages(prev => [...prev, userMsg])
    setHistory(newHistory)
    setInput('')
    setTyping(true)
    setError(false)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newHistory }),
      })

      const data = await response.json()
      const replyText = data.reply || 'Desculpe, não consegui processar sua mensagem.'

      const botMsg: Message = { id: Date.now() + 1, from: 'bot', text: replyText, time: now() }
      setMessages(prev => [...prev, botMsg])
      setHistory(prev => [...prev, { role: 'assistant', content: replyText }])
    } catch {
      setError(true)
      const errMsg: Message = {
        id: Date.now() + 1,
        from: 'bot',
        text: 'Desculpe, estou com dificuldades técnicas no momento. Tente novamente em instantes.',
        time: now(),
      }
      setMessages(prev => [...prev, errMsg])
    } finally {
      setTyping(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => { setOpen(true); setMinimized(false) }}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          aria-label="Abrir chat"
        >
          <MessageCircle className="w-7 h-7" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div
          className={`fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ${minimized ? 'h-14' : 'h-[500px]'}`}
          style={{ maxHeight: 'calc(100vh - 48px)' }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl flex-shrink-0">
            <div className="relative">
              <div className="w-9 h-9 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm leading-tight">Zentalk.AI — Assistente</p>
              <p className="text-blue-200 text-xs">Powered by IA · Online agora</p>
            </div>
            <button onClick={() => setMinimized(!minimized)} className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-lg transition text-white" title="Minimizar">
              <Minimize2 className="w-4 h-4" />
            </button>
            <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-lg transition text-white" title="Fechar">
              <X className="w-4 h-4" />
            </button>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.from === 'bot' && (
                      <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                        <Bot className="w-4 h-4 text-blue-600" />
                      </div>
                    )}
                    <div className={`max-w-[78%] flex flex-col gap-1 ${msg.from === 'user' ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                          msg.from === 'user'
                            ? 'bg-blue-600 text-white rounded-br-sm'
                            : 'bg-white text-gray-800 shadow-sm rounded-bl-sm'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-xs text-gray-400 px-1">{msg.time}</span>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {typing && (
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="bg-white px-4 py-2.5 rounded-2xl rounded-bl-sm shadow-sm flex gap-1 items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}

                {/* Error banner */}
                {error && (
                  <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    Problema de conexão. Tente novamente.
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions — shown only at the start */}
              {messages.length <= 1 && (
                <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 flex gap-2 overflow-x-auto flex-shrink-0 scrollbar-none">
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="flex-shrink-0 text-xs px-3 py-1.5 bg-white border border-blue-200 text-blue-600 rounded-full hover:bg-blue-50 transition whitespace-nowrap"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="p-3 border-t border-gray-100 bg-white rounded-b-2xl flex-shrink-0">
                <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Digite sua mensagem..."
                    disabled={typing}
                    className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none disabled:opacity-50"
                  />
                  <button
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim() || typing}
                    className="w-8 h-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg flex items-center justify-center transition flex-shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-center text-xs text-gray-400 mt-2">Assistente de IA · Não compartilhamos dados pessoais</p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
