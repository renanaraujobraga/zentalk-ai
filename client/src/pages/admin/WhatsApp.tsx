import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { Plus, MessageCircle, Trash2, Eye, X, Send } from 'lucide-react'
import { whatsappApi } from '../../lib/api'

interface WhatsAppAccount {
  id: number
  phoneNumber: string
  businessAccountId: string
  status: string
  createdAt: string
}

interface Conversation {
  id: number
  contactPhoneNumber: string
  contactName: string
  status: string
  messageCount: number
  lastMessageAt: string
}

interface Message {
  id: number
  sender: string
  content: string
  createdAt: string
}

export default function AdminWhatsApp() {
  const [accounts, setAccounts] = useState<WhatsAppAccount[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAccountForm, setShowAccountForm] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null)
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [formData, setFormData] = useState({
    phoneNumber: '',
    businessAccountId: '',
    accessToken: '',
  })

  const clientId = 1 // Usar cliente padrão por enquanto

  // Fetch accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true)
        const data = await whatsappApi.getAccounts(clientId)
        setAccounts(data.accounts || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load accounts')
      } finally {
        setLoading(false)
      }
    }

    fetchAccounts()
  }, [])

  // Fetch conversations when account is selected
  useEffect(() => {
    if (!selectedAccount) return

    const fetchConversations = async () => {
      try {
        const data = await whatsappApi.getConversations(selectedAccount)
        setConversations(data.conversations || [])
      } catch (err) {
        console.error('Error fetching conversations:', err)
      }
    }

    fetchConversations()
  }, [selectedAccount])

  // Fetch messages when conversation is selected
  useEffect(() => {
    if (!selectedConversation) return

    const fetchMessages = async () => {
      try {
        const data = await whatsappApi.getMessages(selectedConversation)
        setMessages(data.messages || [])
      } catch (err) {
        console.error('Error fetching messages:', err)
      }
    }

    fetchMessages()
  }, [selectedConversation])

  // Handle create account
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await whatsappApi.createAccount(clientId, {
        phoneNumber: formData.phoneNumber,
        businessAccountId: formData.businessAccountId,
        accessToken: formData.accessToken,
      })
      setFormData({ phoneNumber: '', businessAccountId: '', accessToken: '' })
      setShowAccountForm(false)
      // Refresh accounts
      const data = await whatsappApi.getAccounts(clientId)
      setAccounts(data.accounts || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account')
    }
  }

  // Handle send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedConversation || !newMessage.trim()) return

    try {
      await whatsappApi.sendMessage(selectedConversation, newMessage)
      setNewMessage('')
      // Refresh messages
      const data = await whatsappApi.getMessages(selectedConversation)
      setMessages(data.messages || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message')
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-gray-500">Loading...</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">WhatsApp Integration</h1>
            <p className="text-gray-600 mt-2">Manage WhatsApp accounts and conversations.</p>
          </div>
          <button
            onClick={() => setShowAccountForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus size={20} /> Add Account
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          {/* Accounts List */}
          <div className="col-span-1 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Accounts</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {accounts.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No accounts connected
                </div>
              ) : (
                accounts.map((account) => (
                  <button
                    key={account.id}
                    onClick={() => {
                      setSelectedAccount(account.id)
                      setSelectedConversation(null)
                    }}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition ${
                      selectedAccount === account.id ? 'bg-green-50 border-l-4 border-green-600' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MessageCircle size={18} className="text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900">{account.phoneNumber}</p>
                        <p className="text-sm text-gray-500">{account.status}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Conversations List */}
          <div className="col-span-1 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
            </div>
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {!selectedAccount ? (
                <div className="p-6 text-center text-gray-500">
                  Select an account
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No conversations
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition ${
                      selectedConversation === conv.id ? 'bg-green-50 border-l-4 border-green-600' : ''
                    }`}
                  >
                    <p className="font-medium text-gray-900">{conv.contactName}</p>
                    <p className="text-sm text-gray-500">{conv.contactPhoneNumber}</p>
                    <p className="text-xs text-gray-400 mt-1">{conv.messageCount} messages</p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="col-span-1 bg-white rounded-lg shadow flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {!selectedConversation ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Select a conversation
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No messages
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-lg ${
                      msg.sender === 'agent'
                        ? 'bg-green-100 text-green-900 ml-4'
                        : 'bg-gray-100 text-gray-900 mr-4'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                ))
              )}
            </div>

            {selectedConversation && (
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Add Account Modal */}
        {showAccountForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add WhatsApp Account</h2>
                <button
                  onClick={() => setShowAccountForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleCreateAccount} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="+55 11 99999-9999"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Business Account ID</label>
                  <input
                    type="text"
                    required
                    value={formData.businessAccountId}
                    onChange={(e) => setFormData({ ...formData, businessAccountId: e.target.value })}
                    placeholder="Your Business Account ID"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Access Token</label>
                  <input
                    type="password"
                    required
                    value={formData.accessToken}
                    onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
                    placeholder="Your WhatsApp Access Token"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Connect Account
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAccountForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
