import { db } from '../db'
import { clients } from '../../drizzle/schema'
import { eq } from 'drizzle-orm'

const TRIAL_DAYS = 7

export async function createTrialSubscription(userId: number, companyName: string) {
  const now = new Date()
  const trialEndsAt = new Date(now.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000)

  const result = await db
    .insert(clients)
    .values({
      userId,
      companyName,
      plan: 'free',
      status: 'active',
      trialStartedAt: now,
      trialEndsAt,
      createdAt: now,
      updatedAt: now,
    })
    .returning()

  return result[0]
}

export async function checkTrialStatus(clientId: number) {
  const client = await db.query.clients.findFirst({
    where: eq(clients.id, clientId),
  })

  if (!client) return null

  const now = new Date()
  const isTrialExpired = client.trialEndsAt && new Date(client.trialEndsAt) < now

  if (isTrialExpired && client.plan === 'free') {
    // Atualizar status para trial_expired
    await db
      .update(clients)
      .set({ status: 'trial_expired', updatedAt: now })
      .where(eq(clients.id, clientId))

    return {
      ...client,
      status: 'trial_expired',
      isTrialExpired: true,
      daysRemaining: 0,
    }
  }

  const daysRemaining = client.trialEndsAt
    ? Math.ceil((new Date(client.trialEndsAt).getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
    : 0

  return {
    ...client,
    isTrialExpired: false,
    daysRemaining: Math.max(0, daysRemaining),
  }
}

export async function activateSubscription(
  clientId: number,
  plan: 'starter' | 'professional' | 'enterprise',
  stripeCustomerId: string,
  stripeSubscriptionId: string
) {
  const now = new Date()
  const subscriptionEndsAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days

  const result = await db
    .update(clients)
    .set({
      plan,
      status: 'active',
      subscriptionStartedAt: now,
      subscriptionEndsAt,
      stripeCustomerId,
      stripeSubscriptionId,
      updatedAt: now,
    })
    .where(eq(clients.id, clientId))
    .returning()

  return result[0]
}

export async function isClientActive(clientId: number): Promise<boolean> {
  const client = await db.query.clients.findFirst({
    where: eq(clients.id, clientId),
  })

  if (!client) return false

  // Se está em trial, verificar se ainda está válido
  if (client.plan === 'free' && client.trialEndsAt) {
    const now = new Date()
    return new Date(client.trialEndsAt) > now
  }

  // Se tem subscription, verificar se ainda está válida
  if (client.subscriptionEndsAt) {
    const now = new Date()
    return new Date(client.subscriptionEndsAt) > now
  }

  return client.status === 'active'
}
