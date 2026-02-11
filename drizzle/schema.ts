import { sqliteTable as table, text, integer } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'

// Users table
export const users = table('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  role: text('role', { enum: ['admin', 'user', 'influencer'] }).default('user'),
  status: text('status', { enum: ['active', 'inactive', 'suspended'] }).default('active'),
  emailVerified: integer('email_verified', { mode: 'boolean' }),
  verificationToken: text('verification_token'),
  resetToken: text('reset_token'),
  resetTokenExpires: integer('reset_token_expires', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
  lastSignedIn: integer('last_signed_in', { mode: 'timestamp' }),
})

// Influencers table
export const influencers = table('influencers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  referralCode: text('referral_code').notNull().unique(),
  commissionRate: integer('commission_rate').default(10),
  totalEarnings: integer('total_earnings').default(0),
  pendingEarnings: integer('pending_earnings').default(0),
  status: text('status', { enum: ['active', 'inactive', 'suspended'] }).default('active'),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
})

// Referrals table
export const referrals = table('referrals', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  influencerId: integer('influencer_id').notNull().references(() => influencers.id, { onDelete: 'cascade' }),
  referredUserId: integer('referred_user_id').references(() => users.id, { onDelete: 'set null' }),
  referralCode: text('referral_code').notNull(),
  status: text('status', { enum: ['pending', 'converted', 'rejected'] }).default('pending'),
  commissionAmount: integer('commission_amount').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  convertedAt: integer('converted_at', { mode: 'timestamp' }),
})

// Vouchers table
export const vouchers = table('vouchers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  code: text('code').notNull().unique(),
  discount: integer('discount').notNull(),
  discountType: text('discount_type', { enum: ['percentage', 'fixed'] }).default('percentage'),
  maxUses: integer('max_uses'),
  currentUses: integer('current_uses').default(0),
  expiresAt: integer('expires_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
})

// Clients table
export const clients = table('clients', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  companyName: text('company_name'),
  plan: text('plan', { enum: ['free', 'starter', 'professional', 'enterprise'] }).default('free'),
  status: text('status', { enum: ['active', 'inactive', 'suspended', 'trial_expired'] }).default('active'),
  trialStartedAt: integer('trial_started_at', { mode: 'timestamp' }),
  trialEndsAt: integer('trial_ends_at', { mode: 'timestamp' }),
  subscriptionStartedAt: integer('subscription_started_at', { mode: 'timestamp' }),
  subscriptionEndsAt: integer('subscription_ends_at', { mode: 'timestamp' }),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
})

// Agents table
export const agents = table('agents', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  clientId: integer('client_id').notNull().references(() => clients.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  type: text('type').notNull(),
  status: text('status', { enum: ['online', 'offline'] }).default('offline'),
  conversations: integer('conversations').default(0),
  lastActive: integer('last_active', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }),
})

// WhatsApp Accounts table
export const whatsappAccounts = table('whatsapp_accounts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  clientId: integer('client_id').notNull().references(() => clients.id, { onDelete: 'cascade' }),
  phoneNumber: text('phone_number').notNull(),
  businessAccountId: text('business_account_id').notNull(),
  accessToken: text('access_token').notNull(),
  webhookToken: text('webhook_token').notNull(),
  status: text('status', { enum: ['active', 'inactive', 'suspended'] }).default('active'),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
})

// WhatsApp Conversations table
export const whatsappConversations = table('whatsapp_conversations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  whatsappAccountId: integer('whatsapp_account_id').notNull().references(() => whatsappAccounts.id, { onDelete: 'cascade' }),
  agentId: integer('agent_id').notNull().references(() => agents.id, { onDelete: 'cascade' }),
  contactPhoneNumber: text('contact_phone_number').notNull(),
  contactName: text('contact_name'),
  status: text('status', { enum: ['active', 'closed', 'archived'] }).default('active'),
  messageCount: integer('message_count').default(0),
  lastMessageAt: integer('last_message_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
})

// WhatsApp Messages table
export const whatsappMessages = table('whatsapp_messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  conversationId: integer('conversation_id').notNull().references(() => whatsappConversations.id, { onDelete: 'cascade' }),
  messageId: text('message_id').notNull().unique(),
  sender: text('sender', { enum: ['user', 'agent'] }).notNull(),
  content: text('content').notNull(),
  messageType: text('message_type', { enum: ['text', 'image', 'document', 'audio', 'video'] }).default('text'),
  status: text('status', { enum: ['sent', 'delivered', 'read', 'failed'] }).default('sent'),
  createdAt: integer('created_at', { mode: 'timestamp' }),
})

// WhatsApp Webhooks table (for logging)
export const whatsappWebhooks = table('whatsapp_webhooks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  whatsappAccountId: integer('whatsapp_account_id').notNull().references(() => whatsappAccounts.id, { onDelete: 'cascade' }),
  eventType: text('event_type').notNull(),
  payload: text('payload').notNull(),
  status: text('status', { enum: ['processed', 'failed', 'pending'] }).default('pending'),
  createdAt: integer('created_at', { mode: 'timestamp' }),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  influencers: many(influencers),
  clients: many(clients),
}))

export const influencersRelations = relations(influencers, ({ one, many }) => ({
  user: one(users, { fields: [influencers.userId], references: [users.id] }),
  referrals: many(referrals),
}))

export const referralsRelations = relations(referrals, ({ one }) => ({
  influencer: one(influencers, { fields: [referrals.influencerId], references: [influencers.id] }),
  referredUser: one(users, { fields: [referrals.referredUserId], references: [users.id] }),
}))

export const clientsRelations = relations(clients, ({ one, many }) => ({
  user: one(users, { fields: [clients.userId], references: [users.id] }),
  agents: many(agents),
  whatsappAccounts: many(whatsappAccounts),
}))

export const agentsRelations = relations(agents, ({ one, many }) => ({
  client: one(clients, { fields: [agents.clientId], references: [clients.id] }),
  whatsappConversations: many(whatsappConversations),
}))

export const whatsappAccountsRelations = relations(whatsappAccounts, ({ one, many }) => ({
  client: one(clients, { fields: [whatsappAccounts.clientId], references: [clients.id] }),
  conversations: many(whatsappConversations),
  webhooks: many(whatsappWebhooks),
}))

export const whatsappConversationsRelations = relations(whatsappConversations, ({ one, many }) => ({
  whatsappAccount: one(whatsappAccounts, { fields: [whatsappConversations.whatsappAccountId], references: [whatsappAccounts.id] }),
  agent: one(agents, { fields: [whatsappConversations.agentId], references: [agents.id] }),
  messages: many(whatsappMessages),
}))

export const whatsappMessagesRelations = relations(whatsappMessages, ({ one }) => ({
  conversation: one(whatsappConversations, { fields: [whatsappMessages.conversationId], references: [whatsappConversations.id] }),
}))

export const whatsappWebhooksRelations = relations(whatsappWebhooks, ({ one }) => ({
  whatsappAccount: one(whatsappAccounts, { fields: [whatsappWebhooks.whatsappAccountId], references: [whatsappAccounts.id] }),
}))
